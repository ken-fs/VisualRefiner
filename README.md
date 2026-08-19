# VisualRefiner

**Privacy-first image and video tools that run entirely in your browser.**

🔗 **Live site: [visualrefiner.com](https://visualrefiner.com)**

VisualRefiner converts, compresses, resizes, and extracts image and video files
without installing software or uploading anything to a server. Every file is
processed locally in the browser tab, so your photos and videos never leave your
device — and the tools keep working offline.

---

## Why local processing

Most online converters upload your file to a server, process it there, and send
it back. VisualRefiner doesn't. The conversion runs on your own machine using
browser APIs (Canvas, WebCodecs) and a few small open-source libraries. That
means:

- **Private by default** — personal photos and videos stay on your device.
- **No upload/download wait** — nothing is transferred over the network.
- **No account, no queue, no limits** — open a page and use it.

There is no server-side processing, no tracking of your files, and no sign-up.

For a technical deep-dive on how the in-browser conversion works (Canvas, WebCodecs,
lazy-loaded WASM), read
[Building image & video conversion that never leaves the browser](https://dev.to/ken_lee_fc82a8ce3a147aea6/building-image-video-conversion-that-never-leaves-the-browser-iga).

## Tools

Each tool is a focused page that does one real task:

### Images
- **[Image converter](https://visualrefiner.com/image-converter)** — switch between JPG, PNG, and WebP (HEIC/HEIF input supported)
- **[Image compressor](https://visualrefiner.com/image-compressor)** — reduce file size with a visible quality control
- **[Image resizer](https://visualrefiner.com/image-resizer)** — change pixel dimensions without stretching
- Format-specific converters: HEIC→JPG/PNG/WebP, PNG↔JPG, PNG/JPG→WebP, WebP→PNG/JPG

### Video
- **[Video converter](https://visualrefiner.com/video-converter)** — convert to MP4 or WebM
- **[Frame extractor](https://visualrefiner.com/extract-video-frames)** — save evenly spaced frames as PNG stills
- **[Video to GIF](https://visualrefiner.com/video-to-gif)** — turn a short clip into a looping GIF
- Format-specific converters: MOV→MP4, MKV→MP4, WebM→MP4

### Guides
Plain-language explainers that link to the matching tool:
- [WebP vs PNG](https://visualrefiner.com/guides/webp-vs-png)
- [What is HEIC, and how do you open it?](https://visualrefiner.com/guides/heic-explained)
- [What compression quality should you use?](https://visualrefiner.com/guides/image-compression-quality)
- [MP4 vs WebM](https://visualrefiner.com/guides/mp4-vs-webm)

## Tech stack

- **[Next.js](https://nextjs.org/)** (App Router, static export) + **React** + **TypeScript**
- **pnpm** for package management
- Deployed as static assets on **Cloudflare**
- Browser processing libraries, loaded only on the routes that need them:
  [pica](https://github.com/nodeca/pica) (resizing),
  [mediabunny](https://github.com/Vanilagy/mediabunny) (video),
  [heic2any](https://github.com/alexcorvi/heic2any) (HEIC decoding),
  [gifenc](https://github.com/mattdesl/gifenc) (GIF encoding),
  [@iconify/react](https://github.com/iconify/iconify) (icons)

## Getting started

Requires Node.js 22+ and pnpm.

```bash
pnpm install
pnpm dev        # start the dev server at http://localhost:3000
```

Other scripts:

```bash
pnpm build      # static export to ./out (+ design-contract check)
pnpm lint       # eslint
pnpm test       # tsx tests/tools.test.ts
```

## Build & deploy

`pnpm build` runs `next build` (configured with `output: "export"`) and writes a
fully static site to `out/`. That directory is served by Cloudflare (see
`wrangler.jsonc`); HTTP security headers are set via `public/_headers`.

## Project structure

```
src/
  app/                 # routes: one folder per tool page + /guides
  components/          # tool workspaces (ImageWorkspace, VideoConverter, …) and page shells
  lib/                 # tools, conversions, guides, and schema.org helpers
public/                # static assets (_headers, og.png, favicon)
scripts/               # build helpers (design-contract injector, og image)
```

## Third-party software

Open-source dependencies and their licenses are listed in
[THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) and on the site's
[open-source page](https://visualrefiner.com/open-source).

---

Built and maintained by [@ken-fs](https://github.com/ken-fs) ·
[visualrefiner.com](https://visualrefiner.com)
