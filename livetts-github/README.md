# LiveTTS 展示站

独立公开项目 `Enzo-coder-debug/LiveTTS` 的 GitHub Pages 网站。直接沿用团队提供 HTML 的深色背景、蓝紫渐变、导航、卡片、表格与步骤样式，默认中文，可切换英文。

## 当前内容

- 39 条真实 LiveTTS 合成音频，约 291.33 秒；请求模型版本 `2.8.1`，同一配置音色。
- 10 种情感指令、5 条副语言样例、7 种外语及中英混合、8 种方言、故事与播客、拼音和 3 个应用场景。
- 试听区支持全部展开、分类筛选、文本搜索、互斥播放、完整文本与参数、文本复制；不展示空音频卡片。
- 三组历史内部评测，保留原始模型版本、分数与局限，分项默认折叠，支持 CSV 下载。
- Hugging Face 链接指向静态体验预览，不是可调用的线上合成服务。

韩语、阿拉伯语两条请求返回空音频，未进入试听区及数量统计，输入仍保留在 `data.js`。8 个案例的原始参考录音未公开；空参考面板隐藏，不拿合成输出冒充原始参考。音频文件通过格式、完整解码、非静音与采样削波检查，尚未人工逐条听审或验证逐字准确率。详细文件及校验值见 [生成记录](assets/audio/GENERATION.md)。

## 本地预览与检查

```sh
python3 -m http.server 7862 --bind 127.0.0.1
node scripts/validate.mjs
```

访问 `http://127.0.0.1:7862/`。静态检查覆盖双语文案、HTML ID、分类、资源路径、输出元数据、评测数值与公开文件安全检查。未公开参考及两个无文件输出会产生预期 warning。

`node scripts/validate.mjs --release` 是更严格的参考对照完整性检查，要求每个案例参考录音、参考文本与所有输出齐备，当前有意不满足。普通预览部署不声称完成独立评测或媒体授权审核。

## 更新音频

将获准公开的文件放入 `assets/audio/`，在 `data.js` 填写对应输出的 `src`、实际输入 `text`、请求版本 `model` 与参数 `settings`，设置 `illustrative: false`。只有非空且非示意的输出进入试听区，数量自动更新。

本地批量脚本 `scripts/synthesize_samples.py` 调用团队指定的 HTTP 脚本，不保存凭证。通过 `--script` 指定脚本路径，通过环境变量 `LIVETTS_API_KEY` 或显式的 `--credential-script` 提供凭证来源；可用 `--only case-id/index` 单独生成。已有文件按签名和校验值复用，不自动覆盖。失败即停，可用 `--only` 继续其他条目。

生成结果与请求日志只存入忽略的 `.generation/`；**不得上传此目录**。公开前核对文本、文件、版权与发布范围，只复制审核后的音频和去敏元数据。

## 部署

仓库的 `.github/workflows/livetts-pages.yml` 使用 `SITE_DIR: livetts-github`。主分支网站文件更新后自动发布，也可手动触发。仅允许的网页文件和 `assets/` 进入 Pages，不发布本地脚本日志、凭证或体验页后端。

公共链接在 `site.config.js` 配置。仓库部署说明副本位于 `deployment/REPOSITORY_README.md`，工作流副本位于 `deployment/pages-monorepo.yml`。不修改其他项目仓库。

模型权重、音色、API、音频素材和代码的许可需分别确认，公开展示不等于授予使用许可。
