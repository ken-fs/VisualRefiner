import type { Metadata } from "next";
import Link from "next/link";
import { SvgViewerWorkspace } from "@/components/SvgViewerWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "SVG Viewer Online — Preview & Inspect SVG Files",
  description:
    "Open an SVG file online to preview it, zoom in, and inspect its viewBox, dimensions, and structure. Runs entirely in your browser — no upload, nothing leaves your device.",
  alternates: { canonical: "/svg-viewer" },
};

export default function SvgViewerPage() {
  return (
    <ToolPageShell
      title="SVG viewer"
      description="Preview an SVG file and inspect the numbers behind it — viewBox, dimensions, and structure."
      note="Rendered locally, never uploaded"
      slug="/svg-viewer"
      steps={[
        "Choose an .svg file or paste the markup.",
        "Preview it against a transparency background and zoom in on details.",
        "Read the viewBox, dimensions, and node counts to catch export mistakes early.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">What an SVG viewer tells you that a browser tab does not</h2>
          <p>
            An SVG is plain XML — <code>&lt;path&gt;</code>, <code>&lt;rect&gt;</code>,{" "}
            <code>&lt;circle&gt;</code> and friends — that browsers render as vector graphics. Opening one
            directly in a browser shows the picture, but not the details that break layouts: the{" "}
            <strong>viewBox</strong>, declared <strong>width/height</strong>, and how heavy the markup is.
          </p>
          <p>
            The <strong>viewBox</strong> is the coordinate window the artwork was drawn in. When it is missing or
            mismatched with the width/height, an icon crops, stretches, or refuses to scale — one of the most
            common SVG export mistakes. This viewer shows both side by side so you can spot it in seconds.
          </p>
          <h3>Safe by design</h3>
          <p>
            The preview renders your file like an image, which means <strong>scripts and external references
            inside the SVG never execute</strong> — a known attack surface of &quot;online SVG editors&quot; that
            inline the markup. And because everything runs in your browser tab, your files are never uploaded;
            for related checks, see the <Link href="/check-image-origin">image origin checker</Link>.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is my SVG file uploaded to view it?",
          answer:
            "No. The file is read and rendered entirely in your browser tab — it never leaves your device and is not sent to any server.",
        },
        {
          question: "How do I open an SVG file without Illustrator or Inkscape?",
          answer:
            "Drag it into any browser and you see the picture, but not the metadata. This viewer adds what browsers leave out: the viewBox, declared dimensions, element and path counts, plus zoom and transparency backgrounds for checking edges and alignment.",
        },
        {
          question: "What is a viewBox and why does it matter?",
          answer:
            "The viewBox defines the coordinate system the SVG was drawn in — the window onto the artwork. If it is missing or does not match the width/height attributes, the graphic can crop, stretch, or scale incorrectly in layouts. Exporters like Figma, Illustrator, and Inkscape set it differently, so checking it is the fastest way to catch a bad export.",
        },
        {
          question: "Why don't scripts or external images inside my SVG run in the preview?",
          answer:
            "The file is rendered like an image, not inlined into the page — so embedded scripts and remote references stay inert. That is deliberate: it lets you preview SVGs from anywhere without giving them script access to your browser.",
        },
        {
          question: "Can I edit the SVG here?",
          answer:
            "This is a viewer and inspector, not an editor. Paste the markup into your code editor to change it — or if you need the graphic as a regular image, a raster conversion tool is the next step.",
        },
      ]}
    >
      <SvgViewerWorkspace />
    </ToolPageShell>
  );
}
