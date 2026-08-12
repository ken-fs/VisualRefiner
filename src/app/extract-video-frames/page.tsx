import type { Metadata } from "next";
import Link from "next/link";
import { FrameExtractor } from "@/components/FrameExtractor";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = { title: "Extract Video Frames", description: "Pull evenly spaced still frames from a video and save them as lossless PNG images in your browser. No upload — the clip stays on your device.", alternates: { canonical: "/extract-video-frames" } };

export default function ExtractFramesPage() {
  return (
    <ToolPageShell
      title="Extract video frames"
      description="Turn a video into a clean contact sheet."
      note="Frames stay on your device"
      slug="/extract-video-frames"
      steps={["Choose a supported video.", "Select the number of frames.", "Extract and download each PNG."]}
      explainer={
        <>
          <h2 id="learn-title">Turning a clip into still images</h2>
          <p>
            A video is just a fast run of still pictures. This tool stops on a handful of those moments and
            hands them back as separate image files — useful for a thumbnail, a poster frame, a still to drop
            into a document, or a contact sheet that shows what happens across a clip at a glance. Instead of
            scrubbing the timeline and screenshotting, you pick a count and get clean captures in one pass.
          </p>
          <p>
            The frames are decoded from the video in this browser tab and never uploaded, so the clip stays on
            your device and the tool works offline. Each capture is scaled to a sensible preview width and
            saved individually, so you can keep only the ones you want.
          </p>

          <h3>Why the frames are saved as PNG</h3>
          <p>
            PNG is lossless, so a saved frame holds the exact pixels captured at that instant — no extra
            compression blur layered on top of whatever the video already had. That matters for a still you
            plan to crop, zoom into, or read text from. A JPG copy would be smaller but would soften edges
            slightly every time it is re-saved. If size is the priority once you have the stills you need, run
            a PNG through the <Link href="/image-compressor">image compressor</Link> or convert it with the{" "}
            <Link href="/image-converter">image converter</Link>.
          </p>

          <h3>How many frames to pull</h3>
          <p>
            Captures are spaced evenly from the start of the clip to the end, so a higher count simply spreads
            more moments across the same duration. A few frames give you a quick overview; more frames catch
            finer changes in a busy scene.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>You want</th><th>Frame count</th><th>Result</th></tr>
            </thead>
            <tbody>
              <tr><th>A single thumbnail or poster</th><td>Fewer</td><td>Quick pick of a representative shot</td></tr>
              <tr><th>An overview of the whole clip</th><td>Middle</td><td>Balanced contact sheet</td></tr>
              <tr><th>To catch fast action or fine changes</th><td>More</td><td>Tighter spacing between moments</td></tr>
            </tbody>
          </table>

          <p>
            If you want motion rather than stills, the same clip can become a short loop with{" "}
            <Link href="/video-to-gif">video to GIF</Link>, or you can change its format with the{" "}
            <Link href="/video-converter">video converter</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "What format are the extracted frames?", answer: "Frames are saved as PNG images, which are lossless and keep the exact pixels from the video at each captured moment." },
        { question: "Why PNG rather than JPG?", answer: "PNG is lossless, so a captured still is not softened by extra compression. That keeps edges and any text crisp if you crop or zoom in. If you need a smaller file afterward, compress or convert the PNG separately." },
        { question: "How are the frames chosen?", answer: "The tool captures evenly spaced frames from the start of the clip to the end, so a higher count gives you more moments spread through the video." },
        { question: "How many frames should I pick?", answer: "A few frames are enough for a thumbnail or quick overview. Choose more when a scene changes fast and you want tighter spacing between the captured moments." },
        { question: "Can I grab one exact frame?", answer: "The tool captures a set of evenly spaced frames rather than a single chosen timestamp. Pick a higher count to land close to the moment you want, then keep just that PNG." },
        { question: "Are frames processed on a server?", answer: "No. The video is read and frames are captured in your browser, so nothing is uploaded and the clip stays on your device." },
      ]}
    >
      <FrameExtractor />
    </ToolPageShell>
  );
}
