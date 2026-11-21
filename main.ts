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
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR
// stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
