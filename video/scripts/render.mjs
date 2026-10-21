// Render stills (for review) or the full video, bundling once.
//   node scripts/render.mjs stills <compId> <outDir> <t1> <t2> ...   (times in seconds)
//   node scripts/render.mjs video <compId> <out.mp4>
//   node scripts/render.mjs check <compId> - [step seconds]   (sweeps the video for clipping and off-screen text)
//   node scripts/render.mjs cover <videoId> <out.jpg> <seconds> '<json: title, highlight, dark, place, size>'
// Env: REMOTION_GL (angle | swangle), REMOTION_BROWSER (path to Chrome), REMOTION_CONCURRENCY.
import {bundle} from '@remotion/bundler';
import {openBrowser, renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const [mode, compId, out, ...rest] = process.argv.slice(2);
if (!mode || !compId || !out) {
  console.error('usage: node scripts/render.mjs stills|video|check <compId> <out> [times... | step]');
  process.exit(1);
}
const gl = process.env.REMOTION_GL || (process.platform === 'darwin' ? 'angle' : 'swangle');
const browserExecutable = process.env.REMOTION_BROWSER || null;
const chromiumOptions = {gl};

const serveUrl = await bundle({entryPoint: path.join(here, '..', 'src', 'index.ts'), publicDir: path.join(here, '..', 'public')});
const browser = await openBrowser('chrome', {browserExecutable, chromiumOptions});
const inputProps = mode === 'cover' ? {...JSON.parse(rest[1] || '{}'), id: compId} : {};
const composition = await selectComposition({serveUrl, id: mode === 'cover' ? 'Cover' : compId, inputProps, puppeteerInstance: browser, chromiumOptions, browserExecutable});

// The kit logs "[clip] ..." (3D overlaps) and "[offscreen] ..." (text cut off) while rendering.
const problems = [];
const onBrowserLog = (log) => {
  if (/^\[(clip|offscreen)\]/.test(log.text)) problems.push(log.text);
};
const report = () => {
  const seen = new Set();
  const lines = problems.filter((l) => !seen.has(l) && seen.add(l));
  if (!lines.length) return console.log('check: no clipping, nothing off screen');
  console.log(`check: ${lines.length} problem frame(s)`);
  for (const l of lines) console.log('  ' + l);
  process.exitCode = 2;
};

if (mode === 'check') {
  const step = Number(rest[0] || 0.25);
  const frames = [];
  for (let t = 0; t * composition.fps < composition.durationInFrames - 1; t += step) frames.push(Math.round(t * composition.fps));
  for (const [i, frame] of frames.entries()) {
    await renderStill({composition, serveUrl, frame, output: null, imageFormat: 'jpeg', jpegQuality: 30, scale: 0.25, puppeteerInstance: browser, chromiumOptions, browserExecutable, onBrowserLog});
    if (i % 20 === 0) process.stdout.write(`checked ${i}/${frames.length}\n`);
  }
  report();
} else if (mode === 'cover') {
  const frame = Math.round(Number(rest[0]) * composition.fps);
  await renderStill({composition, serveUrl, frame, inputProps, output: out, imageFormat: 'jpeg', jpegQuality: 94, puppeteerInstance: browser, chromiumOptions, browserExecutable, onBrowserLog});
  process.stdout.write(`cover ${out}\n`);
  report();
} else if (mode === 'stills') {
  fs.mkdirSync(out, {recursive: true});
  const times = rest.map(Number);
  for (const [i, t] of times.entries()) {
    const frame = Math.min(composition.durationInFrames - 1, Math.max(0, Math.round(t * composition.fps)));
    const file = path.join(out, `s_${String(i).padStart(3, '0')}_${t.toFixed(2)}.jpg`);
    await renderStill({composition, serveUrl, frame, output: file, imageFormat: 'jpeg', jpegQuality: 80, puppeteerInstance: browser, chromiumOptions, browserExecutable, onBrowserLog});
    process.stdout.write(`still ${t.toFixed(2)}s\n`);
  }
  report();
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
