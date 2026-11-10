(() => {
  const select = selector => document.querySelector(selector);
  let state;
  let selected = { sample: 0, output: 0 };
  let dirty = false;
  let working = false;
  let currentView = 'audio';
  let pollTimer;
  const make = (tag, className, value) => { const element = document.createElement(tag); if (className) element.className = className; if (value !== undefined) element.textContent = value; return element; };
  const current = () => state.data.samples[selected.sample]?.outputs[selected.output];
  const notice = (message, error = false) => { const area = select('#notice'); area.textContent = message; area.classList.toggle('error', error); area.hidden = false; };
  const changed = () => { dirty = true; updateStatus(); renderCounts(); };
  const act = handler => async event => { if (working) return; try { await handler(event); } catch (error) { notice(error.message, true); } };

  async function api(endpoint, payload, options = {}) {
    const response = await fetch('/api/' + endpoint, { ...options, ...(payload === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '请求失败，请重试。');
    return result;
  }

  function updateStatus() {
    select('#save-state').textContent = working ? '正在处理…' : dirty ? '● 有未保存修改' : '✓ 已保存到本地';
    select('#save-state').classList.toggle('dirty', dirty);
    for (const id of ['save', 'publish', 'restore', 'reload', 'add-output', 'preview']) select('#' + id).disabled = working || !state;
    document.querySelectorAll('#editor input, #editor textarea, #editor button, #settings-form input, #settings-form textarea, #settings-form select').forEach(element => {
      if (working) { element.dataset.wasDisabled ??= String(element.disabled); element.disabled = true; }
      else if (element.dataset.wasDisabled !== undefined) { element.disabled = element.dataset.wasDisabled === 'true'; delete element.dataset.wasDisabled; }
    });
  }

  function renderCounts() {
    const outputs = state.data.samples.flatMap(sample => sample.outputs);
    const visible = outputs.filter(output => output.enabled !== false && output.src && !output.illustrative).length;
    select('#nav-count').textContent = outputs.length;
    select('#total-count').textContent = outputs.length;
    select('#visible-count').textContent = visible;
    select('#group-count').textContent = state.data.samples.length;
  }

  function button(label, handler, className = '') {
    const element = make('button', className, label);
    element.type = 'button';
    element.addEventListener('click', act(handler));
    return element;
  }

  function field(label, value, handler, { multiline = false, placeholder = '', full = false } = {}) {
    const wrapper = make('label', 'field' + (full ? ' full' : ''));
    const input = make(multiline ? 'textarea' : 'input');
    input.value = value || '';
    input.placeholder = placeholder;
    input.maxLength = multiline ? 30000 : 10000;
    input.addEventListener('input', () => { handler(input.value); changed(); });
    wrapper.append(make('span', '', label), input);
    return wrapper;
  }

  function renderList() {
    const list = select('#audio-list');
    list.replaceChildren();
    const query = select('#search').value.toLocaleLowerCase().trim();
    state.data.samples.forEach((sample, sampleIndex) => {
      const matches = sample.outputs.map((output, outputIndex) => ({ output, outputIndex })).filter(({ output }) => `${sample.title.zh} ${sample.title.en} ${output.label.zh} ${output.label.en} ${output.language} ${output.text}`.toLocaleLowerCase().includes(query));
      if (!matches.length) return;
      const heading = make('div', 'group-label');
      heading.append(make('span', '', sample.title.zh));
      const controls = make('span', 'group-controls');
      for (const direction of [-1, 1]) {
        const control = button(direction < 0 ? '↑' : '↓', () => {
          const next = sampleIndex + direction;
          const active = state.data.samples[selected.sample];
          [state.data.samples[sampleIndex], state.data.samples[next]] = [state.data.samples[next], sample];
          selected.sample = state.data.samples.indexOf(active);
          changed(); renderList();
        });
        control.setAttribute('aria-label', (direction < 0 ? '上移分组：' : '下移分组：') + sample.title.zh);
        control.disabled = sampleIndex + direction < 0 || sampleIndex + direction >= state.data.samples.length || working;
        controls.append(control);
      }
      heading.append(controls); list.append(heading);
      matches.forEach(({ output, outputIndex }) => {
        const item = button('', () => { selected = { sample: sampleIndex, output: outputIndex }; renderList(); renderEditor(); }, 'audio-item');
        item.classList.toggle('selected', sampleIndex === selected.sample && outputIndex === selected.output);
        item.classList.toggle('hidden-output', output.enabled === false);
        item.setAttribute('aria-pressed', String(sampleIndex === selected.sample && outputIndex === selected.output));
        const names = make('div');
        names.append(make('div', 'item-name', output.label.zh), make('div', 'item-sub', `${output.language || '未指定语种'} · ${output.enabled === false ? '已隐藏' : output.src ? '展示中' : '待上传'}`));
        item.append(make('span', 'item-icon', output.enabled === false ? '—' : '▶'), names); list.append(item);
      });
    });
    if (!list.children.length) list.append(make('p', 'helper', '没有匹配的音频。'));
  }

  function renderEditor() {
    const editor = select('#editor');
    editor.replaceChildren();
    const sample = state.data.samples[selected.sample];
    const output = current();
    if (!output) { editor.append(make('p', '', '请选择一个音频条目。')); return; }
    const heading = make('div', 'editor-head');
    const title = make('div');
    title.append(make('div', 'editor-kicker', sample.title.zh), make('h2', '', output.label.zh));
    const controls = make('div', 'editor-buttons');
    for (const direction of [-1, 1]) {
      const move = button(direction < 0 ? '↑ 上移' : '↓ 下移', () => {
        const next = selected.output + direction;
        [sample.outputs[selected.output], sample.outputs[next]] = [sample.outputs[next], output];
        selected.output = next; changed(); renderList(); renderEditor();
      });
      move.disabled = selected.output + direction < 0 || selected.output + direction >= sample.outputs.length;
      controls.append(move);
    }
    heading.append(title, controls); editor.append(heading);
    const visibility = make('label', 'visibility-label');
    const checkbox = make('input'); checkbox.type = 'checkbox'; checkbox.checked = output.enabled !== false;
    checkbox.addEventListener('change', () => { output.enabled = checkbox.checked; changed(); renderList(); });
    visibility.append(checkbox, document.createTextNode('在官网展示这条音频')); editor.append(visibility);
    const audioBox = make('div', 'audio-box');
    audioBox.append(make('div', 'audio-filename', output.src ? output.src.split('/').at(-1) : '尚未上传音频'));
    if (output.src) {
      const audio = make('audio'); audio.controls = true; audio.preload = 'metadata';
      audio.src = output.src.startsWith('./') ? '/' + output.src.slice(2) : output.src;
      audio.setAttribute('aria-label', '试听：' + output.label.zh);
      audio.addEventListener('play', () => document.querySelectorAll('audio').forEach(other => { if (other !== audio) other.pause(); }));
      audioBox.append(audio);
    }
    const upload = make('input'); upload.type = 'file'; upload.accept = '.wav,audio/wav'; upload.setAttribute('aria-label', '替换音频文件');
    upload.addEventListener('change', act(async () => {
      const file = upload.files[0]; if (!file) return;
      if (file.size > 45 * 1024 * 1024) throw new Error('文件不能超过 45 MB。');
      working = true; updateStatus();
      try {
        const result = await api('upload', undefined, { method: 'POST', headers: { 'Content-Type': 'audio/wav' }, body: file });
        output.src = result.src; output.illustrative = false; changed();
        notice(`已暂存 ${file.name}（${result.duration_seconds} 秒）。核对文本和生成参数后保存。`);
      } finally { working = false; renderEditor(); renderList(); updateStatus(); }
    }));
    audioBox.append(upload, make('p', '', '替换 WAV · 16-bit PCM · 最多 45 MB / 10 分钟。上传后先暂存，保存后才进入展示站。旧文件保留备份用途。'));
    editor.append(audioBox);
    const labels = make('div', 'field-grid');
    for (const [language, name] of [['zh', '中文名称'], ['en', 'English label']]) labels.append(field(name, output.label[language], value => { output.label[language] = value; renderList(); }));
    labels.append(field('展示文本 / 实际合成输入', output.text, value => { output.text = value; }, { multiline: true, full: true }));
    editor.append(labels, make('p', 'helper', '支持保留 SSML 标签。编辑这里不会重新合成语音，请确保文案与上传音频对应。'));
    const metadata = make('div', 'field-grid');
    metadata.append(field('语种标签', output.language, value => { output.language = value; renderList(); }), field('模型版本', output.model, value => { output.model = value; }));
    metadata.append(field('生成参数与处理说明', output.settings, value => { output.settings = value; }, { multiline: true, full: true }));
    editor.append(make('div', 'divider'), metadata);
    const group = make('details'); group.append(make('summary', '', '编辑所在分组的标题与说明'));
    const groupFields = make('div', 'field-grid');
    for (const [language, label] of [['zh', '中文'], ['en', '英文']]) {
      groupFields.append(field(`${label}分组名称`, sample.title[language], value => { sample.title[language] = value; renderList(); }));
      groupFields.append(field(`${label}分组说明`, sample.description[language], value => { sample.description[language] = value; }, { multiline: true }));
    }
    group.append(groupFields); editor.append(group); updateStatus();
  }

  const copyNames = { badge: '顶部徽标', heroFirst: '首页标题 · 第一行', heroSecond: '首页标题 · 第二行', heroIntro: '首页简介 · 开头', heroEmphasis: '首页简介 · 强调文字', heroEnd: '首页简介 · 结尾', demoTitle: '音频区标题', demoDescription: '音频区说明', sampleNote: '音频免责声明', capabilityTitle: '核心能力标题', capabilityDescription: '核心能力说明', evalTitle: '评测区标题', evalDescription: '评测区说明', startTitle: '接入区标题', startDescription: '接入区说明', responsible: '页脚使用声明' };
  function renderSettings() {
    const container = select('#settings-form'); container.replaceChildren();
    const general = make('div', 'panel'); general.append(make('div', 'panel-label', 'SITE SETTINGS'), make('h2', '', '链接与默认语言'));
    const grid = make('div', 'field-grid');
    const language = make('label', 'field'); language.append(make('span', '', '默认语言'));
    const dropdown = make('select');
    for (const [value, label] of [['zh', '中文'], ['en', 'English']]) { const option = make('option', '', label); option.value = value; dropdown.append(option); }
    dropdown.value = state.config.defaultLanguage; dropdown.addEventListener('change', () => { state.config.defaultLanguage = dropdown.value; changed(); }); language.append(dropdown); grid.append(language);
    for (const [key, label] of [['contactUrl', '联系链接（HTTPS 或 mailto）'], ['spaceUrl', 'Hugging Face 体验页'], ['repositoryUrl', 'GitHub 项目链接'], ['technicalReportUrl', '技术报告链接']]) grid.append(field(label, state.config[key], value => { state.config[key] = value; }));
    general.append(grid); container.append(general);
    for (const [languageCode, languageName] of [['zh', '中文文案'], ['en', 'English copy']]) {
      const panel = make('div', 'panel'); panel.append(make('div', 'panel-label', languageCode.toUpperCase()), make('h2', '', languageName), make('p', '', '留空时使用网站原有文案。修改后保存，可在预览中查看。'));
      const fields = make('div', 'field-grid');
      for (const key of state.copyFields) fields.append(field(copyNames[key] || key, state.config.copy?.[languageCode]?.[key], value => {
        state.config.copy ||= {}; state.config.copy[languageCode] ||= {}; state.config.copy[languageCode][key] = value;
      }, { multiline: /Description|Note|Intro|End|responsible/.test(key), placeholder: '留空使用原文' }));
      panel.append(fields); container.append(panel);
    }
    updateStatus();
  }

  function switchView(view) {
    currentView = view;
    for (const name of ['audio', 'settings', 'release']) select('#' + name + '-view').hidden = view !== name;
    document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item.dataset.view === view));
    const headings = { audio: ['让每一条示例恰到好处。', '试听、编辑、替换音频。在这里完成，不必修改代码。'], settings: ['网站内容，由你掌控。', '调整首页文案、公开链接与默认语言，保留现有视觉样式。'], release: ['确认之后，再让世界听见。', '本地保存与公开发布分开，每一步都可以检查。'] };
    select('#page-title').textContent = headings[view][0]; select('#page-description').textContent = headings[view][1];
    if (view === 'settings') renderSettings();
  }

  function render() { renderCounts(); renderList(); renderEditor(); if (currentView === 'settings') renderSettings(); updateStatus(); select('#release-sha').textContent = state.publication?.sha?.slice(0, 12) || '尚未发布'; select('#public-site').href = state.siteUrl; }

  async function load() {
    working = true; updateStatus();
    try { state = await api('state'); dirty = false; selected.sample = Math.min(selected.sample, state.data.samples.length - 1); selected.output = Math.min(selected.output, state.data.samples[selected.sample].outputs.length - 1); }
    finally { working = false; if (state) render(); else updateStatus(); }
  }

  async function save() {
    if (!dirty) return;
    working = true; updateStatus();
    try { const result = await api('save', { revision: state.revision, data: state.data, config: state.config }); state = { ...state, ...result }; dirty = false; notice('已保存到本地，并创建上一版备份。官网暂未改变。'); }
    finally { working = false; render(); }
  }

  async function deployment() {
    const result = await api('deployment');
    const status = result.status === 'completed' ? result.conclusion === 'success' ? '已成功上线' : `部署未成功：${result.conclusion}` : 'GitHub Pages 部署中…';
    select('#deployment-state').textContent = status;
    if (result.sha) select('#release-sha').textContent = result.sha.slice(0, 12);
    return result;
  }

  async function pollPublication(attempt = 0) {
    try {
      const result = await api('publication');
      select('#publish-log').textContent = (result.messages || []).join('\n');
      if (result.status === 'failed') throw new Error(result.error);
      if (result.status === 'submitted') {
        working = false; updateStatus();
        const release = await deployment();
        if (release.status === 'completed') { notice(release.conclusion === 'success' ? '发布完成，官网已更新。' : 'GitHub 已提交，但 Pages 部署失败，请检查部署记录。', release.conclusion !== 'success'); return; }
      }
      if (attempt >= 90) { working = false; updateStatus(); notice('提交状态已保留。部署仍在进行，可稍后点击“检查部署状态”。'); return; }
      pollTimer = setTimeout(() => pollPublication(attempt + 1), 4000);
    } catch (error) { working = false; updateStatus(); notice(error.message, true); }
  }

  select('#search').addEventListener('input', renderList);
  document.querySelectorAll('[data-view]').forEach(item => item.addEventListener('click', () => switchView(item.dataset.view)));
  select('#save').addEventListener('click', act(save));
  select('#reload').addEventListener('click', act(async () => { if (dirty && !confirm('放弃未保存的修改并重新加载？')) return; await load(); notice('已重新加载本地文件。'); }));
  select('#preview').addEventListener('click', act(async () => { await save(); select('#preview-frame').src = '/?preview=' + Date.now(); select('#preview-dialog').showModal(); }));
  select('#close-preview').addEventListener('click', () => { select('#preview-dialog').close(); select('#preview-frame').src = 'about:blank'; });
  select('#add-output').addEventListener('click', () => {
    const sample = state.data.samples[selected.sample];
    sample.outputs.push({ label: { zh: '新音频示例', en: 'New audio sample' }, language: 'zh-CN', text: '请填写实际合成文本', src: '', model: 'LiveTTS 2.8.1 (requested)', settings: '', illustrative: true, enabled: true });
    selected.output = sample.outputs.length - 1; changed(); renderList(); renderEditor();
  });
  select('#restore').addEventListener('click', act(async () => {
    if (!confirm('恢复上次保存前的内容？当前未保存的修改将丢弃，官网不会直接改变。')) return;
    working = true; updateStatus();
    try { const result = await api('restore', { revision: state.revision }); state = { ...state, ...result }; dirty = false; selected = { sample: 0, output: 0 }; notice('已恢复上一版本地内容。确认预览后可重新发布。'); }
    finally { working = false; render(); }
  }));
  select('#check-deployment').addEventListener('click', act(deployment));
  select('#publish').addEventListener('click', act(async () => {
    if (!confirm('将当前内容公开发布到 Enzo-coder-debug/LiveTTS？请确认所有音频已听审、文案与音频一致且获准公开。未保存修改会先保存。')) return;
    await save(); working = true; updateStatus(); switchView('release'); clearTimeout(pollTimer);
    try { await api('publish', { revision: state.revision, confirm: true }); notice('已开始发布。请保持控制台进程运行。'); await pollPublication(); }
    catch (error) { working = false; updateStatus(); throw error; }
  }));
  window.addEventListener('beforeunload', event => { if (dirty || working) { event.preventDefault(); event.returnValue = ''; } });
  load().catch(error => notice(error.message, true));
})();
