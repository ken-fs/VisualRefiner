/**
 * Transcript formatting — pure functions, no browser or model dependencies.
 * The transcriber produces TranscriptSegment[]; everything the user sees,
 * copies, or downloads is derived here (and unit-tested in tests/).
 */

export type TranscriptSegment = {
  /** Seconds from the start of the audio. */
  start: number;
  /** Seconds from the start of the audio. */
  end: number;
  text: string;
};

export type TranscriptFormat = "txt" | "srt" | "vtt";

function pad(value: number, width = 2): string {
  return String(value).padStart(width, "0");
}

/** "00:01:02,500" or "00:01:02.500" — the timestamp formats SRT/VTT expect. */
export function formatTimestamp(seconds: number, separator: "," | "."): string {
  const ms = Math.max(0, Math.round(seconds * 1000));
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor(ms / 60_000) % 60;
  const s = Math.floor(ms / 1_000) % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}${separator}${pad(ms % 1_000, 3)}`;
}

/** Compact clock for the on-page segment list: "04:07" or "1:04:07". */
export function formatClock(seconds: number): string {
  const total = Math.max(0, Math.floor(seconds));
  const h = Math.floor(total / 3600);
  const m = Math.floor(total / 60) % 60;
  const s = total % 60;
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function toTxt(segments: TranscriptSegment[]): string {
  return segments
    .map((segment) => segment.text.trim())
    .filter(Boolean)
    .join(" ");
}

export function toSrt(segments: TranscriptSegment[]): string {
  const body = segments
    .map(
      (segment, index) =>
        `${index + 1}\n${formatTimestamp(segment.start, ",")} --> ${formatTimestamp(segment.end, ",")}\n${segment.text.trim()}`,
    )
    .join("\n\n");
  return body ? `${body}\n` : "";
}

export function toVtt(segments: TranscriptSegment[]): string {
  const body = segments
    .map(
      (segment) =>
        `${formatTimestamp(segment.start, ".")} --> ${formatTimestamp(segment.end, ".")}\n${segment.text.trim()}`,
    )
    .join("\n\n");
  return body ? `WEBVTT\n\n${body}\n` : "WEBVTT\n";
}

export function formatTranscript(segments: TranscriptSegment[], format: TranscriptFormat): string {
  if (format === "srt") return toSrt(segments);
  if (format === "vtt") return toVtt(segments);
  return toTxt(segments);
}

export function wordCount(segments: TranscriptSegment[]): number {
  return toTxt(segments).split(/\s+/).filter(Boolean).length;
}
