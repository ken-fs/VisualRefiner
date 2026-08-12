import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = { title: "JPG to WebP Converter", description: "Convert a JPG photo to WebP locally in your browser.", alternates: { canonical: "/jpg-to-webp" } };

export default function JpgToWebpPage() {
  return (
    <ToolPageShell
      title="JPG to WebP"
      description="Make a web-friendly copy of a JPG photo."
      note="No server upload"
      slug="/jpg-to-webp"
      steps={["Choose a JPG photo.", "Set the WebP quality.", "Convert and download the WebP file."]}
      faqs={[
        { question: "Why convert JPG to WebP?", answer: "WebP usually produces a smaller file than JPG at the same visible quality, which means faster page loads. It is supported by all current browsers." },
        { question: "Is WebP lower quality than JPG?", answer: "At a matched setting WebP typically looks the same or better while being smaller. You can raise the quality control if you want to keep more detail." },
        { question: "Does the JPG leave my device?", answer: "No. The conversion runs in your browser and the original JPG is never uploaded." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/jpeg,.jpg,.jpeg" />
    </ToolPageShell>
  );
}
