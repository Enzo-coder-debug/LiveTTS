const select = (selector) => document.querySelector(selector);
const config = window.LIVETTS_SITE;
const data = window.LIVETTS_DATA;
const words = {
  en: {
    skip: "Skip to research overview", research: "RESEARCH", heroEyebrow: "GENERATIVE SPEECH FOUNDATION MODEL",
    heroTitle: "One voice. Many possibilities.", heroDescription: "Expressive, controllable speech — from a few seconds of reference audio to a world of languages, emotions, and stories.",
    team: "LiveTTS Development Team · JD", exploreSamples: "Explore audio demos", tryDemo: "Interactive playground", paper: "Technical report",
    overviewTitle: "Meet LiveTTS", overviewPill: "AT A GLANCE", overviewText: "A generative speech model built around a simple idea: a voice should not be limited to a single language, dialect, or emotion. LiveTTS combines zero-shot voice cloning with expressive control and long-form synthesis, bringing a consistent vocal identity to different ways of speaking.",
    statPrompt: "Reference audio for cloning", statDialects: "Chinese dialects", statLanguages: "Foreign languages", statStyles: "Emotion & style instructions",
    statsNote: "Capabilities as described in the team-provided overview. 3–15 seconds refers to input audio duration, not generation latency.",
    navOverview: "Overview", navCapabilities: "Capabilities", navSamples: "Audio demos", navEvaluation: "Evaluation", navResources: "Resources",
    capEyebrow: "DESIGNED FOR EXPRESSION", capTitle1: "Keep the voice.", capTitle2: "Change the possibilities.", capDescription: "Control language, dialect, emotion, and speaking rate independently — without collecting a new recording for every combination.",
    cap1: "Zero-shot voice cloning", cap1Text: "A short voice reference, new words. Accent-enhanced and speaker-identity inference modes support different fidelity and deployment needs.",
    cap2: "Multilingual & dialect control", cap2Text: "Explore multiple languages and Chinese dialects through a shared voice, rather than a separate preset for every locale.",
    cap3: "Emotion & paralinguistics", cap3Text: "Shape delivery with style instructions. Add laughter, sighs, and other non-verbal cues directly inside the text.",
    cap4: "Long-form & custom voices", cap4Text: "Build longer narrations and livestream content. Fine-tune a premium voice with 30 minutes to 5 hours of authorized recordings.",
    diagramInputLabel: "START WITH", diagramInput: "One reference voice", chipLanguage: "Language", chipDialect: "Dialect", chipEmotion: "Emotion", chipRate: "Speaking rate",
    diagramCaption: "Conceptual capability map, not a model architecture diagram. Supported combinations depend on the deployed version.",
    sampleEyebrow: "THE LISTENING ROOM", samplesTitle1: "Don’t just read about it.", samplesTitle2: "Listen for the difference.", headphoneNote: "Headphones recommended. One clip plays at a time.", pauseAll: "Pause audio",
    listeningNote: "Curated demos illustrate individual cases; they are not a randomized evaluation. Check the model version, text, and settings alongside each published sample.",
    noAudio: "Preview catalogue · Public audio files have not been added yet. Example text is illustrative, not an actual synthesis result.",
    configuredAudio: "audio files configured in this category", sampleCount: "cases", reference: "REFERENCE AUDIO", generated: "LIVETTS OUTPUTS", audioPending: "Audio pending", missingAudio: "Awaiting public audio", recordedAudio: "Audio provided",
    referenceNote: "The original voice reference is not published. Outputs use the configured voice, but independent reference-to-output similarity listening is not yet possible.", referenceProvided: "Reference audio supplied by the team. Check consent and usage rights before reuse.",
    exampleText: "Illustrative text · replace with the exact transcript when publishing audio.", copyText: "Copy text", downloadAudio: "Download", modelVersion: "Model", settings: "Settings", metadataPending: "Version and synthesis settings not yet specified.",
    audioError: "This recording could not be loaded. The file may be missing or unavailable.", copied: "Copied to clipboard", copyFailed: "Copy unavailable. Please select the text and copy it manually.",
    evalEyebrow: "EVIDENCE, WITH CONTEXT", evalTitle1: "Measured in real scenarios.", evalTitle2: "Reported with the details.", internalEval: "TEAM-REPORTED · INTERNAL EVALUATION",
    evalIntro: "Selected results from the supplied LiveTTS overview. These are historical, scenario-specific internal studies — not an independent leaderboard or a claim about the latest model versions.",
    reportedResults: "REPORTED RESULTS", downloadResults: "Download these results · CSV", legendOurs: "LiveTTS / JoyAI", legendBaseline: "Comparison model", chartNote: "Reported dimension scores · common 0–1 visual scale · higher is better",
    rawResults: "View exact values & interpretation limits", dimension: "Dimension", methodTitle: "What this does — and doesn’t — establish",
    methodText: "Listening preference, intelligibility, and business outcomes measure different things. Do not infer human indistinguishability from call hang-up rates, or compare MOS across incompatible protocols. Full prompts, rater instructions, sample counts, and confidence intervals are needed for stronger conclusions.",
    resourceEyebrow: "FROM RESEARCH TO YOUR NEXT IDEA", resourceTitle: "Give your next idea a voice.", resourceDescription: "Explore the interactive playground, review the model overview, or connect with the team about evaluation and integration.",
    modelOverview: "Model overview", contact: "Contact the team", responsibleTitle: "RESPONSIBLE VOICE GENERATION",
    responsibleText: "Use only voices and recordings you are authorized to use. Disclose synthetic speech when appropriate. Do not impersonate people or mislead listeners. This static showcase does not accept audio uploads, register voices, or expose API credentials.",
    footer: "LiveTTS Development Team · JD · Research showcase", backTop: "Back to top", deploymentGuide: "Read the deployment guide",
    demoTitle: "The playground link is coming next.", demoText: "This is the GitHub Pages research showcase. The separate Hugging Face playground has not been linked yet. After it is deployed, the team can add its public URL in site.config.js. This static page never calls a paid API.",
    close: "Close dialog", exportDone: "Results exported with model names and study notes.", chartLabel: "Dimension score comparison",
  },
  zh: {
    skip: "跳转到模型介绍", research: "研究展示", heroEyebrow: "生成式语音基础模型",
    heroTitle: "一个音色，无限表达。", heroDescription: "从一小段参考录音出发，跨越语种、方言、情绪与篇章。让每一句话，都有属于它的声音。",
    team: "LiveTTS 开发团队 · 京东", exploreSamples: "浏览声音样例", tryDemo: "在线体验", paper: "技术报告",
    overviewTitle: "认识 LiveTTS", overviewPill: "模型概览", overviewText: "一个声音，不应被固定在某一种语言、方言或情绪里。LiveTTS 是京东团队自主研发的生成式语音模型，融合零样本音色克隆、表现力控制与长文本合成，在不同表达方式之间延续同一音色的身份与特征。",
    statPrompt: "克隆所需参考音频时长", statDialects: "地方方言", statLanguages: "外语覆盖", statStyles: "情感与风格指令",
    statsNote: "能力范围来自团队提供的介绍材料。3–15 秒指输入参考音频的时长，不是合成延迟。",
    navOverview: "模型概览", navCapabilities: "核心能力", navSamples: "声音样例", navEvaluation: "评测结果", navResources: "相关资源",
    capEyebrow: "为表达而设计", capTitle1: "保留声音的个性，", capTitle2: "打开表达的可能。", capDescription: "语种、方言、情感与语速独立控制，无需为每一种组合额外录制一套声音。",
    cap1: "零样本音色克隆", cap1Text: "用一小段参考录音，说出全新的文字。Accent 增强推理与纯声纹推理，为口音韵律保留及不同部署需求提供选择。",
    cap2: "多语种与方言控制", cap2Text: "同一个音色，探索多种外语和地方方言，而不是为每一种语言分别寻找一套预制音色。",
    cap3: "情绪与副语言表达", cap3Text: "通过风格指令调节演绎，在文本中插入大笑、叹气、咳嗽等标签，让文字之外的细节也能被听见。",
    cap4: "长文本与精品音色", cap4Text: "面向有声内容和直播等篇章级合成场景，可用 30 分钟至 5 小时的授权录音微调精品音色。",
    diagramInputLabel: "从这里开始", diagramInput: "一个参考音色", chipLanguage: "语种", chipDialect: "方言", chipEmotion: "情绪", chipRate: "语速",
    diagramCaption: "能力关系示意，不是模型架构图。实际支持的组合取决于部署版本。",
    sampleEyebrow: "声音试听室", samplesTitle1: "不只读到它，", samplesTitle2: "更要听见它。", headphoneNote: "建议佩戴耳机，每次只播放一条音频。", pauseAll: "暂停音频",
    listeningNote: "精选样例用于展示具体场景，不等同于随机评测。请结合每条公开音频的模型版本、实际文本及生成设置判断效果。",
    noAudio: "展示目录预览 · 还未添加可公开播放的音频。当前文字为示例，不是已生成结果。",
    configuredAudio: "条音频已配置", sampleCount: "组样例", reference: "参考音频", generated: "LIVETTS 合成结果", audioPending: "音频待补充", missingAudio: "等待公开音频", recordedAudio: "已提供音频",
    referenceNote: "原始参考录音尚未公开。右侧通过已配置音色生成，目前不能独立对照参考录音验证音色相似度。", referenceProvided: "参考音频由团队提供，再使用前请确认授权及适用范围。",
    exampleText: "示例文字 · 发布音频时请替换成实际合成文本。", copyText: "复制文本", downloadAudio: "下载音频", modelVersion: "模型", settings: "设置", metadataPending: "模型版本与合成设置尚未填写。",
    audioError: "无法加载这条录音，文件可能尚未上传或暂时不可访问。", copied: "已复制到剪贴板", copyFailed: "暂时无法复制，请手动选中文字复制。",
    evalEyebrow: "结果，也需要上下文", evalTitle1: "在真实场景中测量，", evalTitle2: "把实验条件一起呈现。", internalEval: "团队报告 · 内部评测",
    evalIntro: "以下选取自所提供的 LiveTTS 介绍材料，是历史版本、特定场景下的内部实验，不是第三方公开榜单，也不代表对各家最新版本的比较。",
    reportedResults: "原稿报告结果", downloadResults: "下载本组结果 · CSV", legendOurs: "LiveTTS / JoyAI", legendBaseline: "对比模型", chartNote: "原稿分项得分 · 统一按 0–1 范围绘制 · 越高越好",
    rawResults: "查看精确数值与解读边界", dimension: "评测维度", methodTitle: "这些结果能说明什么，不能说明什么",
    methodText: "听感偏好、可懂度和业务指标衡量的是不同维度。不能从挂断率推导“听不出真人区别”，也不应跨评测协议直接比较 MOS。更强的结论需要完整文本、评审说明、样本量及置信区间。",
    resourceEyebrow: "从研究，到你的下一个想法", resourceTitle: "给下一个灵感，一个声音。", resourceDescription: "在线探索模型的表达，查看能力介绍，或与团队交流评测及接入需求。",
    modelOverview: "模型说明", contact: "联系团队", responsibleTitle: "负责任地生成与使用声音",
    responsibleText: "请仅使用获得授权的音色与录音，在适当场景标明合成语音，不得冒充他人或误导听众。本静态展示页不接收音频上传，不注册声音，也不暴露 API 凭证。",
    footer: "LiveTTS 开发团队 · 京东 · 研究展示", backTop: "返回顶部", deploymentGuide: "查看部署说明",
    demoTitle: "下一步，连接在线体验。", demoText: "这里是 GitHub Pages 研究展示页，尚未绑定独立的 Hugging Face 体验页。部署后，在 site.config.js 中填入公开 Space 地址即可连接。本静态页不会直接调用计费 API。",
    close: "关闭弹窗", exportDone: "已导出结果，包含模型名称及实验说明。", chartLabel: "分项得分对比",
  },
};

let language = config.defaultLanguage === "zh" ? "zh" : "en";
try { const saved = localStorage.getItem("livetts-research-language"); if (["en", "zh"].includes(saved)) language = saved; } catch {}
let categoryId = data.categories[0].id;
let evaluationId = data.evaluations[0].id;
let toastTimeout;
const translate = (key) => words[language][key] || words.en[key] || key;
const localize = (value) => value?.[language] || value?.en || "";

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  svg.setAttribute("aria-hidden", "true");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#${name}`);
  svg.append(use);
  return svg;
}

function safeUrl(value, allowMail = false) {
  if (typeof value !== "string" || !value.trim()) return "";
  try {
    const url = new URL(value, document.baseURI);
    if (url.username || url.password) return "";
    if (url.protocol === "https:") return url.href;
    if (allowMail && url.protocol === "mailto:") return url.href;
    if (!/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith("//") && url.origin === location.origin) return url.href;
  } catch {}
  return "";
}

function setExternalLink(selector, value, allowMail = false) {
  const link = select(selector);
  const url = safeUrl(value, allowMail);
  link.hidden = !url;
  if (!url) { link.removeAttribute("href"); return; }
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
}

function notify(message) {
  clearTimeout(toastTimeout);
  select("#toast").textContent = message;
  select("#toast").hidden = false;
  toastTimeout = setTimeout(() => { select("#toast").hidden = true; }, 2600);
}

function pauseAudio() {
  document.querySelectorAll("audio").forEach((audio) => audio.pause());
  select("#stop-audio").disabled = true;
}

function updatePlaybackState() {
  select("#stop-audio").disabled = ![...document.querySelectorAll("audio")].some((audio) => !audio.paused);
}

function mediaPlayer(source, label) {
  const container = element("div", undefined, "media-container");
  const url = safeUrl(source);
  if (!url) {
    const empty = element("div", undefined, "media-empty");
    empty.append(icon("play"), element("span", translate("missingAudio")), element("i", undefined, "empty-line"), element("span", "—:—", "empty-duration"));
    container.append(empty);
    return container;
  }
  const audio = element("audio");
  audio.controls = true;
  audio.preload = "none";
  audio.src = url;
  audio.setAttribute("aria-label", label);
  audio.addEventListener("play", () => {
    document.querySelectorAll("audio").forEach((other) => { if (other !== audio) other.pause(); });
    updatePlaybackState();
  });
  audio.addEventListener("pause", updatePlaybackState);
  audio.addEventListener("ended", updatePlaybackState);
  audio.addEventListener("error", () => {
    if (container.querySelector(".media-error")) return;
    const message = element("p", translate("audioError"), "media-error");
    message.setAttribute("role", "alert");
    container.append(message);
    updatePlaybackState();
  });
  container.append(audio);
  return container;
}

function renderTrack(track) {
  const article = element("article", undefined, "track");
  const heading = element("div", undefined, "track-heading");
  const available = Boolean(safeUrl(track.src));
  heading.append(element("h4", localize(track.label)), element("span", translate(available ? "recordedAudio" : "audioPending"), "track-status"));
  const text = element("p", track.text, "track-text");
  text.lang = track.language || "";
  article.append(heading, text);
  if (track.illustrative) article.append(element("p", translate("exampleText"), "track-text-note"));
  article.append(mediaPlayer(track.src, localize(track.label)));
  if (available) {
    const meta = track.model && track.settings ? `${translate("modelVersion")}: ${track.model} · ${translate("settings")}: ${track.settings}` : translate("metadataPending");
    article.append(element("p", meta, "track-meta"));
  }
  const actions = element("div", undefined, "track-actions");
  const copyButton = element("button");
  copyButton.type = "button";
  copyButton.append(icon("copy"), element("span", translate("copyText")));
  copyButton.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(track.text); notify(translate("copied")); }
    catch { notify(translate("copyFailed")); }
  });
  actions.append(copyButton);
  if (available) {
    const download = element("a");
    download.href = safeUrl(track.src);
    download.setAttribute("download", "");
    download.target = "_blank";
    download.rel = "noopener noreferrer";
    download.append(icon("download"), element("span", translate("downloadAudio")));
    actions.append(download);
  }
  article.append(actions);
  return article;
}

function renderSample(sample) {
  const card = element("article", undefined, "sample-card");
  card.id = `sample-${sample.id}`;
  const heading = element("div", undefined, "sample-card-heading");
  const copy = element("div");
  copy.append(element("h3", localize(sample.title)), element("p", localize(sample.description)));
  const tags = element("div", undefined, "sample-tags");
  sample.tags.forEach((tag) => tags.append(element("span", tag)));
  heading.append(copy, tags);
  const body = element("div", undefined, "sample-body");
  const reference = element("aside", undefined, "reference-panel");
  const avatar = element("div", undefined, "reference-avatar");
  avatar.setAttribute("aria-hidden", "true");
  avatar.append(icon("headphones"));
  reference.append(element("p", translate("reference"), "small-label"), avatar, element("h4", localize(sample.reference.label)), element("p", sample.reference.transcript, "reference-transcript"), mediaPlayer(sample.reference.src, localize(sample.reference.label)));
  reference.append(element("p", translate(safeUrl(sample.reference.src) ? "referenceProvided" : "referenceNote"), "reference-note"));
  const generated = element("div", undefined, "generated-panel");
  generated.append(element("p", translate("generated"), "small-label"));
  sample.outputs.forEach((track) => generated.append(renderTrack(track)));
  body.append(reference, generated);
  card.append(heading, body);
  return card;
}

function renderSamples() {
  pauseAudio();
  const filters = data.categories.map((category) => {
    const active = category.id === categoryId;
    const button = element("button", category[language], `filter-button${active ? " active" : ""}`);
    button.type = "button";
    button.dataset.category = category.id;
    button.setAttribute("aria-pressed", String(active));
    button.addEventListener("click", () => { categoryId = category.id; renderSamples(); select(`[data-category="${category.id}"]`).focus({ preventScroll: true }); });
    return button;
  });
  select("#sample-filters").replaceChildren(...filters);
  const samples = data.samples.filter((sample) => sample.category === categoryId);
  select("#sample-cards").replaceChildren(...samples.map(renderSample));
  const audioCount = samples.reduce((count, sample) => count + Number(Boolean(safeUrl(sample.reference.src))) + sample.outputs.filter((track) => safeUrl(track.src)).length, 0);
  select("#sample-status").textContent = audioCount ? `${samples.length} ${translate("sampleCount")} · ${audioCount} ${translate("configuredAudio")}` : translate("noAudio");
}

function comparisonBars(values, label) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 100 18");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${label}: ${values[0]} / ${values[1]}`);
  values.forEach((value, index) => {
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", "100");
    background.setAttribute("height", "6");
    background.setAttribute("y", String(index * 10));
    background.setAttribute("rx", "1.5");
    background.setAttribute("fill", "#f2f5ed");
    const foreground = background.cloneNode();
    foreground.setAttribute("width", String(value * 100));
    foreground.setAttribute("fill", index === 0 ? "#63916f" : "#c8d0bd");
    svg.append(background, foreground);
  });
  return svg;
}

function renderEvaluation() {
  const current = data.evaluations.find((evaluation) => evaluation.id === evaluationId);
  const tabs = data.evaluations.map((evaluation) => {
    const active = evaluation.id === evaluationId;
    const button = element("button", localize(evaluation.label), active ? "active" : "");
    button.type = "button";
    button.dataset.evaluation = evaluation.id;
    button.setAttribute("aria-pressed", String(active));
    button.addEventListener("click", () => { evaluationId = evaluation.id; renderEvaluation(); select(`[data-evaluation="${evaluation.id}"]`).focus({ preventScroll: true }); });
    return button;
  });
  select("#evaluation-tabs").replaceChildren(...tabs);
  select("#evaluation-title").textContent = localize(current.title);
  select("#evaluation-metric").textContent = localize(current.metric);
  select("#score-ours").textContent = String(current.headline[0]);
  select("#score-baseline").textContent = String(current.headline[1]);
  select("#score-model").textContent = current.model;
  select("#score-baseline-model").textContent = current.baseline;
  select("#evaluation-method").textContent = localize(current.method);
  select("#evaluation-caveat").textContent = localize(current.caveat);
  select("#table-model").textContent = current.model;
  select("#table-baseline").textContent = current.baseline;
  select("#table-caption").textContent = localize(current.title);
  const chart = current.rows.map((row) => {
    const item = element("div", undefined, "metric-row");
    const label = row[language];
    const values = element("span", undefined, "metric-values");
    values.append(element("strong", String(row.values[0])), document.createTextNode(` / ${row.values[1]}`));
    item.append(element("span", label), comparisonBars(row.values, label), values);
    return item;
  });
  select("#metric-chart").replaceChildren(...chart);
  const table = [...current.rows, { en: localize(current.metric), zh: localize(current.metric), values: current.headline }].map((row) => {
    const item = element("tr");
    const heading = element("th", row[language]);
    heading.scope = "row";
    item.append(heading, ...row.values.map((value) => element("td", String(value))));
    return item;
  });
  select("#metric-table").replaceChildren(...table);
}

function exportResults() {
  const current = data.evaluations.find((evaluation) => evaluation.id === evaluationId);
  const rows = [
    ["Study", current.title.en],
    ["Source", "Team-provided LiveTTS overview; historical internal evaluation; not independently verified"],
    ["Metric", current.model, current.baseline],
    ...current.rows.map((row) => [row.en, ...row.values]),
    [current.metric.en, ...current.headline],
    ["Method", current.method.en],
    ["Limitations", current.caveat.en],
  ];
  const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
  const link = element("a");
  link.href = url;
  link.download = `livetts-${current.id}-team-reported.csv`;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify(translate("exportDone"));
}

function openPlayground() {
  const url = safeUrl(config.spaceUrl);
  if (url) { window.open(url, "_blank", "noopener,noreferrer"); return; }
  select("#dialog-title").textContent = translate("demoTitle");
  select("#dialog-text").textContent = translate("demoText");
  select("#info-dialog").showModal();
}

function renderLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = language === "zh" ? "LiveTTS · 一个音色，无限表达。" : "LiveTTS · One voice. Many possibilities.";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = translate(node.dataset.i18n); });
  const toggle = select("#language-toggle");
  toggle.replaceChildren(element(language === "en" ? "b" : "span", "EN"), element("span", "/"), element(language === "zh" ? "b" : "span", "中文"));
  toggle.setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
  select("#close-dialog").setAttribute("aria-label", translate("close"));
  select("#release-label").textContent = language === "zh" ? config.releaseLabelZh : config.releaseLabel;
  renderSamples();
  renderEvaluation();
}

function renderHeroWave() {
  const svg = select("#hero-wave");
  for (let index = 0; index < 150; index += 1) {
    const fraction = index / 149;
    const envelope = Math.sin(fraction * Math.PI) ** 1.5;
    const height = 2 + envelope * (10 + 71 * Math.abs(Math.sin(index * .33) * Math.cos(index * .13)));
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(index * 6.4));
    rect.setAttribute("y", String((100 - height) / 2));
    rect.setAttribute("width", "2.4");
    rect.setAttribute("height", String(height));
    rect.setAttribute("rx", "1.2");
    rect.setAttribute("fill", fraction > .62 ? "#d4b38a" : "#a8d9bd");
    rect.setAttribute("opacity", String(.25 + envelope * .65));
    svg.append(rect);
  }
}

select("#language-toggle").addEventListener("click", () => {
  language = language === "en" ? "zh" : "en";
  try { localStorage.setItem("livetts-research-language", language); } catch {}
  renderLanguage();
});
select("#stop-audio").addEventListener("click", pauseAudio);
select("#download-results").addEventListener("click", exportResults);
select("#hero-demo").addEventListener("click", openPlayground);
select("#resource-demo").addEventListener("click", openPlayground);
select("#close-dialog").addEventListener("click", () => select("#info-dialog").close());
select("#info-dialog").addEventListener("click", (event) => {
  if (event.target !== select("#info-dialog")) return;
  const bounds = event.target.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.target.close();
});
window.addEventListener("pagehide", pauseAudio);
setExternalLink("#repository-link", config.repositoryUrl);
setExternalLink("#paper-link", config.technicalReportUrl);
setExternalLink("#contact-link", config.contactUrl, true);
renderHeroWave();
renderLanguage();

const navigationObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    document.querySelectorAll(".section-nav a").forEach((link) => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
    });
  }
}, { rootMargin: "-70px 0px -65% 0px", threshold: 0 });
document.querySelectorAll("#overview, #capabilities, #samples, #evaluation, #resources").forEach((section) => navigationObserver.observe(section));
