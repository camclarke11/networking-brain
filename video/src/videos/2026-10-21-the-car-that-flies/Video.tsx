// "The car that flies" (scripts/2026-10-21-the-car-that-flies.md).
// Metaphor: every option sits on a plinth with a price tag. The wild option's tag drops an anchor, and the
// option next to it suddenly looks sensible. Every time comes from the narration (cue / word / line / shot).
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, Shake, ToolCard, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character, Crowd} from '../../kit/three/Character';
import {Dust, Phone} from '../../kit/three/sets';
import {Anchor, Billboard, Chain, GiftBox, GlassCase, Pickup, Plinth, PriceTag, SportsCar, StoreTable} from '../../kit/three/brand';
import {clamp, EIO, EO, lerp, p, spr, talk, wobble} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-car-that-flies';
type V3 = [number, number, number];
const bob = (t: number, s = 0) => 0.04 * Math.sin(t * 2.2 + s);
/** A tag that drops in on a spring at `at` and then sways. */
const tagY = (t: number, at: number, rest: number) => lerp(rest + 1.6, rest, clamp(spr(t, at, {damping: 11, stiffness: 120, mass: 0.7})));

// ---------- Shot 1: the car with no price ----------
const NoPrice: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const price = cue(1, 'price');
  const bought = cue(1, 'bought');
  const a = lerp(0.55, 0.95, p(t, 0, s.end, (x) => x));
  const cam: Cam = {pos: [Math.sin(a) * 6.8, 1.45, Math.cos(a) * 6.8], target: [0, 1.4, 0], fov: 36};
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Plinth position={[0, 0, 0]} height={0.45} r={1.45} />
        <SportsCar t={t} position={[0, 0.45, 0]} rotY={-0.35} hover={0.32 + bob(t)} lift={0.35} />
        <PriceTag text="$???" back="NO PRICE" position={[0.85, 2.0, 0.75]} rotY={0.6} swing={0.06 * Math.sin(t * 1.8)} flip={p(t, price, price + 0.45, EIO)} scale={1.15} />
        <GlassCase position={[0, 0.45, 0]} size={[2.8, 1.55, 1.6]} drop={clamp(spr(t, bought, {damping: 14, stiffness: 140, mass: 0.8}))} />
      </Stage>
      <BigText t={t} at={0.08} text="Tesla's flying car has no price" highlight="price" y={210} size={100} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: three versions ----------
const PLINTHS: V3[] = [[-3.2, 0, 0], [0, 0, 0], [3.2, 0, 0]];
const Lineup: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word} = useTiming();
  const s = shot(2);
  const roadster = cue(2, 'Roadster');
  const perf = cue(2, 'Performance');
  const res1 = cue(2, 'reserve');
  const thrust = cue(2, 'Thrust');
  const res2 = cue(2, '$250,000');
  const flies = cue(2, 'flies');
  const rise = clamp(spr(t, roadster - 0.8, {damping: 14, stiffness: 90, mass: 1}));
  const focus = (x: number, y = 1.15): Cam => ({pos: [x + 1.6, 1.55, 5.6], target: [x, y, 0], fov: 36});
  const cam = camPath(t, [
    [s.start, {pos: [0, 4.2, 16.5], target: [0, 0.8, 0], fov: 40}],
    [perf - 0.6, {pos: [0, 3.8, 15.5], target: [0, 0.9, 0], fov: 40}],
    [perf + 0.4, focus(-3.2)],
    [thrust - 0.4, focus(-3.0)],
    [thrust + 0.5, focus(0)],
    [cue(2, 'flies') - 1.2, focus(0.2)],
    [flies, focus(3.2, 1.6)],
    [s.end, {...focus(3.2, 1.7), pos: [4.6, 1.7, 5.9]}],
  ], EIO);
  const thrustOn = p(t, thrust + 0.2, thrust + 0.6) * (1 - p(t, thrust + 3.5, thrust + 4.2));
  const flyK = p(t, flies - 0.3, flies + 1.0, EO);
  const rocketW = word('Rocket', s.start);
  const invite = s.on_screen.find((c) => c.type === 'stamp')?.time ?? flies + 1;
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        {PLINTHS.map((pp, i) => (
          <group key={i} position={[0, -(1 - rise) * 0.5, 0]}>
            <Plinth position={pp} height={0.45} r={1.4} />
          </group>
        ))}
        <SportsCar t={t} position={[PLINTHS[0][0], 0.45 - (1 - rise) * 0.5, 0]} rotY={-0.5} />
        <SportsCar t={t} position={[PLINTHS[1][0], 0.45 - (1 - rise) * 0.5, 0]} rotY={-0.5} jets thrust={thrustOn} />
        <SportsCar t={t} position={[PLINTHS[2][0], 0.45 - (1 - rise) * 0.5, 0]} rotY={-0.5} hover={flyK * 0.85 + bob(t) * flyK} lift={flyK} jets />
        {t > perf - 0.25 && <PriceTag sub="PERFORMANCE" text="$50,000 TO RESERVE" position={[PLINTHS[0][0] + 0.3, tagY(t, perf - 0.25, 2.4), 0.7]} swing={0.05 * Math.sin(t * 1.7)} scale={1.3} />}
        {t > thrust - 0.25 && <PriceTag sub="THRUST" text="$250,000 TO RESERVE" position={[PLINTHS[1][0] + 0.3, tagY(t, thrust - 0.25, 2.4), 0.7]} swing={0.05 * Math.sin(t * 1.6 + 1)} scale={1.3} />}
        {t > rocketW - 0.25 && <PriceTag sub="ROCKET" text="INVITE ONLY" position={[PLINTHS[2][0] + 0.3, tagY(t, rocketW - 0.25, 2.8), 0.7]} swing={0.05 * Math.sin(t * 1.5 + 2)} scale={1.3 * (1 + 0.18 * Math.sin(Math.PI * p(t, invite, invite + 0.45, (k) => k)))} glow={1} />}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 3: two jobs ----------
const TwoJobs: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(3);
  const nobody = cue(3, 'nobody');
  const jobs = s.on_screen.find((c) => c.type === 'tool_card')?.time ?? line(12).start;
  const cam = camPath(t, [[s.start, {pos: [-1.2, 1.0, 6.6], target: [0.2, 1.55, 0], fov: 40}], [s.end, {pos: [-1.0, 0.95, 6.1], target: [0.2, 1.6, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Plinth position={[0, 0, 0]} height={0.45} r={1.45} />
        <SportsCar t={t} position={[0, 0.45, 0]} rotY={-0.4} hover={0.85 + bob(t)} lift={1} jets />
        <GlassCase position={[0, 0.45, 0]} size={[2.9, 2.0, 1.7]} drop={clamp(spr(t, nobody, {damping: 15, stiffness: 160, mass: 0.7}))} />
        <Character who="you" t={t} position={[1.15, 0, 2.3]} rotY={Math.PI + 0.45} pose="idle" lookUp={0.3} mood="happy" />
      </Stage>
      <ToolCard t={t} at={jobs} title="Two jobs" items={['It gets filmed', 'It moves the anchor']} itemsAt={[jobs + 0.15, jobs + 0.55]} y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 4: it gets filmed ----------
const CROWD: [number, number][] = [[0.2, 3.6], [1.0, 4.1], [-0.6, 4.3], [2.0, 3.2], [-1.4, 3.4]];
const Filmed: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(4);
  const filmed = cue(4, 'filmed');
  const ad = cue(4, 'ad');
  const x = lerp(-6, 4.4, p(t, s.start, s.start + 3.5, (k) => k));
  const H = 3.4;
  const y = Math.abs(x) < H ? 1.95 * (1 - (x / H) ** 2) : 0;
  const slope = Math.abs(x) < H ? (-2 * 1.95 * x) / (H * H) : 0;
  const up = p(t, filmed - 0.1, filmed + 0.5, EO);
  const cam: Cam = {pos: [4.6, 2.7, 10.2], target: [0, 1.05, -0.3], fov: 38};
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Pickup position={[0, 0, -0.3]} rotY={Math.PI / 2} />
        <SportsCar t={t} position={[x, 0, -0.3]} hover={y} pitch={Math.atan(slope) * 0.8} thrust={1} lift={y > 0.05 ? 1 : 0} jets />
        <Billboard text="AD" position={[-1.6, 0, -2.4]} k={1 - p(t, ad, ad + 0.6, EIO)} rotY={0.35} />
        <Crowd t={t} spots={CROWD} />
        {CROWD.map(([cx, cz], i) => (
          <Phone key={i} position={[cx + 0.05, lerp(1.35, 2.05, up), cz - 0.28]} rotation={[0.15, 0, 0]} scale={1.2} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 5: the anchor ----------
const BACK: V3 = [0.4, 0, -2.6];
const FRONT: V3 = [-1.05, 0, 0.65];
const TAG_X = 1.2, TAG_Z = -0.9;
const TheAnchor: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(5);
  const anchor = cue(5, 'anchor');
  const carW = cue(5, 'car');
  const sensible = cue(5, 'sensible');
  const menus = s.on_screen.find((c) => c.type === 'tool_card')?.time ?? sensible + 1;
  const drop = p(t, anchor, anchor + 0.42, (k) => k * k);
  const tagScale = lerp(1.1, 1.7, p(t, anchor - 0.5, anchor));
  const tagBottom = 3.0 - 0.35 * tagScale - 0.34 * tagScale;
  const anchorY = lerp(tagBottom - 1.66 * 0.85, 0, drop);
  const cam = camPath(t, [
    [s.start, {pos: [2.6, 1.6, 7.2], target: [0.2, 1.55, -1.2], fov: 40}],
    [carW - 0.2, {pos: [2.4, 1.5, 6.8], target: [0.2, 1.4, -1.0], fov: 40}],
    [carW + 1.2, {pos: [0.2, 1.25, 5.3], target: [-0.8, 1.35, -0.6], fov: 40}],
    [s.end, {pos: [0.0, 1.2, 5.0], target: [-0.85, 1.35, -0.6], fov: 40}],
  ], EIO);
  const glow = p(t, sensible - 0.2, sensible + 0.5);
  return (
    <AbsoluteFill>
      <Shake t={t} hits={[anchor + 0.42]} amp={10}>
        <Stage t={t} cam={cam} backdrop="warm" glow={glow * 0.25}>
          <Floor />
          <Plinth position={BACK} height={0.45} r={1.4} />
          <SportsCar t={t} position={[BACK[0], 0.45, BACK[2]]} rotY={-0.45} hover={0.9 + bob(t)} lift={1} jets />
          <PriceTag text="NO PRICE" position={[TAG_X, 3.0, TAG_Z]} scale={tagScale} glow={1} swing={0.03 * Math.sin(t * 1.4)} />
          <Chain x={TAG_X} z={TAG_Z + 0.02} top={tagBottom} bottom={anchorY + 1.66 * 0.85} />
          <Anchor position={[TAG_X, anchorY, TAG_Z]} scale={0.85} />
          {t > anchor + 0.42 && t < anchor + 1.4 && <Dust t={t} k={p(t, anchor + 0.42, anchor + 1.4)} position={[TAG_X, 0.1, TAG_Z]} spread={0.9} color="#C9CBCF" />}
          <Plinth position={FRONT} height={0.45} r={1.3} />
          <SportsCar t={t} position={[FRONT[0], 0.45, FRONT[2]]} rotY={-0.6} glow={glow * 0.4} />
          <PriceTag text="RESERVE $50,000" position={[FRONT[0] + 0.25, 2.35, FRONT[2] + 0.7]} scale={1.1} glow={glow} swing={0.04 * Math.sin(t * 1.6)} />
        </Stage>
      </Shake>
      <ToolCard t={t} at={menus} title="The menu" items={['The crazy expensive dish', 'The one you actually order']} itemsAt={[menus + 0.15, menus + 1.0]} lit={t > menus + 1.6 ? 1 : -1} y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 6: your version (screenshot moment) ----------
const YourVersion: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(6);
  const wild = cue(6, 'wild');
  const hardly = cue(6, 'Hardly');
  const below = cue(6, 'below');
  const cam = camPath(t, [[s.start, {pos: [0.45, 1.6, 6.0], target: [0.3, 1.65, -0.6], fov: 38}], [s.end, {pos: [0.4, 1.62, 5.4], target: [0.3, 1.7, -0.6], fov: 38}]]);
  const reach = p(t, below - 0.3, below + 0.3);
  const glow = p(t, below - 0.2, below + 0.5);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={glow * 0.2}>
        <Floor />
        <StoreTable position={[0, 0, -0.8]} length={2.4} depth={0.8} />
        <GiftBox position={[0.45, 0.92, -0.75]} />
        <GiftBox position={[-0.15, 0.92, -0.8]} scale={0.8} rotY={0.3} />
        <Character who="you" t={t} position={[-0.6, 0, -1.65]} rotY={0.15} pose={t < line(18).end ? 'talk' : 'present'} mood="happy" talking={0} />
        <PriceTag text="THE WORKS $2,000" position={[0.55, tagY(t, wild - 0.25, 2.95), -0.45]} scale={1.35} swing={(t > hardly ? 0.06 : 0.02) * Math.sin(t * 2)} />
        <PriceTag text="$400" position={[0.55, 2.05, -0.45]} scale={1.1} glow={glow} swing={0.03 * Math.sin(t * 1.5)} />
        <Character who="stranger_a" t={t} position={[1.1, 0, 0.0]} rotY={Math.PI + 0.7} pose={reach > 0.5 ? 'point' : 'idle'} mood={reach > 0.5 ? 'happy' : 'neutral'} look={0.15} seed={3} />
      </Stage>
      <XCheck t={t} at={s.start + 0.05} out={wild + 2.2} wrong="One price for everything" right="One wild option above your best seller" y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: Jay, one price ----------
const Jay: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(7);
  const cam: Cam = {pos: [0.4, 1.6, 5.2], target: [0, 1.5, -0.8], fov: 36};
  const head = toScreen(cam, [-0.3, 1.95, -1.7]);
  const walk = (t - s.start) * 0.9;
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Crowd t={t} spots={[[-3.4 + walk, -3.6], [-4.6 + walk, -4.2], [2.6 + walk * 0.6, -4.0]]} />
        <StoreTable position={[0, 0, -0.8]} length={2.4} depth={0.8} />
        <GiftBox position={[0.35, 0.92, -0.75]} />
        <Character who="friend" t={t} position={[-0.3, 0, -1.7]} rotY={0.1} pose="phone" mood="bored" rightHand={<Phone position={[0.02, -0.06, 0.06]} rotation={[0.6, 0, 0]} scale={1.1} />} seed={7} />
        <PriceTag text="$400" position={[0.6, 2.1, -0.5]} scale={1.05} swing={0.12 * Math.sin((t - s.start) * 2.6) * (1 - p(t, s.end - 1, s.end))} />
      </Stage>
      <Label t={t} at={cue(7, 'friend') ?? s.start + 0.6} text="Jay" x={head[0]} y={head[1]} rise={100} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (kept quiet) ----------
const Sound: React.FC = () => {
  const {cue, shot} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="click" at={cue(1, 'price') + 0.2} volume={0.12} />
      <Sfx name="whoosh" at={shot(2).start - 0.1} volume={0.1} />
      <Sfx name="whoosh" at={cue(4, 'jumping')} volume={0.14} />
      <Sfx name="thud" at={cue(5, 'anchor') + 0.42} volume={0.22} />
      <Sfx name="ding" at={cue(5, 'sensible')} volume={0.1} />
      <Sfx name="pop" at={cue(6, 'below')} volume={0.1} />
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
          {id: 1, render: (tt) => <NoPrice t={tt} />},
          {id: 2, enter: 'fade', render: (tt) => <Lineup t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <TwoJobs t={tt} />},
          {id: 4, enter: 'push', render: (tt) => <Filmed t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <TheAnchor t={tt} />},
          {id: 6, enter: 'fade', render: (tt) => <YourVersion t={tt} />},
          {id: 7, enter: 'cut', render: (tt) => <Jay t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(1).end]]} />
      <Grain />
      <Sound />
      {t > line(21).end + 0.15 && <AbsoluteFill style={{background: C.base, opacity: p(t, line(21).end + 0.15, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
// keep helpers referenced for future edits
export const _unused = {wobble, talk};
