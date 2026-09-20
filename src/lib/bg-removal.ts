/**
 * Browser-side background removal.
 *
 * briaai/RMBG-1.4 runs fully on-device via @huggingface/transformers
 * (WebGPU fp16 when available, quantized WASM otherwise); the model downloads
 * once from Hugging Face and is then served from the browser cache.
 *
 * The module is imported dynamically from the component so none of this —
 * including the ONNX runtime — lands in the initial page bundle.
 */

import { configureOnnxRuntime, webgpuAvailable } from "./onnx-env";

const MODEL_ID = "briaai/RMBG-1.4";

type RawImageT = {
  width: number;
  height: number;
  resize(width: number, height: number): Promise<RawImageT>;
  toCanvas(): HTMLCanvasElement;
  data: Uint8ClampedArray;
};
type Processor = (image: RawImageT) => Promise<{ pixel_values: unknown }>;
type Segmenter = (inputs: Record<string, unknown>) => Promise<{ output: unknown[][] }>;

type Loaded = {
  RawImage: {
    fromURL(url: string): Promise<RawImageT>;
    fromTensor(tensor: unknown): Promise<RawImageT>;
  };
  processor: Processor;
  model: Segmenter;
};

let pending: Promise<Loaded> | null = null;

export function loadSegmenter(onProgress: (percent: number) => void): Promise<Loaded> {
  if (!pending) {
    pending = create(onProgress);
    pending.catch(() => (pending = null)); // allow retry after a failure
  }
  return pending;
}

async function create(onProgress: (percent: number) => void): Promise<Loaded> {
  const t = await import("@huggingface/transformers");
  configureOnnxRuntime(t.env);
  const files = new Map<string, number>();
  const progress_callback = (info: { status?: string; file?: string; progress?: number }) => {
    if (info.status === "progress" && info.file && typeof info.progress === "number") {
      files.set(info.file, info.progress);
      const values = [...files.values()];
      onProgress(Math.round(values.reduce((sum, v) => sum + v, 0) / values.length));
    }
  };
  const processor = (await t.AutoProcessor.from_pretrained(MODEL_ID, { progress_callback })) as unknown as Processor;
  // WebGPU 用 fp16 全速；WASM 用 q8 量化（44MB，单线程也能几秒出结果）。
  const device = (await webgpuAvailable()) ? "webgpu" : "wasm";
  const dtype = device === "webgpu" ? "fp16" : "q8";
  const model = (await t.AutoModel.from_pretrained(MODEL_ID, {
    device,
    dtype,
    progress_callback,
  })) as unknown as Segmenter;
  return { RawImage: t.RawImage as unknown as Loaded["RawImage"], processor, model };
}

/** Returns the subject mask at the photo's resolution (white = keep). */
export async function segmentMask(loaded: Loaded, imageUrl: string, width: number, height: number): Promise<RawImageT> {
  const image = await loaded.RawImage.fromURL(imageUrl);
  const { pixel_values } = await loaded.processor(image);
  const { output } = await loaded.model({ input: pixel_values });
  // output: [1, 1, 1024, 1024] float mask in 0..1; quantize and add the
  // channel dim RawImage.fromTensor requires.
  const tensor = (output[0][0] as { mul(n: number): { to(t: string): { unsqueeze(d: number): unknown } } })
    .mul(255)
    .to("uint8")
    .unsqueeze(0);
  const mask = await loaded.RawImage.fromTensor(tensor);
  return mask.resize(width, height);
}
