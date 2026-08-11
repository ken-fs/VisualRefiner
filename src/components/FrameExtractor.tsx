"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { outputName } from "@/lib/tools";

type Frame = { url: string; timestamp: number };

export function FrameExtractor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [count, setCount] = useState(8);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => frames.forEach((frame) => URL.revokeObjectURL(frame.url)), [frames]);

  async function extract() {
    if (!file) {
      inputRef.current?.click();
      return;
    }

    setBusy(true);
    setError("");
    setFrames([]);

    try {
      const { Input, BlobSource, ALL_FORMATS, CanvasSink } = await import("mediabunny");
      const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
      const track = await input.getPrimaryVideoTrack();
      if (!track || !(await track.canDecode())) throw new Error("This browser cannot decode the video track.");

      const duration = await track.computeDuration();
      const sourceWidth = await track.getDisplayWidth();
      const sourceHeight = await track.getDisplayHeight();
      const width = Math.min(640, sourceWidth);
      const height = Math.max(1, Math.round(width * sourceHeight / sourceWidth));
      const timestamps = Array.from({ length: count }, (_, index) => duration * index / count);
      const sink = new CanvasSink(track, { width, height, fit: "contain" });
      const nextFrames: Frame[] = [];

      for await (const wrapped of sink.canvasesAtTimestamps(timestamps)) {
        if (!wrapped) continue;
        const blob = await canvasToBlob(wrapped.canvas);
        nextFrames.push({ url: URL.createObjectURL(blob), timestamp: wrapped.timestamp });
      }

      if (nextFrames.length === 0) throw new Error("No frames could be decoded.");
      setFrames(nextFrames);
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Frame extraction failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="media-workspace frame-workspace" aria-label="Video frame extractor">
      <div className="bench-topline"><span>Frame contact sheet</span><span>{frames.length ? `${frames.length} frames ready` : "Waiting for video"}</span></div>
      <div className="frame-controls">
        <input ref={inputRef} type="file" accept="video/*,.mkv" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setFrames([]); }} />
        <button className="file-select-button" type="button" onClick={() => inputRef.current?.click()}>
          <Icon icon="ph:film-strip" width="20" />{file ? file.name : "Choose a video"}
        </button>
        <label className="field-label frame-count">
          Frames
          <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
            <option value="4">4</option><option value="8">8</option><option value="12">12</option>
          </select>
        </label>
        <button className="primary-action" type="button" disabled={busy} onClick={() => void extract()}>
          <Icon icon={busy ? "ph:circle-notch" : "ph:selection-background"} className={busy ? "spin" : ""} width="20" />
          {busy ? "Reading frames…" : "Extract frames"}
        </button>
      </div>
      {error && <p className="error-message" role="alert"><Icon icon="ph:warning" width="20" />{error}</p>}
      {frames.length > 0 && file && (
        <div className="contact-sheet" aria-live="polite">
          {frames.map((frame, index) => (
            <figure key={frame.url}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.url} alt={`Video frame at ${frame.timestamp.toFixed(2)} seconds`} />
              <figcaption>
                <span>{frame.timestamp.toFixed(2)}s</span>
                <a href={frame.url} download={outputName(file.name, `frame-${index + 1}`, "png")} aria-label={`Download frame ${index + 1}`}>
                  <Icon icon="ph:download-simple" width="18" />
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

async function canvasToBlob(canvas: HTMLCanvasElement | OffscreenCanvas) {
  if (canvas instanceof OffscreenCanvas) return canvas.convertToBlob({ type: "image/png" });
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Frame export failed.")), "image/png");
  });
}
