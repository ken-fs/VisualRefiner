"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type CropFormat = "image/jpeg" | "image/png" | "image/webp";

const formatLabels: Record<CropFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};
const extensions: Record<CropFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Selection is stored normalised (0..1) against the image, so it survives any
// display scaling — mapping back to source pixels at crop time is exact.
type Rect = { x: number; y: number; w: number; h: number };
const DEFAULT_RECT: Rect = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };

const ratios: { value: string; label: string; ratio: number | null }[] = [
  { value: "free", label: "Free", ratio: null },
  { value: "1:1", label: "Square 1:1", ratio: 1 },
  { value: "16:9", label: "16:9", ratio: 16 / 9 },
  { value: "4:3", label: "4:3", ratio: 4 / 3 },
  { value: "3:2", label: "3:2", ratio: 3 / 2 },
];

export function CropWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [natural, setNatural] = useState({ w: 0, h: 0 });
  const [rect, setRect] = useState<Rect>(DEFAULT_RECT);
  const [ratioKey, setRatioKey] = useState("free");
  const [format, setFormat] = useState<CropFormat>("image/png");
  const [quality, setQuality] = useState(90);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; size: number; w: number; h: number } | null>(null);
  const dragging = useRef(false);
  const origin = useRef({ x: 0, y: 0 });

  useEffect(() => () => {
    if (inputUrl) URL.revokeObjectURL(inputUrl);
  }, [inputUrl]);
  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setResult(null);
    if (inputUrl) URL.revokeObjectURL(inputUrl);
    setFile(next);
    setRect(DEFAULT_RECT);
    setInputUrl(URL.createObjectURL(next));
  }

  const activeRatio = ratios.find((r) => r.value === ratioKey)?.ratio ?? null;

  // Point in normalised image coords, clamped to [0,1].
  function pointFromEvent(e: React.PointerEvent) {
    const el = imgRef.current;
    if (!el) return { x: 0, y: 0 };
    const box = el.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height)),
    };
  }

  function applyRatio(r: Rect): Rect {
    if (!activeRatio || natural.w === 0) return r;
    // Keep width, derive height so the on-screen box matches the pixel ratio.
    const pxRatio = (r.w * natural.w) / (r.h * natural.h);
    if (!Number.isFinite(pxRatio) || pxRatio === activeRatio) return r;
    const targetH = (r.w * natural.w) / activeRatio / natural.h;
    const h = Math.min(targetH, 1 - r.y);
    return { ...r, h };
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!inputUrl) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragging.current = true;
    const p = pointFromEvent(e);
    origin.current = p;
    setRect({ x: p.x, y: p.y, w: 0, h: 0 });
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const p = pointFromEvent(e);
    const o = origin.current;
    const next: Rect = {
      x: Math.min(o.x, p.x),
      y: Math.min(o.y, p.y),
      w: Math.abs(p.x - o.x),
      h: Math.abs(p.y - o.y),
    };
    setRect(applyRatio(next));
  }
  function onPointerUp() {
    dragging.current = false;
    // A stray click with no real drag falls back to a sensible default box.
    setRect((r) => (r.w < 0.02 || r.h < 0.02 ? applyRatio(DEFAULT_RECT) : r));
  }

  async function crop() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    setBusy(true);
    setError("");
    try {
      const bitmap = await createImageBitmap(file);
      const sx = Math.round(rect.x * bitmap.width);
      const sy = Math.round(rect.y * bitmap.height);
      const sw = Math.max(1, Math.round(rect.w * bitmap.width));
      const sh = Math.max(1, Math.round(rect.h * bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable in this browser.");
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sw, sh);
      }
      ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, sw, sh);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, quality / 100),
      );
      if (!blob) throw new Error("The crop could not be encoded.");
      setResult({ url: URL.createObjectURL(blob), size: blob.size, w: sw, h: sh });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Cropping failed.");
    } finally {
      setBusy(false);
    }
  }

  const lossy = format !== "image/png";

  return (
    <section className="media-workspace" aria-label="Image cropper">
      <div className="bench-topline">
        <span>Local crop bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field ${file ? "has-file" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => selectFile(e.target.files?.[0])}
          />
          {inputUrl ? (
            <div
              className="crop-stage"
              style={{ position: "relative", touchAction: "none", userSelect: "none", cursor: "crosshair" }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={inputUrl}
                alt="Crop preview"
                draggable={false}
                style={{ display: "block", width: "100%", height: "auto" }}
                onLoad={(e) => {
                  const el = e.currentTarget;
                  setNatural({ w: el.naturalWidth, h: el.naturalHeight });
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: `${rect.x * 100}%`,
                  top: `${rect.y * 100}%`,
                  width: `${rect.w * 100}%`,
                  height: `${rect.h * 100}%`,
                  border: "2px solid var(--calibration, #e8631a)",
                  boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
                  pointerEvents: "none",
                }}
              />
            </div>
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:crop" width="34" />
              </span>
              <strong>Choose an image</strong>
              <span>JPG, PNG, or WebP — then drag to select</span>
            </button>
          )}
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Crop</span>
            <span>Canvas</span>
          </div>
          <label className="field-label">
            Aspect ratio
            <Select
              ariaLabel="Aspect ratio"
              value={ratioKey}
              onChange={(v) => {
                setRatioKey(v);
                setRect((r) => {
                  const next = { ...r };
                  const ratio = ratios.find((x) => x.value === v)?.ratio ?? null;
                  if (!ratio || natural.w === 0) return next;
                  const targetH = (next.w * natural.w) / ratio / natural.h;
                  return { ...next, h: Math.min(targetH, 1 - next.y) };
                });
              }}
              options={ratios.map((r) => ({ value: r.value, label: r.label }))}
            />
          </label>
          <label className="field-label">
            Output format
            <Select
              ariaLabel="Output format"
              value={format}
              onChange={(v) => setFormat(v as CropFormat)}
              options={(Object.keys(formatLabels) as CropFormat[]).map((f) => ({
                value: f,
                label: formatLabels[f],
              }))}
            />
          </label>
          {lossy && (
            <label className="field-label">
              Quality {quality}%
              <input
                type="range"
                min={40}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
            </label>
          )}
          <button className="primary-action" type="button" disabled={busy} onClick={() => void crop()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:crop"} className={busy ? "spin" : ""} width="20" />
            {file ? "Crop image" : "Choose an image"}
          </button>
          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" />
            The image never leaves your device.
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
            <span>Cropped {result.w}×{result.h}</span>
            <strong>{formatBytes(result.size)}</strong>
            <small>Processed in this tab</small>
          </div>
          <a
            className="download-action"
            href={result.url}
            download={outputName(file.name, "cropped", extensions[format])}
          >
            <Icon icon="ph:download-simple" width="20" />
            Download
          </a>
        </div>
      )}
    </section>
  );
}
