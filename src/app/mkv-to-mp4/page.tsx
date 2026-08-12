import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "MKV to MP4 Converter",
  description: "Convert an MKV video to MP4 locally in your browser. No upload, no account.",
  alternates: { canonical: "/mkv-to-mp4" },
};

export default function MkvToMp4Page() {
  return (
    <ToolPageShell
      title="MKV to MP4"
      description="Turn an MKV file into a widely supported MP4."
      note="Uses your browser codecs"
      slug="/mkv-to-mp4"
      steps={["Choose an MKV video.", "Keep MP4 as the output.", "Convert and download the MP4."]}
      faqs={[
        { question: "Why convert MKV to MP4?", answer: "MKV is flexible but not accepted by many players, phones, and upload forms. MP4 is far more widely supported, so converting makes the video easier to play and share." },
        { question: "Why does conversion take a while?", answer: "The video is re-encoded with your browser's codecs, so speed depends on your device and the length of the clip. Larger files take longer." },
        { question: "Is the file uploaded?", answer: "No. The MKV is converted in your browser and never leaves your device." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
