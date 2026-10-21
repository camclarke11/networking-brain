// "The tilted laptop" (scripts/2026-10-21-the-tilted-laptop.md).
// Metaphor: a dotted line runs from each product to the nearest hand. On touch it snaps solid and a small
// MINE tag pops onto the product. Every time comes from the narration (cue / word / line / shot).
import React from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, StudyCard, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {Phone} from '../../kit/three/sets';
import {DotLine, GiftBox, GlassCase, Laptop, Mug, OwnTag, Plinth, PriceTag, Sofa, Spoon, StoreTable, YogurtBowl} from '../../kit/three/brand';
import {clamp, EIO, EO, lerp, p, spr, wobble} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-tilted-laptop';
type V3 = [number, number, number];
const LAPS = [-1.2, -0.4, 0.4, 1.2];
const LAP_Z = 0.12;
const TOP = 0.92;

/** A yellow arc at a laptop's hinge showing its opening angle. */
const AngleArc: React.FC<{x: number; z: number; deg: number; k?: number}> = ({x, z, deg, k = 1}) => {
  if (k <= 0.01) return null;
  const a = (deg * Math.PI) / 180;
  return (
    <group position={[x + 0.24, TOP + 0.02, z - 0.145]} rotation={[0, -Math.PI / 2, 0]} scale={k}>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.16, 0.012, 8, 40, a]} />
        <meshBasicMaterial color={C.goldDeep} />
      </mesh>
    </group>
  );
};

/** The table of laptops, every screen at `deg` (one can be overridden). */
const LaptopTable: React.FC<{t: number; deg: (i: number) => number; arcs?: number}> = ({deg, arcs = 0}) => (
  <group>
    <StoreTable position={[0, 0, 0]} length={3.4} depth={0.95} />
    {LAPS.map((x, i) => (
      <group key={i}>
        <Laptop position={[x, TOP, LAP_Z]} openDeg={deg(i)} />
        <AngleArc x={x} z={LAP_Z} deg={deg(i)} k={clamp(arcs * 1.6 - i * 0.2)} />
      </group>
    ))}
  </group>
);

// ---------- Shot 1: every laptop, the same angle ----------
const SameAngle: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const angle = cue(1, 'angle');
  const morning = cue(1, 'morning');
  const cam = camPath(t, [[0, {pos: [-2.6, 1.55, 2.6], target: [-0.6, 1.05, 0], fov: 38}], [s.end, {pos: [-1.2, 1.45, 2.35], target: [0.2, 1.02, 0], fov: 38}]]);
  const sun = p(t, morning - 0.2, morning + 0.9);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={Math.sin(sun * Math.PI) * 0.35}>
        <Floor />
        <LaptopTable t={t} deg={() => 70} arcs={p(t, angle, angle + 0.7)} />
      </Stage>
      <BigText t={t} at={0.1} text="Every laptop. Same awkward angle." highlight="angle" y={220} size={96} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: seventy degrees, every morning ----------
const Seventy: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word} = useTiming();
  const s = shot(2);
  const gallo = word('Gallo', s.start);
  const seventy = cue(2, 'seventy');
  const closed = cue(2, 'closed');
  const walk = p(t, s.start + 0.3, seventy, (k) => k);
  const ex = lerp(-1.9, 1.25, walk);
  const side = p(t, seventy - 0.6, seventy + 0.3, EIO);
  const deg = (i: number) => {
    if (i === 2) return 70 - 16 * Math.sin(Math.PI * p(t, closed - 0.2, closed + 1.3, EIO));
    return ex > LAPS[i] - 0.1 ? 70 : 70 + 12 * Math.sin(i * 1.7);
  };
  const front = camPath(t, [[s.start, {pos: [-0.6, 1.75, 4.4], target: [-0.3, 1.25, -0.2], fov: 38}], [seventy, {pos: [0.4, 1.7, 4.2], target: [0.4, 1.2, -0.2], fov: 38}]], EIO);
  const sideCam: Cam = {pos: [LAPS[2] + 2.3, TOP + 0.35, LAP_Z + 0.1], target: [LAPS[2], TOP + 0.2, LAP_Z - 0.05], fov: 32};
  const cam: Cam = side <= 0 ? front : side >= 1 ? sideCam : {pos: [lerp(front.pos[0], sideCam.pos[0], side), lerp(front.pos[1], sideCam.pos[1], side), lerp(front.pos[2], sideCam.pos[2], side)], target: [lerp(front.target[0], sideCam.target[0], side), lerp(front.target[1], sideCam.target[1], side), lerp(front.target[2], sideCam.target[2], side)], fov: lerp(38, 34, side)};
  const head = toScreen(cam, [ex, 1.95, -0.85]);
  const lap = toScreen(cam, [LAPS[2], TOP + 0.3, LAP_Z - 0.1]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <LaptopTable t={t} deg={deg} arcs={1} />
        <Character who="stranger_c" t={t} position={[ex, 0, -0.85]} rotY={0.1} pose="hold" mood="neutral" look={-0.2} lookUp={-0.2}
          rightHand={<Phone position={[0.02, -0.04, 0.08]} rotation={[1.45, 0, 0]} scale={1.1} />} seed={5} />
      </Stage>
      <Label t={t} at={gallo} out={seventy - 0.2} text="Forbes, 2012" x={head[0]} y={head[1]} rise={90} />
      <Label t={t} at={seventy + 0.3} out={s.end} text="About 70°" x={lap[0]} y={lap[1]} rise={150} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Shot 3: you fix it ----------
const YOU_FIX: V3 = [0.45, 0, 0.8];
const FixIt: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(3);
  const bugs = cue(3, 'bugs');
  const fix = cue(3, 'fix');
  const hands = cue(3, 'hands');
  const arrive = p(t, s.start, bugs, EO);
  const you: V3 = [lerp(1.8, YOU_FIX[0], arrive), 0, YOU_FIX[2]];
  const push = p(t, fix - 0.1, fix + 0.5, EIO);
  const deg = (i: number) => (i === 2 ? lerp(70, 102, push) : 70);
  const cam = camPath(t, [[s.start, {pos: [3.3, 1.95, 2.7], target: [0.3, 1.2, 0.3], fov: 36}], [s.end, {pos: [3.0, 1.9, 2.4], target: [0.35, 1.18, 0.3], fov: 35}]]);
  const reach = t > fix - 0.5;
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <LaptopTable t={t} deg={deg} />
        <Character who="you" t={t} position={you} rotY={Math.PI - 0.12} pose={reach ? 'point' : 'idle'} mood={t > bugs && t < fix ? 'wince' : 'happy'} look={t > bugs && t < fix ? 0.15 : 0} lookUp={-0.3} hop={arrive < 1 ? Math.abs(Math.sin(t * 8)) * 0.03 : 0} />
        <DotLine from={[LAPS[2], TOP + 0.3, LAP_Z + 0.05]} to={[you[0] - 0.1, 1.15, you[2] - 0.3]} k={t > hands ? 1 : 0} />
        <OwnTag letter="MINE" position={[LAPS[2] + 0.12, TOP + 0.42, LAP_Z - 0.05]} pop={p(t, hands, hands + 0.4)} scale={0.9} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 4: touching feels like owning ----------
const Mine: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(4);
  const peck = s.on_screen.find((c) => c.type === 'study_card')?.time ?? s.start + 1;
  const touching = cue(4, 'touching');
  const own = cue(4, 'own');
  const worth = cue(4, 'worth');
  const reach = p(t, touching - 0.4, touching + 0.1);
  const cam = camPath(t, [[s.start, {pos: [0.0, 1.8, 6.4], target: [0.0, 1.2, 0], fov: 38}], [s.end, {pos: [0.05, 1.7, 5.7], target: [0.05, 1.2, 0], fov: 38}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Plinth position={[0, 0, 0]} height={0.9} r={0.32} />
        <Mug position={[0, 0.9, 0]} scale={1.6} />
        <OwnTag letter="MINE" position={[0, 1.4, 0.05]} pop={p(t, own, own + 0.4)} />
        <PriceTag text="VALUE" position={[0.05, 2.35, 0.1]} scale={lerp(0.8, 1.35, p(t, worth - 0.1, worth + 0.6, EO))} glow={p(t, worth, worth + 0.6)} swing={0.03 * Math.sin(t * 1.5)} />
        <Character who="professor" t={t} position={[-0.85, 0, -0.15]} rotY={0.55} pose="present" mood="happy" />
        <Character who="stranger_a" t={t} position={[lerp(1.25, 0.78, reach), 0, 0.45]} rotY={-2.3} pose={reach > 0.3 ? 'point' : 'idle'} mood={t > own ? 'excited' : 'happy'} seed={3} />
        <DotLine from={[0.08, 1.05, 0.05]} to={[0.6, 1.12, 0.3]} k={t > touching ? 1 : 0} />
      </Stage>
      <StudyCard t={t} at={peck} out={s.end} year={2009} who="Joann Peck & Suzanne Shu" finding="Just touching a product makes people feel they own it" y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 5: the spoon and the sofa ----------
const Everywhere: React.FC<{t: number}> = ({t}) => {
  const {cue, line} = useTiming();
  const spoon = cue(5, 'spoon');
  const sofa = cue(5, 'sofa');
  const cut = line(12).start;
  if (t < cut) {
    const give = p(t, spoon - 0.6, spoon, EIO);
    const cam: Cam = {pos: [0.2, 1.75, 3.9], target: [0.15, 1.15, -0.5], fov: 38};
    return (
      <AbsoluteFill>
        <Stage t={t} cam={cam} backdrop="warm">
          <Floor />
          <StoreTable position={[0, 0, -0.55]} length={1.8} depth={0.75} />
          {[-0.5, -0.15, 0.2].map((x) => <YogurtBowl key={x} position={[x, TOP, -0.6]} scale={1.2} />)}
          <Character who="stranger_c" t={t} position={[-0.45, 0, -1.35]} rotY={0.6} pose={give > 0 ? 'point' : 'idle'} mood="happy" seed={5} />
          <Spoon position={[lerp(-0.05, 0.55, give), 1.12, lerp(-0.75, -0.2, give)]} rotation={[0, Math.PI / 2, 0]} scale={2.4} />
          <Character who="stranger_a" t={t} position={[0.95, 0, 0.15]} rotY={Math.PI + 0.55} pose={give > 0.7 ? 'point' : 'idle'} mood={t > spoon ? 'excited' : 'happy'} seed={3} />
          <OwnTag letter="MINE" position={[0.55, 1.42, -0.2]} pop={p(t, spoon, spoon + 0.4)} scale={1.1} />
        </Stage>
      </AbsoluteFill>
    );
  }
  const sit = p(t, cut + 0.1, sofa - 0.2, EO);
  const cam: Cam = {pos: [1.6, 1.6, 4.6], target: [0, 0.85, 0], fov: 38};
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Sofa position={[0, 0, 0]} />
        <Character who="stranger_b" t={t} position={[-0.2, 0, sit > 0.6 ? 0.0 : 0.75]} sit={sit > 0.6} rotY={0.15} pose="idle" mood="happy" hop={sit < 0.6 ? 0.18 * Math.sin((sit / 0.6) * Math.PI) : 0} seed={9} />
        <OwnTag letter="MINE" position={[0.45, 0.85, 0.2]} pop={p(t, sofa, sofa + 0.4)} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 6: hand it over first (screenshot moment) ----------
const GiveItBack: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const hands = cue(6, 'hands');
  const touched = cue(6, 'touched');
  const back = cue(6, 'back');
  const pass = p(t, hands - 0.5, hands + 0.3, EIO);
  const tug = p(t, back - 0.9, back - 0.4) * (1 - p(t, back, back + 0.3));
  const box: V3 = [lerp(-0.15, 0.62, pass) - tug * 0.12, lerp(1.02, 1.08, pass), lerp(-0.85, -0.2, pass) - tug * 0.1];
  const glow = p(t, back - 0.1, back + 0.6);
  const cam = camPath(t, [[s.start, {pos: [-0.3, 1.8, 6.0], target: [0.25, 1.3, -0.5], fov: 38}], [s.end, {pos: [-0.25, 1.75, 5.4], target: [0.3, 1.3, -0.45], fov: 38}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={glow * 0.3}>
        <Floor />
        <StoreTable position={[0, 0, -0.75]} length={2.2} depth={0.8} />
        <Character who="you" t={t} position={[-0.35, 0, -1.6]} rotY={0.25} pose={pass < 1 || tug > 0.1 ? 'point' : 'idle'} mood="happy" />
        <GiftBox position={box} scale={1.1} />
        <OwnTag letter="MINE" position={[box[0] - 0.12, box[1] + 0.32, box[2] + 0.05]} pop={p(t, touched, touched + 0.4)} scale={0.95} />
        <Character who="stranger_a" t={t} position={[1.3, 0, 0.2]} rotY={Math.PI + 0.65} pose={pass > 0.6 ? 'cards' : 'idle'} mood={t > back - 0.4 ? 'excited' : 'happy'} lean={tug * -0.12} seed={3} />
      </Stage>
      <XCheck t={t} at={s.start + 0.05} out={touched} wrong="Describe it, then wait" right="Put it in their hands first" y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: Jay keeps it behind glass ----------
const Jay: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(7);
  const counter = cue(7, 'counter');
  const leave = p(t, counter - 0.2, counter + 1.2, (k) => k);
  const cam: Cam = {pos: [0.5, 1.6, 5.0], target: [0.2, 1.35, -0.5], fov: 38};
  const head = toScreen(cam, [-0.35, 1.95, -1.6]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.75]} length={2.2} depth={0.8} />
        <GlassCase position={[0.25, TOP, -0.75]} size={[1.0, 0.45, 0.6]} />
        <GiftBox position={[0.1, TOP, -0.75]} />
        <GiftBox position={[0.45, TOP, -0.7]} scale={0.8} rotY={0.4} />
        <Character who="friend" t={t} position={[-0.35, 0, -1.6]} rotY={0.15} pose="idle" mood="bored" seed={7} />
        <Character who="stranger_b" t={t} position={[lerp(1.0, 2.6, leave), 0, 0.25]} rotY={leave > 0.05 ? Math.PI / 2 : Math.PI} pose="idle" mood={leave > 0 ? 'bored' : 'neutral'} lean={leave > 0 ? 0 : 0.15} seed={9} />
      </Stage>
      <Label t={t} at={cue(7, 'friend') ?? s.start + 0.6} text="Jay" x={head[0]} y={head[1]} rise={100} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="click" at={cue(3, 'fix') + 0.4} volume={0.12} />
      <Sfx name="pop" at={cue(3, 'hands')} volume={0.1} />
      <Sfx name="pop" at={cue(4, 'own')} volume={0.1} />
      <Sfx name="pop" at={cue(5, 'spoon')} volume={0.08} />
      <Sfx name="pop" at={cue(5, 'sofa')} volume={0.08} />
      <Sfx name="ding" at={cue(6, 'back')} volume={0.1} />
    </>
  );
};

const Edit: React.FC = () => {
  const t = useT();
  const {words, shot, line, timing: tm} = useTiming();
  return (
    <AbsoluteFill style={{background: C.base}}>
      <Timeline
        shots={[
          {id: 1, render: (tt) => <SameAngle t={tt} />},
          {id: 2, enter: 'fade', render: (tt) => <Seventy t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <FixIt t={tt} />},
          {id: 4, enter: 'push', render: (tt) => <Mine t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <Everywhere t={tt} />},
          {id: 6, enter: 'fade', render: (tt) => <GiveItBack t={tt} />},
          {id: 7, enter: 'cut', render: (tt) => <Jay t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(1).end]]} />
      <Grain />
      <Sound />
      {t > line(16).end + 0.15 && <AbsoluteFill style={{background: C.base, opacity: p(t, line(16).end + 0.15, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
export const _unused = {spr, wobble, THREE};
