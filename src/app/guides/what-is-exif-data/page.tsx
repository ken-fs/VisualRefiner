import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/what-is-exif-data")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function WhatIsExifDataGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "Is EXIF the same as metadata?", answer: "EXIF is one kind of metadata — the block cameras and phones write at capture. There are others (XMP from editing software, IPTC from newsrooms). Metadata is the umbrella term; EXIF is the most common slice of it." },
        { question: "Can EXIF data be edited or faked?", answer: "Easily. Ordinary free tools can rewrite any field, so EXIF is not proof of when or where a photo was taken. Treat it as a label, not a lock." },
        { question: "Does EXIF make a file bigger?", answer: "A little — typically a few kilobytes, sometimes tens. Stripping it trims that off, but nobody should strip metadata for the size savings alone." },
        { question: "Do screenshots have EXIF?", answer: "Almost none. A screenshot is a freshly created file, so the original camera data does not carry over. The trade is real, though: you lose resolution and quality." },
        { question: "Can you see EXIF data just by looking at the photo?", answer: "No — that is what makes it easy to forget. It rides invisibly inside the file. You have to open the details panel or a metadata reader to know it is there." },
        { question: "Does removing EXIF change image quality?", answer: "Not at all. EXIF sits next to the pixel data, not inside it. A stripped photo is visually identical to the original." },
      ]}
    >
      <p>
        The first time it happens is a small shock. You swipe up on a photo and there it is: a map of exactly where
        you were, the lens you used, the second you pressed the shutter. You never wrote any of that. Your camera
        did — it has been keeping notes on every photo you have ever taken. Those notes are called{" "}
        <strong>EXIF</strong>.
      </p>

      <h2>What EXIF actually is</h2>
      <p>
        EXIF stands for <strong>Exchangeable Image File Format</strong> — a standard block of data that cameras and
        phones write into image files at the moment of capture. It exists for a kind reason: film photographers used
        to carry little notebooks, jotting down the settings behind every frame so they could learn from them. The
        digital camera simply started keeping the notebook for you.
      </p>

      <h2>What is inside a typical phone photo</h2>
      <ul>
        <li><strong>Date and time</strong> — down to the second.</li>
        <li><strong>Device</strong> — the phone or camera model, the lens, the software version.</li>
        <li><strong>Exposure settings</strong> — ISO, shutter speed, aperture, whether the flash fired.</li>
        <li><strong>Orientation</strong> — which way up the photo should be shown.</li>
        <li><strong>GPS coordinates</strong> — where the shot was taken, if location is enabled. The sensitive one.</li>
      </ul>

      <h2>Why it exists — and when it turns against you</h2>
      <p>
        None of this was designed to expose you. EXIF is why your library can sort a decade of photos by day, why you
        can search by place, why photographers can look at a shot they love and see exactly how it was made. In your
        own archive, it is a gift.
      </p>
      <p>
        The trouble only starts when the file leaves your hands. A photo posted publicly can quietly broadcast your
        home address through its GPS tag — we walk through that scenario in{" "}
        <Link href="/guides/remove-gps-location-from-photos">how to remove GPS location from your photos</Link>.
        Editing software adds its own trail on top. The notebook meant for you gets handed to everyone.
      </p>

      <h2>How to see what a photo is carrying</h2>
      <p>
        On an iPhone, swipe up on any photo. On a Mac, open it in Preview and press Cmd-I; on Windows, right-click
        and open Properties &gt; Details. Or drop the file into the{" "}
        <Link href="/remove-metadata">remove-metadata tool</Link> — it lists every field it finds, right in your
        browser, without uploading anything.
      </p>

      <h2>And how to let it go</h2>
      <p>
        When a photo is headed somewhere public, stripping its EXIF takes seconds and costs nothing — the pixels are
        untouched. The how, and what happens behind the scenes, is covered in{" "}
        <Link href="/guides/remove-image-metadata">how to remove metadata from a photo</Link>.
      </p>
      <p>
        EXIF is a good servant and a bad broadcaster. Keep it at home.
      </p>
    </GuideShell>
  );
}
