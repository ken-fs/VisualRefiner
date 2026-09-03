// Submit all sitemap URLs to IndexNow (Bing/Yandex/Seznam/Naver).
// Usage: node scripts/indexnow.mjs [url ...]   (no args = whole sitemap)
// Requires public/<INDEXNOW_KEY>.txt to be deployed at the site root.
import { readFileSync } from "node:fs";

const HOST = "visualrefiner.com";
const KEY = "76b6afa2a30d4fcb919c449bccc82fac";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const urls = process.argv.slice(2).length
  ? process.argv.slice(2)
  : [...readFileSync(new URL("../out/sitemap.xml", import.meta.url), "utf8")
      .matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1]);

if (!urls.length) {
  console.error("no urls found");
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }),
});

console.log(`IndexNow ${res.status} — submitted ${urls.length} urls`);
if (!res.ok) console.log(await res.text());
