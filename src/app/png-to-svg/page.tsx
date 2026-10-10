import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VectorizeWorkspace } from "@/components/VectorizeWorkspace";

export const metadata: Metadata = {
  title: "PNG to SVG Converter (Free, Keeps Transparency)",
  description:
    "Convert a PNG logo, icon, or sticker design to a vector SVG in your browser. Transparent areas stay transparent, and the file is never uploaded.",
  alternates: { canonical: "/png-to-svg" },
};

export default function PngToSvgPage() {
  return (
    <ToolPageShell
      title="PNG to SVG"
      description="Turn a PNG logo, icon, or design into a vector SVG. Transparency stays, and nothing is uploaded."
      note="Traced in this tab"
      slug="/png-to-svg"
      steps={[
        "Drop in your PNG. It traces right away.",
        "Keep the Logo style for flat art, or pick Black & white for a one-color cut file.",
        "Check the SVG preview against the original, then download the SVG.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">When PNG to SVG is worth it</h2>
          <p>
            Convert a PNG to SVG when you need it to scale. A 500px PNG logo looks blurry on a banner. The
            SVG version stays sharp at any size, and it&apos;s often a smaller file too.
          </p>
          <p>
            It&apos;s also what cutting machines want. Cricut Design Space, Silhouette Studio, and laser
            software can cut along SVG paths. They can&apos;t cut along pixels.
          </p>
          <h3>PNGs that trace well</h3>
          <p>
            Flat logos, icons, stickers, clip art, and text trace cleanly. A transparent PNG is the best
            start, because the background is already gone and only your design gets traced.
          </p>
          <p>
            Screenshots, photos, and PNGs with soft shadows or gradients are harder. You&apos;ll get many
            small shapes. Lower <em>Color detail</em> to merge them, or use Black &amp; white if you only
            need the outline.
          </p>
          <h3>Small PNGs</h3>
          <p>
            A 64px icon doesn&apos;t have much to trace. The SVG will scale cleanly, but it can&apos;t add
            detail the PNG never had, so a bigger source still wins. If you&apos;re starting from a
            JPG instead, the <Link href="/jpg-to-svg">JPG to SVG</Link> page has tips for compression
            noise. Going the other way? <Link href="/svg-to-png">SVG to PNG</Link> turns the vector back
            into pixels.
          </p>
        </>
      }
      faqs={[
        {
          question: "Does the SVG keep my PNG's transparency?",
          answer:
            "Yes. Fully transparent pixels are left out of the trace, so the SVG has no background. Semi-transparent edges are treated as solid, which keeps the outline crisp.",
        },
        {
          question: "Is this a true conversion?",
          answer:
            "It's a trace. A PNG only stores pixels, so the tool redraws them as vector shapes. Flat logos and icons come out very close to the original. Photos come out poster-like.",
        },
        {
          question: "How do I make a PNG into an SVG for Cricut?",
          answer:
            "For one color, pick Black & white and adjust the threshold until the preview looks right. For several colors, keep Logo and set Layers to Cut out, so the colors don't overlap. Then upload the SVG to Design Space.",
        },
        {
          question: "Is my PNG uploaded anywhere?",
          answer:
            "No. Tracing runs inside your browser tab with an open-source WebAssembly engine. The PNG never leaves your device, and nothing is stored.",
        },
        {
          question: "Why are there tiny dots in my SVG?",
          answer:
            "Those are specks of stray color, often from anti-aliased edges. Raise Ignore specks until they disappear, or lower Color detail so near-identical colors merge.",
        },
      ]}
    >
      <VectorizeWorkspace sourceLabel="PNG works best — JPG and WebP too" />
    </ToolPageShell>
  );
}
