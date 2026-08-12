import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "WebM to MP4 Converter",
  description: "Convert a WebM video to MP4 locally in your browser. No upload, no account.",
  alternates: { canonical: "/webm-to-mp4" },
};

export default function WebmToMp4Page() {
  return (
    <ToolPageShell
      title="WebM to MP4"
      description="Turn a WebM file into a widely supported MP4."
      note="Uses your browser codecs"
      slug="/webm-to-mp4"
      steps={["Choose a WebM video.", "Keep MP4 as the output.", "Convert and download the MP4."]}
      faqs={[
        { question: "Why convert WebM to MP4?", answer: "WebM is great on the web but many editors, phones, and messaging apps expect MP4. Converting makes the video play in more places." },
        { question: "Will I lose quality?", answer: "The video is re-encoded, so there is some compression, but at normal settings most clips look nearly identical." },
        { question: "Is my video sent to a server?", answer: "No. Conversion runs in your browser with WebCodecs, so the file stays on your device." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
