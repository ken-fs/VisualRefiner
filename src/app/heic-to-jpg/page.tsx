import type { Metadata } from "next";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "HEIC to JPG Converter",
  description: "Convert an iPhone HEIC or HEIF photo to JPG locally in your browser.",
  alternates: { canonical: "/heic-to-jpg" },
};

export default function HeicToJpgPage() {
  return <ToolPageShell title="HEIC to JPG" description="Open an iPhone photo almost anywhere." note="The photo stays on your device" steps={["Choose a HEIC or HEIF photo.", "Set the JPG quality.", "Convert and download the JPG."]}><ImageWorkspace mode="convert" defaultFormat="image/jpeg" accept="image/heic,image/heif,.heic,.heif" /></ToolPageShell>;
}
