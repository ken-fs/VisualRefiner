import type { Metadata } from "next";
import Link from "next/link";
import { SvgConvertWorkspace } from "@/components/SvgConvertWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "SVG to WebP Converter — Transparency and Small Size",
  description:
    "Convert SVG to WebP in your browser at 1×, 2× or 4× scale — transparency kept, files far smaller than PNG. No upload, everything stays on your device.",
  alternates: { canonical: "/svg-to-webp" },
};

export default function SvgToWebpPage() {
  return (
    <ToolPageShell
      title="SVG to WebP"
      description="Rasterize a vector file to WebP — transparency kept, lighter than PNG."
      note="Rasterized in this tab"
      slug="/svg-to-webp"
      steps={["Choose or drop an SVG file.", "Pick the render scale and quality.", "Convert and download the WebP."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert SVG to WebP</h2>
          <p>
            WebP sits between PNG and JPG: it keeps the <strong>alpha channel</strong> like PNG while
            compressing far harder. For web use it is the modern default — every current browser
            renders it, and a WebP is typically 25–35% smaller than the same PNG.
          </p>
          <p>
            The practical case: you need a raster version of a vector asset for a website, CMS or app
            where SVG is not accepted or not practical, and you want it to load fast without losing the
            transparent background. Rasterize at 2× the display size for crisp edges on retina screens.
          </p>
          <h3>Compatibility check</h3>
          <p>
            WebP is universally supported in browsers, but a few legacy desktop apps and older design
            tools still reject it. If the file is headed somewhere old-fashioned,{" "}
            <Link href="/svg-to-png">SVG to PNG</Link> is the safest hand-off; for photo-style output
            with no transparency, <Link href="/svg-to-jpg">SVG to JPG</Link> is smaller still.
          </p>
        </>
      }
      faqs={[
        {
          question: "Does WebP keep transparency?",
          answer: "Yes. WebP supports an alpha channel, so transparent areas of the SVG stay transparent — unlike JPG, which fills them with white.",
        },
        {
          question: "Is WebP smaller than PNG?",
          answer: "Usually, yes — commonly 25–35% smaller for the same visual quality, and the gap widens with complex artwork. For flat icons the difference is smaller but WebP still typically wins.",
        },
        {
          question: "Which render size should I pick?",
          answer: "Render at 2× the intended display size for sharpness on high-DPI screens, or 4× for small icons. The chosen dimensions are shown before you download.",
        },
        {
          question: "Is the SVG uploaded to convert it?",
          answer: "No. Conversion runs in your browser tab using the canvas API — the file never leaves your device and the tool works offline.",
        },
      ]}
    >
      <SvgConvertWorkspace defaultFormat="image/webp" />
    </ToolPageShell>
  );
}
