import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createStore, COPY_FIELDS } from './content-store.mjs';
import { ROOT, REPOSITORY, SITE_URL, command, github, publishedState, publishSite } from './publish.mjs';

export async function startConsole({ root = ROOT, port = 7863, publish = publishSite, releaseState = publishedState } = {}) {
  const store = createStore(root);
  const token = crypto.randomBytes(32).toString('hex');
  let origin;
  let busy = false;
  let publication = { status: 'idle', messages: [] };
  let deploymentCache = { time: 0, value: null };
  const equal = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value) && crypto.timingSafeEqual(Buffer.from(value), Buffer.from(token));
  const json = (response, code, value) => { response.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' }); response.end(JSON.stringify(value)); };

  async function body(request, limit) {
    const chunks = [];
    let size = 0;
    for await (const chunk of request) {
      size += chunk.length;
      if (size > limit) throw new Error('上传内容超过大小限制。');
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }

  const server = http.createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('X-Frame-Options', 'SAMEORIGIN');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self' https: blob:; connect-src 'self'; frame-src 'self'; base-uri 'none'; frame-ancestors 'self'; form-action 'self'");
    try {
      if (request.headers.host !== new URL(origin).host) return json(response, 403, { error: '仅允许本机访问。' });
      const url = new URL(request.url, origin);
      if (['/console/', '/'].includes(url.pathname) && equal(url.searchParams.get('unlock'))) {
        response.writeHead(303, { 'Set-Cookie': `livetts_console=${token}; HttpOnly; SameSite=Strict; Path=/`, Location: url.pathname === '/' ? '/?edit=1' : '/console/' });
        return response.end();
      }
      const cookie = request.headers.cookie?.split(';').map(item => item.trim()).find(item => item.startsWith('livetts_console='))?.slice('livetts_console='.length);
      const authenticated = equal(cookie);
      if (url.searchParams.get('edit') === '1' && !authenticated) return json(response, 401, { error: '请通过“启动页面编辑.command”打开本地编辑页面。' });
      if ((url.pathname.startsWith('/api/') || url.pathname.startsWith('/console')) && !authenticated) return json(response, 401, { error: '请通过“启动控制台.command”打开管理页面。' });
      if (url.pathname.startsWith('/api/')) {
        if (request.method === 'GET' && url.pathname === '/api/state') return json(response, 200, { ...await store.state(), publication: await releaseState(), repository: REPOSITORY, siteUrl: SITE_URL, copyFields: COPY_FIELDS });
        if (request.method === 'GET' && url.pathname === '/api/publication') return json(response, 200, publication);
        if (request.method === 'GET' && url.pathname === '/api/deployment') {
          if (Date.now() - deploymentCache.time > 10000) {
            const release = await releaseState();
            const result = await github('/actions/workflows/livetts-pages.yml/runs?per_page=10');
            const run = result.workflow_runs.find(item => item.head_sha === release?.sha);
            deploymentCache = { time: Date.now(), value: { sha: release?.sha, status: run?.status || 'queued', conclusion: run?.conclusion || null, url: run?.html_url, siteUrl: SITE_URL } };
          }
          return json(response, 200, deploymentCache.value);
        }
        if (request.method !== 'POST') return json(response, 405, { error: '不支持的操作。' });
        if (request.headers.origin !== origin || request.headers['sec-fetch-site'] === 'cross-site') return json(response, 403, { error: '拒绝跨站写入。' });
        if (busy) return json(response, 409, { error: '正在保存或发布，请稍后。' });
        if (url.pathname === '/api/upload') {
          if (request.headers['content-type'] !== 'audio/wav') return json(response, 415, { error: '仅接受 WAV 音频。' });
          const result = await store.upload(await body(request, 45 * 1024 * 1024));
          return json(response, 200, result);
        }
        if (!request.headers['content-type']?.startsWith('application/json')) return json(response, 415, { error: '请求必须为 JSON。' });
        const payload = JSON.parse((await body(request, 2 * 1024 * 1024)).toString());
        busy = true;
        try {
          if (url.pathname === '/api/save') return json(response, 200, await store.save(payload));
          if (url.pathname === '/api/restore') return json(response, 200, await store.restore(payload.revision));
          if (url.pathname === '/api/publish') {
            if (payload.confirm !== true || payload.revision !== (await store.state()).revision) throw new Error('请先保存当前修改，再确认发布。');
            const release = await releaseState();
            if (!release?.sha) throw new Error('未记录已核对的 GitHub 版本，请先初始化发布记录。');
            publication = { status: 'uploading', messages: ['正在校验发布文件…'], startedAt: new Date().toISOString() };
            publish(release.sha, message => { publication.messages.push(message); }).then(result => {
              publication = { ...publication, status: 'submitted', result };
              deploymentCache.time = 0;
            }).catch(error => { publication = { ...publication, status: 'failed', error: error.message }; }).finally(() => { busy = false; });
            return json(response, 202, publication);
          }
          return json(response, 404, { error: '接口不存在。' });
        } finally { if (publication.status !== 'uploading') busy = false; }
      }
      if (!['GET', 'HEAD'].includes(request.method)) return json(response, 405, { error: '只读资源。' });
      const decoded = decodeURIComponent(url.pathname);
      if (decoded.includes('\\') || decoded.includes('\0') || decoded.split('/').some(part => part === '..' || part.startsWith('.'))) return json(response, 404, { error: '资源不存在。' });
      let relative = decoded === '/' ? 'index.html' : decoded === '/console/' ? 'console/index.html' : decoded.slice(1);
      if (!['index.html', 'data.js', 'site.config.js', 'MODEL_CARD.md', 'README.md'].includes(relative) && !relative.startsWith('assets/') && !relative.startsWith('console/')) return json(response, 404, { error: '资源不存在。' });
      let filename = path.resolve(root, relative);
      if (!filename.startsWith(root + path.sep)) return json(response, 404, { error: '资源不存在。' });
      try { if (await fs.realpath(filename) !== filename) return json(response, 404, { error: '资源不存在。' }); }
      catch (error) {
        if (error.code !== 'ENOENT' || !authenticated || !relative.startsWith('assets/audio/uploads/')) throw error;
        filename = await store.mediaFile('./' + relative, true);
      }
      let content = await fs.readFile(filename);
      if (relative === 'index.html' && authenticated && url.searchParams.get('edit') === '1') {
        content = Buffer.from(content.toString().replace('</head>', '<link rel="stylesheet" href="/console/inline-editor.css"><script src="/console/inline-editor.js" defer></script></head>'));
      }
      const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.flac': 'audio/flac', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8', '.md': 'text/plain; charset=utf-8' }[path.extname(filename)] || 'application/octet-stream';
      response.setHeader('Content-Type', mime);
      response.setHeader('Accept-Ranges', 'bytes');
      const range = request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
      if (range) {
        const start = Number(range[1]);
        const end = Math.min(range[2] ? Number(range[2]) : content.length - 1, content.length - 1);
        if (start > end || start >= content.length) { response.writeHead(416, { 'Content-Range': `bytes */${content.length}` }); return response.end(); }
        response.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${content.length}`, 'Content-Length': end - start + 1 });
        return response.end(request.method === 'HEAD' ? undefined : content.subarray(start, end + 1));
      }
      response.writeHead(200, { 'Content-Length': content.length });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch (error) { if (!response.headersSent) json(response, error.code === 'ENOENT' ? 404 : 400, { error: error.message }); else response.end(); }
  });
  server.requestTimeout = 120000;
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', resolve); });
  origin = `http://127.0.0.1:${server.address().port}`;
  return { server, origin, launchUrl: `${origin}/console/?unlock=${token}`, editUrl: `${origin}/?edit=1&unlock=${token}` };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const app = await startConsole();
    const launchFile = path.join(ROOT, '.generation/console/launch.json');
    await fs.mkdir(path.dirname(launchFile), { recursive: true, mode: 0o700 });
    await fs.writeFile(launchFile, JSON.stringify({ url: app.launchUrl, editUrl: app.editUrl, pid: process.pid }), { mode: 0o600 });
    console.log(`LiveTTS 控制台已启动：${app.origin}/console/\n仅限本机；按 Ctrl+C 关闭。`);
    if (process.argv.includes('--open')) await command('open', [process.argv.includes('--edit') ? app.editUrl : app.launchUrl]);
  } catch (error) {
    if (error.code === 'EADDRINUSE' && process.argv.includes('--open')) {
      try {
        const launch = JSON.parse(await fs.readFile(path.join(ROOT, '.generation/console/launch.json'), 'utf8'));
        const url = new URL(launch.url);
        const unlock = url.searchParams.get('unlock');
        if (url.origin !== 'http://127.0.0.1:7863' || url.pathname !== '/console/' || !/^[a-f0-9]{64}$/.test(unlock || '')) throw new Error('无效的启动记录。');
        const response = await fetch(url.origin + '/api/state', { headers: { Cookie: `livetts_console=${unlock}` }, signal: AbortSignal.timeout(3000) });
        if (!response.ok || (await response.json()).repository !== REPOSITORY) throw new Error('未找到本项目的控制台。');
        const destination = new URL(launch.url);
        if (process.argv.includes('--edit')) { destination.pathname = '/'; destination.searchParams.set('edit', '1'); }
        await command('open', [destination.href]);
        console.log('已重新打开正在运行的 LiveTTS 控制台。');
      } catch { console.error('7863 端口已被占用，请关闭旧控制台进程后重试。'); process.exitCode = 1; }
    } else { console.error(error.message); process.exitCode = 1; }
  }
}
