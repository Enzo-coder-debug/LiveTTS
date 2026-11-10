# LiveTTS

LiveTTS 模型展示站与语音体验页，独立公开项目。

- [GitHub Pages 展示站](https://Enzo-coder-debug.github.io/LiveTTS/)
- [Hugging Face 静态体验页](https://huggingface.co/spaces/EnzELI/LiveTTS)
- [添加或替换样音](livetts-github/assets/audio/README.md)
- [展示站部署与配置](livetts-github/README.md)
- [体验页与服务端接入说明](livetts-space/README.md)

## 当前状态

展示站完整采用团队附件 HTML 的布局、中文文案、能力矩阵与六组评测，不再使用简化版。原演示卡片可打开指定预置音色的音频，保留 36 条输出，请求版本 2.8.1，共约 294.48 秒。内部文档链接不公开，暂无对应媒体的演示保留卡片与说明，不用其他音频代替。

外语均显式指定语种标签，韩语与阿拉伯语本轮均已生成。咳嗽因用户听审认为未生效而移除；“堵塞”拼读为中文引导语与 SSML sym 音素两次请求输出的拼接试听稿。本组不是零样本克隆对照，文件检查不能替代人工听审。内部评测保持历史版本及原有局限，不代表独立公开榜单。

Hugging Face 当前为静态界面预览，不调用 API、不生成语音、不上传模型权重。本仓库不包含 API 密钥、私人录音或其他项目历史。

## 目录

本地可视化管理：双击 `livetts-github/启动控制台.command`，编辑文案、替换 WAV、调整顺序或隐藏示例，保存预览后发布。需要 Node.js 22+，发布时使用本机已登录的 GitHub CLI。管理后台不对公网开放，详见 [控制台使用说明](livetts-github/README.md)。

```text
livetts-github/                 GitHub Pages 展示站
livetts-space/                  Hugging Face 界面与 Docker 后端
.github/workflows/livetts-pages.yml  仅发布展示站的工作流
```

将获准公开的音频放入 `livetts-github/assets/audio/`，更新 `livetts-github/data.js` 中对应路径、真实文本、模型版本和生成设置。主分支页面文件更新后自动重新部署，也可手动运行 Pages 工作流。

## 本地检查

```sh
node livetts-github/scripts/validate.mjs
node livetts-space/scripts/build-static.mjs
```

API 凭证只能保存在服务端。模型、代码和音频的使用授权需由团队另行确认，公开展示不等于授予模型权重或音色使用权。
