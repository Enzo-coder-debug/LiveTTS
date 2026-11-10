window.LIVETTS_DATA = {
  categories: [
    { id: "zeroshot", en: "Zero-shot cloning", zh: "零样本克隆" },
    { id: "expression", en: "Expressive speech", zh: "情感与副语言" },
    { id: "languages", en: "Cross-lingual", zh: "跨语种" },
    { id: "dialects", en: "Chinese dialects", zh: "地方方言" },
    { id: "longform", en: "Long-form", zh: "长文本" },
    { id: "specialty", en: "Beyond speech", zh: "拼读与歌声" },
  ],
  samples: [
    {
      id: "one-voice", category: "zeroshot", title: { en: "A small prompt. A familiar voice.", zh: "一小段参考，延续熟悉的声音。" },
      description: { en: "Listen for vocal identity and natural prosody across new sentences.", zh: "用新的句子，观察声纹、韵律与自然度的保持。" },
      tags: ["ZERO-SHOT", "ZH / EN"],
      reference: { src: "", transcript: "", label: { en: "Reference voice", zh: "参考音色" } },
      outputs: [
        { label: { en: "Mandarin · Everyday moments", zh: "普通话 · 日常片刻" }, language: "zh-CN", text: "今天的风刚刚好。忙完手头的事，就去楼下走走吧，给自己留一点慢下来的时间。", src: "", model: "", settings: "", illustrative: true },
        { label: { en: "English · A little wonder", zh: "英语 · 一点小小的惊喜" }, language: "en", text: "Some ideas are better heard than read. A quiet story, a familiar greeting, a thought that makes you smile.", src: "", model: "", settings: "", illustrative: true },
      ],
    },
    {
      id: "emotional-range", category: "expression", title: { en: "Same words. A different feeling.", zh: "同一句话，不同的心情。" },
      description: { en: "Compare expressive intent while keeping the wording unchanged.", zh: "固定文本，只改变情感意图，比较表达差异。" },
      tags: ["INSTRUCTION", "EMOTION"],
      reference: { src: "", transcript: "", label: { en: "Shared voice reference", zh: "共同参考音色" } },
      outputs: [
        { label: { en: "Warm", zh: "温暖" }, language: "zh-CN", text: "你终于来了。我一直在这里，等你一起出发。", src: "", model: "", settings: "", illustrative: true },
        { label: { en: "Excited", zh: "高兴" }, language: "zh-CN", text: "你终于来了。我一直在这里，等你一起出发。", src: "", model: "", settings: "", illustrative: true },
        { label: { en: "Sad", zh: "悲伤" }, language: "zh-CN", text: "你终于来了。我一直在这里，等你一起出发。", src: "", model: "", settings: "", illustrative: true },
      ],
    },
    {
      id: "audio-tags", category: "expression", title: { en: "The things between the words.", zh: "文字之外，也有表达。" },
      description: { en: "Paralinguistic cues such as laughter and sighs, embedded directly in text.", zh: "在文字中插入大笑、叹气等副语言标签。" },
      tags: ["AUDIO TAGS", "ZH"],
      reference: { src: "", transcript: "", label: { en: "Voice reference", zh: "参考音色" } },
      outputs: [
        { label: { en: "Laughter & sigh", zh: "大笑与叹气" }, language: "zh-CN", text: "他听完愣了一下，<laughter>然后摇了摇头<sigh>。", src: "", model: "", settings: "", illustrative: true },
      ],
    },
    {
      id: "across-languages", category: "languages", title: { en: "One voice, across languages.", zh: "跨越语言，还是同一个你。" },
      description: { en: "Explore pronunciation and speaker identity across language boundaries.", zh: "在不同语言之间，观察发音表现与原始音色保持。" },
      tags: ["CROSS-LINGUAL", "VOICE IDENTITY"],
      reference: { src: "", transcript: "", label: { en: "Shared voice reference", zh: "共同参考音色" } },
      outputs: [
        { label: { en: "English", zh: "英语" }, language: "en", text: "Every new day is a chance to discover something beautiful. Let's take the first step together.", src: "", model: "", settings: "", illustrative: true },
        { label: { en: "Japanese", zh: "日语" }, language: "ja", text: "新しい一日が始まります。今日は、どんな素敵なことに出会えるでしょう。", src: "", model: "", settings: "", illustrative: true },
        { label: { en: "Chinese + English", zh: "中英混合" }, language: "zh-CN", text: "Welcome to a brand new day. 今天，也给自己一个小小的期待。Let’s make it a good one.", src: "", model: "", settings: "", illustrative: true },
      ],
    },
    {
      id: "local-voices", category: "dialects", title: { en: "A sense of place. The same identity.", zh: "乡音不同，音色不变。" },
      description: { en: "Change dialect without changing the reference speaker.", zh: "使用同一个参考说话人，对比不同方言的合成表现。" },
      tags: ["DIALECT CONTROL", "ZH"],
      reference: { src: "", transcript: "", label: { en: "Shared voice reference", zh: "共同参考音色" } },
      outputs: [
        { label: { en: "Sichuan dialect", zh: "四川话" }, language: "zh-CN", text: "今天的太阳好安逸哦，走嘛，出去喝碗茶，摆一会儿龙门阵。", src: "", model: "", settings: "", illustrative: true },
        { label: { en: "Cantonese", zh: "粤语" }, language: "zh-HK", text: "今天天氣咁好，不如出去行吓，飲杯茶，慢慢傾。", src: "", model: "", settings: "", illustrative: true },
      ],
    },
    {
      id: "long-story", category: "longform", title: { en: "A voice that stays with the story.", zh: "让声音，陪故事走得更远。" },
      description: { en: "A listening slot for a complete long-form sample, not an isolated highlight.", zh: "为完整长音频预留展示位，不只截取某一句高光片段。" },
      tags: ["LONG CONTEXT", "NARRATION"],
      reference: { src: "", transcript: "", label: { en: "Narrator reference", zh: "旁白参考音色" } },
      outputs: [
        { label: { en: "Storytelling · Full sample", zh: "故事旁白 · 完整样例" }, language: "zh-CN", text: "街角的书店总比别处晚一点熄灯。林夏推开门的时候，雨刚刚停下，空气里混着纸张和泥土的气味。店主从书后抬起头，指了指窗边的座位。\n\n“你找的那本书，今天刚到。”他说。\n\n林夏愣住了。她从来没有告诉过任何人，自己在找一本什么样的书。她走到桌边，翻开封面。第一页只写着一句话：有些故事，要等到你准备好了，才会开始。", src: "", model: "", settings: "", illustrative: true },
      ],
    },
    {
      id: "phonetics", category: "specialty", title: { en: "Down to the sound of a syllable.", zh: "细到一个音节的表达。" },
      description: { en: "Phonetic spelling for Chinese learning; separate slots for singing conversion and humming can be added after clearance.", zh: "面向中文教学的声韵母拼读；歌声转换与哼唱可在素材授权后补充。" },
      tags: ["PHONETICS", "EDUCATION"],
      reference: { src: "", transcript: "", label: { en: "Teaching voice", zh: "教学音色" } },
      outputs: [
        { label: { en: "Initial, final, syllable", zh: "声母、韵母、整体拼读" }, language: "zh-CN", text: "zh，ōng，zhōng。中，中国的中。", src: "", model: "", settings: "", illustrative: true },
      ],
    },
  ],
  evaluations: [
    {
      id: "general", label: { en: "General speech", zh: "通用场景" }, title: { en: "JoyAI · General speech evaluation", zh: "JoyAI · 通用场景评测" },
      model: "JoyAI Zeroshot V2.7.1", baseline: "MiniMax Speech 2.8HD", headline: [0.74, 0.64],
      metric: { en: "Reported weighted score", zh: "原稿报告加权总分" },
      method: { en: "Six dimensions, weighted 25 / 15 / 10 / 20 / 20 / 10%. Listening counts reported separately: 205 wins, 79 ties, 96 losses. Panel size and confidence intervals were not supplied.", zh: "六维权重为 25 / 15 / 10 / 20 / 20 / 10%。另报告听评计数：胜 205、平 79、负 96。原稿未提供评审人数及置信区间。" },
      caveat: { en: "The published aggregate is reproduced as supplied. Recomputing from rounded dimension scores may differ; raw ratings are needed to reconcile it. This does not establish a public leaderboard rank.", zh: "总分按原稿保留，使用已四舍五入的分项分数重算可能不一致，需要原始评分核对。不据此推导公开榜单排名。" },
      rows: [
        { en: "Pronunciation", zh: "发音准确性", values: [0.82, 0.88] },
        { en: "Fluency", zh: "流畅性", values: [0.67, 0.66] },
        { en: "Clarity", zh: "音质清晰度", values: [0.86, 0.80] },
        { en: "Rhythm & prosody", zh: "节奏和韵律", values: [0.66, 0.44] },
        { en: "Emotion", zh: "情感表达", values: [0.69, 0.38] },
        { en: "Speaker similarity", zh: "原始音色保持", values: [0.76, 0.76] },
      ],
    },
    {
      id: "livestream", label: { en: "Livestream", zh: "数字人直播" }, title: { en: "Virtual-host livestream evaluation", zh: "数字人直播评测" },
      model: "LiveTTS-ZERO V2.5.2", baseline: "MiniMax Speech 2.6HD", headline: [4.17, 2.96],
      metric: { en: "Reported aggregate score", zh: "原稿报告综合分" },
      method: { en: "10 livestream clips rated by 17 participants. Scores are transcribed from the team-provided material; the aggregate formula, rating scale, and confidence intervals were not supplied.", zh: "10 个直播片段，17 人参与评分。按团队原稿保留分数，原稿未提供综合分公式、完整量表及置信区间。" },
      caveat: { en: "The displayed aggregate is not the sum of the rounded rows. Without the full scoring protocol, it should not be described as a verified MOS or percentage improvement.", zh: "原稿综合分不等于所列分项简单相加。缺少完整计分规则，不将其表述为经验证的 MOS 或性能提升百分比。" },
      rows: [
        { en: "Pronunciation", zh: "发音准确性", values: [0.82, 0.62] },
        { en: "Fluency", zh: "流畅性", values: [0.87, 0.74] },
        { en: "Clarity", zh: "音质清晰度", values: [0.66, 0.59] },
        { en: "Naturalness", zh: "自然度", values: [0.66, 0.29] },
        { en: "Emotion", zh: "情感表达力", values: [0.58, 0.28] },
        { en: "Voice consistency", zh: "音色一致性", values: [0.59, 0.50] },
      ],
    },
    {
      id: "narration", label: { en: "Long-form content", zh: "内容创作" }, title: { en: "Long-form content evaluation", zh: "文明之影 · 长文本内容创作评测" },
      model: "LiveTTS V2.7.3", baseline: "MiniMax Speech 2.8HD", headline: [4.791, 4.298],
      metric: { en: "Reported MOS", zh: "原稿报告 MOS" },
      method: { en: "The source reports long-form ratings, an average score of 0.8953 vs 0.6490, and MOS of 4.791 vs 4.298. The number of clips, raters, and confidence intervals were not provided.", zh: "原稿报告长文本评分、综合平均分 0.8953 对 0.6490，以及 MOS 4.791 对 4.298。未提供音频条数、评审人数及置信区间。" },
      caveat: { en: "MOS and the six dimension scores use different reported scales. They are shown separately, and are not interchangeable with other studies or model versions.", zh: "MOS 与六维分数使用不同报告量表，分别展示，不与其他实验或模型版本直接混比。" },
      rows: [
        { en: "Pronunciation", zh: "发音准确性", values: [0.8969, 0.7062] },
        { en: "Fluency", zh: "流畅性", values: [0.9719, 0.9344] },
        { en: "Clarity", zh: "音质清晰度", values: [0.8438, 0.4500] },
        { en: "Naturalness", zh: "自然度", values: [0.9094, 0.8188] },
        { en: "Emotion", zh: "情感表达", values: [0.8527, 0.8094] },
        { en: "Voice consistency", zh: "音色一致性", values: [0.8969, 0.1750] },
      ],
    },
  ],
};
