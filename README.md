# LiveTTS

LiveTTS 模型展示站与语音体验页，独立公开项目。

- [GitHub Pages 展示站](https://Enzo-coder-debug.github.io/LiveTTS/)
- [Hugging Face 静态体验页](https://huggingface.co/spaces/EnzELI/LiveTTS)
- [添加或替换样音](livetts-github/assets/audio/README.md)
- [展示站部署与配置](livetts-github/README.md)
- [体验页与服务端接入说明](livetts-space/README.md)

## 当前状态

展示站支持中英文、分类样音与评测数据展示。7 条参考音频位和 13 条合成音频位暂时留空，明确标记待补充，不使用其他录音冒充模型结果。内部评测标注来源与局限，不代表独立公开榜单。

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
