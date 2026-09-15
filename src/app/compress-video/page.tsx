import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoCompressor } from "@/components/VideoCompressor";

export const metadata: Metadata = {
  title: "Video Compressor",
  description: "Compress a video in your browser — shrink file size by lowering resolution and quality. No upload, no account — the file stays on your device.",
  alternates: { canonical: "/compress-video" },
};

export default function CompressVideoPage() {
  return (
    <ToolPageShell
      title="Video compressor"
      description="Make a video smaller without sending it anywhere."
      note="No upload required"
      slug="/compress-video"
      steps={["Choose a video from your device.", "Pick a target resolution and quality.", "Compare the size and download the result."]}
      explainer={
        <>
          <h2 id="learn-title">Where video size actually comes from</h2>
          <p>
            A video&apos;s size is mostly decided by three things: how many pixels each frame has
            (resolution), how much data each second of video is allowed (bitrate), and how long the clip
            runs. Trimming helps with the last one — this tool attacks the first two. Dropping from 1080p
            to 720p removes more than half the pixels per frame, and stepping the quality down tells the
            encoder to spend fewer bits preserving fine detail. Together they routinely cut a phone video
            to a third of its original size.
          </p>
          <p>
            Everything happens in your browser with your device&apos;s own video codecs (WebCodecs, via
            MediaBunny). The file is decoded, scaled, and re-encoded inside this tab — nothing is uploaded,
            so it works offline and the video never leaves your device.
          </p>

          <h3>Resolution or quality — which to lower first?</h3>
          <p>
            Lower <strong>resolution</strong> when the video will be watched on a small screen or sent
            through a chat app — 720p is plenty for a phone screen and message uploads. Keep the resolution
            and lower <strong>quality</strong> instead when the video will be viewed full-screen and detail
            matters. If you just need the smallest possible file for an email attachment, drop both.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Setting</th><th>File size</th><th>Looks</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>720p · Medium</th><td>Much smaller</td><td>Clean on phones</td><td>Sharing, chat, social</td></tr>
              <tr><th>1080p · High</th><td>Smaller</td><td>Close to original</td><td>Full-screen viewing</td></tr>
              <tr><th>480p · Low</th><td>Smallest</td><td>Visibly softer</td><td>Strict size limits</td></tr>
            </tbody>
          </table>

          <h3>Good to know</h3>
          <p>
            The output is always an MP4, since that plays everywhere the compressed file is likely to go.
            Already-compressed videos (most downloads and screen recordings) shrink less than raw phone
            footage. If the result is not smaller at your settings, try a lower resolution or quality — the
            result panel shows the exact before-and-after sizes. To shorten the clip instead, use the{" "}
            <Link href="/trim-video">video trimmer</Link>, and to change only the container, the{" "}
            <Link href="/video-converter">video converter</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "How much smaller will my video get?", answer: "It depends on the source. Raw phone footage often shrinks by 50–80% at 720p medium quality. Videos that are already heavily compressed shrink less — the result panel always shows the exact before-and-after sizes." },
        { question: "Does compressing keep the sound?", answer: "Yes. The audio track is carried over into the compressed MP4; only the picture is scaled down and re-encoded at the chosen quality." },
        { question: "What format is the compressed file?", answer: "Always MP4, because it plays on essentially every phone, computer, TV, and chat app the video might be sent to." },
        { question: "Is my video uploaded anywhere?", answer: "No. Decoding, scaling, and re-encoding all happen inside this browser tab. The file never leaves your device and the tool works offline." },
        { question: "Why is my compressed video not smaller?", answer: "Some files — especially downloads and screen recordings — are already compressed hard. If the size barely moves, lower the resolution one step or drop the quality setting." },
        { question: "Is there a file size limit?", answer: "There is no hard limit, but the whole video is processed in the tab, so very long or large files take a while and depend on your device's speed." },
      ]}
    >
      <VideoCompressor />
    </ToolPageShell>
  );
}
