import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { command } from './publish.mjs';

export const COPY_FIELDS = ['badge', 'heroFirst', 'heroSecond', 'heroIntro', 'heroEmphasis', 'heroEnd', 'demoTitle', 'demoDescription', 'sampleNote', 'capabilityTitle', 'capabilityDescription', 'evalTitle', 'evalDescription', 'startTitle', 'startDescription', 'responsible'];
const digest = content => crypto.createHash('sha256').update(content).digest('hex');
const serialize = (name, value) => `window.${name} = ${JSON.stringify(value, null, 2)};\n`;

export function wavInfo(content) {
  if (content.length < 44 || content.toString('ascii', 0, 4) !== 'RIFF' || content.toString('ascii', 8, 12) !== 'WAVE' || content.readUInt32LE(4) + 8 !== content.length) throw new Error('请上传完整的 PCM WAV 文件。');
  let format;
  let audio;
  for (let offset = 12; offset + 8 <= content.length;) {
    const name = content.toString('ascii', offset, offset + 4);
    const size = content.readUInt32LE(offset + 4);
    const start = offset + 8;
    if (start + size > content.length) throw new Error('WAV 数据不完整。');
    if (name === 'fmt ' && size >= 16) format = { encoding: content.readUInt16LE(start), channels: content.readUInt16LE(start + 2), rate: content.readUInt32LE(start + 4), alignment: content.readUInt16LE(start + 12), bits: content.readUInt16LE(start + 14) };
    if (name === 'data') audio = content.subarray(start, start + size);
    offset = start + size + (size % 2);
  }
  if (!format || format.encoding !== 1 || format.bits !== 16 || ![1, 2].includes(format.channels) || format.rate < 8000 || format.rate > 192000 || format.alignment !== format.channels * 2 || !audio?.length || audio.length % format.alignment) throw new Error('仅支持 16-bit PCM、单/双声道 WAV（8–192 kHz）。');
  const duration = audio.length / format.alignment / format.rate;
  if (duration < 0.1 || duration > 600) throw new Error('音频长度需为 0.1 秒至 10 分钟。');
  let energy = 0;
  for (let offset = 0; offset < audio.length; offset += 2) energy += audio.readInt16LE(offset) ** 2;
  if (Math.sqrt(energy / (audio.length / 2)) < 3.2768) throw new Error('音频为空或接近静音，未接受占位音频。');
  return { duration_seconds: Number(duration.toFixed(3)), sample_rate: format.rate, channels: format.channels, sha256: digest(content), bytes: content.length };
}

export function createStore(root) {
  const privateRoot = path.join(root, '.generation/console');
  async function state() {
    const dataSource = await fs.readFile(path.join(root, 'data.js'), 'utf8');
    const configSource = await fs.readFile(path.join(root, 'site.config.js'), 'utf8');
    const context = vm.createContext({ window: {} });
    vm.runInContext(dataSource, context, { timeout: 1000 });
    vm.runInContext(configSource, context, { timeout: 1000 });
    return { data: JSON.parse(JSON.stringify(context.window.LIVETTS_DATA)), config: JSON.parse(JSON.stringify(context.window.LIVETTS_SITE)), revision: digest(dataSource + '\0' + configSource) };
  }

  async function upload(content) {
    const info = wavInfo(content);
    await fs.mkdir(path.join(privateRoot, 'uploads'), { recursive: true, mode: 0o700 });
    const basename = info.sha256 + '.wav';
    await fs.writeFile(path.join(privateRoot, 'uploads', basename), content, { mode: 0o600 });
    return { src: './assets/audio/uploads/' + basename, ...info };
  }

  async function mediaFile(source, pending = false) {
    if (typeof source !== 'string' || !source.startsWith('./assets/audio/') || source.includes('\\') || source.includes('\0')) throw new Error('仅允许本项目音频目录中的文件。');
    const filename = path.resolve(root, source);
    if (!filename.startsWith(path.join(root, 'assets/audio') + path.sep)) throw new Error('音频路径越界。');
    try {
      const real = await fs.realpath(filename);
      if (real !== filename) throw new Error('不支持符号链接音频。');
      return filename;
    } catch (error) {
      if (error.code !== 'ENOENT' || !pending || !/^\.\/assets\/audio\/uploads\/[a-f0-9]{64}\.wav$/.test(source)) throw error;
      return path.join(privateRoot, 'uploads', path.basename(filename));
    }
  }

  async function save(payload) {
    const current = await state();
    if (payload.revision !== current.revision) throw new Error('内容已被其他窗口修改，请重新加载后再保存。');
    const { data, config } = payload;
    if (!data || !config || !Array.isArray(data.samples) || data.samples.length > 100 || data.samples.some(sample => !Array.isArray(sample.outputs) || sample.outputs.length > 100)) throw new Error('音频目录格式不正确或超过数量限制。');
    const source = serialize('LIVETTS_DATA', data);
    const configuration = serialize('LIVETTS_SITE', config);
    if (/"(?:__proto__|prototype|constructor)"\s*:/.test(source + configuration)) throw new Error('内容含不允许的属性。');
    for (const language of Object.keys(config.copy || {})) {
      if (!['zh', 'en'].includes(language)) throw new Error('网站文案仅支持中文和英文。');
      for (const [key, value] of Object.entries(config.copy[language])) if (!COPY_FIELDS.includes(key) || typeof value !== 'string' || value.length > 10000) throw new Error('网站文案字段不正确。');
    }
    await fs.mkdir(privateRoot, { recursive: true, mode: 0o700 });
    const staging = await fs.mkdtemp(path.join(privateRoot, 'stage-'));
    const promoted = [];
    let backup;
    let hadCatalogue = false;
    try {
      for (const relative of ['assets', 'index.html', 'MODEL_CARD.md', 'README.md', '.nojekyll', 'scripts/validate.mjs']) {
        await fs.mkdir(path.dirname(path.join(staging, relative)), { recursive: true });
        await fs.cp(path.join(root, relative), path.join(staging, relative), { recursive: true, filter: filename => path.basename(filename) !== '.DS_Store' });
      }
      const media = new Map();
      for (const sample of data.samples) {
        for (const item of [sample.reference, ...sample.outputs]) {
          if (!item?.src || item.src.startsWith('https://')) continue;
          const filename = await mediaFile(item.src, true);
          const content = await fs.readFile(filename);
          media.set(item.src, { content, filename });
          const destination = path.resolve(staging, item.src);
          await fs.mkdir(path.dirname(destination), { recursive: true });
          await fs.writeFile(destination, content);
        }
      }
      await fs.writeFile(path.join(staging, 'data.js'), source);
      await fs.writeFile(path.join(staging, 'site.config.js'), configuration);
      const validation = await command(process.execPath, [path.join(staging, 'scripts/validate.mjs')]);
      if ((await state()).revision !== current.revision) throw new Error('校验期间内容发生变化，未保存。');
      const catalogue = { updated_at: new Date().toISOString(), files: [...media].map(([src, { content }]) => ({ src, sha256: digest(content), bytes: content.length, ...(src.endsWith('.wav') ? wavInfo(content) : {}) })) };
      const backupId = new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomBytes(3).toString('hex');
      backup = path.join(privateRoot, 'backups', backupId);
      await fs.mkdir(backup, { recursive: true, mode: 0o700 });
      for (const relative of ['data.js', 'site.config.js']) await fs.copyFile(path.join(root, relative), path.join(backup, relative));
      try { await fs.copyFile(path.join(root, 'assets/audio/CATALOGUE.json'), path.join(backup, 'CATALOGUE.json')); hadCatalogue = true; }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
      for (const [src, entry] of media) {
        const destination = path.resolve(root, src);
        if (entry.filename === destination) continue;
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.copyFile(entry.filename, destination, fs.constants.COPYFILE_EXCL);
        promoted.push(destination);
      }
      for (const [relative, content] of [['data.js', source], ['site.config.js', configuration]]) {
        await fs.writeFile(path.join(root, relative + '.console-tmp'), content);
        await fs.rename(path.join(root, relative + '.console-tmp'), path.join(root, relative));
      }
      await fs.writeFile(path.join(root, 'assets/audio/CATALOGUE.json.console-tmp'), JSON.stringify(catalogue, null, 2) + '\n');
      await fs.rename(path.join(root, 'assets/audio/CATALOGUE.json.console-tmp'), path.join(root, 'assets/audio/CATALOGUE.json'));
      return { ...await state(), validation, backup: backupId };
    } catch (error) {
      if (backup) {
        for (const relative of ['data.js', 'site.config.js']) await fs.copyFile(path.join(backup, relative), path.join(root, relative));
        if (hadCatalogue) await fs.copyFile(path.join(backup, 'CATALOGUE.json'), path.join(root, 'assets/audio/CATALOGUE.json'));
        else await fs.rm(path.join(root, 'assets/audio/CATALOGUE.json'), { force: true });
        for (const filename of promoted) await fs.rm(filename, { force: true });
      }
      throw error;
    } finally {
      for (const relative of ['data.js', 'site.config.js', 'assets/audio/CATALOGUE.json']) await fs.rm(path.join(root, relative + '.console-tmp'), { force: true });
      await fs.rm(staging, { recursive: true, force: true });
    }
  }

  async function restore(revision) {
    const directory = path.join(privateRoot, 'backups');
    const backups = (await fs.readdir(directory).catch(error => error.code === 'ENOENT' ? [] : Promise.reject(error))).sort();
    if (!backups.length) throw new Error('尚无本地备份。');
    const context = vm.createContext({ window: {} });
    for (const relative of ['data.js', 'site.config.js']) vm.runInContext(await fs.readFile(path.join(directory, backups.at(-1), relative), 'utf8'), context, { timeout: 1000 });
    return save({ revision, data: context.window.LIVETTS_DATA, config: context.window.LIVETTS_SITE });
  }
  return { state, save, upload, mediaFile, restore };
}
