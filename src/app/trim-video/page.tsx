import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoTrimmer } from "@/components/VideoTrimmer";

export const metadata: Metadata = {
  title: "Trim a Video Online",
  description: "Cut a video to a start and end point in your browser and export MP4 or WebM. No upload, no watermark — the clip is trimmed in the tab and stays on your device.",
  alternates: { canonical: "/trim-video" },
};

export default function TrimVideoPage() {
  return (
    <ToolPageShell
      title="Video trimmer"
      description="Cut a clip to a start and end point, then export MP4 or WebM."
      note="Uses your browser codecs"
      slug="/trim-video"
      steps={["Choose a video and play to find your points.", "Set the start and end times.", "Trim and download the clip."]}
      explainer={
        <>
          <h2 id="learn-title">Trimming a video locally</h2>
          <p>
            Trimming keeps a slice of a video and drops the rest — cutting dead air off the front, ending on the
            right moment, or pulling one short section out of a longer recording. This tool does it in your
            browser: preview the video, mark a start and end, and export just that range. Nothing is uploaded and
            there is no watermark.
          </p>
          <h3>Setting the points</h3>
          <p>
            Play the video to the frame you want, then use &ldquo;Set start to current frame&rdquo; or &ldquo;Set
            end to current frame&rdquo; to grab that timestamp — or type the seconds directly. The end must come
            after the start.
          </p>
          <h3>Format and compatibility</h3>
          <p>
            Export to MP4 for the widest compatibility, or WebM for a smaller file on a web page you control.
            Trimming re-encodes the clip, so it depends on your browser&apos;s codec support and an unusual track
            can fail — trying the other format sometimes works. To convert the whole file instead of cutting it,
            use the <Link href="/video-converter">video converter</Link>; for a short shareable loop, the{" "}
            <Link href="/video-to-gif">video to GIF</Link> tool.
          </p>
        </>
      }
      faqs={[
        { question: "How do I set the trim points?", answer: "Play the preview to the moment you want and click 'Set start' or 'Set end' to capture that timestamp, or type the start and end in seconds. The clip you export is everything between the two." },
        { question: "Does trimming add a watermark or need an account?", answer: "No. The trim runs entirely in your browser using its own codecs, with no watermark, no account, and no upload." },
        { question: "Does it re-encode the video?", answer: "Yes. Exporting the trimmed range writes a new file, which is a lossy step, so a little detail is re-compressed. Converting once is usually fine for a single trim." },
        { question: "Which format should I export?", answer: "MP4 for sharing and broad compatibility; WebM for a smaller file on a self-hosted web page. If one format fails to export, the other sometimes succeeds." },
        { question: "Is the video uploaded anywhere?", answer: "No. The file is read and trimmed inside your browser tab, so it never leaves your device." },
      ]}
    >
      <VideoTrimmer />
    </ToolPageShell>
  );
}
