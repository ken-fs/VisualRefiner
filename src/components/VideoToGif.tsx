"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

export function VideoToGif() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(480);
  const [fps, setFps] = useState(8);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  async function createGif() {
    if (!file) {
      inputRef.current?.click();
      return;
    }

    setBusy(true);
    setError("");
    setProgress(0);
    setResult(null);

    try {
      const [{ Input, BlobSource, ALL_FORMATS, CanvasSink }, { GIFEncoder, quantize, applyPalette }] = await Promise.all([
        import("mediabunny"),
        import("gifenc"),
      ]);
      const input = new Input({ source: new BlobSource(file), formats: ALL_FORMATS });
      const track = await input.getPrimaryVideoTrack();
      if (!track || !(await track.canDecode())) throw new Error("This browser cannot decode the video track.");

      const duration = Math.min(await track.computeDuration(), 6);
      const sourceWidth = await track.getDisplayWidth();
      const sourceHeight = await track.getDisplayHeight();
      const targetWidth = Math.min(width, sourceWidth);
      const targetHeight = Math.max(1, Math.round(targetWidth * sourceHeight / sourceWidth));
      const frameCount = Math.max(2, Math.floor(duration * fps));
      const timestamps = Array.from({ length: frameCount }, (_, index) => index / fps);
      const sink = new CanvasSink(track, { width: targetWidth, height: targetHeight, fit: "contain" });
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("Canvas is unavailable.");

      const gif = GIFEncoder();
      let index = 0;
      for await (const wrapped of sink.canvasesAtTimestamps(timestamps)) {
        if (!wrapped) continue;
        context.clearRect(0, 0, targetWidth, targetHeight);
        context.drawImage(wrapped.canvas, 0, 0, targetWidth, targetHeight);
        const pixels = context.getImageData(0, 0, targetWidth, targetHeight).data;
        const palette = quantize(pixels, 256);
        const indexed = applyPalette(pixels, palette);
        gif.writeFrame(indexed, targetWidth, targetHeight, { palette, delay: Math.round(1000 / fps), repeat: 0 });
        index += 1;
        setProgress(Math.round(index / frameCount * 100));
      }

      if (index === 0) throw new Error("No GIF frames could be decoded.");
      gif.finish();
      const bytes = gif.bytes();
      const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
      const blob = new Blob([buffer], { type: "image/gif" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "GIF creation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="media-workspace gif-workspace" aria-label="Video to GIF converter">
      <div className="bench-topline"><span>Short-loop bench</span><span>First 6 seconds</span></div>
      <div className="gif-controls">
        <input ref={inputRef} type="file" accept="video/*,.mkv" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setResult(null); }} />
        <button className="file-select-button" type="button" onClick={() => inputRef.current?.click()}>
          <Icon icon="ph:film-reel" width="20" />{file ? file.name : "Choose a short video"}
        </button>
        <label className="field-label">Width
          <Select
            ariaLabel="Width"
            value={String(width)}
            onChange={(value) => setWidth(Number(value))}
            options={[
              { value: "320", label: "320 px" },
              { value: "480", label: "480 px" },
              { value: "640", label: "640 px" },
            ]}
          />
        </label>
        <label className="field-label">Speed
          <Select
            ariaLabel="Speed"
            value={String(fps)}
            onChange={(value) => setFps(Number(value))}
            options={[
              { value: "6", label: "6 fps" },
              { value: "8", label: "8 fps" },
              { value: "12", label: "12 fps" },
            ]}
          />
        </label>
        <button className="primary-action" type="button" disabled={busy} onClick={() => void createGif()}>
          <Icon icon={busy ? "ph:circle-notch" : "ph:gif"} className={busy ? "spin" : ""} width="20" />
          {busy ? `Building ${progress}%` : "Create GIF"}
        </button>
      </div>
      {busy && <progress className="task-progress" max="100" value={progress}>{progress}%</progress>}
      {error && <p className="error-message" role="alert"><Icon icon="ph:warning" width="20" />{error}</p>}
      {result && file && (
        <div className="gif-result" aria-live="polite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.url} alt="Generated GIF preview" />
          <div><span>GIF ready</span><strong>{formatBytes(result.size)}</strong></div>
          <a className="download-action" href={result.url} download={outputName(file.name, "loop", "gif")}>
            <Icon icon="ph:download-simple" width="20" />Download GIF
          </a>
        </div>
      )}
    </section>
  );
}
