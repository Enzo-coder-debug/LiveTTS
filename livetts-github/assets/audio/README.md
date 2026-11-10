# 已合成音频与参考录音补充

2026-11-10 已通过现有本地 LiveTTS HTTP 脚本实际合成 13 条输出，请求模型版本 `2.8.1`，沿用同一配置音色（公开标记为 `Configured voice A`，不公开内部音色 ID）。7 条原始参考录音仍为空：`data.js` 中对应的 `src: ""` 显示「等待公开音频」，不会拿生成结果冒充原始录音。

所有输出为单声道 24 kHz、16 位 PCM WAV，语速 `1.0`、接口音量参数 `4.0`。情感对照分别请求 `温暖`、`高兴`、`悲伤`；其余请求 `中立`。四川话使用 `lang=sichuan`，粤语使用 `lang=yue`，英语使用 `lang=en`，普通话使用 `lang=zh`。日语及中英混合没有指定 `lang`，由服务自动判断。

全部文件通过格式解码、非静音与削波检查；未进行人工逐条听审、逐字 ASR 复核或独立音色相似度评测。标签是请求控制，不构成模型效果认证。原始 API 响应及凭证不在本目录中。

后续将获授权的文件上传到本目录，再在仓库的 `livetts-github/data.js` 中替换对应 `src`，例如 `./assets/audio/one-voice-reference.wav`。建议文件命名如下：

| 案例 ID | 参考音频 | 合成音频 |
| --- | --- | --- |
| `one-voice` | `one-voice-reference.wav` | `one-voice-zh.wav`、`one-voice-en.wav` |
| `emotional-range` | `emotional-range-reference.wav` | `emotion-warm.wav`、`emotion-excited.wav`、`emotion-sad.wav` |
| `audio-tags` | `audio-tags-reference.wav` | `audio-tags-output.wav` |
| `across-languages` | `across-languages-reference.wav` | `language-en.wav`、`language-ja.wav`、`language-mixed.wav` |
| `local-voices` | `local-voices-reference.wav` | `dialect-sichuan.wav`、`dialect-cantonese.wav` |
| `long-story` | `long-story-reference.wav` | `long-story-output.wav` |
| `phonetics` | `phonetics-reference.wav` | `phonetics-output.wav` |

填写参考音频 `transcript`；合成音频填写实际 `text`、`model`、`settings`，并将 `illustrative` 改为 `false`。不要将示例文字当作真实转写。文件名可以自定义，路径必须与 `src` 一致。

GitHub Pages 展示页与 Hugging Face 静态工作室是两个不同页面。此目录的固定样音属于 GitHub 展示页；Hugging Face 的生成音频区需另行接入真实后端。
