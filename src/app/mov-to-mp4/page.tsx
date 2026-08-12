import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "MOV to MP4 Converter",
  description: "Convert a MOV video to MP4 in your browser. No upload queue, no account.",
  alternates: { canonical: "/mov-to-mp4" },
};

export default function MovToMp4Page() {
  return (
    <ToolPageShell
      title="MOV to MP4"
      description="Turn a QuickTime MOV into a widely supported MP4."
      note="Uses your browser codecs"
      slug="/mov-to-mp4"
      steps={["Choose a MOV video.", "Keep MP4 as the output.", "Convert and download the MP4."]}
      faqs={[
        { question: "Why convert MOV to MP4?", answer: "MOV is Apple's QuickTime format and does not always play smoothly outside Apple devices. MP4 plays almost everywhere, so it is the safer choice for sharing and uploading." },
        { question: "Does converting reduce quality?", answer: "The tool re-encodes the video, so there is some compression, but at normal settings the difference is hard to notice for most clips." },
        { question: "Is my video uploaded?", answer: "No. The file is converted inside the tab using your browser's WebCodecs, so it is not sent to any server." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
