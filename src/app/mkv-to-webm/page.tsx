import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "MKV to WebM Converter",
  description: "Convert an MKV video to WebM locally in your browser. Repackage a Matroska file into a web-friendly WebM — no upload, it stays on your device.",
  alternates: { canonical: "/mkv-to-webm" },
};

export default function MkvToWebmPage() {
  return (
    <ToolPageShell
      title="MKV to WebM"
      description="Turn a Matroska MKV into a web-friendly WebM."
      note="Uses your browser codecs"
      slug="/mkv-to-webm"
      steps={["Choose an MKV video.", "Keep WebM as the output.", "Convert and download the WebM."]}
      explainer={
        <>
          <h2 id="learn-title">MKV to WebM, briefly</h2>
          <p>
            MKV (Matroska) is a flexible container common for downloads and archived video, but browsers and web
            pages rarely play it directly. WebM is actually a restricted subset of Matroska built for the web, so it
            is the natural web-friendly target: modern browsers play it inline, and VP9 or AV1 keeps the file small.
          </p>
          <p>
            Convert to WebM for embedding on a page you control. If you need broad compatibility for sharing or
            editing instead, target MP4 with the <Link href="/mkv-to-mp4">MKV to MP4</Link> tool. See the{" "}
            <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link> for the difference.
          </p>
          <h3>What happens to the tracks inside</h3>
          <p>
            An MKV can carry almost anything — H.264, H.265, or AV1 video, AAC, AC3, or DTS audio, plus subtitle
            tracks. WebM is far stricter: it only accepts VP8, VP9, or AV1 video and Vorbis or Opus audio. Anything
            else has to be re-encoded to fit, which is why conversion takes a moment even for a short clip. The
            usual failure point is the audio — movie rips with AC3 or DTS sound may not re-encode in every browser,
            and subtitle tracks do not carry over. If a file refuses to convert, try{" "}
            <Link href="/mkv-to-mp4">MKV to MP4</Link> first and share that instead.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert MKV to WebM?", answer: "Browsers do not play MKV directly, and WebM is the web-friendly Matroska subset. Converting gives you a small file that plays inline on a modern web page you host." },
        { question: "WebM or MP4 for an MKV?", answer: "WebM for self-hosted web video in modern browsers; MP4 when you need to share, upload, or edit, since WebM is not accepted everywhere." },
        { question: "Does it lose quality?", answer: "A small amount — re-encoding into a new codec is lossy. Converting once is usually invisible; re-encoding the same clip repeatedly is what adds up." },
        { question: "Why might an MKV fail?", answer: "MKV files can hold many track types, and conversion depends on your browser's codec support. An unusual or unsupported track can stop it; trying MP4 sometimes works instead." },
        { question: "Is the MKV uploaded anywhere?", answer: "No. The conversion happens entirely in your browser, so the file never leaves your device." },
      ]}
    >
      <VideoConverter defaultFormat="webm" />
    </ToolPageShell>
  );
}
