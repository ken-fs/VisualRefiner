import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "JPG to AVIF Converter",
  description: "Convert JPG to AVIF in your browser for dramatically smaller photos. No upload, no account — the image is re-encoded on your device.",
  alternates: { canonical: "/jpg-to-avif" },
};

export default function JpgToAvifPage() {
  return (
    <ToolPageShell
      title="JPG to AVIF"
      description="Same photo, a fraction of the file size."
      note="Processed in this tab"
      slug="/jpg-to-avif"
      steps={["Choose a JPG image.", "Set the AVIF quality.", "Convert and download the AVIF file."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert JPG to AVIF</h2>
          <p>
            JPG has been the web&apos;s photo format for thirty years, and it shows: the compression
            is dated. AVIF, built on the AV1 video codec, delivers the same visual quality at roughly
            half the bytes — often better. For a photo-heavy page, switching formats is the single
            cheapest speed win available.
          </p>
          <p>
            Converting here is a local affair: your JPG is decoded and re-encoded as AVIF inside this
            browser tab using a WebAssembly build of libavif. Nothing is uploaded, the tool works
            offline, and the photo never leaves your device.
          </p>

          <h3>A note on double compression</h3>
          <p>
            JPG is already lossy, and AVIF at normal settings is lossy too — the AVIF stores the JPG&apos;s
            decoded pixels, artifacts included. At the default quality this is invisible in practice,
            but avoid converting a JPG that was saved at very low quality to begin with. If you have
            the original photo, convert from that instead.
          </p>

          <h3>Where AVIF works</h3>
          <p>
            Every current browser — Chrome, Firefox, Edge, Safari 16.4+ — displays AVIF, so it is ready
            for websites today. Older desktop editors and some upload forms lag behind; for those,
            keep the JPG or use <Link href="/jpg-to-webp">JPG to WebP</Link> as the middle ground.
            Background on the trade-offs: <Link href="/guides/avif-vs-webp">AVIF vs WebP</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "How much smaller will the AVIF be?", answer: "Typically 40–60% smaller than the JPG at equivalent visual quality, sometimes more. Photos with smooth gradients and skies compress especially well." },
        { question: "Will I lose quality converting JPG to AVIF?", answer: "The AVIF faithfully stores the JPG's decoded pixels at high quality settings. Technically it is a lossy re-encode, but at the 82% default the difference is not visible. Converting repeatedly at low quality is what to avoid." },
        { question: "Is my JPG uploaded anywhere?", answer: "No. Decoding and encoding happen locally in your browser with a WebAssembly codec — the photo never leaves your device and the tool works offline." },
        { question: "Can every browser open AVIF?", answer: "All current versions of Chrome, Firefox, Edge, and Safari (16.4+) can. Very old browsers cannot, so for maximum reach keep a JPG fallback on websites." },
        { question: "What quality setting should I use?", answer: "Start at the 82% default. Push higher for images with fine text or sharp graphic edges; you can go lower for casual photos where every KB counts." },
        { question: "Can I convert several JPGs at once?", answer: "The tool handles one image at a time. Convert the first, then load the next — each stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/avif" accept="image/jpeg,.jpg,.jpeg" />
    </ToolPageShell>
  );
}
