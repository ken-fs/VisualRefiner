import Link from "next/link";
import { Icon } from "@iconify/react";
import { ImageWorkspace } from "@/components/ImageWorkspace";
import { PrivacyPath } from "@/components/PrivacyPath";
import { ToolIndex } from "@/components/ToolIndex";
import { JsonLd } from "@/components/JsonLd";
import { conversions } from "@/lib/conversions";
import { tools } from "@/lib/tools";
import { itemListSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <main>
      <JsonLd data={itemListSchema({ name: "VisualRefiner tools", items: tools.map((t) => ({ name: t.name, slug: t.slug })) })} />
      <section className="home-hero">
        <div className="hero-copy">
          <h1>Make visual files behave.</h1>
          <p className="hero-lede">Convert, compress, resize, and extract. Your files stay on this device.</p>
          <div className="hero-links">
            <Link href="#quick-convert">Convert an image</Link>
            <Link href="/#all-tools">Browse every tool</Link>
          </div>
          <nav className="hero-task-index" aria-label="Quick tool index">
            <Link href="/image-compressor">Compress an image <Icon icon="ph:arrow-up-right" width="17" /></Link>
            <Link href="/image-resizer">Resize an image <Icon icon="ph:arrow-up-right" width="17" /></Link>
            <Link href="/video-converter">Convert a video <Icon icon="ph:arrow-up-right" width="17" /></Link>
          </nav>
          <p className="hero-constraints">No upload · No account · Free local tools</p>
        </div>
        <div className="hero-bench" id="quick-convert">
          <div className="bench-ruler" aria-hidden="true"><span /><span /><span /><span /><span /></div>
          <ImageWorkspace mode="convert" compact />
        </div>
      </section>

      <ToolIndex />
      <PrivacyPath />

      <section className="format-guide" aria-labelledby="format-guide-title">
        <div className="format-guide-title">
          <h2 id="format-guide-title">Choose by the result.</h2>
          <p>Format names are confusing. The goal is not.</p>
        </div>
        <div className="format-notes">
          <article>
            <Icon icon="ph:camera" width="28" aria-hidden="true" />
            <h3>Smaller photos</h3>
            <p>Use JPG or WebP. Start near 82% quality.</p>
            <Link href="/image-compressor">Compress a photo</Link>
          </article>
          <article>
            <Icon icon="ph:selection" width="28" aria-hidden="true" />
            <h3>Sharp transparency</h3>
            <p>Keep PNG when clean edges need transparency.</p>
            <Link href="/image-converter">Convert an image</Link>
          </article>
          <article>
            <Icon icon="ph:film-slate" width="28" aria-hidden="true" />
            <h3>Web-ready video</h3>
            <p>Try MP4 first. Use WebM for modern web playback.</p>
            <Link href="/video-converter">Convert a video</Link>
          </article>
        </div>
      </section>

      <section className="conversion-directory" aria-labelledby="conversions-title">
        <div className="conversion-directory-head">
          <h2 id="conversions-title">Popular conversions.</h2>
          <p>Every format pair runs locally. Pick the one you need.</p>
        </div>
        <div className="conversion-columns">
          <div>
            <h3>Images</h3>
            <ul>
              {conversions.filter((c) => c.group === "image").map((c) => (
                <li key={c.slug}><Link href={c.slug}>{c.label}<Icon icon="ph:arrow-up-right" width="15" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Video</h3>
            <ul>
              {conversions.filter((c) => c.group === "video").map((c) => (
                <li key={c.slug}><Link href={c.slug}>{c.label}<Icon icon="ph:arrow-up-right" width="15" aria-hidden="true" /></Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
