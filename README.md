# LiveTTS

LiveTTS 模型展示站与语音体验页，独立公开项目。

- [GitHub Pages 展示站](https://Enzo-coder-debug.github.io/LiveTTS/)
- [Hugging Face 静态体验页](https://huggingface.co/spaces/EnzELI/LiveTTS)
- [添加或替换样音](livetts-github/assets/audio/README.md)
- [展示站部署与配置](livetts-github/README.md)
- [体验页与服务端接入说明](livetts-space/README.md)

## 当前状态

展示站直接沿用团队提供 HTML 的深色蓝紫样式，默认中文，支持英文、分类试听、搜索和折叠详情。39 条输出已通过 LiveTTS 实际合成，请求模型版本 `2.8.1`，共约 291.33 秒，包含 10 种情感指令、7 种外语、8 种方言、副语言标签、长文本、拼读与应用场景。

韩语与阿拉伯语请求返回空音频，不进入试听区和数量统计。8 个案例的原始参考录音未公开，不用合成结果冒充原始参考。音频通过基础文件检查，尚未人工逐条听审。内部评测标注来源与局限，不代表独立公开榜单。

Hugging Face 当前为静态界面预览，不调用 API、不生成语音、不上传模型权重。本仓库不包含 API 密钥、私人录音或其他项目历史。

## 目录

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
