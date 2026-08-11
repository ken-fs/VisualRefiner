import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Compressor",
  description: "Compress JPG and WebP images locally with a simple quality control.",
  alternates: { canonical: "/image-compressor" },
};

export default function ImageCompressorPage() {
  return <ToolPageShell title="Image compressor" description="Reduce file size without sending the image away." note="No upload required" steps={["Choose an image from your device.", "Adjust the quality percentage.", "Compare the size and download the result."]}><ImageWorkspace mode="compress" defaultFormat="image/webp" /></ToolPageShell>;
}
