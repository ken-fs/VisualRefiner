import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Resizer",
  description: "Resize an image locally while keeping its original aspect ratio.",
  alternates: { canonical: "/image-resizer" },
};

export default function ImageResizerPage() {
  return (
    <ToolPageShell
      title="Image resizer"
      description="Set a new width or height. The shape stays intact."
      note="High-quality local resize"
      slug="/image-resizer"
      steps={["Choose an image.", "Enter a width or height.", "Resize and download the result."]}
      faqs={[
        { question: "Will resizing distort my image?", answer: "No. Width and height are linked to the original aspect ratio, so entering one value updates the other and the shape stays intact." },
        { question: "Can I make an image larger?", answer: "You can, but enlarging cannot add detail that was not captured, so results look softer. Resizing down keeps the most quality." },
        { question: "How is the resize quality kept high?", answer: "The tool uses a high-quality resampling step (pica) rather than a plain browser stretch, which keeps edges and text cleaner when scaling down." },
      ]}
    >
      <ImageWorkspace mode="resize" defaultFormat="image/png" />
    </ToolPageShell>
  );
}
