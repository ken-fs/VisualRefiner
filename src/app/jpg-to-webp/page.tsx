import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = { title: "JPG to WebP Converter", description: "Convert a JPG photo to WebP locally in your browser.", alternates: { canonical: "/jpg-to-webp" } };

export default function JpgToWebpPage() {
  return <ToolPageShell title="JPG to WebP" description="Make a web-friendly copy of a JPG photo." note="No server upload" steps={["Choose a JPG photo.", "Set the WebP quality.", "Convert and download the WebP file."]}><ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/jpeg,.jpg,.jpeg" /></ToolPageShell>;
}
