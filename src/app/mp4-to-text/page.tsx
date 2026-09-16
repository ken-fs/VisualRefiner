import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { AudioTranscriber } from "@/components/AudioTranscriber";

export const metadata: Metadata = {
  title: "MP4 to Text — Transcribe MP4 Video in Your Browser",
  description:
    "Turn the speech in an MP4 video into text you can copy or download as TXT, SRT, or VTT. Runs locally in your browser — no upload, no account, no limits.",
  alternates: { canonical: "/mp4-to-text" },
};

export default function Mp4ToTextPage() {
  return (
    <ToolPageShell
      title="MP4 to text"
      description="Extract the spoken words from an MP4 video as text, ready to copy or export as subtitles."
      note="Transcribed on your device"
      slug="/mp4-to-text"
      steps={[
        "Choose an MP4 video — the audio track is extracted automatically.",
        "Pick the spoken language and a model, then transcribe.",
        "Read the transcript as it appears, then copy it or download TXT, SRT, or VTT.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">Getting text out of an MP4</h2>
          <p>
            MP4 is where spoken content accumulates: meeting recordings, lecture captures, interviews, screen
            recordings, downloaded webinars. Watching them back at 1x to take notes is the slow way — a transcript
            is searchable, skimmable, and quotable. This tool reads the audio track straight out of the MP4
            container (no separate conversion to MP3 needed) and transcribes it with an open Whisper model that
            runs entirely in your browser tab.
          </p>
          <p>
            Because nothing is uploaded, there is no file-size cap and no queue: a two-hour meeting recording is
            limited only by your device, not by a free tier. The first transcription downloads a small model
            (~40 MB) that is cached for every later visit — after that, the tool even works offline. Speed comes
            from your hardware: a recent laptop processes several times faster than real-time, so a one-hour
            video takes a few minutes, with text appearing window-by-window as it is recognized.
          </p>
          <h3>What you get out</h3>
          <ul>
            <li>
              <strong>A timestamped transcript</strong> you can read while the rest is still processing — stop
              early and keep the partial text.
            </li>
            <li>
              <strong>Three export shapes</strong> — TXT for notes and documents, SRT for video editors, VTT for
              embedding subtitles on the web. Switching between them is instant.
            </li>
            <li>
              <strong>One-click copy</strong> of the whole transcript in whichever format you have open.
            </li>
          </ul>
          <p>
            For the best result, pick the spoken language before starting and use the sharper model on noisy
            recordings. If you only need part of the video, trim it first with the{" "}
            <Link href="/trim-video">video trimmer</Link> — less audio means a faster, cleaner transcript. The{" "}
            <Link href="/guides/transcribe-audio-to-text">transcription guide</Link> covers accuracy expectations
            in more detail.
          </p>
        </>
      }
      faqs={[
        {
          question: "Do I need to convert the MP4 to MP3 first?",
          answer:
            "No. The audio track is extracted from the MP4 container directly in your browser, then transcribed. Dropping in the video file itself is the intended workflow.",
        },
        {
          question: "Is there a length or file-size limit?",
          answer:
            "No fixed limit — the video is processed in 30-second windows on your own machine, so long recordings simply take proportionally longer. You can stop at any point and keep the transcript produced so far.",
        },
        {
          question: "Can I get subtitles from my MP4?",
          answer:
            "Yes. After transcribing, switch the result to the SRT or VTT tab and copy or download the file — the timestamps are included, ready for editors and players. See the video to SRT page for the subtitle-focused workflow.",
        },
        {
          question: "Is the video uploaded anywhere?",
          answer:
            "No. The audio is extracted and transcribed inside your browser tab using a locally running model. The only network request ever made is the one-time model download.",
        },
        {
          question: "What about MP4s with music or multiple speakers?",
          answer:
            "Background music and crosstalk reduce accuracy for any small on-device model — use the sharper model and expect to proofread. Speakers are not separated or labeled; the transcript is one continuous text.",
        },
      ]}
    >
      <AudioTranscriber />
    </ToolPageShell>
  );
}
