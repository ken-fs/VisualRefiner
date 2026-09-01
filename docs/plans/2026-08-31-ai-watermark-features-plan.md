# Plan — AI 水印相关功能方案（参考 remove-ai-watermarks）

> **状态（2026-08-31 更新）**：P1–P4 已完成并上线（test/lint/build 全绿）：
> - P1 `/remove-video-metadata` + 指南 `/guides/video-metadata`
> - P2 图片 metadata 工具升级（无损 JPEG/PNG/WebP 剥离 + exifr + AI 指纹）
> - P3 `/check-image-origin` + 指南 `/guides/what-is-c2pa`（自研 JUMBF/CBOR 解析）
> - P4 `/erase-object`（OpenCV.js Telea inpainting，WASM 按需加载）
>
> P5（VAE 再生实验）与 P6（服务器端 AI 分层，含 raiw.cc API 评估）暂缓，
> 记录在案，后续另行调研开发。
>
> **对抗式审查（2026-08-31，13/13 测试）**：审查发现并修复 1 个严重 bug
> （真实 c2pa-rs 文件的 JUMD 为 16B UUID + flag 布局，标签全部解析失败——
> 已用官方 C.jpg fixture 固化回归测试）+ 1 个高严重度数据丢失（PNG 剥离误删
> APNG/HDR chunk）+ 若干健壮性问题（截断 JPEG 越界、CBOR 嵌套炸弹、视频 Input
> 未 dispose、所有容器的方向角守卫）。P1 的 udta/AIGC 清除声明经 mediabunny
> muxer 源码验证成立（输出 moov 全新构建，未知 box 不会复制）。

来源参考：github.com/wiltodelta/remove-ai-watermarks（Python 库，Apache 2.0）。
本文档评估其功能对 VisualRefiner 的可移植性，并给出分期实施方案。
**代码不可直接复用（Python vs 浏览器 TS），移植的是功能概念与信号注册表思路。**

## 约束（与 ROADMAP.md 一致）

- 纯浏览器处理，无上传路径 —— 这是全站核心承诺，本方案 P1–P4 均不破坏它。
- 每个工具一个独立页面，注册进 `src/lib/tools.ts` / `conversions.ts` / `guides.ts`，
  自动流入首页索引、sitemap、内链。
- 复用 `ToolPageShell` + Workspace 组件模式（drop field + control panel + result strip）。
- 所有"移除"类功能文案需带"仅限处理你自己拥有/生成的内容"声明
  （参考对方项目的 docs/legal-and-safety.md 立场）。

---

## P1 — `/remove-video-metadata` 视频元数据清除（价值：高，工作量：M）

对标对方 `video metadata` 命令。填补产品线空白：图片有 remove-metadata，视频没有。

**实现**：mediabunny（已装）remux —— 逐 packet 拷贝音视频流，丢弃容器级
metadata（含 MP4/MOV 的 `moov.udta`、QuickTime `meta`、MKV/WebM 的 `Tags`）。
不转码，速度接近文件拷贝，内存友好（流式）。

**功能要点**：
- 输入 MP4/MOV/MKV/WebM，输出同容器；默认写 `_clean` 后缀不覆盖源文件。
- 清除前先"检测展示"：列出容器里发现的 metadata 字段（复用对方 identify 的展示模式）。
- 附 guide：`/guides/video-metadata`（视频里藏了什么数据、什么是 TC260 AIGC 标签）。

**注意**：remux 不重编码即无损；HDR/10-bit 因不动像素所以天然支持。

## P2 — 图片 metadata 工具升级（价值：高，工作量：S–M）

现有 `/remove-metadata` 的两个短板，对方项目给出了更好的做法：

1. **JPEG 无损剥离**：现在是 canvas 重编码（重新压缩、有质量损失）。
   改为字节级操作：解析 JPEG segment 结构，删除 APPn（EXIF/XMP/COM）段，
   像素扫描数据原样保留。纯 TS 实现，无需新依赖。PNG/WebP 保留 canvas 路径。
2. **检测范围扩大**：只查 EXIF/GPS → 引入 `exifr`（轻量，覆盖 EXIF/XMP/IPTC/ICC），
   并加一层 **AI 生成器指纹识别**：
   - XMP `CreatorTool` / 生成参数（Midjourney、SD、DALL·E 等会在 metadata 留指纹）
   - C2PA manifest 存在性（与 P3 联动）
   - 检测结果页展示"这张图可能是 AI 生成的"及依据。

## P3 — `/check-image-origin` 来源凭证查验（价值：中高（SEO），工作量：M）

对标对方 `identify` 命令。用 Adobe 官方 **c2pa-js**（WASM，浏览器内运行）
读取 Content Credentials：签发者、生成/编辑工具、编辑历史、签名有效性。

- 定位是"查验/展示"，不做移除 —— 纯隐私正向功能，无法律灰色地带。
- 搜索选题好："how to tell if an image is AI generated" / "check C2PA credentials"。
- 配套 guide：`/guides/what-is-c2pa`。
- 无 C2PA 的文件回退展示 P2 的 metadata 指纹结果，形成完整"来源报告"。

## P4 — `/erase-object` 框选区域修复（价值：中，工作量：M–L）

对标对方 `erase` 命令（用户框选 → inpainting 填充）。**只做手动框选，不做
自动水印检测**（自动检测需要对方校准的厂商水印注册表，且法律风险更高）。

- 第一阶段：`opencv.js`（官方 WASM 构建）的 `inpaint()`（Telea/NS），
  适合纯色/简单背景。涂抹式 mask UI（canvas 画笔）。
- 第二阶段（可选升级）：LaMa 或 MI-GAN 的 ONNX 导出 + ONNX Runtime Web
  （WebGPU 加速），复杂背景质量显著更好，代价是 ~100–200MB 模型下载。
- 文案边界：定位"object remover / blemish remover"，声明仅限自有内容。

---

## 隐藏水印（SynthID 等）专题 —— 到底能不能做？

**结论：纯浏览器做不到"可承诺效果"的移除；有一条实验性路线和一条服务器路线。**

### 为什么对方的方案进不了浏览器

对方图片隐形水印移除 = 扩散再生：Qwen-Image-2512（20B 参数）+ Canny
ControlNet + SAM 人脸修复，数十 GB 模型，设计即 CUDA-only。浏览器 WebGPU
的显存、下载量、推理时长（分钟级/张）都不支持这个量级的 pipeline。

### 路线 A：VAE 再生（浏览器可行，但只能标注 experimental）

理论依据：再生攻击研究（regeneration attack）证明，仅经过 VAE
encode → decode 往返，就能破坏多数像素域水印。**重要实证：对方的视频
SynthID 移除就是 VAE 再生方案（noise_std=0.15），并通过了 Gemini 内建
SynthID 验证器** —— 说明这条轻量路线对 SynthID 类水印有真实效力。

浏览器实现路径：
- SD1.5/SDXL 的 VAE 导出 ONNX（~100–335MB，可量化压缩）；
- ONNX Runtime Web + WebGPU 执行；大图需 tiling 分块编码；
- latent 加可控噪声（对标对方 noise_std 参数）再解码。

硬伤：
1. **无法本地验证** —— SynthID 没有公开本地检测器（Google 的检测在 Gemini
   应用内），移除成功与否无法在产品内确认，文案必须是"best-effort，不保证"，
   这与全站其他工具"所见即所得"的确定性体验不一致。
2. 画质损失：VAE 再生会丢失细节、糊化文字（对方图片路径不用纯 VAE 正是这个原因）。
3. 首用需下载百 MB 级模型，与现有工具"秒开"的体验有落差。

**建议：放进 P4 之后的实验性探索，不做承诺性宣传；或者干脆不做，等路线 C。**

### 路线 B：经典信号处理攻击（不推荐）

JPEG 重压、加噪、几何变换等纯浏览器操作。SynthID 等现代水印的设计目标
就是抗这些变换，实测不可靠。作为功能上线只会损害信誉。**否决。**

### 路线 C：服务器端（roadmap 已规划的账号 + AI 分层）—— 两条子路

- **C1 自建 GPU**：按 ROADMAP"Future direction"执行（账号、Worker、R2、计费 +
  GPU 推理服务）。控制力最强，成本与运维最重。
- **C2 接现成 API**：对方的托管服务 raiw.cc 就是这个库 + GPU 的成品，
  若其开放 API，VisualRefiner 的服务端分层可退化为"Worker 代理 + 鉴权 +
  计量"，开发量从月级降到周级。**决定做服务器端时先评估 C2 再考虑 C1。**

### 附带：检测端有一个小机会

SynthID 无公开本地检测器，但开放水印方案（DWT-DCT、TrustMark）有。
对方文档注明 DWT-DCT 检测是 torch-free 的，算法可移植到 WASM/纯 TS。
可作为 P3 来源查验工具的一个加分项（"检测到开放水印方案的存在"），
受众窄，优先级最低。

---

## 分期汇总

| 阶段 | 内容 | 新依赖 | 工作量 |
|---|---|---|---|
| P1 | `/remove-video-metadata` + guide | 无（mediabunny 已装） | M |
| P2 | 图片 metadata 升级：无损 JPEG 剥离 + exifr + AI 指纹 | `exifr` | S–M |
| P3 | `/check-image-origin`（c2pa-js）+ guide | `@contentauth/c2pa-web` 或 c2pa-js | M |
| P4 | `/erase-object`（opencv.js inpaint，可升级 LaMa ONNX） | `opencv.js`（WASM） | M–L |
| P5（实验/待定） | VAE 再生隐形水印 best-effort 工具 | VAE ONNX + onnxruntime-web | L，且不保证效果 |
| P6（战略决策） | 服务器端 AI 分层（先评估 raiw.cc API，再考虑自建） | 全套后端 | 见 ROADMAP |

**建议顺序 P1 → P2 → P3 → P4**：P1/P2 最快上线且强化现有隐私叙事；
P3 抢 SEO 选题；P4 是对方项目最核心的可见能力，但需谨慎文案；
隐藏水印在服务器分层落地前不做承诺。

## 遗留事项（2026-08-31 交付时记录）

**人工验收（机器无法代劳，上线后尽快做）**
- [ ] `/erase-object` 实际涂抹手感与填充效果验收（复杂背景是否涂抹可接受）
- [ ] 真实 Gemini / DALL·E 图片过 `/check-image-origin`，确认 C2PA 字段展示正确
- [ ] 真实豆包/即梦导出 MP4 过 `/remove-video-metadata`，确认 AIGC 标签消失且可播放

**待决策（不阻塞）**
- [ ] 是否在首页 hero 区 `hero-task-index` 加 "Erase an object" 快捷入口（当前只有
  Compress / Resize / Convert video 三个老工具；不加则与全站导航逻辑一致）

## 待调研清单（P5/P6 启动前回答）

- [ ] P5：SD1.5/SDXL VAE 的 ONNX 导出体积与量化后画质；WebGPU 下 tiling 大图
  的可行性；best-effort 文案与产品确定性体验的冲突如何隔离（独立 slug？标注？）
- [ ] P5：寻找可公开使用的 SynthID/水印检测手段做效果抽验（无本地验证器时
  是否值得上）
- [ ] P6：raiw.cc 是否开放 API / 商务合作；定价、配额、SLA、隐私条款
  （文件上传给第三方处理 vs 自建 GPU 的隐私叙事差异）
- [ ] P6：自建 GPU 成本测算（扩散模型推理/张的成本、并发、排队）
- [ ] P6：账号体系选型（Clerk / Auth.js / Supabase Auth）与计费（Stripe）

## 风险

- **法律/平台政策**：去水印类功能有版权与平台 ToS 灰色地带。P1–P3 纯隐私正向，
  无风险；P4 起每个相关页面需 acceptable-use 声明；广告网络（如 AdSense）
  对"watermark removal"关键词敏感，落地页 SEO 措辞建议偏向 "object/blemish
  remover"、"metadata privacy"。
- **品牌一致性**：实验性（P5）与上传类（P6）功能必须与"local, no upload"
  主叙事明确隔离（ROADMAP 已有相同结论）。
