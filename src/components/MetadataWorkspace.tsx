"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";
import { scanImageMetadata, stripMetadataLossless, type ScanReport } from "@/lib/image-metadata";

type MetaFormat = "image/jpeg" | "image/png" | "image/webp";
const formatLabels: Record<MetaFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};
const extensions: Record<MetaFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const containerMime: Record<ScanReport["container"], MetaFormat | null> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  other: null,
};

type Result = { url: string; size: number; lossless: boolean; removed: string[] };

export function MetadataWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scan, setScan] = useState<ScanReport | null>(null);
  const [scanning, setScanning] = useState(false);
  const [format, setFormat] = useState<MetaFormat>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  async function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setResult(null);
    setFile(next);
    setScan(null);
    setScanning(true);
    try {
      const report = await scanImageMetadata(next);
      setScan(report);
      const mime = containerMime[report.container];
      if (mime) setFormat(mime);
    } catch {
      setScan(null);
    } finally {
      setScanning(false);
    }
  }

  /**
   * Lossless strip is possible when the output container matches the input.
   * Exception: any file carrying a non-default orientation tag (EXIF in JPEG,
   * eXIf in PNG, EXIF in WebP) must be re-encoded, because dropping the tag
   * without rotating pixels would flip how the image displays.
   */
  function canStripLosslessly(): boolean {
    if (!scan) return false;
    const inputMime = containerMime[scan.container];
    if (!inputMime || inputMime !== format) return false;
    if (scan.orientation && scan.orientation !== 1) return false;
    return true;
  }

  async function strip() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (canStripLosslessly()) {
        const buffer = await file.arrayBuffer();
        const { data, removed } = stripMetadataLossless(buffer);
        const blob = new Blob([data.buffer as ArrayBuffer], { type: format });
        setResult({
          url: URL.createObjectURL(blob),
          size: blob.size,
          lossless: true,
          removed,
        });
        return;
      }
      // Fallback: rebuild from pixels (also bakes the displayed orientation).
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable in this browser.");
      if (format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, format, 0.95),
      );
      if (!blob) throw new Error("The clean image could not be encoded.");
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        lossless: false,
        removed: ["EXIF", "XMP", "IPTC", "GPS", "C2PA credentials", "Text data"],
      });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Removing metadata failed.");
    } finally {
      setBusy(false);
    }
  }

  const foundSomething = Boolean(
    scan && (scan.blocks.length || scan.hasGps || scan.aiSignals.length),
  );

  return (
    <section className="media-workspace" aria-label="Metadata remover">
      <div className="bench-topline">
        <span>Local metadata bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field ${file ? "has-file" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => void selectFile(e.target.files?.[0])}
          />
          <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
            <span className="inspection-lens" aria-hidden="true">
              <Icon icon="ph:map-pin-simple-area" width="34" />
            </span>
            <strong>{file ? file.name : "Choose an image"}</strong>
            <span>{file ? "Click to replace it" : "JPG, PNG, or WebP"}</span>
          </button>
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Detected</span>
            <span>{scanning ? "Reading…" : "Read locally"}</span>
          </div>
          <ul className="meta-readout" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon icon={foundSomething ? "ph:seal-warning" : "ph:seal-check"} width="18" />
              {scan
                ? foundSomething
                  ? `Found: ${scan.blocks.join(", ") || "metadata"}`
                  : "No metadata blocks found"
                : scanning
                  ? "Scanning the file…"
                  : "Pick an image to inspect"}
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon icon={scan?.hasGps ? "ph:map-pin" : "ph:map-pin-slash"} width="18" />
              {scan?.hasGps ? "GPS location present" : "No GPS location found"}
            </li>
            {scan?.aiSignals.length ? (
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon icon="ph:robot" width="18" />
                AI generator fingerprint: {scan.aiSignals.join(", ")}
              </li>
            ) : null}
            {scan?.fields.slice(0, 3).map((field) => (
              <li key={field.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon icon="ph:tag" width="18" />
                {field.label}: {field.value}
              </li>
            ))}
          </ul>
          <label className="field-label">
            Output format
            <Select
              ariaLabel="Output format"
              value={format}
              onChange={(v) => setFormat(v as MetaFormat)}
              options={(Object.keys(formatLabels) as MetaFormat[]).map((f) => ({
                value: f,
                label: formatLabels[f],
              }))}
            />
          </label>
          <button className="primary-action" type="button" disabled={busy} onClick={() => void strip()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:eraser"} className={busy ? "spin" : ""} width="20" />
            {file ? "Remove metadata" : "Choose an image"}
          </button>
          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" />
            {canStripLosslessly()
              ? "Lossless: pixels are copied byte-for-byte."
              : "Reading and cleaning both happen in this tab."}
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
            <span>Clean copy ready</span>
            <strong>{formatBytes(result.size)}</strong>
            <small>
              {result.lossless
                ? `Dropped: ${result.removed.join(", ") || "metadata"} — pixels untouched`
                : "Rebuilt from pixels — all embedded data dropped"}
            </small>
          </div>
          <a
            className="download-action"
            href={result.url}
            download={outputName(file.name, "clean", extensions[format])}
          >
            <Icon icon="ph:download-simple" width="20" />
            Download
          </a>
        </div>
      )}
    </section>
  );
}
