import type { Metadata } from "next";
import { FrameExtractor } from "@/components/FrameExtractor";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = { title: "Extract Video Frames", description: "Extract evenly spaced PNG frames from a video in your browser.", alternates: { canonical: "/extract-video-frames" } };

export default function ExtractFramesPage() {
  return <ToolPageShell title="Extract video frames" description="Turn a video into a clean contact sheet." note="Frames stay on your device" steps={["Choose a supported video.", "Select the number of frames.", "Extract and download each PNG."]}><FrameExtractor /></ToolPageShell>;
}
