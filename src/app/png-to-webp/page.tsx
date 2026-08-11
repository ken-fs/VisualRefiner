import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = { title: "PNG to WebP Converter", description: "Convert a PNG image to WebP locally in your browser.", alternates: { canonical: "/png-to-webp" } };

export default function PngToWebpPage() {
  return <ToolPageShell title="PNG to WebP" description="Create a smaller web copy while keeping transparency." note="Processed in this tab" steps={["Choose a PNG image.", "Set the WebP quality.", "Convert and download the WebP file."]}><ImageWorkspace mode="convert" defaultFormat="image/webp" accept="image/png,.png" /></ToolPageShell>;
}
