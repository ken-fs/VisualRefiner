import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter",
  description: "Convert an iPhone HEIC or HEIF photo to JPG locally in your browser.",
  alternates: { canonical: "/heic-to-jpg" },
};

export default function HeicToJpgPage() {
  return (
    <ToolPageShell
      title="HEIC to JPG"
      description="Open an iPhone photo almost anywhere."
      note="The photo stays on your device"
      slug="/heic-to-jpg"
      steps={["Choose a HEIC or HEIF photo.", "Set the JPG quality.", "Convert and download the JPG."]}
      faqs={[
        { question: "What is a HEIC file?", answer: "HEIC is the high-efficiency image format iPhones use by default. It stores photos at good quality in a small file, but many apps and websites cannot open it, which is why converting to JPG helps." },
        { question: "Do I lose quality converting HEIC to JPG?", answer: "JPG is a lossy format, so there is a small quality trade-off. Keeping the quality near the default preserves detail while producing a widely compatible file." },
        { question: "Is my photo uploaded to convert it?", answer: "No. The HEIC photo is decoded and converted inside your browser, so it never leaves your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/heic,image/heif,.heic,.heif" />
    </ToolPageShell>
  );
}
