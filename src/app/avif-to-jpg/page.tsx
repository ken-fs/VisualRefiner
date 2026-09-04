import type { Metadata } from "next";
import Link from "next/link";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "AVIF to JPG Converter",
  description: "Convert AVIF to JPG in your browser for maximum compatibility. No upload, no account — the image is decoded and re-encoded on your device.",
  alternates: { canonical: "/avif-to-jpg" },
};

export default function AvifToJpgPage() {
  return (
    <ToolPageShell
      title="AVIF to JPG"
      description="Turn an AVIF file into a JPG that opens anywhere."
      note="Processed in this tab"
      slug="/avif-to-jpg"
      steps={["Choose an AVIF image.", "Set the JPG quality.", "Convert and download the JPG file."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert AVIF to JPG</h2>
          <p>
            AVIF is excellent at what it was built for: squeezing photos and graphics into remarkably
            small files. But it is still the new kid. Plenty of software — older photo editors, some
            CMS upload forms, messaging apps, print shops, office tools — either refuses an AVIF or
            shows a blank preview. JPG, after three decades, opens literally everywhere.
          </p>
          <p>
            Converting here trades a little file size for total compatibility. The AVIF is decoded and
            the JPG is re-encoded inside this browser tab — nothing is uploaded, so the tool works
            offline and the image stays on your device. The AVIF encoder side uses a WebAssembly build
            of libavif that loads only when you convert.
          </p>

          <h3>Watch out for transparency</h3>
          <p>
            AVIF supports an alpha channel; JPG does not. If your AVIF has transparent areas, they are
            filled with a solid color in the JPG. Need to keep transparency? Convert to{" "}
            <Link href="/avif-to-png">PNG</Link> or <Link href="/avif-to-webp">WebP</Link> instead.
          </p>

          <h3>Which quality should you pick?</h3>
          <p>
            Around the 82% default is a sensible landing spot for photos. JPG artifacts show up first
            around sharp text and flat graphics, so push the slider higher for screenshots and logos.
            The <Link href="/guides/image-compression-quality">quality guide</Link> walks through the
            trade-off, and <Link href="/guides/avif-vs-webp">AVIF vs WebP</Link> explains where AVIF
            sits among the modern formats.
          </p>
        </>
      }
      faqs={[
        { question: "Does the JPG keep AVIF transparency?", answer: "No. JPG has no alpha channel, so transparent areas of the AVIF are filled with a solid color. Convert to PNG or WebP if you need to preserve transparency." },
        { question: "Will the JPG be bigger than the AVIF?", answer: "Usually, yes. AVIF compresses far more efficiently than JPG, so expect the JPG to be larger at similar visual quality. Compatibility, not size, is the reason to convert." },
        { question: "Is my AVIF uploaded anywhere?", answer: "No. Decoding and re-encoding happen locally in your browser — the file never leaves your device and the tool works offline." },
        { question: "Where do AVIF files come from?", answer: "iPhones (iOS 16+), many Android cameras, and modern image tools can save AVIF. Websites increasingly serve images as AVIF too, so saved web images often land in this format." },
        { question: "What quality setting should I use?", answer: "The 82% default works well for photos. For screenshots, text, and flat graphics, raise it toward 90%+ to keep edges crisp." },
        { question: "Can I convert several AVIF files at once?", answer: "The tool processes one image at a time. Convert the first, then load the next — each file stays on your device throughout." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/avif,.avif" />
    </ToolPageShell>
  );
}
