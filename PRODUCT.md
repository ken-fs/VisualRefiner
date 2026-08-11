# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated implementation choice based on the Ship workspace conventions: Next.js, React, TypeScript, pnpm, static export, and Cloudflare deployment. Browser processing libraries are loaded only on routes that need them.

## Users

English-speaking individuals who need to convert, compress, resize, or extract content from an image or video without installing desktop software or uploading private files to a third-party server.

## Product Purpose

VisualRefiner provides focused image and video utilities that run locally in the browser. Initial success means users can find a specific tool through search, understand that processing stays on their device, complete the task, and download the result without creating an account.

## Positioning

Privacy-first visual utilities: files stay in the browser for the initial toolset, while each SEO landing page maps to a real, working task rather than thin conversion copy.

## Operating Context

Users typically arrive from a format-specific search on desktop or mobile, select or drop a file, choose a small number of output settings, process it locally, and download the result. Files may be personal, large, or unsuitable for uploading.

## Capabilities and Constraints

- Initial local tools: common image conversion, image compression, image resizing, video format conversion, video frame extraction, and video-to-GIF.
- Common image operations should use browser-native APIs before adding a dependency.
- Video processing should use MediaBunny first; FFmpeg WebAssembly is not a default dependency.
- The first milestone has no AI processing, accounts, credits, payment, server uploads, YouTube downloading, or dedicated watermark-removal positioning.
- The site is English-first. Additional languages wait until the English pages demonstrate search demand.
- AdSense may be added after the site has sufficient useful content and real working tools; the interface must reserve no fake ad inventory.

## Brand Commitments

- Product name: VisualRefiner.
- Primary domain: visualrefiner.com.
- visualrefine.com is a defensive domain and should redirect to the primary domain.
- Copy is direct, concrete, and conversational. Avoid generic SaaS claims and unexplained technical jargon.
- Follow the workspace `DESIGN-RULES.md`: no blue-purple gradient, Hero-plus-three-cards template, default component-library appearance, emoji icons, or fabricated proof.

## Evidence on Hand

No customer counts, testimonials, performance benchmarks, press mentions, or production usage data exist yet. Future surfaces must not fabricate them.

## Product Principles

1. The file task is visible and usable before marketing copy.
2. Local processing is a product mechanism, not a decorative privacy badge.
3. One shared processing engine powers multiple specific SEO routes.
4. Add dependencies only when native browser capabilities are insufficient.
5. Paid AI features wait until local tools demonstrate demand.

## Accessibility & Inclusion

The initial web experience must be usable with keyboard navigation, visible focus, clear error recovery, sufficient contrast, reduced-motion preferences, and touch targets suitable for mobile use.
