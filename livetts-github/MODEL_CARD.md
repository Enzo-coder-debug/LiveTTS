# LiveTTS · Model overview

LiveTTS is a generative text-to-speech model developed by the LiveTTS team at JD. This page is based on the team-provided product overview, not a technical paper or an independently audited evaluation.

## Capabilities described by the team

- Zero-shot voice cloning from 3–15 seconds of reference audio. This is the reference recording duration, **not synthesis latency**.
- Accent-enhanced inference and speaker-identity inference modes.
- Custom voice fine-tuning using approximately 30 minutes to 5 hours of authorized recordings.
- Emotion/style instruction, including happiness, sadness, anger, fear, surprise, warmth, anticipation, and urgency.
- Paralinguistic text tags such as `<laughter>`, `<sigh>`, and `<throat>`.
- Multiple languages and Chinese dialects, independently controlled from the reference voice where supported by the deployed version.
- Long-form narration, livestream content, phonetic spelling, singing voice conversion, and humming capabilities described in the source material.

The source lists ten Chinese dialects: Northeast Mandarin, Henan, Minnan, Tianjin, Sichuan, Shaanxi, Cantonese, Shanghainese, Jinan, and Beijing. It lists English, German, French, Spanish, Japanese, Dutch, Arabic, Korean, and Indonesian among foreign-language capabilities. Supported quality and API availability must be confirmed for the selected model version.

## Evaluation status

The site reproduces the supplied attachment's six **historical internal evaluation** cards, retaining the original compared model names, versions, claims, and figures. This is reproduction of team-provided material, not independent verification. The results are not an Artificial Analysis / TTS Arena ranking and must not be presented as one. The following notes cover three of those evaluations:

1. **General speech:** JoyAI Zeroshot V2.7.1 vs MiniMax Speech 2.8HD. Reported weighted score 0.74 vs 0.64. Supplied dimensions and rounded weights do not fully establish the aggregate; raw scoring details are needed.
2. **Virtual-host livestream:** LiveTTS-ZERO V2.5.2 vs MiniMax Speech 2.6HD. 10 clips and 17 participants. Reported aggregate 4.17 vs 2.96; the original aggregate formula was not supplied and does not equal the simple sum of the displayed dimension scores.
3. **Long-form content:** LiveTTS V2.7.3 vs MiniMax Speech 2.8HD. Reported MOS 4.791 vs 4.298. Rater count, clip count, and confidence intervals were not supplied.

Intelligibility, naturalness, speaker similarity, listener preference, and business KPIs are distinct. No claim of statistical significance, universal superiority, or indistinguishability from human speech is made here.

## Audio samples

The November 10, 2026 showcase revision contains 36 examples generated through the team's HTTPS script with requested model version 2.8.1 and the user-selected preset timbre. Publication of this revision was approved by the user on November 10, 2026. The old cloned-voice fid was removed. These are preset-voice examples, not zero-shot cloning comparisons. Only the timbre selector and version supported by this HTTP script were sent; no unverified WebSocket model/speaker mapping is asserted.

Six emotions remain in their original order: warm, happy, sad, neutral, angry and fearful. Each uses a distinct appropriate script, so this is not a controlled same-text study. All foreign languages now have explicit language tags; Chinese–English mixed text uses lang=zh. Korean and Arabic returned nonempty audio on this run. The cough example was removed after the user reported that the tag had no audible effect. The du se spelling draft concatenates a separately synthesized Chinese introduction with <speak><phoneme alphabet="sym" ph="d u du s e se">d u du s e se</phoneme></speak>, separated by 120 ms of silence. It is a two-request composition, not a successful single mixed-text SSML request or verified syllable pronunciation.

The 36 outputs total approximately 294.48 seconds, in mono 24 kHz PCM16 WAV. Complete-stream, decoding, non-silence and sample-clipping checks are technical checks, not word-level, emotion, voice-identity or audio-tag listening validation. The user removed one ineffective cough sample; the revised spelling draft awaits listening review. The other 35 outputs are unchanged from the preset-voice synthesis run. New versioned audio paths separate this draft from the previously published voice files.

Input text and actual request settings are recorded for each sample. Credentials and internal request logs are not published. Team listening review and media authorization remain required. These examples are separate from the historical evaluation datasets above.

## Intended use and limitations

Research, technical evaluation, and authorized voice-enabled products. Use only voice recordings you have permission to process and publish. Disclose synthetic audio where appropriate. Do not use this showcase to impersonate real people, enable fraud, or conceal a recording's synthetic nature.

This static website does not host model weights, call a synthesis API, accept reference uploads, register voices, or grant a model/audio license. API access, deployment, model licensing, retention policy, and approved use require confirmation with the LiveTTS team.

## 中文说明

本页面依据用户提供的《LiveTTS 对外页面》整理。能力与数字属于团队原稿描述，内部实验与第三方榜单明确区分；不发布原稿中的京东文档链接、未授权音频或凭证。展示页面、模型接口、模型权重以及音频素材的使用许可互不等同，需要分别确认。
