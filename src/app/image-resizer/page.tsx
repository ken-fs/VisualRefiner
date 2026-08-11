import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Image Resizer",
  description: "Resize an image locally while keeping its original aspect ratio.",
  alternates: { canonical: "/image-resizer" },
};

export default function ImageResizerPage() {
  return <ToolPageShell title="Image resizer" description="Set a new width or height. The shape stays intact." note="High-quality local resize" steps={["Choose an image.", "Enter a width or height.", "Resize and download the result."]}><ImageWorkspace mode="resize" defaultFormat="image/png" /></ToolPageShell>;
}
