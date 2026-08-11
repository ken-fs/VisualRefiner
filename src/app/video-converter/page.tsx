import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = { title: "Video Converter", description: "Convert supported video files to MP4 or WebM in your browser.", alternates: { canonical: "/video-converter" } };

export default function VideoConverterPage() {
  return <ToolPageShell title="Video converter" description="Convert a supported video without an upload queue." note="Uses your browser codecs" steps={["Choose a video from your device.", "Pick MP4 or WebM.", "Convert and download the result."]}><VideoConverter /></ToolPageShell>;
}
