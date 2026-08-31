import type { Metadata } from "next";
import Link from "next/link";
import { OriginWorkspace } from "@/components/OriginWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";

export const metadata: Metadata = {
  title: "Check Image Origin — C2PA & AI Content Credentials",
  description: "Check whether an image carries C2PA Content Credentials or AI-generator fingerprints. Read the embedded origin report locally in your browser — no upload, nothing leaves your device.",
  alternates: { canonical: "/check-image-origin" },
};

export default function CheckImageOriginPage() {
  return (
    <ToolPageShell
      title="Check image origin"
      description="Read the credentials and fingerprints an image carries about how it was made."
      note="Read locally, never uploaded"
      slug="/check-image-origin"
      steps={["Choose an image.", "See its Content Credentials and metadata signals.", "Judge the origin with the evidence in front of you."]}
      explainer={
        <>
          <h2 id="learn-title">Was this made by a camera, a person, or a model?</h2>
          <p>
            More and more images carry an answer inside the file itself. <strong>Content Credentials</strong> (the
            C2PA standard, backed by Adobe, Microsoft, OpenAI, Google, and others) embed a signed record of how a
            file was made: which tool created it, what happened to it since, and whether AI was involved.
          </p>
          <p>
            Even without credentials, generators leave fingerprints — a software tag, a creator string, a leftover
            prompt in the metadata. This tool reads all of it and lays the evidence out plainly.
          </p>
          <h3>Read the result with care</h3>
          <p>
            A credential saying &quot;AI-generated&quot; is strong evidence. <em>No</em> credential proves nothing:
            metadata can be stripped (our own <Link href="/remove-metadata">metadata remover</Link> does exactly
            that), and plenty of honest photos carry none. Treat an empty report as &quot;unknown&quot;, not
            &quot;authentic&quot;.
          </p>
        </>
      }
      faqs={[
        { question: "What are Content Credentials (C2PA)?", answer: "C2PA is an open standard that embeds a signed manifest inside an image or video: which tool made it, what edits followed, and whether AI generation was involved. Adobe, Microsoft, OpenAI, Google, Meta and others write them into their tools' output." },
        { question: "Does this verify the cryptographic signature?", answer: "No. It reads the embedded credential and shows you what it claims — the signing tool, history, and AI flags — and tells you a signature is present. Full cryptographic verification against the signing authority needs the official C2PA toolchain." },
        { question: "If no credentials are found, is the image real?", answer: "Not necessarily. Metadata can be removed and many genuine photos have no credentials. An empty report means 'no evidence in the file', not proof of authenticity either way." },
        { question: "What are AI generator fingerprints?", answer: "Generators often write their name into metadata — a Software or CreatorTool tag like Midjourney, DALL·E, Stable Diffusion, or Firefly, sometimes even the generation prompt. This tool scans for the known signatures." },
        { question: "Is the image uploaded to check it?", answer: "No. The credential and metadata reading runs entirely in your browser tab — the file never leaves your device." },
      ]}
    >
      <OriginWorkspace />
    </ToolPageShell>
  );
}
