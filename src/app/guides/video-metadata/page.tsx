import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/video-metadata")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function VideoMetadataGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "Does removing video metadata reduce quality?", answer: "Not with the right method. If only the container is rebuilt and the video and audio streams are copied across untouched, the picture and sound are bit-for-bit identical. Quality loss only happens if the file is re-encoded." },
        { question: "What is the AIGC tag in Chinese video apps?", answer: "China's TC260 standard requires AI-generated content to be labeled. Video platforms embed an AIGC marker in the file's container metadata (for MP4/MOV it lives in the user-data atoms). It is metadata, so repacking the container without tags removes it." },
        { question: "Can metadata reveal where a video was shot?", answer: "Video files rarely carry GPS coordinates the way phone photos do, but they can carry creation dates, device or app identifiers, and editing history — enough to say more than you intended in some cases." },
        { question: "Is stripping video metadata legal?", answer: "For your own videos, yes — it's your file. Do keep in mind that some platforms use provenance labels to comply with regulations, and removing labels from AI content you redistribute may violate platform rules. Clean your own files, keep others' intact." },
      ]}
    >
      <p>
        Photos get all the privacy attention, but every video file is a container with two kinds of content:
        the streams you watch and hear, and a set of <strong>descriptive fields</strong> you never see. Those
        fields are the video&apos;s metadata.
      </p>

      <h2>What&apos;s actually in there</h2>
      <ul>
        <li><strong>Descriptive tags</strong> — title, artist, comment, album, genre, creation date.</li>
        <li><strong>Writing app or device</strong> — which camera, phone, or editor produced the file.</li>
        <li><strong>Embedded images</strong> — cover art or preview thumbnails riding inside the file.</li>
        <li><strong>Provenance labels</strong> — C2PA Content Credentials, and on Chinese platforms the TC260 <strong>AIGC</strong> marker that flags AI-generated content.</li>
      </ul>

      <h2>Where it lives, per format</h2>
      <p>
        MP4 and MOV keep metadata in the <code>moov</code> box — often in <code>udta</code> or <code>meta</code>{" "}
        atoms. MKV and WebM use Matroska <code>Tags</code> elements, plus attached files like cover images.
        The details differ; the idea doesn&apos;t.
      </p>

      <h2>Cleaning without re-encoding</h2>
      <p>
        Here&apos;s the part most people get wrong: you don&apos;t need to re-encode a video to remove its
        metadata. The streams can be copied <em>packet-for-packet</em> into a fresh container — a process called
        remuxing — which is fast and loses zero quality. The{" "}
        <Link href="/remove-video-metadata">video metadata remover</Link> does exactly that, locally in your
        browser.
      </p>

      <h2>What cleaning can&apos;t do</h2>
      <p>
        Container metadata is separate from the pixels. If a platform marked a video <em>inside</em> the picture —
        a visible badge or an invisible pixel watermark — no container tool will touch it. And an important
        corollary: a file with no metadata isn&apos;t proof of anything, because metadata can always be stripped.
      </p>
    </GuideShell>
  );
}
