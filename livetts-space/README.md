---
title: LiveTTS · Speech Studio
emoji: 🗣️
colorFrom: yellow
colorTo: red
sdk: docker
app_port: 7860
pinned: false
short_description: Your words, brought to life. A LiveTTS research playground.
---

# LiveTTS Speech Studio

京东 LiveTTS 团队的 Hugging Face Spaces 体验页。独立 Docker Space，FastAPI 服务端 + 无构建步骤的 HTML/CSS/JavaScript 界面，不需要 GPU。

## 当前交付状态

- 页面支持中英切换、三类提示词、音色白名单、0.75–1.25 倍速、音频波形、播放/拖动/下载、当前页面内最多 5 条记录、体验接口示例。
- 基于已有 LiveTTS 公网 HTTPS 示例实现 `Property` / `Sequence-Id` 分片轮询协议，音频按单声道、24 kHz、16 位 PCM 组装为 WAV。
- **尚未填入真实 API 密钥或验证生产模型/音色组合，默认仅为界面预览。** 不会用其他模型、预制音频或系统语音冒充 LiveTTS。
- 不导入本机脚本的凭证、私人音频或私人 `fid`。公开使用前，需由团队确认模型版本、音色授权、访问额度与后端隐私政策。
- **Hugging Face 已公开部署静态预览版**：`https://huggingface.co/spaces/EnzELI/LiveTTS`，已核对平台状态 Running 和公开页面。该账号创建 Docker Space 被平台的 PRO 要求阻止，因此静态版不调用 API，也不能仅靠添加 Secret 开启合成。此目录仍保留完整 Docker 后端供后续部署。

## 静态预览版

运行 `node scripts/build-static.mjs`，仅生成 5 个允许公开的文件到 `dist/space-static/`，不包含后端、密钥、权重、真实音频、虚拟环境或截图。将构建结果上传至 **Static Space**；仓库根 `README.md` 使用 `STATIC_SPACE.md` 的内容。当前静态版明确显示空音频状态，生成与播放按钮禁用，输入文字不发送到服务端。

发布时保留原来的模型仓库不变。后续可以迁移到有资格创建 Docker Space 的账号/套餐，或另行部署受保护的服务端代理。不要在静态 JavaScript、普通 Space Variables 或公开仓库中填写 API 密钥。

## GitHub Pages 前端

访问 [Speech Studio 界面预览](https://enzo-coder-debug.github.io/LiveTTS/playground/)。原有模型官网与预生成样音继续保留在网站根路径。

仓库工作流 `.github/workflows/livetts-pages.yml` 运行静态构建，将 `index.html` 与三个 `static/` 资源部署至 `/LiveTTS/playground/`。前端源文件或构建脚本更新后自动重新部署；本地对应的工作流副本为 `livetts-github/deployment/pages-monorepo.yml`。

Pages 不发布 Docker/FastAPI 后端、密钥、权重或本地生成记录。当前体验页的合成与播放按钮保持禁用，输入文字不发送到 API，也不消耗合成额度；静态页面的内容安全策略禁止网络 API 连接。后续接入后端时，需同时配置前端 API 地址、内容安全策略与后端鉴权，并完成真实联调。

## 本地运行

Python 3.12+。在本目录运行：

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app:app --host 127.0.0.1 --port 7860 --no-access-log
```

浏览器打开 `http://127.0.0.1:7860`。没有配置时顶部会明确标记「界面预览模式」，不会调用 API。

`.env.example` 是配置清单，应用**不会自动加载 `.env`**。本地可以通过 shell 导出环境变量后重启服务。不要把密钥写入 shell 历史或公开文件；可以用无回显输入：

```sh
read -r -s LIVETTS_API_KEY
export LIVETTS_API_KEY
export LIVETTS_MODEL_VERSION='团队确认的版本'
export LIVETTS_VOICES_JSON='[{"id":"studio","name":"Studio","name_zh":"默认音色","description":"Approved preset","description_zh":"已授权预置音色","tim":"40000"}]'
export LIVETTS_DEMO_ENABLED=true
.venv/bin/python -m uvicorn app:app --host 127.0.0.1 --port 7860 --no-access-log
```

`40000` 仅来自已有接口示例，不构成其适用于所选模型的保证。请替换为已验证参数。用户界面中的三类文本是测试输入，不是多语言质量认证。

## 部署到 Hugging Face Spaces

1. 使用有资格创建 Docker Space 的团队账号，SDK 选择 **Docker → Blank**，建议先设为 **Private** 并使用基础 CPU。当前平台要求相应付费方案；静态预览不受此计算托管要求影响。
2. 将**本目录中的** `README.md`、`Dockerfile`、`requirements.txt`、`app.py`、`provider.py`、`static/` 上传到 Space 根目录。不要上传上层工作区、`.venv`、任何 `.env` 或原始 API 脚本。
3. 构建完成后可看到界面预览。无需 GPU：合成在远程 LiveTTS API 上完成。
4. 在 **Settings → Variables and secrets** 配置下表，Secret 值不要写在仓库里。
5. 保持页面关闭生成时完成配置，确认无误后设置 `LIVETTS_DEMO_ENABLED=true`，重启 Space。
6. 用短句进行一次真实联调：验证 WAV 可播放、音色及版本正确、接口鉴权、超时和额度符合预期。此步骤可能消耗调用额度，本交付未执行。
7. 团队审核隐私文案、音色授权和开放额度后，再将 Space 改为 Public，并对外分享。

### 环境变量

| 名称 | 类型 | 默认值 / 说明 |
| --- | --- | --- |
| `LIVETTS_API_KEY` | **Secret** | 必填，服务端 `X-API-KEY`，绝不返回浏览器 |
| `LIVETTS_MODEL_VERSION` | Variable | 必填，明确指定所需模型版本，不猜测最新版 |
| `LIVETTS_VOICES_JSON` | **Secret 推荐** | 必填，授权音色数组，见下例；内部 `fid` 不暴露给浏览器，但若设为普通 Variable，仍可能在平台设置/复制 Space 时被公开 |
| `LIVETTS_DEMO_ENABLED` | Variable | `false`，必须显式设为 `true` 才允许合成 |
| `LIVETTS_API_URL` | Variable | `https://open-live-api.jd.com/livetts`，必须为 HTTPS |
| `LIVETTS_DEMO_PASSWORD` | **Secret** | 可选，内测访问码；默认不设。建议上线前启用 |
| `LIVETTS_MAX_CHARACTERS` | Variable | `500`，允许 50–2000，按 Unicode 码点计数 |
| `LIVETTS_DAILY_LIMIT` | Variable | `100`，每实例 UTC 自然日最多尝试次数 |
| `LIVETTS_PER_MINUTE` | Variable | `6`，每实例滚动一分钟最多尝试次数 |
| `LIVETTS_MAX_CONCURRENT` | Variable | `2`，每实例最大并发合成数 |
| `LIVETTS_CONTACT_URL` | Variable | 可选，团队确认的 `https` 联系页或 `mailto` 地址；未设则不显示联系按钮 |

前端公开配置只包含展示名称、模型版本、音色公共 ID、字数上限等，不包含密钥、后端地址、访问码、`fid` 或 `tim`。

音色白名单示例，**替换成有权向公众展示的音色**：

```json
[
  {
    "id": "studio",
    "name": "Studio",
    "name_zh": "默认音色",
    "description": "Approved API preset",
    "description_zh": "已授权 API 预置音色",
    "tim": "40000"
  }
]
```

预注册的克隆音色可由管理员在条目中配置 `fid`；浏览器仅发送白名单 `id`，不能指定任意 `fid`。最多 20 个条目，公共 ID 必须唯一，仅含字母、数字、`_`、`-`。**公开上传/实时克隆未启用**：当前注册示例会在上游创建音色，未确认同意机制、访问控制、存储及删除政策前，不应直接开放。

### Docker 本地验证

```sh
docker build -t livetts-space .
docker run --rm -p 127.0.0.1:7860:7860 livetts-space
```

不要把密钥放入 Docker build args 或镜像层。Hugging Face Secrets 会在运行时注入环境变量。

## 体验页 API

`GET /healthz` 返回进程健康状态及是否就绪。`GET /api/config` 返回前端安全配置。

```sh
curl --fail-with-body http://127.0.0.1:7860/api/generate \
  -H 'Content-Type: application/json' \
  --data '{"text":"你好，这是 LiveTTS。","voice_id":"studio","speed":1.0}' \
  --output livetts.wav
```

启用访问码时还需 `X-Demo-Password` 请求头。此接口是体验页包装层，**不是生产 API 的通用文档或 SLA**。

返回 `audio/wav`，响应头包括：

- `X-Audio-Duration`：生成音频时长。
- `X-Generation-Seconds`：服务端从请求合成到封装 WAV 的用时。
- `X-Upstream-First-Chunk-Seconds`：服务端收到首个非空音频分片的用时。**不是浏览器首声延迟**。

本实现收齐音频后才返回，不提供边生成边播。总超时 120 秒，单请求网络超时 40 秒，最多 300 个分片，PCM 最多 8 MB。非成功状态返回 JSON `{"error":"稳定错误码"}`；不会泄漏上游响应或内部异常详情，也不会自动重试可能计费的请求。

## 公开服务边界

- 默认关闭生成，需要密钥、模型版本、非空音色白名单、显式开关同时满足。
- 限额是所有访客共享的进程内限额，不依赖可伪造的客户端 IP，也不是每用户额度。上游失败仍计为一次尝试。
- **重启会清空计数，多副本会各有一份计数。** Docker 固定单 worker；正式公开前必须同时设置上游 API 账号的硬额度，或接入外部持久化限额/鉴权。这里的限制不能替代账单保护。
- Space 跨域 iframe 嵌入可用；不为合成路由开放跨域 CORS，并检查浏览器 POST 的 Origin。应用 API 是公开端点，知晓地址的人仍可能用非浏览器客户端调用，不能把 Origin 校验当身份认证。
- 可选体验码是共享内测保护，不是用户账户系统或防滥用平台。若大规模对外开放，建议增加独立用户额度、验证码和监控。
- 本应用不写入音频/文本文件、不输出访问日志，不含第三方分析脚本或外部字体。基础设施与上游运营方可能保留日志，页面已说明。
- 语言偏好写入浏览器本地存储；文本、访问码及最多 5 条音频只保留在当前页面内存。关闭、刷新或清空历史后不会恢复。
- 故意没有排行榜、未经验证的低延迟数字、虚构 MOS 分数、伪造用户评价或未经授权的声音样本。

## 文件结构

```text
app.py               配置、鉴权、限额、请求校验与静态页
provider.py          LiveTTS HTTPS 协议适配与 WAV 封装
static/index.html    页面语义与组件结构
static/style.css     响应式界面
static/app.js        双语、合成、真实波形、播放器、会话记录
Dockerfile           Hugging Face Docker Space 入口
```

## 本次验证

- Python 编译、JavaScript 语法、依赖一致性检查通过。
- 使用本地模拟上游完成 32 项后端检查：分片/WAV、参数映射、异常响应、凭证隔离、访问码、Origin、输入与大小限制、并发释放、分钟与日限额等。
- 浏览器验证中英切换、字符计数（含非 BMP 字符）、超长输入禁用、生成/播放、会话记录、失败提示、API 弹窗，以及桌面和手机布局。测试信号来自临时隔离的 QA 服务，不是 LiveTTS 音频，不包含在交付应用中。
- 65 个 HTML ID 无重复，65 个双语标签与脚本选择器检查通过。交付文件扫描未发现凭证。
- **未执行真实 LiveTTS 调用、Docker 镜像构建或 Hugging Face 远程部署**。本机 Docker daemon 不可用；真实模型、音色与账号需团队确认后联调。

Hugging Face 官方部署规范：<https://huggingface.co/docs/hub/spaces-sdks-docker>。
