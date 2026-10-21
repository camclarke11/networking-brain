// "The comma in the price" (scripts/2026-10-21-the-comma-in-the-price.md).
// Metaphor: a price is a row of blocks, one per symbol or spoken syllable. Every comma, cent and dollar sign
// is one more block, and the longer the row, the heavier it sits on the scales. Times come from the narration.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, StudyCard, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {Bubble3D} from '../../kit/three/sets';
import {Coins, Laptop, PriceTag, Scales, StoreTable, SyllableTrain, TextCard, useCanvas} from '../../kit/three/brand';
import {clamp, EIO, EO, lerp, p, spr} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-comma-in-the-price';
const COMMA_PRICE = ['$', '1', ',', '4', '9', '9'];
const LONG = ['one', 'thou', 'sand', 'four', 'hun', 'dred', 'and', 'nine', 'ty', 'nine'];
const SHORT = ['four', 'teen', 'nine', 'ty', 'nine'];

/** A price tag resting on a scale pan. */
const PanTag: React.FC<{text: string; glow?: number}> = ({text, glow = 0}) => <PriceTag text={text} position={[0, 0.27, 0]} string={0.001} scale={0.75} glow={glow} />;

// ---------- Shot 1: the comma comes out, then the scales ----------
const TwoPrices: React.FC<{t: number}> = ({t}) => {
  const {cue, word, line} = useTiming();
  const comma = cue(1, 'comma');
  const first = cue(1, '$1,499');
  const second = word('$1499', first + 0.3);
  const same = cue(1, 'same');
  const brain = cue(1, 'brain');
  const toScales = first - 0.2;
  const out = word('out', comma);
  const pop = p(t, out + 0.25, out + 0.75, EO);
  const drop = (at: number) => clamp(spr(t, at, {damping: 13, stiffness: 140, mass: 0.7}));
  const tilt = t < same ? -0.25 * drop(second) + 0.0 : t < brain ? 0 : -0.75 * p(t, brain, brain + 0.6, EO);
  const level = t > same && t < brain;
  const cam = camPath(t, [
    [0, {pos: [0, 1.5, 5.0], target: [0, 1.45, 0], fov: 36}],
    [toScales - 0.1, {pos: [0, 1.5, 4.9], target: [0, 1.45, 0], fov: 36}],
    [toScales + 0.9, {pos: [0, 1.7, 6.6], target: [0, 1.3, -0.2], fov: 38}],
    [line(3).end, {pos: [0, 1.65, 6.2], target: [0, 1.25, -0.2], fov: 38}],
  ], EIO);
  const blocksOut = p(t, toScales - 0.1, toScales + 0.4);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        {blocksOut < 1 && (
          <group position={[0, 1.25 + blocksOut * 1.2, 0]} scale={(1 - blocksOut * 0.6) * (1 - 0.12 * p(t, cue(1, 'cheaper'), cue(1, 'cheaper') + 0.4))}>
            <SyllableTrain items={COMMA_PRICE} pop={[0, 0, pop]} center size={0.24} hl={[2]} />
          </group>
        )}
        {t > toScales && (
          <Scales position={[0, 0, -0.2]} tilt={tilt}
            left={drop(first) > 0.02 ? <group position={[0, (1 - drop(first)) * 1.5, 0]}><PanTag text="$1,499" glow={t > brain ? 0 : 0} /></group> : null}
            right={drop(second) > 0.02 ? <group position={[0, (1 - drop(second)) * 1.5, 0]}><PanTag text="$1499" glow={level ? 0.3 : 0} /></group> : null} />
        )}
      </Stage>
      <BigText t={t} at={0.1} out={first - 0.1} text="No comma. Looks cheaper." highlight="cheaper" y={220} size={100} />
      {t > same - 0.1 && t < brain && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: "'Antonio', sans-serif", fontWeight: 600, fontSize: 220, color: C.ink, opacity: p(t, same - 0.1, same + 0.2)}}>=</div>
      )}
    </AbsoluteFill>
  );
};

// ---------- Shot 2: how it sounds in your head ----------
const InYourHead: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(2);
  const head = cue(2, 'head');
  const thousand = cue(2, 'thousand');
  const fourteen = cue(2, 'Fourteen');
  const bubble = clamp(spr(t, head));
  const cam = camPath(t, [[s.start, {pos: [0.15, 1.75, 6.2], target: [0.15, 1.55, 0], fov: 38}], [s.end, {pos: [0.2, 1.7, 5.8], target: [0.2, 1.55, 0], fov: 38}]]);
  const longK = p(t, thousand - 0.1, thousand + 1.0, EO);
  const shortX = lerp(3.0, 0, p(t, fourteen - 0.1, fourteen + 0.5, EO));
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Character who="you" t={t} position={[-0.75, 0, 0.3]} rotY={0.35} pose="think" mood="neutral" lookUp={0.2} />
        <Bubble3D position={[-0.35, 2.35, 0.3]} scale={bubble * 1.4} />
        {t > thousand - 0.1 && (
          <group position={[lerp(-0.2, 0.42, longK), lerp(2.35, 1.95, longK), 0.2]} scale={longK}>
            <SyllableTrain items={LONG.slice(0, 5)} center size={0.18} gap={0.03} />
            <group position={[0, -0.24, 0]}><SyllableTrain items={LONG.slice(5)} center size={0.18} gap={0.03} /></group>
          </group>
        )}
        {t > fourteen - 0.1 && <group position={[0.42 + shortX, 1.05, 0.3]}><SyllableTrain items={SHORT} center size={0.18} gap={0.03} hl={[0, 1, 2, 3, 4]} /></group>}
      </Stage>
      <Label t={t} at={thousand + 0.8} out={s.end} text="10 syllables" x={toScreen(cam, [0.42, 2.25, 0.2])[0]} y={toScreen(cam, [0.42, 2.25, 0.2])[1]} rise={10} />
      <Label t={t} at={fourteen + 0.5} out={s.end} text="5 syllables" x={toScreen(cam, [0.42, 1.3, 0.3])[0]} y={toScreen(cam, [0.42, 1.3, 0.3])[1]} rise={10} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Shot 3: longer sounds bigger ----------
const LongerIsBigger: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word} = useTiming();
  const s = shot(3);
  const coulter = word('Coulter', s.start);
  const bigger = cue(3, 'bigger');
  const comma = cue(3, 'comma');
  const cents = cue(3, 'cents');
  const tilt = -0.45 * p(t, bigger - 0.1, bigger + 0.5, EO) - 0.25 * p(t, comma, comma + 0.4, EO) - 0.25 * p(t, cents, cents + 0.4, EO);
  const land = (at: number) => clamp(spr(t, at, {damping: 12, stiffness: 150, mass: 0.6}));
  const cam = camPath(t, [[s.start, {pos: [-0.3, 1.75, 6.4], target: [-0.1, 1.25, -0.2], fov: 38}], [s.end, {pos: [-0.25, 1.7, 6.0], target: [-0.1, 1.25, -0.2], fov: 38}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Scales position={[0.25, 0, -0.2]} tilt={tilt}
          left={<group>
            <PanTag text="$1,499" />
            {land(comma) > 0.02 && <group position={[-0.2, 0.45 + (1 - land(comma)) * 1.2, 0.1]}><SyllableTrain items={[',']} size={0.17} hl={[0]} /></group>}
            {land(cents) > 0.02 && <group position={[0.02, 0.45 + (1 - land(cents)) * 1.2, 0.1]}><SyllableTrain items={['.00']} size={0.17} hl={[0]} /></group>}
          </group>}
          right={<PanTag text="$1499" glow={0.25} />} />
        <Character who="professor" t={t} position={[-1.35, 0, 0.35]} rotY={0.5} pose={t > bigger - 0.2 && t < bigger + 1.5 ? 'point' : 'present'} mood="happy" />
      </Stage>
      <StudyCard t={t} at={coulter} out={s.end} year={2012} who="Keith Coulter, Pilsik Choi & Kent Monroe" finding="The longer a price sounds, the bigger it feels" y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 4: three menus (Cornell) ----------
const MENUS = [
  {name: 'PASTA', price: '$18.00', coins: 12},
  {name: 'PASTA', price: 'eighteen dollars', coins: 13},
  {name: 'PASTA', price: '18', coins: 13},
];
const MENU_Z = [-0.85, -0.3, 0.25];
const MenuCard: React.FC<{name: string; price: string; position: [number, number, number]; glow?: number; drain?: number}> = ({name, price, position, glow = 0, drain = 0}) => {
  const tex = useCanvas(`menu:${name}:${price}`, (ctx, w, h) => {
    ctx.fillStyle = '#1F2023';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${h * 0.3}px "Antonio", sans-serif`;
    ctx.fillText(name, w * 0.07, h * 0.5);
    ctx.textAlign = 'right';
    ctx.font = `600 ${price.length > 8 ? h * 0.2 : h * 0.3}px "Inter", sans-serif`;
    ctx.fillText(price, w * 0.93, h * 0.52);
  }, 512, 200);
  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[0.62, 0.24, 0.008]} />
        <meshStandardMaterial color={glow > 0 ? '#FFF6CC' : drain > 0 ? '#E3E4E7' : '#FFFFFF'} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[0.6, 0.23]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
    </group>
  );
};
const ThreeMenus: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word} = useTiming();
  const s = shot(4);
  const cornell = word('Cornell', s.start);
  const menu = cue(4, 'menu');
  const numbers = cue(4, 'numbers');
  const eight = cue(4, 'eight');
  const reminds = cue(4, 'reminds');
  const cam = camPath(t, [[s.start, {pos: [0.12, 3.55, 0.75], target: [0.12, 0.92, -0.32], fov: 40}], [s.end, {pos: [0.12, 3.4, 0.65], target: [0.12, 0.92, -0.32], fov: 40}]]);
  const stack = p(t, eight - 0.5, eight + 0.4, EO);
  const plain = toScreen(cam, [-0.08, 0.95, MENU_Z[2] - 0.1]);
  const dollar = toScreen(cam, [-0.08, 0.95, MENU_Z[0] - 0.1]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0.1, 0, -0.35]} length={1.4} depth={1.7} />
        {MENUS.map((m, i) => {
          const slide = p(t, menu - 0.3 + i * 0.25, menu + 0.2 + i * 0.25, EO);
          if (slide <= 0) return null;
          return (
            <group key={i}>
              <MenuCard name={m.name} price={m.price} position={[lerp(-1.0, -0.08, slide), 0.927, MENU_Z[i]]} glow={i === 2 ? p(t, numbers, numbers + 0.4) : 0} drain={i === 0 ? p(t, reminds, reminds + 0.4) : 0} />
              <Coins position={[0.42, 0.92, MENU_Z[i]]} n={m.coins * stack} />
            </group>
          );
        })}
      </Stage>
      <StudyCard t={t} at={cornell} out={menu + 2.4} year={2009} who="Yang, Kimes & Sessarego (Cornell)" finding="Same menu, three price styles. Numbers only: diners spent about 8% more than with dollar signs" y={230} />
      <Label t={t} at={eight + 0.3} out={s.end} text="about +8%" x={plain[0]} y={plain[1]} rise={90} color={C.gold} />
      <Label t={t} at={reminds} out={s.end} text="$ = paying" x={dollar[0]} y={dollar[1]} rise={90} color={C.coldLight} />
    </AbsoluteFill>
  );
};

// ---------- Shot 5: write it short (screenshot moment) ----------
const Short: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s = shot(5);
  const short = cue(5, 'short');
  const noComma = word('comma', line(17).start - 0.05);
  const cents = cue(5, 'cents');
  const dollar = cue(5, 'dollar');
  const items = ['$', '1', ',', '4', '9', '9', '.', '0', '0'];
  const pop = [p(t, dollar, dollar + 0.45), 0, p(t, noComma, noComma + 0.45), 0, 0, 0, p(t, cents, cents + 0.45), p(t, cents + 0.05, cents + 0.5), p(t, cents + 0.1, cents + 0.55)];
  const done = p(t, dollar + 0.3, dollar + 0.9);
  const screen = useCanvas(`scr:${pop.map((k) => (k >= 0.5 ? 1 : 0)).join('')}`, (ctx, w, h) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#E6E5E1';
    ctx.fillRect(0, 0, w, h * 0.16);
    ctx.fillStyle = '#1F2023';
    ctx.font = `600 ${h * 0.34}px "Antonio", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(items.filter((_, i) => pop[i] < 0.5).join(''), w / 2, h * 0.58);
  });
  const cam = camPath(t, [[s.start, {pos: [0.35, 1.45, 1.55], target: [0.1, 1.12, -0.35], fov: 38}], [s.end, {pos: [0.3, 1.5, 1.45], target: [0.1, 1.2, -0.35], fov: 38}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={done * 0.25}>
        <Floor />
        <StoreTable position={[0, 0, -0.3]} length={1.6} depth={0.8} />
        <Laptop position={[0.1, 0.92, -0.35]} openDeg={105} screen={screen} />
        <Character who="you" t={t} position={[-1.05, 0, 0.5]} rotY={2.3} pose="talk" mood={done > 0.5 ? 'excited' : 'happy'} />
        {done > 0.01 && <PriceTag text="1499" position={[0.1, 1.55 + done * 0.15, -0.3]} string={0.12} scale={0.55 * done} glow={done} />}
      </Stage>
      <XCheck t={t} at={s.start + 0.05} out={dollar + 0.2} wrong="$1,499.00" right="1499" rightAt={short} y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 6: Jay's tax form ----------
const Jay: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const tax = cue(6, 'tax');
  const unroll = p(t, s.start + 0.2, tax + 0.6, (k) => k);
  const cam: Cam = {pos: [1.6, 1.9, 4.2], target: [0.1, 0.9, 0.4], fov: 40};
  const head = toScreen(cam, [-0.3, 1.95, -1.3]);
  const len = 0.2 + unroll * 2.6;
  const lines = ['$1,499.00', '$2,249.99', '$999.00', '$1,749.50', '$3,000.00', '$1,250.00', '$849.99', '$2,999.00'];
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.55]} length={1.8} depth={0.75} />
        <Character who="friend" t={t} position={[-0.3, 0, -1.3]} rotY={0.25} pose="present" mood="happy" seed={7} />
        {/* the price list: over the table edge, then across the floor */}
        <TextCard lines={['PRICES', ...lines.slice(0, 4)]} position={[0.35, 0.93, -0.5]} size={[0.38, 0.5]} />
        <TextCard lines={['', ...lines, ...lines]} position={[0.35, 0.002, -0.15 + len / 2]} size={[0.36, len]} rotation={[-Math.PI / 2, 0, 0]} />
      </Stage>
      <Label t={t} at={cue(6, 'friend') ?? s.start + 0.5} text="Jay" x={head[0]} y={head[1]} rise={100} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue, word, line} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="pop" at={cue(1, 'comma') + 0.2} volume={0.1} />
      <Sfx name="tick" at={cue(1, 'brain')} volume={0.1} />
      <Sfx name="whoosh" at={cue(2, 'thousand')} volume={0.07} />
      <Sfx name="tick" at={cue(3, 'comma')} volume={0.08} />
      <Sfx name="tick" at={cue(3, 'cents')} volume={0.08} />
      <Sfx name="pop" at={word('comma', line(17).start - 0.05)} volume={0.08} />
      <Sfx name="pop" at={cue(5, 'cents')} volume={0.08} />
      <Sfx name="ding" at={cue(5, 'dollar') + 0.3} volume={0.09} />
    </>
  );
};

const Edit: React.FC = () => {
  const t = useT();
  const {words, line, cue, timing: tm} = useTiming();
  return (
    <AbsoluteFill style={{background: C.base}}>
      <Timeline
        shots={[
          {id: 1, render: (tt) => <TwoPrices t={tt} />},
          {id: 2, enter: 'fade', render: (tt) => <InYourHead t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <LongerIsBigger t={tt} />},
          {id: 4, enter: 'push', render: (tt) => <ThreeMenus t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <Short t={tt} />},
          {id: 6, enter: 'cut', render: (tt) => <Jay t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, cue(1, '$1,499') - 0.1]]} />
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
