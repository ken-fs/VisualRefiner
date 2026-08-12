import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "MOV to MP4 Converter",
  description: "Convert a QuickTime MOV to MP4 right in your browser. No upload, no account, no queue — the video stays on your device.",
  alternates: { canonical: "/mov-to-mp4" },
};

export default function MovToMp4Page() {
  return (
    <ToolPageShell
      title="MOV to MP4"
      description="Turn a QuickTime MOV into a widely supported MP4."
      note="Uses your browser codecs"
      slug="/mov-to-mp4"
      steps={["Choose a MOV video.", "Keep MP4 as the output.", "Convert and download the MP4."]}
      explainer={
        <>
          <h2 id="learn-title">MOV and MP4, briefly</h2>
          <p>
            MOV is Apple&apos;s QuickTime format — the container your Mac, iPhone, and iPad reach for when
            they record or export video. MP4 is the format almost everything else expects. The two are
            close cousins: MP4 actually grew out of the QuickTime file format, so what is inside is often
            nearly identical. The real difference is reach. A MOV plays flawlessly across Apple&apos;s apps
            but can stall or get rejected once it leaves that world, while MP4 is the format editors, phones,
            TVs, and upload forms treat as the default.
          </p>
          <p>
            It helps to separate the <strong>container</strong> from the <strong>codec</strong>. The
            container (MOV or MP4) is the wrapper that holds the video and audio tracks together. The codec
            (like H.264 or HEVC) is how those tracks are actually compressed. A recent iPhone often records
            MOV using HEVC, which is efficient but not universally supported. Converting to MP4 puts the
            video in a wrapper that far more software recognises, and re-encodes the tracks so the whole file
            plays cleanly.
          </p>
          <p>
            When you choose a file here, it is decoded and re-encoded inside this browser tab using the
            codecs your browser already ships with. Nothing is uploaded, so the tool works without an account
            and your footage stays on your device. It processes one video at a time.
          </p>

          <h3>When you actually need to convert</h3>
          <ul>
            <li>
              <strong>Uploading somewhere that balks at MOV</strong> — some forms, ad platforms, and older
              sites only accept MP4. MP4 sidesteps that.
            </li>
            <li>
              <strong>Sharing with Windows or Android users</strong> — a MOV, especially an HEVC one, may
              not open without extra codecs. MP4 with H.264 is the safest bet.
            </li>
            <li>
              <strong>Importing into an editor</strong> that chokes on QuickTime files but happily reads MP4.
            </li>
          </ul>
          <p>
            If you would rather keep the file open and web-friendly instead, the{" "}
            <Link href="/video-converter">video converter</Link> can also output WebM. Going the other way,{" "}
            <Link href="/webm-to-mp4">WebM to MP4</Link> and <Link href="/mkv-to-mp4">MKV to MP4</Link>{" "}
            handle the two other containers people most often need to convert.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Origin</th><th>Plays everywhere?</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>MOV</th><td>Apple QuickTime</td><td>Best inside Apple apps</td><td>Recording and editing on Mac and iPhone</td></tr>
              <tr><th>MP4</th><td>Open standard (from QuickTime)</td><td>Yes, broadest support</td><td>Sharing, uploading, playback anywhere</td></tr>
              <tr><th>WebM</th><td>Open web format</td><td>Great in browsers</td><td>Embedding video on the web</td></tr>
            </tbody>
          </table>

          <p>
            Re-encoding is a lossy step, so the MP4 is not a bit-for-bit copy of the MOV. At normal quality
            the difference is hard to spot on a single pass — what you want to avoid is converting the same
            clip back and forth repeatedly. To understand the MP4 versus WebM trade-off before you pick an
            output, the <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link> lays it out.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert MOV to MP4?", answer: "MOV is Apple's QuickTime format and does not always play smoothly outside Apple devices. MP4 plays almost everywhere and is accepted by more upload forms, so it is the safer choice for sharing." },
        { question: "Does converting reduce quality?", answer: "The tool re-encodes the video, so it is a lossy step rather than a straight copy. At normal settings the difference is hard to notice on a single conversion; converting the same clip repeatedly is what visibly degrades it." },
        { question: "Is my video uploaded?", answer: "No. The MOV is decoded and re-encoded inside your browser tab, so it is never sent to a server and the tool needs no account." },
        { question: "Why won't my MOV play on Windows or Android?", answer: "Many MOV files from recent iPhones use HEVC compression, which those systems may not decode without extra codecs. Converting to an MP4 removes that dependency for most players." },
        { question: "Why does the conversion take a while?", answer: "Re-encoding happens in the tab using your browser's codecs, so the time depends on your device and the length and resolution of the clip. Longer, higher-resolution videos take longer." },
        { question: "Can I convert several MOV files at once?", answer: "The tool handles one video at a time. Convert the first, then load the next — each one stays on your device." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
