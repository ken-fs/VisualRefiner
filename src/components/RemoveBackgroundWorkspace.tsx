"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";

type Phase = "empty" | "ready" | "loading" | "processing" | "done";
type Background = "transparent" | "white";

const CHECKER = "repeating-conic-gradient(#e8e8e8 0% 25%, #ffffff 0% 50%) 50% / 16px 16px";

export function RemoveBackgroundWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const cutoutRef = useRef<HTMLCanvasElement | null>(null);
  const objectBottom = useRef(0);

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("empty");
  const [progress, setProgress] = useState(0);
  const [background, setBackground] = useState<Background>("transparent");
  const [shadow, setShadow] = useState(false);
  const [reflection, setReflection] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  // Re-composite whenever a finish option changes after a cutout exists.
  const composite = useCallback(() => {
    const canvas = previewRef.current;
    const cut = cutoutRef.current;
    if (!canvas || !cut) return;
    const w = cut.width;
    const h = cut.height;
    const floor = objectBottom.current;
    const reflH = reflection ? Math.max(24, Math.round(floor * 0.35)) : 0;
    canvas.width = w;
    canvas.height = h + reflH;
    const ctx = canvas.getContext("2d")!;
    if (background === "white") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, canvas.height);
    }
    ctx.save();
    if (shadow) {
      const s = Math.max(10, Math.round(Math.min(w, h) * 0.03));
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = s;
      ctx.shadowOffsetY = Math.round(s * 0.5);
    }
    ctx.drawImage(cut, 0, 0);
    ctx.restore();
    if (reflection && reflH > 0) {
      const t = document.createElement("canvas");
      t.width = w;
      t.height = reflH;
      const tctx = t.getContext("2d")!;
      tctx.translate(0, reflH);
      tctx.scale(1, -1);
      tctx.drawImage(cut, 0, floor - reflH, w, reflH, 0, 0, w, reflH);
      const fade = tctx.createLinearGradient(0, 0, 0, reflH);
      fade.addColorStop(0, "rgba(0,0,0,0.28)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      tctx.globalCompositeOperation = "destination-in";
      tctx.fillStyle = fade;
      tctx.fillRect(0, 0, w, reflH);
      ctx.drawImage(t, 0, floor);
    }
  }, [background, shadow, reflection]);

  useEffect(() => {
    if (phase === "done") composite();
  }, [phase, composite]);

  async function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    cutoutRef.current = null;
    setFile(next);
    setImageUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(next);
    });
    setPhase("ready");
  }

  async function remove() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    if (!imageUrl) return;
    setError("");
    try {
      setPhase("loading");
      setProgress(0);
      const { loadSegmenter, segmentMask } = await import("@/lib/bg-removal");
      const loaded = await loadSegmenter(setProgress);

      setPhase("processing");
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      const w = bitmap.width;
      const h = bitmap.height;
      const mask = await segmentMask(loaded, imageUrl, w, h);

      // Apply the mask to the alpha channel → cutout canvas kept for re-compositing.
      const source = document.createElement("canvas");
      source.width = w;
      source.height = h;
      const sctx = source.getContext("2d")!;
      sctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      const pixels = sctx.getImageData(0, 0, w, h);
      const maskData = (mask as unknown as { data: Uint8ClampedArray }).data;
      let bottom = 0;
      for (let i = 0; i < w * h; i++) {
        const a = maskData[i];
        pixels.data[i * 4 + 3] = a;
        if (a > 40) bottom = Math.floor(i / w);
      }
      sctx.putImageData(pixels, 0, 0);
      cutoutRef.current = source;
      objectBottom.current = bottom || h;
      setPhase("done");
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Background removal failed.");
      setPhase("ready");
    }
  }

  async function download() {
    const canvas = previewRef.current;
    if (!canvas || !file) return;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = outputName(file.name, background === "white" ? "white-bg" : "no-bg", "png");
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  const busy = phase === "loading" || phase === "processing";

  return (
    <section className="media-workspace" aria-label="Background remover">
      <div className="bench-topline">
        <span>Local cutout bench</span>
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
          {file && imageUrl ? (
            phase === "done" || busy ? (
              <canvas
                ref={previewRef}
                style={{ display: "block", width: "100%", height: "auto", background: CHECKER }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="file-preview" src={imageUrl} alt="Selected file preview" />
            )
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:scissors" width="34" />
              </span>
              <strong>Choose an image</strong>
              <span>JPG, PNG, or WebP</span>
            </button>
          )}
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Cutout</span>
            <span>{busy ? "Model in your tab" : "RMBG-1.4, on-device"}</span>
          </div>
          {phase === "done" && (
            <>
              <label className="field-label">
                Background
                <Select
                  ariaLabel="Background fill"
                  value={background}
                  onChange={(v) => setBackground(v as Background)}
                  options={[
                    { value: "transparent", label: "Transparent" },
                    { value: "white", label: "White (marketplace style)" },
                  ]}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} />
                Soft drop shadow
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}>
                <input type="checkbox" checked={reflection} onChange={(e) => setReflection(e.target.checked)} />
                Floor reflection
              </label>
            </>
          )}
          <button className="primary-action" type="button" disabled={busy} onClick={() => void remove()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:magic-wand"} className={busy ? "spin" : ""} width="20" />
            {phase === "loading"
              ? `Downloading the model… ${progress}%`
              : phase === "processing"
                ? "Cutting out the subject…"
                : file
                  ? "Remove background"
                  : "Choose an image"}
          </button>
          {phase === "done" && (
            <button className="download-action" type="button" style={{ justifyContent: "center" }} onClick={() => void download()}>
              <Icon icon="ph:download-simple" width="20" />
              Download PNG
            </button>
          )}
          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" />
            First run downloads the model (~44 MB), then everything runs locally.
          </p>
        </div>
      </div>
      {error && (
        <p className="error-message" role="alert">
          <Icon icon="ph:warning" width="20" />
          {error}
        </p>
      )}
    </section>
  );
}
