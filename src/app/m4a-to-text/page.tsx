import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { AudioTranscriber } from "@/components/AudioTranscriber";

export const metadata: Metadata = {
  title: "M4A to Text — Transcribe Voice Memos & M4A Audio Locally",
  description:
    "Turn iPhone Voice Memos and other M4A recordings into text you can copy or download as TXT, SRT, or VTT. No upload — transcription runs in your browser.",
  alternates: { canonical: "/m4a-to-text" },
};

export default function M4aToTextPage() {
  return (
    <ToolPageShell
      title="M4A to text"
      description="Transcribe M4A recordings — iPhone Voice Memos, interviews, meeting captures — into text."
      note="Transcribed on your device"
      slug="/m4a-to-text"
      steps={[
        "Choose an M4A file — for example a Voice Memo shared from your phone.",
        "Pick the spoken language and a model, then transcribe.",
        "Copy the transcript or download it as TXT, SRT, or VTT.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">The Voice Memo format</h2>
          <p>
            If you record on an iPhone, you have M4A files: Voice Memos saves everything in that container, and
            so do many Android recorders, WhatsApp voice exports, and meeting apps. M4A is AAC audio in an MP4
            wrapper — small files, decent quality, and precisely the kind of personal recording people hesitate
            to upload to a random transcription site. This tool decodes M4A directly in your browser tab and
            transcribes it with a local Whisper model, so the recording stays on your device end to end.
          </p>
          <p>
            The workflow from an iPhone: in Voice Memos, share the recording and save it to Files (or AirDrop it
            to your computer), then drop the M4A onto this page. Phone recordings are usually single-speaker,
            close-mic speech — near-ideal input, so the fast model handles them well and short memos finish in
            seconds.
          </p>
          <h3>Getting clean results from phone recordings</h3>
          <ul>
            <li>
              <strong>Set the language first</strong> — the model transcribes what you tell it to hear, and a
              wrong language setting produces confident nonsense.
            </li>
            <li>
              <strong>Memos recorded in pockets, cars, and cafés</strong> carry noise — switch to the sharper
              model and expect to fix a few phrases.
            </li>
            <li>
              <strong>Long interviews</strong> are fine — no length cap — but speakers are not labeled, so the
              timestamps in the output are your friend when attributing lines.
            </li>
          </ul>
          <p>
            The transcript can be copied in one click or downloaded as TXT, SRT, or VTT with timestamps. More on
            formats and accuracy in the{" "}
            <Link href="/guides/transcribe-audio-to-text">transcription guide</Link>.
          </p>
        </>
      }
      faqs={[
        {
          question: "How do I get a Voice Memo onto this page?",
          answer:
            "In the Voice Memos app, tap the recording, use Share, and save it to Files or AirDrop it to your computer — that produces an M4A file you can drop here. No conversion step is needed.",
        },
        {
          question: "Can I use this on my phone directly?",
          answer:
            "Yes, the page works in a mobile browser and the file picker can reach your Files app. For long recordings a laptop is more comfortable — the speed comes from your own hardware either way.",
        },
        {
          question: "Does it work with WhatsApp or meeting-app audio?",
          answer:
            "If you can export the audio as a file — M4A, MP3, OGG, or a video — you can transcribe it here. Recordings locked inside an app need to be exported first, which the app's share function usually provides.",
        },
        {
          question: "Is my recording sent to a server?",
          answer:
            "No. The M4A is decoded and transcribed inside your browser tab. The only network request is the one-time download of the speech model, which is then cached for offline use.",
        },
        {
          question: "What languages can it transcribe?",
          answer:
            "The models are multilingual Whisper variants covering 90+ languages. Select the spoken language before transcribing — English, Chinese, Spanish, and other well-represented languages give the strongest results.",
        },
      ]}
    >
      <AudioTranscriber />
    </ToolPageShell>
  );
}
