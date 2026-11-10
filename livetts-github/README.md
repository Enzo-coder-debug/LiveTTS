# LiveTTS · GitHub Pages research showcase

参考 JoyVoice 的「模型介绍 → 分类样音 → 对照结果 → 资源」组织方式，结合团队提供的《LiveTTS对外页面.html》重新设计。**不是 JoyVoice 模型页，也没有复用其论文、架构图、Logo、名人样音或评测结果。**

独立静态站点，无框架、无需 npm 安装、无需 API Key，可部署到 GitHub Pages 用户站或项目子目录。不会修改已有 Hugging Face 体验页。

## 当前状态

- 中英双语、响应式研究页、顶部导航及分区定位。
- 六类样音目录（零样本、情感/副语言、跨语种、方言、长文本、拼读）、参考音频与生成结果布局、单音频播放、文本复制及下载。
- 三组内部评测：图表、原始值表、模型版本、条件和局限、CSV 导出。
- 未配置的 Hugging Face 链接显示明确说明，GitHub/技术报告/联系方式链接为空时隐藏，不伪造已发布资源。
- 本项目使用独立公开仓库 `Enzo-coder-debug/LiveTTS`。`livetts-github/` 存放展示站，`livetts-space/` 存放体验页；不包含其他项目、私人材料或其他仓库的提交历史。
- **样音文件尚未提供。** 7 条参考音频与 13 条合成音频位明确标记待补充，不冒充已有模型输出。后续替换方法见 `assets/audio/README.md`。
- 体验页入口已指向 `https://huggingface.co/spaces/EnzELI/LiveTTS`，目前是静态界面预览，不提供在线合成。

## 本地预览

在本目录运行：

```sh
python3 -m http.server 7862 --bind 127.0.0.1
```

打开 `http://127.0.0.1:7862/`。静态页不需要运行原有 `livetts-space` 后端。通过 `file://` 打开可查看主体，剪贴板等功能可能受浏览器限制，建议使用本地 HTTP。

## 配置公开链接

编辑 `site.config.js`：

```js
window.LIVETTS_SITE = {
  defaultLanguage: "en",
  spaceUrl: "",
  repositoryUrl: "",
  technicalReportUrl: "",
  contactUrl: "",
  releaseLabel: "Research showcase",
  releaseLabelZh: "研究展示",
};
```

`spaceUrl` 填已上线的 Hugging Face Space URL，不要填 `localhost`。API 密钥不能放入静态文件。页面只跳转到 Space，不直接调用合成 API。`repositoryUrl` 是此项目的公开仓库地址；没有论文时保持 `technicalReportUrl` 为空。联系方式仅接受公开 HTTPS 页面或 `mailto`。

## 添加真实样音

将获准公开的 WAV / MP3 放到 `assets/audio/`。在 `data.js` 对应条目中配置：

```js
reference: {
  src: "./assets/audio/reference-approved.wav",
  transcript: "参考录音的实际内容",
  label: { en: "Reference voice", zh: "参考音色" },
},
outputs: [{
  label: { en: "Mandarin", zh: "普通话" },
  language: "zh-CN",
  text: "生成音频的实际合成文字",
  src: "./assets/audio/livetts-mandarin.wav",
  model: "团队确认的模型版本",
  settings: "实际语速、情感等生成设置",
  illustrative: false,
}],
```

- **不要只添加音频而不更新文字、版本和设置。** 页面上的初始文字是示例，不是已有样音的转写。
- `src` 为空时显示诚实的缺失状态，不生成空 `<audio src>` 请求。添加文件后自动显示原生播放器，不自动播放，所有样音互斥播放。
- 支持公开稳定的 HTTPS 媒体 URL；建议把小样音纳入本仓库，避免认证链接、过期签名、跨站下载限制。
- 原稿的京东文档/文件链接未拷贝到此站点。不要将内部文档、私有 `fid`、密钥或未授权录音直接公开。
- 音色、说话人、文本与音乐素材的公开授权需分别确认。没有替你下载或转发原稿中的歌曲/内部录音。
- 新增案例沿用 `data.js` 结构；每个 `id` 唯一。额外对照模型可使用明确版本的独立结果行，并保留一致输入与评测设置，不能用别人的模型音频冒充 LiveTTS。

## 评测内容处理

保留原稿可追溯的三组数字与版本，并将来源标为「团队报告 · 内部评测」。具体内容见 `MODEL_CARD.md`。

原稿中以下内容没有直接用于宣传：

- 未注明日期、版本和测试条件的竞品打勾矩阵。
- 从外呼挂断率推导「听不出非真人」的结论。
- 「主观体验与 WER 不相关」这种过度概括，改为不同指标衡量不同维度。
- 样本/分母定义不充分的 GSB 占比、无法核实的显著性和「唯一达成」结论。
- 把 `3–15 秒参考音频` 写成克隆耗时或合成延迟。
- 未提供推导公式的「领先 41%」等比较性口号。

分项图表与原始值使用同一数据源；如更新原始材料，只需改 `data.js`。不同量表、不同模型版本不混成一个总榜。

## 部署方式一：独立仓库 + GitHub Actions

1. 在团队授权的 GitHub 账号/组织创建网站仓库；仓库名称自行确定，不必叫 JoyVoice。
2. 将**本目录内容**上传到新仓库根目录，包含 `.github/workflows/pages.yml`。不要上传上层评测工作区、`livetts-space/.venv` 或私人素材。
3. 仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
4. 推送到 `main` 或 `master`，或在 Actions 手动运行 `Deploy research page`。工作流先检查静态资源，再只上传允许的发布文件。
5. 成功后从 Actions / Pages 读取实际 URL，再填回 `site.config.js`。不要猜测账号、域名或仓库地址。

所有本地资源使用相对路径，同时兼容站点根路径与 `/仓库名/`。未添加自定义域名 CNAME，也未默认套用开源许可证；模型、代码、音频授权需要团队决定。

## 部署方式二：现有仓库的子目录

如果保留 `livetts-github/` 这个目录名，而不是让它成为仓库根目录：

1. 使用 `deployment/pages-monorepo.yml`，放到仓库根 `.github/workflows/livetts-pages.yml`；它已设置 `SITE_DIR: livetts-github`，在主分支页面文件更新时发布，也可手动触发。
2. 独立公开仓库 `Enzo-coder-debug/LiveTTS` 使用此目录结构；其他项目仓库保持不变。
3. 在 Pages 设置中使用 GitHub Actions，或手动运行 `Deploy LiveTTS research page`。上传步骤只发布该目录内允许的文件，不会把上层工作区、体验页后端或私人资料一起发布。

也可使用分支发布：把网站内容放入 GitHub Pages 支持的根目录或 `docs/`。请勿将私人文件放入 Pages 发布目录。

## 检查与发布准备

```sh
node scripts/validate.mjs
```

检查 ID、分类、音频路径、相对链接、公开 URL、空槽与媒体元数据、评测数值。无样音时给出 warning，不冒充发布就绪。

```sh
node scripts/validate.mjs --release
```

严格发布检查要求每个公开目录案例的参考音频与输出完整、实际文本/版本/设置齐备，且配置了 HTTPS Space URL。此检查仍**不验证媒体内容、授权或外部 URL 的可达性**，需团队人工确认。

## 文件

```text
index.html                 研究页结构与无脚本基础内容
site.config.js             公共链接与默认语言
data.js                    分类、样音、原稿评测数据
assets/style.css           视觉与响应式布局
assets/app.js              双语、筛选、媒体、图表与 CSV
assets/audio/              待放入授权样音
MODEL_CARD.md              对外能力与限制说明
scripts/validate.mjs       静态数据与资源检查
.github/workflows/pages.yml Pages 部署工作流
```

## 尚需团队提供

授权参考音频与模型输出、公开样音的模型版本/参数、对外联系人，以及内部评测数字的发布审批。独立公开 GitHub 仓库和 Hugging Face 静态预览地址已配置。

## 本地验收记录

2026-11-10：配置部署链接和占位说明后，432 项静态检查通过；JavaScript 语法检查通过；项目子路径下 7 个页面引用资源均能加载。浏览器已检查中英切换、六类筛选、三组评测切换、精确数值表、CSV 下载、文本复制和未配置体验页时的提示弹窗；320 / 390 像素窄屏未出现页面横向溢出。Hugging Face 公开静态页面已通过浏览器检查，平台状态为 Running，生成按钮禁用。

真实音频播放和生产 API 尚未验收。严格发布检查目前会阻止完整样音发布就绪判定，因为仍缺公开音频与参考文本；已绑定的 Space 仅为静态预览，并非在线合成服务。默认工作流用于预览部署；完整样音正式发布前请运行并通过 `node scripts/validate.mjs --release`，再人工审核音频授权和评测对外发布权限。
