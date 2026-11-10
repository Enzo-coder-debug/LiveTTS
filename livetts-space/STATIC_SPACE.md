---
title: LiveTTS · Speech Studio
emoji: 🗣️
colorFrom: yellow
colorTo: red
sdk: static
app_file: index.html
pinned: false
short_description: LiveTTS interface preview. Audio and API coming later.
---

# LiveTTS Speech Studio · Static Preview

LiveTTS 开发团队的语音体验页界面预览，支持中英文、文本编辑、示例提示词与语速控件。

**目前仅为静态预览：音频区域保留空占位，没有真实样音，不会调用 API，不会生成语音，也没有上传模型权重。** 页面不使用其他模型或录音冒充 LiveTTS。

## Why a Static Space?

The current account cannot create a Docker Space without an eligible plan. This free Static Space publishes the interface only. Entered text stays in the page; generation and audio playback are disabled until a real backend is integrated. No credentials are bundled.

## Later integration

- Static files cannot securely hold an API key. Adding a Space Secret alone does not turn this static app into a backend.
- Deploy the supplied Docker/FastAPI project on eligible hosting, or implement a separately hosted authenticated proxy with usage limits, then connect and test the frontend.
- Switching from Static to Docker on Hugging Face may require a paid plan. No subscription or hardware upgrade was made for this preview.
- Only use voice recordings, sample text, and model outputs approved for public release. Public voice uploads and cloning are not enabled.

The full source and backend package are maintained in the team's GitHub repository; access follows that repository's visibility. This Space is independent from the `EnzELI/LiveTTS` model repository, which has not been modified by this deployment.
