import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = {
  title: "MP4 to WebM Converter",
  description: "Convert an MP4 video to WebM locally in your browser. Smaller files for self-hosted web video — no upload, the file is re-encoded in the tab and stays on your device.",
  alternates: { canonical: "/mp4-to-webm" },
};

export default function Mp4ToWebmPage() {
  return (
    <ToolPageShell
      title="MP4 to WebM"
      description="Turn an MP4 into a smaller WebM for the web."
      note="Uses your browser codecs"
      slug="/mp4-to-webm"
      steps={["Choose an MP4 video.", "Keep WebM as the output.", "Convert and download the WebM."]}
      explainer={
        <>
          <h2 id="learn-title">When MP4 to WebM makes sense</h2>
          <p>
            MP4 is the format that plays everywhere, so most videos arrive as one. WebM is the format built for the
            web: paired with VP9 or AV1 it can reach the same visual quality at a smaller size, which means faster
            page loads for video you host and embed yourself. If the clip lives on a page you control and you want it
            lighter, WebM is the upgrade.
          </p>
          <p>
            The trade-off is reach. WebM is excellent inside modern browsers but weaker everywhere else — some
            editors, phones, and messaging apps will not accept it. So convert to WebM for the web, but keep the MP4
            when you need to share or upload the file. If you later need to go back, the{" "}
            <Link href="/webm-to-mp4">WebM to MP4</Link> tool does the reverse.
          </p>
          <h3>Converting re-encodes the video</h3>
          <p>
            Switching containers is not a rename — it re-encodes the stream into a new codec, a lossy step that drops
            a little detail. Converting once is usually invisible; repeatedly re-encoding the same clip is what adds
            up. Conversion runs on your browser&apos;s own codec support, so an unusual track may fail — and what
            works can differ between browsers. See the{" "}
            <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link> for which to pick.
          </p>
        </>
      }
      faqs={[
        { question: "Why convert MP4 to WebM?", answer: "WebM with VP9 or AV1 can deliver similar quality at a smaller file size, which speeds up page loads for video you host on the web. Convert when the clip lives on a page you control in a modern browser." },
        { question: "Will the WebM be smaller than the MP4?", answer: "Often, yes, at comparable quality — but it depends on the source and the codecs your browser uses. Compare the two files and keep whichever balances size and quality best for your case." },
        { question: "Does converting lose quality?", answer: "A little. Both are lossy and switching containers re-encodes the video rather than relabeling it, so some detail is discarded. Converting once is usually fine; re-encoding the same clip repeatedly is what degrades it." },
        { question: "Where should I not use WebM?", answer: "For sharing, uploading to some platforms, importing into certain editors, or sending through messaging apps — several of those reject WebM. Keep the MP4 for those, and use WebM for self-hosted web pages." },
        { question: "Is the MP4 uploaded anywhere?", answer: "No. The conversion runs entirely in your browser using its own codecs, so the file never leaves your device and the tool works without an account." },
      ]}
    >
      <VideoConverter defaultFormat="webm" />
    </ToolPageShell>
  );
}
