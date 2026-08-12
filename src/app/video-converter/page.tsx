import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = { title: "Video Converter", description: "Convert supported video files to MP4 or WebM in your browser.", alternates: { canonical: "/video-converter" } };

export default function VideoConverterPage() {
  return (
    <ToolPageShell
      title="Video converter"
      description="Convert a supported video without an upload queue."
      note="Uses your browser codecs"
      slug="/video-converter"
      steps={["Choose a video from your device.", "Pick MP4 or WebM.", "Convert and download the result."]}
      faqs={[
        { question: "Should I choose MP4 or WebM?", answer: "MP4 plays almost everywhere, so it is the safe default for sharing. WebM is well suited to modern web playback and can be smaller. Pick MP4 unless you specifically need WebM." },
        { question: "Why does conversion speed vary?", answer: "The video is processed with your browser's built-in WebCodecs, so speed depends on your own device rather than a shared server. Larger clips take longer." },
        { question: "Is my video uploaded?", answer: "No. The file is converted inside the tab and is not sent to any server." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
