import type { Metadata } from "next";
import Link from "next/link";
import { SvgToDxfWorkspace } from "@/components/SvgToDxfWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "SVG to DXF Converter for Laser & CNC (Free, No Upload)",
  description:
    "Convert an SVG to a DXF at the exact size you need, with one layer per color. Opens in LightBurn, AutoCAD, Fusion, and Inkscape. Runs in your browser.",
  alternates: { canonical: "/svg-to-dxf" },
};

export default function SvgToDxfPage() {
  return (
    <ToolPageShell
      title="SVG to DXF"
      description="Turn an SVG into a DXF for laser cutters, CNC, and CAD. Set the real size, keep colors as layers, download."
      note="Converted in this tab"
      slug="/svg-to-dxf"
      steps={[
        "Drop in your SVG. It converts right away.",
        "Type the width you want the design to be, in mm or inches. The height follows.",
        "Download the DXF and open it in your laser, CNC, or CAD software.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">What changes when SVG becomes DXF</h2>
          <p>
            DXF is the file most laser, CNC, and CAD programs agree on. It only stores lines, though. There
            are no fills, no gradients, and no text styles. What you get is the outline of every shape in
            your SVG, which is exactly what a cutter follows.
          </p>
          <p>
            Curves are turned into many short straight lines. The <em>Curve accuracy</em> setting decides
            how short. Normal keeps every line within 0.05 mm of the real curve, which is finer than a laser
            beam, so you won&apos;t see it in the cut.
          </p>
          <h3>Getting the size right</h3>
          <p>
            SVGs often come in at the wrong size in CAD software, because pixels and millimetres don&apos;t
            match up. Here you type the width you want, and the DXF is drawn at that size. The file is
            saved as R12 DXF, the oldest and most widely read version.
          </p>
          <h3>Colors become layers</h3>
          <p>
            With <em>One layer per color</em> on, each fill or stroke color gets its own layer, named after
            the color. In LightBurn that means you can set cut and engrave settings per color. Turn it off
            to put everything on one layer.
          </p>
          <h3>Before you convert</h3>
          <p>
            Convert text to outlines in your design app first. Text isn&apos;t exported, because its shape
            depends on fonts the DXF can&apos;t carry. Starting from a PNG or JPG instead? Use{" "}
            <Link href="/png-to-dxf">PNG to DXF</Link>, which traces the image first. To check what&apos;s
            inside an SVG, open it in the <Link href="/svg-viewer">SVG viewer</Link>.
          </p>
        </>
      }
      faqs={[
        {
          question: "Which programs open the DXF?",
          answer:
            "The file is R12 DXF with plain polylines, the most widely supported kind. LightBurn, xTool Creative Space, AutoCAD, Fusion, Inkscape, and LibreCAD all read it.",
        },
        {
          question: "Why is my DXF the wrong size?",
          answer:
            "Most size problems come from pixels being read as millimetres. Type the width you want in this tool and the DXF is drawn at that exact size. The units are written into the file, and you can switch between mm and inches.",
        },
        {
          question: "Are curves kept as curves?",
          answer:
            "They're turned into short straight segments within the accuracy you pick (0.05 mm by default). That's the most reliable way across laser and CNC software, some of which read DXF splines badly.",
        },
        {
          question: "What doesn't get converted?",
          answer:
            "Text, embedded images, and hidden elements. Fills and gradients turn into outlines. Convert text to paths in your design app before exporting the SVG.",
        },
        {
          question: "Is my SVG uploaded?",
          answer:
            "No. The SVG is read and converted inside your browser tab. Scripts and external links inside the file are removed before it's read, and nothing leaves your device.",
        },
      ]}
    >
      <SvgToDxfWorkspace />
    </ToolPageShell>
  );
}
