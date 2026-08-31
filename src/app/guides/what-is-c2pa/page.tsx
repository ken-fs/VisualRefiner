import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/what-is-c2pa")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function WhatIsC2paGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "What does C2PA stand for?", answer: "The Coalition for Content Provenance and Authenticity — a joint effort by Adobe, Microsoft, the BBC, Intel, and others, now including OpenAI, Google, and Meta. It maintains the open technical standard behind Content Credentials." },
        { question: "How do I know if an image has Content Credentials?", answer: "Some apps show a small 'cr' pin icon on credentialed content. You can also check the file directly — the origin checker on this site reads the embedded manifest locally and shows you what it says." },
        { question: "Can Content Credentials be faked?", answer: "The manifest is cryptographically signed by the issuing tool, so a forged credential from a trusted signer should fail verification. But anyone can strip credentials entirely, and self-signed manifests exist — which is why verification against the signing authority matters for high-stakes checks." },
        { question: "Does C2PA prove an image is NOT AI-generated?", answer: "No. A credential can confirm AI involvement when present, but its absence proves nothing — most cameras and editors don't write credentials yet, and metadata can always be removed." },
        { question: "Is C2PA the same as an invisible watermark?", answer: "No. C2PA lives in the file's metadata — readable and removable. Invisible watermarks (like Google's SynthID) are embedded in the pixels themselves and survive metadata stripping, but can't be read without the provider's detector. The two are complementary layers." },
      ]}
    >
      <p>
        When a photo lands in your feed, it usually arrives with no backstory. <strong>C2PA</strong> — the
        Coalition for Content Provenance and Authenticity — is the industry&apos;s attempt to ship that backstory
        inside the file itself, as a cryptographically signed record called <strong>Content Credentials</strong>.
      </p>

      <h2>What a credential says</h2>
      <ul>
        <li><strong>Who made it</strong> — the signing tool or device: a camera, Photoshop, an AI generator.</li>
        <li><strong>What happened to it</strong> — a history of actions: created, opened, edited, cropped, converted.</li>
        <li><strong>Whether AI was involved</strong> — a <code>digitalSourceType</code> flag can mark content as trained-model output or a composite including AI media.</li>
        <li><strong>A signature</strong> — cryptographic proof the manifest hasn&apos;t been altered since the signer wrote it.</li>
      </ul>

      <h2>Where you&apos;re already seeing it</h2>
      <p>
        OpenAI embeds credentials in DALL·E images, Google in its Imagen output, Meta labels AI content across its
        apps, and Adobe tools write them on export. Leica and Nikon ship cameras that sign at the shutter. It is
        quietly becoming the default plumbing for content origin.
      </p>

      <h2>What it can&apos;t prove</h2>
      <p>
        Two honest limits. First, credentials can be <strong>stripped</strong> — they&apos;re metadata, and any
        metadata tool (including <Link href="/remove-metadata">ours</Link>) removes them, which is why
        &quot;no credential&quot; never proves &quot;no AI&quot;. Second, presence alone isn&apos;t{" "}
        <strong>verification</strong>: checking the signature against the issuing authority is a separate step
        that needs the official toolchain. Our <Link href="/check-image-origin">origin checker</Link> reads what a
        credential claims, locally, and says plainly that it hasn&apos;t cryptographically verified it.
      </p>

      <h2>The other layer</h2>
      <p>
        C2PA works alongside invisible watermarks like Google&apos;s SynthID: the credential is a label anyone can
        read, the watermark is a signal hidden in the pixels that survives stripping but needs the provider&apos;s
        detector. Together they cover each other&apos;s weaknesses — neither alone is sufficient.
      </p>
    </GuideShell>
  );
}
