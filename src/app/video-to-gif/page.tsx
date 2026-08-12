import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoToGif } from "@/components/VideoToGif";

export const metadata: Metadata = { title: "Video to GIF Converter", description: "Turn the first few seconds of a short video into a silent looping GIF in your browser. No upload — the clip stays on your device.", alternates: { canonical: "/video-to-gif" } };

export default function VideoToGifPage() {
  return (
    <ToolPageShell
      title="Video to GIF"
      description="Make a short loop from the first six seconds."
      note="Built inside this tab"
      slug="/video-to-gif"
      steps={["Choose a short supported video.", "Pick the width and frame rate.", "Create and download the GIF."]}
      explainer={
        <>
          <h2 id="learn-title">Making a short loop from a clip</h2>
          <p>
            A GIF is a silent, looping animation that plays on its own anywhere an image can — chat threads,
            docs, issue trackers, forums. This tool takes the opening of a short video and rebuilds it as that
            kind of loop entirely in your browser tab. The clip is decoded locally, so nothing is uploaded and
            the tool works offline. GIFs carry no sound, so the loop is silent by design.
          </p>
          <p>
            It uses the first few seconds of the video rather than the whole thing. That is deliberate: GIF
            file size climbs fast with length, and a tight loop is what most people actually want to paste
            somewhere. Pick a width and a frame rate, and the tool samples that many frames per second across
            the opening and stitches them into a repeating GIF.
          </p>

          <h3>Why GIFs get big, and how the controls help</h3>
          <p>
            GIF is an old format. It stores frames without the efficient motion compression a real video codec
            uses, and each frame is limited to a 256-color palette. That combination makes even a few seconds
            of footage far larger than the equivalent video clip. The two controls are your levers on that
            size: <strong>width</strong> sets how many pixels each frame holds, and <strong>frame rate</strong>{" "}
            sets how many frames per second are stored. Smaller width and lower frame rate mean a smaller,
            choppier GIF; larger and faster mean a smoother but heavier one.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Control</th><th>Lower / smaller</th><th>Higher / larger</th></tr>
            </thead>
            <tbody>
              <tr><th>Width</th><td>Smaller file, less detail</td><td>Sharper frames, bigger file</td></tr>
              <tr><th>Frame rate</th><td>Smaller file, choppier motion</td><td>Smoother motion, bigger file</td></tr>
              <tr><th>Length</th><td>Kept short on purpose</td><td>Would balloon the file</td></tr>
            </tbody>
          </table>

          <h3>When a GIF is the wrong choice</h3>
          <p>
            If you need sound, smooth full-motion, or a longer clip, a real video beats a GIF on both quality
            and size — keep it as MP4 or WebM with the <Link href="/video-converter">video converter</Link>.
            The <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link> covers those trade-offs. And if you
            only need a still image out of the clip rather than motion, pull one with{" "}
            <Link href="/extract-video-frames">extract video frames</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "Why only the first six seconds?", answer: "GIF file size grows quickly with length, so the tool focuses on the opening seconds to keep the loop small and shareable rather than producing a huge file." },
        { question: "What width and frame rate should I pick?", answer: "A smaller width and a lower frame rate produce a smaller GIF. Start at 480 px and 8 fps, then raise them if the loop needs to be sharper or smoother, watching how the size grows." },
        { question: "Does the GIF have sound?", answer: "No. The GIF format cannot store audio, so the loop is always silent. If you need sound, keep the clip as a video instead of converting it to a GIF." },
        { question: "Why does my GIF look grainy or banded?", answer: "GIF limits each frame to 256 colors, so smooth gradients and detailed footage can show banding. That is a limitation of the format itself, not the conversion." },
        { question: "GIF or video for sharing?", answer: "GIFs are handy where only an image will embed and the clip is short. For longer, smoother, or higher-quality footage, an MP4 or WebM is smaller and looks better, so convert to video instead." },
        { question: "Is the video uploaded to make the GIF?", answer: "No. The GIF is built in your browser from the local video, so the file never leaves your device and the tool works offline." },
      ]}
    >
      <VideoToGif />
    </ToolPageShell>
  );
}
