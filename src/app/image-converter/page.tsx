import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Converter",
  description: "Convert JPG, PNG, WebP, HEIC, and HEIF images locally in your browser.",
  alternates: { canonical: "/image-converter" },
};

export default function ImageConverterPage() {
  return <ToolPageShell title="Image converter" description="Change the format. Keep the file on your device." note="Local browser processing" steps={["Choose a JPG, PNG, WebP, or HEIC file.", "Pick the output format and quality.", "Convert it and download the new file."]}><ImageWorkspace mode="convert" /></ToolPageShell>;
}
