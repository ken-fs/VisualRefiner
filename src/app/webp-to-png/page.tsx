import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "WebP to PNG Converter",
  description: "Convert a WebP to a lossless PNG in your browser. Keeps transparency, opens in any editor, no upload — the file stays on your device.",
  alternates: { canonical: "/webp-to-png" },
};

export default function WebpToPngPage() {
  return (
    <ToolPageShell
      title="WebP to PNG"
      description="Turn a WebP into a PNG that opens anywhere."
      note="No server upload"
      slug="/webp-to-png"
      steps={["Choose a WebP image.", "Convert to PNG.", "Download the PNG file."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert WebP to PNG</h2>
          <p>
            WebP is a web-first format: small files, good quality, and support for transparency. But when you
            want to <em>work</em> with an image rather than just display it, PNG is often the friendlier
            choice. Older editors and design tools that choke on WebP will happily open a PNG, and PNG is
            lossless, so it makes a clean, exact copy to edit from. This is the conversion to reach for when a
            WebP you saved needs to go into a program that will not accept it — or when you want transparency
            preserved without the risk of lossy re-compression.
          </p>
          <p>
            Unlike converting to JPG, going to PNG keeps any transparent areas intact. A logo or cut-out that
            has a see-through background in the WebP stays that way in the PNG, which is why PNG is the right
            target whenever transparency matters.
          </p>

          <h3>What to expect from the file</h3>
          <p>
            PNG stores every pixel losslessly, so the result is typically larger than the WebP — sometimes
            much larger for a detailed photo. That is the trade for a universally editable, artifact-free
            copy. Note that if the original WebP was saved in lossy mode, converting to PNG does not undo that
            earlier loss; PNG faithfully preserves the image as it currently is, artifacts and all. It cannot
            add back detail that was never in the WebP.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Type</th><th>Transparency</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>WebP</th><td>Lossy or lossless</td><td>Yes</td><td>Small images for the web</td></tr>
              <tr><th>PNG</th><td>Lossless</td><td>Yes</td><td>Editing, transparency, older tools</td></tr>
              <tr><th>JPG</th><td>Lossy</td><td>No</td><td>Small, portable photos</td></tr>
            </tbody>
          </table>

          <h3>PNG or JPG for the copy?</h3>
          <p>
            If your goal is simply to open the image somewhere that rejects WebP and it is a photo without
            transparency, <Link href="/webp-to-jpg">WebP to JPG</Link> gives a smaller file. Choose PNG when
            you need transparency, plan to edit and re-save without accumulating loss, or a tool specifically
            asks for PNG. The <Link href="/guides/webp-vs-png">WebP vs PNG guide</Link> compares the two in
            depth. Later, if the PNG turns out heavier than you want, run it through the{" "}
            <Link href="/image-compressor">image compressor</Link> or convert it with the{" "}
            <Link href="/image-converter">image converter</Link>. Everything happens inside this browser tab,
            so your image is never uploaded.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert WebP to PNG?", answer: "Some older editors, design apps, and upload forms cannot open WebP. Converting to PNG produces a lossless file that opens almost everywhere, keeps any transparency, and is clean to edit from." },
        { question: "Does converting keep transparency?", answer: "Yes. PNG supports transparency, so transparent areas in the WebP are preserved in the PNG. This is the main reason to choose PNG over JPG for a WebP that has a see-through background." },
        { question: "Will the PNG be larger than the WebP?", answer: "Usually yes, sometimes much larger. PNG stores every pixel losslessly while WebP compresses harder, so a detailed image grows when converted. That is the cost of a lossless, universally editable copy." },
        { question: "Does converting to PNG improve quality?", answer: "No. If the WebP was saved in lossy mode, PNG cannot restore detail that was already discarded. It faithfully preserves the current image, including any existing artifacts." },
        { question: "Should I convert to PNG or JPG?", answer: "Choose PNG when you need transparency, plan to edit and re-save without losing quality, or a tool requires PNG. Choose JPG for a smaller, portable copy of a photo that has no transparency." },
        { question: "Is the WebP uploaded to convert it?", answer: "No. The image is decoded and converted in your browser using the Canvas API, so it never leaves your device and the tool works offline." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/png" accept="image/webp,.webp" />
    </ToolPageShell>
  );
}
