import type { Metadata } from "next";

export const metadata: Metadata = { title: "Open Source Notices", description: "Open-source software used by VisualRefiner.", alternates: { canonical: "/open-source" } };

const projects = [
  ["MediaBunny", "MPL-2.0", "https://github.com/Vanilagy/mediabunny"],
  ["pica", "MIT", "https://github.com/nodeca/pica"],
  ["heic2any", "MIT", "https://github.com/alexcorvi/heic2any"],
  ["gifenc", "MIT", "https://github.com/mattdesl/gifenc"],
  ["Iconify", "MIT", "https://github.com/iconify/iconify"],
];

export default function OpenSourcePage() {
  return <main className="prose-page"><h1>Open-source notices</h1><p>VisualRefiner uses open-source libraries. Their authors retain their copyrights.</p><ul className="notice-list">{projects.map(([name, license, url]) => <li key={name}><a href={url} rel="noreferrer">{name}</a><span>{license}</span></li>)}</ul><p>The license text distributed with each package controls its use. This page is a convenient summary.</p></main>;
}
