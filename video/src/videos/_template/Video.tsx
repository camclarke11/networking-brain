// __SLUG__ (scripts/__SLUG__.md). Written by following knowledge/13-video-production.md.
// Metaphor: <one line from the storyboard's concept>.
// Rule: every time comes from the narration (cue / word / line / shot), never typed in by hand.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {camPath, Stage} from '../../kit/three/Stage';
import {Character, Crowd} from '../../kit/three/Character';
import {EventHall} from '../../kit/three/sets';
import {talk} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '__SLUG__';

// One component per shot (or per group of shots that share a set). Each takes the global time t.
const Shot1: React.FC<{t: number}> = ({t}) => {
  const {shot, line} = useTiming();
  const s = shot(1);
  const cam = camPath(t, [[s.start, {pos: [0, 1.7, 6.5], target: [0, 1.45, 0], fov: 32}], [s.end, {pos: [0, 1.6, 5.2], target: [0, 1.5, 0], fov: 32}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="event">
        <EventHall t={t} />
        <Crowd t={t} spots={[[-2.5, -2.5], [2.6, -3], [-1, -6], [1.5, -6.5]]} />
        <Character who="you" t={t} pose="talk" talking={talk(t, line(1).start, line(1).end)} />
      </Stage>
      <BigText t={t} at={0.05} text="Your hook text here" highlight="hook" />
    </AbsoluteFill>
  );
};

const Sound: React.FC = () => {
  const {shot} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="whoosh" at={shot(1).start} volume={0.3} />
    </>
  );
};

const Edit: React.FC = () => {
  const t = useT();
  const {words, shot, timing: tm} = useTiming();
  return (
    <AbsoluteFill style={{background: C.base}}>
      <Timeline shots={[{id: 1, render: (tt) => <Shot1 t={tt} />}]} />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(1).end]]} />
      <Grain />
      <Sound />
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
