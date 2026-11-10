# 音频占位与替换

当前有 7 条参考音频位、13 条合成音频位，全部为空。`data.js` 中对应的 `src: ""` 会显示「等待公开音频」，不会播放伪造样音或请求无效的零字节音频文件。

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
