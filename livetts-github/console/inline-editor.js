(() => {
  const select = selector => document.querySelector(selector);
  const fields = new Map();
  let state;
  let baseline;
  let dirty = false;
  let working = false;
  let publishing = false;
  let editing = true;
  let message = '正在连接本地编辑服务…';
  let hasError = false;
  let pollTimer;
  let selectedBlock;
  let blockDialog;
  let blockTools;
  let blockConfirmation;
  let pendingBlockRemoval;
  const fingerprint = () => JSON.stringify([state.data, state.config]);
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  async function api(endpoint, payload, options = {}) {
    const response = await fetch('/api/' + endpoint, { ...options, ...(payload === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || '请求失败，请重试。');
    return result;
  }

  function update() {
    document.body.classList.toggle('inline-editing', editing);
    for (const [element] of fields) {
      if (!element.isConnected) { fields.delete(element); continue; }
      if (editing && !working && !publishing && state) element.setAttribute('contenteditable', 'plaintext-only');
      else element.removeAttribute('contenteditable');
    }
    for (const bar of document.querySelectorAll('.inline-editor-bar')) {
      const status = bar.querySelector('[role="status"]');
      status.textContent = message;
      status.classList.toggle('is-error', hasError);
      bar.querySelector('[data-action="toggle"]').textContent = editing ? '预览效果' : '继续编辑';
      for (const button of bar.querySelectorAll('button')) button.disabled = !state || working || publishing;
      bar.querySelector('[data-action="discard"]').disabled ||= !dirty;
      bar.querySelector('[data-action="save"]').disabled ||= !dirty;
    }
    document.querySelectorAll('.inline-replace').forEach(button => { button.disabled = !state || working || publishing; });
    document.querySelectorAll('.inline-block-change').forEach(button => { button.disabled = !state || working || publishing || button.dataset.parentHidden === 'true'; });
    positionBlockTools();
  }

  function notice(text, error = false) { message = text; hasError = error; update(); }
  function changed() { dirty = fingerprint() !== baseline; notice(dirty ? '有未保存修改 · 官网未改变' : '已保存到本地 · 官网未改变'); }

  function blockName(block) {
    const heading = block.querySelector('h1, h2, h3, h4, .stat-label, .scene-name');
    const text = (heading?.textContent.trim() ? heading : block).textContent.replace(/\s+/g, ' ').trim();
    return text.slice(0, 70) || `未命名${block.dataset.blockKind}（${block.dataset.blockId}）`;
  }

  function positionBlockTools() {
    if (!blockTools) return;
    const allowed = selectedBlock && editing && state && !working && !publishing && !selectedBlock.closest('[data-block-id][hidden]') && !document.querySelector('dialog[open]');
    blockTools.hidden = !allowed;
    if (!allowed) return;
    const rect = selectedBlock.getBoundingClientRect();
    if (rect.bottom <= 76 || rect.top >= innerHeight - 120) { blockTools.hidden = true; return; }
    blockTools.querySelector('span').textContent = selectedBlock.dataset.blockKind + ' · ' + blockName(selectedBlock);
    blockTools.style.top = Math.min(Math.max(rect.top + 8, 76), innerHeight - 180) + 'px';
    blockTools.style.left = Math.max(8, Math.min(rect.right - blockTools.offsetWidth - 8, innerWidth - blockTools.offsetWidth - 8)) + 'px';
  }

  function changeBlock(block, remove) {
    if (!state || working || publishing) return;
    if (remove) {
      pendingBlockRemoval = block;
      blockConfirmation.querySelector('p').textContent = `从页面移除“${blockName(block)}”？子内容会一起隐藏，可在“区块管理”中恢复。保存只影响本地，同步后才改变官网；不会删除音频文件。`;
      blockConfirmation.showModal(); positionBlockTools();
      return;
    }
    applyBlockChange(block, false);
  }

  function applyBlockChange(block, remove) {
    if (!state || working || publishing) return;
    const hidden = new Set(state.config.hiddenBlocks || []);
    if (remove) hidden.add(block.dataset.blockId);
    else hidden.delete(block.dataset.blockId);
    if (hidden.size) state.config.hiddenBlocks = [...hidden];
    else delete state.config.hiddenBlocks;
    window.LIVETTS_BLOCKS.apply();
    selectedBlock = undefined;
    renderBlocks(); changed();
    notice(`${remove ? '已移除' : '已恢复'}“${blockName(block)}” · 尚未同步官网`);
  }

  function renderBlocks() {
    if (!blockDialog || !state) return;
    const list = blockDialog.querySelector('.inline-block-list');
    const query = blockDialog.querySelector('input').value.trim().toLocaleLowerCase();
    list.replaceChildren();
    const blocks = [...document.querySelectorAll('[data-block-id]')];
    let matches = 0;
    for (const block of blocks) {
      const parent = block.parentElement.closest('[data-block-id]');
      const name = blockName(block);
      const parentHidden = Boolean(parent?.closest('[data-block-id][hidden]'));
      const context = `${block.dataset.blockKind}${parent ? ' / ' + blockName(parent) : ' / 整块'}`;
      if (!`${name} ${context}`.toLocaleLowerCase().includes(query)) continue;
      matches += 1;
      const row = make('div', 'inline-block-row' + (block.hidden || parentHidden ? ' is-removed' : ''));
      row.dataset.managedBlock = block.dataset.blockId;
      const label = make('div', 'inline-block-label');
      label.append(make('span', 'inline-block-context', context), make('strong', '', name), make('small', '', block.hidden ? '已移除 · 可恢复' : parentHidden ? '随上级板块隐藏，先恢复上级' : '显示中'));
      const change = make('button', 'inline-block-change', block.hidden ? '恢复此块' : '移除此块');
      change.type = 'button';
      change.dataset.parentHidden = String(!block.hidden && parentHidden);
      change.setAttribute('aria-label', `${block.hidden ? '恢复' : '移除'}：${name}`);
      change.addEventListener('click', () => changeBlock(block, !block.hidden));
      const locate = make('button', 'inline-block-locate', '定位');
      locate.type = 'button'; locate.disabled = block.hidden || parentHidden;
      locate.setAttribute('aria-label', '定位：' + name);
      locate.addEventListener('click', () => { blockDialog.close(); selectedBlock = block; block.scrollIntoView({ block: 'start', behavior: 'smooth' }); positionBlockTools(); });
      row.append(label, locate, change); list.append(row);
    }
    blockDialog.querySelector('.inline-block-count').textContent = `${matches} 个匹配区块 · ${(state.config.hiddenBlocks || []).length} 个已移除`;
    if (!matches) list.append(make('p', '', '没有匹配的区块。'));
    update();
  }

  function setupBlocks() {
    blockDialog = make('dialog', 'inline-block-manager');
    blockDialog.id = 'inline-block-manager';
    blockDialog.setAttribute('aria-labelledby', 'inline-block-manager-title');
    const heading = make('div', 'inline-block-heading');
    const title = make('h2', '', '区块管理'); title.id = 'inline-block-manager-title';
    const close = make('button', '', '返回页面'); close.type = 'button';
    close.addEventListener('click', () => blockDialog.close());
    heading.append(title, close);
    const searchLabel = make('label', 'inline-block-search', '搜索区块');
    const search = make('input'); search.type = 'search'; search.placeholder = '板块、卡片、场景或文档名称';
    search.addEventListener('input', renderBlocks); searchLabel.append(search);
    const count = make('p', 'inline-block-count'); count.setAttribute('role', 'status');
    blockDialog.append(heading, make('p', 'inline-block-help', '支持整块板块、单张卡片、说明文字、场景、步骤和文档链接。移除只取消页面展示，原文与文件仍保留；需要撤回已公开资料时，不能只使用此功能。'), toolbar(true), searchLabel, count, make('div', 'inline-block-list'));
    blockDialog.addEventListener('close', () => { selectedBlock = undefined; positionBlockTools(); });
    document.body.append(blockDialog);
    blockTools = make('div', 'inline-block-tools'); blockTools.hidden = true;
    const remove = make('button', '', '移除此块'); remove.type = 'button';
    remove.addEventListener('click', () => { if (selectedBlock) changeBlock(selectedBlock, true); });
    blockTools.append(make('span'), remove); document.body.append(blockTools);
    document.addEventListener('pointerover', event => {
      if (event.target.closest('.inline-block-tools')) return;
      selectedBlock = event.target.closest('[data-block-id]');
      positionBlockTools();
    });
    document.addEventListener('scroll', positionBlockTools, true);
    window.addEventListener('resize', positionBlockTools);
    blockConfirmation = make('dialog', 'inline-block-manager inline-block-confirm');
    blockConfirmation.id = 'inline-block-confirm';
    blockConfirmation.setAttribute('aria-labelledby', 'inline-block-confirm-title');
    const confirmTitle = make('h2', '', '确认移除此块'); confirmTitle.id = 'inline-block-confirm-title';
    const cancel = make('button', '', '取消'); cancel.type = 'button';
    cancel.addEventListener('click', () => blockConfirmation.close());
    const confirm = make('button', 'inline-block-change', '确认移除'); confirm.type = 'button';
    confirm.addEventListener('click', () => {
      const block = pendingBlockRemoval;
      blockConfirmation.close();
      if (block) applyBlockChange(block, true);
    });
    blockConfirmation.append(confirmTitle, make('p', 'inline-block-help'), cancel, confirm);
    blockConfirmation.addEventListener('close', () => { pendingBlockRemoval = undefined; positionBlockTools(); });
    document.body.append(blockConfirmation);
  }

  function bind(element, key, read, write, kind = 'text') {
    if (!element || fields.has(element)) return;
    element.dataset.inlineField = key;
    element.setAttribute('spellcheck', 'false');
    element.title = '直接修改文字；保存到本地后可同步到官网';
    fields.set(element, { key, read, write, kind });
    element.addEventListener('input', () => {
      if (!state || working || publishing || !editing) return;
      write(element.innerText.replace(/\r\n?/g, '\n'));
      for (const [other, field] of fields) if (other !== element && other.isConnected && field.key === key) other.textContent = read();
      changed();
    });
    element.addEventListener('drop', event => event.preventDefault());
  }

  function bindPage() {
    for (const element of document.querySelectorAll('[data-copy]')) {
      if (element.hidden) continue;
      const key = element.dataset.copy;
      const original = element.textContent;
      bind(element, 'copy:' + key, () => state.config.copy?.zh?.[key] ?? original, value => {
        state.config.copy ??= {}; state.config.copy.zh ??= {}; state.config.copy.zh[key] = value;
      }, 'copy');
    }
    for (const element of document.querySelectorAll('[data-page-text]')) {
      if (element.closest('.demo-play, .card-icon, .arrow')) continue;
      const key = element.dataset.pageText;
      const original = element.textContent;
      bind(element, 'page:' + key, () => state.config.pageText?.[key] ?? original, value => {
        state.config.pageText ??= {}; state.config.pageText[key] = value;
      });
    }
  }

  async function replaceAudio(card, output, file) {
    if (!file) return;
    if (file.size > 45 * 1024 * 1024) throw new Error('WAV 文件不能超过 45 MB。');
    working = true; notice('正在暂存音频…');
    try {
      const result = await api('upload', undefined, { method: 'POST', headers: { 'Content-Type': 'audio/wav' }, body: file });
      const legacySlots = { 'long-story-output.wav': 'story', 'scene-live.wav': 'livestream', 'long-podcast.wav': 'podcast' };
      if (!output.showcaseSlot && legacySlots[output.src.split('/').at(-1)]) output.showcaseSlot = legacySlots[output.src.split('/').at(-1)];
      output.src = result.src; output.illustrative = false;
      const audio = card.querySelector('audio');
      audio.pause(); audio.src = result.src;
      card.querySelector('.sample-error').hidden = true;
      changed();
      notice('新音频已暂存；请核对文案和生成参数，再保存');
    } finally { working = false; update(); }
  }

  function bindSamples() {
    for (const group of document.querySelectorAll('.sample-group[data-sample-id]')) {
      const sample = state.data.samples.find(item => item.id === group.dataset.sampleId);
      if (!sample) continue;
      bind(group.querySelector('h3'), sample.id + ':title', () => sample.title.zh, value => { sample.title.zh = value; });
      bind(group.querySelector('.sample-group-description'), sample.id + ':description', () => sample.description.zh, value => { sample.description.zh = value; });
    }
    for (const card of document.querySelectorAll('.sample-output[data-output-index]')) {
      if (card.dataset.inlineReady) continue;
      const sample = state.data.samples.find(item => item.id === card.dataset.sampleId);
      const output = sample?.outputs[Number(card.dataset.outputIndex)];
      if (!output) continue;
      card.dataset.inlineReady = 'true';
      const prefix = sample.id + ':' + card.dataset.outputIndex;
      bind(card.querySelector('h4'), prefix + ':label', () => output.label.zh, value => { output.label.zh = value; card.querySelector('audio').setAttribute('aria-label', value); });
      bind(card.querySelector('.sample-transcript'), prefix + ':text', () => output.text, value => { output.text = value; });
      bind(card.querySelector('.sample-language'), prefix + ':language', () => output.language, value => { output.language = value; });
      const paragraphs = card.querySelectorAll('details p');
      ['text', 'model', 'settings'].forEach((key, index) => bind(paragraphs[index], prefix + ':' + key, () => output[key], value => { output[key] = value; }));
      const input = make('input', 'inline-editor-upload');
      input.type = 'file'; input.accept = '.wav,audio/wav'; input.hidden = true;
      input.setAttribute('aria-label', '替换音频：' + output.label.zh);
      const button = make('button', 'inline-replace', '替换这条音频');
      button.type = 'button';
      button.addEventListener('click', () => input.click());
      input.addEventListener('change', () => replaceAudio(card, output, input.files[0]).catch(error => notice(error.message, true)).finally(() => { input.value = ''; }));
      card.append(button, input, make('p', 'inline-editor-hint', '直接改名称、文案和参数；改文字不会重新合成音频。'));
    }
    update();
  }

  async function save() {
    if (!dirty) return;
    for (const [element, field] of fields) {
      if (element.isConnected && field.kind === 'copy' && !field.read().trim()) throw new Error('标题或网站文案不能为空，请填写内容后保存。');
    }
    working = true; notice('正在校验并保存到本地…');
    try {
      const result = await api('save', { data: state.data, config: state.config, revision: state.revision });
      state.revision = result.revision;
      baseline = fingerprint(); dirty = false;
      notice('已保存到本地 · 官网未改变');
    } finally { working = false; update(); }
  }

  async function pollPublication(attempt = 0) {
    try {
      const result = await api('publication');
      if (result.status === 'failed') throw new Error(result.error);
      if (result.status === 'idle') { publishing = false; notice('尚未从此服务发起同步'); return; }
      if (result.status === 'submitted') {
        const deployment = await api('deployment');
        if (deployment.status === 'completed') {
          publishing = false;
          notice(deployment.conclusion === 'success' ? '同步完成 · 官网已更新' : 'GitHub 已提交，但官网部署失败，请在控制台查看', deployment.conclusion !== 'success');
          return;
        }
        notice('GitHub 已提交 · 等待官网部署…');
      } else notice(result.messages?.at(-1) || '正在同步到 GitHub…');
      if (attempt >= 90) {
        publishing = false;
        notice('同步仍在进行，可点击“检查同步”查询');
        return;
      }
      pollTimer = setTimeout(() => pollPublication(attempt + 1), 4000);
    } catch (error) { publishing = false; notice(error.message, true); }
  }

  async function publish() {
    if (!confirm('将当前页面、文案和音频公开同步到 Enzo-coder-debug/LiveTTS？未保存修改会先保存。请确认内容已审核且可以公开。')) return;
    await save(); publishing = true; notice('准备同步到官网…');
    try { await api('publish', { revision: state.revision, confirm: true }); await pollPublication(); }
    catch (error) { publishing = false; throw error; }
  }

  const actions = {
    toggle: () => { editing = !editing; if (blockDialog?.open) blockDialog.close(); notice(editing ? '编辑模式 · 点击虚线文字即可修改' : '预览模式 · 尚未同步的内容仅本地可见'); },
    blocks: () => { renderBlocks(); if (!blockDialog.open) blockDialog.showModal(); positionBlockTools(); },
    save,
    discard: () => { if (dirty && confirm('放弃本页所有未保存修改，重新载入本地已保存版本？')) { dirty = false; location.reload(); } },
    restore: async () => {
      if (!confirm('恢复上次保存前的本地内容？当前未保存修改也会放弃，官网不会自动改变。')) return;
      working = true; notice('正在恢复本地备份…');
      try { await api('restore', { revision: state.revision }); dirty = false; working = false; location.reload(); }
      finally { working = false; update(); }
    },
    check: async () => { publishing = true; clearTimeout(pollTimer); await pollPublication(); },
    publish,
  };

  function toolbar(inDialog = false) {
    const bar = make('div', 'inline-editor-bar' + (inDialog ? ' inline-dialog-bar' : ''));
    bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', '本地页面编辑工具');
    const label = make('div', 'inline-editor-label');
    const status = make('span'); status.setAttribute('role', 'status');
    label.append(make('strong', '', 'LiveTTS · 本地页面编辑'), status); bar.append(label);
    for (const [key, text] of [['toggle', '预览效果'], ['blocks', '区块管理'], ['discard', '放弃未保存'], ['restore', '恢复上一版'], ['save', '保存到本地'], ['publish', '同步到官网'], ['check', '检查同步']]) {
      const button = make('button', ['blocks', 'discard', 'restore', 'check'].includes(key) ? 'inline-secondary' : '', text);
      button.type = 'button'; button.dataset.action = key;
      button.addEventListener('click', () => Promise.resolve().then(actions[key]).catch(error => notice(error.message, true)));
      bar.append(button);
    }
    if (!inDialog) {
      const link = make('a', '', '内容控制台 ↗'); link.href = '/console/'; bar.append(link);
      bar.append(make('div', 'inline-editor-help', '虚线文字可编辑；鼠标移到区块可移除，“区块管理”可恢复。预览 → 保存到本地 → 确认同步到官网。'));
    }
    return bar;
  }

  document.body.classList.add('inline-editor-enabled');
  document.body.append(toolbar());
  for (const dialog of document.querySelectorAll('.sample-panel')) dialog.prepend(toolbar(true));
  setupBlocks();
  document.addEventListener('click', event => {
    if (editing && event.target.closest('[data-inline-field]')) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  document.addEventListener('keydown', event => {
    if (editing && event.target.closest('[data-inline-field]')) event.stopPropagation();
  }, true);
  window.addEventListener('beforeunload', event => { if (dirty || working || publishing) { event.preventDefault(); event.returnValue = ''; } });

  async function load() {
    const loaded = await api('state');
    if (JSON.stringify(loaded.config) !== JSON.stringify(window.LIVETTS_SITE) || JSON.stringify(loaded.data) !== JSON.stringify(window.LIVETTS_DATA)) throw new Error('本地内容刚刚更新，请刷新页面后编辑。');
    state = { ...loaded, data: window.LIVETTS_DATA, config: window.LIVETTS_SITE };
    baseline = fingerprint();
    bindPage(); bindSamples();
    new MutationObserver(bindSamples).observe(select('#sample-list'), { childList: true, subtree: true });
    notice('编辑模式 · 点击虚线文字即可修改');
    const publication = await api('publication');
    if (publication.status === 'uploading') { publishing = true; await pollPublication(); }
  }
  update();
  load().catch(error => notice(error.message, true));
})();
