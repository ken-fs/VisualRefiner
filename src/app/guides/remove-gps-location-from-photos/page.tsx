import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/remove-gps-location-from-photos")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function RemoveGpsLocationGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "How accurate is the GPS location in a photo?", answer: "Usually within a few meters — the same positioning your maps app uses. That is enough to identify a house, a school gate, or a desk by a window." },
        { question: "Does AirDrop keep the location?", answer: "Yes, by default AirDrop sends the original file with its metadata intact. There is an Options toggle to strip it, but you have to remember it every time." },
        { question: "If a platform strips location on upload, am I protected?", answer: "The copy the public sees is cleaned, but you already handed the original — location included — to that platform. The question becomes whether you trust them with it, forever." },
        { question: "Can GPS data in a photo be faked?", answer: "Yes. Metadata is editable with ordinary tools, so a location tag is not proof of where a photo was taken. It is a label, not a lock." },
        { question: "Does removing GPS data change the photo itself?", answer: "No. The location tag lives next to the pixels, not in them. A stripped photo looks exactly the same." },
        { question: "Is my photo uploaded to check or remove the location?", answer: "No. The check and the removal happen in your browser tab. The photo never leaves your device." },
      ]}
    >
      <p>
        You photograph the old bike leaning in your driveway and post it for sale. The picture is harmless — a bike,
        some pavement, afternoon light. The file is not. Tucked inside it is the exact spot where you were standing,
        accurate to a few meters. Everyone who downloads that photo can find your garage.
      </p>

      <h2>The part you never see</h2>
      <p>
        When your phone takes a picture, it quietly writes the GPS coordinates into the file — latitude and
        longitude, the same precision your maps app gets. None of it shows in the image. It sits in the metadata,
        riding along every time the photo is copied, mailed, or uploaded.
      </p>
      <p>
        Most of the time it is harmless, even useful — it is how your photo library draws that map of everywhere you
        have been. The problem is only that the file does not know the difference between your library and a
        stranger&apos;s download folder.
      </p>

      <h2>Who this touches most</h2>
      <ul>
        <li><strong>Anyone selling something online.</strong> The buyer now knows where the bike — and you — live.</li>
        <li><strong>Parents.</strong> A first-day-of-school photo can carry the school gate&apos;s coordinates, and a kitchen photo carries home.</li>
        <li><strong>Anyone dating online.</strong> A photo from your balcony is a neighborhood, give or take a street.</li>
        <li><strong>Anyone with a safety concern.</strong> For someone being followed, this is not paranoia — location tags are exactly the gap that needs closing, every time, without relying on memory.</li>
        <li><strong>Travelers posting in real time.</strong> A beach photo with today&apos;s coordinates also says: the house is empty.</li>
      </ul>

      <h2>But don&apos;t apps strip it for me?</h2>
      <p>
        Many large platforms re-encode photos before showing them publicly, which drops the metadata. Two problems.
        First, you have already handed the original — location and all — to the platform, and you have no say in what
        they keep. Second, plenty of channels strip nothing at all: email attachments, cloud drive links, forum
        uploads, marketplace messages, AirDrop with default settings. The only copy you truly control is the one you
        clean yourself.
      </p>

      <h2>Check a photo before it goes out</h2>
      <p>
        On the iPhone, open the photo and swipe up — if there is a map, there is a location tag. For any JPEG, PNG,
        or WebP file, the <Link href="/remove-metadata">remove-metadata tool</Link> shows you exactly what is
        embedded, GPS included, and saves a clean copy with the location gone. It runs entirely in your browser —
        the photo is never uploaded, and the pixels are not touched.
      </p>

      <h2>Make it a habit, not a project</h2>
      <p>
        You do not need to scrub your whole library. Just clean the photos that are leaving your hands — the listing,
        the post, the email to a stranger. If you share from an iPhone, the share sheet&apos;s Options toggle can drop
        the location per share, and the camera can stop recording it entirely; both are covered step by step in{" "}
        <Link href="/guides/remove-metadata-iphone-photos">how to remove metadata from iPhone photos</Link>. For the
        wider picture of what rides along besides GPS, see{" "}
        <Link href="/guides/remove-image-metadata">how to remove metadata from a photo</Link>.
      </p>
      <p>
        A photo should say what you meant it to say. Nothing more.
      </p>
    </GuideShell>
  );
}
