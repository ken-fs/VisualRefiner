import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy", description: "How VisualRefiner handles local files and basic website data.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <main className="prose-page"><h1>Privacy</h1><p>VisualRefiner&apos;s initial image and video tools process files inside your browser. The selected files are not uploaded to VisualRefiner servers.</p><h2>Local processing</h2><p>Temporary previews and downloads use local browser memory. Closing the tab clears that working session.</p><h2>Website data</h2><p>Hosting providers may record standard request data, such as IP address, browser type, requested page, and time. Analytics or advertising details will be added here before those services are enabled.</p><h2>Your choices</h2><p>Do not process a file unless you have the right to use it. Clear downloaded results using your device controls.</p><p>Last updated: August 11, 2026.</p></main>;
}
