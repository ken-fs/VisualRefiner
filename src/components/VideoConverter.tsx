"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type OutputFormat = "mp4" | "webm";

export function VideoConverter({ defaultFormat = "mp4" }: { defaultFormat?: OutputFormat }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>(defaultFormat);
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

  async function convert() {
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
        format: format === "mp4" ? new media.Mp4OutputFormat() : new media.WebMOutputFormat(),
        target,
      });
      const conversion = await media.Conversion.init({ input, output });

      if (!conversion.isValid) {
        throw new Error("This browser cannot convert the tracks in this file.");
      }

      conversion.onProgress = (value) => setProgress(Math.round(value * 100));
      await conversion.execute();

      if (!target.buffer) throw new Error("The converter produced no output.");
      const blob = new Blob([target.buffer], { type: format === "mp4" ? "video/mp4" : "video/webm" });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setProgress(100);
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Video conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="media-workspace video-workspace" aria-label="Video converter">
      <div className="bench-topline">
        <span>Local video bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field video-drop ${file ? "has-file" : ""}`}>
          <input ref={inputRef} type="file" accept="video/*,.mkv" onChange={(event) => selectFile(event.target.files?.[0])} />
          <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
            <span className="inspection-lens" aria-hidden="true"><Icon icon="ph:film-strip" width="34" /></span>
            <strong>{file ? file.name : "Choose a video"}</strong>
            <span>{file ? "Click to replace it" : "MP4, MOV, WebM, or MKV"}</span>
          </button>
        </div>
        <div className="control-panel">
          <div className="control-heading"><span>Output</span><span>WebCodecs</span></div>
          <label className="field-label">
            Format
            <Select
              ariaLabel="Output format"
              value={format}
              onChange={(value) => setFormat(value as OutputFormat)}
              options={[
                { value: "mp4", label: "MP4" },
                { value: "webm", label: "WebM" },
              ]}
            />
          </label>
          <button className="primary-action" type="button" disabled={busy} onClick={() => void convert()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:arrows-clockwise"} className={busy ? "spin" : ""} width="20" />
            {busy ? `Converting ${progress}%` : "Convert video"}
          </button>
          {busy && <progress className="task-progress" max="100" value={progress}>{progress}%</progress>}
          <p className="local-message"><Icon icon="ph:cpu" width="18" />Speed depends on your device.</p>
        </div>
      </div>
      {error && <p className="error-message" role="alert"><Icon icon="ph:warning" width="20" />{error}</p>}
      {result && file && (
        <div className="result-strip" aria-live="polite">
          <div><span>Video ready</span><strong>{formatBytes(result.size)}</strong><small>Processed in this tab</small></div>
          <a className="download-action" href={result.url} download={outputName(file.name, "converted", format)}>
            <Icon icon="ph:download-simple" width="20" />Download
          </a>
        </div>
      )}
    </section>
  );
}
