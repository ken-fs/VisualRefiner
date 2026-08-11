import type { Metadata } from "next";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoToGif } from "@/components/VideoToGif";

export const metadata: Metadata = { title: "Video to GIF Converter", description: "Turn the first seconds of a short video into a looping GIF locally.", alternates: { canonical: "/video-to-gif" } };

export default function VideoToGifPage() {
  return <ToolPageShell title="Video to GIF" description="Make a short loop from the first six seconds." note="Built inside this tab" steps={["Choose a short supported video.", "Pick the width and frame rate.", "Create and download the GIF."]}><VideoToGif /></ToolPageShell>;
}
