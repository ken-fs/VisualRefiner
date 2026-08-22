import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/remove-image-metadata")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function RemoveImageMetadataGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "What is EXIF metadata?", answer: "EXIF is a block of data cameras and phones embed inside a photo file. It can include the date and time, the camera and lens, exposure settings, and — most sensitively — GPS coordinates of where the photo was taken. It rides along invisibly when you share the image." },
        { question: "Why remove it?", answer: "Privacy is the main reason. A photo posted online can quietly reveal your home or a location through its GPS tag, plus the device you used. Stripping metadata also shaves a little off the file size. There is rarely a downside for images you are sharing publicly." },
        { question: "How do you remove metadata without special software?", answer: "Re-saving the image through the browser's canvas produces a fresh file built only from the pixels, so none of the original EXIF, GPS, or thumbnail data carries over. That is exactly what the remove-metadata tool does — locally, with no upload." },
        { question: "Does removing metadata change how the photo looks?", answer: "No. Metadata is separate from the pixels. Re-encoding at high quality keeps the image visually the same while dropping the embedded data. One caveat: the orientation tag is metadata too, so a photo that relied on it is baked to its displayed orientation." },
        { question: "Do screenshots and downloads have EXIF?", answer: "Screenshots usually carry little or none, and images already scrubbed by a platform may have been stripped on upload. Camera and phone photos are where GPS and device data most often hide, so those are worth checking before you share." },
        { question: "Is the photo uploaded to check or clean it?", answer: "No. Both reading and removing happen in your browser tab, so the image never leaves your device." },
      ]}
    >
      <p>
        Every photo is two things at once: the pixels you see, and a block of hidden data describing how and where it
        was made. That hidden block is <strong>metadata</strong>, and on camera and phone photos it can say far more
        than you intend to share.
      </p>

      <h2>What a photo can carry</h2>
      <ul>
        <li><strong>EXIF</strong> — date and time, camera and lens model, and exposure settings like ISO and shutter speed.</li>
        <li><strong>GPS</strong> — the exact latitude and longitude where the shot was taken. This is the sensitive one.</li>
        <li><strong>Orientation</strong> — a tag telling viewers how to rotate the image.</li>
        <li><strong>Thumbnails and edit history</strong> — some files embed a small preview or a trail from editing software.</li>
      </ul>

      <h2>Why it matters</h2>
      <p>
        A single photo posted publicly can reveal your home address through its GPS tag, or tie a set of images to the
        same device. Removing metadata closes that gap before you share. It also trims a little file size, and it
        almost never costs you anything for an image headed to the public web.
      </p>

      <h2>How removal actually works</h2>
      <p>
        You do not need a metadata editor. When an image is drawn to a canvas and re-encoded, the new file is built
        only from the pixel data — the original EXIF, GPS, and thumbnail blocks simply do not come along. The result
        looks identical and carries none of the embedded history. The one thing to know: the orientation tag is
        metadata too, so the tool bakes the photo to its displayed orientation as it strips the rest.
      </p>

      <h2>Do it locally</h2>
      <p>
        The <Link href="/remove-metadata">remove-metadata tool</Link> reads whether a photo carries EXIF or GPS data
        and re-saves a clean copy, entirely in your browser — nothing is uploaded. If you are also changing format or
        size, the <Link href="/image-converter">image converter</Link> and{" "}
        <Link href="/image-compressor">compressor</Link> re-encode too, so their output is already metadata-free.
      </p>
    </GuideShell>
  );
}
