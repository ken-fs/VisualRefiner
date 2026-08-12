import Link from "next/link";
import { Icon } from "@iconify/react";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="VisualRefiner home">
        <span className="wordmark-mark" aria-hidden="true">
          <span />
        </span>
        <span>VisualRefiner</span>
      </Link>
      <nav className="main-nav" aria-label="Primary navigation">
        <Link href="/image-converter">Images</Link>
        <Link href="/video-converter">Video</Link>
        <Link href="/#all-tools">All tools</Link>
        <Link href="/guides">Guides</Link>
        <span className="local-chip">
          <Icon icon="ph:shield-check" width="17" aria-hidden="true" />
          Local by default
        </span>
      </nav>
    </header>
  );
}
