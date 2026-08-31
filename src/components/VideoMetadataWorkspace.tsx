"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { formatBytes, outputName } from "@/lib/tools";

type Container = "mp4" | "mov" | "mkv" | "webm";

const containerLabels: Record<Container, string> = {
  mp4: "MP4",
  mov: "QuickTime (MOV)",
  mkv: "Matroska (MKV)",
  webm: "WebM",
};
const containerMime: Record<Container, string> = {
  mp4: "video/mp4",
  mov: "video/quicktime",
  mkv: "video/x-matroska",
  webm: "video/webm",
};

const TAG_LABELS: [string, string][] = [
  ["title", "Title"],
  ["artist", "Artist"],
  ["album", "Album"],
  ["albumArtist", "Album artist"],
  ["genre", "Genre"],
  ["date", "Date"],
  ["comment", "Comment"],
  ["description", "Description"],
  ["lyrics", "Lyrics"],
];

type Scan = {
  container: Container;
  found: string[];
  rawCount: number;
  imageCount: number;
  duration: number | null;
};

export function VideoMetadataWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState("");
  const [scan, setScan] = useState<Scan | null>(null);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ url: string; size: number; droppedTracks: number } | null>(null);

  useEffect(() => () => {
    if (srcUrl) URL.revokeObjectURL(srcUrl);
  }, [srcUrl]);
  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  async function inspect(next: File) {
    const media = await import("mediabunny");
    const input = new media.Input({ source: new media.BlobSource(next), formats: media.ALL_FORMATS });
    try {
      const format = await input.getFormat();
      let container: Container | null = null;
      if (format === media.MP4) container = "mp4";
      else if (format === media.QTFF) container = "mov";
      else if (format === media.WEBM) container = "webm";
      else if (format === media.MATROSKA) container = "mkv";
      if (!container) {
        throw new Error("This container can't be cleaned losslessly — MP4, MOV, MKV, and WebM only.");
      }
      const tags = await input.getMetadataTags();
      const found: string[] = [];
      for (const [key, label] of TAG_LABELS) {
        const value = tags[key as keyof typeof tags];
        if (value != null && value !== "") found.push(label);
      }
      const rawCount = tags.raw && typeof tags.raw === "object" ? Object.keys(tags.raw).length : 0;
      const duration = await input.getDurationFromMetadata().catch(() => null);
      setScan({
        container,
        found,
        rawCount,
        imageCount: tags.images?.length ?? 0,
        duration,
      });
    } finally {
      input.dispose();
    }
  }

  async function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setProgress(0);
    setResult(null);
    setScan(null);
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setFile(next);
    setSrcUrl(URL.createObjectURL(next));
    setScanning(true);
    try {
      await inspect(next);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not read this file.");
    } finally {
      setScanning(false);
    }
  }

  async function strip() {
    if (!file || !scan) {
      inputRef.current?.click();
      return;
    }
    setBusy(true);
    setError("");
    setProgress(0);
    try {
      const media = await import("mediabunny");
      const input = new media.Input({ source: new media.BlobSource(file), formats: media.ALL_FORMATS });
      const target = new media.BufferTarget();
      const outputFormat =
        scan.container === "mp4"
          ? new media.Mp4OutputFormat({ fastStart: "in-memory" })
          : scan.container === "mov"
            ? new media.MovOutputFormat({ fastStart: "in-memory" })
            : scan.container === "mkv"
              ? new media.MkvOutputFormat()
              : new media.WebMOutputFormat();
      const output = new media.Output({ format: outputFormat, target });
      const conversion = await media.Conversion.init({
        input,
        output,
        // Empty tag set: nothing descriptive is written to the output file.
        tags: () => ({}),
      });
      if (!conversion.isValid) {
        throw new Error("This file's tracks can't be repacked in this browser.");
      }
      conversion.onProgress = (value) => setProgress(Math.round(value * 100));
      await conversion.execute();
      if (!target.buffer) throw new Error("Cleaning produced no output.");
      const blob = new Blob([target.buffer], { type: containerMime[scan.container] });
      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        droppedTracks: conversion.discardedTracks.length,
      });
      setProgress(100);
    } catch (reason) {
      console.error(reason);
      setError(reason instanceof Error ? reason.message : "Cleaning failed.");
    } finally {
      setBusy(false);
    }
  }

  const clean = scan && !scan.found.length && !scan.rawCount && !scan.imageCount;

  return (
    <section className="media-workspace video-workspace" aria-label="Video metadata remover">
      <div className="bench-topline">
        <span>Local video bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field video-drop ${file ? "has-file" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,.mkv,.mp4,.mov,.webm"
            onChange={(e) => void selectFile(e.target.files?.[0])}
          />
          {srcUrl ? (
            <video
              src={srcUrl}
              controls
              style={{ display: "block", width: "100%", height: "auto", borderRadius: "inherit" }}
            />
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:film-strip" width="34" />
              </span>
              <strong>Choose a video</strong>
              <span>MP4, MOV, MKV, or WebM</span>
            </button>
          )}
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Detected</span>
            <span>{scanning ? "Reading…" : scan ? containerLabels[scan.container] : "No upload"}</span>
          </div>
          <ul className="meta-readout" style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
            <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon icon={clean ? "ph:seal-check" : "ph:seal-warning"} width="18" />
              {scan
                ? clean
                  ? "No container metadata found"
                  : [
                      scan.found.length ? scan.found.join(", ") : null,
                      scan.rawCount ? `${scan.rawCount} raw container fields` : null,
                      scan.imageCount ? `${scan.imageCount} embedded image(s)` : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")
                : scanning
                  ? "Inspecting the container…"
                  : "Pick a video to inspect"}
            </li>
            {scan?.duration ? (
              <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Icon icon="ph:clock" width="18" />
                {scan.duration.toFixed(1)}s · streams are copied, not re-encoded
              </li>
            ) : null}
          </ul>
          <button className="primary-action" type="button" disabled={busy || !scan} onClick={() => void strip()}>
            <Icon icon={busy ? "ph:circle-notch" : "ph:eraser"} className={busy ? "spin" : ""} width="20" />
            {busy ? `Cleaning ${progress}%` : file ? "Remove metadata" : "Choose a video"}
          </button>
          {busy && <progress className="task-progress" max="100" value={progress}>{progress}%</progress>}
          <p className="local-message">
            <Icon icon="ph:shield-check" width="18" />
            Pixels and sound stay untouched — only the container is rebuilt.
          </p>
        </div>
      </div>
      {error && (
        <p className="error-message" role="alert">
          <Icon icon="ph:warning" width="20" />
          {error}
        </p>
      )}
      {result && file && scan && (
        <div className="result-strip" aria-live="polite">
          <div>
            <span>Clean copy ready</span>
            <strong>{formatBytes(result.size)}</strong>
            <small>
              Container metadata dropped{result.droppedTracks ? ` · ${result.droppedTracks} unsupported track(s) left out` : ""}
            </small>
          </div>
          <a
            className="download-action"
            href={result.url}
            download={outputName(file.name, "clean", scan.container)}
          >
            <Icon icon="ph:download-simple" width="20" />
            Download
          </a>
        </div>
      )}
    </section>
  );
}
