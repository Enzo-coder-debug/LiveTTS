# LiveTTS 展示站

独立公开项目 `Enzo-coder-debug/LiveTTS` 的 GitHub Pages 网站。直接沿用团队提供 HTML 的深色背景、蓝紫渐变、导航、卡片、表格与步骤样式，默认中文，可切换英文。

## 当前内容

- 36 条 LiveTTS 音频，约 294.48 秒；请求版本 `2.8.1`，使用用户指定预置音色。本轮修订于 2026-11-10 经用户确认发布。
- 6 种情感指令分别搭配不同文案；4 条副语言、9 种外语及中英混合、8 种方言、故事与播客、SSML 拼读和 3 个应用场景。
- 试听区支持全部展开、分类筛选、文本搜索、互斥播放、完整文本与参数、文本复制；不展示空音频卡片。
- 三组历史内部评测，保留原始模型版本、分数与局限，分项默认折叠，支持 CSV 下载。
- Hugging Face 链接指向静态体验预览，不是可调用的线上合成服务。

显式指定 ko/ar 的韩语与阿拉伯语已生成。用户听审后移除未生效的咳嗽示例；“堵塞”拼读试听稿由中文引导语与 SSML phoneme/sym 音素分两次请求合成后拼接，尚待确认发音。原始参考录音不适用于本组预置音色示例，本组不构成零样本克隆对照。文件检查不能代替听感与标签生效验证，详见 [生成记录](assets/audio/GENERATION.md)。

## 本地预览与检查

```sh
python3 -m http.server 7862 --bind 127.0.0.1
node scripts/validate.mjs
```

访问 `http://127.0.0.1:7862/`。静态检查覆盖双语文案、HTML ID、分类、资源路径、输出元数据、评测数值与公开文件安全检查。8 个未提供参考录音的案例会产生预期 warning；本组没有空输出。

`node scripts/validate.mjs --release` 是更严格的参考对照完整性检查，要求每个案例参考录音、参考文本与所有输出齐备，当前有意不满足。普通预览部署不声称完成独立评测或媒体授权审核。

## 更新音频

将获准公开的文件放入 `assets/audio/`，在 `data.js` 填写对应输出的 `src`、实际输入 `text`、请求版本 `model` 与参数 `settings`，设置 `illustrative: false`。只有非空且非示意的输出进入试听区，数量自动更新。

本轮使用 `scripts/synthesize_timbre_samples.py` 调用团队指定的 HTTP 脚本，通过 `--jobs` 指定审核后的输入与标签、`--timbre-id` 指定音色、`--destination` 指定私有生成目录。凭证仅通过环境变量 `LIVETTS_API_KEY` 或显式 `--credential-script` 读取。脚本在内存中移除旧 fid、覆盖 tim 与 model_version，不改动原始脚本；支持 `--only case-id/index`、`--dry-run`，已有结果按请求签名与 SHA-256 校验复用。

生成结果与请求日志只存入忽略的 `.generation/`；**不得上传此目录**。公开前核对文本、文件、版权与发布范围，只复制审核后的音频和去敏元数据。

## 部署

仓库的 `.github/workflows/livetts-pages.yml` 使用 `SITE_DIR: livetts-github`。主分支网站文件更新后自动发布，也可手动触发。仅允许的网页文件和 `assets/` 进入 Pages，不发布本地脚本日志、凭证或体验页后端。

公共链接在 `site.config.js` 配置。仓库部署说明副本位于 `deployment/REPOSITORY_README.md`，工作流副本位于 `deployment/pages-monorepo.yml`。不修改其他项目仓库。

模型权重、音色、API、音频素材和代码的许可需分别确认，公开展示不等于授予使用许可。
