import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description: "What VisualRefiner is, why files stay in your browser, and how the local tools work.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="prose-page">
      <JsonLd data={breadcrumbSchema([{ name: "Home", slug: "/" }, { name: "About", slug: "/about" }])} />
      <h1>About VisualRefiner</h1>
      <p>
        VisualRefiner is a small set of image and video tools that run entirely in your browser. Convert a format,
        compress a photo, resize an image, turn a clip into a GIF — without an account, an upload queue, or a file
        leaving your device.
      </p>

      <h2>Why local processing</h2>
      <p>
        Most online converters upload your file to a server, process it there, and send a result back. That means a
        copy of your file sits on infrastructure you do not control. VisualRefiner takes the opposite approach: the
        work happens in the same tab you opened, using browser APIs such as Canvas and WebCodecs. Nothing is uploaded
        to VisualRefiner servers, and closing the tab clears the working session.
      </p>

      <h2>Who it is for</h2>
      <p>
        Anyone who needs a quick, private file operation and does not want to sign up for a service or trust an upload
        form: a designer shrinking a screenshot, a developer converting a PNG to WebP, someone turning a phone HEIC
        into a shareable JPG. The tools are free and require no login.
      </p>

      <h2>How it stays honest</h2>
      <p>
        The heavy lifting relies on open-source libraries, listed on the{" "}
        <Link href="/open-source">open-source notices</Link> page. Because processing is local, quality and speed
        depend on your own device rather than a shared server. Read the{" "}
        <Link href="/privacy">privacy note</Link> for how request data is handled, and the{" "}
        <Link href="/terms">terms</Link> for acceptable use.
      </p>

      <h2>Learn the formats</h2>
      <p>
        Format names are confusing and the right choice depends on the result you want. The{" "}
        <Link href="/guides">guides</Link> explain the common decisions — WebP versus PNG, what compression quality to
        pick, and what HEIC actually is — in plain language, each linking to the tool that does the job.
      </p>
    </main>
  );
}
