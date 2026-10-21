// The on-screen components: tall condensed headlines, soft white cards, one yellow accent.
// Every component marks its box with data-ui so <OffscreenCheck> can flag anything cut off.
import React, {createContext, useContext, useLayoutEffect} from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, H, SAFE, SHADOW, W} from '../tokens';
import {clamp, EIN, lerp, p, shake, spr} from '../time';
import type {TimingWord} from '../timing';
import type {CastId} from '../three/Character';

type Timed = {t: number; at: number; out?: number};

/** True while rendering a cover (thumbnail): captions and on-screen text step aside so the cover title can own
 * the frame. See video/src/Cover.tsx and `tools/make_video.py <script> cover`. */
export const CoverCtx = createContext(false);

/** Pop-in/out helper. Returns 0 before `at`, springs to 1, and eases back to 0 at `out`. */
const life = (t: number, at: number, out?: number) => {
  const inn = spr(t, at, {damping: 16, stiffness: 170, mass: 0.6});
  const o = out === undefined ? 1 : 1 - p(t, out - 0.18, out, EIN);
  return Math.max(0, Math.min(inn, 1.1)) * o;
};

/** Headline (4 to 9 words), tall and condensed. One word can sit on a yellow block. */
export const BigText: React.FC<Timed & {text: string; highlight?: string; y?: number; size?: number; color?: string; stagger?: number}> = ({
  t, at, out, text, highlight, y = 300, size = 104, color = C.ink, stagger = 0.05,
}) => {
  if (useContext(CoverCtx)) return null;
  const words = text.split(' ');
  const hl = highlight?.toLowerCase();
  const fs = size * 1.25;
  return (
    <div data-ui="BigText" style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right + 10, top: y, textAlign: 'center', lineHeight: 1.0}}>
      {words.map((w, i) => {
        const k = life(t, at + i * stagger, out);
        const isHl = hl && w.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(hl);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', margin: `0 ${fs * 0.1}px ${fs * 0.06}px`, fontFamily: FONT.display, fontWeight: 600, fontSize: fs, letterSpacing: fs * 0.005,
              textTransform: 'uppercase', color, opacity: clamp(k * 2), transform: `translateY(${(1 - k) * 40}px)`,
              background: isHl ? C.gold : undefined, padding: isHl ? `0 ${fs * 0.08}px` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** The exact words someone says, as a soft card pinned to a screen point (x, y = where the tail points). */
export const QuoteBubble: React.FC<Timed & {speaker: CastId; text: string; x: number; y: number; side?: 'left' | 'right'; width?: number; tone?: 'neutral' | 'wrong' | 'right'; typeOn?: boolean}> = ({
  t, at, out, speaker, text, x, y, side = 'left', width = 640, tone = 'neutral', typeOn = true,
}) => {
  if (useContext(CoverCtx)) return null;
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  const chars = typeOn ? Math.floor(clamp((t - at) / Math.max(0.5, text.length * 0.028)) * text.length) : text.length;
  const bg = tone === 'wrong' ? C.coldLight : tone === 'right' ? C.gold : C.white;
  const left = clamp(side === 'left' ? x - 70 : x - width + 70, SAFE.left - 20, SAFE.right - width + 40);
  return (
    <div data-ui="QuoteBubble" style={{position: 'absolute', left, top: y - 40, width, transformOrigin: `${x - left}px 100%`, transform: `translateY(-100%) scale(${0.9 + 0.1 * k})`, opacity: clamp(k * 3)}}>
      <div style={{position: 'relative', background: bg, borderRadius: 30, padding: '30px 38px', boxShadow: SHADOW}}>
        {speaker === 'you' && <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 26, letterSpacing: 2, color: tone === 'right' ? C.ink : C.ink2, textTransform: 'uppercase', marginBottom: 8}}>You</div>}
        <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 48, lineHeight: 1.2, color: C.ink, letterSpacing: -0.5}}>
          <span>{text.slice(0, chars)}</span>
          <span style={{opacity: 0}}>{text.slice(chars)}</span>
        </div>
        <svg width={44} height={30} style={{position: 'absolute', bottom: -28, left: side === 'left' ? 54 : undefined, right: side === 'right' ? 54 : undefined, transform: side === 'right' ? 'scaleX(-1)' : undefined}}>
          <path d="M0 0 L36 0 L6 28 Z" fill={bg} />
        </svg>
      </div>
    </div>
  );
};

/** The swap: what everyone says (struck out) vs what to say. */
export const XCheck: React.FC<Timed & {wrong: string; right: string; y?: number; rightAt?: number}> = ({t, at, out, wrong, right, y = 260, rightAt}) => {
  if (useContext(CoverCtx)) return null;
  const k1 = life(t, at, out);
  const k2 = life(t, rightAt ?? at + 0.45, out);
  const strike = p(t, at + 0.25, at + 0.55);
  if (k1 <= 0.001) return null;
  const row = (k: number, mark: React.ReactNode, body: React.ReactNode, bg: string) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 22, background: bg, borderRadius: 26, padding: '24px 30px', boxShadow: SHADOW, transform: `translateY(${(1 - k) * 20}px)`, opacity: clamp(k * 3), marginBottom: 22}}>
      {mark}
      <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 44, lineHeight: 1.15, color: C.ink, flex: 1}}>{body}</div>
    </div>
  );
  const glyph = (color: string, g: string) => <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 52, color, width: 50, textAlign: 'center', flexShrink: 0}}>{g}</div>;
  return (
    <div data-ui="XCheck" style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right, top: y}}>
      {row(k1, glyph(C.red, '✕'), (
        <span style={{position: 'relative', color: C.ink2}}>
          {wrong}
          <span style={{position: 'absolute', left: 0, top: '52%', height: 4, width: `${strike * 100}%`, background: C.red}} />
        </span>
      ), C.white)}
      {row(k2, glyph(C.ink, '✓'), right, C.gold)}
    </div>
  );
};

/** A tool or steps, one step lit at a time. `lit` = index of the lit step (or -1). `itemsAt` = when each item appears. */
export const ToolCard: React.FC<Timed & {title: string; items: string[]; itemsAt?: number[]; lit?: number; y?: number}> = ({t, at, out, title, items, itemsAt, lit = -1, y = 230}) => {
  if (useContext(CoverCtx)) return null;
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  return (
    <div data-ui="ToolCard" style={{position: 'absolute', left: SAFE.left + 20, right: W - SAFE.right + 20, top: y, transform: `translateY(${(1 - k) * 30}px)`, opacity: clamp(k * 3)}}>
      <div style={{background: C.white, borderRadius: 30, boxShadow: SHADOW, padding: '30px 34px 16px'}}>
        <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 76, textTransform: 'uppercase', color: C.ink, marginBottom: 12, lineHeight: 1}}>
          <span style={{background: C.gold, padding: '0 10px'}}>{title}</span>
        </div>
        {items.map((it, i) => {
          const ki = life(t, itemsAt?.[i] ?? at + 0.15 * (i + 1), out);
          const on = i === lit;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 14px', marginBottom: 10, borderRadius: 18, background: on ? C.goldGlow : 'transparent', transform: `translateX(${(1 - ki) * -30}px)`, opacity: clamp(ki * 2)}}>
              <div style={{width: 50, height: 50, borderRadius: 25, background: on ? C.ink : C.base2, color: on ? C.white : C.ink, fontFamily: FONT.ui, fontWeight: 700, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{i + 1}</div>
              <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 42, color: C.ink, lineHeight: 1.15}}>{it}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Every study citation: year, who, the finding. */
export const StudyCard: React.FC<Timed & {year: number | string; who: string; finding: string; y?: number}> = ({t, at, out, year, who, finding, y = 1080}) => {
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  return (
    <div data-ui="StudyCard" style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right + 10, top: y, transform: `translateY(${(1 - k) * 60}px)`, opacity: clamp(k * 3)}}>
      <div style={{background: C.white, borderRadius: 28, boxShadow: SHADOW, padding: '28px 34px'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 18, marginBottom: 10}}>
          <div style={{fontFamily: FONT.display, fontWeight: 600, fontSize: 64, color: C.ink, lineHeight: 1}}>{year}</div>
          <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 28, color: C.ink2, lineHeight: 1.2}}>{who}</div>
        </div>
        <div style={{height: 3, width: 90, background: C.gold, marginBottom: 14}} />
        <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 42, color: C.ink, lineHeight: 1.2}}>{finding}</div>
      </div>
    </div>
  );
};

/** DMs and texts on a phone. Each message appears at its own time. */
export const DmScreen: React.FC<Timed & {from: string; messages: {side: 'me' | 'them'; text: string; at: number}[]; y?: number}> = ({t, at, out, from, messages, y = 260}) => {
  if (useContext(CoverCtx)) return null;
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  return (
    <div data-ui="DmScreen" style={{position: 'absolute', left: 150, width: 780, top: y, height: 1150, transform: `translateY(${(1 - k) * 120}px)`, opacity: clamp(k * 3)}}>
      <div style={{width: '100%', height: '100%', background: C.ink, borderRadius: 90, padding: 18, boxShadow: SHADOW}}>
        <div style={{width: '100%', height: '100%', background: C.white, borderRadius: 74, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
          <div style={{padding: '60px 40px 24px', borderBottom: `2px solid ${C.base2}`, fontFamily: FONT.ui, fontWeight: 700, fontSize: 38, color: C.ink, textAlign: 'center'}}>{from}</div>
          <div style={{flex: 1, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 16}}>
            {messages.map((m, i) => {
              const km = life(t, m.at, out);
              if (km <= 0.001) return null;
              return (
                <div key={i} style={{alignSelf: m.side === 'me' ? 'flex-end' : 'flex-start', maxWidth: '82%', background: m.side === 'me' ? C.gold : C.base2, color: C.ink, fontFamily: FONT.ui, fontWeight: 500, fontSize: 38, lineHeight: 1.22, padding: '18px 26px', borderRadius: 32, transform: `scale(${km})`, transformOrigin: m.side === 'me' ? '100% 100%' : '0 100%'}}>{m.text}</div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Naming someone: a small pill with a thin line down to them (x, y = the point on the character). */
export const Label: React.FC<Timed & {text: string; x: number; y: number; color?: string; rise?: number}> = ({t, at, out, text, x, y, color = C.white, rise = 150}) => {
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  return (
    <div data-ui="Label" style={{position: 'absolute', left: x, top: y - rise, transform: `translate(-50%, -100%) scale(${0.9 + 0.1 * k})`, transformOrigin: '50% 100%', opacity: clamp(k * 3)}}>
      <div style={{background: color, borderRadius: 999, padding: '10px 28px', fontFamily: FONT.ui, fontWeight: 700, fontSize: 40, color: C.ink, boxShadow: SHADOW, whiteSpace: 'nowrap'}}>{text}</div>
      <div style={{position: 'absolute', left: '50%', top: '100%', width: 2, height: rise * k - 10, background: C.ink, transform: 'translateX(-50%)'}} />
    </div>
  );
};

/** A short verdict slammed onto the frame. */
export const Stamp: React.FC<Timed & {text: string; x?: number; y?: number; rot?: number; color?: string; size?: number}> = ({t, at, out, text, x = 540, y = 760, rot = -6, color = C.red, size = 120}) => {
  if (t < at) return null;
  const q = clamp((t - at) / 0.14);
  const s = lerp(1.8, 1, q * q);
  const o = out === undefined ? 1 : 1 - p(t, out - 0.15, out);
  return (
    <div data-ui="Stamp" style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: clamp(q * 3) * o}}>
      <div style={{border: `${size * 0.05}px solid ${color}`, padding: `${size * 0.06}px ${size * 0.22}px`, color, fontFamily: FONT.display, fontWeight: 700, fontSize: size * 1.15, lineHeight: 1, letterSpacing: size * 0.02, whiteSpace: 'nowrap', textTransform: 'uppercase', background: 'rgba(255,255,255,0.9)'}}>
        {text}
      </div>
    </div>
  );
};

/** library: weight_dial. A small gauge pinned to a screen point (the bottom centre), needle at `value` 0 (light) to 1 (heavy). */
export const Gauge: React.FC<Timed & {x: number; y: number; value: number; label?: string; size?: number}> = ({t, at, out, x, y, value, label, size = 150}) => {
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  const a = Math.PI * (1 - clamp(value)); // radians from the right end, 180° = light
  const r = size * 0.42;
  const cx = size / 2, cy = size * 0.58;
  return (
    <div data-ui="Gauge" style={{position: 'absolute', left: x - size / 2, top: y - size * 0.8, width: size, transform: `scale(${0.85 + 0.15 * k})`, transformOrigin: '50% 100%', opacity: clamp(k * 3)}}>
      <div style={{background: C.white, borderRadius: 22, boxShadow: SHADOW, padding: '8px 6px 6px', textAlign: 'center'}}>
        <svg width={size - 12} height={size * 0.62} viewBox={`0 0 ${size} ${size * 0.66}`}>
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={C.base2} strokeWidth={size * 0.07} strokeLinecap="round" />
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r * Math.cos(a)} ${cy - r * Math.sin(a)}`} fill="none" stroke={value > 0.6 ? C.gold : C.cold} strokeWidth={size * 0.07} strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx + r * 0.85 * Math.cos(a)} y2={cy - r * 0.85 * Math.sin(a)} stroke={C.ink} strokeWidth={size * 0.03} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={size * 0.04} fill={C.ink} />
        </svg>
        {label && <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: size * 0.15, color: C.ink2, marginTop: -4}}>{label}</div>}
      </div>
    </div>
  );
};

/** Shake whatever is inside on each hit time. */
export const Shake: React.FC<{t: number; hits: number[]; amp?: number; children: React.ReactNode}> = ({t, hits, amp = 22, children}) => {
  const [x, y, r] = shake(t, hits, amp);
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

/** Burned-in captions from the narration's word timestamps, a few words at a time, the spoken word on yellow. */
export const Captions: React.FC<{t: number; words: TimingWord[]; lineBreaks?: number[]; y?: number; maxWords?: number; hide?: [number, number][]}> = ({
  t, words, lineBreaks = [], y = 1290, maxWords = 3, hide = [],
}) => {
  if (useContext(CoverCtx)) return null;
  if (hide.some(([a, b]) => t >= a && t < b)) return null;
  const pages: TimingWord[][] = [];
  let cur: TimingWord[] = [];
  words.forEach((w, i) => {
    const prev = words[i - 1];
    const brk = cur.length >= maxWords || (prev && (/[.?!,]$/.test(prev.word) || w.start - prev.end > 0.35 || lineBreaks.some((lb) => Math.abs(lb - w.start) < 0.02)));
    if (brk && cur.length) {
      pages.push(cur);
      cur = [];
    }
    cur.push(w);
  });
  if (cur.length) pages.push(cur);
  const idx = pages.findIndex((pg, i) => t >= pg[0].start - 0.05 && t < (pages[i + 1]?.[0].start ?? pg[pg.length - 1].end + 0.5) - 0.05);
  if (idx < 0) return null;
  const page = pages[idx];
  return (
    <div data-ui="Captions" style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right + 30, top: y, textAlign: 'center'}}>
      {page.map((w, i) => {
        const active = t >= w.start - 0.02 && t < (page[i + 1]?.start ?? w.end + 0.4);
        return (
          <span key={i} style={{display: 'inline-block', margin: '0 8px', padding: '0 10px', fontFamily: FONT.display, fontWeight: 600, fontSize: 84, lineHeight: 1.12, textTransform: 'uppercase',
            color: C.ink, background: active ? C.gold : 'transparent', WebkitTextStroke: active ? undefined : `10px ${C.white}`, paintOrder: 'stroke fill'}}>
            {w.word.replace(/[.,!?]$/, '')}
          </span>
        );
      })}
    </div>
  );
};

/**
 * Logs "[offscreen] ..." for any on-screen component whose box leaves the frame (or, for text, runs
 * past the app's buttons on the right). Mounted once by <TimingProvider>; tools/make_video.py check reads it.
 */
export const OffscreenCheck: React.FC<{t: number}> = ({t}) => {
  useLayoutEffect(() => {
    const bad: string[] = [];
    document.querySelectorAll<HTMLElement>('[data-ui]').forEach((el) => {
      if (Number(getComputedStyle(el).opacity) < 0.05) return;
      // Remotion renders the video inside a container parked off the page (top ≈ -999999): measure from it.
      let root: HTMLElement = el;
      while (root.parentElement && root.parentElement !== document.body) root = root.parentElement;
      const base = root.getBoundingClientRect();
      const sx = W / (document.body.getBoundingClientRect().width || W);
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const x0 = (r.left - base.left) * sx, x1 = (r.right - base.left) * sx, y0 = (r.top - base.top) * sx, y1 = (r.bottom - base.top) * sx;
      const at = `x ${Math.round(x0)}..${Math.round(x1)}, y ${Math.round(y0)}..${Math.round(y1)}`;
      if (x0 < -2 || y0 < -2 || x1 > W + 2 || y1 > H + 2) bad.push(`${el.dataset.ui} off the frame (${at})`);
      else if (el.dataset.ui !== 'Captions' && (x1 > W - 40 || y0 < 60)) bad.push(`${el.dataset.ui} touches the edge (${at})`);
    });
    if (bad.length) console.warn(`[offscreen] ${t.toFixed(2)}s ${[...new Set(bad)].join(', ')}`);
  });
  return null;
};
