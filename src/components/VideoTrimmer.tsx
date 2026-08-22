"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type OutputFormat = "mp4" | "webm";

function clampTime(v: number, max: number) {
  if (!Number.isFinite(v) || v < 0) return 0;
  return max > 0 ? Math.min(v, max) : v;
}

export function VideoTrimmer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState("");
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [format, setFormat] = useState<OutputFormat>("mp4");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  useEffect(() => () => {
    if (srcUrl) URL.revokeObjectURL(srcUrl);
  }, [srcUrl]);
  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setProgress(0);
    setResult(null);
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setFile(next);
    setSrcUrl(URL.createObjectURL(next));
    setStart(0);
    setEnd(0);
    setDuration(0);
  }

  async function trim() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    if (end <= start) {
      setError("The end time must be after the start time.");
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
        format: format === "mp4" ? new media.Mp4OutputFormat() : new media.WebMOutputFormat(),
        target,
      });
      const conversion = await media.Conversion.init({
        input,
        output,
        trim: { start, end },
      });
      if (!conversion.isValid) {
        throw new Error("This browser cannot trim the tracks in this file.");
      }
      conversion.onProgress = (value) => setProgress(Math.round(value * 100));
      await conversion.execute();
      if (!target.buffer) throw new Error("The trimmer produced no output.");
      const blob = new Blob([target.buffer], {
        type: format === "mp4" ? "video/mp4" : "video/webm",
      });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Trimming failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="media-workspace video-workspace" aria-label="Video trimmer">
      <div className="bench-topline">
        <span>Local trim bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field video-drop ${file ? "has-file" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept="video/*,.mkv"
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
          {srcUrl ? (
            <video
              ref={videoRef}
              src={srcUrl}
              controls
              style={{ display: "block", width: "100%", height: "auto", borderRadius: "inherit" }}
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                if (Number.isFinite(d)) {
                  setDuration(d);
                  setEnd(d);
                }
              }}
            />
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:scissors" width="34" />
              </span>
              <strong>Choose a video</strong>
              <span>MP4, MOV, WebM, or MKV</span>
            </button>
          )}
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Trim</span>
            <span>{duration > 0 ? `${duration.toFixed(1)}s total` : "WebCodecs"}</span>
          </div>
          <label className="field-label">
            Start (seconds)
            <input
              type="number"
              min={0}
              max={duration || undefined}
              step={0.1}
              value={start}
              onChange={(e) => setStart(clampTime(Number(e.target.value), duration))}
            />
          </label>
          <button
            className="drop-action"
            type="button"
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
            onClick={() => videoRef.current && setStart(clampTime(videoRef.current.currentTime, duration))}
          >
            <Icon icon="ph:flag" width="16" /> Set start to current frame
          </button>
          <label className="field-label">
            End (seconds)
            <input
              type="number"
              min={0}
              max={duration || undefined}
              step={0.1}
              value={end}
              onChange={(e) => setEnd(clampTime(Number(e.target.value), duration))}
            />
          </label>
          <button
            className="drop-action"
            type="button"
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
            onClick={() => videoRef.current && setEnd(clampTime(videoRef.current.currentTime, duration))}
          >
            <Icon icon="ph:flag-checkered" width="16" /> Set end to current frame
          </button>
          <label className="field-label">
            Output format
            <Select
              ariaLabel="Output format"
              value={format}
              onChange={(v) => setFormat(v as OutputFormat)}
              options={[
                { value: "mp4", label: "MP4" },
                { value: "webm", label: "WebM" },
              ]}
            />
          </label>
          <button className="primary-action" type="button" disabled={busy} onClick={() => void trim()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:scissors"} className={busy ? "spin" : ""} width="20" />
            {busy ? `Trimming ${progress}%` : "Trim video"}
          </button>
          {busy && <progress className="task-progress" max="100" value={progress}>{progress}%</progress>}
          <p className="local-message">
            <Icon icon="ph:cpu" width="18" />
            Speed depends on your device.
          </p>
        </div>
      </div>
      {error && (
        <p className="error-message" role="alert">
          <Icon icon="ph:warning" width="20" />
          {error}
        </p>
      )}
      {result && file && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>Clip ready ({Math.max(0, end - start).toFixed(1)}s)</span>
            <strong>{formatBytes(result.size)}</strong>
            <small>Processed in this tab</small>
          </div>
          <a
            className="download-action"
            href={result.url}
            download={outputName(file.name, "trimmed", format)}
          >
            <Icon icon="ph:download-simple" width="20" />
            Download
          </a>
        </div>
      )}
    </section>
  );
}
