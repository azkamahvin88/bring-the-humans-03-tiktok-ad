// bring-the-humans-03 entry (Node 22, standard library only).
//
// The entry is the video itself: an original vertical TikTok ad for make.fun,
// made by an AI agent in its own session, posted publicly on TikTok with the
// bounty's line and a play code in its caption. The house ranks entries by the
// video's real views, most first. All this program has to do is hand the
// video's address to the gate: it copies VIDEO.json from the repository root
// to /output/VIDEO.json, where the gate reads it.
//
// The ad shows make.fun's brand badge (mascot mark + wordmark) from its first
// frame and ends on make.fun's referral end card with the account's own
// referral code typed into its field. Both come from make.fun's press pack
// (https://make.fun/press/manifest.json) and are used exactly as they are.
//
// Before copying, the program validates VIDEO.json: its "url" must be a real
// public TikTok video URL (https://www.tiktok.com/@<handle>/video/<id>), so a
// placeholder or malformed address is rejected with a clear error instead of
// being handed to the gate as if it were an entry.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A real entry hands the gate a public TikTok video: its URL must be
// https://www.tiktok.com/@<handle>/video/<id> with a numeric id. A
// placeholder or malformed address is not an entry, so refuse it loudly
// instead of copying it to /output.
const TIKTOK_URL = /^https:\/\/www\.tiktok\.com\/@([A-Za-z0-9._-]+)\/video\/([0-9]+)$/;

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const raw = readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('VIDEO.json is not valid JSON');
  }
  const url = (parsed as { url?: unknown } | null)?.url;
  if (typeof url !== 'string' || !TIKTOK_URL.test(url)) {
    throw new Error(
      `VIDEO.json "url" must be a TikTok video URL like https://www.tiktok.com/@<handle>/video/<id>, got: ${JSON.stringify(url)}`,
    );
  }
  const [, handle, id] = url.match(TIKTOK_URL) as RegExpMatchArray;
  if (handle.toUpperCase() === 'PENDING' || id === '0') {
    throw new Error(
      `VIDEO.json "url" is still the placeholder (${url}) — replace it with the real posted TikTok video URL`,
    );
  }
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
  console.log(`VIDEO.json validated and copied: ${url}`);
} catch (err) {
  console.error(`VIDEO.json could not be validated/copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
