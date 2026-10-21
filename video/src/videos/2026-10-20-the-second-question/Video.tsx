// "The second question" (scripts/2026-10-20-the-second-question.md).
// Metaphor: every answer drops a small glowing door between you. A stock question walks past it,
// a follow-up opens it. Every time below comes from the narration via cue()/word(), never by hand.
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {Captions, Label, QuoteBubble, Shake, Stamp, StudyCard, ToolCard, BigText, XCheck} from '../../kit/ui';
import {Flash, Grain, Sfx, Vignette, VhsRewind} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character, Crowd} from '../../kit/three/Character';
import {
  Bubble3D, DrinksTable, Dust, EventHall, GlowBall, GlowingDoor, HighTable, InterrogationRoom, LoadingSpinner, NightKitchenLab, Paddle, Phone, PingPongTable, QuestionCard, SpeedDateGrid,
} from '../../kit/three/sets';
import {clamp, EIO, EO, lerp, p, spr, talk, wobble} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-20-the-second-question';
const CROWD: [number, number][] = [[-2.6, -2.2], [-4.05, -3.0], [2.7, -2.6], [3.4, -3.4], [-1.2, -5.5], [0.6, -6.2], [1.9, -5.4], [-3.8, -6.5], [4.0, -7.0], [-0.52, -8.78]];

// ---------- Shot 1: two cards, frozen room ----------
const TwoCards: React.FC<{t: number}> = ({t}) => {
  const {cue} = useTiming();
  const second = cue(1, 'second');
  const first = cue(1, 'first');
  const cam = camPath(t, [[0, {pos: [0, 1.6, 7.2], target: [0, 1.55, 0], fov: 32}], [3.6, {pos: [0, 1.45, 4.6], target: [0, 1.62, 0], fov: 30}]]);
  const shine = clamp(spr(t, second));
  const crumble = p(t, first, first + 0.7);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="event">
        <EventHall t={0} drain={0.35} />
        <Crowd t={t} spots={CROWD} frozen drain={0.45} />
        <Character who="you" t={t} pose="cards" mood={crumble > 0.2 ? 'excited' : 'neutral'} lookUp={0.05} />
        <QuestionCard t={t} label="1" position={[0.2, 1.38, 0.55]} rotation={[0, -0.15, 0.18]} crumble={crumble} />
        <QuestionCard t={t} label="2" position={[-0.2, 1.4, 0.58]} rotation={[0, 0.15, -0.14]} shine={shine} />
        {shine > 0.05 && <pointLight position={[-0.2, 1.4, 0.9]} color={C.gold} intensity={shine * 3} distance={2.5} />}
      </Stage>
      <BigText t={t} at={0.05} text="Your 2nd question matters more" highlight="2nd" y={250} />
    </AbsoluteFill>
  );
};

// ---------- Shots 2 to 4: the drinks table and the door ----------
const YOU_POS: [number, number, number] = [-0.7, 0, 0.05];
const PRIYA_POS: [number, number, number] = [0.7, 0, 0.05];
const drinksCam = (t: number, s2: number, s3: number, over: number): Cam =>
  camPath(t, [
    [s2, {pos: [0, 1.75, 6.6], target: [0, 1.3, 0], fov: 34}],
    [s3, {pos: [0, 1.65, 5.6], target: [0, 1.35, 0], fov: 33}],
    [over, {pos: [0, 1.65, 5.4], target: [0, 1.35, 0], fov: 33}],
    [over + 1.4, {pos: [0, 2.0, 7.2], target: [0, 1.3, 0], fov: 34}],
  ]);

/** The whole drinks-table moment as a function of time, so shot 4 can rewind it. */
const DrinksScene: React.FC<{t: number; withUi?: boolean}> = ({t, withUi = true}) => {
  const {cue, line, shot} = useTiming();
  const s2 = shot(2).start;
  const s3 = shot(3).start;
  const doorUp = cue(2, 'skincare');
  const host = cue(3, 'host');
  const over = cue(3, 'over');
  const frozen = t >= over;
  const ft = frozen ? over : t; // freeze frame: the world stops on "over"
  const drain = p(t, over, over + 0.35);
  const cam = drinksCam(t, s2, s3, over);
  const l3 = line(3), l4 = line(4), l5 = line(5);
  const youTalk = talk(ft, l3.start, l3.end) + talk(ft, l5.start, l5.end, 2);
  const priyaTalk = talk(ft, l4.start, l4.end, 1);
  const glance = p(ft, l5.start, l5.start + 0.3) * (1 - p(ft, over, over + 0.1)); // you look past the door, towards the room
  const shut = p(t, host, host + 0.45, EIO);
  const priyaHead = toScreen(cam, [PRIYA_POS[0], 2.05, PRIYA_POS[2]]);
  const youHead = toScreen(cam, [YOU_POS[0], 2.0, YOU_POS[2]]);
  return (
    <AbsoluteFill>
      <Stage t={ft} cam={cam} backdrop="event" drain={drain}>
        <EventHall t={ft} drain={drain} tables={[[-3.2, -3.5], [3.3, -4.6], [-1.8, -7.5], [2.4, -9.5]]} />
        <Crowd t={ft} spots={CROWD} frozen={frozen} drain={drain} />
        <DrinksTable position={[0, 0, -1.7]} length={3.8} drain={drain} />
        <HighTable position={[0, 0, 0.15]} drain={drain} glasses={0} />
        <GlowingDoor position={[0, 1.125, 0.15]} scale={0.75} rise={clamp(spr(t, doorUp, {damping: 10, stiffness: 120, mass: 0.8}))} shut={shut} shine={1 + 0.3 * Math.sin(ft * 4)} drain={drain} />
        {shut > 0 && shut < 1 && <Dust t={t} k={p(t, host + 0.3, host + 1.0)} position={[0, 1.3, 0.3]} />}
        <Character who="you" t={ft} position={YOU_POS} rotY={0.75 - glance * 0.9} pose={youTalk > 0 ? 'talk' : 'hold'} talking={youTalk} mood={frozen ? 'neutral' : 'happy'} look={glance * 0.4}  />
        <Character who="stranger_a" t={ft} position={PRIYA_POS} rotY={-0.75} pose={priyaTalk > 0 ? 'talk' : 'hold'} talking={priyaTalk} mood={frozen ? 'bored' : priyaTalk > 0 ? 'excited' : 'happy'} seed={3} />
        <LoadingSpinner t={t} position={[PRIYA_POS[0], 2.4, PRIYA_POS[2]]} scale={0.8} appear={clamp(spr(t, over + 0.25))} />
      </Stage>
      {withUi && (
        <>
          <Label t={t} at={cue(2, 'Priya')} out={l3.start + 0.2} text="Priya" x={priyaHead[0]} y={priyaHead[1]} rise={110} />
          <QuoteBubble t={t} at={line(3).start + 0.5} out={l4.start + 0.9} speaker="you" text="What are you working on?" x={youHead[0]} y={youHead[1] - 30} side="left" width={600} />
          <QuoteBubble t={t} at={s3} out={over - 0.05} speaker="you" text="Nice. How do you know the host?" x={youHead[0]} y={youHead[1] - 30} side="left" width={640} tone="wrong" />
          <Stamp t={t} at={over} text="INTERVIEW OVER" y={560} size={104} />
        </>
      )}
    </AbsoluteFill>
  );
};

const Drinks: React.FC<{t: number}> = ({t}) => {
  const {cue} = useTiming();
  const over = cue(3, 'over');
  return (
    <Shake t={t} hits={[over]} amp={26}>
      <DrinksScene t={t} />
    </Shake>
  );
};

const Rewind: React.FC<{t: number}> = ({t}) => {
  const {cue} = useTiming();
  const from = cue(4, 'showed');
  const to = cue(4, 'listening');
  const landOn = cue(2, 'skincare') + 0.55;
  return <VhsRewind t={t} from={from} to={to} landOn={landOn}>{(tt) => <DrinksScene t={tt} withUi={false} />}</VhsRewind>;
};

// ---------- Shot 5: through the door, into Priya's world ----------
const ThroughDoor: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(5);
  const ask = cue(5, 'ask');
  const start = cue(5, 'start');
  const story = cue(5, 'story');
  const instead = s.on_screen.find((c) => c.type === 'x_check')?.time ?? s.start + 1;
  const into = start + 0.45; // when we arrive inside the kitchen
  if (t < into) {
    const lean = p(t, ask, ask + 0.5) * 0.3;
    const open = p(t, start, start + 0.5, EO);
    const push = p(t, start + 0.1, into, (x) => x * x);
    const cam = camPath(t, [
      [s.start, {pos: [0.2, 1.7, 5.0], target: [0, 1.45, 0.1], fov: 34}],
      [start, {pos: [0.1, 1.55, 3.3], target: [0, 1.4, 0.1], fov: 32}],
    ]);
    const c2: Cam = {pos: [lerp(cam.pos[0], 0, push), lerp(cam.pos[1], 1.37, push), lerp(cam.pos[2], 0.4, push)], target: [0, lerp(1.4, 1.36, push), 0.1], fov: lerp(cam.fov ?? 32, 26, push)};
    const youHead = toScreen(cam, [YOU_POS[0], 2.0, YOU_POS[2]]);
    return (
      <AbsoluteFill>
        <Stage t={t} cam={c2} backdrop="event">
          <EventHall t={t} tables={[[-3.2, -3.5], [3.3, -4.6]]} />
          <Crowd t={t} spots={CROWD} />
          <HighTable position={[0, 0, 0.15]} glasses={0} />
          <GlowingDoor position={[0, 1.125, 0.15]} scale={0.75} open={open} shine={1.4} />
          <Character who="you" t={t} position={YOU_POS} rotY={0.8} pose="lean" lean={lean} mood="excited" talking={talk(t, line(9).start, line(9).end)} />
          <Character who="stranger_a" t={t} position={PRIYA_POS} rotY={-0.75} pose="hold" mood="happy" seed={3} look={0.2} />
        </Stage>
        <XCheck t={t} at={instead} out={line(9).start + 0.05} wrong="How do you know the host?" right="What made you start that?" y={230} />
        <QuoteBubble t={t} at={line(9).start + 0.05} out={start + 0.4} speaker="you" text="A skincare brand? What made you start that?" x={youHead[0] + 40} y={youHead[1] - 20} side="left" width={700} tone="right" />
        <AbsoluteFill style={{background: '#FFFDF5', opacity: p(t, into - 0.25, into) * 0.95}} />
      </AbsoluteFill>
    );
  }
  const glow = p(t, story - 0.3, story + 0.5);
  const cam = camPath(t, [[into, {pos: [-0.4, 1.8, 4.6], target: [0.1, 1.55, 0], fov: 34}], [s.end, {pos: [-0.8, 1.7, 5.4], target: [0.1, 1.55, 0], fov: 34}]]);
  const l10 = line(10);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="night" light="night" glow={glow}>
        <NightKitchenLab t={t} glow={glow} />
        <Character who="stranger_a" t={t} position={[-0.2, 0, -0.75]} rotY={0.1} pose={t < l10.end ? 'talk' : 'present'} talking={talk(t, l10.start, l10.end, 1)} mood="excited" glow={glow} seed={3} />
        <Character who="you" t={t} position={[-0.75, 0, 1.0]} rotY={2.7} pose="idle" mood="happy" lookUp={0.1} glow={glow} />
        {Array.from({length: 18}, (_, i) => {
          const a = i * 2.4;
          const rise = ((t - into) * 0.25 + i / 18) % 1;
          return <Bubble3D key={i} position={[Math.cos(a) * 1.6, 1.2 + rise * 2.2, -0.4 + Math.sin(a) * 0.8]} gold={1} scale={0.12 * glow} />;
        })}
      </Stage>
      <AbsoluteFill style={{background: '#FFFDF5', opacity: (1 - p(t, into, into + 0.4)) * 0.95}} />
    </AbsoluteFill>
  );
};

// ---------- Shot 6: the interrogation (the viewer's fear, exaggerated) ----------
const Interrogation: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(6);
  const hit = cue(6, 'interrogation');
  const swing = Math.sin((t - s.start) * 2.4) * 0.12 + Math.sin(clamp((t - hit) * 3.5, 0, Math.PI)) * 0.55 * (t > hit ? 1 : 0);
  const drift: Cam = {pos: [0.4 + wobble(t, 0.6) * 0.12, 2.1 + wobble(t, 0.5, 2) * 0.05, 4.6], target: [0, 1.35, 0], fov: 36, roll: wobble(t, 0.4, 1) * 0.02};
  const youHead = toScreen(drift, [-0.75, 2.0, 0.88]);
  const qs = ['Why skincare?', 'Since when?', 'Who knows?!'];
  return (
    <AbsoluteFill>
      <Stage t={t} cam={drift} backdrop="dark" light="harsh" fog={[8, 20]}>
        <InterrogationRoom t={t} lampSwing={swing} />
        <Character who="you" t={t} position={[-0.75, 0, 0.88]} rotY={0.7} pose="point" lean={0.25} talking={talk(t, s.start, s.end)} mood="excited" />
        <Character who="stranger_a" t={t} position={[0.7, 0, -0.88]} rotY={-0.5} pose="shrug" mood="shock" sweat={((t - s.start) * 1.3) % 1} seed={3} />
      </Stage>
      {qs.map((q, i) => (
        <QuoteBubble key={q} t={t} at={s.start + 0.2 + i * 0.6} out={s.start + 0.75 + i * 0.6} speaker="you" text={q} x={youHead[0] + i * 60} y={youHead[1] - 20 - i * 40} side="left" width={520} typeOn={false} />
      ))}
      <Flash t={t} at={hit} color="#FFF6D8" dur={0.25} max={0.5} />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: the trade is a ping-pong rally ----------
const PingPong: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(7);
  const trade = cue(7, 'trade');
  if (t < trade + 0.12) return <Interrogation t={t} />;
  const answers = cue(7, 'answers');
  const share = cue(7, 'share');
  const dig = cue(7, 'dig');
  const mid = (share + dig) / 2;
  // [time, who hits: 1 = Priya (far end), -1 = you (near end)]
  const hits: [number, number][] = [[answers, 1], [share, -1], [mid, 1], [dig, -1]];
  const P: [number, number, number] = [1.45, 1.05, 0.05];
  const Y: [number, number, number] = [-1.45, 1.05, -0.05];
  let ball: [number, number, number] = P;
  let heat = 0.15;
  const legs = [...hits, [s.end + 0.3, 1] as [number, number]];
  for (let i = 0; i < legs.length - 1; i++) {
    const [ta, wa] = legs[i];
    const [tb] = legs[i + 1];
    if (t >= ta && t < tb) {
      const k = (t - ta) / (tb - ta);
      const a = wa === 1 ? P : Y;
      const b = wa === 1 ? Y : P;
      ball = [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + Math.sin(k * Math.PI) * 0.45, lerp(a[2], b[2], k)];
    }
    if (t >= ta) heat = [0.25, 0.45, 0.6, 1][i] ?? 1;
  }
  if (t < answers) ball = [P[0], P[1] + 0.25 + Math.abs(Math.sin((t - trade) * 6)) * 0.25, P[2]];
  const swingK = (who: number) => {
    let k = 0;
    for (const [ht, w] of hits) if (w === who) k = Math.max(k, 1 - Math.min(1, Math.abs(t - ht) / 0.28));
    return k;
  };
  const spin = 1 - p(t, trade, trade + 0.45, EO);
  const cam = camPath(t, [[trade, {pos: [-5.2, 3.0, 2.0], target: [0.5, 1.45, 0], fov: 36}], [s.end, {pos: [-4.6, 2.7, 1.6], target: [0.5, 1.5, 0], fov: 34}]]);
  const lit = t < answers ? -1 : t < share ? 0 : t < dig ? 1 : 2;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `rotate(${spin * 180}deg) scale(${1 - spin * 0.4})`}}>
        <Stage t={t} cam={cam} backdrop="warm" glow={heat * 0.5}>
          <Floor />
          <PingPongTable glow={heat * 0.4} />
          <Character who="you" t={t} position={[-1.85, 0, -0.1]} rotY={Math.PI / 2} pose="swing" poseK={swingK(-1)} mood="happy" rightHand={<Paddle color={C.gold} />} />
          <Character who="stranger_a" t={t} position={[1.85, 0, 0.1]} rotY={-Math.PI / 2} pose="swing" poseK={swingK(1)} mood="excited" rightHand={<Paddle color="#9B6BA6" />} seed={3} />
          <GlowBall position={ball} heat={heat} r={0.07} />
        </Stage>
      </AbsoluteFill>
      <ToolCard t={t} at={answers} title="The trade" items={['She answers', 'You share one small thing', 'You dig into what she said']} itemsAt={[answers, share, dig]} lit={lit} y={210} />
      <Flash t={t} at={trade + 0.12} dur={0.3} />
    </AbsoluteFill>
  );
};

// ---------- Shot 8: proof at scale ----------
const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const StudyGrid: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(8);
  const big = cue(8, '2,000');
  const follow = cue(8, 'follow-up');
  const liked = cue(8, 'liked');
  const second = cue(8, 'second');
  const cam = camPath(t, [
    [s.start, {pos: [0.3, 1.6, 4.0], target: [0, 1.75, 0], fov: 32}],
    [big - 0.2, {pos: [0.2, 1.7, 4.6], target: [0, 1.75, 0], fov: 32}],
    [big + 2.6, {pos: [0, 30, 10], target: [0, 0, -6], fov: 40}],
    [s.end, {pos: [0, 36, 9], target: [0, 0, -7], fov: 40}],
  ], EIO);
  const lit = (i: number, x: number, z: number) => {
    const d = Math.hypot(x, z + 8);
    const on = hash(i) < 0.42 ? p(t, follow + d * 0.03, follow + d * 0.03 + 0.3) : 0;
    const best = hash(i) < 0.14 ? 0.25 * Math.max(0, Math.sin((t - liked) * 6)) * (t > liked ? 1 : 0) : 0;
    return clamp(on * 0.85 + best);
  };
  const tickets = Array.from({length: 40}, (_, j) => {
    let i = Math.floor(hash(j + 7) * 2000);
    while (hash(i) >= 0.14) i = (i + 1) % 2000;
    const x = ((i % 50) - 24.5) * 0.9;
    const z = (Math.floor(i / 50) - 19.5) * 0.9 - 8;
    const k = p(t, second + (j % 10) * 0.05, second + 1.2 + (j % 10) * 0.05, EO);
    return {x, z, k, j};
  });
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" fog={[40, 80]}>
        <Floor size={120} />
        <group position={[0, 0, -8]}>
          <SpeedDateGrid lit={lit} />
        </group>
        <Character who="professor" t={t} position={[0, 0, 0.2]} pose={t > liked && t < liked + 1.2 ? 'point' : 'present'} talking={0} mood="happy" />
        {tickets.map(({x, z, k, j}) =>
          k > 0 ? (
            <mesh key={j} position={[x, 0.6 + k * 6, z]} rotation={[k * 6 + j, k * 4, 0]}>
              <boxGeometry args={[0.5, 0.02, 0.28]} />
              <meshStandardMaterial color={C.gold} emissive={C.gold} emissiveIntensity={0.6} />
            </mesh>
          ) : null,
        )}
      </Stage>
      <StudyCard t={t} at={s.start + 0.15} out={big + 0.2} year={2017} who="Huang, Yeomans, Brooks, Minson & Gino (Harvard)" finding="Over 2,000 speed-date conversations: more follow-up questions, more liking" y={240} />
    </AbsoluteFill>
  );
};

// ---------- Shot 9: the fog of first questions ----------
const GROUPS: [number, number][] = [[-2.8, -3.0], [3.0, -3.6], [-1.0, -5.8], [1.8, -7.0], [-3.4, -7.5], [0.2, -4.4]];
const Fog: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(9);
  const matters = cue(9, 'matters');
  const nobody = cue(9, 'nobody');
  const everybody = cue(9, 'everybody');
  const listening = cue(9, 'listening');
  const send = everybody + 0.7;
  const PRI: [number, number, number] = [1.3, 0, -1.4];
  const YOU: [number, number, number] = [-1.1, 0, 1.0];
  const cam = camPath(t, [
    [s.start, {pos: [0, 2.3, 9.0], target: [0, 1.3, -1], fov: 36}],
    [everybody + 0.4, {pos: [0, 5.2, 8.5], target: [0, 2.6, -2], fov: 38}],
    [listening, {pos: [0.6, 2.1, 4.6], target: [1.0, 1.4, -1.2], fov: 32}],
    [s.end, {pos: [0.7, 2.0, 4.1], target: [1.1, 1.45, -1.3], fov: 31}],
  ], EIO);
  const fogK = p(t, everybody, everybody + 1.2);
  const step = p(t, matters, matters + 0.8);
  const gk = p(t, send, listening - 0.15, EIO);
  const goldPos: [number, number, number] = gk <= 0 ? [YOU[0], 2.1, YOU[2]] : [lerp(YOU[0], PRI[0] + 0.15, gk), 2.1 + Math.sin(gk * Math.PI) * 0.9 - gk * 1.1, lerp(YOU[2], PRI[2] + 0.3, gk)];
  const pocketed = p(t, listening - 0.1, listening + 0.3);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="event" drain={fogK * 0.35}>
        <EventHall t={t} drain={fogK * 0.4} tables={[[-3.6, -4.0], [3.6, -4.5], [-0.2, -8.0]]} />
        {GROUPS.map(([x, z], i) => (
          <group key={i}>
            <Crowd t={t} spots={[[x - 0.35, z], [x + 0.35, z + 0.1]]} seed={i} drain={fogK * 0.5} />
          </group>
        ))}
        <Character who="stranger_a" t={t} position={PRI} rotY={-0.4} pose={pocketed > 0 ? 'pocket' : 'hold'} mood={pocketed > 0.5 ? 'excited' : 'happy'} seed={3} glow={pocketed} />
        <Character who="you" t={t} position={[YOU[0] + step * 0.3, 0, YOU[2] - step * 0.5]} rotY={0.55} pose={t > send - 0.3 && t < send + 0.6 ? 'present' : 'idle'} mood="happy" />
        {/* grey first-question bubbles rising from every group, merging into fog */}
        {GROUPS.flatMap(([x, z], i) =>
          [0, 1, 2].map((j) => {
            const born = nobody + (i * 3 + j) * 0.07;
            if (t < born) return null;
            const r = (t - born) * 0.7;
            const y = 2.2 + r + j * 0.3;
            return <Bubble3D key={`${i}-${j}`} position={[x + Math.sin(j * 2 + i) * 0.4, Math.min(y, 4.4 + j * 0.2), z + Math.cos(j + i) * 0.3]} scale={0.9 + fogK * 0.6} opacity={1 - fogK * 0.75} />;
          }),
        )}
        {fogK > 0 &&
          Array.from({length: 14}, (_, i) => (
            <mesh key={i} position={[-5 + (i % 7) * 1.7, 4.3 + Math.floor(i / 7) * 0.6 + Math.sin(t + i) * 0.1, -3 - Math.floor(i / 7) * 2]}>
              <sphereGeometry args={[1.2, 20, 16]} />
              <meshStandardMaterial color="#C9CED6" transparent opacity={0.55 * fogK} depthWrite={false} roughness={1} />
            </mesh>
          ))}
        {t > send - 0.2 && pocketed < 1 && <Bubble3D position={goldPos} gold={1} scale={0.9 * (1 - pocketed)} />}
      </Stage>
      <BigText t={t} at={s.on_screen.find((c) => c.type === 'big_text')?.time ?? listening - 0.6} text="Prove you were listening" highlight="listening" y={240} size={96} />
    </AbsoluteFill>
  );
};

// ---------- Shot 10: Jay misses the door ----------
const Jay: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(10);
  const phone = cue(10, 'phone');
  const cam = camPath(t, [[s.start, {pos: [0.4, 1.7, 7.0], target: [0.35, 1.45, 0], fov: 32}], [s.end + 0.6, {pos: [0.4, 1.6, 5.6], target: [0.35, 1.45, 0], fov: 32}]]);
  const jayHead = toScreen(cam, [-0.15, 2.0, 0]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="event">
        <EventHall t={t} tables={[[-3.0, -3.5], [3.0, -4.0]]} />
        <Crowd t={t} spots={CROWD.slice(0, 7)} />
        <HighTable position={[-0.15, 0, -0.75]} glasses={1} />
        <Character who="friend" t={t} position={[-0.15, 0, 0]} pose="phone" mood="bored" rightHand={<Phone position={[0.02, -0.06, 0.06]} rotation={[0.6, 0, 0]} scale={1.1} />} />
        <GlowingDoor position={[0.85, 0, 0.35]} rotY={-0.35} scale={1.0} rise={clamp(spr(t, s.start + 0.2))} shine={1 + 1.6 * p(t, phone, phone + 0.6)} />
      </Stage>
      <Label t={t} at={cue(10, 'friend')} text="Jay" x={jayHead[0]} y={jayHead[1]} rise={120} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound ----------
const Sound: React.FC = () => {
  const {cue, shot, line} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="sparkle" at={cue(1, 'second')} volume={0.35} />
      <Sfx name="pop" at={cue(1, 'first')} volume={0.4} />
      <Sfx name="whoosh" at={shot(2).start - 0.15} volume={0.35} />
      <Sfx name="pop" at={line(2).start + 0.4} volume={0.3} />
      <Sfx name="ding" at={cue(2, 'skincare')} volume={0.3} />
      <Sfx name="pop" at={cue(3, 'host')} volume={0.4} />
      <Sfx name="buzzer" at={cue(3, 'over')} volume={0.32} />
      <Sfx name="rewind" at={cue(4, 'showed')} volume={0.35} />
      <Sfx name="swell" at={cue(5, 'start') - 1.0} volume={0.3} />
      <Sfx name="sparkle" at={cue(5, 'story')} volume={0.35} />
      <Sfx name="thud" at={shot(6).start} volume={0.45} />
      <Sfx name="scratch" at={cue(7, 'trade')} volume={0.45} />
      {(['answers', 'share', 'dig'] as const).map((w) => (
        <Sfx key={w} name="ping" at={cue(7, w)} volume={0.4} />
      ))}
      <Sfx name="ping" at={(cue(7, 'share') + cue(7, 'dig')) / 2} volume={0.35} />
      <Sfx name="whoosh" at={cue(8, '2,000')} volume={0.4} />
      <Sfx name="swell" at={cue(8, 'follow-up') - 1.2} volume={0.3} />
      <Sfx name="sparkle" at={cue(8, 'second')} volume={0.35} />
      <Sfx name="ding" at={cue(9, 'listening')} volume={0.3} />
      <Sfx name="tick" at={cue(10, 'phone')} volume={0.3} />
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
          {id: 1, render: (tt) => <TwoCards t={tt} />},
          {id: 2, enter: 'whip', render: (tt) => <Drinks t={tt} />},
          {id: 3, render: (tt) => <Drinks t={tt} />},
          {id: 4, render: (tt) => <Rewind t={tt} />},
          {id: 5, enter: 'cut', render: (tt) => <ThroughDoor t={tt} />},
          {id: 6, render: (tt) => <Interrogation t={tt} />},
          {id: 7, render: (tt) => <PingPong t={tt} />},
          {id: 8, enter: 'zoom', render: (tt) => <StudyGrid t={tt} />},
          {id: 9, enter: 'fade', render: (tt) => <Fog t={tt} />},
          {id: 10, enter: 'whip', render: (tt) => <Jay t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(2).start]]} />
      <Grain />
      <Sound />
      {t > line(23).end + 0.1 && <AbsoluteFill style={{background: C.ink, opacity: p(t, line(23).end + 0.1, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
