import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "HEIC to PNG Converter",
  description: "Convert an iPhone HEIC or HEIF photo to a lossless PNG locally in your browser.",
  alternates: { canonical: "/heic-to-png" },
};

export default function HeicToPngPage() {
  return (
    <ToolPageShell
      title="HEIC to PNG"
      description="Turn an iPhone photo into a lossless PNG."
      note="The photo stays on your device"
      slug="/heic-to-png"
      steps={["Choose a HEIC or HEIF photo.", "Convert to PNG.", "Download the PNG file."]}
      faqs={[
        { question: "When should I pick PNG over JPG for HEIC?", answer: "Choose PNG when you want a lossless copy or need transparency support later. For a smaller, more shareable file, HEIC to JPG is usually the better choice." },
        { question: "Will the PNG be large?", answer: "Likely yes. PNG is lossless, so a converted photo can be considerably larger than the original HEIC. Compress it afterward if size matters." },
        { question: "Is my photo uploaded?", answer: "No. The HEIC photo is decoded and converted inside your browser and never leaves your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/png" accept="image/heic,image/heif,.heic,.heif" />
    </ToolPageShell>
  );
}
