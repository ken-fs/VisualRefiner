import type { Metadata } from "next";
import Link from "next/link";
import { GuideShell } from "@/components/GuideShell";
import { guides } from "@/lib/guides";

const guide = guides.find((g) => g.slug === "/guides/how-to-tell-if-an-image-is-ai-generated")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: guide.slug },
};

export default function TellIfImageAiGeneratedGuide() {
  return (
    <GuideShell
      title={guide.title}
      description={guide.description}
      slug={guide.slug}
      datePublished={guide.datePublished}
      faqs={[
        { question: "Can AI detectors be trusted?", answer: "Treat them as hints, not verdicts. Detector tools guess from statistical patterns and get it wrong in both directions — real photos flagged, fakes waved through. A signed origin record beats a probability score." },
        { question: "If an image has no credentials, does that mean it is real?", answer: "No — and it does not mean it is fake, either. Most genuine photos carry no credential yet, and a fake can have its metadata stripped. Absence of a signal is silence, not innocence." },
        { question: "Can someone strip the credentials to hide that an image is AI-made?", answer: "Yes, metadata can be removed. That is why a missing credential proves nothing — but a valid one is hard to fake, because it is cryptographically signed by the tool that issued it." },
        { question: "What are the most reliable visual tells?", answer: "Historically: mangled text, hands, and teeth. Every model generation erases those tells, so visual checks age badly. Context and provenance age much better." },
        { question: "Can a photo prove it is real?", answer: "Increasingly, yes. Cameras are beginning to sign photos at the moment of capture with C2PA credentials. A valid camera signature is strong evidence of a real shot — the reverse of the AI problem." },
        { question: "Is the image uploaded to check it?", answer: "No. The origin check runs entirely in your browser — the file never leaves your device." },
      ]}
    >
      <p>
        You know the feeling. A photo of a politician mid-scandal. A disaster image with fifty thousand shares. A
        dating profile where the skin is just a little too even. Something is off and you cannot quite say why. That
        small unease used to be a passing thought. Now it is a daily skill — and it deserves an honest answer: your
        eyes alone are no longer enough, but they are still where checking starts.
      </p>

      <h2>First, the truth nobody likes</h2>
      <p>
        No single test settles it. Not the pixels, not a detector app, not one magic metadata field. Anyone who
        promises certainty is selling something. What works is layering three quick checks — and knowing exactly how
        much each one can tell you.
      </p>

      <h2>Layer 1: the pixels (10 seconds)</h2>
      <p>
        The classic tells are still worth a glance: text and signage that melts into gibberish, hands with the wrong
        number of fingers, earrings or glasses that do not match left to right, shadows and reflections that
        disagree, backgrounds that smear when you look at them directly. Skin with no texture at all.
      </p>
      <p>
        But grade on a curve: every model generation erases a tell. The mangled-hands era is already ending. A clean
        pass here means nothing on its own — and a single oddity does not convict a real photo either. Ten seconds,
        then move on.
      </p>

      <h2>Layer 2: the context (30 seconds)</h2>
      <p>
        Who posted it first, and where? A reverse image search often finds the earlier original a fake was cropped
        from, or the same image circulating with three different stories attached. A shocking photo that exists on
        exactly one account is telling you something. The file is not the only evidence — the story around the file
        is evidence too.
      </p>

      <h2>Layer 3: the file itself</h2>
      <p>
        This is the layer most people never check, and the one with the most to say. Two things can live inside an
        image:
      </p>
      <ul>
        <li><strong>Content Credentials (C2PA)</strong> — a signed record of where the file came from and what touched it. If an AI tool made or edited the image and played along, the credential says so, cryptographically signed. What it can and cannot prove is covered in <Link href="/guides/what-is-c2pa">what is C2PA</Link>.</li>
        <li><strong>Generator fingerprints</strong> — some generators quietly write their name into ordinary metadata fields. Not a signature, but a confession all the same.</li>
      </ul>
      <p>
        The <Link href="/check-image-origin">check-image-origin tool</Link> reads both, plus every metadata block on
        board — locally, in your browser, no upload. Read the result with care: <strong>signed by</strong> a tool is
        real evidence. <strong>No signals found</strong> is only silence — metadata can be stripped, and most cameras
        do not sign yet. A clean file is not an innocent one.
      </p>

      <h2>A habit worth keeping</h2>
      <p>
        Ten seconds on the pixels. Thirty on the source. And when it actually matters — before you share, before you
        believe — check the file. The question is no longer whether you can trust your eyes. It is that your eyes now
        work better with the file open beside them.
      </p>
    </GuideShell>
  );
}
