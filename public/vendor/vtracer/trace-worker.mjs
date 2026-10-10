// Module worker for the image-to-SVG tracer (src/lib/vectorize.ts).
// vtracer (MIT, visioncortex) compiled to WASM by vtracer-wasm — served as a
// static asset like the AVIF codec, so no bundler touches it. Tracing a large
// image takes seconds, which is why it runs off the main thread.
import init, { to_svg } from "./vtracer.js";

// The glue looks for vtracer_bg.wasm by default; the package ships vtracer.wasm.
const ready = init({ module_or_path: new URL("./vtracer.wasm", import.meta.url) });

self.onmessage = async ({ data }) => {
  const { id, pixels, width, height, config } = data;
  try {
    await ready;
    const svg = to_svg(new Uint8Array(pixels), width, height, config);
    self.postMessage({ id, svg });
  } catch (error) {
    // A Rust panic leaves the instance unusable — the caller discards this worker.
    self.postMessage({ id, error: String(error?.message ?? error) });
  }
};
