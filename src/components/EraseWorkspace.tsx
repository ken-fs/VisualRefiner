"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { formatBytes, outputName } from "@/lib/tools";
import { loadOpenCv } from "@/lib/opencv";

/** Processing cap keeps WASM memory and inpaint time sane on big photos. */
const MAX_DIM = 1600;

type Stage = "empty" | "ready" | "processing" | "done";

export function EraseWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const paintRef = useRef<HTMLCanvasElement>(null);
  const maskRef = useRef<HTMLCanvasElement | null>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const painting = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<ImageBitmap | null>(null);
  const [stage, setStage] = useState<Stage>("empty");
  const [brush, setBrush] = useState(36);
  const [hasMask, setHasMask] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);
  useEffect(() => () => bitmapRef.current?.close(), []);

  // The canvas only mounts after `file` is set, so the initial draw lives in an
  // effect keyed on the decoded bitmap — refs aren't populated mid-handler.
  useEffect(() => {
    const bitmap = image;
    const canvas = paintRef.current;
    if (!bitmap || !canvas) return;
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    const mask = document.createElement("canvas");
    mask.width = w;
    mask.height = h;
    const maskCtx = mask.getContext("2d");
    // State updates are deferred a frame: setState synchronously inside an
    // effect triggers cascading renders (and the lint rule that guards it).
    const id = requestAnimationFrame(() => {
      if (!ctx || !maskCtx) {
        setError("Canvas is unavailable in this browser.");
        return;
      }
      ctx.drawImage(bitmap, 0, 0, w, h);
      // Hidden mask canvas: black background, white strokes mark the fill area.
      maskCtx.fillStyle = "#000000";
      maskCtx.fillRect(0, 0, w, h);
      maskRef.current = mask;
      setStage("ready");
    });
    return () => cancelAnimationFrame(id);
  }, [image]);

  async function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setNotice("");
    setResult(null);
    setHasMask(false);
    bitmapRef.current?.close();
    setImage(null);
    setFile(next);
    try {
      const bitmap = await createImageBitmap(next, { imageOrientation: "from-image" });
      bitmapRef.current = bitmap;
      const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
      if (scale < 1) {
        const w = Math.round(bitmap.width * scale);
        const h = Math.round(bitmap.height * scale);
        setNotice(`Large image — working at ${w}×${h}px for speed.`);
      }
      setImage(bitmap);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not open this image.");
    }
  }

  function canvasPoint(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = paintRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function paintStroke(to: { x: number; y: number }) {
    const canvas = paintRef.current;
    const mask = maskRef.current;
    const bitmap = bitmapRef.current;
    if (!canvas || !mask || !bitmap) return;
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    // Redraw: photo, then every mask stroke as a red overlay.
    const ctx = canvas.getContext("2d")!;
    const maskCtx = mask.getContext("2d")!;
    const from = lastPoint.current ?? to;
    maskCtx.strokeStyle = "#ffffff";
    maskCtx.lineWidth = brush;
    maskCtx.lineCap = "round";
    maskCtx.lineJoin = "round";
    maskCtx.beginPath();
    maskCtx.moveTo(from.x, from.y);
    maskCtx.lineTo(to.x, to.y);
    maskCtx.stroke();
    ctx.drawImage(bitmap, 0, 0, w, h);
    ctx.globalAlpha = 0.45;
    ctx.drawImage(mask, 0, 0);
    ctx.globalAlpha = 1;
    setHasMask(true);
    lastPoint.current = to;
  }

  function redrawClean() {
    const canvas = paintRef.current;
    const mask = maskRef.current;
    const bitmap = bitmapRef.current;
    if (!canvas || !mask || !bitmap) return;
    const scale = Math.min(1, MAX_DIM / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d")!;
    const maskCtx = mask.getContext("2d")!;
    maskCtx.fillStyle = "#000000";
    maskCtx.fillRect(0, 0, mask.width, mask.height);
    ctx.drawImage(bitmap, 0, 0, w, h);
    setHasMask(false);
  }

  async function erase() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    const canvas = paintRef.current;
    const mask = maskRef.current;
    if (!canvas || !mask || !hasMask) {
      setError("Paint over the thing you want gone first.");
      return;
    }
    setStage("processing");
    setError("");
    setResult(null);
    try {
      const cv = await loadOpenCv();
      // Draw the clean photo into a processing canvas (the visible one has the
      // red overlay baked into it).
      const source = document.createElement("canvas");
      source.width = mask.width;
      source.height = mask.height;
      const sctx = source.getContext("2d")!;
      sctx.drawImage(bitmapRef.current!, 0, 0, mask.width, mask.height);

      const src = cv.imread(source);
      const rgb = new cv.Mat();
      cv.cvtColor(src, rgb, cv.COLOR_RGBA2RGB);
      const maskMatRgba = cv.imread(mask);
      const maskMat = new cv.Mat();
      cv.cvtColor(maskMatRgba, maskMat, cv.COLOR_RGBA2GRAY);
      const dst = new cv.Mat();
      cv.inpaint(rgb, maskMat, dst, 4, cv.INPAINT_TELEA);

      const out = document.createElement("canvas");
      out.width = mask.width;
      out.height = mask.height;
      cv.imshow(out, dst);
      src.delete();
      rgb.delete();
      maskMatRgba.delete();
      maskMat.delete();
      dst.delete();

      // Show the result on the visible canvas too.
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(out, 0, 0);

      const type = file.type === "image/png" || file.type === "image/webp" ? file.type : "image/jpeg";
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.95));
      if (!blob) throw new Error("Could not encode the cleaned image.");
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
      setStage("done");
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Erasing failed.");
      setStage("ready");
    }
  }

  const ext = file?.type === "image/png" ? "png" : file?.type === "image/webp" ? "webp" : "jpg";

  return (
    <section className="media-workspace" aria-label="Object eraser">
      <div className="bench-topline">
        <span>Local erase bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field ${file ? "has-file" : ""}`} style={{ position: "relative" }}>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => void selectFile(e.target.files?.[0])}
          />
          {file ? (
            <canvas
              ref={paintRef}
              style={{ display: "block", width: "100%", height: "auto", cursor: "crosshair", touchAction: "none" }}
              onPointerDown={(e) => {
                if (stage !== "ready") return;
                e.currentTarget.setPointerCapture(e.pointerId);
                painting.current = true;
                lastPoint.current = null;
                paintStroke(canvasPoint(e));
              }}
              onPointerMove={(e) => {
                if (!painting.current || stage !== "ready") return;
                paintStroke(canvasPoint(e));
              }}
              onPointerUp={() => {
                painting.current = false;
                lastPoint.current = null;
              }}
            />
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:eraser" width="34" />
              </span>
              <strong>Choose an image</strong>
              <span>JPG, PNG, or WebP</span>
            </button>
          )}
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Erase</span>
            <span>{stage === "processing" ? "Filling…" : "OpenCV, in your tab"}</span>
          </div>
          {notice && (
            <p className="local-message">
              <Icon icon="ph:info" width="18" />
              {notice}
            </p>
          )}
          <label className="field-label">
            Brush size
            <input
              type="range"
              min={10}
              max={90}
              step={2}
              value={brush}
              onChange={(e) => setBrush(Number(e.target.value))}
            />
          </label>
          <button
            className="drop-action"
            type="button"
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
            disabled={!hasMask || stage !== "ready"}
            onClick={redrawClean}
          >
            <Icon icon="ph:arrow-counter-clockwise" width="16" /> Clear the paint
          </button>
          <button
            className="primary-action"
            type="button"
            disabled={stage === "processing" || !file}
            onClick={() => void erase()}
          >
            <Icon
              icon={stage === "processing" ? "ph:circle-notch" : "ph:magic-wand"}
              className={stage === "processing" ? "spin" : ""}
              width="20"
            />
            {stage === "processing" ? "Filling the gap…" : file ? "Erase painted area" : "Choose an image"}
          </button>
          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" />
            First erase downloads the editor engine (~13 MB), then everything runs locally.
          </p>
        </div>
      </div>
      {error && (
        <p className="error-message" role="alert">
          <Icon icon="ph:warning" width="20" />
          {error}
        </p>
      )}
      {result && file && stage === "done" && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>Cleaned image ready</span>
            <strong>{formatBytes(result.size)}</strong>
            <small>Filled from the surrounding pixels</small>
          </div>
          <a className="download-action" href={result.url} download={outputName(file.name, "erased", ext)}>
            <Icon icon="ph:download-simple" width="20" />
            Download
          </a>
        </div>
      )}
    </section>
  );
}
