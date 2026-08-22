"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

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

type Scan = { hasExif: boolean; hasGps: boolean; tagCount: number };

/**
 * Lightweight read of a JPEG's APP1 (Exif) segment: confirms whether metadata is
 * present and whether it includes a GPS IFD (tag 0x8825). We only need presence,
 * not the values, so this walks IFD0 far enough to answer that and stops.
 * PNG/WebP report "no readable EXIF"; the re-encode strips everything regardless.
 */
function inspectJpegExif(buffer: ArrayBuffer): Scan {
  const none: Scan = { hasExif: false, hasGps: false, tagCount: 0 };
  const view = new DataView(buffer);
  if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return none; // not JPEG
  let offset = 2;
  while (offset + 4 <= view.byteLength) {
    if (view.getUint8(offset) !== 0xff) break;
    const marker = view.getUint8(offset + 1);
    const size = view.getUint16(offset + 2);
    if (marker === 0xe1) {
      // APP1 — check for "Exif\0\0"
      const start = offset + 4;
      if (
        start + 6 <= view.byteLength &&
        view.getUint32(start) === 0x45786966 && // "Exif"
        view.getUint16(start + 4) === 0x0000
      ) {
        const tiff = start + 6;
        const le = view.getUint16(tiff) === 0x4949; // II = little-endian
        const u16 = (o: number) => view.getUint16(o, le);
        const u32 = (o: number) => view.getUint32(o, le);
        const ifd0 = tiff + u32(tiff + 4);
        if (ifd0 + 2 > view.byteLength) return { hasExif: true, hasGps: false, tagCount: 0 };
        const count = u16(ifd0);
        let hasGps = false;
        for (let i = 0; i < count; i++) {
          const entry = ifd0 + 2 + i * 12;
          if (entry + 2 > view.byteLength) break;
          if (u16(entry) === 0x8825) hasGps = true; // GPS IFD pointer
        }
        return { hasExif: true, hasGps, tagCount: count };
      }
    }
    if (marker === 0xda) break; // start of scan — pixel data begins
    offset += 2 + size;
  }
  return none;
}

export function MetadataWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [scan, setScan] = useState<Scan | null>(null);
  const [format, setFormat] = useState<MetaFormat>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  async function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setResult(null);
    setFile(next);
    // Default the output to match the input where we can.
    if (next.type === "image/png") setFormat("image/png");
    else if (next.type === "image/webp") setFormat("image/webp");
    else setFormat("image/jpeg");
    try {
      const buf = await next.arrayBuffer();
      setScan(inspectJpegExif(buf));
    } catch {
      setScan(null);
    }
  }

  async function strip() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    setBusy(true);
    setError("");
    try {
      // from-image bakes the displayed orientation, so dropping the orientation
      // tag can't silently rotate the result.
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
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Removing metadata failed.");
    } finally {
      setBusy(false);
    }
  }

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
            <span>Read locally</span>
          </div>
          <ul className="meta-readout" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon icon={scan?.hasExif ? "ph:seal-warning" : "ph:seal-check"} width="18" />
              {scan?.hasExif ? `EXIF metadata present (${scan.tagCount} tags)` : "No readable EXIF block"}
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon icon={scan?.hasGps ? "ph:map-pin" : "ph:map-pin-slash"} width="18" />
              {scan?.hasGps ? "GPS location present" : "No GPS location found"}
            </li>
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
            Reading and cleaning both happen in this tab.
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
            <small>EXIF, GPS, and thumbnails dropped</small>
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
