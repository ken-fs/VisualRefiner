# Building image & video conversion that never leaves the browser

> Local, uncommitted draft (lives in the Ship workspace root, not in the repo).
> Publishing notes are at the bottom — they matter for the dofollow backlink.

---

*How VisualRefiner converts HEIC, compresses images, and transcodes video with
no server, no upload, and no account — using the Canvas API, WebCodecs, and a
little WebAssembly.*

Most "free online converters" work like this: you pick a file, it's uploaded to
a server, converted there, and sent back. That's fine for a meme. It's less fine
for a folder of personal photos, a passport scan, or client footage under NDA.

I built [VisualRefiner](https://visualrefiner.com) to do the same jobs without
the upload. Every conversion runs in the browser tab on your own machine. There
is no backend to send files to — the whole site is a static export — so "your
files never leave your device" isn't a privacy promise, it's just how the
architecture works. Here's the interesting part of how it's put together.

## The core: `<canvas>` is a format converter

The humble 2D canvas is already an image transcoder. Decode any image the
browser understands into an `ImageBitmap`, draw it, and re-encode with
`toBlob()` — the MIME type you pass decides the output format:

```js
async function convert(file, type = "image/jpeg", quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d", { alpha: true }).drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("encode failed"))),
      type,           // "image/jpeg" | "image/png" | "image/webp"
      quality,        // ignored for PNG (lossless)
    ),
  );
}
```

That single function is PNG↔JPG↔WebP conversion and JPG/WebP compression (the
`quality` argument) all at once. No dependency, no upload, works offline. The
result is a `Blob`; wrap it in `URL.createObjectURL()` for a preview or a
download link.

Two details that bite you if you skip them:

- **Revoke your object URLs.** Each `createObjectURL` pins the blob in memory
  until you `URL.revokeObjectURL()` it. In a tool people use repeatedly, forgetting
  this is a slow leak. Revoke the previous URL every time you produce a new one.
- **PNG ignores `quality`.** A "quality slider" on a PNG export does nothing —
  PNG is lossless. Hide the control or convert to WebP if the user wants a smaller
  file with a quality knob.

## HEIC: the format the canvas can't read

Then there's HEIC — the format iPhones save by default. Most browsers *won't*
decode it in a `<canvas>` pipeline, so `createImageBitmap()` throws. The fix is to
decode it ourselves first, with [libheif](https://github.com/strukturag/libheif)
compiled to WebAssembly (via [heic2any](https://github.com/alexcorvi/heic2any)):

```js
async function normalize(file, quality) {
  const isHeic = /heic|heif/i.test(file.type) || /\.hei[cf]$/i.test(file.name);
  if (!isHeic) return file;

  // Only pulled in when someone actually hands us a HEIC file.
  const { default: heic2any } = await import("heic2any");
  const out = await heic2any({ blob: file, toType: "image/jpeg", quality });
  return Array.isArray(out) ? out[0] : out;
}
```

Now HEIC flows into the same canvas function as everything else. The WASM decoder
is the heaviest thing on the site (~2 MB), which brings up the next point.

## Load the heavy parts lazily

If you bundle libheif, a video engine, and a GIF encoder into your main chunk,
your homepage pays for tools the visitor may never touch. The trick is a dynamic
`import()` at the moment of use — note the `await import(...)` inside both
functions above and below. The bundler splits each into its own chunk, and the
network tab confirms the 2 MB HEIC decoder only downloads when someone converts a
HEIC file. The [homepage](https://visualrefiner.com) ships a small bundle; the
weight arrives on demand.

High-quality **resizing** is the same story. Canvas `drawImage` downscaling
aliases badly (jagged edges, moiré). [pica](https://github.com/nodeca/pica) does
proper Lanczos-style resampling, so it's loaded only on the resize path:

```js
if (needsResize) {
  const { default: pica } = await import("pica");
  await pica().resize(sourceCanvas, targetCanvas);
}
```

## Video, without FFmpeg-in-WASM

Video is where people reach for `ffmpeg.wasm`, but it's a big download and slow.
Modern browsers expose [WebCodecs](https://developer.mozilla.org/docs/Web/API/WebCodecs_API)
— hardware-accelerated encode/decode built into the browser. VisualRefiner drives
it through [mediabunny](https://github.com/Vanilagy/mediabunny) to transcode clips
to MP4 or WebM, extract frames as PNG, or build a GIF (with
[gifenc](https://github.com/mattdesl/gifenc)) — all in the tab.

The honest caveat: WebCodecs support and the available codecs **depend on the
browser**. So conversion isn't guaranteed for every exotic input the way the
canvas image path is. The tool checks and tells you when a track can't be
decoded, rather than pretending. That trade — depend on the platform, degrade
honestly — beats shipping a 25 MB WASM FFmpeg to every visitor.

## Why static export makes the privacy claim trivially true

The site is a Next.js app exported to static files (`output: "export"`) and served
as plain assets from a CDN. There is no API route, no server that receives a file,
nothing to log. You don't have to trust a privacy policy — open DevTools → Network,
convert something, and watch: **zero upload requests**. The bytes stay in the tab.

That also means the "server cost" of a converter that could handle thousands of
files is… a static host. All the compute is the user's.

## Takeaways

- `<canvas>` + `toBlob()` is a complete image converter/compressor with zero deps.
- For formats the browser can't decode (HEIC), a WASM decoder bridges the gap —
  load it lazily so everyone else doesn't pay for it.
- Prefer WebCodecs over WASM FFmpeg for video when you can accept
  browser-dependent codec support.
- Dynamic `import()` per feature keeps the initial bundle small.
- A static export turns "we don't upload your files" from a promise into an
  architectural fact.

If you want to see it in action, the tools are at
[visualrefiner.com](https://visualrefiner.com) — [HEIC → JPG](https://visualrefiner.com/heic-to-jpg),
[image compressor](https://visualrefiner.com/image-compressor),
[video to GIF](https://visualrefiner.com/video-to-gif) — and the code is on
[GitHub](https://github.com/ken-fs/VisualRefiner).

---

## Publishing notes (for the backlink)

- **dev.to allows dofollow links in the post body** — the links to
  `visualrefiner.com` above are the point. Keep at least the intro + closing links.
- If you also publish this on your own blog, set dev.to's **Canonical URL** to your
  copy so you don't split ranking signals. If dev.to is the only home, leave it blank.
- Add tags: `webdev`, `javascript`, `webassembly`, `privacy`.
- Cross-post the same piece to **Hashnode** and link it from the repo README —
  more editorial surfaces, more citable passages for AI answers.
- After publishing, submit the article URL (not just the homepage) to the Show HN /
  Reddit posts — a technical writeup fares better on HN than a bare tool link.
