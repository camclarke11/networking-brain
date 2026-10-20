// Render stills (for review) or the full video, bundling once.
//   node scripts/render.mjs stills <compId> <outDir> <t1> <t2> ...   (times in seconds)
//   node scripts/render.mjs video <compId> <out.mp4>
// Env: REMOTION_GL (angle | swangle), REMOTION_BROWSER (path to Chrome), REMOTION_CONCURRENCY.
import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [mode, compId, out, ...rest] = process.argv.slice(2);
if (!mode || !compId || !out) {
  console.error('usage: node scripts/render.mjs stills|video <compId> <out> [times...]');
  process.exit(1);
}
const gl = process.env.REMOTION_GL || (process.platform === 'darwin' ? 'angle' : 'swangle');
const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromiumOptions = {gl};

const serveUrl = await bundle({entryPoint: path.join(here, '..', 'src', 'index.ts'), publicDir: path.join(here, '..', 'public')});
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions});
const composition = await selectComposition({serveUrl, id: compId, puppeteerInstance: browser, chromiumOptions, browserExecutable});

if (mode === 'stills') {
  fs.mkdirSync(out, {recursive: true});
  const times = rest.map(Number);
  for (const [i, t] of times.entries()) {
    const frame = Math.min(composition.durationInFrames - 1, Math.max(0, Math.round(t * composition.fps)));
    const file = path.join(out, `s_${String(i).padStart(3, '0')}_${t.toFixed(2)}.jpg`);
    await renderStill({composition, serveUrl, frame, output: file, imageFormat: 'jpeg', jpegQuality: 80, puppeteerInstance: browser, chromiumOptions, browserExecutable});
    process.stdout.write(`still ${t.toFixed(2)}s\n`);
  }
} else {
  let last = -1;
  await renderMedia({
    composition, serveUrl, codec: 'h264', outputLocation: out, crf: 18, pixelFormat: 'yuv420p', imageFormat: 'jpeg', jpegQuality: 92,
    concurrency: Number(process.env.REMOTION_CONCURRENCY || 0) || null, puppeteerInstance: browser, chromiumOptions, browserExecutable,
    onProgress: ({progress}) => {
      const pct = Math.floor(progress * 100);
      if (pct >= last + 5) {
        last = pct;
        process.stdout.write(`render ${pct}%\n`);
      }
    },
  });
}
await browser.close({silent: true});
