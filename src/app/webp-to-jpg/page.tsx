import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "WebP to JPG Converter",
  description: "Convert a WebP image to JPG locally in your browser. Widely supported, no upload.",
  alternates: { canonical: "/webp-to-jpg" },
};

export default function WebpToJpgPage() {
  return (
    <ToolPageShell
      title="WebP to JPG"
      description="Turn a WebP into a widely supported JPG."
      note="Local browser processing"
      slug="/webp-to-jpg"
      steps={["Choose a WebP image.", "Set the JPG quality.", "Convert and download the JPG."]}
      faqs={[
        { question: "Why convert WebP to JPG?", answer: "JPG is accepted by virtually every app, editor, and upload form. If something refuses to open a WebP, converting to JPG solves it." },
        { question: "What happens to transparency?", answer: "JPG cannot store transparency, so any transparent areas become a solid background. Convert to PNG instead if you need to keep transparency." },
        { question: "Is anything uploaded?", answer: "No. The WebP is converted in your browser and is never sent to a server." },
      ]}
    >
      <ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/webp,.webp" />
    </ToolPageShell>
  );
}
