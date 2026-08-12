import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "PNG to JPG Converter",
  description: "Convert a PNG to a smaller JPG in your browser. Shrinks photos saved as PNG, flattens transparency, no upload — the file stays on your device.",
  alternates: { canonical: "/png-to-jpg" },
};

export default function PngToJpgPage() {
  return (
    <ToolPageShell
      title="PNG to JPG"
      description="Turn a PNG into a smaller, widely supported JPG."
      note="No server upload"
      slug="/png-to-jpg"
      steps={["Choose a PNG image.", "Set the JPG quality.", "Convert and download the JPG."]}
      explainer={
        <>
          <h2 id="learn-title">When PNG to JPG is worth it</h2>
          <p>
            PNG is lossless: it stores every pixel exactly, which is perfect for screenshots, logos, and
            graphics with crisp edges. That same thoroughness makes it a heavy choice for a photograph. A
            photo full of gradual color shifts has no flat areas for PNG to compress, so the file balloons.
            JPG was designed for exactly that kind of image — it throws away detail your eye barely notices
            and lands on a far smaller file.
          </p>
          <p>
            So the reason to convert is size. If you have a photo that was saved or exported as a PNG, moving
            it to JPG usually cuts the file dramatically with no visible change. That means faster uploads,
            lighter email attachments, and quicker page loads.
          </p>

          <h3>The transparency trade-off</h3>
          <p>
            The one thing JPG cannot do is transparency. PNG can store transparent pixels; JPG has no channel
            for them, so any see-through area has to be filled with a solid color when you convert. Here that
            fill happens automatically as the image is flattened. If a transparent background is the whole
            point — a logo meant to sit on different colors, say — JPG is the wrong target. Keep the PNG, or
            convert to <Link href="/png-to-webp">WebP</Link>, which keeps transparency and is still small.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Screenshots, logos, sharp graphics</td></tr>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Photos you want small and portable</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Small files for the web</td></tr>
            </tbody>
          </table>

          <h3>Quality and what to expect</h3>
          <p>
            JPG is lossy, so saving one drops a little detail. Converting once from your PNG original is fine —
            near the default quality the difference is hard to spot on a photo. The quality slider decides how
            much detail to keep: higher stays closer to the original and larger, lower gets smaller but
            eventually shows soft edges. Around 82% is a sensible starting point. The{" "}
            <Link href="/guides/image-compression-quality">quality guide</Link> covers where to set it.
          </p>
          <p>
            Two cautions. First, a screenshot or a flat graphic will look worse as JPG — lossy compression
            smears sharp edges and text, so those belong as PNG. Second, if size is your goal but you want to
            keep the file portable, you can also just run the PNG through the{" "}
            <Link href="/image-compressor">image compressor</Link>. Everything happens inside this browser
            tab, so the image is never uploaded.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert PNG to JPG?", answer: "JPG files are usually much smaller than PNG for photographs, which makes them faster to upload, email, and load on a page. Convert when you do not need transparency and want a lighter file." },
        { question: "What happens to transparency?", answer: "JPG has no transparency channel, so any transparent areas are flattened onto a solid background during conversion. Keep the PNG or convert to WebP if you need to preserve transparency." },
        { question: "Does converting PNG to JPG lose quality?", answer: "JPG is lossy, so a small amount of detail is dropped. Converting once from the PNG original near the default quality keeps the change hard to see on a photo. Avoid re-saving the same JPG repeatedly." },
        { question: "Should I convert a screenshot or logo to JPG?", answer: "Usually no. Lossy compression smears the sharp edges and text in screenshots and flat graphics, so they look cleaner and are often smaller as PNG. JPG suits photographs." },
        { question: "Will the JPG always be smaller than the PNG?", answer: "For photographs, almost always. For simple graphics with few colors, a PNG can already be very small, so the JPG may not save much and could look worse. It depends on the image." },
        { question: "Is the PNG uploaded anywhere?", answer: "No. The conversion runs entirely in your browser using the Canvas API, so the original image never leaves your device and the tool works offline." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/png,.png" />
    </ToolPageShell>
  );
}
