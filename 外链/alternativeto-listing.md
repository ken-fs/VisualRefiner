# VisualRefiner — alternativeTo 提交包

> 需要人工操作（注册需邮箱验证，我无法替你点）。预计 10-15 分钟。
> 所有文案可直接粘贴。诚实定位，不编造数据。

## 第 0 步：注册账号（你做）

https://alternativeto.net → 右上角 Sign up → 邮箱验证。

## 第 1 步：Add new application

登录后：头像菜单 → **Add new application**。

### Step 1 — Name and main purpose

- **Name:** `VisualRefiner`
- **Website:** `https://visualrefiner.com`
- **Short description（粘贴）:**

```
Free image & video tools that run entirely in your browser. Convert, compress, resize, erase objects, strip EXIF/GPS metadata — your files never leave your device. No upload, no account, no tracking of your files.
```

### Step 2 — Grab data from external sources

**跳过**（无 App Store / Mac Store 条目）。

### Step 3 — Main data

| 字段 | 填 |
|---|---|
| Platforms | **Online**（只勾这个；浏览器工具） |
| Price | **Free**（无付费层） |
| Open source | **Yes** |
| License | **MIT** |
| Source code | `https://github.com/ken-fs/VisualRefiner` |
| Category | 下拉选最接近的：**Photos & Graphics**（或 File Management） |

**Full description（粘贴）:**

```
VisualRefiner is a collection of image and video tools that do their work entirely in the browser. Unlike CloudConvert, Zamzar or iLoveIMG, nothing is uploaded to a server: the file is processed on your own device with Canvas, WebCodecs and WebAssembly. That means no queue, no size limits from a server, no account, and it keeps working offline once loaded.

Tools included:
- Image conversion: HEIC to JPG/PNG/WebP, PNG, JPG, WebP conversions both ways
- Video conversion: MP4/WebM, MOV/MKV to MP4 or WebM, video to GIF, frame extraction, video trimming
- Image compression and resizing
- Metadata tools: view and remove EXIF/GPS data from photos (lossless), strip video metadata
- Origin check: read C2PA Content Credentials and AI-generator fingerprints
- Object eraser for photos

Honest limitations: one file at a time (no batch yet), and video conversion depends on the codecs your browser supports. The code is public under MIT.
```

### Step 4 — Additional metadata

- **Tags / features（有多少加多少）:** `privacy` `no upload` `offline` `image-converter` `video-converter` `heic` `compress-images` `metadata-removal` `exif` `open-source` `free`
- **Screenshots（上传 2-3 张，desktop 版）:**
  1. `screenshots/homepage_desktop.png`（工具索引页）
  2. `screenshots/image-compressor_desktop.png`（工具界面）
  3. `screenshots/guide-webp-vs-png_desktop.png`（内容页，可选）
- **Social / links:** GitHub repo 同上；无 Twitter/FB 就留空。

## 第 2 步：条目上线后，逐个挂 alternatives（关键动作）

条目通过后，到你自己的页面底部找 **"Suggest alternative"**，同时去下面这些页面把 VisualRefiner 添加为替代 —— 这才是 referral 流量来源（你会出现在他们的 alternatives 列表里）：

| 目标页面 | 理由文案（粘贴，每条稍改） |
|---|---|
| `/software/cloudconvert/` | Same conversions, but the file never leaves your device — processing is 100% in the browser. Free, no account, no upload queue. |
| `/software/tinypng/` | Compresses images like TinyPNG but without uploading them anywhere. Runs locally in the browser tab. |
| `/software/zamzar/` | Format conversion without the upload-and-wait: everything runs on your own device. |
| `/software/convertio/` | In-browser alternative to Convertio. No upload, no file size limit from a server, no signup. |
| `/software/iloveimg/` | Image toolkit (convert/compress/resize/metadata) that processes files locally instead of on a server. |

⚠️ 每条间隔 1-2 天挂，别一次全挂（新账号密集操作易被风控）。

## 提交后

- [ ] 把条目 URL 记进 `outreach-progress.md`
- [ ] 一周后检查审核状态 + 开始挂 alternatives
