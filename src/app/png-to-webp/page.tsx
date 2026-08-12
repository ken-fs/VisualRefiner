import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = { title: "PNG to WebP Converter", description: "Convert a PNG image to WebP locally in your browser.", alternates: { canonical: "/png-to-webp" } };

export default function PngToWebpPage() {
  return (
    <ToolPageShell
      title="PNG to WebP"
      description="Create a smaller web copy while keeping transparency."
      note="Processed in this tab"
      slug="/png-to-webp"
      steps={["Choose a PNG image.", "Set the WebP quality.", "Convert and download the WebP file."]}
      faqs={[
        { question: "Does WebP keep PNG transparency?", answer: "Yes. WebP supports transparency, so transparent PNG areas are preserved in the converted file." },
        { question: "How much smaller will the file be?", answer: "It depends on the image, but WebP is often significantly smaller than PNG for photos and detailed graphics. Flat graphics with few colors may see a smaller reduction." },
        { question: "Is the PNG uploaded anywhere?", answer: "No. The image is converted locally in your browser and is never sent to a server." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/png,.png" />
    </ToolPageShell>
  );
}
