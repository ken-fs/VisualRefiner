/**
 * Browser-side speech-to-text engine.
 *
 * Whisper runs fully on-device via @huggingface/transformers (WebGPU when
 * available, WASM otherwise); the model downloads once from Hugging Face and
 * is then served from the browser cache. Audio is decoded to 16 kHz mono PCM
 * with Web Audio, falling back to mediabunny demux for containers
 * decodeAudioData rejects (e.g. MKV).
 *
 * The module is imported dynamically from the component so none of this —
 * including the ONNX runtime — lands in the initial page bundle.
 */

import type { TranscriptSegment } from "./transcript";

export type ModelSize = "tiny" | "base";

export const MODEL_IDS: Record<ModelSize, string> = {
  tiny: "onnx-community/whisper-tiny",
  base: "onnx-community/whisper-base",
};

const SAMPLE_RATE = 16000;
const WINDOW_SECONDS = 30;

type AsrChunk = { timestamp: [number, number | null]; text: string };
type AsrResult = { text: string; chunks?: AsrChunk[] };
type AsrPipeline = (
  audio: Float32Array,
  options: { return_timestamps: boolean; language?: string },
) => Promise<AsrResult>;

// One pipeline per model — repeat transcriptions skip the download/compile.
const pipelines = new Map<ModelSize, Promise<AsrPipeline>>();

export function loadModel(model: ModelSize, onProgress: (percent: number) => void): Promise<AsrPipeline> {
  let pending = pipelines.get(model);
  if (!pending) {
    pending = createPipeline(MODEL_IDS[model], onProgress);
    pipelines.set(model, pending);
    pending.catch(() => pipelines.delete(model)); // allow retry after a failure
  }
  return pending;
}

async function createPipeline(modelId: string, onProgress: (percent: number) => void): Promise<AsrPipeline> {
  const { pipeline } = await import("@huggingface/transformers");
  const files = new Map<string, number>();
  const track = (info: { status?: string; file?: string; progress?: number }) => {
    if (info.status === "progress" && info.file && typeof info.progress === "number") {
      files.set(info.file, info.progress);
      const values = [...files.values()];
      onProgress(Math.round(values.reduce((sum, v) => sum + v, 0) / values.length));
    }
  };
  const options = { progress_callback: track };
  if (typeof navigator !== "undefined" && "gpu" in navigator) {
    try {
      return (await pipeline("automatic-speech-recognition", modelId, { device: "webgpu", ...options })) as AsrPipeline;
    } catch {
      // WebGPU present but the model/session failed — fall through to WASM.
    }
  }
  return (await pipeline("automatic-speech-recognition", modelId, { device: "wasm", ...options })) as AsrPipeline;
}

export type DecodedAudio = { pcm: Float32Array; duration: number };

export async function fileToPcm(file: Blob): Promise<DecodedAudio> {
  try {
    return await decodeWithWebAudio(file);
  } catch {
    return decodeWithMediabunny(file);
  }
}

async function decodeWithWebAudio(file: Blob): Promise<DecodedAudio> {
  const AudioContextCtor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const context = new AudioContextCtor();
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer());
    return await resampleTo16k([buffer]);
  } finally {
    void context.close();
  }
}

async function decodeWithMediabunny(file: Blob): Promise<DecodedAudio> {
  const media = await import("mediabunny");
  const input = new media.Input({ source: new media.BlobSource(file), formats: media.ALL_FORMATS });
  const track = await input.getPrimaryAudioTrack();
  if (!track) throw new Error("No audio track found in this file.");
  const sink = new media.AudioBufferSink(track);
  const buffers: AudioBuffer[] = [];
  for await (const wrapped of sink.buffers()) buffers.push(wrapped.buffer);
  if (!buffers.length) throw new Error("Could not decode the audio track in this file.");
  return resampleTo16k(buffers);
}

/** Downmix to mono and resample to 16 kHz — the only input Whisper accepts. */
async function resampleTo16k(buffers: AudioBuffer[]): Promise<DecodedAudio> {
  const duration = buffers.reduce((sum, buffer) => sum + buffer.duration, 0);
  const length = Math.max(1, Math.ceil(duration * SAMPLE_RATE));
  const offline = new OfflineAudioContext(1, length, SAMPLE_RATE);
  let offset = 0;
  for (const buffer of buffers) {
    const source = offline.createBufferSource();
    source.buffer = buffer;
    source.connect(offline.destination);
    source.start(offset);
    offset += buffer.duration;
  }
  const rendered = await offline.startRendering();
  return { pcm: rendered.getChannelData(0), duration };
}

export type TranscribeHooks = {
  /** Fires after each 30-second window with everything transcribed so far. */
  onSegment?: (segments: TranscriptSegment[]) => void;
  onProgress?: (percent: number) => void;
  isCancelled?: () => boolean;
};

/**
 * Transcribe in fixed 30-second windows so progress and partial text surface
 * continuously instead of one long silent wait. Window timestamps are
 * relative, so each result is shifted by the window offset.
 */
export async function transcribePcm(
  pipe: AsrPipeline,
  audio: DecodedAudio,
  hooks: TranscribeHooks = {},
  language = "en",
): Promise<TranscriptSegment[]> {
  const segments: TranscriptSegment[] = [];
  const windows = Math.max(1, Math.ceil(audio.duration / WINDOW_SECONDS));
  for (let w = 0; w < windows; w++) {
    if (hooks.isCancelled?.()) break;
    const offset = w * WINDOW_SECONDS;
    const windowDuration = Math.min(WINDOW_SECONDS, audio.duration - offset);
    const slice = audio.pcm.subarray(w * WINDOW_SECONDS * SAMPLE_RATE, (w + 1) * WINDOW_SECONDS * SAMPLE_RATE);
    const result = await pipe(slice, { return_timestamps: true, language });
    let appended = false;
    for (const chunk of result?.chunks ?? []) {
      const text = String(chunk.text ?? "").trim();
      if (!text) continue;
      const [chunkStart, chunkEnd] = chunk.timestamp ?? [0, null];
      segments.push({
        start: Math.min(offset + (chunkStart ?? 0), audio.duration),
        end: Math.min(offset + (chunkEnd ?? windowDuration), audio.duration),
        text,
      });
      appended = true;
    }
    if (!appended && result?.text?.trim()) {
      segments.push({ start: offset, end: Math.min(offset + windowDuration, audio.duration), text: result.text.trim() });
    }
    hooks.onSegment?.([...segments]);
    hooks.onProgress?.(Math.round(((w + 1) / windows) * 100));
  }
  return segments;
}
