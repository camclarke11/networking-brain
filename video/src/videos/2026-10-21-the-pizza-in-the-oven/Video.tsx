// "The pizza in the oven" (scripts/2026-10-21-the-pizza-in-the-oven.md).
// Metaphor: the wall turns to glass. While the kitchen hides behind a blank wall you fidget; when the wall turns to
// glass and you can watch the work, you relax, though the clock keeps going. Every time comes from the narration.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, DmScreen, Label, QuoteBubble, ToolCard} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {Phone} from '../../kit/three/sets';
import {Laptop, StoreTable} from '../../kit/three/brand';
import {FrontDoor, GlassWall, Pizza, PizzaBox, PizzaOven, StandCard, WallClock} from '../../kit/three/shop';
import {clamp, EIO, EO, lerp, p} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-pizza-in-the-oven';
type V3 = [number, number, number];
const HOLD_UP: [number, number, number, string] = [1.0, 0, 0.3, 'ZYX'];

/** The phone in your right hand, screen towards you. */
const HeldPhone: React.FC = () => <Phone position={[0.02, -0.04, 0.08]} rotation={[1.45, 0, 0]} scale={1.1} />;

/** Mike at the oven behind a wall (shots 4 to 6). `slide` 0..1 moves a pizza into the oven, `out` 0..1 brings it back. */
const Kitchen: React.FC<{t: number; x: number; z: number; slide?: number; out?: number; boxed?: number; glow?: number; scale?: number; mikeLeft?: boolean}> = ({t, x, z, slide = 0, out = 0, boxed = 0, glow = 0.7, scale = 1, mikeLeft = false}) => {
  const inOven = clamp(slide) * (1 - clamp(out));
  const pz = lerp(0.55, 0.15, inOven);
  return (
    <group position={[x, 0, z]} scale={scale}>
      <PizzaOven position={[0, 0, -0.3]} glow={glow} />
      {boxed < 0.5 && <Pizza position={[0, 1.0, pz - 0.3]} r={0.17} cooked={clamp(out)} />}
      {boxed >= 0.5 && <PizzaBox position={[0.42, 0.95, 0.12 - 0.3]} />}
      <Character who="stranger_a" t={t} position={[mikeLeft ? -0.62 : 0.62, 0, 0.52]} rotY={mikeLeft ? 0.45 : -0.45} pose={inOven > 0.05 && inOven < 0.95 ? 'point' : 'present'} mood="happy" seed={4} />
    </group>
  );
};

// ---------- Shot 1: staring at the tracker ----------
const Tracker: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const staring = cue(1, 'staring');
  const cam = camPath(t, [[s.start, {pos: [0.2, 1.55, 4.4], target: [0, 1.35, 0], fov: 40}], [s.end, {pos: [0.15, 1.45, 3.4], target: [0, 1.3, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <GlassWall position={[0, 0, -1.4]} width={4} />
        <Character who="you" t={t} position={[0, 0, 0]} pose="phone" mood={t > cue(1, "Mike's") ? 'excited' : 'neutral'} lean={0.12 * p(t, staring - 0.3, staring + 0.4)} rightHand={<HeldPhone />} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 2: not the door ----------
const NotTheDoor: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(2);
  const door = cue(2, 'door');
  const small = cue(2, 'small');
  const shrink = p(t, small - 0.2, small + 0.6, EIO);
  const cam = camPath(t, [[s.start, {pos: [0.6, 1.5, 5.0], target: [0.2, 1.2, 0], fov: 40}], [s.end, {pos: [0.5, 1.5, 4.6], target: [0.2, 1.2, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <group position={[0.25, 0, lerp(-0.5, -3.5, shrink)]} scale={lerp(1, 0.55, shrink)}>
          <FrontDoor />
        </group>
        <Character who="you" t={t} position={[-0.25, 0, 0.35]} rotY={0.5} pose={t > door - 0.6 && shrink < 0.2 ? 'point' : 'phone'} mood={t > small ? 'shock' : 'neutral'} look={-0.3} rightHand={<HeldPhone />} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 3: same clock ----------
const SameClock: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(3);
  const wait = cue(3, 'wait');
  const cam: Cam = {pos: [0, 1.0, 4.4], target: [0, 1.6, 0], fov: 40};
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <GlassWall position={[0, 0, -0.9]} width={4} height={3.2} />
        <WallClock position={[0.3, 2.65, -0.8]} minutes={(t - s.start) * 6} ring={p(t, wait - 0.2, wait + 0.5)} r={0.42} />
        <Character who="you" t={t} position={[-0.25, 0, 0.3]} pose="phone" mood={t > wait ? 'happy' : 'bored'} lookUp={t < wait ? 0.3 : 0} rightHand={<HeldPhone />} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 4: wall or window (screenshot moment) ----------
const WallOrWindow: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(4);
  const silent = cue(4, 'silent');
  const watch = cue(4, 'watch');
  const glass = p(t, watch - 0.2, watch + 0.5);
  const cam: Cam = {pos: [0, 1.55, 6.2], target: [0, 1.15, 0], fov: 40};
  const leftHead = toScreen(cam, [-0.65, 1.95, 0.75]);
  const tap = t > silent ? Math.abs(Math.sin((t - silent) * 9)) * 0.03 : 0;
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <GlassWall position={[-0.65, 0, 0]} width={1.28} height={2.5} />
        <GlassWall position={[0.65, 0, 0]} width={1.28} height={2.5} glass={glass} />
        <mesh position={[0, 1.25, 0]} castShadow>
          <boxGeometry args={[0.04, 2.5, 0.14]} />
          <meshStandardMaterial color={C.ink2} />
        </mesh>
        <Kitchen t={t} x={0.64} z={-1.0} slide={p(t, watch, watch + 1.2, EIO)} scale={0.68} mikeLeft />
        <Character who="you" t={t} position={[-0.65, tap, 0.75]} rotY={Math.PI - 0.55} pose="idle" mood="bored" />
        <Character who="you" t={t} position={[1.05, 0, 0.7]} rotY={Math.PI + 0.9} pose={glass > 0.5 ? 'lean' : 'idle'} mood={glass > 0.5 ? 'happy' : 'bored'} lean={glass > 0.5 ? 0.08 : 0} />
      </Stage>
      <QuoteBubble t={t} at={silent + 0.1} out={s.end} speaker="you" text="Hello?" x={leftHead[0]} y={leftHead[1]} side="left" width={280} tone="wrong" />
    </AbsoluteFill>
  );
};

// ---------- Shot 5: wait longer, like it more ----------
const LikeItMore: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(5);
  const work = cue(5, 'work');
  const longer = cue(5, 'longer');
  const more = cue(5, 'more');
  const mins = (t - s.start) * 6 + (t > longer ? 15 * p(t, longer, longer + 0.3, EO) : 0);
  const cam = camPath(t, [[s.start, {pos: [0.3, 1.6, 5.4], target: [0.0, 1.3, -0.5], fov: 40}], [s.end, {pos: [0.28, 1.58, 4.9], target: [0.0, 1.3, -0.5], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <GlassWall position={[0, 0, 0]} width={3} height={2.6} glass={1} />
        <WallClock position={[-0.62, 2.3, 0.06]} minutes={mins} ring={1} r={0.26} />
        <Kitchen t={t} x={0.15} z={-1.1} slide={1} out={p(t, work - 0.3, work + 0.7, EIO)} boxed={t > longer + 0.4 ? 1 : 0} />
        <Character who="you" t={t} position={[-0.62, 0, 0.75]} rotY={Math.PI + 0.45} pose={t > more ? 'cheer' : 'lean'} mood={t > more ? 'excited' : 'happy'} hop={t > more ? Math.max(0, Math.sin((t - more) * 8)) * 0.08 : 0} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 6: stop hiding the kitchen ----------
const StopHiding: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const kitchen = cue(6, 'kitchen');
  const drop = p(t, kitchen - 0.35, kitchen + 0.35, EIO);
  const pull = p(t, kitchen - 0.4, s.end, EO);
  const cam: Cam = {pos: [0, lerp(1.35, 1.6, pull), lerp(2.2, 4.8, pull)], target: [0, lerp(1.0, 1.15, pull), -0.4], fov: 40};
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={drop * 0.25}>
        <Floor />
        <StoreTable position={[0, 0, 0.6]} length={1.2} depth={0.6} />
        <PizzaBox position={[0, 0.92, 0.6]} scale={1.3} />
        <GlassWall position={[0, 0, -0.3]} width={3.2} height={2.6} drop={drop} />
        <Kitchen t={t} x={0.25} z={-1.6} slide={1} out={1} glow={0.4 + 0.6 * drop} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 7: send the photo ----------
const SendPhoto: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(7);
  const work = cue(7, 'work');
  const quiet = cue(7, 'quiet');
  const photo = cue(7, 'photo');
  const dmAt = line(16).start - 0.25;
  const grey = p(t, quiet - 0.1, quiet + 0.2) * (1 - p(t, quiet + 1.4, quiet + 1.9));
  const lift = p(t, work - 0.3, work + 0.3, EO) * (1 - p(t, quiet - 0.2, quiet)) + p(t, line(16).start - 0.6, line(16).start - 0.2);
  const cam = camPath(t, [[s.start, {pos: [1.6, 2.45, 4.3], target: [-0.05, 0.95, -0.2], fov: 40}], [dmAt, {pos: [1.45, 2.35, 3.9], target: [-0.05, 0.95, -0.2], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" drain={grey * 0.8}>
        <Floor />
        <StoreTable position={[0, 0, 0]} length={1.4} depth={0.7} />
        <Laptop position={[0.1, 0.92, -0.05]} openDeg={108} />
        <Character who="you" t={t} position={[0.1, 0, 0.75]} rotY={Math.PI} pose={lift > 0.3 ? 'phone' : 'lean'} mood={grey > 0.5 ? 'sad' : 'happy'} rightHand={lift > 0.3 ? <HeldPhone /> : undefined} />
      </Stage>
      {grey > 0.01 && <BigText t={t} at={quiet} out={quiet + 1.6} text="A silent week" y={260} size={96} />}
      <DmScreen t={t} at={dmAt} out={s.end + 0.3} from="Client" y={250}
        messages={[{side: 'me', text: 'Day 2. Your homepage is in the oven.', at: photo - 0.2}, {side: 'them', text: 'Love seeing this!', at: photo + 0.7}]} />
    </AbsoluteFill>
  );
};

// ---------- Shot 8: Jay's phone ----------
const JaysPhone: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(8);
  const update = cue(8, 'update');
  const cam: Cam = {pos: [0.0, 1.85, 4.2], target: [0.0, 1.15, 0], fov: 40};
  const head = toScreen(cam, [-0.2, 1.76, -0.72]);
  const phoneAt: V3 = [0.42, 0.93, 0.1];
  const ph = toScreen(cam, phoneAt);
  const buzz = [line(17).start + 1.0, line(17).start + 1.9, update];
  const shake = buzz.some((b) => t > b && t < b + 0.35) ? Math.sin(t * 90) * 0.012 : 0;
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, 0]} length={1.4} depth={0.7} />
        <Laptop position={[-0.2, 0.92, -0.05]} openDeg={108} />
        <Phone position={[phoneAt[0] + shake, phoneAt[1], phoneAt[2]]} rotation={[-Math.PI / 2, 0, 0.2]} scale={1.3} />
        <Character who="friend" t={t} position={[-0.2, 0, -0.72]} pose="think" mood={t > update ? 'wince' : 'neutral'} seed={7} />
      </Stage>
      <Label t={t} at={s.start + 0.5} text="Jay" x={head[0]} y={head[1]} rise={50} color={C.gold} />
      {buzz.map((b, i) => (
        <QuoteBubble key={i} t={t} at={b} out={s.end + 0.3} speaker="stranger_a" text="Any update?" x={ph[0]} y={ph[1] - 50 - i * 150} side="left" width={400} typeOn={false} />
      ))}
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue, line} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="pop" at={cue(1, 'made')} volume={0.07} />
      <Sfx name="pop" at={cue(1, 'oven')} volume={0.07} />
      <Sfx name="pop" at={cue(1, "Mike's")} volume={0.08} />
      <Sfx name="tick" at={cue(3, 'faster')} volume={0.07} />
      <Sfx name="sparkle" at={cue(4, 'watch')} volume={0.06} />
      <Sfx name="whoosh" at={cue(6, 'kitchen') - 0.3} volume={0.07} />
      <Sfx name="ping" at={cue(7, 'photo') - 0.2} volume={0.08} />
      <Sfx name="click" at={line(17).start + 1.0} volume={0.06} />
      <Sfx name="click" at={line(17).start + 1.9} volume={0.06} />
      <Sfx name="click" at={cue(8, 'update')} volume={0.07} />
    </>
  );
};

const Edit: React.FC = () => {
  const t = useT();
  const {words, line, cue, shot, timing: tm} = useTiming();
  const s1 = shot(1);
  return (
    <AbsoluteFill style={{background: C.base}}>
      <Timeline
        shots={[
          {id: 1, render: (tt) => <Tracker t={tt} />},
          {id: 2, enter: 'cut', render: (tt) => <NotTheDoor t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <SameClock t={tt} />},
          {id: 4, enter: 'cut', render: (tt) => <WallOrWindow t={tt} />},
          {id: 5, enter: 'push', render: (tt) => <LikeItMore t={tt} />},
          {id: 6, enter: 'cut', render: (tt) => <StopHiding t={tt} />},
          {id: 7, enter: 'fade', render: (tt) => <SendPhoto t={tt} />},
          {id: 8, enter: 'cut', render: (tt) => <JaysPhone t={tt} />},
        ]}
      />
      <BigText t={t} at={0.16} out={line(2).start - 0.1} text="You're watching a pizza you can't see" highlight="pizza" y={220} size={90} />
      <ToolCard t={t} at={line(2).start - 0.15} out={s1.end} title="Your pizza" items={['Being made', 'In the oven', "Mike's on the way"]}
        itemsAt={[cue(1, 'made') - 0.1, cue(1, 'oven') - 0.1, cue(1, "Mike's") - 0.1]} lit={t > cue(1, "Mike's") ? 2 : t > cue(1, 'oven') ? 1 : t > cue(1, 'made') ? 0 : -1} y={220} />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, line(2).start], [line(16).start - 0.3, line(16).end + 0.2]]} />
      <Grain />
      <Sound />
      {t > line(17).end + 0.15 && <AbsoluteFill style={{background: C.base, opacity: p(t, line(17).end + 0.15, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
export const _unused = {HOLD_UP, StandCard};
