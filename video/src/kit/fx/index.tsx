// Locked visual grammar effects: colour drain (the wrong move), gold glow (the right move),
// grain, vignette, flashes, the VHS rewind, and sound effects pinned to times.
import React from 'react';
import {AbsoluteFill, Audio, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {C, FPS, H, W} from '../tokens';
import {clamp, p} from '../time';

/** Wrap anything. drain 0..1 pulls it to cold grey-blue, glow 0..1 floods it warm gold. */
export const Grade: React.FC<{drain?: number; glow?: number; children: React.ReactNode}> = ({drain = 0, glow = 0, children}) => (
  <AbsoluteFill>
    <AbsoluteFill style={{filter: `saturate(${1 - 0.8 * drain + 0.25 * glow}) brightness(${1 - 0.08 * drain + 0.04 * glow}) contrast(${1 - 0.06 * drain})`}}>
      {children}
    </AbsoluteFill>
    {drain > 0.001 && <AbsoluteFill style={{background: C.cold, mixBlendMode: 'color', opacity: 0.55 * drain}} />}
    {glow > 0.001 && (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 45%, ${C.goldGlow}, rgba(242,179,61,0.35) 55%, rgba(242,179,61,0) 80%)`,
          mixBlendMode: 'soft-light',
          opacity: 0.9 * glow,
        }}
      />
    )}
  </AbsoluteFill>
);

/** Film grain. Sits on top of every video. */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
      <svg width={W} height={H}>
        <filter id="grainF">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grainF)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.35}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 85% 70% at 50% 48%, transparent 55%, rgba(33,28,23,${strength}) 100%)`}} />
);

/** A white (or gold) flash peaking at time `at`. */
export const Flash: React.FC<{t: number; at: number; color?: string; dur?: number; max?: number}> = ({t, at, color = '#fff', dur = 0.3, max = 0.85}) => {
  const k = t < at ? p(t, at - 0.06, at) : 1 - p(t, at, at + dur);
  if (k <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: k * max, pointerEvents: 'none'}} />;
};

/**
 * VHS rewind. Between `from` and `to` the child is shown with time running backwards from
 * `from` to `landOn`, with tracking lines and colour wobble. Children get the mapped time.
 */
export const VhsRewind: React.FC<{t: number; from: number; to: number; landOn: number; children: (t: number) => React.ReactNode}> = ({t, from, to, landOn, children}) => {
  if (t < from) return <>{children(t)}</>;
  if (t >= to) return <>{children(landOn + (t - to))}</>;
  const k = (t - from) / (to - from);
  const mapped = from + (landOn - from) * Math.pow(k, 0.8);
  const f = Math.floor(t * FPS);
  const jitter = (random('vj' + f) - 0.5) * 18;
  const bandY = ((t * 900) % (H + 300)) - 150;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${jitter}px)`, filter: 'saturate(1.4) contrast(1.1)'}}>
        <AbsoluteFill style={{transform: 'translateX(-6px)', mixBlendMode: 'screen', opacity: 0.9}}>{children(mapped)}</AbsoluteFill>
        <AbsoluteFill style={{transform: 'translateX(6px)', mixBlendMode: 'multiply', opacity: 0.35, filter: 'hue-rotate(160deg)'}}>{children(mapped)}</AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 2px, transparent 2px, transparent 6px)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: bandY, height: 90, background: 'rgba(255,255,255,0.22)', filter: 'blur(6px)', transform: `translateX(${-jitter * 3}px)`}} />
      <div style={{position: 'absolute', left: 70, top: 200, color: '#fff', fontFamily: 'monospace', fontSize: 64, fontWeight: 700, textShadow: '3px 3px 0 rgba(0,0,0,0.5)', opacity: Math.floor(t * 3) % 2 ? 1 : 0.4}}>
        ◀◀ REW
      </div>
    </AbsoluteFill>
  );
};

export type SfxName = 'whoosh' | 'pop' | 'ping' | 'buzzer' | 'scratch' | 'rewind' | 'thud' | 'ding' | 'tick' | 'swell' | 'click' | 'sparkle';

/** A sound effect that starts at time `at` (seconds). Files live in public/sfx/ (tools/make_sfx.sh). */
export const Sfx: React.FC<{name: SfxName; at: number; volume?: number}> = ({name, at, volume = 0.5}) => (
  <Sequence from={Math.max(0, Math.round(at * FPS))} layout="none">
    <Audio src={staticFile(`sfx/${name}.mp3`)} volume={volume} />
  </Sequence>
);

/** Fade a value in at a and out at b (for simple overlays). */
export const fadeWin = (t: number, a: number, b: number, r = 0.2) => clamp(Math.min((t - a) / r, (b - t) / r));
