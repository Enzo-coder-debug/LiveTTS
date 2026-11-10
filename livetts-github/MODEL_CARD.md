# LiveTTS · Model overview

LiveTTS is a generative text-to-speech model developed by the LiveTTS team at JD. This page is based on the team-provided product overview, not a technical paper or an independently audited evaluation.

## Capabilities described by the team

- Zero-shot voice cloning from 3–15 seconds of reference audio. This is the reference recording duration, **not synthesis latency**.
- Accent-enhanced inference and speaker-identity inference modes.
- Custom voice fine-tuning using approximately 30 minutes to 5 hours of authorized recordings.
- Emotion/style instruction, including happiness, sadness, anger, fear, surprise, warmth, anticipation, and urgency.
- Paralinguistic text tags such as `<laughter>`, `<sigh>`, `<cough>`, and `<throat>`.
- Multiple languages and Chinese dialects, independently controlled from the reference voice where supported by the deployed version.
- Long-form narration, livestream content, phonetic spelling, singing voice conversion, and humming capabilities described in the source material.

The source lists ten Chinese dialects: Northeast Mandarin, Henan, Minnan, Tianjin, Sichuan, Shaanxi, Cantonese, Shanghainese, Jinan, and Beijing. It lists English, German, French, Spanish, Japanese, Dutch, Arabic, Korean, and Indonesian among foreign-language capabilities. Supported quality and API availability must be confirmed for the selected model version.

## Evaluation status

The site reproduces selected **historical internal evaluations**, retaining the original compared model names and versions. The results are not an Artificial Analysis / TTS Arena ranking and must not be presented as one.

1. **General speech:** JoyAI Zeroshot V2.7.1 vs MiniMax Speech 2.8HD. Reported weighted score 0.74 vs 0.64. Supplied dimensions and rounded weights do not fully establish the aggregate; raw scoring details are needed.
2. **Virtual-host livestream:** LiveTTS-ZERO V2.5.2 vs MiniMax Speech 2.6HD. 10 clips and 17 participants. Reported aggregate 4.17 vs 2.96; the original aggregate formula was not supplied and does not equal the simple sum of the displayed dimension scores.
3. **Long-form content:** LiveTTS V2.7.3 vs MiniMax Speech 2.8HD. Reported MOS 4.791 vs 4.298. Rater count, clip count, and confidence intervals were not supplied.

Intelligibility, naturalness, speaker similarity, listener preference, and business KPIs are distinct. No claim of statistical significance, universal superiority, or indistinguishability from human speech is made here.

## Audio samples

On November 10, 2026, the 13 output samples were synthesized through the team's local LiveTTS HTTP script with requested model version `2.8.1` and one configured voice. The site records the exact input text and requested settings for each clip. The original 7 reference recordings remain unpublished; a synthesis result is never substituted for an original reference. No other model, system voice, or test tone is used as LiveTTS evidence.

All outputs decode as mono 24 kHz PCM16 WAV and pass basic non-silence and sample-clipping checks. Total generated duration is approximately 89.45 seconds. These are technical file checks, not a listening evaluation or a word-for-word transcription check. Emotion and language labels identify the requested controls; Japanese and mixed-language samples use automatic language detection. The actual reference is not available for independent voice-similarity comparison. These new samples are separate from the historical evaluations above.

When adding audio, record the actual model version, synthesis settings, exact transcript, reference recording authorization, and intended publication rights. For comparisons, use the same text and a documented protocol. Do not remove weaker examples solely to imply a randomized benchmark.

## Intended use and limitations

Research, technical evaluation, and authorized voice-enabled products. Use only voice recordings you have permission to process and publish. Disclose synthetic audio where appropriate. Do not use this showcase to impersonate real people, enable fraud, or conceal a recording's synthetic nature.

This static website does not host model weights, call a synthesis API, accept reference uploads, register voices, or grant a model/audio license. API access, deployment, model licensing, retention policy, and approved use require confirmation with the LiveTTS team.

## 中文说明

本页面依据用户提供的《LiveTTS 对外页面》整理。能力与数字属于团队原稿描述，内部实验与第三方榜单明确区分；不发布原稿中的京东文档链接、未授权音频或凭证。展示页面、模型接口、模型权重以及音频素材的使用许可互不等同，需要分别确认。
