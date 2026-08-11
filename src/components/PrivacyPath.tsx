import { Icon } from "@iconify/react";

export function PrivacyPath() {
  return (
    <section className="privacy-path" aria-labelledby="privacy-title">
      <div className="privacy-copy">
        <h2 id="privacy-title">Your file stays close.</h2>
        <p>These tools run on your device. No upload queue. No account.</p>
      </div>
      <div className="path-diagram" aria-label="File moves through the browser to a local download">
        <div className="path-node">
          <Icon icon="ph:file-image" width="28" aria-hidden="true" />
          <span>Your file</span>
        </div>
        <span className="path-line" aria-hidden="true" />
        <div className="path-node path-node-active">
          <Icon icon="ph:browser" width="28" aria-hidden="true" />
          <span>Your browser</span>
        </div>
        <span className="path-line" aria-hidden="true" />
        <div className="path-node">
          <Icon icon="ph:download-simple" width="28" aria-hidden="true" />
          <span>Your download</span>
        </div>
      </div>
    </section>
  );
}
