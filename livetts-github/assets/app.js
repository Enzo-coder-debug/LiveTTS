(() => {
  const select = (selector) => document.querySelector(selector);
  const data = window.LIVETTS_DATA;
  const config = window.LIVETTS_SITE;
  const copy = {
    zh: {
      skip: '跳到音频示例', navDemo: '效果展示', navCapability: '核心能力', navEval: '业务评测', navStart: '快速开始',
      badge: '面向真实产品环境的生成式语音基础模型', heroFirst: '让每一句话', heroSecond: '都有真人的温度',
      heroIntro: '输入一段文本，输出自然人声。', heroEmphasis: '用 3–15 秒参考音频注册音色，', heroEnd: '让同一个声音跨越语种、方言与情绪。',
      listen: '▶ 试听音频示例', getStarted: '快速接入 →', statAudio: '真实合成音频', statEmotions: '情感指令示例', statDialects: '地方方言示例', statLanguages: '外语示例',
      demoTitle: '听见 LiveTTS 的不同表达', demoDescription: '同一配置音色，直接试听。情感、语言和方言标签对应实际合成请求。', search: '搜索音频或文本',
      sampleNote: '合成语音 · 请求版本 2.8.1 · 24 kHz / PCM16。未公开原始参考录音；示例不代表独立评测结论。',
      capabilityTitle: '从音色到表达，八项核心能力', capabilityDescription: '从零样本克隆到篇章级语音，把自然表达变成可控制、可复用的能力。',
      evalTitle: '业务应用与内部听评', evalDescription: '保留团队原稿中的历史版本结果；不代表当前版本的独立榜单排名。', exportResults: '下载完整评测数据 CSV ↓',
      startTitle: '让声音进入你的产品', startDescription: '已有 API 可供接入评估。音色注册与真实合成通过授权服务完成，密钥仅保留在服务端。',
      repository: '项目与示例', space: '静态体验预览', modelCard: '模型能力与使用说明', audioManifest: '音频清单与生成记录', contact: '联系团队',
      responsible: '仅使用已获授权的音色与录音，适当标识合成语音，不冒用身份或误导听众。',
      all: '全部', clips: '条音频', showing: '当前显示', empty: '没有匹配的音频，请试试其他关键词。', parameters: '文本与参数', copyText: '复制文本', copied: '已复制合成文本', copyFailed: '复制失败，请手动选择文本。',
      internal: '内部评测 · 历史版本', dimension: '维度', details: '查看分项与评测说明', error: '音频加载失败，请重试或下载文件。', download: '下载 WAV', reference: '参考音频', pending: '尚未发布',
    },
    en: {
      skip: 'Skip to audio samples', navDemo: 'Audio demos', navCapability: 'Capabilities', navEval: 'Evaluation', navStart: 'Get started',
      badge: 'Generative speech for real-world products', heroFirst: 'Every sentence.', heroSecond: 'A human touch.',
      heroIntro: 'Turn text into natural speech. ', heroEmphasis: 'Register a voice from 3–15 seconds of reference audio, ', heroEnd: 'then explore languages, dialects and emotions with one voice.',
      listen: '▶ Listen to the samples', getStarted: 'Get started →', statAudio: 'Generated audio samples', statEmotions: 'Emotion prompt examples', statDialects: 'Dialect examples', statLanguages: 'Foreign languages sampled',
      demoTitle: 'Hear the many sides of LiveTTS', demoDescription: 'One configured voice. Listen directly. Emotion, language and dialect labels describe the actual synthesis requests.', search: 'Search audio or text',
      sampleNote: 'Synthetic speech · Requested version 2.8.1 · 24 kHz / PCM16. Original reference recordings are not public. Samples are not independent evaluation results.',
      capabilityTitle: 'Eight capabilities, from voice to expression', capabilityDescription: 'From zero-shot cloning to long-form speech: natural expression, with controls you can reuse.',
      evalTitle: 'Applications & internal listening studies', evalDescription: 'Historical model results reproduced from team materials, not an independent ranking of the current model.', exportResults: 'Download full evaluation CSV ↓',
      startTitle: 'Bring a voice to your product', startDescription: 'An API is available for integration evaluation. Voice registration and synthesis use an authorized service; credentials stay on your server.',
      repository: 'Project & examples', space: 'Static demo preview', modelCard: 'Model capabilities & usage', audioManifest: 'Audio catalogue & generation record', contact: 'Contact the team',
      responsible: 'Use only authorized voices and recordings. Disclose synthetic speech where appropriate. Do not impersonate people or mislead listeners.',
      all: 'All', clips: 'audio clips', showing: 'Showing', empty: 'No matching audio. Try another keyword.', parameters: 'Text & parameters', copyText: 'Copy text', copied: 'Synthesis text copied', copyFailed: 'Could not copy. Please select the text manually.',
      internal: 'Internal study · Historical model', dimension: 'Dimension', details: 'View dimensions & methodology', error: 'Audio could not load. Retry or download the file.', download: 'Download WAV', reference: 'Reference audio', pending: 'Not published',
    },
  };
  const capabilities = [
    ['🎙️', ['一句话音色克隆', 'Zero-shot voice cloning'], ['用 3–15 秒参考音频注册音色，合成新的文本。这里的时长指输入参考录音长度，并非克隆耗时。', 'Register a voice using 3–15 seconds of reference audio, then synthesize new text. This is input recording length, not processing latency.']],
    ['💎', ['精品音色定制', 'Custom voice tuning'], ['根据团队能力说明，可用 30 分钟–5 小时录音进行 LoRA SFT，打造专属音色。', 'Team-described capability: tune a dedicated voice with LoRA SFT using 30 minutes to 5 hours of recordings.']],
    ['🎭', ['多情感控制', 'Emotion control'], ['固定文本，改变表达。直接试听温暖、高兴、悲伤、愤怒、恐惧、惊讶、担忧、期待、着急与中立。', 'Keep the words, change the expression. Listen to warm, happy, sad, angry, fearful, surprised, worried, expectant, urgent and neutral prompts.']],
    ['🗺️', ['地方方言', 'Chinese dialects'], ['同一音色切换方言指令，试听四川、粤语、东北、河南、天津、陕西、上海与闽南示例。', 'Explore Sichuan, Cantonese, Northeastern, Henan, Tianjin, Shaanxi, Shanghainese and Southern Min requests with one configured voice.']],
    ['🌍', ['多语种表达', 'Multilingual speech'], ['试听英语、日语、德语、法语、西班牙语、荷兰语、印尼语及中英混合文本。', 'Listen to English, Japanese, German, French, Spanish, Dutch, Indonesian and mixed Chinese–English text.']],
    ['💬', ['副语言 AudioTag', 'Paralinguistic audio tags'], ['在文本中插入 <laughter>、<sigh>、<cough>、<throat>，探索大笑、叹气、咳嗽与清嗓等表达。', 'Insert <laughter>, <sigh>, <cough> and <throat> into text to explore laughter, sighs, coughs and throat clearing.']],
    ['🔤', ['拼音与拼读', 'Phonetics & spelling'], ['从声母、韵母到整体拼读，探索语音教学中的细粒度发音表达。', 'Explore initials, finals and whole syllables for fine-grained pronunciation in learning experiences.']],
    ['📖', ['篇章级长音频', 'Long-form narration'], ['故事旁白、生活播客、导览解说：在段落之间观察停顿、节奏和表达连贯性。', 'Stories, podcasts and guided tours: listen for pauses, rhythm and continuity across paragraphs.']],
  ];
  const steps = [
    [['准备音色', 'Prepare a voice'], ['提供已获授权的参考录音，确认使用与发布范围。', 'Prepare an authorized reference recording and agree on usage rights.']],
    [['配置表达', 'Set the expression'], ['选择文本、语种、情感、方言及语速等参数。', 'Choose text, language, emotion, dialect and speaking rate.']],
    [['接入 API', 'Integrate the API'], ['从服务端发起合成请求，不向浏览器暴露凭证。', 'Send synthesis requests from your server, never exposing credentials in the browser.']],
    [['试听与上线', 'Review & release'], ['核对发音、音色与内容，标识合成语音后再发布。', 'Review pronunciation, voice and content, then label synthetic speech before publishing.']],
  ];
  let language = config.defaultLanguage === 'en' ? 'en' : 'zh';
  try { if (['en', 'zh'].includes(localStorage.getItem('livetts-language'))) language = localStorage.getItem('livetts-language'); } catch {}
  let category = 'all';
  let query = '';
  let toastTimer;
  const text = (key) => copy[language][key];
  const localized = (value) => value[language];
  const pair = (value) => value[language === 'zh' ? 0 : 1];
  const playable = (output) => Boolean(output.src && !output.illustrative);
  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }
  function announce(message) {
    const toast = select('#toast');
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2500);
  }
  function pauseAudio() { document.querySelectorAll('audio').forEach(audio => audio.pause()); }
  function media(source, label) {
    const wrapper = element('div', 'audio-player');
    const audio = element('audio');
    audio.controls = true;
    audio.preload = 'metadata';
    audio.src = source;
    audio.setAttribute('aria-label', label);
    const failure = element('p', 'audio-error', text('error'));
    failure.hidden = true;
    const download = element('a', '', text('download'));
    download.href = source;
    download.download = '';
    failure.append(' ', download);
    audio.addEventListener('play', () => document.querySelectorAll('audio').forEach(other => { if (audio !== other) other.pause(); }));
    audio.addEventListener('error', () => { failure.hidden = false; });
    wrapper.append(audio, failure);
    return wrapper;
  }
  function audioCard(output) {
    const card = element('article', 'demo-card');
    const heading = element('div', 'audio-heading');
    heading.append(element('h4', '', localized(output.label)), element('span', 'audio-language', output.language));
    const transcript = element('p', 'transcript', output.text);
    transcript.lang = output.language;
    transcript.dir = 'auto';
    card.append(heading, transcript, media(output.src, localized(output.label)));
    const disclosure = element('details', 'audio-details');
    disclosure.append(element('summary', '', text('parameters')));
    const completeText = element('p', 'full-transcript', output.text);
    completeText.lang = output.language;
    completeText.dir = 'auto';
    disclosure.append(completeText, element('p', 'audio-metadata', output.model), element('p', 'audio-metadata', output.settings));
    const copyButton = element('button', 'text-button', text('copyText'));
    copyButton.type = 'button';
    copyButton.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(output.text); announce(text('copied')); }
      catch { announce(text('copyFailed')); }
    });
    disclosure.append(copyButton);
    card.append(disclosure);
    return card;
  }
  function renderSamples() {
    pauseAudio();
    const list = select('#sample-list');
    list.replaceChildren();
    let shown = 0;
    for (const sample of data.samples) {
      if (category !== 'all' && sample.category !== category) continue;
      const outputs = sample.outputs.filter(output => playable(output) && `${sample.title.en} ${sample.title.zh} ${output.label.en} ${output.label.zh} ${output.language} ${output.text}`.toLocaleLowerCase().includes(query));
      if (!outputs.length) continue;
      shown += outputs.length;
      const group = element('div', 'sample-group');
      const heading = element('div', 'group-heading');
      heading.append(element('h3', '', localized(sample.title)), element('span', 'group-count', `${outputs.length} ${text('clips')}`));
      group.append(heading);
      if (sample.reference.src) {
        const reference = element('details', 'reference-audio');
        reference.append(element('summary', '', text('reference')), element('p', '', sample.reference.transcript), media(sample.reference.src, localized(sample.reference.label)));
        group.append(reference);
      }
      const grid = element('div', 'grid g3 audio-grid');
      outputs.forEach(output => grid.append(audioCard(output)));
      group.append(grid);
      list.append(group);
    }
    if (!shown) list.append(element('p', 'empty-state', text('empty')));
    select('#sample-status').textContent = `${text('showing')} ${shown} / ${data.samples.flatMap(sample => sample.outputs).filter(playable).length} ${text('clips')}`;
    select('#sample-filters').querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.category === category)));
  }
  function renderFilters() {
    const filters = select('#sample-filters');
    filters.replaceChildren();
    for (const entry of [{ id: 'all', en: 'All', zh: '全部' }, ...data.categories]) {
      const count = data.samples.filter(sample => entry.id === 'all' || sample.category === entry.id).flatMap(sample => sample.outputs).filter(playable).length;
      const button = element('button', 'filter-button', `${localized(entry)} ${count}`);
      button.type = 'button';
      button.dataset.category = entry.id;
      button.addEventListener('click', () => { category = entry.id; renderSamples(); });
      filters.append(button);
    }
  }
  function renderCapabilities() {
    const grid = select('#capability-grid');
    grid.replaceChildren();
    for (const [icon, title, description] of capabilities) {
      const card = element('article', 'card');
      const mark = element('div', 'card-icon', icon);
      mark.setAttribute('aria-hidden', 'true');
      card.append(mark, element('h3', '', pair(title)), element('p', '', pair(description)));
      grid.append(card);
    }
    const container = select('#integration-steps');
    container.replaceChildren();
    steps.forEach(([title, description]) => {
      const step = element('div', 'step');
      step.append(element('h4', '', pair(title)), element('p', '', pair(description)));
      container.append(step);
    });
  }
  function renderEvaluations() {
    const container = select('#evaluation-list');
    container.replaceChildren();
    for (const evaluation of data.evaluations) {
      const card = element('article', 'eval-card');
      const heading = element('div', 'eval-title');
      heading.append(element('h3', '', localized(evaluation.label)), element('span', 'tag', text('internal')));
      const scores = element('div', 'eval-scores');
      [evaluation.model, evaluation.baseline].forEach((model, index) => {
        const score = element('div', index === 0 ? 'eval-score primary-score' : 'eval-score');
        score.append(element('strong', '', String(evaluation.headline[index])), element('span', '', model));
        scores.append(score);
      });
      const disclosure = element('details', 'eval-details');
      disclosure.append(element('summary', '', text('details')), element('p', 'eval-method', localized(evaluation.method)));
      const wrapper = element('div', 'table-wrap');
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', localized(evaluation.title));
      const table = element('table');
      table.append(element('caption', 'sr-only', localized(evaluation.title)));
      const header = element('thead');
      const headerRow = element('tr');
      [text('dimension'), evaluation.model, evaluation.baseline].forEach((value, index) => { const cell = element('th', index === 1 ? 'col-hl' : '', value); cell.scope = 'col'; headerRow.append(cell); });
      header.append(headerRow);
      const body = element('tbody');
      evaluation.rows.forEach(metric => {
        const row = element('tr');
        row.append(element('td', '', localized(metric)), element('td', 'col-hl num', String(metric.values[0])), element('td', 'num', String(metric.values[1])));
        body.append(row);
      });
      table.append(header, body);
      wrapper.append(table);
      disclosure.append(wrapper, element('p', 'callout callout-note', localized(evaluation.caveat)));
      card.append(heading, element('p', 'eval-sub', localized(evaluation.metric)), scores, disclosure);
      container.append(card);
    }
  }
  function setPublicLink(id, value) {
    if (!value) return;
    const link = document.getElementById(id);
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' && !(id === 'contact-link' && url.protocol === 'mailto:')) return;
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.hidden = false;
    } catch {}
  }
  function render() {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
    document.title = language === 'zh' ? 'LiveTTS · 生成式语音基础模型' : 'LiveTTS · Generative Speech Model';
    document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = text(node.dataset.i18n); });
    const toggle = select('#language-switch');
    toggle.textContent = language === 'zh' ? 'EN' : '中文';
    toggle.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换到中文');
    select('#sample-search').placeholder = text('search');
    const outputsFor = (id) => data.samples.find(sample => sample.id === id).outputs.filter(playable);
    select('#stat-audio').textContent = data.samples.flatMap(sample => sample.outputs).filter(playable).length;
    select('#stat-emotions').textContent = outputsFor('emotional-range').length;
    select('#stat-dialects').textContent = outputsFor('local-voices').length;
    select('#stat-languages').textContent = new Set(outputsFor('across-languages').map(output => output.language).filter(value => value !== 'zh-CN' && !value.includes('+'))).size;
    renderFilters();
    renderSamples();
    renderCapabilities();
    renderEvaluations();
  }
  select('#language-switch').addEventListener('click', () => {
    language = language === 'zh' ? 'en' : 'zh';
    try { localStorage.setItem('livetts-language', language); } catch {}
    render();
  });
  select('#sample-search').addEventListener('input', event => { query = event.target.value.trim().toLocaleLowerCase(); renderSamples(); });
  select('#export-results').addEventListener('click', () => {
    const rows = [['Study', 'Model', 'Baseline', 'Metric', 'Model score', 'Baseline score', 'Method', 'Limitations']];
    data.evaluations.forEach(evaluation => {
      rows.push([localized(evaluation.title), evaluation.model, evaluation.baseline, localized(evaluation.metric), ...evaluation.headline, localized(evaluation.method), localized(evaluation.caveat)]);
      evaluation.rows.forEach(metric => rows.push([localized(evaluation.title), evaluation.model, evaluation.baseline, localized(metric), ...metric.values, '', '']));
    });
    const csv = '\uFEFF' + rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = element('a');
    link.href = url;
    link.download = 'livetts-internal-evaluations.csv';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  setPublicLink('repository-link', config.repositoryUrl);
  setPublicLink('space-link', config.spaceUrl);
  setPublicLink('contact-link', config.contactUrl);
  render();
})();
