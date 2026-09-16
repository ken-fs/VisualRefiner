import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { AudioTranscriber } from "@/components/AudioTranscriber";

export const metadata: Metadata = {
  title: "Audio to Text — Transcribe Audio & Video in Your Browser",
  description:
    "Turn speech in audio or video files into text you can copy or download as TXT, SRT, or VTT. Transcription runs locally in your browser — no upload, no account, no limits.",
  alternates: { canonical: "/audio-to-text" },
};

export default function AudioToTextPage() {
  return (
    <ToolPageShell
      title="Audio transcriber"
      description="Convert speech in audio or video files into text, then copy it or export TXT, SRT, or VTT subtitles."
      note="Transcribed on your device"
      slug="/audio-to-text"
      steps={[
        "Choose an audio or video file, or record from your microphone.",
        "Pick a model — Fast for speed, Sharper for accuracy — and transcribe.",
        "Read along as text appears, then copy it or download TXT, SRT, or VTT.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">Transcription that never leaves the tab</h2>
          <p>
            Most transcribers upload your recording to a server, run a model there, and charge per minute. This
            one downloads a small open Whisper model once and runs it entirely in your browser — on the GPU when
            available, on the CPU otherwise. After that first download it even works offline, and your audio is
            never sent anywhere.
          </p>
          <h3>What to expect</h3>
          <p>
            The Fast model (Whisper Tiny) is a ~40 MB one-time download and suits clear speech; the Sharper model
            (Whisper Base, ~80 MB) handles accents and noisier audio better. Speed depends on your device: on a
            recent laptop the Fast model processes several times faster than real-time, while an older machine
            runs closer to real-time — a one-hour file is a few minutes of work, not seconds. Text appears
            window-by-window as it is recognized, so you can start reading (or stop and keep the partial text)
            before the file finishes.
          </p>
          <h3>Formats and exports</h3>
          <p>
            Audio files (MP3, WAV, M4A, OGG, FLAC) are decoded directly; for video files (MP4, MOV, WebM, MKV)
            the audio track is extracted first. The transcript is shown with timestamps and can be copied to the
            clipboard or downloaded as plain text, SRT, or WebVTT subtitles. To cut the clip first, use the{" "}
            <Link href="/trim-video">video trimmer</Link>; to shrink a large recording before transcribing, the{" "}
            <Link href="/compress-video">video compressor</Link>.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is my audio uploaded anywhere?",
          answer:
            "No. The Whisper model runs locally in your browser tab. The only network request is the one-time model download; after that the tool works offline and your file never leaves your device.",
        },
        {
          question: "Which languages are supported?",
          answer:
            "The models are multilingual Whisper variants covering 90+ languages — pick the spoken language before transcribing (English is the default). The strongest results come from well-represented languages like English, Chinese, Spanish, and German.",
        },
        {
          question: "How accurate is it?",
          answer:
            "Clear speech in a quiet recording transcribes well, especially with the Sharper model. Heavy accents, crosstalk, and background music still trip up small on-device models — for a critical transcript, read through and fix the occasional phrase.",
        },
        {
          question: "Why does the first run take longer?",
          answer:
            "The first transcription downloads the model (~40 MB for Fast, ~80 MB for Sharper). It is cached by your browser, so every later visit loads it instantly — even with no network.",
        },
        {
          question: "Can I get subtitles out of it?",
          answer:
            "Yes. Switch the result to the SRT or VTT tab to see the subtitle format, then copy it or download the file — both carry the timestamps needed by video players and editors.",
        },
        {
          question: "Is there a length limit?",
          answer:
            "No fixed limit — the file is processed in 30-second windows on your own machine. Long recordings simply take proportionally longer, and you can stop at any point and keep the partial transcript.",
        },
      ]}
    >
      <AudioTranscriber />
    </ToolPageShell>
  );
}
