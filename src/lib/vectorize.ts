/**
 * Image → SVG tracing via vtracer (MIT, visioncortex) compiled to WASM by
 * vtracer-wasm (MIT) — see THIRD_PARTY_NOTICES.md.
 *
 * The glue + .wasm live in /public/vendor/vtracer and run inside a module
 * worker (trace-worker.mjs), same delivery pattern as the AVIF codec: nothing
 * here is bundled, and the 137 KB WASM is only fetched when a trace runs.
 *
 * vtracer-wasm passes its config straight to visioncortex, so the units differ
 * from the vtracer CLI: angles are radians, the speckle filter is an area, and
 * colorPrecision is the number of low bits *dropped* (CLI precision 6 → 2).
 */

export type TraceStyle = "logo" | "illustration" | "photo" | "bw";
export type CurveMode = "spline" | "polygon" | "pixel";
export type Layering = "stacked" | "cutout";

export type TraceSettings = {
  style: TraceStyle;
  /** Ignore patches smaller than this many pixels per side. */
  speckle: number;
  /** Significant bits kept per color channel (1–8); lower = fewer colors. */
  colorBits: number;
  /** Black-and-white cutoff on luminance (0–255). */
  threshold: number;
  invert: boolean;
  curve: CurveMode;
  layering: Layering;
  /** Treat near-white pixels as transparent so the background disappears. */
  dropWhite: boolean;
};

export type VtracerConfig = {
  binary: boolean;
  mode: CurveMode;
  hierarchical: Layering;
  cornerThreshold: number;
  lengthThreshold: number;
  maxIterations: number;
  spliceThreshold: number;
  filterSpeckle: number;
  colorPrecision: number;
  layerDifference: number;
  pathPrecision: number;
};

type StyleTuning = { cornerDegrees: number; layerDifference: number };

// Mirrors the vtracer CLI bw / poster / photo presets. Logo uses a wider layer
// difference than the CLI default (16): it folds JPG noise and anti-aliased
// edges into the flat color next to them (a test JPG went from 84 colors to 4).
const TUNING: Record<TraceStyle, StyleTuning> = {
  logo: { cornerDegrees: 60, layerDifference: 32 },
  illustration: { cornerDegrees: 60, layerDifference: 16 },
  photo: { cornerDegrees: 180, layerDifference: 48 },
  bw: { cornerDegrees: 60, layerDifference: 16 },
};

export const STYLE_DEFAULTS: Record<TraceStyle, TraceSettings> = {
  logo: { style: "logo", speckle: 4, colorBits: 6, threshold: 128, invert: false, curve: "spline", layering: "stacked", dropWhite: false },
  illustration: { style: "illustration", speckle: 4, colorBits: 8, threshold: 128, invert: false, curve: "spline", layering: "stacked", dropWhite: false },
  photo: { style: "photo", speckle: 10, colorBits: 8, threshold: 128, invert: false, curve: "spline", layering: "stacked", dropWhite: false },
  bw: { style: "bw", speckle: 4, colorBits: 6, threshold: 128, invert: false, curve: "spline", layering: "stacked", dropWhite: false },
};

export const STYLE_LABELS: Record<TraceStyle, string> = {
  logo: "Logo / flat colors",
  illustration: "Illustration / clip art",
  photo: "Photo (many colors)",
  bw: "Black & white (cut file)",
};

const degrees = (value: number) => (value * Math.PI) / 180;

export function vtracerConfig(settings: TraceSettings): VtracerConfig {
  const tuning = TUNING[settings.style];
  const speckle = Math.max(1, Math.round(settings.speckle));
  return {
    binary: settings.style === "bw",
    mode: settings.curve,
    hierarchical: settings.layering,
    cornerThreshold: degrees(tuning.cornerDegrees),
    lengthThreshold: 4,
    maxIterations: 10,
    spliceThreshold: degrees(45),
    filterSpeckle: speckle * speckle,
    colorPrecision: 8 - Math.min(8, Math.max(1, Math.round(settings.colorBits))),
    layerDifference: tuning.layerDifference,
    pathPrecision: 2,
  };
}

// Big images trace slowly and produce multi-megabyte SVGs, so they are scaled
// down. Small ones are traced as-is: enlarging a 48px icon first smears its
// edges into in-between colors that trace as halo rings (5 colors → 66).
export const MAX_TRACE_EDGE = 2000;

export function traceSize(width: number, height: number): { width: number; height: number } {
  const edge = Math.max(width, height);
  const scale = edge > MAX_TRACE_EDGE ? MAX_TRACE_EDGE / edge : 1;
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

/**
 * Turns canvas RGBA into the pixels vtracer should see. Black-and-white mode is
 * thresholded here (vtracer's own binary test only looks at the red channel);
 * color mode snaps soft alpha so anti-aliased edges don't trace as halos.
 */
export function preparePixels(rgba: Uint8ClampedArray, settings: TraceSettings): Uint8Array {
  const out = new Uint8Array(rgba.length);
  const binary = settings.style === "bw";
  for (let i = 0; i < rgba.length; i += 4) {
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const a = rgba[i + 3];
    if (binary) {
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const dark = a >= 128 && luminance < settings.threshold;
      const value = dark !== settings.invert ? 0 : 255;
      out[i] = out[i + 1] = out[i + 2] = value;
      out[i + 3] = 255;
      continue;
    }
    const white = settings.dropWhite && r > 238 && g > 238 && b > 238;
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = a < 128 || white ? 0 : 255;
  }
  return out;
}

/**
 * vtracer writes width/height in traced pixels and no viewBox. Add the viewBox
 * so the file scales, and restore the source image's dimensions.
 */
export function finalizeSvg(svg: string, traced: { width: number; height: number }, original: { width: number; height: number }): string {
  return svg
    .replace(/<!--[\s\S]*?-->\s*/g, "")
    .replace(
      /<svg([^>]*?)\swidth="\d+"\sheight="\d+"/,
      `<svg$1 width="${original.width}" height="${original.height}" viewBox="0 0 ${traced.width} ${traced.height}"`,
    );
}

export function svgStats(svg: string): { paths: number; colors: number } {
  const fills = svg.match(/fill="#[0-9a-fA-F]{6}"/g) ?? [];
  return { paths: (svg.match(/<path\b/g) ?? []).length, colors: new Set(fills.map((f) => f.toUpperCase())).size };
}

// --- worker scheduling (browser only) --------------------------------------

let worker: Worker | null = null;
let pending: { id: number; resolve: (svg: string) => void; reject: (error: Error) => void } | null = null;
let nextId = 0;

function discardWorker() {
  worker?.terminate();
  worker = null;
}

/**
 * Traces one image. A newer call cancels the one still running — the slider
 * re-traces on every change, and only the latest settings matter.
 */
export function traceImage(pixels: Uint8Array, width: number, height: number, config: VtracerConfig): Promise<string> {
  if (pending) {
    // There is no way to interrupt WASM mid-trace except dropping the worker.
    pending.reject(new DOMException("Superseded by a newer trace.", "AbortError"));
    pending = null;
    discardWorker();
  }
  worker ??= new Worker("/vendor/vtracer/trace-worker.mjs", { type: "module" });
  const id = ++nextId;
  return new Promise<string>((resolve, reject) => {
    pending = { id, resolve, reject };
    worker!.onmessage = ({ data }: MessageEvent<{ id: number; svg?: string; error?: string }>) => {
      if (!pending || data.id !== pending.id) return;
      const job = pending;
      pending = null;
      if (data.svg !== undefined) {
        job.resolve(data.svg);
      } else {
        discardWorker();
        job.reject(new Error(data.error || "Tracing failed."));
      }
    };
    worker!.onerror = (event) => {
      if (!pending || pending.id !== id) return;
      pending = null;
      discardWorker();
      reject(new Error(event.message || "The tracing engine failed to load."));
    };
    worker!.postMessage({ id, pixels: pixels.buffer, width, height, config }, [pixels.buffer]);
  });
}
