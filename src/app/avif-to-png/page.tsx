import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "AVIF to PNG Converter",
  description: "Convert AVIF to PNG in your browser and keep transparency. Lossless output for editing, no upload, no account — the image stays on your device.",
  alternates: { canonical: "/avif-to-png" },
};

export default function AvifToPngPage() {
  return (
    <ToolPageShell
      title="AVIF to PNG"
      description="Get a lossless, transparent PNG that every editor can open."
      note="Processed in this tab"
      slug="/avif-to-png"
      steps={["Choose an AVIF image.", "Convert it locally.", "Download the PNG file."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert AVIF to PNG</h2>
          <p>
            AVIF is built for delivery — tiny files over the wire. PNG is built for keeping: lossless
            pixels, an alpha channel, and support in every image editor ever made. When you need to
            edit, annotate, print, or archive an AVIF rather than just view it, PNG is the safe home.
          </p>
          <p>
            The conversion happens entirely in this browser tab: your AVIF is decoded locally and
            written out as PNG with its transparency intact. Nothing is uploaded, so the tool works
            offline and the image never leaves your device.
          </p>

          <h3>Expect a bigger file — that is normal</h3>
          <p>
            PNG is lossless, so it keeps every pixel exactly as decoded. An AVIF that was compressed
            for the web will grow several times over as PNG. That is the price of an exact, editable
            copy. If you want a file that stays small instead,{" "}
            <Link href="/avif-to-webp">AVIF to WebP</Link> or <Link href="/avif-to-jpg">AVIF to JPG</Link>{" "}
            will land lighter.
          </p>

          <h3>When PNG is the right call</h3>
          <p>
            Screenshots you need to mark up, graphics going into a document or presentation, anything
            headed for an editor that does not read AVIF yet, and any image where transparency must
            survive. For a deeper format comparison, see{" "}
            <Link href="/guides/webp-vs-png">WebP vs PNG</Link> and{" "}
            <Link href="/guides/avif-vs-webp">AVIF vs WebP</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "Does the PNG keep AVIF transparency?", answer: "Yes. PNG supports a full alpha channel, so transparent and semi-transparent areas of the AVIF carry over exactly." },
        { question: "Why is the PNG so much bigger?", answer: "PNG is lossless — it stores every pixel exactly. AVIF achieves its small sizes through lossy compression, so converting back to a lossless format always grows the file." },
        { question: "Is the conversion lossless?", answer: "The PNG itself is lossless: it faithfully stores the decoded AVIF pixels. It cannot recover detail the original AVIF already discarded, but it loses nothing further." },
        { question: "Is my AVIF uploaded anywhere?", answer: "No. The image is decoded and converted locally in your browser using a WebAssembly codec — it is never sent to a server and works offline." },
        { question: "My software cannot open AVIF at all. Will this help?", answer: "Yes — that is the main use case. Convert the AVIF to PNG here, and any editor, office suite, or upload form will accept the result." },
        { question: "Can I convert several AVIF files at once?", answer: "The tool handles one image at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/png" accept="image/avif,.avif" />
    </ToolPageShell>
  );
}
