import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p><strong>VisualRefiner</strong> keeps the first toolset in your browser.</p>
      <nav aria-label="Footer navigation">
        <Link href="/about">About</Link>
        <Link href="/guides">Guides</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/open-source">Open source</Link>
      </nav>
      <p className="footer-note">© {new Date().getFullYear()} VisualRefiner</p>
    </footer>
  );
}
