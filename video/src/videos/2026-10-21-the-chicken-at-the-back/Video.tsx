// "The chicken at the back" (scripts/2026-10-21-the-chicken-at-the-back.md).
// Metaphor: the walk is the product. A dotted yellow path snakes from the door to the chicken at the very back, past
// every aisle, and your cart fills along it. Every time comes from the narration (cue / word / line / shot).
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import * as THREE from 'three';
import {fitText, GlassCase, PriceTag, StoreTable, useCanvas} from '../../kit/three/brand';
import {along, FloorPath, HeatLamp, RotisserieChicken, ShelfRack, ShoppingCart, StandCard, Warehouse, WAREHOUSE_PATH} from '../../kit/three/shop';
import {clamp, EIO, EO, lerp, p} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-chicken-at-the-back';
type V3 = [number, number, number];

/** Interpolate through [time, value] keys. */
const keys = (t: number, ks: [number, number][]) => {
  if (t <= ks[0][0]) return ks[0][1];
  for (let i = 1; i < ks.length; i++) {
    if (t <= ks[i][0]) return lerp(ks[i - 1][1], ks[i][1], EIO((t - ks[i - 1][0]) / (ks[i][0] - ks[i - 1][0])));
  }
  return ks[ks.length - 1][1];
};

/** The chicken counter at the back of a straight aisle (shots 1, 4, 5): a table, the chicken, a heat lamp. */
const Counter: React.FC<{z: number; glow?: number; lamp?: number; tagGlow?: number; tag?: boolean; t: number}> = ({z, glow = 0.5, lamp = 1, tagGlow = 0, tag = true, t}) => (
  <group>
    <StoreTable position={[0, 0, z]} length={1.3} depth={0.7} />
    <RotisserieChicken position={[0, 0.92, z]} scale={1.6} glow={glow} />
    <HeatLamp position={[0, 1.95, z]} k={lamp} drop={0.85} />
    {tag && <PriceTag text="$4.99" position={[0.36, 1.6, z + 0.15]} string={0.18} scale={0.55} glow={tagGlow} swing={0.04 * Math.sin(t * 1.6)} />}
  </group>
);

/** A straight aisle of racks along -z on both sides, for the floor-level shots. */
const Aisle: React.FC<{from?: number; to?: number; x?: number}> = ({from = 2, to = -10, x = 1.15}) => {
  const segs: number[] = [];
  for (let z = from; z > to; z -= 3.1) segs.push(z - 1.5);
  return (
    <group>
      {segs.map((z, i) => (
        <group key={z}>
          <ShelfRack position={[-x, 0, z]} length={3} rotY={Math.PI / 2} kind="mixed" seed={i * 2 + 1} />
          <ShelfRack position={[x, 0, z]} length={3} rotY={Math.PI / 2} kind="mixed" seed={i * 2 + 2} />
        </group>
      ))}
    </group>
  );
};

// ---------- Shot 1: you came for one thing ----------
const OneThing: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const costco = cue(1, 'Costco');
  const chicken = cue(1, 'chicken');
  const zoom = p(t, chicken - 0.9, chicken + 0.5, EIO);
  const cam: Cam = {pos: [0.35, 1.7, 5.6], target: [lerp(0.1, 0, zoom), lerp(1.15, 1.18, zoom), -9.6], fov: lerp(40, 11, zoom)};
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" drain={0.45 * (1 - p(t, costco - 0.3, costco + 0.6))}>
        <Floor />
        <Aisle from={2.2} to={-9} />
        <Counter t={t} z={-9.6} glow={0.4 + 0.5 * p(t, chicken - 0.2, chicken + 0.4)} tagGlow={p(t, chicken, chicken + 0.5)} />
        <Character who="you" t={t} position={[-0.55, 0, 2.6]} rotY={Math.PI - 0.15} pose="idle" mood="happy" />
      </Stage>
      <BigText t={t} at={0.16} text="You came for the $4.99 chicken" highlight="chicken" y={220} size={92} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: past everything ----------
const TV_Z = -1.6;
const JEWEL_Z = -3.7;
const NUT_Z = -6.4;
const PastEverything: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(2);
  const back = cue(2, 'back');
  const tvs = cue(2, 'TVs');
  const jewelry = cue(2, 'jewelry');
  const nuts = cue(2, 'nuts');
  const z = keys(t, [[s.start, 1.2], [tvs, TV_Z + 0.3], [jewelry, JEWEL_Z + 0.3], [nuts, NUT_Z + 0.4], [s.end, NUT_Z - 1.2]]);
  const step = Math.abs(Math.sin(t * 7)) * 0.03;
  const cam: Cam = {pos: [4.6, 1.6, z - 0.35], target: [-0.45, 1.05, z - 0.4], fov: 40};
  const pathPts: [number, number][] = [[0, z - 0.2], [0, -9]];
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        {/* the far wall of things you walk past */}
        <ShelfRack position={[-1.15, 0, TV_Z]} length={2.4} rotY={Math.PI / 2} kind="tv" seed={3} />
        <StoreTable position={[-0.95, 0, JEWEL_Z]} length={1.4} depth={0.6} rotY={Math.PI / 2} />
        <GlassCase position={[-0.95, 0.92, JEWEL_Z]} size={[0.5, 0.3, 1.2]} />
        {[-0.35, 0, 0.35].map((dz) => (
          <mesh key={dz} position={[-0.95, 1.0, JEWEL_Z + dz]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.05, 0.014, 10, 24]} />
            <meshStandardMaterial color={C.gold} metalness={0.6} roughness={0.25} />
          </mesh>
        ))}
        <ShelfRack position={[-1.15, 0, NUT_Z]} length={2.4} rotY={Math.PI / 2} kind="nuts" seed={5} />
        {/* the nut tub the size of your head, at head height */}
        <mesh position={[-0.72, 0.62, NUT_Z + 0.2]} castShadow userData={{clip: {kind: 'solid', name: 'pallet'}}}>
          <boxGeometry args={[0.7, 1.24, 0.7]} />
          <meshStandardMaterial color="#E3E4E7" roughness={0.8} />
        </mesh>
        <mesh position={[-0.72, 1.52, NUT_Z + 0.2]} castShadow>
          <cylinderGeometry args={[0.28, 0.28, 0.56, 28]} />
          <meshStandardMaterial color={C.gold} roughness={0.5} />
        </mesh>
        <ShelfRack position={[-1.15, 0, -9.2]} length={2.4} rotY={Math.PI / 2} kind="boxes" seed={7} />
        <FloorPath pts={pathPts} k={p(t, back - 0.2, back + 0.9)} glow={0.2} />
        <ShoppingCart position={[0.0, 0, z - 0.88]} rotY={Math.PI / 2} fill={0} />
        <Character who="you" t={t} position={[0.0, step, z]} rotY={Math.PI} pose="lean" mood={t > nuts ? 'shock' : 'happy'} look={t > tvs - 0.3 && t < nuts + 1 ? 0.6 : 0} />
      </Stage>
    </AbsoluteFill>
  );
};

/** A flat floor label you can read from above. */
const FlatLabel: React.FC<{text: string; position: V3; size: [number, number]; glow?: number}> = ({text, position, size, glow = 0}) => {
  const tex = useCanvas(`flat:${text}`, (ctx, w, h) => fitText(ctx, text, w, h, C.ink, '"Antonio", sans-serif', 700, 0.7), 512, 200);
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} userData={{noClip: true}}>
        <planeGeometry args={size} />
        <meshBasicMaterial color={new THREE.Color('#FFFFFF').lerp(new THREE.Color(C.gold), clamp(glow)).getStyle()} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{noClip: true}}>
        <planeGeometry args={[size[0] * 0.92, size[1] * 0.85]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
    </group>
  );
};

/** The warehouse from above, with the snaking path and the chicken at the back (shots 3 and 6). */
const MapView: React.FC<{t: number; path: number; pathGlow: number; lit: number[]; chickenGlow: number; ovens?: number; you?: number; cam: Cam}> = ({t, path, pathGlow, lit, chickenGlow, ovens = 0, you = -1, cam}) => {
  const y = you >= 0 ? along(WAREHOUSE_PATH, you) : null;
  return (
    <Stage t={t} cam={cam} backdrop="warm" fog={null}>
      <Floor />
      <Warehouse lit={lit}>
        <StoreTable position={[0, 0, -4.95]} length={1.8} depth={0.6} />
        <RotisserieChicken position={[0, 0.92, -4.95]} scale={2.2} glow={chickenGlow} dome={false} />
        <mesh position={[0, 0.02, -4.95]} rotation={[-Math.PI / 2, 0, 0]} userData={{noClip: true}}>
          <ringGeometry args={[0.95, 0.95 + 0.12 * (0.4 + chickenGlow), 48]} />
          <meshBasicMaterial color={C.gold} transparent opacity={0.25 + 0.6 * chickenGlow} />
        </mesh>
        <FlatLabel text="OVENS" position={[2.6, 0.03, -5.05]} size={[1.3, 0.5]} glow={ovens} />
        <FloorPath pts={WAREHOUSE_PATH} k={path} glow={pathGlow} size={0.09} />
      </Warehouse>
      {y && <Character who="you" t={t} position={[y.x, 0, y.z]} rotY={y.dir} pose="idle" mood="happy" />}
    </Stage>
  );
};

// ---------- Shot 3: not the ovens (screenshot moment) ----------
const NotTheOvens: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(3);
  const ovens = cue(3, 'ovens');
  const isnt = cue(3, "isn't");
  const cheap = cue(3, 'cheap');
  const everything = cue(3, 'everything');
  const crane = p(t, s.start, isnt, EIO);
  const cam: Cam = {pos: [0, lerp(1.7, 22, crane), lerp(8.2, 1.8, crane)], target: [0, 0, lerp(0, 1.2, crane)], fov: 40};
  const pathK = p(t, isnt, everything - 0.6, (k) => k);
  const lit = [0, 1, 2, 3].map((i) => p(t, everything - 0.5 + i * 0.35, everything - 0.2 + i * 0.35));
  const pulse = p(t, cheap - 0.1, cheap + 0.3) * (1 - 0.5 * p(t, cheap + 0.5, cheap + 1.2));
  return (
    <AbsoluteFill>
      <MapView t={t} cam={cam} path={pathK} pathGlow={p(t, everything, everything + 0.8) * 0.6} lit={lit} chickenGlow={0.35 + pulse}
        ovens={p(t, ovens - 0.1, ovens + 0.2) * (1 - p(t, isnt - 0.3, isnt))} you={pathK * 0.98} />
    </AbsoluteFill>
  );
};

// ---------- Shot 4: thirty to forty million a year ----------
const FortyMillion: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(4);
  const thirty = cue(4, 'thirty');
  const forty = cue(4, 'forty');
  const price = cue(4, 'price');
  const flip = p(t, forty - 0.2, forty + 0.25, EIO);
  const cam = camPath(t, [[s.start, {pos: [0, 1.4, 3.1], target: [0, 1.32, -0.4], fov: 40}], [s.end, {pos: [0, 1.38, 2.7], target: [0, 1.3, -0.4], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Counter t={t} z={-0.4} glow={0.6} tagGlow={p(t, price - 0.1, price + 0.5)} />
        <StandCard text={'$30 MILLION'} back={'$40 MILLION\nA YEAR'} position={[0, 2.12, -0.75]} size={[1.0, 0.5]} stand={0} flip={flip} pop={p(t, thirty - 0.3, thirty + 0.2, EO)} glow={flip > 0.5 ? 0.25 : 0} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 5: the full cart ----------
const FullCart: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(5);
  const chicken = cue(5, 'chicken');
  const full = cue(5, 'full');
  const fill = 5 + p(t, chicken - 0.3, chicken + 0.3);
  const wob = t > full ? Math.sin((t - full) * 10) * Math.exp(-(t - full) * 2.5) : 0;
  const cam = camPath(t, [[s.start, {pos: [2.3, 0.9, 4.2], target: [-0.1, 0.85, 0], fov: 40}], [s.end, {pos: [2.25, 1.2, 4.0], target: [-0.1, 1.1, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Counter t={t} z={-1.3} glow={0.5} tag={false} />
        <ShoppingCart position={[0.05, 0, 0]} rotY={0} fill={fill} wobble={wob} />
        <Character who="you" t={t} position={[-0.98, 0, 0]} rotY={Math.PI / 2} pose="lean" mood={t > full ? 'shock' : 'happy'} look={0.2} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 6: the walk was the product ----------
const TheWalk: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const product = cue(6, 'product');
  const walked = cue(6, 'walked');
  const cam: Cam = {pos: [0, 22, 1.8], target: [0, 0, 1.2], fov: 40};
  return (
    <AbsoluteFill>
      <MapView t={t} cam={cam} path={1} pathGlow={p(t, walked - 0.2, walked + 0.6)} lit={[0, 0, 0, 0]} chickenGlow={0.6 * (1 - p(t, product - 0.1, product + 0.5))} />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: your path ----------
const STATIONS: {text: string; x: number; z: number}[] = [
  {text: 'WEBSITES', x: 0.55, z: 0.9},
  {text: 'ADS', x: -0.55, z: -0.5},
  {text: 'MONTHLY\nCARE', x: 0.55, z: -1.9},
];
const YourPath: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(7);
  const silly = cue(7, 'silly');
  const everything = cue(7, 'everything');
  const walkStart = line(17).start - 0.2;
  // the customer stops at each card on the way to the offer at the back
  const z = keys(t, [[walkStart, 1.9], [walkStart + 0.6, 0.9], [walkStart + 1.0, 0.9], [walkStart + 1.5, -0.5], [walkStart + 1.9, -0.5], [walkStart + 2.4, -1.9], [walkStart + 2.8, -1.9], [s.end, -2.75]]);
  const cam = camPath(t, [[s.start, {pos: [0.0, 4.4, 3.4], target: [0, 0.45, -2.75], fov: 40}], [s.end, {pos: [0.0, 4.25, 3.1], target: [0, 0.45, -2.8], fov: 40}]]);
  const atCard = STATIONS.findIndex((st) => Math.abs(z - st.z) < 0.15);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={p(t, silly, silly + 0.6) * 0.2}>
        <Floor />
        <FloorPath pts={[[0, 2.0], [0, -2.7]]} k={p(t, s.start + 0.2, silly)} glow={0.3} />
        {STATIONS.map((st, i) => (
          <StandCard key={i} text={st.text} position={[st.x, 0, st.z]} size={[0.7, 0.38]} stand={0.75} glow={atCard === i ? 0.6 : 0} pop={p(t, s.start + 0.2 + i * 0.25, s.start + 0.6 + i * 0.25, EO)} />
        ))}
        <StoreTable position={[0, 0, -3.5]} length={1.4} depth={0.6} />
        <StandCard text={'FREE\nAUDIT'} position={[0, 0.92, -3.45]} size={[0.9, 0.55]} stand={0.1} glow={p(t, silly - 0.1, silly + 0.4)} pop={p(t, s.start + 0.9, s.start + 1.3, EO)} />
        <Character who="you" t={t} position={[1.05, 0, -3.5]} rotY={-0.5} pose={t > silly ? 'present' : 'idle'} mood="happy" />
        <Character who="stranger_a" t={t} position={[0, Math.abs(Math.sin(t * 7)) * 0.02 * (atCard < 0 && t > walkStart ? 1 : 0), z]} rotY={atCard >= 0 ? Math.PI + (STATIONS[atCard].x > 0 ? -0.9 : 0.9) : Math.PI} pose="idle" mood={t > everything + 0.4 ? 'excited' : 'happy'} seed={3} />
      </Stage>
      <XCheck t={t} at={line(16).start + 0.3} out={s.end} wrong="One cheap offer on its own" right="A great offer past everything else" rightAt={line(17).start} y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 8: Jay's one offer ----------
const JaysOffer: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(8);
  const only = cue(8, 'only');
  const take = p(t, only - 0.6, only - 0.1, EIO);
  const leave = p(t, only - 0.05, s.end, (k) => k);
  const cam: Cam = {pos: [0.2, 1.75, 5.0], target: [0.1, 1.2, -0.3], fov: 40};
  const head = toScreen(cam, [-0.2, 1.76, -0.95]);
  const bx = lerp(0.85, 2.2, leave);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.35]} length={1.5} depth={0.6} />
        {take < 1 && <StandCard text={'CHEAP\nLOGO'} position={[lerp(0.15, 0.55, take), 0.92, lerp(-0.3, -0.1, take)]} size={[0.45, 0.32]} stand={0.08} />}
        <Character who="friend" t={t} position={[-0.2, 0, -0.95]} pose="idle" mood={t > only ? 'sad' : 'bored'} seed={7} />
        <Character who="stranger_b" t={t} position={[bx, 0, 0.25]} rotY={leave > 0.02 ? Math.PI / 2 : Math.PI + 0.3} pose={take > 0.2 ? 'hold' : 'idle'} mood="neutral" seed={9}
          rightHand={take >= 1 ? <group rotation={[1.0, 0, 0.3, 'ZYX']}><StandCard text={'CHEAP\nLOGO'} position={[0, -0.05, 0.05]} size={[0.45, 0.32]} stand={0} scale={0.6} /></group> : undefined} />
      </Stage>
      <Label t={t} at={s.start + 0.5} text="Jay" x={head[0]} y={head[1]} rise={50} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="ding" at={cue(1, 'chicken')} volume={0.07} />
      <Sfx name="tick" at={cue(2, 'TVs')} volume={0.06} />
      <Sfx name="tick" at={cue(2, 'jewelry')} volume={0.06} />
      <Sfx name="tick" at={cue(2, 'nuts')} volume={0.06} />
      <Sfx name="whoosh" at={cue(3, "isn't")} volume={0.08} />
      <Sfx name="click" at={cue(4, 'forty') - 0.1} volume={0.1} />
      <Sfx name="pop" at={cue(5, 'chicken')} volume={0.1} />
      <Sfx name="ding" at={cue(6, 'walked')} volume={0.08} />
      <Sfx name="ding" at={cue(7, 'silly')} volume={0.07} />
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
          {id: 1, render: (tt) => <OneThing t={tt} />},
          {id: 2, enter: 'cut', render: (tt) => <PastEverything t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <NotTheOvens t={tt} />},
          {id: 4, enter: 'push', render: (tt) => <FortyMillion t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <FullCart t={tt} />},
          {id: 6, enter: 'fade', render: (tt) => <TheWalk t={tt} />},
          {id: 7, enter: 'cut', render: (tt) => <YourPath t={tt} />},
          {id: 8, enter: 'cut', render: (tt) => <JaysOffer t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(1).end]]} />
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
export const _unused = {clamp};
type _V = V3;
