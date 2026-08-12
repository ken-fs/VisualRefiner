import type { Metadata } from "next";
import Link from "next/link";
import { ToolPageShell } from "@/components/ToolPageShell";
import { VideoConverter } from "@/components/VideoConverter";

export const metadata: Metadata = { title: "Video Converter", description: "Convert a video to MP4 or WebM in your browser using your own codecs. No upload, no account — the file stays on your device.", alternates: { canonical: "/video-converter" } };

export default function VideoConverterPage() {
  return (
    <ToolPageShell
      title="Video converter"
      description="Convert a supported video without an upload queue."
      note="Uses your browser codecs"
      slug="/video-converter"
      steps={["Choose a video from your device.", "Pick MP4 or WebM.", "Convert and download the result."]}
      explainer={
        <>
          <h2 id="learn-title">Container, codec, and what &ldquo;convert&rdquo; means here</h2>
          <p>
            A video file is really two things: a <em>container</em> — the <code>.mp4</code>, <code>.webm</code>,{" "}
            <code>.mov</code>, or <code>.mkv</code> wrapper — and the <em>codecs</em> inside it that actually
            encode the picture and sound. Converting between containers repackages those tracks, and where the
            codecs do not fit the new container they are re-encoded to ones that do. That is why a MOV from a
            phone or an MKV from a download can end up as a clean MP4 that a stubborn player finally accepts.
          </p>
          <p>
            This tool runs on your browser&apos;s own media stack (WebCodecs, via MediaBunny). Load one video,
            choose MP4 or WebM, and the file is decoded and re-written inside this tab. Nothing is uploaded, so
            it works offline and the video never leaves your device. Because the work happens on your hardware,
            speed tracks your machine and the length of the clip rather than a queue on someone&apos;s server.
          </p>

          <h3>MP4 or WebM?</h3>
          <p>
            MP4 is the safe, play-anywhere default — phones, TVs, editors, and social uploads all expect it.
            WebM is built for the web and can come out smaller at similar quality, which suits a page you
            control. If you are weighing the two, the <Link href="/guides/mp4-vs-webm">MP4 vs WebM guide</Link>{" "}
            goes deeper. Pick MP4 unless something specifically asks for WebM.
          </p>

          <table className="compare-table">
            <thead>
              <tr><th>Format</th><th>Container</th><th>Plays where</th><th>Best for</th></tr>
            </thead>
            <tbody>
              <tr><th>MP4</th><td>.mp4</td><td>Almost everywhere</td><td>Sharing, uploads, general compatibility</td></tr>
              <tr><th>WebM</th><td>.webm</td><td>Modern browsers</td><td>Web pages you host yourself</td></tr>
            </tbody>
          </table>

          <h3>What it can and cannot do</h3>
          <p>
            Which files convert depends on the codecs your browser can decode and encode, so support varies
            between browsers and devices rather than being guaranteed for every clip. If a track cannot be
            handled you will see a message instead of a broken file. The tool works on one video at a time and
            changes the format — it does not trim, crop, or edit. If your only goal is a specific container,
            the shortcut pages are quicker: <Link href="/mov-to-mp4">MOV to MP4</Link>,{" "}
            <Link href="/mkv-to-mp4">MKV to MP4</Link>, and <Link href="/webm-to-mp4">WebM to MP4</Link>.
          </p>
        </>
      }
      faqs={[
        { question: "Should I choose MP4 or WebM?", answer: "MP4 plays almost everywhere, so it is the safe default for sharing. WebM is well suited to modern web playback and can be smaller. Pick MP4 unless you specifically need WebM." },
        { question: "What video files can I load?", answer: "You can load common types such as MP4, MOV, WebM, and MKV. Whether a particular file converts depends on the codecs inside it and what your browser can decode, so support varies by browser and device." },
        { question: "Does converting keep the audio?", answer: "The converter works with the tracks in your file, including sound, and fits them to the chosen container. Because it relies on your browser's codecs, exactly which audio can be re-encoded depends on the browser." },
        { question: "Why does conversion speed vary?", answer: "The video is processed with your browser's built-in WebCodecs, so speed depends on your own device rather than a shared server. Larger and longer clips take longer." },
        { question: "Can I convert several videos at once?", answer: "The tool converts one video at a time. Convert the first, then load the next — each file is processed locally in the tab." },
        { question: "Is my video uploaded?", answer: "No. The file is decoded and re-written inside the tab and is not sent to any server, so it stays on your device and the tool works offline." },
      ]}
    >
      <VideoConverter />
    </ToolPageShell>
  );
}
