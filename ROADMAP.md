# Roadmap — candidate tools & features

Backlog of vetted additions for VisualRefiner. Each item is feasible with the
current stack (Next.js static export, browser-only processing) and fits the
"local, no upload" positioning. Effort is rough (S/M/L). Add new tools via the
`src/lib/tools.ts` / `src/lib/conversions.ts` / `src/lib/guides.ts` registries so
they flow into the home tool index, sitemap, and internal links automatically.

## Shipped (2026-08-22)

- `/image-cropper` — drag-select / aspect-ratio crop (Canvas)
- `/remove-metadata` — EXIF/GPS detect + strip by re-encode (Canvas)
- `/trim-video` — trim to start/end, export MP4/WebM (mediabunny)
- Reverse video landing pages: `/mp4-to-webm`, `/mov-to-webm`, `/mkv-to-webm`
- Guides: `/guides/remove-image-metadata`, `/guides/avif-vs-webp`

## Backlog — not yet built

### 1. Batch image conversion + ZIP download — value: high, effort: M
Convert/compress/resize many images at once and download them as a single ZIP.
- Needs: add `jszip` dependency (not currently installed).
- Notes: extend `ImageWorkspace` to accept multiple files, or a new
  `BatchWorkspace` component. Reuse the existing per-image encode path; collect
  blobs and zip client-side. Watch memory on large batches — process
  sequentially and release object URLs.
- Fits: power-user feature; strong "no upload" story for bulk work.

### 2. Favicon / ICO generator — value: high (search), effort: M
Generate a multi-size `.ico` (16/32/48) plus PNG touch icons from one image.
- Needs: no new dep for PNG sizes (Canvas). `.ico` is a container of PNGs —
  hand-write the ICO header + directory (small, well-documented format) or add a
  tiny encoder. Provide PNG outputs (`favicon-32.png`, `apple-touch-icon.png`)
  and a combined `.ico`.
- New page: `/favicon-generator`. High search intent.

### 3. Video compressor — value: high, effort: M
Reduce a video's size by lowering resolution and/or bitrate.
- Needs: mediabunny (already installed). Expose target resolution + a
  quality/bitrate control in a new `VideoCompressor` component; reuse the
  `Conversion` pipeline with video encode options.
- New page: `/compress-video`. Pairs with the trimmer and converter.

### 4. Extract audio / mute video — value: medium, effort: M
Pull the audio track out (to a supported audio file), or export the video with
audio removed.
- Needs: mediabunny — drop the video track (mute) or keep only audio.
- New pages: `/extract-audio`, `/mute-video`. Confirm which audio output
  containers/codecs the browser + mediabunny support before finalizing format
  choices.

### 5. Rotate / flip image — value: medium, effort: S
Rotate 90/180/270 and horizontal/vertical flip.
- Needs: Canvas only (no dep). Could be a small standalone `/rotate-image` page
  or an added mode; trivial transform + re-encode.

### 6. Image → Base64 / Data URI — value: low-medium, effort: S
Output a copy-paste data URI for small images.
- Needs: `FileReader`/Canvas only. New page `/image-to-base64`. Warn about size
  bloat for large images.

## Future direction — accounts + AI features (needs product decision + backend)

Goal (recorded 2026-08-22): add **registration / login** to gate **AI-powered
capabilities** — e.g. AI watermark removal and other AI processing for images and
video. This is a strategic shift, not a backlog item, because it breaks the
current architecture and positioning in ways that need a deliberate decision
before any code.

**Why it's a bigger change than the backlog above**
- The site is today a **static export, client-only, no-upload** app on Cloudflare.
  AI watermark removal can't run client-side at usable quality — it needs a model
  on a server, which means **files must be uploaded**. That directly contradicts
  the "local, no upload" promise every current tool makes.
- So it needs real backend surface the project doesn't have yet: an API
  (Cloudflare Workers / Pages Functions or a separate service), user accounts,
  sessions, and almost certainly usage limits or billing.

**Positioning (important):** keep the existing free tools exactly as they are —
local, no upload — and introduce AI tools as a **clearly separate, account-gated
tier** that states plainly "these run on our servers; your file is uploaded and
deleted after processing." Do not blur the two, or the trust story that sells the
whole site erodes.

**Building blocks to evaluate when this is picked up**
- **Auth**: a provider (Clerk / Auth.js / Supabase Auth) or Cloudflare Access;
  avoid rolling our own password store.
- **Backend/AI**: an AI watermark-removal model or provider endpoint; a Worker to
  proxy it, enforce auth, and meter usage.
- **Storage**: R2 for transient uploads with a strict retention/delete policy.
- **DB**: D1 or Postgres for users + usage counters.
- **Billing / quota** (if paid or rate-limited): Stripe + per-user metering.

**Open questions / risks**
- Free vs paid, and where the free/paid line sits.
- **Legal/ethical**: removing watermarks can raise copyright and platform-ToS
  issues — needs a usage policy and probably an acceptable-use gate.
- Data handling + privacy copy must be rewritten for the uploaded-file tools.
- Whether AI tools live on this domain or a separate app to protect the
  local-first brand.

## Notes / guardrails

- Keep everything client-side; never add an upload path — it's the core promise.
- Prefer extending the shared workspaces over new bespoke components where the
  UI matches (drop field + control panel + result strip pattern).
- Every new tool/guide must be registered in the `src/lib/*` registries so the
  sitemap and internal linking stay in sync (the sitemap is generated from them).
- Deps to consider only when their feature is picked up: `jszip` (batch),
  a small ICO encoder (favicon).
