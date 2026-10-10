"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { DEFAULT_DXF_SETTINGS, DxfSettings, downloadText, dxfOptions, type DxfSettingsValue } from "@/components/DxfSettings";
import { svgToDxf, type DxfResult } from "@/lib/svg-geometry";
import { formatBytes, outputName } from "@/lib/tools";

const CHECKER = "repeating-conic-gradient(#e8e8e8 0% 25%, #ffffff 0% 50%) 50% / 16px 16px";

export function SvgToDxfWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [markup, setMarkup] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [settings, setSettings] = useState<DxfSettingsValue>(DEFAULT_DXF_SETTINGS);
  const [result, setResult] = useState<DxfResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  // Converting is synchronous and quick, so it re-runs on every file or setting change.
  function convert(nextMarkup: string, nextSettings: DxfSettingsValue) {
    try {
      setResult(svgToDxf(nextMarkup, dxfOptions(nextSettings)));
      setError("");
    } catch (reason) {
      console.error(reason);
      setResult(null);
      setError(reason instanceof Error ? reason.message : "Could not convert this SVG.");
    }
  }

  function changeSettings(next: DxfSettingsValue) {
    setSettings(next);
    if (markup) convert(markup, next);
  }

  async function chooseFile(next: File | undefined) {
    if (!next) return;
    if (!/\.svg$/i.test(next.name) && next.type !== "image/svg+xml") {
      setError("That is not an SVG file. For PNG or JPG, use the PNG to DXF tool.");
      return;
    }
    const text = await next.text();
    setFile(next);
    setMarkup(text);
    convert(text, settings);
    setPreviewUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(next);
    });
  }

  const unit = settings.unit === "mm" ? "mm" : "in";

  return (
    <section className="media-workspace image-workspace" aria-label="SVG to DXF converter">
      <div className="bench-topline">
        <span>Local CAD bench</span>
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
          <input ref={inputRef} type="file" accept=".svg,image/svg+xml" onChange={(event) => void chooseFile(event.target.files?.[0])} />
          <div className="registration-mark registration-mark-a" aria-hidden="true" />
          <div className="registration-mark registration-mark-b" aria-hidden="true" />

          {file && previewUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="file-preview" src={previewUrl} alt="Selected SVG preview" style={{ background: CHECKER }} />
              <div className="file-caption">
                <strong>{file.name}</strong>
                <span>vector source</span>
              </div>
            </>
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:ruler" width="34" />
              </span>
              <strong>Drop an SVG here</strong>
              <span>or choose a file</span>
            </button>
          )}
        </div>

        <div className="control-panel">
          <div className="control-heading">
            <span>DXF output</span>
            {file && <button type="button" className="text-button" onClick={() => inputRef.current?.click()}>Replace file</button>}
          </div>

          <DxfSettings value={settings} onChange={changeSettings} />

          <button className="primary-action" type="button" onClick={() => inputRef.current?.click()}>
            <Icon icon="ph:file-svg" width="20" />
            {file ? "Convert another SVG" : "Choose an SVG"}
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
            <span>DXF ready</span>
            <strong>{result.width.toFixed(unit === "in" ? 2 : 1)} × {result.height.toFixed(unit === "in" ? 2 : 1)} {unit}</strong>
            <small>
              {result.entities} shapes · {result.layers} {result.layers === 1 ? "layer" : "layers"} · {formatBytes(result.dxf.length)}
              {result.skipped > 0 && ` · ${result.skipped} element${result.skipped === 1 ? "" : "s"} skipped`}
            </small>
          </div>
          <div className="trace-actions">
            <button
              className="download-action"
              type="button"
              onClick={() => downloadText(result.dxf, outputName(file.name, `${Math.round(result.width)}${unit}`, "dxf"), "application/dxf")}
            >
              <Icon icon="ph:download-simple" width="20" aria-hidden="true" />
              Download DXF
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
