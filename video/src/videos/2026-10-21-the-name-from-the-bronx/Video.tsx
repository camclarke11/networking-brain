// "The name from the Bronx" (scripts/2026-10-21-the-name-from-the-bronx.md).
// Metaphor: the name is a price tag. Whenever the fancy name types onto a label, the tag hanging off it grows and
// glows, though the tub never changes. Every time comes from the narration (cue / word / line / shot).
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {Laptop, PriceTag, StoreTable} from '../../kit/three/brand';
import {FreezerCase, IceCreamTub, LetterTiles, SnowPeaks, StandCard} from '../../kit/three/shop';
import {clamp, EIO, EO, lerp, p, spr, talk} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-name-from-the-bronx';
const NAME = 'HÄAGEN-DAZS';
type V3 = [number, number, number];

/** A tub with its price tag hanging just off its right side. `fancy` 0..1 types the name over the plain label;
 * the tag grows with it (the metaphor). */
const TaggedTub: React.FC<{t: number; position: V3; scale?: number; fancy: number; tagGrow?: number; tagGlow?: number; lid?: number; scoop?: number; lift?: number; plain?: string; swing?: number; above?: boolean; left?: boolean; maxTag?: number}> = ({
  t, position, scale = 1, fancy, tagGrow = fancy, tagGlow = 0, lid = 0, scoop = 0, lift = 0, plain = 'ICE CREAM', swing = 0, above = false, left = false, maxTag = 0.62,
}) => {
  const showName = fancy > 0.02;
  const label = showName ? NAME : plain;
  const typed = showName ? fancy : 1;
  const y = position[1] + lift * 0.15 * scale;
  const tagScale = scale * lerp(0.3, maxTag, clamp(tagGrow));
  const tagW = 0.62 * tagScale;
  const tagPos: V3 = above
    ? [position[0], y + 0.36 * scale + 0.5 * tagScale, position[2]]
    : [position[0] + (left ? -1 : 1) * (0.105 * scale + tagW / 2 + 0.03), y + 0.24 * scale, position[2] + 0.02];
  return (
    <group>
      <IceCreamTub position={[position[0], y, position[2]]} scale={scale} label={label} typed={typed} lid={lid} scoop={scoop} />
      <PriceTag text={tagGrow > 0.5 ? '$$$' : '$'} position={tagPos} string={0.1} scale={tagScale} glow={tagGlow} swing={0.05 * Math.sin(t * 1.8) + swing} />
    </group>
  );
};

// ---------- Shot 1: the fancy tub in the freezer aisle ----------
const FancyTub: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const freezer = cue(1, 'freezer');
  const fancy = cue(1, 'fancy');
  const name = cue(1, 'Häagen');
  const cam = camPath(t, [[0, {pos: [0.25, 1.55, 5.4], target: [0.0, 1.2, 0], fov: 40}], [fancy, {pos: [0.15, 1.45, 4.6], target: [-0.05, 1.15, 0], fov: 40}], [name, {pos: [-0.5, 1.12, 2.75], target: [-0.55, 0.86, 0.3], fov: 38}], [s.end, {pos: [-0.52, 1.1, 2.55], target: [-0.55, 0.86, 0.3], fov: 38}]]);
  const typed = p(t, fancy, name + 0.2);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <FreezerCase position={[0, 0, -1.25]} cold={lerp(0.2, 1, p(t, freezer - 0.2, freezer + 0.6))} />
        <Character who="you" t={t} position={[0, 0, 0]} pose="hold" mood={t > name ? 'excited' : 'happy'} look={-0.25} lookUp={-0.35}
          rightHand={<group rotation={[1.0, 0, 0.3, 'ZYX']}><TaggedTub t={t} position={[0, -0.04, 0.05]} scale={1.25} fancy={typed} tagGrow={p(t, name, name + 0.6)} left maxTag={0.5} /></group>} />
      </Stage>
      <BigText t={t} at={0.08} out={fancy} text="The fanciest name in the freezer" highlight="fanciest" y={220} size={92} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: Denmark? The Bronx ----------
const NotDenmark: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(2);
  const denmark = cue(2, 'Denmark');
  const bronx = cue(2, 'Bronx');
  const flip = p(t, bronx - 0.25, bronx + 0.2, EIO);
  const jolt = spr(t, bronx);
  const cam = camPath(t, [[s.start, {pos: [0, 1.6, 6.2], target: [0, 1.7, 0], fov: 38}], [s.end, {pos: [0, 1.6, 5.6], target: [0, 1.7, 0], fov: 38}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StandCard text="DENMARK?" back={'THE BRONX,\nNEW YORK'} position={[0, 0, -0.6]} size={[2.3, 1.1]} stand={1.75} flip={flip} pop={p(t, s.start, denmark, EO)} glow={flip > 0.5 ? 0.3 : 0} />
        <Character who="you" t={t} position={[0.55, 0, -0.05]} rotY={-0.35} pose={t > bronx ? 'shrug' : 'idle'} mood={t > bronx ? 'shock' : 'neutral'} lookUp={0.35} look={-0.3} hop={t > bronx ? Math.max(0, Math.sin(Math.min(1, t - bronx) * Math.PI)) * 0.12 * (1 - jolt * 0) : 0} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 3: Reuben at the kitchen table ----------
const KitchenTable: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(3);
  const kitchen = cue(3, 'kitchen');
  const anything = cue(3, 'anything');
  const dotted = cue(3, 'dotted');
  const order = p(t, s.start + 0.4, kitchen + 0.3, EIO);
  const blank = p(t, anything - 0.1, anything + 0.1) * (1 - p(t, anything + 0.8, anything + 1.1));
  const card = p(t, dotted - 0.5, dotted + 0.1, EO);
  const cam: Cam = camPath(t, [[s.start, {pos: [0.9, 2.45, 3.4], target: [0.0, 1.05, -0.3], fov: 40}], [line(7).start, {pos: [0.25, 2.1, 2.75], target: [0.05, 0.95, -0.05], fov: 40}], [s.end, {pos: [0.2, 2.05, 2.6], target: [0.05, 0.95, -0.05], fov: 40}]]);
  const head = toScreen(cam, [-0.15, 1.9, -0.95]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.2]} length={1.8} depth={0.8} />
        <LetterTiles text={NAME} position={[0, 0.92, -0.1]} order={order} blank={blank} strike={1} strikeK={p(t, dotted, dotted + 0.4)} size={0.095} />
        <Character who="stranger_a" t={t} position={[-0.15, 0, -0.95]} rotY={0.15} pose={t < kitchen + 0.3 ? 'cards' : 'think'} mood={t > dotted ? 'happy' : 'neutral'} lookUp={-0.45} talking={0} seed={4} />
        <group position={[0, 0.93, 0.27]} rotation={[-1.05, 0, 0]}><StandCard text={'DANISH:  Æ  Ø  Å'} position={[0, -0.09, 0]} size={[0.62, 0.17]} stand={0} pop={card} /></group>
      </Stage>
      <Label t={t} at={s.start + 0.1} out={kitchen + 0.6} text="Reuben Mattus" x={clamp(head[0], 260, 820)} y={Math.max(head[1], 470)} rise={110} />
    </AbsoluteFill>
  );
};

// ---------- Shot 4: the name gets there first (screenshot moment) ----------
const NameFirst: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s = shot(4);
  const knew = cue(4, 'knew');
  const before = cue(4, 'before');
  const picture = cue(4, 'picture');
  const serious = word('serious', line(10).start);
  const hand = cue(4, 'hand');
  const good = cue(4, 'good');
  const orbit = p(t, s.start, before + 0.5, EIO);
  const a = lerp(-0.45, 0, orbit);
  const cam: Cam = {pos: [0.25 + Math.sin(a) * 3.4, 1.15 + 0.15 * (1 - orbit), Math.cos(a) * 3.4], target: [0.25, 0.5, 0], fov: 36};
  const flicker = t > knew && t < before ? (Math.sin((t - knew) * 22) > 0.4 ? 0.04 : 0) : 0;
  const fancy = p(t, before - 0.1, before + 0.7);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={p(t, good, good + 0.6) * 0.25}>
        <Floor />
        <SnowPeaks position={[0.2, 0, -3.2]} rise={p(t, picture - 0.2, picture + 0.9)} />
        <StandCard text={'OLD WORLD\nDAIRY'} position={[-1.35, 0, -1.6]} size={[0.9, 0.5]} stand={0.7} rotY={0.25} pop={p(t, serious - 0.2, serious + 0.4)} />
        <TaggedTub t={t} position={[-0.12, 0.3 + flicker, 0]} scale={2.0} maxTag={0.55} fancy={fancy} tagGrow={p(t, before, before + 0.9)} tagGlow={p(t, good - 0.1, good + 0.5)} lift={p(t, hand - 0.2, hand + 0.4, EO)} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 5: same ice cream, two names ----------
const TwoTubs: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(5);
  const rich = cue(5, 'rich');
  const expect = cue(5, 'expect');
  const wob = Math.sin(Math.max(0, t - rich) * 14) * Math.exp(-Math.max(0, t - rich) * 4) * (t > rich ? 0.06 : 0);
  const cam = camPath(t, [[s.start, {pos: [0, 1.25, 3.6], target: [0, 0.6, 0], fov: 36}], [s.end, {pos: [0, 1.22, 3.35], target: [0, 0.6, 0], fov: 36}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <TaggedTub t={t} position={[-0.33, 0.3, 0]} scale={1.7} fancy={0} tagGrow={0} lid={1} scoop={1} swing={wob} above />
        <TaggedTub t={t} position={[0.33, 0.3, 0]} scale={1.7} above fancy={1} tagGrow={lerp(0.6, 1.0, p(t, expect - 0.1, expect + 0.5, EO))} maxTag={0.4} tagGlow={0.8} lid={1} scoop={1} swing={-wob} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 6: name your package ----------
const YourPackage: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s = shot(6);
  const sell = cue(6, 'sell');
  const launch = cue(6, 'Launch');
  const price = word('price', line(17).start);
  const flip = p(t, launch - 0.3, launch + 0.15, EIO);
  const grow = p(t, launch, launch + 0.7, EO);
  const cam = camPath(t, [[s.start, {pos: [0.45, 1.65, 5.6], target: [0.1, 1.5, 0], fov: 40}], [launch, {pos: [0.35, 1.62, 5.1], target: [0.1, 1.5, 0], fov: 40}], [s.end, {pos: [0.32, 1.6, 4.95], target: [0.1, 1.5, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={p(t, price - 0.1, price + 0.5) * 0.2}>
        <Floor />
        <StoreTable position={[0, 0, 0.2]} length={1.6} depth={0.7} />
        <Laptop position={[0.1, 0.92, 0.2]} rotY={Math.PI} openDeg={105} />
        <Character who="you" t={t} position={[0.1, 0, -0.5]} pose={t > launch ? 'present' : 'think'} mood={t > launch ? 'excited' : 'neutral'} lookUp={0.25} talking={0} />
        <StandCard text={'WEBSITE\nPACKAGE'} back={'THE LAUNCH\nBUILD'} position={[-0.25, 1.72, -0.9]} size={[1.3, 0.7]} stand={0} flip={flip} pop={p(t, sell - 0.3, sell + 0.3, EO)} glow={grow * 0.4} />
        <PriceTag text={grow > 0.4 ? '$$$' : '$'} position={[0.72, 2.38, -0.88]} string={0.14} scale={lerp(0.45, 0.85, grow)} glow={p(t, price - 0.1, price + 0.5)} swing={0.06 * Math.sin(t * 1.6)} />
      </Stage>
      <XCheck t={t} at={line(15).start} out={s.end} wrong="Website package" right="The Launch Build" rightAt={launch} y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: Jay's sign ----------
const JaysSign: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(7);
  const solutions = cue(7, 'solutions');
  const cam: Cam = {pos: [0, 1.75, 5.4], target: [0, 1.55, 0], fov: 38};
  const head = toScreen(cam, [0, 1.76, 0.3]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StandCard text={"JAY'S SOLUTIONS"} position={[0, 2.15, -0.4]} size={[1.5, 0.42]} stand={0} />
        <PriceTag text="$" position={[0.62, 2.15, -0.35]} string={0.15} scale={0.35} swing={t > solutions ? 0.25 * Math.sin((t - solutions) * 8) * Math.exp(-(t - solutions) * 2) : 0.03 * Math.sin(t * 2)} />
        <Character who="friend" t={t} position={[0, 0, 0.3]} pose="pocket" mood="bored" seed={7} />
      </Stage>
      <Label t={t} at={s.start + 0.6} text="Jay" x={head[0]} y={head[1]} rise={40} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue, word, line} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="pop" at={cue(1, 'Häagen')} volume={0.1} />
      <Sfx name="click" at={cue(2, 'Bronx') - 0.1} volume={0.12} />
      <Sfx name="tick" at={cue(3, 'kitchen')} volume={0.08} />
      <Sfx name="pop" at={cue(4, 'before')} volume={0.09} />
      <Sfx name="ding" at={cue(4, 'good')} volume={0.08} />
      <Sfx name="click" at={cue(6, 'Launch') - 0.15} volume={0.1} />
      <Sfx name="ding" at={word('price', line(17).start)} volume={0.07} />
    </>
  );
};

const Edit: React.FC = () => {
  const t = useT();
  const {words, line, cue: cueOf, timing: tm} = useTiming();
  return (
    <AbsoluteFill style={{background: C.base}}>
      <Timeline
        shots={[
          {id: 1, render: (tt) => <FancyTub t={tt} />},
          {id: 2, enter: 'cut', render: (tt) => <NotDenmark t={tt} />},
          {id: 3, enter: 'push', render: (tt) => <KitchenTable t={tt} />},
          {id: 4, enter: 'cut', render: (tt) => <NameFirst t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <TwoTubs t={tt} />},
          {id: 6, enter: 'fade', render: (tt) => <YourPackage t={tt} />},
          {id: 7, enter: 'cut', render: (tt) => <JaysSign t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, cueOf(1, "fancy")]]} />
      <Grain />
      <Sound />
      {t > line(18).end + 0.15 && <AbsoluteFill style={{background: C.base, opacity: p(t, line(18).end + 0.15, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
export const _unused = {talk};
