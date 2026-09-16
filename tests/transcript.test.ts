import assert from "node:assert/strict";
import test from "node:test";
import {
  formatTimestamp,
  formatClock,
  toTxt,
  toSrt,
  toVtt,
  formatTranscript,
  wordCount,
  type TranscriptSegment,
} from "../src/lib/transcript";

const segments: TranscriptSegment[] = [
  { start: 0, end: 1.5, text: " Hello world " },
  { start: 61.25, end: 62.75, text: "Second line" },
];

test("formatTimestamp renders SRT and VTT styles with hours", () => {
  assert.equal(formatTimestamp(0, ","), "00:00:00,000");
  assert.equal(formatTimestamp(61.25, ","), "00:01:01,250");
  assert.equal(formatTimestamp(3661.5, "."), "01:01:01.500");
});

test("formatClock is compact and only shows hours when needed", () => {
  assert.equal(formatClock(62.75), "01:02");
  assert.equal(formatClock(3661), "1:01:01");
  assert.equal(formatClock(0), "00:00");
});

test("toTxt trims and joins segments into flowing text", () => {
  assert.equal(toTxt(segments), "Hello world Second line");
  assert.equal(toTxt([{ start: 0, end: 1, text: "   " }]), "");
});

test("toSrt numbers cues and uses comma milliseconds", () => {
  const srt = toSrt(segments);
  assert.ok(srt.startsWith("1\n00:00:00,000 --> 00:00:01,500\nHello world\n\n"));
  assert.ok(srt.includes("2\n00:01:01,250 --> 00:01:02,750\nSecond line"));
  assert.ok(srt.endsWith("\n"));
});

test("toVtt carries the WEBVTT header and dot milliseconds", () => {
  const vtt = toVtt(segments);
  assert.ok(vtt.startsWith("WEBVTT\n\n00:00:00.000 --> 00:00:01.500\nHello world\n\n"));
  assert.ok(vtt.includes("00:01:01.250 --> 00:01:02.750"));
  assert.equal(toVtt([]), "WEBVTT\n");
});

test("formatTranscript dispatches on the format", () => {
  assert.equal(formatTranscript(segments, "txt"), toTxt(segments));
  assert.equal(formatTranscript(segments, "srt"), toSrt(segments));
  assert.equal(formatTranscript(segments, "vtt"), toVtt(segments));
});

test("wordCount counts whitespace-separated tokens", () => {
  assert.equal(wordCount(segments), 4);
  assert.equal(wordCount([]), 0);
});
