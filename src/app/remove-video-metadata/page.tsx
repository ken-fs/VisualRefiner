import type { Metadata } from "next";
import Link from "next/link";
import { VideoMetadataWorkspace } from "@/components/VideoMetadataWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Remove Video Metadata (MP4, MOV, MKV, WebM)",
  description: "Strip hidden metadata from a video file in your browser — title, device info, editing history, and AI-generation tags. Streams are copied untouched, no upload, no re-encoding.",
  alternates: { canonical: "/remove-video-metadata" },
};

export default function RemoveVideoMetadataPage() {
  return (
    <ToolPageShell
      title="Remove video metadata"
      description="See what a video file quietly carries, then download a clean copy."
      note="Read and cleaned locally"
      slug="/remove-video-metadata"
      steps={["Choose a video.", "See which container metadata it carries.", "Remove it and download the clean copy."]}
      explainer={
        <>
          <h2 id="learn-title">Your videos have a paper trail too</h2>
          <p>
            Photos get all the attention, but video containers hide their own data: a title, the device or app
            that wrote the file, creation dates, editing history, and sometimes cover art. AI video tools add
            another layer — several platforms embed an <strong>AIGC label</strong> or other provenance tags that
            mark the clip as machine-made.
          </p>
          <h3>Cleaned without touching the video itself</h3>
          <p>
            This tool repacks the container: the video and audio streams are copied over bit-for-bit, and only the
            descriptive metadata is left behind. No re-encoding, so a 4K clip costs you seconds, not minutes, and
            the picture is exactly the same. For the image version, see{" "}
            <Link href="/remove-metadata">remove image metadata</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "What metadata does a video carry?", answer: "Depending on the container: a title, artist and comment fields, creation date, the writing application or device, embedded cover images, and vendor-specific tags. AI video platforms may also embed provenance labels (such as China's TC260 AIGC tag) marking the clip as AI-generated." },
        { question: "Does cleaning re-encode the video?", answer: "No. The video and audio streams are copied packet-for-packet into a fresh container — only the metadata is dropped. That means no quality loss and a much faster process than conversion." },
        { question: "Which formats are supported?", answer: "MP4, MOV (QuickTime), MKV (Matroska), and WebM. The clean copy keeps the same container as the input." },
        { question: "Will it remove an AI-generation label?", answer: "Container-level AI labels are metadata, so they are dropped along with everything else. Note this only covers data stored in the container — it cannot detect or remove invisible pixel watermarks, and you should only clean videos you created or own." },
        { question: "Is the video uploaded anywhere?", answer: "No. Inspection and cleaning both run in your browser tab; the file never leaves your device." },
      ]}
    >
      <VideoMetadataWorkspace />
    </ToolPageShell>
  );
}
