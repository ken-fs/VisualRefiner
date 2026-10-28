# VisualRefiner — alternativeTo 提交包（2026-10-28 改成 SVG/DXF 切割文件定位）

> 人工操作：注册要邮箱验证。约 10–15 分钟。文案直接粘。

## 第 0 步：注册

https://alternativeto.net → 右上角 Sign up → 邮箱验证。

## 第 1 步：Add new application

登录后：头像菜单 → **Add new application**。

### Name and main purpose

- **Name:** `VisualRefiner`
- **Website:** `https://visualrefiner.com`
- **Short description:**

```
Browser-only tools that turn images into SVG and DXF cut files for Cricut, laser and CNC, plus image and video converters. Nothing is uploaded.
```

### Grab data from external sources

跳过（没有 App Store 条目）。

### Main data

| 字段 | 填 |
|---|---|
| Platforms | **Online**（只勾这个） |
| Price | **Free** |
| Open source | **Yes** |
| License | **MIT** |
| Source code | `https://github.com/ken-fs/VisualRefiner` |
| Category | **Photos & Graphics**（没有就选 Development / CAD 附近的） |

**Full description:**

```
VisualRefiner is a set of free file tools that run entirely in your browser. Nothing is uploaded: files are processed on your own device with Canvas, WebCodecs and WebAssembly, so there is no queue, no account and no server size limit.

Cut files:
- PNG / JPG to SVG: trace a logo, drawing or signature into a vector for Cricut or Silhouette
- SVG to DXF: type the real width in mm or inches and the DXF comes out at that size, one layer per color (handy in LightBurn)
- PNG to DXF: trace first, then export DXF for laser cutters and CNC
- SVG viewer and SVG to PNG / JPG / WebP

Everyday tools:
- Convert HEIC, AVIF, WebP, PNG and JPG both ways; compress, resize, crop
- Remove backgrounds and EXIF/GPS metadata
- Convert and trim video, make GIFs, transcribe audio to text

Honest limitations: tracing gives outlines, not single centerlines, so a laser cuts both sides of a traced line. Text in an SVG has to be converted to paths before DXF export. One file at a time. Code is public under MIT.
```

### Additional metadata

- **Tags:** `svg` `dxf` `vectorizer` `image-tracing` `laser-cutting` `cnc` `cricut` `no-upload` `privacy` `image-converter` `open-source` `free`
- **截图（按顺序上传）:**
  1. `screenshots/2026-10/home.png`（首页 + 描图工具）
  2. `screenshots/2026-10/svg-to-dxf.png`（SVG 转 DXF）
  3. `screenshots/2026-10/png-to-svg.png`（PNG 转 SVG）

## 第 2 步：条目通过后挂 alternatives（流量主要从这来）

去这些软件页，点 **Suggest alternative** 把 VisualRefiner 加进去。**每 1–2 天挂一个**，新账号一次挂太多容易被风控。

| 目标页 | 理由（粘贴，每条可以再改几个字） |
|---|---|
| https://alternativeto.net/software/vector-magic/about/ | Traces PNG/JPG into SVG in the browser for free, and can export DXF at a real size for laser and CNC. Nothing is uploaded. |
| https://alternativeto.net/software/vectorizer-ai/about/ | Free in-browser image tracing to SVG, no upload and no credits. Also exports DXF sized in mm for cutting. |
| https://alternativeto.net/software/inkscape/about/ | If you only need Trace Bitmap and DXF export, this does both in a browser tab without installing anything. |
| https://alternativeto.net/software/convertio/about/ | Same kind of format conversions, but the file stays on your device. Includes SVG to DXF and PNG to SVG. |
| https://alternativeto.net/software/cloudconvert/about/ | Conversions run locally in the browser instead of on a server. Free, no account, no upload queue. |

> 上面几个链接是按 alternativeTo 的网址规则拼的，打不开就在站内搜软件名。

## 提交后

- [ ] 条目网址记进 `outreach-progress.md`
- [ ] 一周后看审核状态，开始挂 alternatives
