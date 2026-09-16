import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { AudioTranscriber } from "@/components/AudioTranscriber";

export const metadata: Metadata = {
  title: "Video to SRT — Generate Subtitle Files in Your Browser",
  description:
    "Turn the speech in a video into an SRT subtitle file with timestamps, or export VTT/TXT instead. Runs locally — no upload, no account, no watermark.",
  alternates: { canonical: "/video-to-srt" },
};

export default function VideoToSrtPage() {
  return (
    <ToolPageShell
      title="Video to SRT"
      description="Generate a timestamped SRT subtitle file from the speech in any common video format."
      note="Transcribed on your device"
      slug="/video-to-srt"
      steps={[
        "Choose a video — MP4, MOV, WebM, or MKV.",
        "Pick the spoken language and a model, then transcribe.",
        "The result opens on the SRT tab — copy it or download the .srt file.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">Subtitles without the upload</h2>
          <p>
            SRT — SubRip — is the subtitle format everything understands: numbered cues, each with a start and
            end timestamp and one or two lines of text. Video editors accept it, YouTube and social platforms
            ingest it, and every player from VLC to your TV can display it. The usual way to get one from a video
            is an auto-caption service that takes the file, processes it on a server, and often watermarks or
            paywalls the result. This page produces the same artifact — a clean, timestamped .srt — from a
            Whisper model running entirely in your browser tab.
          </p>
          <p>
            The audio track is pulled from the video container automatically, transcribed in 30-second windows,
            and each recognized segment becomes a subtitle cue with its start and end time. The result opens
            directly on the SRT tab, so what you see is the file you get — copy it into an editor or download it
            with one click. If the destination is a web page rather than an editor, switch to the VTT tab
            instead: same cues, web-native format.
          </p>
          <h3>Working with the generated SRT</h3>
          <ul>
            <li>
              <strong>Proofread the cues</strong> — small on-device models still mishear names and specialist
              terms, and subtitles are unforgiving. The timestamps are the reliable part; fix text around them.
            </li>
            <li>
              <strong>Long videos are fine</strong> — no length cap — but stop early if you only need a section;
              the partial SRT is already valid.
            </li>
            <li>
              <strong>This produces a sidecar file</strong>, not burned-in captions. Import the .srt alongside
              the video in your editor, or name it to match the video file for players that auto-load subtitles.
            </li>
          </ul>
          <p>
            Need to cut the video down to the section worth subtitling first? The{" "}
            <Link href="/trim-video">video trimmer</Link> does that locally too. The{" "}
            <Link href="/guides/transcribe-audio-to-text">transcription guide</Link> compares SRT and VTT in more
            detail.
          </p>
        </>
      }
      faqs={[
        {
          question: "What is an SRT file?",
          answer:
            "SubRip — the most widely supported subtitle format. It is a plain-text file of numbered cues, each with a start and end timestamp (hour:minute:second,millisecond) followed by the caption text. Editors, players, YouTube, and social platforms all accept it.",
        },
        {
          question: "How accurate are the timestamps?",
          answer:
            "Segment timestamps come from the recognition model and are typically within a fraction of a second of the speech — good enough for subtitles. For frame-perfect caption timing, nudge cues in your editor after import.",
        },
        {
          question: "SRT or VTT — which should I use?",
          answer:
            "SRT for video editors, players, YouTube, and social uploads — it is the universal choice. VTT (WebVTT) for subtitles embedded on a web page via the <track> element. Both are available here from the same transcript.",
        },
        {
          question: "Does it burn the subtitles into the video?",
          answer:
            "No — it produces a separate .srt sidecar file, which is what editors and platforms expect. Burned-in (hardcoded) captions require re-encoding the video, which a separate step would handle in an editor.",
        },
        {
          question: "Is the video uploaded to generate the SRT?",
          answer:
            "No. The audio is extracted and transcribed locally in your browser tab; the subtitle file is assembled on your device. The only network request ever made is the one-time model download.",
        },
      ]}
    >
      <AudioTranscriber initialFormat="srt" />
    </ToolPageShell>
  );
}
