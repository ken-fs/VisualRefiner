/**
 * Runtime-loaded codec bundles served from /public/vendor (see src/lib/avif.ts
 * and src/lib/opencv.ts). They are plain scripts/ESM fetched by the browser,
 * never part of the bundler module graph — these declarations only satisfy
 * the type checker for the dynamic imports.
 */
declare module "/vendor/avif/*.js" {
  const factory: unknown;
  export default factory;
}
