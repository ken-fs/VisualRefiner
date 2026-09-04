/**
 * AVIF encode/decode via the Squoosh libavif WASM build (@jsquash/avif,
 * Apache-2.0 — see THIRD_PARTY_NOTICES.md).
 *
 * Same delivery pattern as the OpenCV eraser: the emscripten glue is plain
 * ESM served from /public/vendor/avif and imported at runtime only when an
 * AVIF encode/decode actually happens — it resolves its .wasm next to itself
 * via import.meta.url, so no bundler ever touches the codec. (Bundling it
 * stalls Turbopack and bloats the chunk graph with 3.5 MB WASM assets.)
 *
 * Encoding must always go through WASM: canvas.toBlob only supports AVIF in
 * Chromium and silently returns a PNG elsewhere. Decoding exists as a
 * fallback for browsers without native AVIF support (older Safari).
 */

type EncodeOptions = {
  quality: number;
  qualityAlpha: number;
  denoiseLevel: number;
  tileColsLog2: number;
  tileRowsLog2: number;
  speed: number;
  subsample: number;
  chromaDeltaQ: boolean;
  sharpness: number;
  tune: number;
  enableSharpYUV: boolean;
  bitDepth: number;
  lossless: boolean;
};

type AvifEncoder = {
  encode(data: Uint8Array, width: number, height: number, options: EncodeOptions): Uint8Array | undefined;
};

type AvifDecoder = {
  decode(buffer: ArrayBuffer, bitDepth: number): ImageData | null;
};

type EmscriptenFactory<M> = (moduleArg?: Record<string, unknown>) => Promise<M>;

/** Mirrors @jsquash/avif defaultOptions (meta.js). */
const DEFAULT_OPTIONS: EncodeOptions = {
  quality: 50,
  qualityAlpha: -1,
  denoiseLevel: 0,
  tileColsLog2: 0,
  tileRowsLog2: 0,
  speed: 6,
  subsample: 1,
  chromaDeltaQ: false,
  sharpness: 0,
  tune: 0,
  enableSharpYUV: false,
  bitDepth: 8,
  lossless: false,
};

let encoderReady: Promise<AvifEncoder> | null = null;
let decoderReady: Promise<AvifDecoder> | null = null;

function loadEncoder(): Promise<AvifEncoder> {
  encoderReady ??= (async () => {
    // The multithreaded build needs SharedArrayBuffer (cross-origin isolation);
    // everywhere else the single-threaded build runs.
    const { default: factory } = (
      typeof SharedArrayBuffer !== "undefined"
        ? await import(/* webpackIgnore: true */ "/vendor/avif/avif_enc_mt.js")
        : await import(/* webpackIgnore: true */ "/vendor/avif/avif_enc.js")
    ) as { default: EmscriptenFactory<AvifEncoder> };
    return factory({ noInitialRun: true });
  })();
  return encoderReady;
}

function loadDecoder(): Promise<AvifDecoder> {
  decoderReady ??= (async () => {
    const { default: factory } = (await import(
      /* webpackIgnore: true */ "/vendor/avif/avif_dec.js"
    )) as { default: EmscriptenFactory<AvifDecoder> };
    return factory({ noInitialRun: true });
  })();
  return decoderReady;
}

export async function encodeAvif(data: ImageData, quality: number): Promise<Blob> {
  const avif = await loadEncoder();
  const options = { ...DEFAULT_OPTIONS, quality: Math.round(quality) };
  const output = avif.encode(new Uint8Array(data.data.buffer), data.width, data.height, options);
  if (!output) throw new Error("AVIF encoding failed.");
  return new Blob([output.buffer as ArrayBuffer], { type: "image/avif" });
}

export async function decodeAvif(buffer: ArrayBuffer): Promise<ImageData> {
  const avif = await loadDecoder();
  const data = avif.decode(buffer, 8);
  if (!data) throw new Error("Could not decode this AVIF file.");
  return data;
}

export function isAvifFile(file: File): boolean {
  return file.type === "image/avif" || /\.avifs?$/i.test(file.name);
}
