// "The bottle in the dark" (scripts/2026-10-21-the-bottle-in-the-dark.md).
// Metaphor: the lights-out test. The lights keep dropping, and in the dark only things with a shape of their own
// still glow as a yellow outline. Every time comes from the narration (cue / word / line / shot).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {Plinth, StoreTable} from '../../kit/three/brand';
import {ContourBottle, DrinksCooler, PlainBottle, StandCard} from '../../kit/three/shop';
import {clamp, EIO, EO, lerp, p} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-bottle-in-the-dark';
type V3 = [number, number, number];

/** A scene that can lose its lights: the lit scene, a dark layer over it (`dark` 0..1), then the glowing outlines on
 * top so they stay bright in the dark. */
const LightsOut: React.FC<{t: number; cam: Cam; dark: number; scene: React.ReactNode; rims?: React.ReactNode; glow?: number}> = ({t, cam, dark, scene, rims, glow = 0}) => (
  <AbsoluteFill>
    <Stage t={t} cam={cam} backdrop="warm" glow={glow}>
      {scene}
    </Stage>
    {dark > 0.001 && <AbsoluteFill style={{background: '#121315', opacity: clamp(dark) * 0.93}} />}
    {rims && (
      <Stage t={t} cam={cam} backdrop={<></>} fog={null}>
        {rims}
      </Stage>
    )}
  </AbsoluteFill>
);

/** Your product box: rounded, with a yellow stripe and a name card. `covered` 0..1 slides a grey sticker over the name. */
const YourBox: React.FC<{position: V3; covered?: number; lit?: number; rimOnly?: boolean; rim?: number}> = ({position, covered = 0, lit = 0, rimOnly = false, rim = 0}) => {
  if (rimOnly)
    return (
      <group position={position}>
        <RoundedBox args={[0.34, 0.34, 0.34]} radius={0.1} smoothness={4} position={[0, 0.17, 0]} renderOrder={1}>
          <meshBasicMaterial colorWrite={false} />
        </RoundedBox>
        <RoundedBox args={[0.4, 0.4, 0.4]} radius={0.12} smoothness={4} position={[0, 0.17, 0]} renderOrder={2}>
          <meshBasicMaterial color={C.gold} side={THREE.BackSide} transparent opacity={rim} />
        </RoundedBox>
      </group>
    );
  return (
    <group position={position}>
      <RoundedBox args={[0.34, 0.34, 0.34]} radius={0.1} smoothness={4} position={[0, 0.17, 0]} castShadow>
        <meshStandardMaterial color="#FFFFFF" roughness={0.45} emissive={C.gold} emissiveIntensity={lit * 0.15} />
      </RoundedBox>
      <mesh position={[0, 0.17, 0.172]}>
        <planeGeometry args={[0.34, 0.07]} />
        <meshBasicMaterial color={new THREE.Color(C.gold).lerp(new THREE.Color(C.goldGlow), lit).getStyle()} />
      </mesh>
      <StandCard text="YOURS" position={[0, 0.23, 0.175]} size={[0.2, 0.06]} stand={0} />
      {covered > 0.01 && (
        <mesh position={[lerp(0.3, 0, EO(covered)), 0.26, 0.215]}>
          <planeGeometry args={[0.24, 0.1]} />
          <meshStandardMaterial color="#8D9096" roughness={0.8} />
        </mesh>
      )}
    </group>
  );
};

/** A plain grey box everyone else sells. */
const PlainBox: React.FC<{position: V3}> = ({position}) => (
  <mesh position={[position[0], position[1] + 0.16, position[2]]} castShadow>
    <boxGeometry args={[0.32, 0.32, 0.32]} />
    <meshStandardMaterial color="#C9C9C6" roughness={0.7} />
  </mesh>
);

// ---------- Shot 1: the dark cooler ----------
const DarkCooler: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const dark = cue(1, 'dark');
  const grab = cue(1, 'grab');
  const coke = cue(1, 'Coke');
  const lid = p(t, dark - 0.3, dark + 0.5, EIO);
  const rise = p(t, grab, grab + 1.4, EO);
  const bottle: V3 = [0.08, lerp(0.52, 1.1, rise), 0.05];
  const cam = camPath(t, [[s.start, {pos: [0.25, 1.75, 2.4], target: [0.05, 0.6, 0], fov: 40}], [s.end, {pos: [0.2, 1.55, 1.9], target: [0.05, 0.85, 0], fov: 40}]]);
  const rim = p(t, coke - 0.3, coke + 0.2);
  return (
    <LightsOut t={t} cam={cam} dark={0.78}
      scene={<>
        <Floor />
        <DrinksCooler position={[0, 0, 0]} lid={lid} />
        <Character who="you" t={t} position={[0.05, 0, -0.75]} pose={t > grab - 0.5 ? 'point' : 'idle'} mood="neutral" lookUp={-0.6} />
        <ContourBottle position={bottle} scale={1.6} rotY={0.3} />
      </>}
      rims={<ContourBottle position={bottle} scale={1.6} rotY={0.3} outline={rim} rimOnly />} />
  );
};

// ---------- Shot 2: the brief ----------
const TheBrief: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(2);
  const brief = cue(2, 'brief');
  const cam = camPath(t, [[s.start, {pos: [0, 1.6, 3.3], target: [0, 1.45, 0], fov: 40}], [s.end, {pos: [0, 1.55, 3.0], target: [0, 1.45, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Plinth position={[0, 0, 0]} height={0.7} r={0.32} />
        <ContourBottle position={[0, 0.7, 0]} scale={3.0} rotY={(t - s.start) * 0.6} />
        <StandCard text={'THE BRIEF\n1915'} position={[0, 1.95, -0.3]} size={[0.95, 0.5]} stand={0} pop={p(t, brief - 0.3, brief + 0.2, EO)} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 3: copycats ----------
const ROW_X = [-0.45, -0.15, 0.15, 0.45];
const LABELS = ['COCA-COLA', 'KOKA-NOLA', 'TOKA-COLA', 'KOKE'];
const Copycats: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s = shot(3);
  const year = cue(3, '1915');
  const problem = word('problem', line(5).start);
  const pops = [problem - 0.1, cue(3, 'Koka'), cue(3, 'Toka'), cue(3, 'Koke')];
  const same = cue(3, 'Same');
  const sync = t > same ? Math.sin((t - same) * 7) * 0.12 * Math.exp(-(t - same) * 0.7) : 0;
  const cam = camPath(t, [[s.start, {pos: [-0.25, 1.55, 3.3], target: [-0.05, 1.35, 0], fov: 40}], [s.end, {pos: [0.2, 1.5, 3.1], target: [0.03, 1.35, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, 0]} length={1.6} depth={0.6} />
        {ROW_X.map((x, i) => (
          <group key={i} position={[x, 0.92, 0]} rotation={[0, 0, sync]}>
            <PlainBottle label={LABELS[i]} scale={2.7} pop={p(t, pops[i] - 0.15, pops[i] + 0.25, EO)} />
          </group>
        ))}
        <StandCard text="1915" position={[0, 2.02, -0.4]} size={[0.7, 0.3]} stand={0} pop={p(t, year - 0.2, year + 0.3, EO)} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 4: the bottle is the logo ----------
const BottleIsLogo: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s = shot(4);
  const bigger = cue(4, 'bigger');
  const logo = word('bottle', line(12).start);
  const balloon = p(t, bigger - 0.5, bigger + 0.2, EO) * (1 - p(t, logo - 0.1, logo + 0.3));
  const morph = p(t, logo, logo + 0.8, EIO);
  const cam = camPath(t, [[s.start, {pos: [0, 1.45, 2.6], target: [0, 1.3, 0], fov: 40}], [s.end, {pos: [0, 1.42, 2.3], target: [0, 1.3, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Plinth position={[0, 0, 0]} height={0.7} r={0.32} />
        {t < logo + 0.05 ? (
          <>
            <PlainBottle position={[0, 0.7, 0]} label="COCA-COLA" scale={3.0} />
            {balloon > 0.01 && <StandCard text="COCA-COLA" position={[0, 1.08, 0.3]} size={[0.6, 0.2]} stand={0} scale={0.45 + 0.85 * balloon} />}
          </>
        ) : (
          <ContourBottle position={[0, 0.7, 0]} scale={3.0} morph={morph} outline={0.6 * p(t, logo + 0.5, logo + 1.0)} />
        )}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 5: lights out, then broken (screenshot moment) ----------
const LightsOutShot: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s = shot(5);
  const glassmakers = word('glassmakers', line(13).start);
  const dark = cue(5, 'dark');
  const broken = cue(5, 'broken');
  const k = p(t, dark - 0.25, dark + 0.25);
  const br = p(t, broken - 0.1, broken + 0.8);
  const drop = p(t, broken - 0.35, broken - 0.05, EIO);
  const pos: V3 = [0, lerp(0.92, 0.0, drop) + (drop > 0 && drop < 1 ? 0 : 0), 0.1];
  const onFloor: V3 = br > 0 ? [0, 0.0, 0.45] : pos;
  const cam = camPath(t, [[s.start, {pos: [0, 1.4, 3.4], target: [0, 1.08, 0], fov: 40}], [broken - 0.2, {pos: [0, 1.35, 3.1], target: [0, 1.0, 0], fov: 40}], [s.end, {pos: [0, 2.2, 3.2], target: [0, 0.15, 0.5], fov: 40}]]);
  const plain = [-0.48, -0.24, 0.24, 0.48];
  const bottleNode = (rimOnly: boolean) => (br > 0 ? (
    <ContourBottle position={onFloor} scale={2.4} broken={br} outline={1} rimOnly={rimOnly} />
  ) : (
    <ContourBottle position={[0, lerp(0.92, 0.02, drop), lerp(0.1, 0.45, drop)]} scale={2.4} outline={rimOnly ? k : 0} rimOnly={rimOnly} tilt={drop * 0.6} />
  ));
  return (
    <LightsOut t={t} cam={cam} dark={k}
      scene={<>
        <Floor />
        <StoreTable position={[0, 0, 0]} length={1.6} depth={0.6} />
        {plain.map((x) => <PlainBottle key={x} position={[x, 0.92, 0]} scale={2.2} label="COLA" />)}
        {bottleNode(false)}
        <StandCard text={'KNOW IT IN THE DARK.\nKNOW IT BROKEN.'} position={[0, 1.85, -0.45]} size={[1.25, 0.42]} stand={0} pop={p(t, glassmakers - 0.2, glassmakers + 0.3, EO)} />
      </>}
      rims={bottleNode(true)} />
  );
};

// ---------- Shot 6: Indiana, tracing the curves ----------
const Trace: React.FC<{k: number; scale: number; position: V3}> = ({k, scale, position}) => {
  // the contour bottle's outline, both sides, as one path from the base up and back down
  const pts = useMemo(() => {
    const prof: [number, number][] = [[0.03, 0], [0.034, 0.035], [0.029, 0.066], [0.036, 0.112], [0.031, 0.165], [0.027, 0.188], [0.029, 0.212], [0.02, 0.275], [0.0115, 0.345], [0.0128, 0.362]];
    const right = prof.map(([r, y]) => [r * 1.18, y] as [number, number]);
    const left = [...right].reverse().map(([r, y]) => [-r, y] as [number, number]);
    const all = [...right, ...left];
    const out: [number, number][] = [];
    for (let i = 0; i < all.length - 1; i++) for (let j = 0; j < 8; j++) out.push([lerp(all[i][0], all[i + 1][0], j / 8), lerp(all[i][1], all[i + 1][1], j / 8)]);
    return out;
  }, []);
  return (
    <group position={position} scale={scale}>
      {pts.map(([x, y], i) => (i / pts.length <= k ? (
        <mesh key={i} position={[x, y, 0.04]}>
          <sphereGeometry args={[0.0028, 8, 6]} />
          <meshBasicMaterial color={C.gold} />
        </mesh>
      ) : null))}
    </group>
  );
};
const Indiana: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const indiana = cue(6, 'Indiana');
  const curves = cue(6, 'curves');
  const cam = camPath(t, [[s.start, {pos: [0, 1.6, 3.3], target: [0, 1.45, 0], fov: 40}], [s.end, {pos: [0, 1.55, 3.0], target: [0, 1.45, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Plinth position={[0, 0, 0]} height={0.7} r={0.32} />
        <ContourBottle position={[0, 0.7, 0]} scale={3.0} />
        <Trace position={[0, 0.7, 0]} scale={3.0} k={p(t, curves - 1.2, curves + 0.6)} />
        <StandCard text={'TERRE HAUTE,\nINDIANA'} position={[0, 1.95, -0.3]} size={[1.0, 0.48]} stand={0} pop={p(t, indiana - 0.3, indiana + 0.2, EO)} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 7: a hundred years later ----------
const SHELF = ['FIZZ', 'COLA', '', 'SODA', 'POP'];
const HundredYears: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(7);
  const hundred = cue(7, 'hundred');
  const label = cue(7, 'label');
  const fade = p(t, label - 0.3, label + 0.4);
  const cam = camPath(t, [[s.start, {pos: [-0.3, 1.3, 3.0], target: [0, 1.0, 0], fov: 40}], [s.end, {pos: [0.2, 1.28, 2.8], target: [0, 1.0, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, 0]} length={1.6} depth={0.6} />
        {SHELF.map((l, i) => {
          const x = -0.52 + i * 0.26;
          const pop = p(t, hundred - 0.3 + i * 0.08, hundred + i * 0.08, EO);
          return l ? (
            <PlainBottle key={i} position={[x, 0.92, 0]} scale={2.0} label={fade > 0.5 ? '' : l} pop={pop} />
          ) : (
            <group key={i} position={[x, 0.92, 0]} scale={EO(pop)}>
              <ContourBottle scale={2.0} outline={0.7 * fade} />
            </group>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 8: your name covered ----------
const BOX_X = [-0.5, -0.17, 0.17, 0.5];
const NameCovered: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(8);
  const covered = cue(8, 'covered');
  const shape = cue(8, 'shape');
  const dark = cue(8, 'dark');
  const k = p(t, dark - 0.25, dark + 0.2);
  const cov = p(t, covered - 0.3, covered + 0.3);
  const lit = p(t, shape - 0.2, shape + 0.4);
  const cam = camPath(t, [[s.start, {pos: [0, 1.6, 3.6], target: [0, 1.05, 0], fov: 40}], [s.end, {pos: [0, 1.5, 2.9], target: [0, 1.05, 0.05], fov: 40}]]);
  return (
    <>
      <LightsOut t={t} cam={cam} dark={k}
        scene={<>
          <Floor />
          <StoreTable position={[0, 0, 0]} length={1.6} depth={0.6} />
          {BOX_X.map((x, i) => (i === 2 ? <YourBox key={i} position={[x, 0.92, 0.05]} covered={cov} lit={lit} /> : <PlainBox key={i} position={[x, 0.92, 0.05]} />))}
          <Character who="you" t={t} position={[0.45, 0, -0.65]} rotY={-0.3} pose={t > shape ? 'present' : 'idle'} mood="happy" />
        </>}
        rims={<YourBox position={[BOX_X[2], 0.92, 0.05]} rimOnly rim={k} />} />
      <XCheck t={t} at={line(17).start + 0.4} out={s.end} wrong="Same as everyone, bigger logo" right="Known with the name covered" rightAt={covered} y={230} />
    </>
  );
};

// ---------- Shot 9: Jay's grey boxes ----------
const JaysBoxes: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(9);
  const elses = cue(9, "else's");
  const blur = p(t, elses - 0.3, elses + 0.5);
  const cam: Cam = {pos: [0.0, 1.7, 4.6], target: [0.0, 1.15, 0], fov: 40};
  const head = toScreen(cam, [-0.45, 1.76, -0.7]);
  return (
    <AbsoluteFill style={{filter: `blur(${blur * 3}px)`}}>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        {[-0.45, 0.6].map((sx, si) => (
          <group key={si}>
            <StoreTable position={[sx, 0, 0]} length={0.95} depth={0.55} />
            {[-0.22, 0.12].map((dx) => <PlainBox key={dx} position={[sx + dx, 0.92, 0.0]} />)}
          </group>
        ))}
        <Character who="friend" t={t} position={[-0.45, 0, -0.7]} pose="idle" mood={t > elses ? 'sad' : 'bored'} seed={7} />
        <Character who="stranger_c" t={t} position={[0.6, 0, -0.7]} pose="idle" mood="bored" seed={5} />
      </Stage>
      <Label t={t} at={s.start + 0.5} text="Jay" x={head[0]} y={head[1]} rise={50} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue, word, line} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="click" at={cue(1, 'dark') - 0.2} volume={0.08} />
      <Sfx name="sparkle" at={cue(1, 'Coke')} volume={0.06} />
      <Sfx name="pop" at={cue(3, 'Koka')} volume={0.07} />
      <Sfx name="pop" at={cue(3, 'Toka')} volume={0.07} />
      <Sfx name="pop" at={cue(3, 'Koke')} volume={0.07} />
      <Sfx name="swell" at={word('bottle', line(12).start)} volume={0.06} />
      <Sfx name="click" at={cue(5, 'dark') - 0.15} volume={0.08} />
      <Sfx name="scratch" at={cue(5, 'broken')} volume={0.05} />
      <Sfx name="click" at={cue(8, 'dark') - 0.15} volume={0.08} />
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
          {id: 1, render: (tt) => <DarkCooler t={tt} />},
          {id: 2, enter: 'flash', render: (tt) => <TheBrief t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <Copycats t={tt} />},
          {id: 4, enter: 'cut', render: (tt) => <BottleIsLogo t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <LightsOutShot t={tt} />},
          {id: 6, enter: 'cut', render: (tt) => <Indiana t={tt} />},
          {id: 7, enter: 'cut', render: (tt) => <HundredYears t={tt} />},
          {id: 8, enter: 'fade', render: (tt) => <NameCovered t={tt} />},
          {id: 9, enter: 'cut', render: (tt) => <JaysBoxes t={tt} />},
        ]}
      />
      <BigText t={t} at={0.08} out={shot(1).end} text="You'd know it in the dark" highlight="dark" y={220} size={96} color={C.white} />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(1).end]]} />
      <Grain />
      <Sound />
      {t > line(20).end + 0.15 && <AbsoluteFill style={{background: C.base, opacity: p(t, line(20).end + 0.15, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
