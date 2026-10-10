import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VectorizeWorkspace } from "@/components/VectorizeWorkspace";

export const metadata: Metadata = {
  title: "JPG to SVG Converter (Free, No Upload)",
  description:
    "Convert a JPG to a vector SVG in your browser. Trace logos, sketches, and signatures in color or black and white, with an option to drop the white background.",
  alternates: { canonical: "/jpg-to-svg" },
};

export default function JpgToSvgPage() {
  return (
    <ToolPageShell
      title="JPG to SVG"
      description="Trace a JPG into a vector SVG. Clean up compression noise, drop the white background, and download."
      note="Traced in this tab"
      slug="/jpg-to-svg"
      steps={[
        "Drop in your JPG. It traces right away.",
        "Turn on Remove white background if the design sits on white, or pick Black & white for scans.",
        "Raise Ignore specks until the noise is gone, then download the SVG.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">What makes JPG to SVG different</h2>
          <p>
            JPG has two habits that get in the way of tracing. It has no transparency, so there&apos;s always
            a background. And it saves space by smudging edges, which leaves faint blocks and dots around
            your design.
          </p>
          <p>
            Both are easy to fix here. <strong>Remove white background</strong> drops a white or near-white
            backdrop. <strong>Ignore specks</strong> throws away the tiny patches that compression leaves
            behind. Start around 6px for a noisy JPG.
          </p>
          <h3>Scans, sketches, and signatures</h3>
          <p>
            Phone photos of drawings and signed paper work best in <strong>Black &amp; white</strong>. Move
            the threshold up if thin lines break apart, and down if the paper&apos;s shadow shows up as a
            dark blob.
          </p>
          <p>
            Take the photo in even light and fill the frame with the drawing. A crooked or shadowy photo is
            harder to trace than a flat scan. The <Link href="/image-cropper">image cropper</Link> helps you
            cut away the table edges first.
          </p>
          <h3>Photos</h3>
          <p>
            You can trace a photo with the Photo style, but expect a big file and a poster look. If you just
            need a smaller photo for the web, <Link href="/jpg-to-webp">JPG to WebP</Link> is the better
            tool. For logos saved as PNG, use <Link href="/png-to-svg">PNG to SVG</Link>.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I convert a JPG logo to SVG?",
          answer:
            "Yes. Keep the Logo style, turn on Remove white background, and raise Ignore specks to clean up JPG noise. Use the biggest version of the logo you have.",
        },
        {
          question: "How do I turn a signature or sketch into an SVG?",
          answer:
            "Photograph or scan it on white paper, then pick Black & white. Adjust the threshold until the lines are solid and the paper is clean, and download the SVG.",
        },
        {
          question: "Why does my JPG trace look blotchy?",
          answer:
            "JPG compression adds faint blocks and color noise around edges. Raise Ignore specks, lower Color detail, or switch to Black & white if the design is one color.",
        },
        {
          question: "Is my JPG uploaded?",
          answer:
            "No. The tracing runs in your browser with an open-source WebAssembly engine. The photo stays on your device.",
        },
        {
          question: "Will converting to SVG improve image quality?",
          answer:
            "It can't add detail that isn't there. Tracing makes clean edges that scale to any size, but blurry areas stay simplified. A sharper source JPG gives a better SVG.",
        },
      ]}
    >
      <VectorizeWorkspace sourceLabel="JPG works — PNG and WebP too" />
    </ToolPageShell>
  );
}
