import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "MOV to WebM Converter",
  description: "Convert a MOV video to WebM locally in your browser. Turn a heavy QuickTime file into a smaller web-ready WebM — no upload, it stays on your device.",
  alternates: { canonical: "/mov-to-webm" },
};

export default function MovToWebmPage() {
  return (
    <ToolPageShell
      title="MOV to WebM"
      description="Turn a QuickTime MOV into a smaller web-ready WebM."
      note="Uses your browser codecs"
      slug="/mov-to-webm"
      steps={["Choose a MOV video.", "Keep WebM as the output.", "Convert and download the WebM."]}
      explainer={
        <>
          <h2 id="learn-title">MOV to WebM, briefly</h2>
          <p>
            MOV is Apple&apos;s QuickTime container — what iPhones, Macs, and many cameras record. It is high quality
            but large, and outside the Apple ecosystem it is not always the easiest to place. WebM is the web&apos;s
            open format: smaller at comparable quality and ideal for video you host and embed yourself in a modern
            browser.
          </p>
          <p>
            Convert to WebM when the clip is destined for a web page you control. If you instead need a file that
            plays and uploads almost anywhere, target MP4 with the{" "}
            <Link href="/mov-to-mp4">MOV to MP4</Link> tool. The{" "}
            <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link> lays out the trade-off.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert MOV to WebM?", answer: "To get a smaller, web-ready file for a page you host yourself. WebM with VP9 or AV1 reaches similar quality at a smaller size than a large MOV, which speeds up page loads." },
        { question: "Should I use WebM or MP4?", answer: "Use WebM for self-hosted web video in modern browsers. Use MP4 if you need to share, upload, or edit the file, since WebM is rejected by some editors, phones, and apps." },
        { question: "Does the conversion lose quality?", answer: "A little — re-encoding into a new codec is lossy, so some detail is dropped. Converting once is usually fine; repeatedly re-encoding the same clip is what visibly degrades it." },
        { question: "Why might a MOV fail to convert?", answer: "Conversion uses your browser's codec support. An unusual track or a codec the browser cannot handle can stop it, and what works differs between browsers. Trying MP4 instead sometimes succeeds." },
        { question: "Is the MOV uploaded anywhere?", answer: "No. Everything runs in your browser tab, so the file never leaves your device and no account is needed." },
      ]}
    >
      <VideoConverter defaultFormat="webm" />
    </ToolPageShell>
  );
}
