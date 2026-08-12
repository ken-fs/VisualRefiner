import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "PNG to JPG Converter",
  description: "Convert a PNG image to JPG locally in your browser. No upload, no account.",
  alternates: { canonical: "/png-to-jpg" },
};

export default function PngToJpgPage() {
  return (
    <ToolPageShell
      title="PNG to JPG"
      description="Turn a PNG into a smaller, widely supported JPG."
      note="No server upload"
      slug="/png-to-jpg"
      steps={["Choose a PNG image.", "Set the JPG quality.", "Convert and download the JPG."]}
      faqs={[
        { question: "Why convert PNG to JPG?", answer: "JPG files are usually much smaller than PNG for photographs, which makes them faster to send and load. Convert when you do not need transparency and want a lighter file." },
        { question: "What happens to transparency?", answer: "JPG has no transparency, so any transparent areas become a solid background. Keep PNG or use WebP if you need to preserve transparency." },
        { question: "Is the PNG uploaded anywhere?", answer: "No. The conversion runs entirely in your browser, so the original image never leaves your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/png,.png" />
    </ToolPageShell>
  );
}
