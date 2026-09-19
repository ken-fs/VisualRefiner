"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type SvgFormat = "image/png" | "image/jpeg" | "image/webp";

const formatLabels: Record<SvgFormat, string> = {
  "image/png": "PNG",
  "image/jpeg": "JPG",
  "image/webp": "WebP",
};

const extensions: Record<SvgFormat, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

const SCALES = [1, 2, 4] as const;

/** SVG 光栅化的固有尺寸：优先 width/height，其次 viewBox，最后兜底 1024。 */
function intrinsicSize(img: HTMLImageElement, markup: string): { w: number; h: number } {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  // Chrome 对无 width/height 的 SVG 会给 300×150 默认值——此时回退解析 viewBox
  if (w > 0 && h > 0 && !(w === 300 && h === 150)) return { w, h };
  const box = markup.match(/viewBox\s*=\s*["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)/i);
  if (box) return { w: Number(box[1]) || 1024, h: Number(box[2]) || 1024 };
  return { w: 1024, h: 1024 };
}

export function SvgConvertWorkspace({ defaultFormat = "image/png" }: { defaultFormat?: SvgFormat }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [format, setFormat] = useState<SvgFormat>(defaultFormat);
  const [scale, setScale] = useState<(typeof SCALES)[number]>(2);
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; blob: Blob; w: number; h: number } | null>(null);

  function chooseFile(next: File | undefined) {
    if (!next) return;
    if (!/\.svg$/i.test(next.name) && next.type !== "image/svg+xml") {
      setError("That is not an SVG file — pick a .svg export.");
      return;
    }
    setError("");
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    if (inputUrl) URL.revokeObjectURL(inputUrl);
    setFile(next);
    setInputUrl(URL.createObjectURL(next));
  }

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const markup = await file.text();
      const img = new Image();
      img.src = inputUrl;
      await img.decode();

      const { w, h } = intrinsicSize(img, markup);
      const outW = Math.max(1, Math.round(w * scale));
      const outH = Math.max(1, Math.round(h * scale));

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d", { alpha: format !== "image/jpeg" });
      if (!ctx) throw new Error("Canvas unavailable.");
      if (format === "image/jpeg") {
        // JPG 没有透明通道——透明区域填白，避免渲染成黑块
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, outW, outH);
      }
      ctx.drawImage(img, 0, 0, outW, outH);

      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (out) => (out ? resolve(out) : reject(new Error("Canvas export failed."))),
          format,
          quality / 100,
        ),
      );

      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ url: URL.createObjectURL(blob), blob, w: outW, h: outH });
    } catch (reason) {
      console.error(reason);
      setError("Could not rasterize this SVG. Complex filters or external references may not survive canvas rendering.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="media-workspace image-workspace" aria-label="SVG converter">
      <div className="bench-topline">
        <span>Local SVG bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>

      <div className="workspace-grid">
        <div
          className={`drop-field ${dragging ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
          onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            chooseFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={(event) => chooseFile(event.target.files?.[0])}
          />
          <div className="registration-mark registration-mark-a" aria-hidden="true" />
          <div className="registration-mark registration-mark-b" aria-hidden="true" />

          {inputUrl && file ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="file-preview" src={inputUrl} alt="Selected SVG preview" />
              <div className="file-caption">
                <strong>{file.name}</strong>
                <span>vector source</span>
              </div>
            </>
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:vector-three" width="34" />
              </span>
              <strong>Drop an SVG here</strong>
              <span>or choose a file</span>
            </button>
          )}
        </div>

        <div className="control-panel">
          <div className="control-heading">
            <span>Output</span>
            {file && <button type="button" className="text-button" onClick={() => inputRef.current?.click()}>Replace file</button>}
          </div>

          <label className="field-label">
            Format
            <Select
              ariaLabel="Output format"
              value={format}
              onChange={(value) => setFormat(value as SvgFormat)}
              options={Object.entries(formatLabels).map(([value, label]) => ({ value, label }))}
            />
          </label>

          <label className="field-label">
            Render size
            <span className="dimension-fields" style={{ marginTop: "0.35rem" }}>
              {SCALES.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="file-select-button"
                  style={scale === option ? { outline: "2px solid var(--ink, #111)" } : undefined}
                  onClick={() => setScale(option)}
                >
                  {option}×
                </button>
              ))}
            </span>
          </label>

          {format !== "image/png" && (
            <label className="field-label range-label">
              <span>Quality <output>{quality}%</output></span>
              <input type="range" min="35" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            </label>
          )}

          <button className="primary-action" type="button" disabled={busy || !file} onClick={() => void convert()}>
            {busy ? <Icon icon="ph:circle-notch" className="spin" width="20" /> : <Icon icon="ph:magic-wand" width="20" />}
            {busy ? "Rasterizing locally…" : "Convert SVG"}
          </button>

          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" aria-hidden="true" />
            Nothing is uploaded.
          </p>
        </div>
      </div>

      {error && <p className="error-message" role="alert"><Icon icon="ph:warning" width="20" />{error}</p>}

      {result && file && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>Result ready</span>
            <strong>{formatBytes(result.blob.size)}</strong>
            <small>{result.w} × {result.h} {formatLabels[format]}</small>
          </div>
          <a
            className="download-action"
            href={result.url}
            download={outputName(file.name, `${result.w}x${result.h}`, extensions[format])}
          >
            <Icon icon="ph:download-simple" width="20" aria-hidden="true" />
            Download
          </a>
        </div>
      )}
    </section>
  );
}
