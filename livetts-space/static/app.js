const select = (selector) => document.querySelector(selector);
const staticPreview = document.documentElement.dataset.staticPreview === "true";
const translations = {
  en: {
    skip: "Skip to playground", playground: "Playground", about: "About LiveTTS", api: "API", research: "Research preview",
    eyebrow: "A LITTLE TEXT. A LOT OF EXPRESSION.", hero1: "Words, brought", hero2: "to ", hero3: "life.",
    heroDescription: "A new voice for your ideas. Explore speech synthesis from the LiveTTS team at JD — one sentence at a time.",
    studioTitle: "The speech studio", studioCaption: "YOUR WORDS. A NEW WAY TO HEAR THEM.", connecting: "Checking demo availability…",
    setup: "Setup details", yourText: "Your text", mixed: "Mixed", textHint: "Write something worth listening to.", clear: "Clear",
    privacyShort: "Please don’t include confidential information.", generate: "Generate speech", generating: "Generating",
    voiceSettings: "Voice settings", selectedVoice: "SELECTED VOICE", voicePreview: "Configure an approved API voice", voice: "Voice",
    speed: "Speaking speed", natural: "Default", model: "Model", output: "Output", accessCode: "Demo access code",
    voiceDisclaimer: "A curated voice collection. Public audio uploads are not enabled in this demo.",
    yourAudio: "Your audio", waiting: "WAITING FOR YOUR WORDS", download: "Download WAV", waveformCaption: "A little silence before something good.",
    audioDetail: "Generated audio will appear here. Nothing is played automatically.", generatedIn: "Generated in", readyAudio: "READY TO LISTEN",
    recent: "This session", clearHistory: "Clear history", historyNote: "Up to 5 clips, in browser memory only. Refreshing clears this session.",
    inspiration: "Start with a little inspiration", inspirationCaption: "PICK A PROMPT. MAKE IT YOURS.", storyType: "STORYTELLING",
    storyTitle: "A moment of wonder", storyText: "“At the end of the street, a tiny bookshop kept its lights on just a little longer…”",
    chineseType: "EVERYDAY MOMENTS", chineseTitle: "日常的一点温柔", chineseText: "“今天的风刚刚好。忙完手头的事，就去楼下走走吧，给自己留一点慢下来的时间。”",
    mixedType: "CODE-SWITCHING", mixedTitle: "Across languages", mixedText: "“Welcome to a brand new day. 今天，也给自己一个小小的期待。Let’s make it a good one.”",
    exampleDisclaimer: "Prompts are for exploration, not benchmark results. Language and voice quality depend on the configured model.",
    behindVoice: "BEHIND THE VOICE", aboutTitle1: "Built from scratch.", aboutTitle2: "Made to be heard.",
    aboutDescription: "LiveTTS is a text-to-speech model developed by the LiveTTS team at JD. This playground is a space to explore its voice, with your own words.",
    exploreApi: "Explore the demo API", contact: "Contact the team", principle1: "Your text, not a canned recording.",
    principle1Text: "Every synthesis request goes to the configured LiveTTS API. There are no substitute voices or simulated results.",
    principle2: "A preview, not a performance claim.", principle2Text: "Listen for yourself. This demo does not claim a benchmark ranking or a verified human-preference score.",
    principle3: "Thoughtfully shared voices.", principle3Text: "Only team-approved presets are available. Reference-audio upload and public voice cloning are not enabled.",
    footer: "A research preview by the LiveTTS team at JD.", privacy: "Privacy & responsible use", play: "Play generated speech", pause: "Pause generated speech",
    seek: "Audio position", close: "Close dialog", preview: "Preview mode · The LiveTTS API is not connected. No audio generation or API charges.",
    online: "API enabled · Requests use the configured LiveTTS model. Shared usage limits apply.",
    configFailed: "Could not check API availability. Refresh the page to try again.", limits: "Demo details", loadingVoice: "Studio · Preview",
    setupTitle: "Connect the voice behind the page.", setupIntro: "This interface is ready to explore, but real audio is intentionally disabled until the Space owner configures the LiveTTS backend.",
    setupStep1: "In Hugging Face Space Settings, add LIVETTS_API_KEY as a Secret. Never put it in public files or browser code.",
    setupStep2: "Set LIVETTS_MODEL_VERSION and LIVETTS_VOICES_JSON to a tested model version and a list of approved voices.",
    setupStep3: "Set usage limits, optionally add LIVETTS_DEMO_PASSWORD as a Secret, then set LIVETTS_DEMO_ENABLED=true. Restart the Space.",
    setupTail: "The README includes deployment instructions. No credentials from the developer’s machine are bundled with this page.",
    detailsTitle: "A small, intentional research demo.", detailsText: "Text is sent to the LiveTTS backend. The Space buffers the full result before playback; the displayed generation time is not streaming time-to-first-audio. Public requests share a global quota and a concurrency limit.",
    apiTitle: "A voice, a few lines away.", apiIntro: "This is the endpoint of this demo Space, not documentation for the production LiveTTS API. The same voice allowlist and shared usage limits apply.",
    apiInactive: "The endpoint returns 503 until the owner connects and enables the API.", apiProtected: "This demo requires an access code. Set DEMO_ACCESS_CODE locally; never share it in a public notebook.",
    apiTiming: "Returns a mono, 24 kHz, 16-bit WAV file after synthesis completes. This demo does not stream playback. API credentials remain on the server.",
    copy: "Copy example", copied: "Copied to clipboard", copyFailed: "Copy failed. Select and copy the example manually.",
    privacyTitle: "Shared thoughtfully. Used responsibly.",
    privacyText1: "Your text and selected voice are sent to the configured LiveTTS backend to generate speech. Do not submit confidential, personal, or sensitive information. The backend operator’s processing and retention policies also apply.",
    privacyText2: "This demo application does not write prompts or generated audio to disk or application logs. It holds up to five clips in your browser’s memory; refreshing or clearing history removes them. Hosting and upstream infrastructure may keep operational logs.",
    privacyText3: "Only approved preset voices are available. Do not use generated speech to impersonate people, mislead listeners, or infringe someone’s rights. Reference-audio uploads and public voice registration are disabled.",
    privacyText4: "Only your interface-language preference is stored locally. API keys never enter the browser. Demo access codes are held only in the current page, not in browser storage.",
    promptLoaded: "Prompt added — make it yours.", networkError: "Connection failed. Check your connection before trying again. The request was not automatically retried.",
    timeout: "Generation timed out. It may have consumed API quota. No automatic retry was made.",
    not_configured: "Audio generation is not enabled yet. The Space owner needs to connect and enable the API.", unauthorized: "The access code is missing or incorrect.",
    rate_limit: "The demo’s shared per-minute limit has been reached. Please wait a minute.", daily_limit: "The demo’s daily allowance has been used. Please try another day.",
    busy: "All generation slots are busy. Please try again shortly.", upstream_failed: "The LiveTTS backend could not complete this request. No automatic retry was made.",
    invalid_request: "Check the text, voice, and speed settings.", invalid_text: "Enter some text within the character limit.", invalid_voice: "This voice is not available. Refresh and choose an approved voice.",
    request_too_large: "This request is too large.", origin_rejected: "This request’s origin is not allowed.", genericError: "Something went wrong. Please try again later.",
    playbackError: "Your browser could not play this clip. Try downloading the WAV file.", connectionSlow: "Connecting…",
  },
  zh: {
    skip: "跳转到体验区", playground: "语音体验", about: "关于 LiveTTS", api: "API", research: "研究预览",
    eyebrow: "寥寥文字，声声有意。", hero1: "让文字，", hero2: "有", hero3: "声有色。",
    heroDescription: "给灵感一个声音。来自京东 LiveTTS 团队的语音合成体验，从你写下的第一句话开始。",
    studioTitle: "声音工作室", studioCaption: "你的文字，换一种方式听见。", connecting: "正在检查服务状态…",
    setup: "查看接入说明", yourText: "写下你的文字", mixed: "中英混合", textHint: "写点你想听见的话。", clear: "清空",
    privacyShort: "请勿输入机密或敏感信息。", generate: "生成语音", generating: "正在生成",
    voiceSettings: "声音设置", selectedVoice: "当前音色", voicePreview: "等待配置获授权的 API 音色", voice: "选择音色",
    speed: "语速", natural: "默认", model: "模型", output: "输出", accessCode: "体验访问码",
    voiceDisclaimer: "仅展示经团队授权的音色。本体验页不开放参考音频上传。",
    yourAudio: "你的声音作品", waiting: "等待文字变成声音", download: "下载 WAV", waveformCaption: "好声音之前，先留一点安静。",
    audioDetail: "生成的音频会出现在这里，不会自动播放。", generatedIn: "合成耗时", readyAudio: "可以试听了",
    recent: "本次体验", clearHistory: "清空记录", historyNote: "最多保留 5 条，仅存在当前页面内存中，刷新后清空。",
    inspiration: "从一点灵感开始", inspirationCaption: "选一段文字，改成你的故事。", storyType: "故事旁白",
    storyTitle: "一点奇妙的想象", storyText: "“At the end of the street, a tiny bookshop kept its lights on just a little longer…”",
    chineseType: "日常片刻", chineseTitle: "日常的一点温柔", chineseText: "“今天的风刚刚好。忙完手头的事，就去楼下走走吧，给自己留一点慢下来的时间。”",
    mixedType: "语种切换", mixedTitle: "在语言之间", mixedText: "“Welcome to a brand new day. 今天，也给自己一个小小的期待。Let’s make it a good one.”",
    exampleDisclaimer: "示例仅用于探索，不代表评测结果。语种及音色表现取决于实际配置的模型。",
    behindVoice: "声音背后", aboutTitle1: "从零训练，", aboutTitle2: "只为被你听见。",
    aboutDescription: "LiveTTS 是京东 LiveTTS 团队自主研发的语音合成模型。在这里，用你自己的文字，探索它的声音。",
    exploreApi: "查看体验页 API", contact: "联系团队", principle1: "你写的文字，不是预制录音。",
    principle1Text: "每一次合成都请求所配置的 LiveTTS 接口，不使用替代模型，也不模拟生成结果。",
    principle2: "是体验，不是性能承诺。", principle2Text: "好不好听，由你来判断。本页面不宣称任何榜单名次或经验证的人类偏好得分。",
    principle3: "有边界地分享声音。", principle3Text: "仅开放团队授权的预置音色，不开放参考音频上传及公共声音注册。",
    footer: "来自京东 LiveTTS 团队的研究预览。", privacy: "隐私与负责任使用", play: "播放生成的语音", pause: "暂停播放",
    seek: "播放进度", close: "关闭弹窗", preview: "界面预览模式 · 尚未接入 LiveTTS API，不生成音频，也不消耗调用额度。",
    online: "API 已启用 · 生成请求将发送到配置的 LiveTTS 模型，受共享额度限制。",
    configFailed: "暂时无法确认 API 状态，请刷新页面重试。", limits: "体验说明", loadingVoice: "默认音色 · 界面预览",
    setupTitle: "让界面，接上真实的声音。", setupIntro: "你可以先体验界面。为避免误用密钥和额度，只有 Space 管理者完成配置后，才会启用真实语音合成。",
    setupStep1: "在 Hugging Face Space 的 Settings 中，将 LIVETTS_API_KEY 添加为 Secret，不要写入公开文件或浏览器代码。",
    setupStep2: "配置 LIVETTS_MODEL_VERSION 和 LIVETTS_VOICES_JSON，使用已测试的模型版本和获准公开的音色列表。",
    setupStep3: "设置调用限额，可选添加 Secret：LIVETTS_DEMO_PASSWORD，再设置 LIVETTS_DEMO_ENABLED=true 并重启 Space。",
    setupTail: "README 内有完整部署说明。本页面不包含开发者电脑上的任何调用凭证。",
    detailsTitle: "小而有边界的研究体验。", detailsText: "输入文本会发送到 LiveTTS 后端。本页面在完整合成后提供播放，展示的合成耗时不是流式首音频延迟。所有访客共享调用额度与并发限制。",
    apiTitle: "几行代码，让文字开口。", apiIntro: "这是当前体验页的接口示例，不是生产环境 LiveTTS API 文档。它同样遵守公开音色白名单和共享调用限额。",
    apiInactive: "管理者完成接入并启用前，此接口会返回 503。", apiProtected: "此体验需要访问码。请在本地设置 DEMO_ACCESS_CODE，不要在公开笔记本中分享。",
    apiTiming: "合成完成后返回单声道、24 kHz、16 位 WAV 文件。本体验页不提供边生成边播放，API 密钥仅保留在服务端。",
    copy: "复制示例", copied: "已复制到剪贴板", copyFailed: "复制失败，请手动选中示例复制。",
    privacyTitle: "认真分享，也负责任地使用。",
    privacyText1: "输入文字及选定的音色会发送到所配置的 LiveTTS 后端。请勿提交机密、个人隐私或敏感信息，后端运营方的处理与保留政策同样适用。",
    privacyText2: "体验页应用不会将输入文字或生成音频写入磁盘或应用日志。最多 5 条音频保留在浏览器页面内存中，刷新或清空记录即移除。托管平台与上游服务可能保留运行日志。",
    privacyText3: "仅使用获授权的音色。请勿利用生成语音冒充他人、误导听众或侵害他人权益。本页面不开放参考音频上传或公共声音注册。",
    privacyText4: "本地存储仅保存界面语言偏好。API 密钥不会进入浏览器；体验访问码仅保留在当前页面，不写入浏览器持久存储。",
    promptLoaded: "已填入示例，改成你自己的故事吧。", networkError: "连接失败，请检查网络。请求未自动重试。",
    timeout: "合成超时，可能已消耗调用额度，未自动重试。",
    not_configured: "尚未启用语音生成，请由 Space 管理者配置并开启 API。", unauthorized: "访问码为空或不正确。",
    rate_limit: "体验页的共享每分钟限额已用完，请稍等一分钟。", daily_limit: "今日共享体验额度已用完，请改日再试。",
    busy: "当前合成通道已满，请稍后再试。", upstream_failed: "LiveTTS 后端未能完成本次合成，请求未自动重试。",
    invalid_request: "请检查文字、音色与语速设置。", invalid_text: "请输入有效文字，且不要超过字数限制。", invalid_voice: "此音色暂不可用，请刷新并重新选择。",
    request_too_large: "请求内容过大。", origin_rejected: "不允许来自此来源的请求。", genericError: "出现异常，请稍后重试。",
    playbackError: "浏览器无法播放此音频，你可以尝试下载 WAV 文件。", connectionSlow: "正在连接…",
  },
};

if (staticPreview) {
  Object.assign(translations.en, {
    preview: "Static preview · Audio placeholders only. No API connection, synthesis, or API charges.",
    principle1Text: "This static preview does not generate speech or substitute recordings. Real synthesis requires a server-side LiveTTS API connection.",
    setupTitle: "A preview now. Real voices later.",
    setupIntro: "This is a free Static Space, not a running Docker service. Adding a Secret alone cannot enable generation here.",
    setupStep1: "The owner can deploy the included Docker backend on supported hosting, or connect a separately hosted backend with authentication and usage limits.",
    setupStep2: "Keep API keys on the backend, never in static files. Configure an approved model and voice list on that server.",
    setupStep3: "Verify the actual API integration before enabling synthesis. Hugging Face currently requires an eligible plan to create Docker Spaces.",
    privacyText1: "In this static preview, your entered text stays in the current page. No synthesis request or audio upload is sent.",
    privacyText2: "The audio area is an empty placeholder. No generated audio is stored. The hosting platform may retain normal access logs.",
  });
  Object.assign(translations.zh, {
    preview: "静态预览版 · 音频区域为空占位，未接入 API，不生成音频，也不消耗调用额度。",
    principle1Text: "当前静态预览版不生成语音，也不使用其他录音替代模型输出。真实合成需要连接服务端 LiveTTS API。",
    setupTitle: "先展示界面，再接入真实声音。",
    setupIntro: "当前是免费的 Static Space，不是运行中的 Docker 服务。仅添加 Secret 不能在这里开启生成。",
    setupStep1: "管理者可将已提供的 Docker 后端部署到支持的环境，或另行接入具备鉴权和限额的服务端代理。",
    setupStep2: "API 密钥只能保存在后端，不能写入静态文件。在服务端配置已授权的模型版本和音色列表。",
    setupStep3: "完成真实联调后再启用合成。目前 Hugging Face 创建 Docker Space 需要符合要求的付费方案。",
    privacyText1: "当前静态预览版中，你输入的文字仅保留在当前页面，不会发送合成请求，也不会上传音频。",
    privacyText2: "音频区域是空占位，不保存生成音频。托管平台可能保留常规访问日志。",
  });
}

const prompts = {
  english: "Some ideas are better heard than read. A quiet story, a familiar greeting, a thought that makes you smile. Give your words a voice, and see where they take you.",
  story: "At the end of the street, a tiny bookshop kept its lights on just a little longer. Inside, a girl opened a book with no title. On the first page, in very small letters, it said: welcome back. We have been waiting for you.",
  chinese: "今天的风刚刚好。忙完手头的事，就去楼下走走吧，给自己留一点慢下来的时间。也许转过街角，你就会遇见一家没去过的小店，或者一只正晒着太阳的猫。生活里的惊喜，往往就藏在这些普通的时刻。",
  mixed: "Welcome to a brand new day. 今天，也给自己一个小小的期待。Take a deep breath，放慢脚步，让每一个普通的瞬间，都变得有一点不一样。Let’s make it a good one.",
};

let language = "en";
try { language = localStorage.getItem("livetts-language") === "zh" ? "zh" : "en"; } catch {}
let config = { ready: false, voices: [], max_characters: 500, password_required: false };
let configLoaded = false;
let configError = false;
let busy = false;
let activeClip = null;
let clips = [];
let errorCode = "";
let toastTimeout;
let generationTimer;
let animationFrame;
const audio = select("#audio");
const textInput = select("#text-input");
const translate = (key) => translations[language][key] || translations.en[key] || key;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon");
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#i-${name}`);
  svg.append(use);
  return svg;
}

function voiceName(voice) {
  return (language === "zh" && voice?.name_zh) || voice?.name || "Studio";
}

function updateTextState() {
  const count = Array.from(textInput.value).length;
  select("#character-count").textContent = `${count} / ${config.max_characters}`;
  select("#character-count").classList.toggle("over-limit", count > config.max_characters);
  select("#generate-button").disabled = busy || !config.ready || !textInput.value.trim() || count > config.max_characters;
}

function updateVoice() {
  const voice = config.voices.find((item) => item.id === select("#voice-select").value);
  select("#voice-title").textContent = voiceName(voice);
  select("#voice-description").textContent = voice ? ((language === "zh" && voice.description_zh) || voice.description || "LiveTTS") : translate("voicePreview");
}

function renderVoices() {
  const currentId = select("#voice-select").value;
  select("#voice-select").replaceChildren();
  if (!config.voices.length) {
    select("#voice-select").add(new Option(translate("loadingVoice"), ""));
  } else {
    config.voices.forEach((voice) => select("#voice-select").add(new Option(voiceName(voice), voice.id)));
    if (config.voices.some((voice) => voice.id === currentId)) select("#voice-select").value = currentId;
  }
  select("#voice-select").disabled = busy || !config.voices.length;
  updateVoice();
}

function renderStatus() {
  const key = configError ? "configFailed" : !configLoaded ? "connecting" : config.ready ? "online" : "preview";
  select("#status-text").textContent = translate(key);
  select("#status-banner").classList.toggle("live", config.ready);
  select("#setup-button").textContent = translate(config.ready ? "limits" : "setup");
  select("#password-field").hidden = !config.password_required;
  select("#model-name").textContent = config.version ? `LiveTTS · ${config.version}` : "LiveTTS";
  select("#contact-link").hidden = !config.contact_url;
  if (config.contact_url) select("#contact-link").href = config.contact_url;
}

function applyLanguage() {
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.title = language === "zh" ? "LiveTTS — 让文字，有声有色。" : "LiveTTS — Words, brought to life.";
  document.querySelectorAll("[data-i18n]").forEach((node) => { node.textContent = translate(node.dataset.i18n); });
  select("#language-en").classList.toggle("selected", language === "en");
  select("#language-zh").classList.toggle("selected", language === "zh");
  select("#language-toggle").setAttribute("aria-label", language === "en" ? "Switch to Chinese" : "Switch to English");
  select("#speed-input").setAttribute("aria-label", translate("speed"));
  select("#seek-input").setAttribute("aria-label", translate("seek"));
  select("#close-dialog").setAttribute("aria-label", translate("close"));
  renderStatus();
  renderVoices();
  updateTextState();
  renderAudio();
  renderHistory();
  if (errorCode) showError(errorCode);
}

function toast(message) {
  clearTimeout(toastTimeout);
  select("#toast").textContent = message;
  select("#toast").hidden = false;
  toastTimeout = setTimeout(() => { select("#toast").hidden = true; }, 2600);
}

function showError(code) {
  errorCode = code;
  select("#error-banner").hidden = !code;
  select("#error-banner").textContent = code ? translate(code in translations.en ? code : "genericError") : "";
}

function setPrompt(name, notify = false) {
  if (busy) return;
  textInput.value = prompts[name];
  const tabName = name === "story" ? "english" : name;
  document.querySelectorAll("[data-prompt]").forEach((button) => {
    const selected = button.dataset.prompt === tabName;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateTextState();
  showError("");
  if (notify) {
    select("#playground").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    textInput.focus({ preventScroll: true });
    toast(translate("promptLoaded"));
  }
}

function openDialog(title, nodes) {
  select("#dialog-title").textContent = title;
  select("#dialog-body").replaceChildren(...nodes);
  select("#info-dialog").showModal();
}

function showSetup() {
  if (config.ready) {
    openDialog(translate("detailsTitle"), [element("p", translate("detailsText"))]);
    return;
  }
  const steps = element("ol");
  ["setupStep1", "setupStep2", "setupStep3"].forEach((key) => steps.append(element("li", translate(key))));
  openDialog(translate("setupTitle"), [element("p", translate("setupIntro")), steps, element("p", translate("setupTail"))]);
}

function showApi() {
  if (staticPreview) { showSetup(); return; }
  const voiceId = config.voices[0]?.id || "studio";
  const passwordHeader = config.password_required ? '  -H "X-Demo-Password: $DEMO_ACCESS_CODE" \\\n' : "";
  const example = `curl --fail-with-body "${location.origin}/api/generate" \\\n  -H "Content-Type: application/json" \\\n${passwordHeader}  --data '${JSON.stringify({ text: "Hello from LiveTTS.", voice_id: voiceId, speed: 1.0 }, null, 2)}' \\\n  --output livetts.wav`;
  const code = element("code", example);
  const pre = element("pre");
  pre.append(code);
  const copyButton = element("button", undefined, "copy-button");
  copyButton.append(icon("copy"), element("span", translate("copy")));
  copyButton.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(example); toast(translate("copied")); }
    catch { toast(translate("copyFailed")); }
  });
  const nodes = [element("p", translate("apiIntro"))];
  if (!config.ready) nodes.push(element("p", translate("apiInactive")));
  if (config.password_required) nodes.push(element("p", translate("apiProtected")));
  nodes.push(pre, copyButton, element("p", translate("apiTiming")));
  openDialog(translate("apiTitle"), nodes);
}

function formatTime(seconds) {
  const safe = Math.max(0, Number.isFinite(seconds) ? seconds : 0);
  return `${Math.floor(safe / 60)}:${String(Math.floor(safe % 60)).padStart(2, "0")}`;
}

function updatePlayButton() {
  const playing = !audio.paused;
  select("#play-button").replaceChildren(icon(playing ? "pause" : "play"));
  select("#play-button").classList.toggle("playing", playing);
  select("#play-button").setAttribute("aria-label", translate(playing ? "pause" : "play"));
}

function renderAudio() {
  select("#play-button").disabled = !activeClip || busy;
  select("#seek-input").disabled = !activeClip;
  select("#download-button").setAttribute("aria-disabled", String(!activeClip));
  select("#download-button").tabIndex = activeClip ? 0 : -1;
  select("#waveform-caption").hidden = Boolean(activeClip);
  select("#audio-stats").hidden = !activeClip;
  select("#audio-state").textContent = translate(busy ? "generating" : activeClip ? "readyAudio" : "waiting");
  if (activeClip) {
    select("#download-button").href = activeClip.url;
    select("#download-button").download = `livetts-${activeClip.id}.wav`;
    select("#audio-detail").textContent = `${voiceName(activeClip.voice)} · ${activeClip.speed.toFixed(2)}× · WAV`;
    select("#generation-time").textContent = `${activeClip.generationSeconds.toFixed(2)} s`;
  } else {
    select("#download-button").removeAttribute("href");
    select("#audio-detail").textContent = translate("audioDetail");
  }
  updatePlayButton();
  updateProgress();
}

function updateProgress() {
  const duration = activeClip?.duration || 0;
  const current = activeClip ? audio.currentTime || 0 : 0;
  select("#player-time").replaceChildren(document.createTextNode(formatTime(current)), element("span", `/ ${formatTime(duration)}`));
  select("#seek-input").value = duration ? String(current / duration * 1000) : "0";
  select("#seek-input").setAttribute("aria-valuetext", `${formatTime(current)} / ${formatTime(duration)}`);
  drawWaveform();
}

function drawWaveform() {
  const canvas = select("#waveform");
  const bounds = canvas.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const width = Math.max(1, Math.round(bounds.width * ratio));
  const height = Math.max(1, Math.round(bounds.height * ratio));
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const context = canvas.getContext("2d");
  context.clearRect(0, 0, width, height);
  const count = Math.max(1, Math.floor(bounds.width / 5));
  const progress = activeClip?.duration ? audio.currentTime / activeClip.duration : 0;
  for (let index = 0; index < count; index += 1) {
    const peak = activeClip?.peaks?.[Math.floor(index / count * activeClip.peaks.length)] || 0;
    const barHeight = activeClip ? Math.max(3 * ratio, peak * height * 0.88) : 3 * ratio;
    context.fillStyle = activeClip ? (index / count < progress ? "#bf573b" : "#bcc5ac") : "#e2e6d9";
    context.beginPath();
    context.roundRect(index * width / count, (height - barHeight) / 2, 2 * ratio, barHeight, ratio);
    context.fill();
  }
}

async function extractPeaks(blob) {
  let context;
  try {
    context = new AudioContext();
    const decoded = await context.decodeAudioData(await blob.arrayBuffer());
    const samples = decoded.getChannelData(0);
    const peaks = Array.from({ length: 320 }, (_, index) => {
      const start = Math.floor(index * samples.length / 320);
      const end = Math.max(start + 1, Math.floor((index + 1) * samples.length / 320));
      let peak = 0;
      for (let offset = start; offset < end; offset += 1) peak = Math.max(peak, Math.abs(samples[offset] || 0));
      return peak;
    });
    const maximum = Math.max(...peaks, 0.01);
    return peaks.map((peak) => peak / maximum);
  } catch { return []; }
  finally { if (context) await context.close().catch(() => {}); }
}

function loadClip(clip) {
  audio.pause();
  activeClip = clip;
  audio.src = clip.url;
  audio.load();
  renderAudio();
  renderHistory();
}

function renderHistory() {
  select("#history-section").hidden = !clips.length;
  const nodes = clips.map((clip) => {
    const button = element("button", undefined, `history-item${activeClip?.id === clip.id ? " active" : ""}`);
    button.type = "button";
    button.disabled = busy;
    button.append(icon("play"), element("span", clip.text), element("span", `${voiceName(clip.voice)} · ${formatTime(clip.duration)}`));
    button.addEventListener("click", () => loadClip(clip));
    return button;
  });
  select("#history-list").replaceChildren(...nodes);
}

function clearHistory() {
  if (busy) return;
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
  clips.forEach((clip) => URL.revokeObjectURL(clip.url));
  clips = [];
  activeClip = null;
  renderAudio();
  renderHistory();
}

function setBusy(value) {
  busy = value;
  select("#generate-button").classList.toggle("loading", value);
  select("#generation-form").setAttribute("aria-busy", String(value));
  textInput.readOnly = value;
  select("#speed-input").disabled = value;
  select("#voice-select").disabled = value || !config.voices.length;
  select("#clear-text").disabled = value;
  select("#clear-history").disabled = value;
  document.querySelectorAll("[data-prompt], [data-example]").forEach((button) => { button.disabled = value; });
  clearInterval(generationTimer);
  if (value) {
    const started = performance.now();
    const update = () => { select("#generate-label").textContent = `${translate("generating")} · ${Math.floor((performance.now() - started) / 1000)}s`; };
    update();
    generationTimer = setInterval(update, 1000);
  } else { select("#generate-label").textContent = translate("generate"); }
  updateTextState();
  renderAudio();
  renderHistory();
}

async function generate(event) {
  event.preventDefault();
  if (select("#generate-button").disabled || busy) return;
  const voice = config.voices.find((item) => item.id === select("#voice-select").value);
  const text = textInput.value.trim();
  const speed = Number(select("#speed-input").value);
  audio.pause();
  showError("");
  setBusy(true);
  try {
    const headers = { "Content-Type": "application/json" };
    if (config.password_required) headers["X-Demo-Password"] = select("#demo-password").value;
    const response = await fetch("/api/generate", {
      method: "POST", headers,
      body: JSON.stringify({ text, voice_id: voice.id, speed }),
      signal: AbortSignal.timeout(130000),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      showError(data.error || "genericError");
      return;
    }
    if (!(response.headers.get("content-type") || "").startsWith("audio/wav")) {
      showError("upstream_failed");
      return;
    }
    const blob = await response.blob();
    const duration = Number(response.headers.get("X-Audio-Duration"));
    const generationSeconds = Number(response.headers.get("X-Generation-Seconds"));
    if (!blob.size || !Number.isFinite(duration) || duration <= 0 || !Number.isFinite(generationSeconds)) {
      showError("upstream_failed");
      return;
    }
    const peaks = await extractPeaks(blob);
    const clip = { id: Date.now(), text, voice, speed, blob, url: URL.createObjectURL(blob), duration, generationSeconds, peaks };
    clips.unshift(clip);
    loadClip(clip);
    if (clips.length > 5) { const oldClip = clips.pop(); URL.revokeObjectURL(oldClip.url); }
    renderHistory();
  } catch (error) {
    showError(error.name === "TimeoutError" || error.name === "AbortError" ? "timeout" : "networkError");
  } finally {
    setBusy(false);
  }
}

function drawHero() {
  const svg = select("#hero-wave");
  for (let index = 0; index < 62; index += 1) {
    const position = index / 61;
    const envelope = Math.sin(position * Math.PI) ** 1.2;
    const modulation = 0.2 + 0.8 * Math.abs(Math.sin(index * 0.46) * Math.cos(index * 0.12));
    const height = 5 + 119 * envelope * modulation;
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", String(3 + index * 5.8));
    rect.setAttribute("y", String((150 - height) / 2));
    rect.setAttribute("width", "3.4");
    rect.setAttribute("height", String(height));
    rect.setAttribute("rx", "1.7");
    rect.setAttribute("fill", position < 0.53 ? "#b9573f" : "#8b9676");
    rect.setAttribute("opacity", String(0.45 + envelope * 0.5));
    svg.append(rect);
  }
}

select("#generation-form").addEventListener("submit", generate);
textInput.addEventListener("input", updateTextState);
textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    if (!select("#generate-button").disabled) select("#generation-form").requestSubmit();
  }
});
select("#clear-text").addEventListener("click", () => { textInput.value = ""; updateTextState(); textInput.focus(); });
select("#voice-select").addEventListener("change", updateVoice);
select("#speed-input").addEventListener("input", (event) => { select("#speed-output").value = `${Number(event.target.value).toFixed(2)}×`; });
select("#language-toggle").addEventListener("click", () => {
  language = language === "en" ? "zh" : "en";
  try { localStorage.setItem("livetts-language", language); } catch {}
  applyLanguage();
});
document.querySelectorAll("[data-prompt]").forEach((button) => button.addEventListener("click", () => setPrompt(button.dataset.prompt)));
document.querySelectorAll("[data-example]").forEach((button) => button.addEventListener("click", () => setPrompt(button.dataset.example, true)));
select("#setup-button").addEventListener("click", showSetup);
select("#api-nav").addEventListener("click", showApi);
select("#api-about").addEventListener("click", showApi);
select("#privacy-button").addEventListener("click", () => openDialog(translate("privacyTitle"), [1, 2, 3, 4].map((number) => element("p", translate(`privacyText${number}`)))));
select("#close-dialog").addEventListener("click", () => select("#info-dialog").close());
select("#info-dialog").addEventListener("click", (event) => { if (event.target === select("#info-dialog")) { const bounds = event.target.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.target.close(); } });
select("#clear-history").addEventListener("click", clearHistory);
select("#play-button").addEventListener("click", async () => {
  if (!activeClip || busy) return;
  if (!audio.paused) { audio.pause(); return; }
  try { await audio.play(); } catch { showError("playbackError"); }
});
select("#seek-input").addEventListener("input", (event) => {
  if (activeClip && audio.readyState >= 1) { audio.currentTime = Number(event.target.value) / 1000 * activeClip.duration; updateProgress(); }
});
select("#download-button").addEventListener("click", (event) => { if (!activeClip) event.preventDefault(); });
audio.addEventListener("play", () => {
  updatePlayButton();
  const animate = () => { updateProgress(); if (!audio.paused) animationFrame = requestAnimationFrame(animate); };
  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(animate);
});
audio.addEventListener("pause", () => { cancelAnimationFrame(animationFrame); updatePlayButton(); updateProgress(); });
audio.addEventListener("ended", () => { updatePlayButton(); updateProgress(); });
audio.addEventListener("loadedmetadata", updateProgress);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("error", () => { if (activeClip && audio.getAttribute("src")) showError("playbackError"); });
new ResizeObserver(drawWaveform).observe(select("#waveform"));

drawHero();
applyLanguage();
const configuration = staticPreview
  ? Promise.resolve({ ready: false, voices: [], max_characters: 500, password_required: false })
  : fetch("/api/config", { signal: AbortSignal.timeout(10000) })
    .then((response) => { if (!response.ok) throw new Error("config"); return response.json(); });
configuration
  .then((data) => { config = data; configLoaded = true; textInput.maxLength = config.max_characters * 2; applyLanguage(); })
  .catch(() => { configError = true; configLoaded = true; applyLanguage(); });
