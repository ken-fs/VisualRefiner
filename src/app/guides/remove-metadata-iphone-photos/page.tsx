import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/remove-metadata-iphone-photos")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function RemoveMetadataIphoneGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "Can the iPhone remove location data when sharing?", answer: "Yes. In the share sheet, tap Options at the top and switch off Location, or All Photos Data to strip everything embedded. It applies only to that share, so you have to repeat it every time — and it is easy to forget." },
        { question: "How do I stop my iPhone recording location on new photos?", answer: "Go to Settings > Privacy & Security > Location Services > Camera and choose Never. Photos taken from then on carry no GPS tag. Existing photos keep theirs until you remove it." },
        { question: "Does removing metadata reduce photo quality?", answer: "No. Metadata lives alongside the pixels, not in them. Stripping it losslessly leaves the image byte-for-byte identical in appearance. Converting formats also drops metadata, at the cost of a re-encode." },
        { question: "Does taking a screenshot remove the metadata?", answer: "Mostly, yes — a screenshot is a fresh file without the original EXIF or GPS. The downside is real: you lose resolution, HDR, and quality. It is a hack, not a cleanup method." },
        { question: "Do Messages, WhatsApp, or Instagram strip metadata for me?", answer: "Most big platforms strip or re-encode photos on their servers before showing them publicly — but you still hand the original, location included, to that platform first. If the goal is privacy, strip before the file leaves your hands." },
        { question: "Is my photo uploaded to check or clean it here?", answer: "No. Reading and removal happen in your browser tab. The photo never leaves your device — which is rather the point of a privacy tool." },
      ]}
    >
      <p>
        Every iPhone photo carries a hidden label: the exact time, the phone model and lens, and — unless you have
        turned it off — the <strong>GPS coordinates of where you stood</strong>. That label travels with the file
        wherever you send it. Here is how to see it, remove it, and stop recording it.
      </p>

      <h2>What your iPhone embeds in every shot</h2>
      <ul>
        <li><strong>GPS location</strong> — precise latitude and longitude. A photo shared from home quietly tells the recipient your address.</li>
        <li><strong>Device details</strong> — iPhone model, lens, and software version.</li>
        <li><strong>Capture settings</strong> — exposure, ISO, whether flash fired.</li>
        <li><strong>Date and time</strong> — down to the second.</li>
      </ul>
      <p>
        You can see all of this yourself: open a photo in the Photos app and swipe up (or tap the ⓘ button). The map
        under the shot is the part strangers would see too.
      </p>

      <h2>Option 1: strip it in the share sheet</h2>
      <p>
        iOS has a built-in answer. Select a photo, tap share, then tap <strong>Options</strong> at the top of the
        share sheet. Switch off <strong>Location</strong> — or <strong>All Photos Data</strong> to drop the edit
        history and depth data as well. The copy that goes out is cleaned.
      </p>
      <p>
        Two catches: it only applies to that one share, and it does nothing for photos you move off the phone any
        other way — AirDrop to your Mac with full data, cloud sync, or uploads through a browser form all carry the
        original metadata.
      </p>

      <h2>Option 2: stop recording it going forward</h2>
      <p>
        If you never want the tag in the first place: <strong>Settings &gt; Privacy &amp; Security &gt; Location
        Services &gt; Camera &gt; Never</strong>. New photos will have no GPS data at all. The trade-off is real —
        you lose location-based memories and search in Photos — and it does nothing for your existing library.
      </p>

      <h2>Option 3: clean the file itself, anywhere</h2>
      <p>
        When a photo is headed somewhere you do not control — a marketplace listing, a forum, a form upload, an email
        to a stranger — the reliable move is to strip the metadata from the file before it leaves your hands.
      </p>
      <p>
        For JPEG, PNG, and WebP photos, the <Link href="/remove-metadata">remove-metadata tool</Link> shows you
        exactly what is embedded and saves a clean copy, entirely in your browser — nothing is uploaded, and the
        pixels are untouched.
      </p>
      <p>
        iPhone photos are usually <strong>HEIC</strong>, which browsers cannot edit directly. The fix doubles as the
        cleanup: run the photo through the <Link href="/heic-to-jpg">HEIC to JPG converter</Link>. Conversion
        re-encodes the image from its pixels, so the JPG that comes out carries none of the original EXIF or GPS
        data. If you would rather shoot JPEG natively, set <strong>Settings &gt; Camera &gt; Formats &gt; Most
        Compatible</strong> — then the strip tool works on your photos directly.
      </p>

      <h2>A quick rule of thumb</h2>
      <p>
        Sharing with friends through iMessage with the share-sheet toggle is fine. Publishing anywhere public, or
        sending to someone you do not know, deserves a stripped file. The general mechanics of what metadata is and
        why re-encoding removes it are covered in{" "}
        <Link href="/guides/remove-image-metadata">how to remove metadata from a photo</Link>.
      </p>
    </GuideShell>
  );
}
