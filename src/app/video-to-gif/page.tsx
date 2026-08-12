import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoToGif } from "@/components/VideoToGif";

export const metadata: Metadata = { title: "Video to GIF Converter", description: "Turn the first seconds of a short video into a looping GIF locally.", alternates: { canonical: "/video-to-gif" } };

export default function VideoToGifPage() {
  return (
    <ToolPageShell
      title="Video to GIF"
      description="Make a short loop from the first six seconds."
      note="Built inside this tab"
      slug="/video-to-gif"
      steps={["Choose a short supported video.", "Pick the width and frame rate.", "Create and download the GIF."]}
      faqs={[
        { question: "Why only the first six seconds?", answer: "GIF files grow quickly with length, so the tool focuses on the opening seconds to keep the loop small and shareable." },
        { question: "What width and frame rate should I pick?", answer: "A smaller width and a lower frame rate produce a smaller GIF. Start at 480 px and 8 fps, then raise them if the loop needs to be smoother or larger." },
        { question: "Is the video uploaded to make the GIF?", answer: "No. The GIF is built in your browser from the local video, so the file never leaves your device." },
      ]}
    >
      <VideoToGif />
    </ToolPageShell>
  );
}
