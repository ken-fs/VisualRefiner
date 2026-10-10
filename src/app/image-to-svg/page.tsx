import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VectorizeWorkspace } from "@/components/VectorizeWorkspace";

export const metadata: Metadata = {
  title: "Image to SVG Converter (Free, No Upload)",
  description:
    "Turn a PNG, JPG, or WebP into a real vector SVG with color or black-and-white tracing. It runs in your browser, so the image never leaves your device.",
  alternates: { canonical: "/image-to-svg" },
};

export default function ImageToSvgPage() {
  return (
    <ToolPageShell
      title="Image to SVG"
      description="Trace a PNG, JPG, or WebP into vector paths. Pick color or black and white, tweak, and download the SVG."
      note="Traced in this tab"
      slug="/image-to-svg"
      steps={[
        "Drop in a PNG, JPG, or WebP image. It traces right away.",
        "Pick a style. Use Logo for flat art and Black & white for cut files.",
        "Move the sliders until the SVG preview looks right, then download it or copy the code.",
      ]}
      explainer={
        <>
          <h2 id="learn-title">How image to SVG works</h2>
          <p>
            A PNG or JPG is a grid of colored pixels. An SVG is a list of shapes. To get from one to the
            other, the tool <strong>traces</strong> the image: it groups pixels of the same color, draws an
            outline around each group, and smooths that outline into curves.
          </p>
          <p>
            That means the result is a redrawing, not the original vector file. For a logo, an icon, a
            sticker design, or a scanned drawing, it&apos;s usually very close. For a photo, you get a
            poster-like version with hundreds of color shapes.
          </p>
          <h3>Which style to pick</h3>
          <p>
            <strong>Logo / flat colors</strong> merges colors that are almost the same, so you get clean
            shapes and a small file. <strong>Illustration</strong> keeps more shades. <strong>Photo</strong>{" "}
            keeps the most and ignores small specks, but expect a big file.
          </p>
          <p>
            <strong>Black &amp; white</strong> is the one for Cricut, Silhouette, vinyl, and laser cutting.
            It turns everything into one solid color, and the threshold slider decides what counts as dark.
          </p>
          <h3>Getting a cleaner trace</h3>
          <p>
            Start from the biggest, sharpest image you have. Blurry or tiny images trace into wobbly edges.
            If you see lots of little dots, raise <em>Ignore specks</em>. If two colors blend into one, raise{" "}
            <em>Color detail</em>.
          </p>
          <p>
            For layered vinyl, set Layers to <strong>Cut out</strong> so the shapes don&apos;t sit on top of
            each other. Need a PNG again later? Use <Link href="/svg-to-png">SVG to PNG</Link>. To check the
            paths and viewBox of your file, open it in the <Link href="/svg-viewer">SVG viewer</Link>.
          </p>
        </>
      }
      faqs={[
        {
          question: "Is my image uploaded?",
          answer:
            "No. The tracing engine (vtracer, open source) downloads once as a small WebAssembly file and runs in your browser tab. Your image never leaves your device.",
        },
        {
          question: "Will the SVG look exactly like my image?",
          answer:
            "Close, not exact. Tracing redraws the image as shapes. Logos, icons, and line art come out very close. Photos turn into a poster-style version, and fine textures get simplified.",
        },
        {
          question: "Which setting should I use for Cricut or Silhouette?",
          answer:
            "Pick Black & white for a single-color cut file. For a multi-color layered design, pick Logo and set Layers to Cut out, so each color is its own shape with no overlaps. Turn on Remove white background if the image sits on white.",
        },
        {
          question: "Why is my SVG file so big?",
          answer:
            "Every color patch becomes a shape, so detailed images make big files. Lower Color detail, raise Ignore specks, or switch to the Logo style. Photos are the worst case.",
        },
        {
          question: "Can I edit the SVG in Illustrator, Inkscape, or Figma?",
          answer:
            "Yes. The download is a standard SVG made of plain paths with solid fills, so any vector editor opens it. Use Copy code if you want to paste the markup straight into HTML or a design tool.",
        },
        {
          question: "Does it keep transparency?",
          answer:
            "Yes. Transparent areas of a PNG stay empty in the SVG. For a JPG, which has no transparency, turn on Remove white background to drop a white backdrop.",
        },
      ]}
    >
      <VectorizeWorkspace />
    </ToolPageShell>
  );
}
