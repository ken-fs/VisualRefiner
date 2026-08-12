import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Resizer",
  description: "Resize an image to new pixel dimensions in your browser without stretching it. Aspect ratio stays locked, and nothing is uploaded to a server.",
  alternates: { canonical: "/image-resizer" },
};

export default function ImageResizerPage() {
  return (
    <ToolPageShell
      title="Image resizer"
      description="Set a new width or height. The shape stays intact."
      note="High-quality local resize"
      slug="/image-resizer"
      steps={["Choose an image.", "Enter a width or height.", "Resize and download the result."]}
      explainer={
        <>
          <h2 id="learn-title">Resizing changes the pixel dimensions</h2>
          <p>
            Resizing sets how many pixels wide and tall your image is. That is a different job from
            compression, which keeps the dimensions and re-saves at lower quality. A photo straight off a
            phone or camera is often several thousand pixels across, far more than a web page, a profile
            picture, or a document ever displays — so the extra pixels are weight with no visible benefit.
          </p>

          <h3>Why resize at all</h3>
          <ul>
            <li><strong>Upload limits</strong> — a form or forum caps the dimensions or the file size, and a smaller image simply goes through.</li>
            <li><strong>Faster pages</strong> — a browser downloads every pixel even when it shrinks the picture to fit; sending the right size keeps a page light.</li>
            <li><strong>Fitting a layout</strong> — a banner slot, a thumbnail grid, or an avatar expects a particular size, and matching it avoids awkward cropping later.</li>
          </ul>

          <h3>Aspect ratio stays locked</h3>
          <p>
            The width and height here are tied to the original proportions. Type a new width and the height
            updates to match; type a height and the width follows. That is what keeps faces from looking
            stretched or squashed — the shape is preserved, only the scale changes. If you need an exact
            width <em>and</em> an exact height that do not share the original ratio, you would have to crop,
            which this tool does not do.
          </p>

          <h3>Downscaling versus upscaling</h3>
          <p>
            Making an image smaller is where resizing shines. This tool uses the pica library to resample
            rather than a plain browser stretch, so edges and text stay clean instead of turning jagged when
            you scale down. Going the other way is limited by physics: enlarging cannot invent detail the
            camera never captured, so an upscaled image looks softer and blurrier the further you push it.
            When you must enlarge, keep the step modest and expect some softness.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Goal</th><th>Direction</th><th>What to expect</th></tr>
            </thead>
            <tbody>
              <tr><th>Fit a web layout or upload</th><td>Downscale</td><td>Smaller file, sharp result</td></tr>
              <tr><th>Make a thumbnail or avatar</th><td>Downscale</td><td>Clean edges, quick to load</td></tr>
              <tr><th>Enlarge a small image</th><td>Upscale</td><td>Softer, no new detail added</td></tr>
            </tbody>
          </table>

          <h3>Resizing often beats compressing for size</h3>
          <p>
            File size grows with the pixel count, so halving both the width and height leaves roughly a
            quarter of the pixels — a much bigger cut than nudging a quality slider usually gives. If a photo
            is both oversized and heavier than you want, resize first, then run it through the{" "}
            <Link href="/image-compressor">image compressor</Link> if it still needs to be smaller. The{" "}
            <Link href="/guides/image-compression-quality">quality guide</Link> covers where to set that
            slider. Need a different format instead of a different size? The{" "}
            <Link href="/image-converter">image converter</Link> switches between JPG, PNG, and WebP.
          </p>

          <p>Resizing happens entirely in this browser tab, one image at a time — nothing is uploaded.</p>
        </>
      }
      faqs={[
        { question: "Will resizing distort my image?", answer: "No. Width and height are linked to the original aspect ratio, so entering one value updates the other and the shape stays intact." },
        { question: "Can I make an image larger?", answer: "You can, but enlarging cannot add detail that was not captured, so results look softer. Resizing down keeps the most quality." },
        { question: "How is the resize quality kept high?", answer: "The tool uses a high-quality resampling step (pica) rather than a plain browser stretch, which keeps edges and text cleaner when scaling down." },
        { question: "Does resizing or compressing save more file size?", answer: "Resizing usually saves more. File size scales with the pixel count, so cutting the dimensions removes far more weight than lowering the quality slider alone. Resize first, then compress if needed." },
        { question: "Can I set an exact width and height that change the shape?", answer: "No. This tool keeps the original aspect ratio to avoid stretching, so one dimension always follows the other. Reaching an exact non-matching size would require cropping." },
        { question: "Is my image uploaded to resize it?", answer: "No. Resizing runs in your browser and the file never leaves your device, so the tool works offline." },
      ]}
    >
      <ImageWorkspace mode="resize" defaultFormat="image/png" />
    </ToolPageShell>
  );
}
