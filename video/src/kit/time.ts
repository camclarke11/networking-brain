// Time helpers. Every scene is a pure function of `t` (seconds since the video started),
// so freezing, rewinding and slow motion are just different values of t.
import {Easing, random, spring} from 'remotion';
import {FPS} from './tokens';

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x;
export const mix = lerp;

export const EO = Easing.bezier(0.16, 1, 0.3, 1); // ease out, snappy
export const EIO = Easing.bezier(0.65, 0, 0.35, 1); // ease in-out
export const EIN = Easing.bezier(0.7, 0, 0.84, 0); // ease in
export const EBack = Easing.out(Easing.back(1.7)); // overshoot
export const LIN = (x: number) => x;

/** Progress 0→1 between times a and b, eased. */
export const p = (t: number, a: number, b: number, e: (x: number) => number = EO) => e(clamp((t - a) / Math.max(b - a, 1e-6)));

/** A spring that starts at time a (seconds). 0 before a, settles at 1. */
export const spr = (t: number, a: number, config = {damping: 12, stiffness: 160, mass: 0.7}) =>
  t < a ? 0 : spring({frame: (t - a) * FPS, fps: FPS, config});

/** 1 inside [a, b], with eased ramps of length r at both ends. */
export const window = (t: number, a: number, b: number, r = 0.25) => Math.min(p(t, a, a + r), 1 - p(t, b - r, b, EIN));

/** Smooth deterministic wobble, for idle motion. */
export const wobble = (t: number, speed = 1, seed = 0) => Math.sin(t * speed * 2.1 + seed * 1.7) * 0.6 + Math.sin(t * speed * 3.3 + seed * 4.1) * 0.4;

/** Camera shake from a list of hit times. Returns [x, y, rotationDeg]. */
export const shake = (t: number, hits: number[], amp = 22, dur = 0.35, seed = 'sh'): [number, number, number] => {
  let x = 0, y = 0, r = 0;
  const f = Math.floor(t * FPS);
  for (const a of hits) {
    if (t < a || t > a + dur) continue;
    const k = Math.pow(1 - (t - a) / dur, 2);
    x += (random(seed + 'x' + f + a) - 0.5) * 2 * amp * k;
    y += (random(seed + 'y' + f + a) - 0.5) * 2 * amp * k;
    r += (random(seed + 'r' + f + a) - 0.5) * 2 * 1.2 * k;
  }
  return [x, y, r];
};

/** Mouth movement while someone talks between a and b (0 = closed, 1 = open). */
export const talk = (t: number, a: number, b: number, seed = 0) =>
  t < a || t > b ? 0 : clamp(0.35 + 0.65 * Math.abs(Math.sin((t - a) * 13 + seed)) * (0.6 + 0.4 * Math.sin(t * 5.3 + seed)));
