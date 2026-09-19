import type { Metadata } from "next";
import Link from "next/link";
import { SvgConvertWorkspace } from "@/components/SvgConvertWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "SVG to JPG Converter — Rasterize Vector Files Locally",
  description:
    "Convert SVG to JPG in your browser at 1×, 2× or 4× scale with a white background and quality control. No upload — the file stays on your device.",
  alternates: { canonical: "/svg-to-jpg" },
};

export default function SvgToJpgPage() {
  return (
    <ToolPageShell
      title="SVG to JPG"
      description="Rasterize a vector file to JPG — small output for previews, thumbnails and social."
      note="Rasterized in this tab"
      slug="/svg-to-jpg"
      steps={["Choose or drop an SVG file.", "Pick the render scale and quality.", "Convert and download the JPG."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert SVG to JPG</h2>
          <p>
            JPG is the smallest raster format for anything photo-like, and it is accepted literally
            everywhere — upload forms with old format lists, email, social previews, thumbnails. When
            a vector logo or illustration just needs to <em>look right</em> in a place that will not
            take an SVG, JPG is the low-friction answer.
          </p>
          <p>
            The trade-off is built into the format: <strong>JPG has no transparency</strong>. Transparent
            areas of your SVG are filled with white in the output — that is the correct behavior for
            previews, but if you need the background to stay transparent, use{" "}
            <Link href="/svg-to-png">SVG to PNG</Link> or <Link href="/svg-to-webp">SVG to WebP</Link>{" "}
            instead.
          </p>
          <h3>Picking the render size</h3>
          <p>
            SVG scales freely, so decide the final pixel size here: 2× of the intended display size is a
            good default, 4× for icons on retina screens. Bigger renders mean bigger JPGs — the quality
            slider trades file size against compression artifacts.
          </p>
        </>
      }
      faqs={[
        {
          question: "Why does my JPG have a white background?",
          answer: "JPG does not support transparency, so transparent areas of the SVG are filled with white during conversion. If you need transparency, convert to PNG or WebP instead.",
        },
        {
          question: "What quality should I use?",
          answer: "85–92% is the sweet spot for most graphics: visually identical to the source at a fraction of the size. Push to 100% only if you see artifacts around sharp edges, and drop lower if the file must be tiny.",
        },
        {
          question: "Is my SVG uploaded?",
          answer: "No. The file is rasterized with the browser's own canvas engine, entirely on your device.",
        },
        {
          question: "Can I batch-convert several SVGs at once?",
          answer: "This tool converts one file at a time. For a folder of icons, the per-file flow is a few seconds each — or run them through the same render settings in sequence and the output stays consistent.",
        },
      ]}
    >
      <SvgConvertWorkspace defaultFormat="image/jpeg" />
    </ToolPageShell>
  );
}
