// Reads scripts/<slug>.timing.json (written by tools/align.py) so every visual can be
// pinned to the spoken word it lands on.
import React, {createContext, useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {FPS} from './tokens';

export type TimingWord = {word: string; start: number; end: number};
export type TimingShot = {
  id: number;
  title: string | null;
  lines: [number, number];
  start: number;
  end: number;
  duration: number;
  cues: {word: string; what: string; time: number | null}[];
  on_screen: {type: string; at: string | null; time: number | null}[];
};
export type Timing = {
  duration: number;
  lines: {line: number; text: string; start: number | null; end: number | null}[];
  shots: TimingShot[];
  words: TimingWord[];
};

const Ctx = createContext<Timing | null>(null);

export const TimingProvider: React.FC<{timing: Timing; children: React.ReactNode}> = ({timing, children}) => (
  <Ctx.Provider value={timing}>{children}</Ctx.Provider>
);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/** Seconds since the video started. Use this, not useCurrentFrame, inside shots. */
export const useT = () => useCurrentFrame() / FPS;

export const useTiming = () => {
  const tm = useContext(Ctx);
  if (!tm) throw new Error('useTiming() needs a <TimingProvider>.');
  const shot = (id: number) => {
    const s = tm.shots.find((x) => x.id === id);
    if (!s) throw new Error(`No shot ${id} in timing.json`);
    return s;
  };
  /** First time `word` (one or more words) is said at or after `from` seconds. */
  const word = (w: string, from = 0, to = Infinity): number => {
    const target = w.split(/\s+/).map(norm).filter(Boolean);
    const ws = tm.words;
    for (let i = 0; i < ws.length; i++) {
      if (ws[i].start + 1e-3 < from || ws[i].start > to) continue;
      if (target.every((tok, k) => ws[i + k] && norm(ws[i + k].word) === tok)) return ws[i].start;
    }
    // Partial match ("2,000" vs "2000", "Harvard's" vs "Harvard")
    for (let i = 0; i < ws.length; i++) {
      if (ws[i].start + 1e-3 < from || ws[i].start > to) continue;
      if (norm(ws[i].word).startsWith(target[0]) || target[0].startsWith(norm(ws[i].word))) return ws[i].start;
    }
    console.warn(`word "${w}" not found after ${from}s`);
    return from;
  };
  /** Time of a storyboard cue: shot id + the cue's word. Falls back to searching the shot. */
  const cue = (id: number, w: string) => {
    const s = shot(id);
    const c = s.cues.find((x) => norm(x.word) === norm(w));
    if (c && c.time !== null) return c.time;
    return word(w, s.start, s.end + 0.01);
  };
  /** When the nth word after `from` ends (handy for "when this sentence finishes"). */
  const wordEnd = (w: string, from = 0) => {
    const t = word(w, from);
    const hit = tm.words.find((x) => Math.abs(x.start - t) < 1e-6);
    return hit ? hit.end : t + 0.3;
  };
  const line = (n: number) => {
    const l = tm.lines[n - 1];
    return {start: l?.start ?? 0, end: l?.end ?? 0, text: l?.text ?? ''};
  };
  return {timing: tm, duration: tm.duration, shots: tm.shots, words: tm.words, shot, word, wordEnd, cue, line};
};
