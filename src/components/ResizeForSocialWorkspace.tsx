"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type Preset = { id: string; label: string; w: number; h: number };
type Fit = "fill" | "pad";
type OutFormat = "image/jpeg" | "image/png" | "image/webp";

const PRESETS: Preset[] = [
  { id: "instagram-post", label: "Instagram Post", w: 1080, h: 1080 },
  { id: "instagram-portrait", label: "Instagram Portrait", w: 1080, h: 1350 },
  { id: "instagram-story", label: "Instagram Story / Reel", w: 1080, h: 1920 },
  { id: "tiktok", label: "TikTok", w: 1080, h: 1920 },
  { id: "youtube-thumbnail", label: "YouTube Thumbnail", w: 1280, h: 720 },
  { id: "x-post", label: "X (Twitter) Post", w: 1600, h: 900 },
  { id: "pinterest-pin", label: "Pinterest Pin", w: 1000, h: 1500 },
  { id: "facebook-post", label: "Facebook Post", w: 1200, h: 630 },
  { id: "amazon-product", label: "Amazon Product", w: 2000, h: 2000 },
  { id: "shopify-product", label: "Shopify Product", w: 2048, h: 2048 },
  { id: "etsy-listing", label: "Etsy Listing", w: 2700, h: 2025 },
];

const EXT: Record<OutFormat, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

type ResultItem = { preset: Preset; url: string; size: number; name: string };

export function ResizeForSocialWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [dims, setDims] = useState("");
  const [selected, setSelected] = useState<string[]>(PRESETS.map((p) => p.id));
  const [fit, setFit] = useState<Fit>("fill");
  const [format, setFormat] = useState<OutFormat>("image/jpeg");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);
  useEffect(
    () => () => {
      results.forEach((r) => URL.revokeObjectURL(r.url));
      bitmapRef.current?.close();
    },
    [results],
  );

  async function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setResults((old) => {
      old.forEach((r) => URL.revokeObjectURL(r.url));
      return [];
    });
    try {
      const bitmap = await createImageBitmap(next, { imageOrientation: "from-image" });
      bitmapRef.current?.close();
      bitmapRef.current = bitmap;
      setDims(`${bitmap.width} × ${bitmap.height}`);
      setFile(next);
      setImageUrl((old) => {
        if (old) URL.revokeObjectURL(old);
        return URL.createObjectURL(next);
      });
    } catch {
      setError("This image cannot be decoded here. Try JPG, PNG, or WebP.");
    }
  }

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((s) => s !== id) : [...cur, id]));
  }

  async function processAll() {
    const bitmap = bitmapRef.current;
    if (!file || !bitmap) {
      inputRef.current?.click();
      return;
    }
    const presets = PRESETS.filter((p) => selected.includes(p.id));
    if (!presets.length) {
      setError("Pick at least one size.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { default: createPica } = await import("pica");
      const pica = createPica();
      const out: ResultItem[] = [];
      for (const preset of presets) {
        const canvas = document.createElement("canvas");
        canvas.width = preset.w;
        canvas.height = preset.h;
        const ctx = canvas.getContext("2d")!;
        if (fit === "fill") {
          // Center-crop the source to the target ratio, then resize.
          const ratio = preset.w / preset.h;
          let cw = bitmap.width;
          let ch = bitmap.height;
          if (bitmap.width / bitmap.height > ratio) cw = Math.round(bitmap.height * ratio);
          else ch = Math.round(bitmap.width / ratio);
          const crop = document.createElement("canvas");
          crop.width = cw;
          crop.height = ch;
          crop.getContext("2d")!.drawImage(bitmap, (bitmap.width - cw) / 2, (bitmap.height - ch) / 2, cw, ch, 0, 0, cw, ch);
          await pica.resize(crop, canvas);
        } else {
          if (format === "image/png") ctx.clearRect(0, 0, preset.w, preset.h);
          else {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, preset.w, preset.h);
          }
          const s = Math.min(preset.w / bitmap.width, preset.h / bitmap.height);
          const dw = Math.max(1, Math.round(bitmap.width * s));
          const dh = Math.max(1, Math.round(bitmap.height * s));
          const scaled = document.createElement("canvas");
          scaled.width = dw;
          scaled.height = dh;
          await pica.resize(sourceCanvas(bitmap), scaled);
          ctx.drawImage(scaled, Math.round((preset.w - dw) / 2), Math.round((preset.h - dh) / 2));
        }
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, format, 0.92));
        if (!blob) throw new Error("Could not encode the resized image.");
        out.push({
          preset,
          size: blob.size,
          url: URL.createObjectURL(blob),
          name: outputName(file.name, `${preset.id}-${preset.w}x${preset.h}`, EXT[format]),
        });
      }
      setResults((old) => {
        old.forEach((r) => URL.revokeObjectURL(r.url));
        return out;
      });
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Resizing failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="media-workspace" aria-label="Social size resizer">
      <div className="bench-topline">
        <span>Local resize bench</span>
        <span>{file ? `${formatBytes(file.size)} · ${dims}` : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field ${file ? "has-file" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => void selectFile(e.target.files?.[0])}
          />
          {file && imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="file-preview" src={imageUrl} alt="Selected file preview" />
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:arrows-out-simple" width="34" />
              </span>
              <strong>Choose an image</strong>
              <span>JPG, PNG, or WebP</span>
            </button>
          )}
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Sizes</span>
            <span>{selected.length} selected</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.3rem 0.75rem" }}>
            {PRESETS.map((p) => (
              <label key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.85rem" }}>
                <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
                {p.label} <small style={{ color: "var(--muted)" }}>{p.w}×{p.h}</small>
              </label>
            ))}
          </div>
          <label className="field-label">
            Fit
            <Select
              ariaLabel="Fit mode"
              value={fit}
              onChange={(v) => setFit(v as Fit)}
              options={[
                { value: "fill", label: "Fill — center crop to exact size" },
                { value: "pad", label: "Fit — letterbox, no cropping" },
              ]}
            />
          </label>
          <label className="field-label">
            Format
            <Select
              ariaLabel="Output format"
              value={format}
              onChange={(v) => setFormat(v as OutFormat)}
              options={[
                { value: "image/jpeg", label: "JPG (platform standard)" },
                { value: "image/png", label: "PNG (keeps transparency)" },
                { value: "image/webp", label: "WebP (smaller files)" },
              ]}
            />
          </label>
          <button className="primary-action" type="button" disabled={busy} onClick={() => void processAll()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:magic-wand"} className={busy ? "spin" : ""} width="20" />
            {busy ? "Resizing locally…" : file ? `Resize ${selected.length} size${selected.length === 1 ? "" : "s"}` : "Choose an image"}
          </button>
          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" />
            Nothing is uploaded.
          </p>
        </div>
      </div>
      {error && (
        <p className="error-message" role="alert">
          <Icon icon="ph:warning" width="20" />
          {error}
        </p>
      )}
      {results.map((r) => (
        <div className="result-strip" key={r.preset.id} style={{ marginTop: "0.5rem" }}>
          <div>
            <span>{r.preset.label}</span>
            <strong>{r.preset.w} × {r.preset.h}</strong>
            <small>{formatBytes(r.size)}</small>
          </div>
          <a className="download-action" href={r.url} download={r.name}>
            <Icon icon="ph:download-simple" width="20" aria-hidden="true" />
            Download
          </a>
        </div>
      ))}
    </section>
  );
}

function sourceCanvas(bitmap: ImageBitmap) {
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0);
  return canvas;
}
