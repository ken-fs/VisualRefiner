"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { formatBytes } from "@/lib/tools";

type SvgInfo = {
  name: string;
  bytes: number;
  viewBox: string;
  width: string;
  height: string;
  elements: number;
  paths: number;
  url: string;
};

type Background = "checker" | "light" | "dark";

const BACKGROUNDS: Record<Background, string> = {
  checker:
    "repeating-conic-gradient(#e8e8e8 0% 25%, #ffffff 0% 50%) 50% / 16px 16px",
  light: "#ffffff",
  dark: "#141414",
};

/** Parse the markup and build a blob URL for rendering. Rendered via <img>, so scripts never run. */
function inspectSvg(text: string, name: string, bytes: number): SvgInfo | { error: string } {
  const doc = new DOMParser().parseFromString(text, "image/svg+xml");
  if (doc.querySelector("parsererror") || doc.documentElement.nodeName.toLowerCase() !== "svg") {
    return { error: "That does not look like an SVG file — check the markup and try again." };
  }
  const root = doc.documentElement;
  return {
    name,
    bytes,
    viewBox: root.getAttribute("viewBox") ?? "not set",
    width: root.getAttribute("width") ?? "not set",
    height: root.getAttribute("height") ?? "not set",
    elements: doc.getElementsByTagName("*").length,
    paths: doc.getElementsByTagName("path").length,
    url: URL.createObjectURL(new Blob([text], { type: "image/svg+xml" })),
  };
}

export function SvgViewerWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const lastUrl = useRef<string | null>(null);
  const [info, setInfo] = useState<SvgInfo | null>(null);
  const [error, setError] = useState("");
  const [markup, setMarkup] = useState("");
  const [background, setBackground] = useState<Background>("checker");
  const [zoom, setZoom] = useState(100);
  const [natural, setNatural] = useState({ w: 0, h: 0 });

  function apply(result: SvgInfo | { error: string }) {
    if ("error" in result) {
      setError(result.error);
      return;
    }
    if (lastUrl.current) URL.revokeObjectURL(lastUrl.current);
    lastUrl.current = result.url;
    setError("");
    setZoom(100);
    setNatural({ w: 0, h: 0 });
    setInfo(result);
  }

  async function selectFile(next: File | undefined) {
    if (!next) return;
    const text = await next.text();
    apply(inspectSvg(text, next.name, next.size));
  }

  function applyMarkup() {
    if (!markup.trim()) return;
    apply(inspectSvg(markup, "Pasted markup", new Blob([markup]).size));
  }

  const renderedWidth = natural.w > 0 ? Math.max(1, Math.round((natural.w * zoom) / 100)) : undefined;

  return (
    <section className="media-workspace" aria-label="SVG viewer">
      <div className="bench-topline">
        <span>Local SVG bench</span>
        <span>{info ? `${formatBytes(info.bytes)} · ${info.elements} elements` : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div
          className={`drop-field ${info ? "has-file" : ""}`}
          style={info ? { background: BACKGROUNDS[background], placeItems: "start", padding: "1rem", overflow: "auto" } : undefined}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".svg,image/svg+xml"
            onChange={(e) => void selectFile(e.target.files?.[0])}
          />
          {info ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={info.url}
              alt={`Preview of ${info.name}`}
              onLoad={(e) => setNatural({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
              style={{
                width: renderedWidth ? `${renderedWidth}px` : "100%",
                maxWidth: renderedWidth ? "none" : "100%",
                height: "auto",
              }}
            />
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:vector-three" width="34" />
              </span>
              <strong>Choose an SVG file</strong>
              <span>Or paste the markup on the right</span>
            </button>
          )}
        </div>

        <div className="control-panel">
          <div className="control-heading">
            <span>Viewer controls</span>
            <span>Never uploaded</span>
          </div>

          <div style={{ display: "grid", gap: "0.4rem" }}>
            <button className="file-select-button" type="button" onClick={() => inputRef.current?.click()}>
              <Icon icon="ph:folder-open" width="16" aria-hidden="true" /> {info ? "Replace file" : "Open SVG file"}
            </button>
            <div style={{ display: "flex", gap: "0.4rem" }}>
              {(Object.keys(BACKGROUNDS) as Background[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className="file-select-button"
                  style={background === key ? { outline: "2px solid var(--ink, #111)" } : undefined}
                  onClick={() => setBackground(key)}
                >
                  {key === "checker" ? "Checker" : key === "light" ? "Light" : "Dark"}
                </button>
              ))}
            </div>
          </div>

          <label className="field-label" htmlFor="zoom-range">
            Zoom — {zoom}%
          </label>
          <input
            id="zoom-range"
            type="range"
            min={25}
            max={400}
            step={5}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ width: "100%" }}
          />

          {error ? <p className="error-message">{error}</p> : null}

          {info ? (
            <ul className="meta-readout" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.45rem" }}>
              <li><strong>File</strong> — {info.name} ({formatBytes(info.bytes)})</li>
              <li><strong>viewBox</strong> — {info.viewBox}</li>
              <li><strong>width / height</strong> — {info.width} / {info.height}</li>
              <li><strong>Structure</strong> — {info.elements} elements · {info.paths} paths</li>
            </ul>
          ) : (
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem", fontWeight: 650 }}>
              Load an SVG to inspect its viewBox, dimensions, and structure.
            </p>
          )}

          <label className="field-label" htmlFor="svg-markup">
            Or paste SVG markup
          </label>
          <textarea
            id="svg-markup"
            value={markup}
            onChange={(e) => setMarkup(e.target.value)}
            placeholder={'<svg viewBox="0 0 24 24">…</svg>'}
            rows={5}
            spellCheck={false}
            style={{ width: "100%", fontFamily: "ui-monospace, monospace", fontSize: "0.8rem" }}
          />
          <button className="file-select-button" type="button" onClick={applyMarkup}>
            <Icon icon="ph:code" width="16" aria-hidden="true" /> Render pasted markup
          </button>
        </div>
      </div>
    </section>
  );
}
