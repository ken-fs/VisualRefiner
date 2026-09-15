"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type Resolution = "original" | "1080" | "720" | "480";
type QualityLevel = "high" | "medium" | "low";

const RESOLUTION_LABELS: Record<Resolution, string> = {
  original: "Original size",
  "1080": "1080p",
  "720": "720p",
  "480": "480p",
};

const QUALITY_LABELS: Record<QualityLevel, string> = {
  high: "High (smallest loss)",
  medium: "Medium (balanced)",
  low: "Low (smallest file)",
};

export function VideoCompressor() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState<Resolution>("720");
  const [quality, setQuality] = useState<QualityLevel>("medium");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  function selectFile(next: File | undefined) {
    if (!next) return;
    setFile(next);
    setError("");
    setProgress(0);
    setResult(null);
  }

  async function compress() {
    if (!file) {
      inputRef.current?.click();
      return;
    }

    setBusy(true);
    setError("");
    setProgress(0);

    try {
      const media = await import("mediabunny");
      const input = new media.Input({
        source: new media.BlobSource(file),
        formats: media.ALL_FORMATS,
      });
      const target = new media.BufferTarget();
      const output = new media.Output({
        format: new media.Mp4OutputFormat(),
        target,
      });

      const qualityMap = {
        high: media.QUALITY_HIGH,
        medium: media.QUALITY_MEDIUM,
        low: media.QUALITY_LOW,
      } as const;

      const conversion = await media.Conversion.init({
        input,
        output,
        video: {
          ...(resolution !== "original" ? { height: Number(resolution) } : {}),
          quality: qualityMap[quality],
          forceTranscode: true,
        },
      });

      if (!conversion.isValid) {
        throw new Error("This browser cannot re-encode the tracks in this file.");
      }

      conversion.onProgress = (value) => setProgress(Math.round(value * 100));
      await conversion.execute();

      if (!target.buffer) throw new Error("The compressor produced no output.");
      const blob = new Blob([target.buffer], { type: "video/mp4" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Video compression failed.");
    } finally {
      setBusy(false);
    }
  }

  const savings = result && file ? Math.round((1 - result.size / file.size) * 100) : 0;

  return (
    <section className="media-workspace video-workspace" aria-label="Video compressor">
      <div className="bench-topline">
        <span>Local video bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field video-drop ${file ? "has-file" : ""}`}>
          <input ref={inputRef} type="file" accept="video/*,.mkv" onChange={(event) => selectFile(event.target.files?.[0])} />
          <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
            <span className="inspection-lens" aria-hidden="true"><Icon icon="ph:file-arrow-down" width="34" /></span>
            <strong>{file ? file.name : "Choose a video"}</strong>
            <span>{file ? "Click to replace it" : "MP4, MOV, WebM, or MKV"}</span>
          </button>
        </div>
        <div className="control-panel">
          <div className="control-heading"><span>Compression</span><span>WebCodecs</span></div>
          <label className="field-label">
            Resolution
            <Select
              ariaLabel="Target resolution"
              value={resolution}
              onChange={(value) => setResolution(value as Resolution)}
              options={(Object.keys(RESOLUTION_LABELS) as Resolution[]).map((r) => ({ value: r, label: RESOLUTION_LABELS[r] }))}
            />
          </label>
          <label className="field-label">
            Quality
            <Select
              ariaLabel="Compression quality"
              value={quality}
              onChange={(value) => setQuality(value as QualityLevel)}
              options={(Object.keys(QUALITY_LABELS) as QualityLevel[]).map((q) => ({ value: q, label: QUALITY_LABELS[q] }))}
            />
          </label>
          <button className="primary-action" type="button" disabled={busy} onClick={() => void compress()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:arrows-down-line"} className={busy ? "spin" : ""} width="20" />
            {busy ? `Compressing ${progress}%` : "Compress video"}
          </button>
          {busy && <progress className="task-progress" max="100" value={progress}>{progress}%</progress>}
          <p className="local-message"><Icon icon="ph:cpu" width="18" />Re-encodes in this tab — big files take a while.</p>
        </div>
      </div>
      {error && <p className="error-message" role="alert"><Icon icon="ph:warning" width="20" />{error}</p>}
      {result && file && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>Video ready</span>
            <strong>
              {formatBytes(file.size)} → {formatBytes(result.size)}
              {savings > 0 ? ` · ${savings}% smaller` : ""}
            </strong>
            <small>{savings > 0 ? "Compressed in this tab" : "No savings at these settings — try a lower resolution or quality"}</small>
          </div>
          <a className="download-action" href={result.url} download={outputName(file.name, "compressed", "mp4")}>
            <Icon icon="ph:download-simple" width="20" />Download
          </a>
        </div>
      )}
    </section>
  );
}
