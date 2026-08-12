"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type ImageMode = "convert" | "compress" | "resize";
type ImageFormat = "image/jpeg" | "image/png" | "image/webp";

type ImageWorkspaceProps = {
  mode: ImageMode;
  compact?: boolean;
  defaultFormat?: ImageFormat;
  accept?: string;
};

const formatLabels: Record<ImageFormat, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
};

const extensions: Record<ImageFormat, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function ImageWorkspace({
  mode,
  compact = false,
  defaultFormat = "image/webp",
  accept = "image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif",
}: ImageWorkspaceProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [inputUrl, setInputUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [format, setFormat] = useState<ImageFormat>(defaultFormat);
  const [quality, setQuality] = useState(82);
  const [width, setWidth] = useState(1600);
  const [height, setHeight] = useState(900);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (inputUrl) URL.revokeObjectURL(inputUrl);
  }, [inputUrl]);

  useEffect(() => () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  async function prepareFile(nextFile: File) {
    setError("");
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl("");
    if (inputUrl) URL.revokeObjectURL(inputUrl);

    setFile(nextFile);

    try {
      const blob = await normalizeInput(nextFile, quality / 100);
      setInputUrl(URL.createObjectURL(blob));
      const bitmap = await createImageBitmap(blob);
      setWidth(bitmap.width);
      setHeight(bitmap.height);
      setAspectRatio(bitmap.width / bitmap.height);
      bitmap.close();
    } catch {
      setError("This image cannot be decoded here. Try JPG, PNG, WebP, or HEIC.");
    }
  }

  function chooseFiles(files: FileList | null) {
    const nextFile = files?.[0];
    if (nextFile) void prepareFile(nextFile);
  }

  function changeWidth(nextWidth: number) {
    const safeWidth = Math.max(1, Math.round(nextWidth || 1));
    setWidth(safeWidth);
    setHeight(Math.max(1, Math.round(safeWidth / aspectRatio)));
  }

  function changeHeight(nextHeight: number) {
    const safeHeight = Math.max(1, Math.round(nextHeight || 1));
    setHeight(safeHeight);
    setWidth(Math.max(1, Math.round(safeHeight * aspectRatio)));
  }

  async function processFile() {
    if (!file) {
      inputRef.current?.click();
      return;
    }

    setBusy(true);
    setError("");

    try {
      const normalized = await normalizeInput(file, quality / 100);
      const bitmap = await createImageBitmap(normalized);
      const source = document.createElement("canvas");
      source.width = bitmap.width;
      source.height = bitmap.height;
      source.getContext("2d", { alpha: true })?.drawImage(bitmap, 0, 0);

      const target = document.createElement("canvas");
      target.width = mode === "resize" ? width : bitmap.width;
      target.height = mode === "resize" ? height : bitmap.height;

      if (mode === "resize" && (target.width !== source.width || target.height !== source.height)) {
        const { default: createPica } = await import("pica");
        await createPica().resize(source, target);
      } else {
        target.getContext("2d", { alpha: true })?.drawImage(source, 0, 0);
      }

      bitmap.close();
      const mime = mode === "compress" && format === "image/png" ? "image/webp" : format;
      const blob = await canvasBlob(target, mime, quality / 100);

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
    } catch (reason) {
      console.error(reason);
      setError("Processing failed. The file may use an unsupported color profile or codec.");
    } finally {
      setBusy(false);
    }
  }

  const action = mode === "resize" ? "Resize image" : mode === "compress" ? "Compress image" : "Convert image";
  const suffix = mode === "resize" ? `${width}x${height}` : mode === "compress" ? "compressed" : "converted";

  return (
    <section className={`media-workspace image-workspace ${compact ? "workspace-compact" : ""}`} aria-label={action}>
      <div className="bench-topline">
        <span>Local image bench</span>
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
            chooseFiles(event.dataTransfer.files);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={(event) => chooseFiles(event.target.files)}
          />
          <div className="registration-mark registration-mark-a" aria-hidden="true" />
          <div className="registration-mark registration-mark-b" aria-hidden="true" />

          {inputUrl && file ? (
            <>
              {/* Local blob previews may fail for HEIC even when conversion succeeds. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="file-preview" src={inputUrl} alt="Selected file preview" />
              <div className="file-caption">
                <strong>{file.name}</strong>
                <span>{width} × {height}</span>
              </div>
            </>
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:image-square" width="34" />
              </span>
              <strong>Drop an image here</strong>
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
              onChange={(value) => setFormat(value as ImageFormat)}
              options={Object.entries(formatLabels)
                .filter(([value]) => mode !== "compress" || value !== "image/png")
                .map(([value, label]) => ({ value, label }))}
            />
          </label>

          {mode === "resize" && (
            <div className="dimension-fields">
              <label className="field-label">
                Width
                <input type="number" min="1" max="12000" value={width} onChange={(event) => changeWidth(Number(event.target.value))} />
              </label>
              <span aria-hidden="true">×</span>
              <label className="field-label">
                Height
                <input type="number" min="1" max="12000" value={height} onChange={(event) => changeHeight(Number(event.target.value))} />
              </label>
            </div>
          )}

          {format !== "image/png" && mode !== "resize" && (
            <label className="field-label range-label">
              <span>Quality <output>{quality}%</output></span>
              <input type="range" min="35" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
            </label>
          )}

          <button className="primary-action" type="button" disabled={busy} onClick={() => void processFile()}>
            {busy ? <Icon icon="ph:circle-notch" className="spin" width="20" /> : <Icon icon="ph:magic-wand" width="20" />}
            {busy ? "Working locally…" : action}
          </button>

          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" aria-hidden="true" />
            Nothing is uploaded.
          </p>
        </div>
      </div>

      {error && <p className="error-message" role="alert"><Icon icon="ph:warning" width="20" />{error}</p>}

      {resultUrl && resultBlob && file && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>Result ready</span>
            <strong>{formatBytes(resultBlob.size)}</strong>
            <small>{resultBlob.size < file.size ? `${Math.round((1 - resultBlob.size / file.size) * 100)}% smaller` : "Size depends on format"}</small>
          </div>
          <a
            className="download-action"
            href={resultUrl}
            download={outputName(file.name, suffix, extensions[format])}
          >
            <Icon icon="ph:download-simple" width="20" aria-hidden="true" />
            Download
          </a>
        </div>
      )}
    </section>
  );
}

async function normalizeInput(file: File, quality: number) {
  const heic = /\.(heic|heif)$/i.test(file.name) || /heic|heif/.test(file.type);
  if (!heic) return file;

  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({ blob: file, toType: "image/jpeg", quality });
  return Array.isArray(converted) ? converted[0] : converted;
}

function canvasBlob(canvas: HTMLCanvasElement, type: ImageFormat, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("Canvas export failed.")), type, quality);
  });
}
