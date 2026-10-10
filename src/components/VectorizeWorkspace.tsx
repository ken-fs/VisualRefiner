"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { DEFAULT_DXF_SETTINGS, DxfSettings, downloadText, dxfOptions, type DxfSettingsValue } from "@/components/DxfSettings";
import { Select } from "@/components/Select";
import { svgToDxf, type DxfResult } from "@/lib/svg-geometry";
import { formatBytes, outputName } from "@/lib/tools";
import {
  STYLE_DEFAULTS,
  STYLE_LABELS,
  finalizeSvg,
  preparePixels,
  svgStats,
  traceImage,
  traceSize,
  vtracerConfig,
  type CurveMode,
  type Layering,
  type TraceSettings,
  type TraceStyle,
} from "@/lib/vectorize";

type Source = { bitmap: ImageBitmap; width: number; height: number };
type Result = { svg: string; url: string; size: number; paths: number; colors: number; ms: number };

function buildDxf(svg: string, settings: DxfSettingsValue): DxfResult | null {
  try {
    return svgToDxf(svg, dxfOptions(settings));
  } catch (reason) {
    console.error(reason);
    return null;
  }
}

const CHECKER = "repeating-conic-gradient(#e8e8e8 0% 25%, #ffffff 0% 50%) 50% / 16px 16px";

const CURVE_LABELS: Record<CurveMode, string> = {
  spline: "Smooth curves",
  polygon: "Straight lines",
  pixel: "Pixel edges",
};

const LAYERING_LABELS: Record<Layering, string> = {
  stacked: "Stacked (smaller file)",
  cutout: "Cut out (no overlaps)",
};

type VectorizeProps = {
  defaultStyle?: TraceStyle;
  sourceLabel?: string;
  /** "dxf" adds size/accuracy settings and a DXF download for laser and CNC software. */
  output?: "svg" | "dxf";
};

export function VectorizeWorkspace({ defaultStyle = "logo", sourceLabel = "PNG, JPG, or WebP", output = "svg" }: VectorizeProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [source, setSource] = useState<Source | null>(null);
  const [dragging, setDragging] = useState(false);
  const [settings, setSettings] = useState<TraceSettings>(STYLE_DEFAULTS[defaultStyle]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [view, setView] = useState<"svg" | "original">("svg");
  const [copied, setCopied] = useState(false);
  const [dxfSettings, setDxfSettings] = useState<DxfSettingsValue>(DEFAULT_DXF_SETTINGS);
  const [dxf, setDxf] = useState<DxfResult | null>(null);

  // The trace effect reads the latest DXF settings through this ref, so changing
  // the output width rewrites the DXF without re-tracing the image.
  const dxfSettingsRef = useRef(dxfSettings);

  function changeDxfSettings(next: DxfSettingsValue) {
    dxfSettingsRef.current = next;
    setDxfSettings(next);
    if (result && output === "dxf") setDxf(buildDxf(result.svg, next));
  }

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  useEffect(() => () => {
    if (result?.url) URL.revokeObjectURL(result.url);
  }, [result]);

  useEffect(() => () => source?.bitmap.close(), [source]);

  // Re-trace whenever the image or a setting changes; the debounce keeps a
  // dragged slider from queueing a trace per pixel of travel.
  useEffect(() => {
    if (!source) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      setBusy(true);
      setError("");
      try {
        const traced = traceSize(source.width, source.height);
        const canvas = document.createElement("canvas");
        canvas.width = traced.width;
        canvas.height = traced.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error("Canvas unavailable.");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(source.bitmap, 0, 0, traced.width, traced.height);
        const rgba = ctx.getImageData(0, 0, traced.width, traced.height).data;

        const started = performance.now();
        const raw = await traceImage(preparePixels(rgba, settings), traced.width, traced.height, vtracerConfig(settings));
        if (cancelled) return;
        const svg = finalizeSvg(raw, traced, source);
        const blob = new Blob([svg], { type: "image/svg+xml" });
        setResult({ svg, url: URL.createObjectURL(blob), size: blob.size, ...svgStats(svg), ms: performance.now() - started });
        if (output === "dxf") setDxf(buildDxf(svg, dxfSettingsRef.current));
        setView("svg");
      } catch (reason) {
        if (cancelled || (reason instanceof DOMException && reason.name === "AbortError")) return;
        console.error(reason);
        setError("Could not trace this image. Try a smaller file or the black & white style.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [source, settings, output]);

  async function chooseFile(next: File | undefined) {
    if (!next) return;
    if (!next.type.startsWith("image/") || next.type === "image/svg+xml") {
      setError("Pick a PNG, JPG, or WebP image — this tool turns pixels into vector paths.");
      return;
    }
    setError("");
    setResult(null);
    setFile(next);
    setImageUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(next);
    });
    try {
      const bitmap = await createImageBitmap(next, { imageOrientation: "from-image" });
      setSource({ bitmap, width: bitmap.width, height: bitmap.height });
    } catch {
      setSource(null);
      setError("This browser could not decode that image.");
    }
  }

  function update(patch: Partial<TraceSettings>) {
    setSettings((current) => ({ ...current, ...patch }));
  }

  function chooseStyle(style: TraceStyle) {
    // Keep the curve and layering choices; reset the numbers to the style's tuning.
    setSettings((current) => ({ ...STYLE_DEFAULTS[style], curve: current.curve, layering: current.layering, dropWhite: current.dropWhite }));
  }

  async function copySvg() {
    if (!result) return;
    await navigator.clipboard.writeText(result.svg);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  const binary = settings.style === "bw";
  const showSvg = result && view === "svg";

  return (
    <section className="media-workspace image-workspace" aria-label="Image to SVG converter">
      <div className="bench-topline">
        <span>Local tracing bench</span>
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
            void chooseFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
            onChange={(event) => void chooseFile(event.target.files?.[0])}
          />
          <div className="registration-mark registration-mark-a" aria-hidden="true" />
          <div className="registration-mark registration-mark-b" aria-hidden="true" />

          {file && imageUrl ? (
            <>
              {result && (
                <div className="trace-view-toggle" role="group" aria-label="Preview">
                  <button type="button" aria-pressed={view === "svg"} onClick={() => setView("svg")}>SVG</button>
                  <button type="button" aria-pressed={view === "original"} onClick={() => setView("original")}>Original</button>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="file-preview"
                src={showSvg ? result.url : imageUrl}
                alt={showSvg ? "Traced SVG preview" : "Selected image preview"}
                style={{ background: CHECKER }}
              />
              <div className="file-caption">
                <strong>{file.name}</strong>
                <span>{busy ? "tracing…" : showSvg ? "vector preview" : "pixel source"}</span>
              </div>
            </>
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:bezier-curve" width="34" />
              </span>
              <strong>Drop an image here</strong>
              <span>{sourceLabel}</span>
            </button>
          )}
        </div>

        <div className="control-panel">
          <div className="control-heading">
            <span>Tracing</span>
            {file && <button type="button" className="text-button" onClick={() => inputRef.current?.click()}>Replace file</button>}
          </div>

          <label className="field-label">
            Style
            <Select
              ariaLabel="Tracing style"
              value={settings.style}
              onChange={(value) => chooseStyle(value as TraceStyle)}
              options={Object.entries(STYLE_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </label>

          {binary ? (
            <>
              <label className="field-label range-label">
                <span>Threshold <output>{settings.threshold}</output></span>
                <input type="range" min="20" max="235" value={settings.threshold} onChange={(event) => update({ threshold: Number(event.target.value) })} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                <input type="checkbox" checked={settings.invert} onChange={(event) => update({ invert: event.target.checked })} />
                Invert (trace the light parts)
              </label>
            </>
          ) : (
            <>
              <label className="field-label range-label">
                <span>Color detail <output>{settings.colorBits}/8</output></span>
                <input type="range" min="1" max="8" value={settings.colorBits} onChange={(event) => update({ colorBits: Number(event.target.value) })} />
              </label>
              <label className="field-label">
                Layers
                <Select
                  ariaLabel="Layering"
                  value={settings.layering}
                  onChange={(value) => update({ layering: value as Layering })}
                  options={Object.entries(LAYERING_LABELS).map(([value, label]) => ({ value, label }))}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                <input type="checkbox" checked={settings.dropWhite} onChange={(event) => update({ dropWhite: event.target.checked })} />
                Remove white background
              </label>
            </>
          )}

          <label className="field-label range-label">
            <span>Ignore specks under <output>{settings.speckle}px</output></span>
            <input type="range" min="1" max="16" value={settings.speckle} onChange={(event) => update({ speckle: Number(event.target.value) })} />
          </label>

          <label className="field-label">
            Edges
            <Select
              ariaLabel="Curve fitting"
              value={settings.curve}
              onChange={(value) => update({ curve: value as CurveMode })}
              options={Object.entries(CURVE_LABELS).map(([value, label]) => ({ value, label }))}
            />
          </label>

          {output === "dxf" && <DxfSettings value={dxfSettings} onChange={changeDxfSettings} showLayers={!binary} />}

          <button className="primary-action" type="button" disabled={busy} onClick={() => inputRef.current?.click()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:image"} className={busy ? "spin" : ""} width="20" />
            {busy ? "Tracing locally…" : file ? "Trace another image" : "Choose an image"}
          </button>

          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" aria-hidden="true" />
            Nothing is uploaded.
          </p>
        </div>
      </div>

      {error && <p className="error-message" role="alert"><Icon icon="ph:warning" width="20" />{error}</p>}

      {result && file && output === "dxf" && dxf && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>DXF ready</span>
            <strong>
              {dxf.width.toFixed(dxfSettings.unit === "in" ? 2 : 1)} × {dxf.height.toFixed(dxfSettings.unit === "in" ? 2 : 1)} {dxfSettings.unit}
            </strong>
            <small>
              {dxf.entities} shapes · {dxf.layers} {dxf.layers === 1 ? "layer" : "layers"} · {formatBytes(dxf.dxf.length)}
            </small>
          </div>
          <div className="trace-actions">
            <a className="file-select-button" href={result.url} download={outputName(file.name, "traced", "svg")}>
              <Icon icon="ph:file-svg" width="20" aria-hidden="true" />
              SVG
            </a>
            <button
              className="download-action"
              type="button"
              onClick={() => downloadText(dxf.dxf, outputName(file.name, "traced", "dxf"), "application/dxf")}
            >
              <Icon icon="ph:download-simple" width="20" aria-hidden="true" />
              Download DXF
            </button>
          </div>
        </div>
      )}

      {result && file && output === "svg" && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>SVG ready</span>
            <strong>{formatBytes(result.size)}</strong>
            <small>
              {result.paths} paths · {result.colors} {result.colors === 1 ? "color" : "colors"} · traced in {(result.ms / 1000).toFixed(1)}s
              {/* Logo merges near-identical colors, so a smooth gradient collapses into one fill. */}
              {settings.style === "logo" && result.colors <= 1 && " · Looks flat? Try the Illustration or Photo style."}
            </small>
          </div>
          <div className="trace-actions">
            <button className="file-select-button" type="button" onClick={() => void copySvg()}>
              <Icon icon={copied ? "ph:check" : "ph:code"} width="20" aria-hidden="true" />
              {copied ? "Copied" : "Copy code"}
            </button>
            <a className="download-action" href={result.url} download={outputName(file.name, "traced", "svg")}>
              <Icon icon="ph:download-simple" width="20" aria-hidden="true" />
              Download SVG
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
