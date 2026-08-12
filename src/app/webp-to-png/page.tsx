import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "WebP to PNG Converter",
  description: "Convert a WebP image to PNG locally in your browser. Opens anywhere, keeps transparency.",
  alternates: { canonical: "/webp-to-png" },
};

export default function WebpToPngPage() {
  return (
    <ToolPageShell
      title="WebP to PNG"
      description="Turn a WebP into a PNG that opens anywhere."
      note="No server upload"
      slug="/webp-to-png"
      steps={["Choose a WebP image.", "Convert to PNG.", "Download the PNG file."]}
      faqs={[
        { question: "Why convert WebP to PNG?", answer: "Some older apps and tools cannot open WebP. Converting to PNG produces a lossless file that opens almost everywhere and keeps any transparency." },
        { question: "Does converting keep transparency?", answer: "Yes. PNG supports transparency, so transparent areas in the WebP are preserved." },
        { question: "Is the WebP uploaded to convert it?", answer: "No. The image is decoded and converted in your browser, so it never leaves your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/png" accept="image/webp,.webp" />
    </ToolPageShell>
  );
}
