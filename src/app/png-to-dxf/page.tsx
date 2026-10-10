import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VectorizeWorkspace } from "@/components/VectorizeWorkspace";

export const metadata: Metadata = {
  title: "PNG to DXF Converter for Laser Cutting (Free, No Upload)",
  description:
    "Trace a PNG or JPG into a DXF cut file at the size you need. Black and white or one layer per color, ready for LightBurn and CAD. Runs in your browser.",
  alternates: { canonical: "/png-to-dxf" },
};

export default function PngToDxfPage() {
  return (
    <ToolPageShell
      title="PNG to DXF"
      description="Trace a PNG or JPG into a DXF for laser cutting, CNC, and CAD. Set the size, check the outline, download."
      note="Traced in this tab"
      slug="/png-to-dxf"
      steps={[
        "Drop in your PNG or JPG. It's traced in black and white right away.",
        "Move the threshold until the shape looks right, then type the width you need.",
        "Download the DXF, or grab the SVG if your software prefers it.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">How PNG to DXF works</h2>
          <p>
            A PNG is pixels, and a cutter needs lines to follow. So this tool does two steps. It traces the
            image into vector shapes, then writes the outline of each shape into a DXF.
          </p>
          <p>
            It starts in <strong>Black &amp; white</strong>, because most cut files are one color. Everything
            darker than the threshold becomes a shape. Move the slider up if thin parts break apart, and
            down if the background shows up as blobs.
          </p>
          <h3>Pick a good source image</h3>
          <p>
            High contrast and sharp edges trace best: logos, silhouettes, stencils, lettering, and clip art.
            A photo of a person won&apos;t make a clean cut file. Neither will a tiny or blurry PNG, because
            the edges come out wobbly.
          </p>
          <p>
            Raise <em>Ignore specks</em> to drop the little dots that would otherwise become hundreds of tiny
            cuts. Check the SVG preview before you download. What you see is what gets cut.
          </p>
          <h3>Size and layers</h3>
          <p>
            Type the finished width in mm or inches and the DXF is drawn at that size. For multi-color
            designs, pick the Logo style instead. Each color then goes on its own layer, so you can give
            each one different laser settings.
          </p>
          <p>
            Already have a vector file? <Link href="/svg-to-dxf">SVG to DXF</Link> converts it directly with
            no tracing. Want the SVG for Cricut instead? Use <Link href="/png-to-svg">PNG to SVG</Link>.
          </p>
        </>
      }
      faqs={[
        {
          question: "Can I convert a JPG to DXF too?",
          answer:
            "Yes. The tool takes PNG, JPG, and WebP. For a JPG, raise Ignore specks a little, since JPG compression adds noise around edges.",
        },
        {
          question: "Will the DXF open in LightBurn?",
          answer:
            "Yes. It's a standard R12 DXF made of closed polylines, which LightBurn, xTool Creative Space, AutoCAD, Fusion, Inkscape, and LibreCAD all read. The units (mm or inches) are written into the file.",
        },
        {
          question: "Why does my cut file have so many tiny shapes?",
          answer:
            "Small specks and noise in the image each become a shape. Raise Ignore specks, adjust the threshold, or clean up the image first. Fewer shapes means a faster, cleaner cut.",
        },
        {
          question: "How do I get the right size?",
          answer:
            "Type the finished width in the Output width box. The height follows the design's proportions and is shown next to the download.",
        },
        {
          question: "Is my image uploaded?",
          answer:
            "No. Tracing and DXF writing both run in your browser tab. The image never leaves your device.",
        },
      ]}
    >
      <VectorizeWorkspace defaultStyle="bw" output="dxf" sourceLabel="PNG, JPG, or WebP" />
    </ToolPageShell>
  );
}
