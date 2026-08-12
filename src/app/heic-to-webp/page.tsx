import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "HEIC to WebP Converter",
  description: "Convert an iPhone HEIC or HEIF photo to a small WebP file locally in your browser.",
  alternates: { canonical: "/heic-to-webp" },
};

export default function HeicToWebpPage() {
  return (
    <ToolPageShell
      title="HEIC to WebP"
      description="Turn an iPhone photo into a small web-ready WebP."
      note="No server upload"
      slug="/heic-to-webp"
      steps={["Choose a HEIC or HEIF photo.", "Set the WebP quality.", "Convert and download the WebP."]}
      faqs={[
        { question: "Why convert HEIC to WebP?", answer: "WebP keeps files small while being supported by every current browser, which makes it a good choice when the photo is headed for a website." },
        { question: "Does WebP keep quality?", answer: "At a matched setting WebP stays visually clean while being small. Raise the quality control if you want to preserve more detail." },
        { question: "Is my photo processed on a server?", answer: "No. The HEIC photo is decoded and converted in your browser and never leaves your device." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/heic,image/heif,.heic,.heif" />
    </ToolPageShell>
  );
}
