import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const REPOSITORY = 'Enzo-coder-debug/LiveTTS';
export const SITE_URL = 'https://enzo-coder-debug.github.io/LiveTTS/';
const PREFIX = 'livetts-github/';
const hash = content => crypto.createHash('sha1').update(`blob ${content.length}\0`).update(content).digest('hex');

export function command(binary, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, { cwd: ROOT, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve(stdout) : reject(new Error(stderr.trim() || `${binary} exited with ${code}`)));
    child.stdin.on('error', () => {});
    child.stdin.end(input);
  });
}

export async function github(endpoint, payload, method = 'POST') {
  const args = ['api', `repos/${REPOSITORY}${endpoint}`];
  if (payload !== undefined) args.push('--method', method, '--input', '-');
  return JSON.parse(await command('gh', args, payload === undefined ? undefined : JSON.stringify(payload)));
}

export async function publishedState() {
  try { return JSON.parse(await fs.readFile(path.join(ROOT, '.generation/published.json'), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

export async function publicationFiles() {
  const files = new Map();
  async function add(relative) {
    const absolute = path.join(ROOT, relative);
    const stat = await fs.lstat(absolute);
    if (stat.isSymbolicLink()) throw new Error(`禁止发布符号链接：${relative}`);
    if (stat.isDirectory()) {
      for (const name of (await fs.readdir(absolute)).sort()) {
        if (name === '.DS_Store' || name === '.gitkeep' || name === '__pycache__') continue;
        await add(`${relative}/${name}`);
      }
      return;
    }
    if (!stat.isFile() || stat.size > 45 * 1024 * 1024) throw new Error(`无效或过大的文件：${relative}`);
    if (relative.split('/').some(part => part.startsWith('.') && part !== '.nojekyll')) throw new Error(`禁止发布隐藏文件：${relative}`);
    if (!/\.(html|js|mjs|css|md|json|svg|png|jpg|jpeg|webp|wav|mp3|ogg|m4a|flac|py|command)$/.test(relative) && relative !== '.nojekyll') throw new Error(`不允许的文件类型：${relative}`);
    const content = await fs.readFile(absolute);
    if (/\.(html|js|mjs|css|md|json|svg|py|command)$/.test(relative)) {
      if (/(?:sk-[A-Za-z0-9_-]{16,}|hf_[A-Za-z0-9]{16,}|gh[pousr]_[A-Za-z0-9]{16,}|https?:\/\/(?:api)?joyspace\.jd\.com)/.test(content.toString())) throw new Error(`检测到敏感信息：${relative}`);
    }
    files.set(PREFIX + relative, content);
  }
  for (const relative of ['index.html', 'site.config.js', 'data.js', 'MODEL_CARD.md', 'README.md', '.nojekyll', 'assets', 'scripts', 'deployment/REPOSITORY_README.md']) await add(relative);
  for (const relative of ['console', '启动控制台.command']) {
    try { await fs.access(path.join(ROOT, relative)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    await add(relative);
  }
  const version = crypto.createHash('sha256');
  for (const relative of ['data.js', 'site.config.js', 'assets/app.js', 'assets/style.css', 'assets/sample-panel.css']) version.update(files.get(PREFIX + relative));
  const digest = version.digest('hex').slice(0, 12);
  const index = files.get(PREFIX + 'index.html').toString().replace(/((?:src|href)="\.\/(?:data\.js|site\.config\.js|assets\/app\.js|assets\/style\.css|assets\/sample-panel\.css))(?:\?v=[^"]*)?"/g, `$1?v=${digest}"`);
  files.set(PREFIX + 'index.html', Buffer.from(index));
  files.set('README.md', files.get(PREFIX + 'deployment/REPOSITORY_README.md'));
  return files;
}

export async function preparePublication(expectedHead) {
  if (!/^[a-f0-9]{40}$/.test(expectedHead || '')) throw new Error('缺少已核对的远端版本；请先核对 GitHub main。');
  await command(process.execPath, [path.join(ROOT, 'scripts/validate.mjs')]);
  const metadata = await github('');
  if (metadata.full_name !== REPOSITORY || metadata.private || metadata.default_branch !== 'main') throw new Error('只允许发布独立 public 项目 Enzo-coder-debug/LiveTTS 的 main 分支。');
  const tip = (await github('/git/ref/heads/main')).object.sha;
  if (tip !== expectedHead) throw new Error('GitHub 已有其他更新，已停止以避免覆盖。请先核对并同步远端。');
  const commit = await github(`/git/commits/${tip}`);
  const tree = await github(`/git/trees/${commit.tree.sha}?recursive=1`);
  if (tree.truncated) throw new Error('远端目录不完整，停止发布。');
  const remote = new Map(tree.tree.filter(entry => entry.type === 'blob').map(entry => [entry.path, entry.sha]));
  const files = await publicationFiles();
  const changes = [...files].filter(([filename, content]) => remote.get(filename) !== hash(content));
  const deletions = [...remote.keys()].filter(filename => filename.startsWith(PREFIX + 'assets/audio/') && /\.(wav|mp3|ogg|m4a|flac)$/i.test(filename) && !files.has(filename));
  return { tip, tree: commit.tree.sha, files, changes, deletions };
}

export async function publishSite(expectedHead, progress = () => {}) {
  const plan = await preparePublication(expectedHead);
  if (!plan.changes.length && !plan.deletions.length) return { sha: plan.tip, unchanged: true, url: SITE_URL };
  progress(`校验通过：更新 ${plan.changes.length} 个文件，移除 ${plan.deletions.length} 个旧音频。`);
  const entries = [];
  for (const [filename, content] of plan.changes) {
    const blob = await github('/git/blobs', { content: content.toString('base64'), encoding: 'base64' });
    if (blob.sha !== hash(content)) throw new Error('上传校验失败：' + filename);
    entries.push({ path: filename, mode: filename.endsWith('.command') ? '100755' : '100644', type: 'blob', sha: blob.sha });
    progress(`已上传 ${entries.length}/${plan.changes.length}：${filename}`);
  }
  for (const filename of plan.deletions) entries.push({ path: filename, mode: '100644', type: 'blob', sha: null });
  const tree = await github('/git/trees', { base_tree: plan.tree, tree: entries });
  const commit = await github('/git/commits', { message: 'Update LiveTTS showcase content and management tools', tree: tree.sha, parents: [plan.tip] });
  if ((await github('/git/ref/heads/main')).object.sha !== plan.tip) throw new Error('上传期间远端发生变化，未更新 main。');
  await github('/git/refs/heads/main', { sha: commit.sha, force: false }, 'PATCH');
  const state = { sha: commit.sha, previous_sha: plan.tip, published_at: new Date().toISOString(), changed_files: plan.changes.map(([filename]) => filename), deleted_files: plan.deletions, url: SITE_URL };
  await fs.mkdir(path.join(ROOT, '.generation'), { recursive: true, mode: 0o700 });
  await fs.writeFile(path.join(ROOT, '.generation/published.json'), JSON.stringify(state, null, 2) + '\n', { mode: 0o600 });
  progress('已提交 GitHub，等待 Pages 部署。');
  return state;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const expected = process.argv[process.argv.indexOf('--expected-head') + 1];
    if (process.argv.includes('--publish')) console.log(JSON.stringify(await publishSite(expected, console.log), null, 2));
    else {
      const plan = await preparePublication(expected);
      console.log(JSON.stringify({ base: plan.tip, update: plan.changes.map(([filename]) => filename), delete: plan.deletions }, null, 2));
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
