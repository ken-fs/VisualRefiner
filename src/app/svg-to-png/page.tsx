import type { Metadata } from "next";
import Link from "next/link";
import { SvgConvertWorkspace } from "@/components/SvgConvertWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "SVG to PNG Converter — Keep Transparency, Pick Your Size",
  description:
    "Convert SVG to PNG in your browser at 1×, 2× or 4× scale with transparency intact. The vector file never leaves your device — no upload, works offline.",
  alternates: { canonical: "/svg-to-png" },
};

export default function SvgToPngPage() {
  return (
    <ToolPageShell
      title="SVG to PNG"
      description="Rasterize a vector file to PNG — transparency kept, output size your call."
      note="Rasterized in this tab"
      slug="/svg-to-png"
      steps={["Choose or drop an SVG file.", "Pick the render scale — 2× suits icons, 1× matches the declared size.", "Convert and download the PNG."]}
      explainer={
        <>
          <h2 id="learn-title">Why convert SVG to PNG</h2>
          <p>
            SVG is vector: it stays sharp at any size, but plenty of software still wants a raster
            file — app stores, social platforms, presentation tools, game engines. PNG is the raster
            format to pick when you need <strong>transparency</strong> and lossless edges: logos,
            icons, UI assets, stickers.
          </p>
          <p>
            The one decision that matters is <strong>render size</strong>. Because SVG is resolution-free,
            the same file can export as a 24px icon or a 2400px poster. A 24px icon rasterized at 1× is a
            blurry mess on a retina screen — render at 2× or 4× and let the display scale it down.
          </p>
          <h3>What to watch for</h3>
          <p>
            A PNG of a detailed illustration can be several megabytes — raster pixels weigh more than
            vector paths. If size matters, try the{" "}
            <Link href="/svg-to-webp">SVG to WebP</Link> route instead, or run the PNG through the{" "}
            <Link href="/image-compressor">image compressor</Link>. Everything happens in this tab; the
            SVG is never uploaded.
          </p>
        </>
      }
      faqs={[
        {
          question: "Does the PNG keep transparency?",
          answer: "Yes. PNG supports an alpha channel, so transparent areas of the SVG stay transparent in the output.",
        },
        {
          question: "What render size should I choose?",
          answer: "Match the intended display size and double it for sharpness: a 24px icon renders well at 2× (48px) or 4× (96px). Large illustrations are usually fine at 1×. The tool defaults to 2×, and the output dimensions are shown on the result before you download.",
        },
        {
          question: "Why is my PNG bigger than the SVG?",
          answer: "That is normal — raster pixels are heavier than vector paths. A complex illustration can grow from 20 KB as SVG to several MB as PNG. Use a lower render scale, convert to WebP instead, or compress the PNG afterwards.",
        },
        {
          question: "Is my SVG uploaded anywhere?",
          answer: "No. The SVG is parsed and rasterized entirely in your browser tab with the canvas API — it never leaves your device.",
        },
        {
          question: "Can I convert PNG back to SVG?",
          answer: "Not with this tool. Going from pixels to vectors requires tracing (an approximation, not a true conversion) — this converter only goes the reliable direction, SVG to raster.",
        },
      ]}
    >
      <SvgConvertWorkspace defaultFormat="image/png" />
    </ToolPageShell>
  );
}
