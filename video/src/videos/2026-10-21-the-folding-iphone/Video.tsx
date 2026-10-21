// "The folding iPhone" (scripts/2026-10-21-the-folding-iphone.md).
// Metaphor: every price is read off a giant ruler. The first big number hammers itself in at the top, and
// everything after it is measured from there. Every time comes from the narration (cue / word / line / shot).
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, QuoteBubble, Shake, StudyCard, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {Phone} from '../../kit/three/sets';
import {FoldingPhone, Laptop, Plinth, PriceTag, PrizeWheel, Ruler, SpotCone, StoreTable, usePage, wheelAngleFor} from '../../kit/three/brand';
import {clamp, EIO, EO, lerp, p, spr} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-folding-iphone';
type V3 = [number, number, number];
const drop = (t: number, at: number) => clamp(spr(t, at, {damping: 12, stiffness: 130, mass: 0.7}));

/** A normal phone standing on a small plinth. */
const ProOnPlinth: React.FC<{x: number; z?: number; drain?: number; h?: number}> = ({x, z = 0, drain = 0, h = 0.75}) => (
  <group>
    <Plinth position={[x, 0, z]} height={h} r={0.3} drain={drain} />
    <Phone position={[x, h + 0.32, z]} scale={2.6} drain={drain} />
  </group>
);

// ---------- Shot 1: not there to sell ----------
const NotForSale: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const folding = cue(1, 'folding');
  const cheap = cue(1, 'cheap');
  const cam = camPath(t, [[0, {pos: [0.3, 1.25, 4.6], target: [0.2, 1.45, 0], fov: 38}], [s.end, {pos: [0.5, 1.2, 4.2], target: [0.25, 1.5, 0], fov: 38}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Plinth position={[-0.2, 0, 0]} height={0.95} r={0.42} />
        <FoldingPhone position={[-0.2, 1.3, 0]} open={p(t, folding - 0.1, folding + 0.7, EIO)} scale={1.6} />
        <ProOnPlinth x={0.85} z={0.25} />
        <Ruler position={[-0.6, 0, -0.62]} height={3.0} rise={p(t, cheap - 0.3, cheap + 0.5, EO)} />
      </Stage>
      <BigText t={t} at={0.16} text="Apple's folding iPhone isn't there to sell" highlight="sell" y={210} size={92} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: the lineup ----------
const FOLD_X = 0;
const PRO_X = 1.55, MAX_X = 2.75;
const Lineup: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(2);
  const duo = cue(2, 'Duo');
  const event = cue(2, 'event');
  const hundred = cue(2, 'hundred');
  const spot = cue(2, 'spotlight');
  const fade = p(t, spot - 0.3, spot + 0.6);
  const cam = camPath(t, [
    [s.start, {pos: [0.2, 1.5, 4.3], target: [0.1, 1.45, 0], fov: 38}],
    [event - 0.3, {pos: [0.3, 1.5, 4.1], target: [0.15, 1.45, 0], fov: 38}],
    [event + 1.0, {pos: [2.3, 1.5, 4.4], target: [2.15, 1.4, -0.3], fov: 38}],
    [spot - 0.5, {pos: [2.3, 1.5, 4.2], target: [2.15, 1.4, -0.3], fov: 38}],
    [spot + 0.5, {pos: [1.0, 1.7, 5.6], target: [1.1, 1.35, -0.2], fov: 40}],
    [s.end, {pos: [0.9, 1.65, 5.3], target: [1.0, 1.35, -0.2], fov: 40}],
  ], EIO);
  const flipK = p(t, hundred - 0.2, hundred + 0.3, EIO);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" drain={0}>
        <Floor />
        <SpotCone position={[FOLD_X, 0, 0]} r={0.75} k={p(t, duo - 0.2, duo + 0.4) * (1 + fade * 0.4)} />
        <Plinth position={[FOLD_X, 0, 0]} height={0.95} r={0.42} />
        <FoldingPhone position={[FOLD_X, 1.3, 0]} open={1} scale={1.6} />
        {t > duo - 0.2 && <PriceTag sub="iPHONE DUO" text="$1,999" position={[FOLD_X + 0.55, lerp(3.6, 2.45, drop(t, duo - 0.2)), 0.35]} scale={1.0 + 0.15 * Math.sin(Math.PI * p(t, line(4).start, line(4).start + 0.5, (k) => k))} glow={fade} swing={0.04 * Math.sin(t * 1.6)} />}
        <ProOnPlinth x={PRO_X} z={-0.3} drain={fade * 0.7} />
        <ProOnPlinth x={MAX_X} z={-0.45} drain={fade * 0.7} h={0.85} />
        {t > event - 0.3 && <PriceTag sub="iPHONE 18 PRO" text="$1,099" back="$1,199" position={[PRO_X, lerp(3.4, 2.15, drop(t, event - 0.3)), 0.05]} flip={flipK} scale={0.85} drain={fade * 0.6} swing={0.03 * Math.sin(t * 1.4)} />}
        {t > event - 0.1 && <PriceTag sub="iPHONE 18 PRO MAX" text="$1,199" back="$1,299" position={[MAX_X, lerp(3.4, 2.25, drop(t, event - 0.1)), -0.1]} flip={flipK} scale={0.85} drain={fade * 0.6} swing={0.03 * Math.sin(t * 1.5 + 1)} />}
      </Stage>
      <Label t={t} at={hundred + 0.3} out={spot} text="+$100 each" x={toScreen(cam, [(PRO_X + MAX_X) / 2, 2.55, -0.2])[0]} y={toScreen(cam, [(PRO_X + MAX_X) / 2, 2.55, -0.2])[1] + 120} rise={0} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Shot 3: the ruler ----------
const TheRuler: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(3);
  const anchoring = cue(3, 'anchoring');
  const ruler = cue(3, 'ruler');
  const hit = anchoring + 0.35;
  const cam = camPath(t, [[s.start, {pos: [0.9, 1.5, 5.2], target: [0.1, 1.6, 0], fov: 40}], [s.end, {pos: [0.8, 1.45, 4.8], target: [0.1, 1.65, 0], fov: 40}]]);
  const tagY = lerp(5, 3.25, p(t, anchoring - 0.1, hit, (k) => k * k));
  return (
    <AbsoluteFill>
      <Shake t={t} hits={[hit]} amp={9}>
        <Stage t={t} cam={cam} backdrop="warm">
          <Floor />
          <Ruler position={[0, 0, -0.4]} height={3.0} lit={p(t, ruler - 0.2, ruler + 1.0)} />
          {t > anchoring - 0.1 && <PriceTag text="$1,999" position={[0.28, tagY, -0.32]} string={0.15} scale={1.0} glow={1} />}
          <Character who="you" t={t} position={[0.7, 0, 0.95]} rotY={-0.55} pose="idle" lookUp={0.35} mood={t > hit ? 'shock' : 'neutral'} />
        </Stage>
      </Shake>
    </AbsoluteFill>
  );
};

// ---------- Shot 4: the wheel, then back to the phone ----------
const WHEEL: V3 = [0, 0, -0.4];
const Wheel: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line, word} = useTiming();
  const s = shot(4);
  const year = word('1974', s.start);
  const wheelW = cue(4, 'wheel');
  const sixtyFive = cue(4, '65');
  const africa = cue(4, 'Africa');
  const g25 = cue(4, '25');
  const g45 = cue(4, '45');
  const back = line(14).start;
  if (t >= back) {
    // a $1,999 phone moves your answer too
    const cam: Cam = {pos: [0.6, 1.55, 4.6], target: [0.15, 1.6, 0], fov: 40};
    const hit = back + 0.5;
    return (
      <AbsoluteFill>
        <Stage t={t} cam={cam} backdrop="warm">
          <Floor />
          <Ruler position={[-0.55, 0, -0.5]} height={3.0} lit={p(t, hit, hit + 1)} />
          <Plinth position={[0.35, 0, 0]} height={0.95} r={0.42} />
          <FoldingPhone position={[0.35, 1.3, 0]} open={1} scale={1.6} />
          <PriceTag text="$1,999" position={[-0.27, lerp(5, 3.25, p(t, back, hit, (k) => k * k)), -0.42]} string={0.15} scale={0.9} glow={1} />
          <PriceTag text="$1,299" position={[-0.27, 1.8, -0.42]} string={0.1} scale={0.8} glow={p(t, hit + 0.8, hit + 1.4) * 0.5} />
        </Stage>
      </AbsoluteFill>
    );
  }
  // spin to 10, then again to 65
  const ten = word('10', wheelW);
  const a10 = wheelAngleFor(10) + Math.PI * 2 * 3;
  const a65 = wheelAngleFor(65) + Math.PI * 2 * 5;
  const k1 = p(t, wheelW - 0.3, ten + 0.05, EO);
  const k2 = p(t, ten + 0.35, sixtyFive + 0.1, EO);
  const angle = t < ten + 0.35 ? lerp(0, a10, k1) : lerp(a10, a65, k2);
  const cam = camPath(t, [[s.start, {pos: [0, 2.7, 6.9], target: [0, 1.15, -0.3], fov: 40}], [back, {pos: [0, 2.6, 6.4], target: [0, 1.1, -0.3], fov: 40}]]);
  const left: V3 = [-0.48, 0, 1.0];
  const right: V3 = [0.48, 0, 1.0];
  const l = toScreen(cam, [left[0], 1.95, left[2]]);
  const r = toScreen(cam, [right[0], 1.95, right[2]]);
  const prof = toScreen(cam, [-1.2, 1.95, -0.35]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <PrizeWheel position={WHEEL} angle={angle} />
        <Character who="professor" t={t} position={[-1.2, 0, -0.35]} rotY={0.55} pose={t > wheelW - 0.3 && t < wheelW + 0.3 ? 'point' : 'present'} mood="happy" />
        <Character who="stranger_a" t={t} position={left} rotY={0.35} pose={t > g25 - 0.2 ? 'hold' : 'idle'} mood={t > g25 ? 'happy' : 'neutral'} seed={3}
          rightHand={t > g25 - 0.2 ? <PriceTag text="25%" position={[0, 0.25, 0.08]} string={0.001} scale={0.6} /> : undefined} />
        <Character who="stranger_b" t={t} position={right} rotY={-0.35} pose={t > g45 - 0.2 ? 'hold' : 'idle'} mood={t > g45 ? 'excited' : 'neutral'} seed={9}
          rightHand={t > g45 - 0.2 ? <PriceTag text="45%" position={[0, 0.25, 0.08]} string={0.001} scale={0.6} glow={0.6} /> : undefined} />
      </Stage>
      <StudyCard t={t} at={year} out={wheelW - 0.1} year={1974} who="Amos Tversky & Daniel Kahneman" finding="A wheel rigged to land on 10 or 65 moved people's median guesses from 25% to 45%" y={230} />
      <Label t={t} at={ten + 0.1} out={back} text="Saw 10" x={l[0]} y={l[1]} rise={70} />
      <Label t={t} at={sixtyFive + 0.2} out={back} text="Saw 65" x={r[0]} y={r[1]} rise={70} color={C.gold} />
      <QuoteBubble t={t} at={africa - 1.6} out={g25 - 0.3} speaker="professor" text="What share of UN countries are in Africa?" x={prof[0] + 120} y={prof[1] - 60} side="left" width={560} />
    </AbsoluteFill>
  );
};

// ---------- Shot 5: somewhere to hide ----------
const Hide: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(5);
  const second = cue(5, 'second');
  const hide = cue(5, 'hide');
  const cam = camPath(t, [[s.start, {pos: [0.2, 1.5, 4.4], target: [0.1, 1.45, 0], fov: 38}], [second + 0.3, {pos: [0.9, 1.5, 4.3], target: [0.7, 1.4, -0.3], fov: 38}], [s.end, {pos: [0.9, 1.45, 4.0], target: [0.6, 1.4, -0.3], fov: 38}]], EIO);
  const duck = p(t, hide - 0.4, hide + 0.3, EIO);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <SpotCone position={[0, 0, 0]} r={0.75} k={1.3} />
        <Plinth position={[0, 0, 0]} height={0.95} r={0.42} />
        <FoldingPhone position={[0, 1.3, 0]} open={1} scale={1.6} />
        <ProOnPlinth x={1.3} z={-0.8} drain={0.7} />
        <PriceTag sub="iPHONE 18 PRO" text="$1,199" position={[lerp(1.3, 0.15, duck), lerp(2.25, 1.85, duck), lerp(-0.6, -0.55, duck)]} scale={0.8} drain={0.6} swing={0.03 * Math.sin(t * 1.4)} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 6: premium first (screenshot moment) ----------
const PremiumFirst: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const premium = cue(6, 'premium');
  const reasonable = cue(6, 'reasonable');
  const glow = p(t, reasonable - 0.2, reasonable + 0.5);
  const cam = camPath(t, [[s.start, {pos: [0.25, 1.65, 5.6], target: [0.2, 1.6, -0.5], fov: 38}], [s.end, {pos: [0.25, 1.62, 5.0], target: [0.2, 1.62, -0.5], fov: 38}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={glow * 0.2}>
        <Floor />
        <StoreTable position={[0.1, 0, -0.75]} length={2.4} depth={0.8} />
        <Ruler position={[-0.95, 0, -1.3]} height={3.0} rise={p(t, premium - 0.2, premium + 0.5, EO)} lit={p(t, premium + 0.3, premium + 1.2)} />
        <Character who="you" t={t} position={[-0.25, 0, -1.6]} rotY={0.2} pose={t < premium + 0.5 ? 'point' : 'present'} mood="happy" />
        {t > premium - 0.3 && <PriceTag sub="PREMIUM" text="$2,000" position={[-0.05, lerp(3.8, 2.7, drop(t, premium - 0.3)), -0.45]} scale={1.05} swing={0.03 * Math.sin(t * 1.5)} />}
        {t > premium + 0.5 && <PriceTag sub="STANDARD" text="$600" position={[0.75, lerp(3.4, 2.2, drop(t, premium + 0.5)), -0.45]} scale={1.05} glow={glow} swing={0.03 * Math.sin(t * 1.7)} />}
        <Character who="stranger_a" t={t} position={[1.3, 0, 0.1]} rotY={Math.PI + 0.6} pose={glow > 0.4 ? 'point' : 'idle'} mood={glow > 0.4 ? 'happy' : 'neutral'} seed={3} />
      </Stage>
      <XCheck t={t} at={s.start + 0.05} out={premium + 0.2} wrong="Cheapest option first" right="Premium option first" y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: Jay buries his best package ----------
const PAGE = ['Basic · $200', 'Starter · $350', 'Plus · $450', 'Extra · $500', 'Add-ons', 'FAQ', 'About me', 'The Works · $2,000'];
const Jay: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(7);
  const bottom = cue(7, 'bottom');
  const scroll = p(t, s.start + 0.4, bottom, EIO);
  const closed = t > bottom + 0.3;
  const page = usePage(closed ? [] : PAGE, closed ? -1 : 7, scroll);
  const cam: Cam = {pos: [0.35, 1.65, 2.6], target: [-0.05, 1.2, -0.5], fov: 38};
  const head = toScreen(cam, [-0.3, 1.95, -1.25]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[0, 0, -0.4]} length={1.6} depth={0.75} />
        <Laptop position={[0.1, 0.92, -0.45]} openDeg={105} screen={page} scale={1.3} />
        <Character who="friend" t={t} position={[-0.3, 0, -1.25]} rotY={0.3} pose="idle" mood="happy" seed={7} />
      </Stage>
      <Label t={t} at={cue(7, 'friend') ?? s.start + 0.5} text="Jay" x={head[0]} y={head[1]} rise={90} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="pop" at={cue(1, 'folding')} volume={0.08} />
      <Sfx name="thud" at={cue(3, 'anchoring') + 0.35} volume={0.15} />
      <Sfx name="tick" at={cue(4, 'wheel') + 1.4} volume={0.1} />
      <Sfx name="tick" at={cue(4, '65') + 0.2} volume={0.1} />
      <Sfx name="pop" at={cue(4, '25')} volume={0.07} />
      <Sfx name="pop" at={cue(4, '45')} volume={0.07} />
      <Sfx name="ding" at={cue(6, 'reasonable')} volume={0.08} />
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
          {id: 1, render: (tt) => <NotForSale t={tt} />},
          {id: 2, enter: 'fade', render: (tt) => <Lineup t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <TheRuler t={tt} />},
          {id: 4, enter: 'push', render: (tt) => <Wheel t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <Hide t={tt} />},
          {id: 6, enter: 'fade', render: (tt) => <PremiumFirst t={tt} />},
          {id: 7, enter: 'cut', render: (tt) => <Jay t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(1).end]]} />
      <Grain />
      <Sound />
      {t > line(19).end + 0.15 && <AbsoluteFill style={{background: C.base, opacity: p(t, line(19).end + 0.15, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
