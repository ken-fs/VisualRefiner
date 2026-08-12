import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Convert JPG, PNG, WebP, HEIC, and HEIF images locally in your browser.",
  alternates: { canonical: "/image-converter" },
};

export default function ImageConverterPage() {
  return (
    <ToolPageShell
      title="Image converter"
      description="Change the format. Keep the file on your device."
      note="Local browser processing"
      slug="/image-converter"
      steps={["Choose a JPG, PNG, WebP, or HEIC file.", "Pick the output format and quality.", "Convert it and download the new file."]}
      faqs={[
        { question: "Which formats can I convert between?", answer: "You can convert JPG, PNG, and WebP freely, and bring in HEIC or HEIF photos from an iPhone. Pick the output format that fits where the image will be used." },
        { question: "Will converting to JPG lose transparency?", answer: "Yes. JPG has no transparency, so transparent areas become a solid background. Keep PNG or WebP if you need to preserve transparency." },
        { question: "Is anything uploaded to a server?", answer: "No. The conversion happens entirely in your browser, so the original file stays on your device." },
      ]}
    >
      <ImageWorkspace mode="convert" />
    </ToolPageShell>
  );
}
