import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "WebM to MP4 Converter",
  description: "Convert a WebM video to MP4 locally in your browser. No upload, no account — the file is re-encoded in the tab and stays on your device.",
  alternates: { canonical: "/webm-to-mp4" },
};

export default function WebmToMp4Page() {
  return (
    <ToolPageShell
      title="WebM to MP4"
      description="Turn a WebM file into a widely supported MP4."
      note="Uses your browser codecs"
      slug="/webm-to-mp4"
      steps={["Choose a WebM video.", "Keep MP4 as the output.", "Convert and download the MP4."]}
      explainer={
        <>
          <h2 id="learn-title">WebM and MP4, briefly</h2>
          <p>
            WebM is an open, royalty-free format built for the web. It is what a lot of browser-based tools,
            screen recorders, and download buttons hand you, and it plays beautifully inside modern browsers.
            The trouble starts the moment the file needs to go anywhere else. Plenty of video editors,
            phones&apos; built-in players, and messaging apps still will not accept a WebM — they expect MP4.
            When you need a file that just opens, uploads, or drops into a timeline without a fuss, MP4 is the
            safe interchange format.
          </p>
          <p>
            The reason comes down to <strong>container</strong> and <strong>codec</strong>. The container
            (WebM or MP4) is the wrapper around the tracks. The codec is how the video and audio inside are
            compressed. WebM typically uses VP8, VP9, or AV1 video with Opus or Vorbis audio — open codecs
            that browsers love but that some consumer apps and hardware never learned to read. MP4 usually
            carries H.264 video with AAC audio, the combination that decades of software and devices treat as
            the default. Converting repackages the video into MP4 and re-encodes it to that widely supported
            pairing.
          </p>
          <p>
            The whole conversion runs in this browser tab. Your WebM is decoded and re-encoded locally with
            the codecs your browser already includes, so nothing is uploaded, no account is needed, and the
            file stays on your device. It processes one video at a time.
          </p>

          <h3>When MP4 is the right call — and when it isn&apos;t</h3>
          <ul>
            <li>
              <strong>Editing or posting to social apps</strong> — timelines and phone apps that reject WebM
              almost always take MP4, so convert before you import or upload.
            </li>
            <li>
              <strong>Sending to someone on any device</strong> — MP4 is the format least likely to make them
              hunt for a player.
            </li>
            <li>
              <strong>Embedding on your own site</strong> — here WebM can be the better choice, since it often
              produces a smaller file at similar quality for browser playback. In that case you may not need
              to convert at all.
            </li>
          </ul>
          <p>
            The <Link href="/video-converter">video converter</Link> can output either format if you want to
            go the other direction, and <Link href="/mov-to-mp4">MOV to MP4</Link> and{" "}
            <Link href="/mkv-to-mp4">MKV to MP4</Link> cover the other containers people convert most. If you
            only need a short animated clip rather than a full video, <Link href="/video-to-gif">video to
            GIF</Link> or <Link href="/extract-video-frames">extract video frames</Link> may be closer to
            what you want.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Typical codecs</th><th>Support outside the browser</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>WebM</th><td>VP8 / VP9 / AV1, Opus</td><td>Limited — some apps refuse it</td><td>Embedding and playing video on the web</td></tr>
              <tr><th>MP4</th><td>H.264, AAC</td><td>Broad — plays and uploads almost anywhere</td><td>Sharing, editing, uploading</td></tr>
              <tr><th>MOV</th><td>H.264 / HEVC</td><td>Best inside Apple apps</td><td>Recording and editing on Apple devices</td></tr>
            </tbody>
          </table>

          <p>
            Re-encoding is a lossy step, so the MP4 is not an exact copy of the WebM, though a single pass at
            normal quality usually looks close to the original. Because WebM is often already efficiently
            compressed, the MP4 can come out a little larger. To weigh the two formats before you decide, the{" "}
            <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link> walks through the differences.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert WebM to MP4?", answer: "WebM is made for the web and plays well in browsers, but many editors, phone players, and messaging apps only accept MP4. Converting makes the video open and upload in far more places." },
        { question: "Will I lose quality converting WebM to MP4?", answer: "The video is re-encoded, so it is a lossy step rather than a straight copy. A single conversion at normal quality usually looks close to the original; repeated conversions are what visibly degrade it." },
        { question: "Why is my MP4 larger than the WebM?", answer: "WebM's codecs are often very efficient, so re-encoding to the more widely supported H.264 used in MP4 can produce a somewhat larger file at similar visible quality. That is the trade-off for broader compatibility." },
        { question: "Is my video sent to a server?", answer: "No. Conversion runs in your browser using the codecs it already includes, so the WebM never leaves your device and no account is required." },
        { question: "Why does the conversion take a while?", answer: "Re-encoding happens in the tab, so the time depends on your device and the length and resolution of the clip. Longer, higher-resolution videos take longer to process." },
        { question: "Can I convert more than one WebM at a time?", answer: "The tool works on one video at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
