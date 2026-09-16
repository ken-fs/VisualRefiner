import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { AudioTranscriber } from "@/components/AudioTranscriber";

export const metadata: Metadata = {
  title: "MP3 to Text — Transcribe MP3 Audio in Your Browser",
  description:
    "Convert an MP3 recording into text you can copy or download as TXT, SRT, or VTT. Transcription runs locally — no upload, no account, no minute limits.",
  alternates: { canonical: "/mp3-to-text" },
};

export default function Mp3ToTextPage() {
  return (
    <ToolPageShell
      title="MP3 to text"
      description="Turn an MP3 recording — a podcast, interview, or voice note — into searchable, quotable text."
      note="Transcribed on your device"
      slug="/mp3-to-text"
      steps={[
        "Choose an MP3 file.",
        "Pick the spoken language and a model, then transcribe.",
        "Copy the transcript or download it as TXT, SRT, or VTT.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">Why transcribe MP3s locally</h2>
          <p>
            MP3 is the default format for spoken audio: podcast episodes, interview recordings, dictation, old
            voice notes. Most transcription services want you to upload those files to their cloud — fine for a
            public podcast, less fine for an interview under embargo, a therapy-adjacent recording, or anything
            you would rather keep on your own machine. This tool transcribes MP3s with a Whisper model that runs
            inside your browser tab, so the audio never leaves your device and there is no per-minute billing.
          </p>
          <p>
            MP3 is also the friendliest input here: the files are small, decode instantly, and the compression
            artifacts that MP3 introduces barely matter for speech recognition. If you have a choice of formats
            for the same recording, the lossless original (like <Link href="/wav-to-text">WAV</Link>) can squeeze
            out a little more accuracy — but a decent-bitrate MP3 transcribes almost identically.
          </p>
          <h3>Practical notes for common MP3s</h3>
          <ul>
            <li>
              <strong>Podcasts</strong> — clear studio speech is the best case; expect clean output with the fast
              model. Ads read over music may come out rougher.
            </li>
            <li>
              <strong>Interviews</strong> — speakers are not labeled or separated, so plan to attribute lines
              yourself; the timestamps make that quick.
            </li>
            <li>
              <strong>Dictation and voice notes</strong> — short files finish in seconds; select the right
              language first, since a wrong one produces confident nonsense.
            </li>
          </ul>
          <p>
            The transcript appears with timestamps as each 30-second window completes, and you can copy it or
            download it as plain text or subtitle files (SRT/VTT). The{" "}
            <Link href="/guides/transcribe-audio-to-text">transcription guide</Link> explains the format choice
            and what accuracy to expect in more depth.
          </p>
        </>
      }
      faqs={[
        {
          question: "How accurate is MP3 transcription here?",
          answer:
            "Clear speech in a quiet recording transcribes well, especially with the sharper model selected. Heavy accents, crosstalk, background music, and specialist vocabulary still trip up small on-device models — treat the output as a strong first draft for anything critical.",
        },
        {
          question: "Does MP3 compression hurt accuracy?",
          answer:
            "Barely. Speech recognition is robust to MP3 artifacts at normal bitrates (128 kbps and up). A lossless original is marginally better, but re-encoding an MP3 to WAV before transcribing gains nothing.",
        },
        {
          question: "Can it handle a two-hour podcast?",
          answer:
            "Yes — there is no length cap, because processing happens on your device in 30-second windows. Long files just take proportionally longer, and you can stop early and keep the partial transcript.",
        },
        {
          question: "Are different speakers identified?",
          answer:
            "No. Speaker separation requires a much larger model that is impractical in a browser tab today. You get one continuous timestamped text and attribute the speakers yourself.",
        },
        {
          question: "Is my MP3 uploaded to a server?",
          answer:
            "No. The file is decoded and transcribed locally in your browser. The only download is the one-time model file, cached for later visits — after that the tool works offline.",
        },
      ]}
    >
      <AudioTranscriber />
    </ToolPageShell>
  );
}
