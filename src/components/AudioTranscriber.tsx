"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Select } from "@/components/Select";
import { formatBytes, outputName } from "@/lib/tools";
import {
  formatClock,
  formatTranscript,
  wordCount,
  type TranscriptFormat,
  type TranscriptSegment,
} from "@/lib/transcript";
import type { ModelSize } from "@/lib/transcriber";

type Phase = "idle" | "model" | "decode" | "run";

const FORMAT_TABS: { value: TranscriptFormat; label: string }[] = [
  { value: "txt", label: "TXT" },
  { value: "srt", label: "SRT" },
  { value: "vtt", label: "VTT" },
];

const MIME_BY_FORMAT: Record<TranscriptFormat, string> = {
  txt: "text/plain",
  srt: "application/x-subrip",
  vtt: "text/vtt",
};

// Whisper's strongest languages — the model is multilingual but needs the
// spoken language named (v4 defaults to English when none is given).
const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "zh", label: "中文 (Chinese)" },
  { value: "es", label: "Español (Spanish)" },
  { value: "pt", label: "Português (Portuguese)" },
  { value: "ja", label: "日本語 (Japanese)" },
  { value: "ko", label: "한국어 (Korean)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "fr", label: "Français (French)" },
  { value: "it", label: "Italiano (Italian)" },
  { value: "ru", label: "Русский (Russian)" },
  { value: "hi", label: "हिन्दी (Hindi)" },
];

export function AudioTranscriber() {
  const inputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const cancelRef = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [srcUrl, setSrcUrl] = useState("");
  const [model, setModel] = useState<ModelSize>("tiny");
  const [language, setLanguage] = useState("en");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [audioDuration, setAudioDuration] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState<TranscriptFormat>("txt");
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);

  const busy = phase !== "idle";
  const isVideo = file?.type.startsWith("video/") ?? false;

  useEffect(() => () => {
    if (srcUrl) URL.revokeObjectURL(srcUrl);
  }, [srcUrl]);

  const text = useMemo(() => formatTranscript(segments, format), [segments, format]);

  const downloadUrl = useMemo(() => {
    if (!segments.length) return "";
    return URL.createObjectURL(new Blob([text], { type: `${MIME_BY_FORMAT[format]};charset=utf-8` }));
  }, [text, segments.length, format]);
  useEffect(() => () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  }, [downloadUrl]);

  function selectFile(next: File | undefined) {
    if (!next) return;
    setError("");
    setSegments([]);
    setDone(false);
    setProgress(0);
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    setFile(next);
    setSrcUrl(URL.createObjectURL(next));
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      return;
    }
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const parts: Blob[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) parts.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        recorderRef.current = null;
        if (!parts.length) return;
        const type = recorder.mimeType || "audio/webm";
        const extension = type.includes("mp4") ? "m4a" : "webm";
        selectFile(new File(parts, `recording.${extension}`, { type }));
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Microphone access was denied — allow it to record, or drop in a file instead.");
    }
  }

  async function transcribe() {
    if (!file) {
      inputRef.current?.click();
      return;
    }
    cancelRef.current = false;
    setError("");
    setSegments([]);
    setDone(false);
    try {
      const engine = await import("@/lib/transcriber");
      setPhase("model");
      setProgress(0);
      const pipe = await engine.loadModel(model, setProgress);
      setPhase("decode");
      const decoded = await engine.fileToPcm(file);
      setAudioDuration(decoded.duration);
      setPhase("run");
      setProgress(0);
      const result = await engine.transcribePcm(
        pipe,
        decoded,
        {
          onSegment: setSegments,
          onProgress: setProgress,
          isCancelled: () => cancelRef.current,
        },
        language,
      );
      setSegments(result);
      setDone(true);
    } catch (reason) {
      console.error(reason);
      setError(
        reason instanceof Error
          ? reason.message
          : "Transcription failed — try the other model size, or a different file.",
      );
    } finally {
      setPhase("idle");
    }
  }

  async function copyText() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Copy was blocked by the browser — select the text and copy it manually.");
    }
  }

  const phaseLabel =
    phase === "model"
      ? progress > 0
        ? `Downloading model ${progress}%`
        : "Preparing model"
      : phase === "decode"
        ? "Decoding audio"
        : phase === "run"
          ? `Transcribing ${progress}%`
          : "";

  return (
    <section className="media-workspace audio-workspace" aria-label="Audio transcriber">
      <div className="bench-topline">
        <span>Local transcription bench</span>
        <span>{file ? formatBytes(file.size) : "No file loaded"}</span>
      </div>
      <div className="workspace-grid">
        <div className={`drop-field video-drop ${file ? "has-file" : ""}`}>
          <input
            ref={inputRef}
            type="file"
            accept="audio/*,video/*,.mkv,.m4a,.mp3,.wav,.ogg,.flac"
            onChange={(event) => selectFile(event.target.files?.[0])}
          />
          {srcUrl && file ? (
            isVideo ? (
              <video
                src={srcUrl}
                controls
                style={{ display: "block", width: "100%", height: "auto", borderRadius: "inherit" }}
              />
            ) : (
              <div className="audio-preview">
                <Icon icon="ph:waveform" width={40} aria-hidden="true" />
                <strong>{file.name}</strong>
                <audio src={srcUrl} controls style={{ width: "100%" }} />
              </div>
            )
          ) : (
            <button className="drop-action" type="button" onClick={() => inputRef.current?.click()}>
              <span className="inspection-lens" aria-hidden="true">
                <Icon icon="ph:microphone" width="34" />
              </span>
              <strong>Choose audio or video</strong>
              <span>MP3, WAV, M4A, OGG · MP4, MOV, WebM, MKV</span>
            </button>
          )}
        </div>
        <div className="control-panel">
          <div className="control-heading">
            <span>Transcribe</span>
            <span>{busy ? phaseLabel : "Whisper, on-device"}</span>
          </div>
          <label className="field-label">
            Spoken language
            <Select ariaLabel="Spoken language" value={language} onChange={setLanguage} options={LANGUAGES} />
          </label>
          <label className="field-label">
            Model
            <Select
              ariaLabel="Model"
              value={model}
              onChange={(value) => setModel(value as ModelSize)}
              options={[
                { value: "tiny", label: "Fast — Whisper Tiny (~40 MB first run)" },
                { value: "base", label: "Sharper — Whisper Base (~80 MB first run)" },
              ]}
            />
          </label>
          <button
            className="drop-action"
            type="button"
            style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
            disabled={busy}
            onClick={() => void toggleRecording()}
          >
            <Icon icon={recording ? "ph:stop-circle" : "ph:record"} width="16" />
            {recording ? "Stop recording" : "Record from microphone"}
          </button>
          <button className="primary-action" type="button" disabled={busy || recording} onClick={() => void transcribe()}>
            <Icon
              icon={busy ? "ph:circle-notch" : "ph:text-aa"}
              className={busy ? "spin" : ""}
              width="20"
            />
            {busy ? phaseLabel : "Transcribe"}
          </button>
          {busy && (
            <>
              <progress className="task-progress" max="100" value={progress}>
                {progress}%
              </progress>
              <button
                className="drop-action"
                type="button"
                style={{ padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}
                onClick={() => {
                  cancelRef.current = true;
                }}
              >
                <Icon icon="ph:x" width="16" /> Stop and keep partial text
              </button>
            </>
          )}
          <p className="local-message">
            <Icon icon="ph:cpu" width="18" />
            Speed depends on your device. The model downloads once, then works offline.
          </p>
        </div>
      </div>
      {error && (
        <p className="error-message" role="alert">
          <Icon icon="ph:warning" width="20" />
          {error}
        </p>
      )}
      {segments.length > 0 && (
        <div className="transcript-panel" aria-live="polite">
          <div className="transcript-head">
            <div className="transcript-tabs" role="tablist" aria-label="Transcript format">
              {FORMAT_TABS.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  role="tab"
                  aria-selected={format === tab.value}
                  onClick={() => setFormat(tab.value)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="transcript-actions">
              <button className="transcript-copy" type="button" onClick={() => void copyText()}>
                <Icon icon={copied ? "ph:check" : "ph:copy"} width="16" />
                {copied ? "Copied" : "Copy"}
              </button>
              <a
                className="download-action"
                href={downloadUrl}
                download={outputName(file?.name ?? "recording", "transcript", format)}
              >
                <Icon icon="ph:download-simple" width="18" />
                Download
              </a>
            </div>
          </div>
          <div className="transcript-body">
            {format === "txt" ? (
              <ul className="transcript-segments">
                {segments.map((segment, index) => (
                  <li key={index}>
                    <time>{formatClock(segment.start)}</time>
                    <p>{segment.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="transcript-raw">{text}</pre>
            )}
          </div>
          <div className="transcript-foot">
            <span>{wordCount(segments)} words</span>
            {audioDuration > 0 && <span>{formatClock(audioDuration)} audio</span>}
            <span>{segments.length} segments</span>
            <span>{done ? "Finished" : `Transcribing ${progress}% — partial`}</span>
          </div>
        </div>
      )}
    </section>
  );
}
