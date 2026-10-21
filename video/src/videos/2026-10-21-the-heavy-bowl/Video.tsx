// "The heavy bowl" (scripts/2026-10-21-the-heavy-bowl.md).
// Metaphor: a little weight gauge floats over whatever someone holds. Heavier containers push the needle up,
// and the price people expect rises with it, though nothing inside changed. Times come from the narration.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Gauge, Label, StudyCard, ToolCard, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {FlimsyBag, GiftBox, Jar, PriceTag, Spoon, StoreTable, YogurtBowl} from '../../kit/three/brand';
import {clamp, EIO, EO, lerp, p, spr} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-heavy-bowl';
type V3 = [number, number, number];
const TOP = 0.92;
const BOWLS = [-0.5, 0, 0.5];

// ---------- Shot 1: same yogurt, heavier bowl ----------
const SameYogurt: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const heavier = cue(1, 'Heavier');
  const better = cue(1, 'better');
  const lift = p(t, heavier - 0.2, heavier + 0.4, EO);
  const cam = camPath(t, [[0, {pos: [0, 1.75, 2.9], target: [0, 1.32, 0], fov: 38}], [s.end, {pos: [0, 1.7, 2.6], target: [0, 1.32, 0], fov: 38}]]);
  const mid = toScreen(cam, [0, TOP + 0.35 + lift * 0.18, 0]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.1]} length={1.8} depth={0.8} />
        {BOWLS.map((x, i) => <YogurtBowl key={i} position={[x, TOP + (i === 1 ? lift * 0.18 - lift * 0.03 * Math.sin(t * 3) : 0), 0]} scale={1.4} />)}
      </Stage>
      <BigText t={t} at={0.16} text="Same yogurt. Heavier bowl." highlight="Heavier" y={210} size={100} />
      <Gauge t={t} at={heavier} x={mid[0]} y={mid[1]} value={lerp(0.2, 0.9, lift)} label="weight" />
      <Label t={t} at={better} text="★ tastes better" x={mid[0]} y={mid[1] + 300} rise={0} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Shots 2 and 3: the Oxford test, then the result ----------
const TASTERS = [
  {who: 'stranger_a' as const, x: -0.62, w: 0.2, seed: 3},
  {who: 'stranger_b' as const, x: 0, w: 0.55, seed: 9},
  {who: 'stranger_c' as const, x: 0.62, w: 0.92, seed: 5},
];
const Test: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s2 = shot(2), s3 = shot(3);
  const year = word('2011', s2.start);
  const fifty = cue(2, 'fifty');
  const three = cue(2, 'three');
  const identical = cue(2, 'identical');
  const weight = cue(2, 'weight');
  const inS3 = t >= s3.start;
  const heaviest = cue(3, 'heaviest');
  const expensive = cue(3, 'expensive');
  const shortcut = cue(3, 'shortcut');
  const quality = cue(3, 'quality');
  const arrive = p(t, fifty - 0.4, fifty + 0.4, EO);
  const bowlsIn = p(t, three - 0.2, three + 0.4, EO);
  const lift = inS3 ? p(t, heaviest - 0.2, heaviest + 0.4, EO) : 0;
  const glow = p(t, quality - 0.1, quality + 0.5);
  const cam = camPath(t, [
    [s2.start, {pos: [0, 1.8, 4.8], target: [0, 1.25, -0.4], fov: 38}],
    [s3.start, {pos: [0, 1.75, 4.4], target: [0, 1.25, -0.4], fov: 38}],
    [heaviest + 0.4, {pos: [0.45, 1.6, 3.6], target: [0.45, 1.25, -0.4], fov: 38}],
    [line(10).end, {pos: [0.45, 1.6, 3.4], target: [0.45, 1.25, -0.4], fov: 38}],
  ], EIO);
  const words = [word('denser', s3.start), word('nicer', s3.start), expensive];
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={glow * 0.2}>
        <Floor />
        <StoreTable position={[0, 0, -0.35]} length={2.2} depth={0.75} />
        {TASTERS.map((tt, i) => {
          const isHeavy = i === 2;
          const hold = isHeavy ? lift : 0;
          return (
            <group key={i}>
              <Character who={tt.who} t={t} position={[tt.x + (1 - arrive) * 2.6, 0, -1.2]} rotY={0} pose={hold > 0.2 ? 'cards' : 'idle'} seed={tt.seed}
                mood={inS3 ? (isHeavy ? (t > expensive ? 'excited' : 'happy') : i === 0 ? 'neutral' : 'happy') : 'neutral'} glow={isHeavy ? glow * 0.5 : 0} />
              {bowlsIn > 0 && <YogurtBowl position={[tt.x, TOP + hold * 0.1, lerp(0.6, -0.25, bowlsIn) - hold * 0.12]} scale={1.2} glow={isHeavy ? glow : 0} />}
            </group>
          );
        })}
      </Stage>
      {!inS3 && <StudyCard t={t} at={year} out={s2.end} year={2011} who="Piqueras-Fiszman, Harrar, Alcaide & Spence (Oxford)" finding="Same yogurt, three bowls that looked identical. Only the weight differed" y={230} />}
      {!inS3 &&
        TASTERS.map((tt, i) => {
          const pt = toScreen(cam, [tt.x, TOP + 0.3, -0.25]);
          return <Gauge key={i} t={t} at={weight + i * 0.12} x={pt[0]} y={pt[1]} value={tt.w} size={120} />;
        })}
      <Label t={t} at={identical} out={weight - 0.1} text="identical bowls" x={toScreen(cam, [0, TOP + 0.3, -0.25])[0]} y={toScreen(cam, [0, TOP + 0.3, -0.25])[1]} rise={20} />
      {inS3 && <ToolCard t={t} at={words[0] - 0.1} out={shortcut - 0.1} title="Heaviest bowl" items={['Denser', 'Nicer', 'More expensive']} itemsAt={words} lit={t > expensive ? 2 : -1} y={230} />}
      {inS3 && <Label t={t} at={shortcut} out={s3.end} text="heavy = quality" x={toScreen(cam, [0.62, 2.0, -1.2])[0]} y={toScreen(cam, [0.62, 2.0, -1.2])[1]} rise={70} color={C.gold} />}
    </AbsoluteFill>
  );
};

// ---------- Shot 4: the spoon twist, then what holds the product ----------
const Spoons: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line, word} = useTiming();
  const s = shot(4);
  const two = word('Two', s.start);
  const spoons = cue(4, 'spoons');
  const cheaper = cue(4, 'cheaper');
  const bottle = cue(4, 'bottle');
  const holds = line(15).start;
  if (t >= holds) {
    const cam: Cam = {pos: [0, 1.55, 3.5], target: [0, 1.05, -0.1], fov: 38};
    const items: {x: number; at: number}[] = [{x: -0.45, at: holds + 0.3}, {x: 0, at: bottle}, {x: 0.45, at: word('box', bottle)}];
    return (
      <AbsoluteFill>
        <Stage t={t} cam={cam} backdrop="warm">
          <Floor />
          <StoreTable position={[0, 0, -0.1]} length={1.8} depth={0.8} />
          <YogurtBowl position={[-0.45, TOP, 0]} scale={1.3} />
          {t > bottle - 0.2 && <Jar position={[0, TOP, 0]} scale={1.3} />}
          {t > items[2].at - 0.2 && <GiftBox position={[0.45, TOP, 0]} scale={1.1} />}
        </Stage>
        {items.map((it, i) => {
          const pt = toScreen(cam, [it.x, TOP + 0.38, 0]);
          return <Gauge key={i} t={t} at={it.at} x={pt[0]} y={pt[1]} value={0.85} size={120} />;
        })}
      </AbsoluteFill>
    );
  }
  const cam = camPath(t, [[s.start, {pos: [0, 1.65, 3.4], target: [0, 1.1, -0.1], fov: 38}], [holds, {pos: [0, 1.6, 3.1], target: [0, 1.1, -0.1], fov: 38}]]);
  const lay = p(t, spoons - 0.3, spoons + 0.3, EO);
  const shrink = p(t, cheaper - 0.1, cheaper + 0.5, EO);
  const light = toScreen(cam, [-0.33, TOP + 0.3, 0]);
  const heavy = toScreen(cam, [0.33, TOP + 0.3, 0]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.1]} length={1.8} depth={0.8} />
        <YogurtBowl position={[-0.33, TOP, 0]} scale={1.3} />
        <YogurtBowl position={[0.33, TOP, 0]} scale={1.3} drain={shrink * 0.5} />
        <Spoon position={[-0.24, TOP + 0.16 + (1 - lay) * 0.5, 0.05]} rotation={[0, 0, -0.35]} scale={1.8} />
        <Spoon position={[0.43, TOP + 0.16 + (1 - lay) * 0.5, 0.05]} rotation={[0, 0, -0.35]} heavy scale={1.8} />
        <PriceTag text="$$$" position={[-0.33, 1.75, -0.05]} scale={0.8} glow={0.4} />
        <PriceTag text="$$$" back="$" position={[0.33, 1.75, -0.05]} scale={lerp(0.8, 0.6, shrink)} flip={shrink} drain={shrink * 0.8} />
      </Stage>
      <StudyCard t={t} at={two} out={cheaper - 0.2} year={2013} who="Harrar & Spence (Oxford)" finding="The same yogurt from a heavier spoon seemed less dense and cheaper" y={230} />
      <Gauge t={t} at={spoons} x={light[0]} y={light[1] + 250} value={0.2} label="light spoon" size={120} />
      <Gauge t={t} at={spoons + 0.15} x={heavy[0]} y={heavy[1] + 250} value={0.9} label="heavy spoon" size={120} />
    </AbsoluteFill>
  );
};

// ---------- Shot 5: put the weight where they hold it (screenshot moment) ----------
const PutWeight: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(5);
  const hold = cue(5, 'hold');
  const glass = cue(5, 'glass');
  const heft = cue(5, 'heft');
  const swap = p(t, s.start + 0.6, s.start + 1.4, EIO);
  const lift = p(t, hold - 0.3, hold + 0.3, EO);
  const glow = p(t, heft - 0.1, heft + 0.5);
  const cam = camPath(t, [[s.start, {pos: [0.1, 1.6, 3.6], target: [0.15, 1.25, -0.3], fov: 38}], [s.end, {pos: [0.1, 1.55, 3.2], target: [0.15, 1.25, -0.3], fov: 38}]]);
  const jar: V3 = [lerp(0.25, 0.48, lift), TOP + lift * 0.25, lerp(-0.35, -0.08, lift)];
  const jarPt = toScreen(cam, [jar[0], jar[1] + 0.38, jar[2]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={glow * 0.2}>
        <Floor />
        <StoreTable position={[0, 0, -0.45]} length={1.8} depth={0.8} />
        <Character who="you" t={t} position={[-0.45, 0, -1.25]} rotY={0.2} pose={swap > 0 && swap < 1 ? 'point' : 'idle'} mood="happy" />
        {swap < 1 && <FlimsyBag position={[0.25 + swap * 0.8, TOP, -0.35]} scale={1.3 * (1 - swap)} />}
        {swap > 0 && <Jar position={jar} scale={1.25 * swap} />}
        {swap > 0 && <GiftBox position={[-0.25, TOP, -0.4]} scale={1.05 * swap} rotY={0.3} />}
        <Character who="stranger_a" t={t} position={[0.72, 0, 0.45]} rotY={Math.PI + 0.45} pose={lift > 0.3 ? 'hold' : 'idle'} mood={lift > 0.5 ? 'excited' : 'happy'} seed={3} />
        {t > glass && <PriceTag text="PREMIUM" position={[0.15, 2.15, -0.45]} scale={lerp(0.8, 1.05, glow)} glow={glow} swing={0.03 * Math.sin(t * 1.6)} />}
      </Stage>
      <XCheck t={t} at={s.start + 0.05} out={glass} wrong="Light, cheap packaging" right="Weight where they hold it" y={230} />
      <Gauge t={t} at={hold} x={jarPt[0]} y={jarPt[1]} value={lerp(0.3, 0.9, lift)} size={120} />
    </AbsoluteFill>
  );
};

// ---------- Shot 6: Jay's flimsy bag ----------
const Jay: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const flimsy = cue(6, 'flimsy');
  const give = p(t, s.start + 0.3, flimsy - 0.2, EIO);
  const sag = p(t, flimsy - 0.2, flimsy + 0.4, EO);
  const cam: Cam = {pos: [0.25, 1.6, 3.6], target: [0.15, 1.25, -0.3], fov: 38};
  const head = toScreen(cam, [-0.45, 1.95, -1.25]);
  const bag: V3 = [lerp(-0.1, 0.5, give), TOP + give * 0.12 - sag * 0.05, lerp(-0.45, -0.08, give)];
  const bagPt = toScreen(cam, [bag[0], bag[1] + 0.4, bag[2]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.45]} length={1.8} depth={0.8} />
        <Character who="friend" t={t} position={[-0.45, 0, -1.25]} rotY={0.25} pose={give < 1 ? 'point' : 'idle'} mood="happy" seed={7} />
        <FlimsyBag position={bag} scale={1.3} sag={sag} />
        <Character who="stranger_b" t={t} position={[0.8, 0, 0.45]} rotY={Math.PI + 0.45} pose={give > 0.8 ? 'hold' : 'idle'} mood={sag > 0.5 ? 'neutral' : 'happy'} seed={9} />
      </Stage>
      <Label t={t} at={cue(6, 'friend') ?? s.start + 0.6} text="Jay" x={head[0]} y={head[1]} rise={100} color={C.gold} />
      <Gauge t={t} at={flimsy} x={bagPt[0]} y={bagPt[1]} value={0.08 + 0.03 * Math.sin(t * 8)} size={120} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="tick" at={cue(1, 'Heavier')} volume={0.08} />
      <Sfx name="pop" at={cue(3, 'expensive')} volume={0.08} />
      <Sfx name="click" at={cue(4, 'spoons')} volume={0.1} />
      <Sfx name="click" at={cue(5, 'glass')} volume={0.1} />
      <Sfx name="thud" at={cue(5, 'heft')} volume={0.12} />
      <Sfx name="ding" at={cue(5, 'heft') + 0.25} volume={0.07} />
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
          {id: 1, render: (tt) => <SameYogurt t={tt} />},
          {id: 2, enter: 'fade', render: (tt) => <Test t={tt} />},
          {id: 3, render: (tt) => <Test t={tt} />},
          {id: 4, enter: 'push', render: (tt) => <Spoons t={tt} />},
          {id: 5, enter: 'fade', render: (tt) => <PutWeight t={tt} />},
          {id: 6, enter: 'cut', render: (tt) => <Jay t={tt} />},
        ]}
      />
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
export const _unused = {clamp, spr};
