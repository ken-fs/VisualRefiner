import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "JPG to PNG Converter",
  description: "Convert a JPG photo to a lossless PNG locally in your browser.",
  alternates: { canonical: "/jpg-to-png" },
};

export default function JpgToPngPage() {
  return (
    <ToolPageShell
      title="JPG to PNG"
      description="Make a lossless PNG copy of a JPG image."
      note="Local browser processing"
      slug="/jpg-to-png"
      steps={["Choose a JPG photo.", "Convert to PNG.", "Download the PNG file."]}
      faqs={[
        { question: "Does JPG to PNG improve quality?", answer: "No. PNG is lossless, but it cannot restore detail the JPG already discarded. Converting is useful when you need a lossless format for editing or transparency support going forward, not to recover lost quality." },
        { question: "Will the PNG be larger than the JPG?", answer: "Usually yes. PNG stores every pixel without lossy compression, so photographs become noticeably larger than the original JPG." },
        { question: "Is my photo uploaded?", answer: "No. The conversion happens in your browser and the file stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/png" accept="image/jpeg,.jpg,.jpeg" />
    </ToolPageShell>
  );
}
