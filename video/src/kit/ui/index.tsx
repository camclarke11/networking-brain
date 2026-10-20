// The on-screen components (knowledge/12-visual-storyboard.md §4). These are the brand's design
// system: a video chooses where and when they appear, never how they look.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, FONT, SAFE, SHADOW, W} from '../tokens';
import {clamp, EIN, lerp, p, shake, spr} from '../time';
import type {TimingWord} from '../timing';
import type {CastId} from '../three/Character';
import {CAST} from '../three/Character';

type Timed = {t: number; at: number; out?: number};

/** Pop-in/out helper. Returns 0 before `at`, springs to 1, and eases back to 0 at `out`. */
const life = (t: number, at: number, out?: number) => {
  const inn = spr(t, at, {damping: 13, stiffness: 190, mass: 0.6});
  const o = out === undefined ? 1 : 1 - p(t, out - 0.18, out, EIN);
  return Math.max(0, Math.min(inn, 1.2)) * o;
};

/** Hook text on frame one (4 to 9 words). One word can be highlighted gold. */
export const BigText: React.FC<Timed & {text: string; highlight?: string; y?: number; size?: number; color?: string; stagger?: number}> = ({
  t, at, out, text, highlight, y = 300, size = 104, color = C.ink, stagger = 0.06,
}) => {
  const words = text.split(' ');
  const hl = highlight?.toLowerCase();
  return (
    <div style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right + 10, top: y, textAlign: 'center', lineHeight: 1.02}}>
      {words.map((w, i) => {
        const k = life(t, at + i * stagger, out);
        const isHl = hl && w.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(hl);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block', margin: `0 ${size * 0.13}px`, fontFamily: FONT.display, fontWeight: 800, fontSize: size, letterSpacing: -size * 0.02,
              color: isHl ? C.ink : color, opacity: clamp(k * 2),
              transform: `translateY(${(1 - k) * 60}px) scale(${0.6 + 0.4 * k}) rotate(${(1 - k) * (i % 2 ? 6 : -6)}deg)`,
              background: isHl ? C.gold : undefined, padding: isHl ? `0 ${size * 0.12}px` : undefined, borderRadius: isHl ? size * 0.16 : undefined,
              textShadow: isHl ? undefined : `0 4px 0 ${C.white}, 0 8px 24px rgba(255,252,246,0.7)`,
              boxShadow: isHl ? '0 8px 0 ' + C.goldDeep : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** The exact words someone says. Pin it to a screen point (x, y = where the tail points). */
export const QuoteBubble: React.FC<Timed & {speaker: CastId; text: string; x: number; y: number; side?: 'left' | 'right'; width?: number; tone?: 'neutral' | 'wrong' | 'right'; typeOn?: boolean}> = ({
  t, at, out, speaker, text, x, y, side = 'left', width = 640, tone = 'neutral', typeOn = true,
}) => {
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  const chars = typeOn ? Math.floor(clamp((t - at) / Math.max(0.5, text.length * 0.028)) * text.length) : text.length;
  const bg = tone === 'wrong' ? C.coldLight : tone === 'right' ? C.gold : C.white;
  const left = side === 'left' ? x - 70 : x - width + 70;
  const name = speaker === 'you' ? 'You' : null;
  return (
    <div style={{position: 'absolute', left: clamp(left, SAFE.left - 20, SAFE.right - width + 40), top: y - 40, width, transformOrigin: `${x - left}px 100%`, transform: `translateY(-100%) scale(${k})`, opacity: clamp(k * 3)}}>
      <div style={{position: 'relative', background: bg, borderRadius: 44, padding: '34px 44px', boxShadow: SHADOW, border: `4px solid ${C.ink}`}}>
        {name && (
          <div style={{position: 'absolute', top: -30, left: 36, background: CAST[speaker].top, color: C.ink, fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, padding: '6px 18px', borderRadius: 20, border: `4px solid ${C.ink}`}}>{name}</div>
        )}
        <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 52, lineHeight: 1.18, color: C.ink, letterSpacing: -0.5}}>
          <span>{text.slice(0, chars)}</span>
          <span style={{opacity: 0}}>{text.slice(chars)}</span>
        </div>
        <svg width={60} height={50} style={{position: 'absolute', bottom: -44, left: side === 'left' ? 60 : undefined, right: side === 'right' ? 60 : undefined, transform: side === 'right' ? 'scaleX(-1)' : undefined}}>
          <path d="M4 0 L40 0 L8 44 Z" fill={bg} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
          <rect x={0} y={-6} width={46} height={8} fill={bg} />
        </svg>
      </div>
    </div>
  );
};

/** The swap: what everyone says (struck out) vs what to say. */
export const XCheck: React.FC<Timed & {wrong: string; right: string; y?: number; rightAt?: number}> = ({t, at, out, wrong, right, y = 260, rightAt}) => {
  const k1 = life(t, at, out);
  const k2 = life(t, rightAt ?? at + 0.45, out);
  const strike = p(t, at + 0.25, at + 0.55);
  if (k1 <= 0.001) return null;
  const row = (k: number, icon: React.ReactNode, body: React.ReactNode, bg: string, rot: number) => (
    <div style={{display: 'flex', alignItems: 'center', gap: 24, background: bg, borderRadius: 34, padding: '26px 34px', border: `4px solid ${C.ink}`, boxShadow: SHADOW, transform: `scale(${k}) rotate(${rot}deg)`, opacity: clamp(k * 3), marginBottom: 26}}>
      {icon}
      <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 46, lineHeight: 1.15, color: C.ink, flex: 1}}>{body}</div>
    </div>
  );
  const badge = (bg: string, glyph: string) => (
    <div style={{width: 76, height: 76, borderRadius: 38, background: bg, color: C.white, fontFamily: FONT.ui, fontWeight: 800, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: `4px solid ${C.ink}`}}>{glyph}</div>
  );
  return (
    <div style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right, top: y}}>
      {row(k1, badge(C.red, '✕'), (
        <span style={{position: 'relative', color: C.ink2}}>
          {wrong}
          <span style={{position: 'absolute', left: 0, top: '52%', height: 6, width: `${strike * 100}%`, background: C.red, borderRadius: 3}} />
        </span>
      ), C.coldLight, -1.5)}
      {row(k2, badge(C.green, '✓'), right, C.gold, 1)}
    </div>
  );
};

/** A tool or steps, one step lit at a time. `lit` = index of the lit step (or -1). `itemsAt` = when each item appears. */
export const ToolCard: React.FC<Timed & {title: string; items: string[]; itemsAt?: number[]; lit?: number; y?: number}> = ({t, at, out, title, items, itemsAt, lit = -1, y = 230}) => {
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: SAFE.left + 20, right: W - SAFE.right + 20, top: y, transform: `scale(${k})`, transformOrigin: '50% 0', opacity: clamp(k * 3)}}>
      <div style={{background: C.white, borderRadius: 40, border: `4px solid ${C.ink}`, boxShadow: SHADOW, padding: '30px 36px 18px'}}>
        <div style={{fontFamily: FONT.display, fontWeight: 800, fontSize: 64, color: C.ink, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 16}}>
          <span style={{background: C.gold, borderRadius: 16, padding: '0 16px', border: `4px solid ${C.ink}`}}>{title}</span>
        </div>
        {items.map((it, i) => {
          const ki = life(t, itemsAt?.[i] ?? at + 0.15 * (i + 1), out);
          const on = i === lit;
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '14px 18px', marginBottom: 12, borderRadius: 24, background: on ? C.goldGlow : 'transparent', transform: `translateX(${(1 - ki) * -40}px) scale(${on ? 1.03 : 1})`, opacity: clamp(ki * 2)}}>
              <div style={{width: 58, height: 58, borderRadius: 29, background: on ? C.gold : C.base2, border: `4px solid ${C.ink}`, fontFamily: FONT.ui, fontWeight: 800, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink, flexShrink: 0}}>{i + 1}</div>
              <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 44, color: C.ink, lineHeight: 1.15}}>{it}</div>
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
    <div style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right + 10, top: y, transform: `translateY(${(1 - k) * 120}px) rotate(${lerp(-4, -1.2, k)}deg)`, opacity: clamp(k * 3)}}>
      <div style={{background: '#FFF8E6', borderRadius: 26, border: `4px solid ${C.ink}`, boxShadow: SHADOW, padding: '28px 34px', backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 58px, rgba(127,147,171,0.25) 58px 60px)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 12}}>
          <div style={{background: C.ink, color: C.gold, fontFamily: FONT.ui, fontWeight: 800, fontSize: 36, padding: '6px 18px', borderRadius: 14}}>{year}</div>
          <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 30, color: C.ink2, lineHeight: 1.15}}>{who}</div>
        </div>
        <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 44, color: C.ink, lineHeight: 1.2}}>{finding}</div>
      </div>
    </div>
  );
};

/** DMs and texts on a phone. Each message appears at its own time. */
export const DmScreen: React.FC<Timed & {from: string; messages: {side: 'me' | 'them'; text: string; at: number}[]; y?: number}> = ({t, at, out, from, messages, y = 260}) => {
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: 150, width: 780, top: y, height: 1150, transform: `translateY(${(1 - k) * 200}px)`, opacity: clamp(k * 3)}}>
      <div style={{width: '100%', height: '100%', background: C.ink, borderRadius: 90, padding: 22, boxShadow: SHADOW}}>
        <div style={{width: '100%', height: '100%', background: C.white, borderRadius: 70, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
          <div style={{padding: '60px 40px 24px', borderBottom: `3px solid ${C.base2}`, fontFamily: FONT.ui, fontWeight: 800, fontSize: 40, color: C.ink, textAlign: 'center'}}>{from}</div>
          <div style={{flex: 1, padding: 34, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 18}}>
            {messages.map((m, i) => {
              const km = life(t, m.at, out);
              if (km <= 0.001) return null;
              return (
                <div key={i} style={{alignSelf: m.side === 'me' ? 'flex-end' : 'flex-start', maxWidth: '82%', background: m.side === 'me' ? C.gold : C.base2, color: C.ink, fontFamily: FONT.ui, fontWeight: 600, fontSize: 38, lineHeight: 1.22, padding: '20px 28px', borderRadius: 36, transform: `scale(${km})`, transformOrigin: m.side === 'me' ? '100% 100%' : '0 100%'}}>{m.text}</div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Naming someone: a pill with a line down to them (x, y = the point on the character). */
export const Label: React.FC<Timed & {text: string; x: number; y: number; color?: string; rise?: number}> = ({t, at, out, text, x, y, color = C.white, rise = 150}) => {
  const k = life(t, at, out);
  if (k <= 0.001) return null;
  return (
    <div style={{position: 'absolute', left: x, top: y - rise, transform: `translate(-50%, -100%) scale(${k})`, transformOrigin: '50% 100%', opacity: clamp(k * 3)}}>
      <div style={{background: color, border: `4px solid ${C.ink}`, borderRadius: 26, padding: '8px 28px', fontFamily: FONT.hand, fontWeight: 700, fontSize: 64, color: C.ink, boxShadow: SHADOW, whiteSpace: 'nowrap'}}>{text}</div>
      <div style={{position: 'absolute', left: '50%', top: '100%', width: 4, height: rise * k - 10, background: C.ink, transform: 'translateX(-50%)'}} />
    </div>
  );
};

/** A short verdict slammed onto the frame. Wrap the shot in <StampShake> to shake it on impact. */
export const Stamp: React.FC<Timed & {text: string; x?: number; y?: number; rot?: number; color?: string; size?: number}> = ({t, at, out, text, x = 540, y = 760, rot = -9, color = C.red, size = 120}) => {
  if (t < at) return null;
  const q = clamp((t - at) / 0.14);
  const s = lerp(2.4, 1, q * q);
  const o = out === undefined ? 1 : 1 - p(t, out - 0.15, out);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, opacity: clamp(q * 3) * o}}>
      <div style={{border: `${size * 0.08}px solid ${color}`, borderRadius: size * 0.14, padding: `${size * 0.1}px ${size * 0.3}px`, color, fontFamily: FONT.display, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: size * 0.02, whiteSpace: 'nowrap', background: 'rgba(255,252,246,0.82)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)'}}>
        {text}
      </div>
    </div>
  );
};

/** Shake whatever is inside on each hit time. */
export const Shake: React.FC<{t: number; hits: number[]; amp?: number; children: React.ReactNode}> = ({t, hits, amp = 22, children}) => {
  const [x, y, r] = shake(t, hits, amp);
  return <AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotate(${r}deg)`}}>{children}</AbsoluteFill>;
};

/** Burned-in captions from the narration's word timestamps, a few words at a time, the spoken word in gold. */
export const Captions: React.FC<{t: number; words: TimingWord[]; lineBreaks?: number[]; y?: number; maxWords?: number; hide?: [number, number][]}> = ({
  t, words, lineBreaks = [], y = 1290, maxWords = 3, hide = [],
}) => {
  if (hide.some(([a, b]) => t >= a && t < b)) return null;
  // Build pages: break on sentence ends, script line starts, long pauses, or maxWords.
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
  const k = spr(t, page[0].start - 0.05, {damping: 14, stiffness: 260, mass: 0.5});
  return (
    <div style={{position: 'absolute', left: SAFE.left, right: W - SAFE.right + 30, top: y, textAlign: 'center', transform: `scale(${0.85 + 0.15 * Math.min(k, 1.05)})`}}>
      {page.map((w, i) => {
        const active = t >= w.start - 0.02 && t < (page[i + 1]?.start ?? w.end + 0.4);
        const said = t >= w.start - 0.02;
        return (
          <span key={i} style={{display: 'inline-block', margin: '0 12px', fontFamily: FONT.display, fontWeight: 800, fontSize: 82, lineHeight: 1.1, letterSpacing: -1,
            color: active ? C.gold : C.white, opacity: said ? 1 : 0.55, transform: `scale(${active ? 1.08 : 1})`,
            WebkitTextStroke: `12px ${C.ink}`, paintOrder: 'stroke fill', textShadow: '0 6px 0 rgba(33,28,23,0.9)'}}>
            {w.word.replace(/[.,!?]$/, '').toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};

