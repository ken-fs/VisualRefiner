import type * as CV from "@techstark/opencv-js";

/**
 * Loads the OpenCV.js runtime from /public/vendor on demand (only the
 * erase-object page pulls the ~13 MB script). The UMD build assigns a Promise
 * to window.cv that resolves once the WASM runtime is initialized.
 */
export type OpenCv = typeof CV;

declare global {
  interface Window {
    cv?: Promise<OpenCv> | OpenCv;
  }
}

let loading: Promise<OpenCv> | null = null;

export function loadOpenCv(): Promise<OpenCv> {
  if (loading) return loading;
  loading = new Promise<OpenCv>((resolve, reject) => {
    const settle = (value: Promise<OpenCv> | OpenCv) => {
      Promise.resolve(value).then(resolve, reject);
    };
    if (window.cv) {
      settle(window.cv);
      return;
    }
    const script = document.createElement("script");
    script.src = "/vendor/opencv/opencv.js";
    script.async = true;
    script.onload = () => {
      if (window.cv) settle(window.cv);
      else reject(new Error("The editor engine failed to initialize."));
    };
    script.onerror = () => reject(new Error("Could not load the editor engine."));
    document.head.appendChild(script);
  });
  return loading;
}
