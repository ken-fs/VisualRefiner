# VisualRefiner MVP Execution Plan

Date: 2026-08-11

## Goal

Ship a statically deployable, English-first tool site where users can process common image and video files locally in the browser. The first release should be useful before AdSense or paid AI is introduced.

## Phase 1 — Foundation

- Initialize Next.js, React, TypeScript and pnpm.
- Configure static export, metadata, sitemap, robots.txt and `ads.txt`.
- Add the VisualRefiner product record and project-level instructions.
- Establish tokens, typography, responsive layout and the inspection-bench visual system.
- Build shared header, footer, tool index and file drop surface.

Exit: the homepage renders responsively and `pnpm lint` / `pnpm build` pass.

## Phase 2 — Image tools

- Shared image workspace with drag/drop and file picker.
- JPG, PNG and WebP conversion using browser-native decoding and Canvas encoding.
- Compression quality control with before/after byte counts.
- Resize by width or height while preserving aspect ratio.
- Lazy HEIC adapter after the common-format flow is stable.
- Download naming, object URL cleanup and unsupported-format errors.

Routes:

- `/image-converter`
- `/image-compressor`
- `/image-resizer`
- `/heic-to-jpg`
- `/jpg-to-webp`
- `/png-to-webp`

Exit: representative image fixtures complete locally without a network request.

## Phase 3 — Video tools

- MediaBunny-based MP4/WebM conversion with capability checks and progress.
- Frame extraction at evenly spaced timestamps with individual downloads.
- Video-to-GIF using MediaBunny frame decoding and `gifenc` encoding.
- Explicit browser/codec error messages and conservative file-size guidance.

Routes:

- `/video-converter`
- `/extract-video-frames`
- `/video-to-gif`

Exit: a small supported MP4 can convert, yield frames and produce a GIF in current Chrome and Safari where required codecs are available.

## Phase 4 — SEO and launch readiness

- Unique title, description, canonical and explanatory copy per route.
- Tool-specific FAQ content only where answers add real recovery guidance.
- Structured data limited to verifiable product and breadcrumb facts.
- Privacy, terms and open-source notices pages.
- Core Web Vitals review; heavy codecs must remain route-level dynamic imports.
- Cloudflare deployment configuration and domain redirect notes.

Exit: production output is crawlable, no placeholder claims remain, and the main task is usable without JavaScript downloaded for unrelated tools.

## Deferred until demand exists

- Local or server-side AI upscaling.
- Inpainting and object removal.
- Credits, subscriptions, authentication and payment.
- Video enhancement.
- Watermark-focused positioning.
- YouTube or third-party platform downloading.
- Localization.

## Dependency policy

Dependencies must solve a browser capability gap. Initial candidates are `@iconify/react`, `pica`, `heic2any`, `mediabunny` and `gifenc`. FFmpeg WebAssembly is excluded unless a measured format gap justifies its bundle, performance and GPL compliance cost.

## Delivery order

`docs → foundation → image tools → video tools → SEO → lint/build → desktop/mobile review → Cloudflare deployment`
