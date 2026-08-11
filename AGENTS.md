# VisualRefiner Project Instructions

- Use pnpm and keep `pnpm-lock.yaml` authoritative.
- Use Next.js App Router, TypeScript and static export.
- Keep file processing in the browser unless a later product decision explicitly introduces a server feature.
- Follow `../DESIGN-RULES.md`, `PRODUCT.md` and `DESIGN.md` when it exists.
- Prefer browser-native APIs before adding dependencies.
- Heavy media dependencies must be dynamically imported inside the relevant client tool.
- Do not add accounts, payments, AI, uploads, YouTube downloading or watermark-focused routes during the local-tools MVP.
- Run `pnpm test`, `pnpm lint` and `pnpm build` before delivery.
