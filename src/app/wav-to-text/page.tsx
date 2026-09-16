import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { AudioTranscriber } from "@/components/AudioTranscriber";

export const metadata: Metadata = {
  title: "WAV to Text — Transcribe WAV Audio in Your Browser",
  description:
    "Turn an uncompressed WAV recording into text you can copy or download as TXT, SRT, or VTT. No upload, no size caps — transcription runs on your device.",
  alternates: { canonical: "/wav-to-text" },
};

export default function WavToTextPage() {
  return (
    <ToolPageShell
      title="WAV to text"
      description="Transcribe an uncompressed WAV recording — interviews, field audio, studio takes — into text."
      note="Transcribed on your device"
      slug="/wav-to-text"
      steps={[
        "Choose a WAV file — any sample rate or bit depth.",
        "Pick the spoken language and a model, then transcribe.",
        "Copy the transcript or download it as TXT, SRT, or VTT.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">WAV is the best input — and the one cloud tools punish</h2>
          <p>
            WAV files are the raw, uncompressed originals: field recordings, interview captures from a dedicated
            recorder, studio exports, audio ripped from video. They are also huge — ten times the size of the
            same recording as MP3. Online transcribers punish that with upload waits and file-size caps, which is
            absurd when you think about it: the audio has to travel before any work begins. Local transcription
            inverts that. The file is decoded straight from your disk in your browser tab, so a 500 MB WAV costs
            you nothing in transfer — processing starts immediately.
          </p>
          <p>
            Uncompressed input is also the best case for accuracy. Whatever the sample rate or bit depth of your
            WAV, it is resampled to the 16 kHz mono signal the Whisper model expects — and starting from a
            lossless source means that conversion loses nothing along the way. If you record with transcription
            in mind, a decent mic saved as WAV beats everything downstream.
          </p>
          <h3>Worth knowing</h3>
          <ul>
            <li>
              <strong>Any WAV variant works</strong> — 16/24/32-bit, 44.1/48/96 kHz, mono or stereo; the decode
              and resample handle it.
            </li>
            <li>
              <strong>Big files are normal here</strong> — there is no upload and no cap; a long field recording
              simply takes proportionally longer, and partial text appears as it goes.
            </li>
            <li>
              <strong>Lossy copies are fine too</strong> — if all you have is an{" "}
              <Link href="/mp3-to-text">MP3</Link>, transcribe it directly; converting it to WAV first adds
              nothing.
            </li>
          </ul>
          <p>
            Output is a timestamped transcript you can copy instantly or download as TXT, SRT, or VTT. The{" "}
            <Link href="/guides/transcribe-audio-to-text">transcription guide</Link> covers model choice and
            accuracy expectations.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is there a file-size limit for WAV files?",
          answer:
            "No. Because the audio never leaves your device, there is no upload cap to hit. Very large files are decoded and processed locally in 30-second windows — the only cost is your device's processing time.",
        },
        {
          question: "Does a high sample rate (96 kHz) improve the transcript?",
          answer:
            "Not directly — the model listens at 16 kHz regardless, so everything is resampled to that. The real advantage of a WAV original is the absence of compression artifacts, not the sample rate itself.",
        },
        {
          question: "Should I convert MP3s to WAV before transcribing?",
          answer:
            "No. Converting a lossy file to WAV cannot recover what the compression discarded, so it gains nothing. Transcribe the MP3 directly; reach for WAV only when it is the original recording.",
        },
        {
          question: "Is the recording uploaded anywhere?",
          answer:
            "No. The WAV is decoded and transcribed inside your browser tab by a locally running model. The only network request is the one-time model download, after which the tool works offline.",
        },
        {
          question: "How long will a big WAV take?",
          answer:
            "On a recent laptop the fast model runs several times quicker than real-time, so an hour of audio takes a few minutes. Older hardware runs closer to real-time. Text appears window-by-window, so you can start reading right away.",
        },
      ]}
    >
      <AudioTranscriber />
    </ToolPageShell>
  );
}
