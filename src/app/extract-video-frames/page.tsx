import type { Metadata } from "next";
import { FrameExtractor } from "@/components/FrameExtractor";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = { title: "Extract Video Frames", description: "Extract evenly spaced PNG frames from a video in your browser.", alternates: { canonical: "/extract-video-frames" } };

export default function ExtractFramesPage() {
  return (
    <ToolPageShell
      title="Extract video frames"
      description="Turn a video into a clean contact sheet."
      note="Frames stay on your device"
      slug="/extract-video-frames"
      steps={["Choose a supported video.", "Select the number of frames.", "Extract and download each PNG."]}
      faqs={[
        { question: "What format are the extracted frames?", answer: "Frames are saved as PNG images, which are lossless and keep the exact pixels from the video at each captured moment." },
        { question: "How are the frames chosen?", answer: "The tool captures evenly spaced frames across the video, so a higher count gives you more moments spread through the clip." },
        { question: "Are frames processed on a server?", answer: "No. The video is read and frames are captured in your browser, so nothing is uploaded." },
      ]}
    >
      <FrameExtractor />
    </ToolPageShell>
  );
}
