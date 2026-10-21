// Plays the shots back to back on the narration's clock, with the transition each shot asks for.
// Shots are plain functions of the global time t, so the outgoing shot keeps moving during a transition.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {H, W} from './tokens';
import {clamp, EIO, EO, p} from './time';
import {useT, useTiming} from './timing';

export type Transition = 'cut' | 'whip' | 'flash' | 'push' | 'zoom' | 'drop' | 'fade';

export type ShotDef = {
  id: number; // storyboard shot id
  enter?: Transition;
  render: (t: number) => React.ReactNode;
};

const DUR: Record<Transition, number> = {cut: 0, whip: 0.32, flash: 0.22, push: 0.4, zoom: 0.35, drop: 0.45, fade: 0.4};

export const Timeline: React.FC<{shots: ShotDef[]}> = ({shots}) => {
  const t = useT();
  const {shot} = useTiming();
  const starts = shots.map((s, i) => (i === 0 ? 0 : shot(s.id).start));
  let i = 0;
  while (i + 1 < shots.length && t >= starts[i + 1]) i++;
  const cur = shots[i];
  const enter = cur.enter ?? 'cut';
  const d = DUR[enter];
  const k = d > 0 ? clamp((t - starts[i]) / d) : 1;
  const prev = i > 0 && k < 1 ? shots[i - 1] : null;

  const layer = (node: React.ReactNode, style: React.CSSProperties, key: string) => (
    <AbsoluteFill key={key} style={{overflow: 'hidden', ...style}}>
      {node}
    </AbsoluteFill>
  );

  if (!prev) return layer(cur.render(t), {}, 'c' + cur.id);

  const e = EIO(k);
  switch (enter) {
    case 'whip': {
      const blur = Math.sin(k * Math.PI) * 28;
      return (
        <AbsoluteFill>
          {layer(prev.render(t), {transform: `translateX(${-e * W}px) scaleX(${1 + blur / 60})`, filter: `blur(${blur}px)`}, 'p' + prev.id)}
          {layer(cur.render(t), {transform: `translateX(${(1 - e) * W}px) scaleX(${1 + blur / 60})`, filter: `blur(${blur}px)`}, 'c' + cur.id)}
        </AbsoluteFill>
      );
    }
    case 'flash':
      return (
        <AbsoluteFill>
          {layer(cur.render(t), {}, 'c' + cur.id)}
          <AbsoluteFill style={{background: '#fff', opacity: 1 - p(t, starts[i], starts[i] + d)}} />
        </AbsoluteFill>
      );
    case 'push':
      return (
        <AbsoluteFill>
          {layer(prev.render(t), {transform: `scale(${1 + 0.15 * e})`, opacity: 1 - e}, 'p' + prev.id)}
          {layer(cur.render(t), {transform: `scale(${1.15 - 0.15 * EO(k)})`, opacity: e}, 'c' + cur.id)}
        </AbsoluteFill>
      );
    case 'zoom':
      return (
        <AbsoluteFill>
          {layer(cur.render(t), {}, 'c' + cur.id)}
          {layer(prev.render(t), {transform: `scale(${1 + 2.5 * e * e})`, opacity: 1 - e, filter: `blur(${e * 14}px)`}, 'p' + prev.id)}
        </AbsoluteFill>
      );
    case 'drop':
      return (
        <AbsoluteFill>
          {layer(prev.render(t), {}, 'p' + prev.id)}
          {layer(cur.render(t), {transform: `translateY(${(1 - EO(k)) * -H}px)`, boxShadow: '0 30px 80px rgba(0,0,0,0.35)'}, 'c' + cur.id)}
        </AbsoluteFill>
      );
    case 'fade':
    default:
      return (
        <AbsoluteFill>
          {layer(prev.render(t), {}, 'p' + prev.id)}
          {layer(cur.render(t), {opacity: e}, 'c' + cur.id)}
        </AbsoluteFill>
      );
  }
};
