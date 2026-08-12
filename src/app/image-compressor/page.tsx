import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Compress JPG and WebP images locally with a simple quality control.",
  alternates: { canonical: "/image-compressor" },
};

export default function ImageCompressorPage() {
  return (
    <ToolPageShell
      title="Image compressor"
      description="Reduce file size without sending the image away."
      note="No upload required"
      slug="/image-compressor"
      steps={["Choose an image from your device.", "Adjust the quality percentage.", "Compare the size and download the result."]}
      faqs={[
        { question: "Does compressing reduce image quality?", answer: "Lossy formats like JPG and WebP trade some detail for a smaller file. Starting near 82% quality keeps photos looking clean while cutting most of the size. Lower the quality only until you can see the difference." },
        { question: "Are my images uploaded anywhere?", answer: "No. Compression runs in your browser using the Canvas API, and the file is never sent to a server. Closing the tab clears the working session." },
        { question: "Which format gives the smallest file?", answer: "WebP is usually smaller than JPG at the same visible quality, so this tool defaults to WebP. Use the JPG option if you need the widest possible compatibility." },
      ]}
    >
      <ImageWorkspace mode="compress" defaultFormat="image/webp" />
    </ToolPageShell>
  );
}
