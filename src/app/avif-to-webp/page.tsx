import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "AVIF to WebP Converter",
  description: "Convert AVIF to WebP in your browser and keep transparency. Wider software support, still small — no upload, the image stays on your device.",
  alternates: { canonical: "/avif-to-webp" },
};

export default function AvifToWebpPage() {
  return (
    <ToolPageShell
      title="AVIF to WebP"
      description="Keep the file small and modern, widen what can open it."
      note="Processed in this tab"
      slug="/avif-to-webp"
      steps={["Choose an AVIF image.", "Set the WebP quality.", "Convert and download the WebP file."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert AVIF to WebP</h2>
          <p>
            AVIF and WebP are the two modern web formats, and they overlap a lot: both handle
            transparency, both compress far better than JPG or PNG, both play in every current
            browser. The difference is age. WebP has a five-year head start, so the long tail of
            software around browsers — CMS media libraries, older editors, forum uploaders, social
            scheduling tools — is far more likely to accept it.
          </p>
          <p>
            Converting AVIF to WebP keeps you in a small, transparent, web-ready file while buying
            back that compatibility. It all happens in this tab: the AVIF is decoded locally and
            re-encoded as WebP — nothing is uploaded, and the tool works offline.
          </p>

          <h3>What you give up</h3>
          <p>
            At the same visual quality, AVIF is usually the smaller file — that codec is simply newer.
            Expect the WebP to come out somewhat larger. If size matters more than compatibility, stay
            with AVIF. The full breakdown is in{" "}
            <Link href="/guides/avif-vs-webp">AVIF vs WebP</Link>.
          </p>

          <h3>Picking a quality</h3>
          <p>
            The 82% default is a good start for photos and rich graphics. For flat art and text, go
            higher to protect sharp edges — the{" "}
            <Link href="/guides/image-compression-quality">quality guide</Link> has concrete examples.
            Need pixels you can edit instead? <Link href="/avif-to-png">AVIF to PNG</Link> is the
            lossless route.
          </p>
        </>
      }
      faqs={[
        { question: "Does WebP keep AVIF transparency?", answer: "Yes. WebP supports an alpha channel, so transparent areas of the AVIF are preserved in the converted file." },
        { question: "Will the WebP be bigger than the AVIF?", answer: "Usually a bit. AVIF compresses more efficiently than WebP at the same visual quality, so expect a modest size increase in exchange for wider software support." },
        { question: "Is the converted WebP lossless?", answer: "This tool re-encodes at the quality you choose, so it is lossy. Near the top of the slider the result is visually identical to the original AVIF." },
        { question: "Is my AVIF uploaded anywhere?", answer: "No. Decoding and re-encoding run locally in your browser — the image never leaves your device and the tool works offline." },
        { question: "When should I keep AVIF instead?", answer: "If every tool in your pipeline already reads AVIF, there is no reason to convert — AVIF gives you the smaller file. Convert when something in the chain rejects it." },
        { question: "Can I convert several AVIF files at once?", answer: "The tool processes one image at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/avif,.avif" />
    </ToolPageShell>
  );
}
