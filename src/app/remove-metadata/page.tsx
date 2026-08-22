import type { Metadata } from "next";
import Link from "next/link";
import { MetadataWorkspace } from "@/components/MetadataWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Remove Image Metadata (EXIF & GPS)",
  description: "Strip EXIF, GPS, and other hidden metadata from a JPG, PNG, or WebP in your browser. See what a photo carries and download a clean copy — no upload, it stays on your device.",
  alternates: { canonical: "/remove-metadata" },
};

export default function RemoveMetadataPage() {
  return (
    <ToolPageShell
      title="Remove image metadata"
      description="Strip EXIF and GPS data from a photo before you share it."
      note="Read and cleaned locally"
      slug="/remove-metadata"
      steps={["Choose an image.", "See whether it carries EXIF or GPS data.", "Remove metadata and download the clean copy."]}
      explainer={
        <>
          <h2 id="learn-title">What your photos quietly carry</h2>
          <p>
            Cameras and phones embed a block of data inside every photo: the date and time, the device and
            settings, and often the <strong>GPS coordinates</strong> of where it was taken. That data rides along
            when you share the image, and a single public post can reveal your home or a location you would rather
            keep private.
          </p>
          <p>
            This tool reads whether a photo carries an EXIF block and a GPS tag — locally, without uploading it —
            and then writes a clean copy that contains only the pixels. See the{" "}
            <Link href="/guides/remove-image-metadata">metadata guide</Link> for the full picture of what gets
            stored and why it matters.
          </p>
          <h3>How the removal works</h3>
          <p>
            The image is drawn to a canvas and re-encoded, so the new file is rebuilt from pixels alone — none of
            the original EXIF, GPS, or embedded thumbnail comes across. The picture looks identical. One note: the
            orientation tag is metadata too, so the clean copy is baked to the orientation you see on screen.
          </p>
        </>
      }
      faqs={[
        { question: "What metadata does this remove?", answer: "All of it. Re-encoding the image through the canvas rebuilds the file from pixels only, so EXIF (date, camera, settings), GPS location, and any embedded thumbnail are dropped from the output." },
        { question: "How does it know if my photo has GPS data?", answer: "It reads the JPEG's Exif segment in your browser and checks for a GPS tag, reporting whether one is present. The check is local — the file is never uploaded to detect anything." },
        { question: "Will the photo look different afterwards?", answer: "No. Metadata is separate from the pixels, so re-encoding at high quality keeps the image visually the same. The only change is that the orientation tag is applied and then removed, so the file is upright on its own." },
        { question: "Do PNG and WebP have EXIF too?", answer: "They can carry some metadata, though GPS-tagged EXIF is most common on JPEG camera photos. Whatever the format, re-encoding here strips the embedded data either way." },
        { question: "Is the image uploaded to clean it?", answer: "No. Both reading the metadata and writing the clean copy happen entirely in your browser tab, so the photo never leaves your device." },
      ]}
    >
      <MetadataWorkspace />
    </ToolPageShell>
  );
}
