"use client";

import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { formatBytes } from "@/lib/tools";
import { scanImageMetadata, type ScanReport } from "@/lib/image-metadata";
import { readC2pa, type C2paReport } from "@/lib/c2pa";

type Report = {
  scan: ScanReport;
  c2pa: C2paReport;
};

export function OriginWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<Report | null>(null);

  async function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setReport(null);
    setFile(next);
    setBusy(true);
    try {
      const buffer = await next.arrayBuffer();
      const scan = await scanImageMetadata(next, buffer);
      const c2pa = readC2pa(buffer, scan.container);
      setReport({ scan, c2pa });
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read this image.");
    } finally {
      setBusy(false);
    }
  }

  const c2pa = report?.c2pa;
  const scan = report?.scan;
  const aiSignals = new Set([...(scan?.aiSignals ?? [])]);
  const aiFromSourceType = c2pa?.digitalSourceTypes.some((t) => /AI|Algorithmic/i.test(t));
  const generatorText = c2pa?.claimGenerator;

  return (
    <section className="media-workspace" aria-label="Image origin checker">
      <div className="bench-topline">
        <span>Local origin bench</span>
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
              <Icon icon="ph:fingerprint" width="34" />
            </span>
            <strong>{file ? file.name : "Choose an image"}</strong>
            <span>{file ? "Click to replace it" : "JPG, PNG, or WebP"}</span>
          </button>
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Origin report</span>
            <span>{busy ? "Reading…" : "Never uploaded"}</span>
          </div>
          {!report && (
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.85rem", fontWeight: 650 }}>
              {busy ? "Reading credentials and metadata…" : "Pick an image to see where it says it came from."}
            </p>
          )}
          {report && c2pa && scan && (
            <ul className="meta-readout" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.55rem" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <Icon icon={c2pa.found ? "ph:certificate" : "ph:certificate"} width="18" style={{ marginTop: 2 }} />
                <span>
                  {c2pa.found ? (
                    <>
                      <strong>Content Credentials found</strong>
                      {generatorText ? <> — signed by {generatorText}</> : null}
                      {c2pa.signaturePresent ? " · signature embedded (not verified here)" : null}
                      {c2pa.partial ? " · details unreadable, but the manifest is there" : null}
                    </>
                  ) : (
                    "No C2PA Content Credentials"
                  )}
                </span>
              </li>
              {c2pa.title ? (
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon icon="ph:text-aa" width="18" /> Title: {c2pa.title}
                </li>
              ) : null}
              {c2pa.actions.length ? (
                <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon icon="ph:list-checks" width="18" /> History: {c2pa.actions.join(" → ")}
                </li>
              ) : null}
              {c2pa.digitalSourceTypes.map((t) => (
                <li key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon icon="ph:atom" width="18" /> {t}
                </li>
              ))}
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon icon={aiSignals.size || aiFromSourceType ? "ph:robot" : "ph:question"} width="18" />
                {aiSignals.size
                  ? `AI generator fingerprint: ${[...aiSignals].join(", ")}`
                  : aiFromSourceType
                    ? "Credential marks this as AI-generated"
                    : "No AI generator fingerprints in metadata"}
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon icon={scan.blocks.length ? "ph:stack" : "ph:seal-check"} width="18" />
                {scan.blocks.length ? `Metadata on board: ${scan.blocks.join(", ")}` : "No metadata blocks"}
                {scan.hasGps ? " · GPS" : ""}
              </li>
            </ul>
          )}
          {report && (
            <p className="local-message">
              <Icon icon="ph:info" width="18" />
              No signals found doesn&apos;t prove a human made it — metadata can be stripped.
            </p>
          )}
          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" />
            Everything is read in this tab. Nothing is sent anywhere.
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
