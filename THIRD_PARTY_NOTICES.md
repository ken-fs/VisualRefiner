# Third-Party Notices

VisualRefiner uses the following open-source packages. Copyright remains with each project and its contributors. The complete license text for every installed version is distributed in the package and recorded by `pnpm-lock.yaml`.

| Project | License | Source |
| --- | --- | --- |
| Next.js | MIT | https://github.com/vercel/next.js |
| React | MIT | https://github.com/facebook/react |
| Iconify | MIT | https://github.com/iconify/iconify |
| MediaBunny | MPL-2.0 | https://github.com/Vanilagy/mediabunny |
| pica | MIT | https://github.com/nodeca/pica |
| heic2any | MIT | https://github.com/alexcorvi/heic2any |
| gifenc | MIT | https://github.com/mattdesl/gifenc |
| exifr | MIT | https://github.com/MikeKovarik/exifr |
| OpenCV (via @techstark/opencv-js) | Apache-2.0 | https://github.com/TechStark/opencv-js |
| jSquash (AVIF codec, libavif WASM build) | Apache-2.0 | https://github.com/jamsinclair/jSquash |

MediaBunny is used as an unmodified dependency. If VisualRefiner later modifies MediaBunny source files, those modified files must be made available under MPL-2.0.

The OpenCV.js runtime (WASM build) is served as a static asset from `public/vendor/opencv/` and loaded on demand by the object-eraser tool only; it is not bundled into any page's JavaScript.

The jSquash AVIF WASM binaries (encoder, multithreaded encoder, decoder) are served as static assets from `public/vendor/avif/` and fetched on demand when an AVIF encode or decode actually runs; they are not bundled into any page's JavaScript.

This summary is provided for convenience and does not replace the original license texts.
