# VisualRefiner — Launch & Backlink Kit

> Local, uncommitted notes. Lives outside the git repo (in the Ship workspace root)
> so it never gets pushed. Live site: https://visualrefiner.com · Repo: https://github.com/ken-fs/VisualRefiner

Honest positioning only — no fabricated metrics. Lead with the one real
differentiator: 100% in-browser, no upload.

---

## 1. Show HN (Hacker News) — highest priority

HN rewards plain, technical, non-marketing tone. Post it yourself, then answer every comment.

**Title:**
```
Show HN: VisualRefiner – image/video conversion that runs entirely in the browser
```

**URL:** https://visualrefiner.com

**First comment (maker note):**
> I got tired of "free online converters" that upload your photos to a server just to change a file format. VisualRefiner does the conversion locally in the browser instead — the file never leaves your device, so it also works offline and needs no account.
>
> It handles the common stuff: HEIC→JPG/PNG/WebP, PNG↔JPG, WebP conversions, image compression and resizing, plus video → MP4/WebM, frame extraction, and video-to-GIF. Under the hood it's the Canvas API and WebCodecs, with a few small libs (heic2any for HEIC decode, pica for high-quality resizing, mediabunny for video, gifenc for GIFs), each loaded only on the route that needs it.
>
> Honest limitations: it processes one file at a time (no batch yet), and video conversion depends on the codecs your browser supports. Code is public on GitHub. Happy to hear where it breaks or what's missing.

**Timing:** weekday, ~8–10am US Eastern. Don't solicit upvotes (HN penalizes it).

---

## 2. Product Hunt

- **Name:** VisualRefiner
- **Tagline (<=60 chars):** `Convert & compress images/video — 100% in your browser`
- **Description (~260 chars):**
  ```
  Privacy-first image and video tools that run entirely in your browser. Convert HEIC, compress and resize images, turn clips into MP4/WebM or GIFs — no upload, no account, works offline. Your files never leave your device.
  ```
- **Topics:** Design Tools · Privacy · Web App · Productivity
- **First comment:** reuse the HN maker note (slightly warmer tone is fine).
- **Gallery hero:** a screen recording of a HEIC→JPG conversion with the browser Network tab open showing ZERO upload requests. That one visual sells the whole pitch.

---

## 3. Directory / listing submissions

Reality check: most directory links are `nofollow` — value is referral traffic + brand/entity
signals (fixes the GEO gap), not raw ranking power. Dofollow wins come mainly from curated
GitHub "awesome" lists and editorial roundups. Don't assume any link attribute; treat dofollow
as a bonus.

| Target | Primary value | Notes |
|---|---|---|
| alternativeTo | Referral + brand | Alternative to CloudConvert / TinyPNG / Zamzar; tag "privacy", "no upload" |
| Slant.co | Referral + brand | Answer "best image converters that don't upload your files" |
| Privacy Guides / PrivacyTools | Brand/entity (high trust) | Qualifies: local processing, no tracking, public code |
| SaaSHub | Referral | Utilities category |
| awesome-privacy (GitHub) | Dofollow potential | PR to add under file tools — strongest link type |
| awesome web-tools / free-tools lists | Dofollow potential | Find via github.com/topics/awesome |
| dev.to / Hashnode article | Dofollow potential | "Building a privacy-first image converter with WebAssembly", links back |
| Reddit (r/privacy, r/InternetIsBeautiful, r/webdev) | Referral + discovery | Educational post, not an ad |
| Bing Webmaster Tools + IndexNow | Indexation speed | Submit the sitemap |

Rules of thumb: space submissions over 1–2 weeks, follow each site's guidelines, never paste
identical copy everywhere, skip "pay to be listed" link-farm directories.

---

## 4. The highest-leverage single asset

A short dev.to / blog writeup ("how it works, in-browser, no server") linked from the README and
submitted to HN/Reddit. It's the only asset here that naturally earns dofollow editorial links
over time, and it doubles as GEO-citable content.

---

## 5. Where to publish — channel list

Reminder: most links are `nofollow` (value = reach + referral + brand/entity signals). Reliable
`dofollow` comes mainly from dev.to / Hashnode article bodies, and from anyone who writes about you.

### The technical article (visualrefiner-devto-article.md)

| Platform | How | Link type | Notes |
|---|---|---|---|
| dev.to | Primary publish | dofollow | Tags: webdev/javascript/webassembly/privacy |
| Hashnode | Cross-post | dofollow | Set canonical to dev.to |
| Medium | Cross-post | nofollow | Reach only |
| Hacker News | Submit article URL | nofollow | Long technical piece does well |
| Reddit r/webdev · r/javascript · r/programming | Discussion post | nofollow | "How it's built", not an ad |
| Lobsters (lobste.rs) | Needs invite | nofollow | High-quality dev audience |
| daily.dev | Submit / get curated | referral | Dev aggregator |
| Echo JS (echojs.com) | Submit JS content | nofollow | JS vertical |
| freeCodeCamp / CSS-Tricks / Smashing | Editorial pitch | dofollow (if accepted) | High bar, high value |

### The product launch (Show HN / Product Hunt copy above)

| Platform | How | Link type | Notes |
|---|---|---|---|
| Hacker News (Show HN) | Post visualrefiner.com | nofollow | Highest-yield first step; weekday AM |
| Product Hunt | Full listing | nofollow | Big reach/brand |
| alternativeTo | Create entry | nofollow | vs CloudConvert/TinyPNG; tag privacy |
| Slant.co | Answer a question | nofollow | "converters that don't upload" |
| Privacy Guides / PrivacyTools | Suggest listing | high-trust entity | Qualifies: local, no tracking, public code |
| SaaSHub / Toolify | Submit tool | nofollow | Tool directories |
| Reddit r/InternetIsBeautiful · r/privacy · r/degoogle | Post the tool | nofollow | Privacy angle fits |
| Indie Hackers / BetaList | Product post | nofollow | Community + feedback |
| awesome-privacy / awesome-* (GitHub PR) | Open a PR | nofollow | Mirrored/cited widely — discovery value |

### Suggested order (low-effort path)
1. Publish the dev.to article first (gets the dofollow body link) → cross-post Hashnode.
2. Show HN (article URL or tool URL) + answer comments.
3. Product Hunt listing.
4. Over 1–2 weeks, drip: alternativeTo, Slant, Privacy Guides, Reddit (vary the wording each time).
5. Open 1–2 awesome-list PRs.
6. Avoid "pay to be listed" link-farm directories.

---

## Checklist

- [ ] Record the "no upload" Network-tab demo clip
- [ ] Show HN post + answer comments
- [ ] Product Hunt listing (tagline/description/topics/gallery)
- [ ] Set GitHub About (description + website + topics)  ← in progress
- [ ] Submit sitemap to Bing Webmaster + IndexNow
- [ ] alternativeTo + Slant + Privacy Guides listings
- [ ] Write the dev.to WASM writeup
- [ ] PR into 1–2 awesome lists
- [ ] Reddit educational post (non-spammy)
