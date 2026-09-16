import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/transcribe-audio-to-text")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function TranscribeAudioToTextGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        {
          question: "Is on-device transcription really private?",
          answer:
            "Yes. The speech model runs inside your browser tab, so the audio is processed on your own machine and never sent to a server. The only network traffic is the one-time model download; after that the tool works offline, which you can verify by disconnecting and transcribing again.",
        },
        {
          question: "How long does transcription take?",
          answer:
            "It scales with your device rather than a server queue. On a recent laptop the fast model runs several times quicker than real-time, so an hour of audio takes a few minutes. On older hardware expect closer to real-time. Text appears as each 30-second window finishes, so you can start reading immediately.",
        },
        {
          question: "Why is there a download before the first transcription?",
          answer:
            "The transcription model has to live somewhere — instead of running on a company's server, it runs in your browser, so the model file (~40 MB for the fast option, ~80 MB for the sharper one) is downloaded once and cached. Every later visit skips the download entirely.",
        },
        {
          question: "Can it transcribe a video file?",
          answer:
            "Yes. For MP4, MOV, WebM, and MKV files the audio track is extracted in the browser and then transcribed — there is no need to convert the video to MP3 first. Links to videos hosted online (like YouTube) are not supported, because fetching them would require a server.",
        },
        {
          question: "What is the difference between SRT and VTT?",
          answer:
            "Both are timestamped subtitle formats. SRT is the older, simplest one — numbered cues with comma-separated milliseconds — and is accepted by virtually every video player and editor. WebVTT is the web-native successor with dot-separated milliseconds and optional styling. When in doubt, pick SRT for editing software and VTT for embedding on a web page.",
        },
        {
          question: "Can it tell different speakers apart?",
          answer:
            "No. Speaker separation (diarization) needs a second, much larger model that is impractical to run in a browser tab today. The transcript is a single continuous text with timestamps — for a two-person interview you will need to attribute the lines yourself.",
        },
      ]}
    >
      <p>
        There are two ways to turn speech into text. The common one uploads your recording to a server, runs a
        large model there, and often charges per minute — convenient, but your audio leaves your device. The other
        way runs a smaller speech model <em>inside your browser</em>: the file is decoded and transcribed on your
        own machine, nothing is uploaded, and there are no minute limits. The{" "}
        <Link href="/audio-to-text">audio transcriber</Link> on this site works the second way. This guide explains
        what that means for accuracy, speed, and the format you get out.
      </p>

      <h2>How on-device transcription works</h2>
      <p>
        The engine is Whisper, an open speech-recognition model family, compiled to run in a browser tab. The
        first time you transcribe, the model file is downloaded and cached by the browser — about 40 MB for the
        fast variant, 80 MB for the sharper one. From then on it loads instantly, even offline. Your audio is
        decoded to the 16 kHz mono signal the model expects (for video files, the audio track is extracted first),
        then processed in 30-second windows, which is why text starts appearing long before the file finishes.
      </p>
      <p>
        When a graphics processor is available the model uses it (via WebGPU); otherwise it falls back to the CPU.
        That is why the same tool feels instant on one machine and leisurely on another — speed comes from your
        hardware, not from a server farm.
      </p>

      <h2>What accuracy to expect</h2>
      <p>
        Small in-browser models trade some accuracy for privacy and zero cost. In practice:
      </p>
      <ul>
        <li>
          <strong>Clear speech</strong> — podcasts, voice memos, lectures, calls with a decent mic — transcribes
          well, especially with the sharper model and the correct language selected.
        </li>
        <li>
          <strong>Noisy audio, crosstalk, heavy accents, and music</strong> still trip up small models. Expect to
          proofread names, numbers, and specialist terms.
        </li>
        <li>
          <strong>Language is chosen, not auto-detected.</strong> Pick the spoken language before you start; the
          wrong setting produces confident-sounding nonsense.
        </li>
      </ul>
      <p>
        If a transcript is for publication or legal use, treat the output as a strong first draft and read it
        through once. For notes, search, and subtitles you will fix anyway, it is usually good enough as-is.
      </p>

      <h2>TXT, SRT, or VTT?</h2>
      <p>
        The transcript is the same data in three shapes:
      </p>
      <ul>
        <li>
          <strong>TXT</strong> is plain flowing text — for notes, articles, show summaries, or pasting into a
          document.
        </li>
        <li>
          <strong>SRT</strong> (SubRip) is the classic subtitle file: numbered cues with timestamps like{" "}
          <code>00:01:02,500 --&gt; 00:01:05,000</code>. Every video editor and player accepts it.
        </li>
        <li>
          <strong>VTT</strong> (WebVTT) is the web-native version of the same idea — dot milliseconds and optional
          styling — and the format <code>&lt;track&gt;</code> elements on web pages expect.
        </li>
      </ul>
      <p>
        Rule of thumb: TXT to read, SRT for editing software, VTT for embedding on the web. You can switch between
        them after transcribing — the conversion is instant because only the formatting changes.
      </p>

      <h2>Getting the best result</h2>
      <ul>
        <li>Select the correct spoken language before starting.</li>
        <li>Use the sharper model for anything noisy or accented; the fast one for clear speech.</li>
        <li>Trim dead air and off-topic sections first — the <Link href="/trim-video">video trimmer</Link> does this locally too.</li>
        <li>For long recordings, let it run and watch the partial text; you can stop early and keep what is done.</li>
      </ul>
      <p>
        Ready when you are: open the <Link href="/audio-to-text">audio transcriber</Link>, drop in a file, and
        watch the text appear — without anything leaving your device.
      </p>
    </GuideShell>
  );
}
