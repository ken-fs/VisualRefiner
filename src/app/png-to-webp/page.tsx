import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "PNG to WebP Converter",
  description: "Convert PNG to WebP in your browser and keep transparency. Smaller web-ready files, no upload, no account — the image stays on your device.",
  alternates: { canonical: "/png-to-webp" },
};

export default function PngToWebpPage() {
  return (
    <ToolPageShell
      title="PNG to WebP"
      description="Create a smaller web copy while keeping transparency."
      note="Processed in this tab"
      slug="/png-to-webp"
      steps={["Choose a PNG image.", "Set the WebP quality.", "Convert and download the WebP file."]}
      explainer={
        <>
          <h2 id="learn-title">Why move a PNG to WebP</h2>
          <p>
            PNG is lossless and handles transparency, which makes it the right home for logos,
            screenshots, icons, and any graphic with sharp edges. The downside is size: a lossless
            file keeps every pixel exactly, so a detailed PNG — especially a photo saved as one — can
            be heavy. WebP was built to do the same jobs for a fraction of the bytes, which is why it
            has become the default image format for a lot of the web.
          </p>
          <p>
            The important part for PNG owners: WebP supports transparency too. So you keep the cut-out
            edges and see-through backgrounds you rely on, but ship a lighter file. When you pick a PNG
            here, it is decoded and re-encoded as WebP inside this browser tab — nothing is uploaded,
            so the tool runs offline and your image stays on your device.
          </p>

          <h3>Lossy or lossless?</h3>
          <p>
            WebP can be either. This converter re-encodes at the quality you choose, so it is lossy in
            the same way <Link href="/jpg-to-webp">JPG to WebP</Link> is — but near the top of the
            slider the result stays visually identical to the original while still saving space. Around
            the 82% default is a sensible start for photos and rich illustrations; push it higher for
            flat graphics where you want edges to stay crisp. The{" "}
            <Link href="/guides/image-compression-quality">quality guide</Link> covers where to land.
          </p>

          <h3>How much smaller?</h3>
          <p>
            It depends entirely on the image. A photograph or a busy, gradient-heavy graphic saved as
            PNG usually shrinks a lot. A simple logo with a handful of flat colors is already compact
            as PNG, so the gain there is smaller — sometimes barely worth it. If your PNG is a
            screenshot or a plain graphic and file size is not a problem, there is no rush to convert.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Graphics, screenshots, exact copies</td></tr>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Smaller images for the web</td></tr>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Photos where transparency is not needed</td></tr>
            </tbody>
          </table>

          <p>
            WebP is read by every current browser and most modern software, though the odd older editor
            or upload form still cannot open it. If you hit one of those, convert the WebP back with{" "}
            <Link href="/webp-to-png">WebP to PNG</Link>, or send a <Link href="/png-to-jpg">JPG</Link>{" "}
            when transparency is not needed. To understand the trade-offs in more depth, see{" "}
            <Link href="/guides/webp-vs-png">WebP vs PNG</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "Does WebP keep PNG transparency?", answer: "Yes. WebP supports an alpha channel, so transparent areas of the PNG are preserved in the converted file — you keep cut-out edges and see-through backgrounds." },
        { question: "How much smaller will the file be?", answer: "It varies with the image. Photos and detailed, colorful graphics saved as PNG usually shrink noticeably. A flat logo with few colors is already small as PNG, so the reduction there can be modest." },
        { question: "Is the converted WebP lossless like the PNG?", answer: "This tool re-encodes at the quality you set, so it is lossy. Near the top of the quality slider the result looks identical to the original while still being smaller than the PNG." },
        { question: "What quality should I choose?", answer: "Around the 82% default works well for photos and rich illustrations. For flat graphics and text where sharp edges matter, raise it higher to avoid softening around the lines." },
        { question: "Is the PNG uploaded anywhere?", answer: "No. The image is decoded and converted locally in your browser using the Canvas API, so it is never sent to a server and the tool works offline." },
        { question: "Can I convert several PNGs at once?", answer: "The tool handles one image at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/png,.png" />
    </ToolPageShell>
  );
}
