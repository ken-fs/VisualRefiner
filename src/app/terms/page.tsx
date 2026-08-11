import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms", description: "Terms for using VisualRefiner local media tools.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <main className="prose-page"><h1>Terms</h1><p>Use VisualRefiner only with files you own or have permission to process.</p><h2>No warranty</h2><p>The tools are provided as available. Browser codecs differ, and a conversion may fail or change metadata.</p><h2>Check important files</h2><p>Keep the original file. Review every downloaded result before deleting your source.</p><h2>Acceptable use</h2><p>Do not use the service to violate copyright, privacy, or other applicable rights.</p><p>Last updated: August 11, 2026.</p></main>;
}
