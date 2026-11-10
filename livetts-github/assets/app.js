(() => {
  const data = window.LIVETTS_DATA;
  const config = window.LIVETTS_SITE;
  const dialog = document.querySelector('#sample-dialog');
  const search = document.querySelector('#sample-search');
  let selectedDemo = 'all';
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const playable = output => Boolean(output.src && !output.illustrative && output.enabled !== false);
  const entries = {
    preset: { title: '精品音色 · 已发布音频', note: '以下为同一指定预置音色的合成输出，不是附件中的原始演示视频。没有语速对照样例。' },
    all: { title: '全部已发布音频', note: '保留已经确认的情绪、多语种、方言、长文本、拼读与应用场景音频。' },
    zeroshot: { title: 'Zero-shot：语种解耦', note: '附件中的原始演示尚未提供可公开媒体。当前 36 条音频使用预置音色，不将其作为 Zero-shot 克隆对照。', unavailable: true },
    longform: { title: '长上下文 · 故事与直播样例', note: '展示现有故事旁白与直播文案音频；不是附件中的原始直播长视频，也不构成持续直播时长测试。', cases: ['long-story', 'everyday-scenarios'], filenames: ['long-story-output.wav', 'scene-live.wav'] },
    podcast: { title: '播客长上下文', note: '现有生活播客独白样例，不是附件中的原始对话演示。', filenames: ['long-podcast.wav'] },
    phonetics: { title: '声韵母拼读', note: '堵塞的拼音是 d u du s e se。中文引导语与 SSML 拼读分别合成后拼接，真实请求见“文本与参数”。', cases: ['phonetics'] },
    svc: { title: 'SVC 唱歌：同桌的你', note: '该演示在附件中指向内部媒体，尚未提供可公开文件。保留原卡片，不使用其他音频或空音频代替。', unavailable: true },
    humming: { title: '哼唱样例', note: '该演示在附件中指向内部媒体，尚未提供可公开文件。保留原卡片，不使用其他音频或空音频代替。', unavailable: true },
  };

  for (const element of document.querySelectorAll('[data-copy]')) {
    const key = element.dataset.copy;
    const value = config.copy?.zh?.[key];
    if (typeof value === 'string' && value.trim()) {
      if (element.textContent.replace(/\s+/g, ' ').trim() !== value.trim()) element.textContent = value;
      element.hidden = false;
    }
  }

  function pauseAudio() {
    document.querySelectorAll('audio').forEach(audio => audio.pause());
  }

  function audioCard(output) {
    const card = make('article', 'sample-output');
    const heading = make('div', 'sample-output-heading');
    heading.append(make('h4', '', output.label.zh), make('span', 'sample-language', output.language));
    const transcript = make('p', 'sample-transcript', output.text);
    transcript.lang = output.language;
    transcript.dir = 'auto';
    const audio = make('audio');
    audio.controls = true;
    audio.preload = 'metadata';
    audio.src = output.src;
    audio.setAttribute('aria-label', output.label.zh);
    audio.addEventListener('play', () => document.querySelectorAll('audio').forEach(other => { if (other !== audio) other.pause(); }));
    const error = make('p', 'sample-error', '音频加载失败，请刷新后重试。');
    error.hidden = true;
    audio.addEventListener('error', () => { error.hidden = false; });
    const details = make('details');
    details.append(make('summary', '', '文本与参数'), make('p', '', output.text), make('p', '', output.model), make('p', '', output.settings));
    const copy = make('button', '', '复制合成文本');
    copy.type = 'button';
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(output.text); copy.textContent = '已复制'; }
      catch { copy.textContent = '复制失败，请手动选择文本'; }
    });
    details.append(copy);
    card.append(heading, transcript, audio, error, details);
    return card;
  }

  function renderSamples() {
    pauseAudio();
    const entry = entries[selectedDemo];
    const container = document.querySelector('#sample-list');
    container.replaceChildren();
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    if (!entry.unavailable) {
      for (const sample of data.samples) {
        if (entry.cases && !entry.cases.includes(sample.id)) continue;
        const outputs = sample.outputs.filter(output => playable(output) && (!entry.filenames || entry.filenames.includes(output.src.split('/').at(-1))) && `${sample.title.zh} ${sample.title.en} ${output.label.zh} ${output.label.en} ${output.language} ${output.text}`.toLocaleLowerCase().includes(query));
        if (!outputs.length) continue;
        const group = make('div', 'sample-group');
        const grid = make('div', 'sample-output-grid');
        outputs.forEach(output => grid.append(audioCard(output)));
        group.append(make('h3', '', sample.title.zh), make('p', 'sample-group-description', sample.description.zh), grid);
        container.append(group);
        count += outputs.length;
      }
    }
    if (!count) container.append(make('p', 'sample-empty', entry.unavailable ? '暂无可公开的对应媒体。' : '没有匹配的音频。'));
    document.querySelector('#sample-count').textContent = `${count} 条音频`;
    document.querySelector('#show-all-samples').hidden = selectedDemo === 'all' || selectedDemo === 'preset';
    document.querySelector('.sample-tools').hidden = Boolean(entry.unavailable);
  }

  function showSamples(type) {
    selectedDemo = type;
    search.value = '';
    document.querySelector('#sample-title').textContent = entries[type].title;
    document.querySelector('#sample-context').textContent = entries[type].note;
    renderSamples();
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
  }

  for (const element of document.querySelectorAll('[data-demo]')) {
    element.addEventListener('click', event => { event.preventDefault(); showSamples(element.dataset.demo); });
    if (element.tagName !== 'A') element.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); showSamples(element.dataset.demo); } });
  }
  search.addEventListener('input', renderSamples);
  document.querySelector('#show-all-samples').addEventListener('click', () => showSamples('all'));
  for (const close of document.querySelectorAll('[data-close]')) close.addEventListener('click', () => document.getElementById(close.dataset.close).close());
  dialog.addEventListener('close', () => { pauseAudio(); document.querySelector('#sample-list').replaceChildren(); });

  const resources = document.querySelector('#public-resources');
  for (const [key, label] of [['repositoryUrl', 'GitHub 项目'], ['spaceUrl', 'Hugging Face 体验页'], ['technicalReportUrl', '技术报告'], ['contactUrl', '联系团队']]) {
    try {
      if (!config[key]) continue;
      const url = new URL(config[key]);
      if (url.protocol !== 'https:' && !(key === 'contactUrl' && url.protocol === 'mailto:')) continue;
      const link = make('a', 'link-item', label);
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.append(make('span', 'arrow', '↗'));
      resources.append(link);
    } catch {}
  }
  for (const element of document.querySelectorAll('[data-internal-resource]')) element.addEventListener('click', event => {
    event.preventDefault();
    document.querySelector('#resource-title').textContent = element.textContent.replace('↗', '').trim();
    document.querySelector('#resource-dialog').showModal();
  });
})();
