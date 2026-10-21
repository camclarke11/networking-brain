// "The seat next to you" (scripts/2026-10-20-the-seat-next-to-you.md). Written by following knowledge/13-video-production.md.
// Metaphor: the queue for the speaker is a factory conveyor belt that stamps everyone HANDSHAKE and drops
// them in a bin. Turning to the person next to you steps you off it, and when you two walk up together
// the belt grinds to a halt for you. Every time below comes from the narration (cue / word / line / shot).
import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, QuoteBubble, Shake, Stamp} from '../../kit/ui';
import {Flash, Grain, Sfx, Vignette, VhsRewind} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character} from '../../kit/three/Character';
import {Bubble3D, Dust} from '../../kit/three/sets';
import {beltTravel, conveyorDrop, Doorway, Notebook, ParkingLot, QueueConveyor, Rope, seatAt, StageHall} from '../../kit/three/talk';
import {clamp, EIO, EO, lerp, p, spr, talk, wobble} from '../../kit/time';
import {C} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-20-the-seat-next-to-you';
type V3 = [number, number, number];

// ---------- the room ----------
// Rows face the stage (-z). The belt runs up the centre aisle: local +x = world -z, centred at z = 2.
const BELT_Z = 2;
const PRESS_Z = BELT_Z - 3.5; // where the stamp press is, at the stage end of the belt
const YOU_SEAT = seatAt(2, 0, -1);
const NIA_SEAT = seatAt(2, 1, -1);
const SPEAKER: V3 = [0.85, 0, PRESS_Z - 0.35];
const SPEAKER_L: V3 = [-1.0, 0, -1.95]; // where he turns to meet you two in shot 6
const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// Yours, Nia's and Jay's seats are free for the cast; the rows in front of you have no chairs, so the
// camera sees you and there's room to stand up and walk out.
const clear = (r: number, s: number, side: number) => (side < 0 && s <= 2 && r <= 2) || (side < 0 && s === 0 && r === 3);
const gone = (r: number, s: number, side: number) => side < 0 && s <= 2 && r <= 1;

type RoomProps = {t: number; cam: Cam; full?: number; travel: number; drain?: number; glow?: number; clap?: number; children?: React.ReactNode; belt?: number};
const Room: React.FC<RoomProps> = ({t, cam, full = 1, travel, drain = 0, glow = 0, clap = 0, belt = 1, children}) => (
  <Stage t={t} cam={cam} backdrop="warm" light="warm" drain={drain} glow={glow} fog={[16, 40]}>
    <StageHall t={t} rows={6} seats={5} title="" drain={drain} glow={glow} clap={clap} skip={gone} filled={(r, s, side) => !clear(r, s, side) && hash(r * 31 + s * 7 + (side > 0 ? 3 : 0)) < full} />
    <QueueConveyor t={t} travel={travel} appear={belt} riders={60} gap={1.0} position={[0, 0, BELT_Z]} rotY={Math.PI / 2} drain={drain} />
    {children}
  </Stage>
);

/** The speaker at the end of the belt, pumping each rider's hand. */
const Speaker: React.FC<{t: number; travel: number; rotY?: number; mood?: 'happy' | 'neutral' | 'excited' | 'bored'; pump?: boolean; lean?: number; talking?: number; drain?: number; glow?: number; position?: V3; pose?: 'point' | 'wave' | 'talk' | 'idle'}> = ({
  t, travel, rotY = -Math.PI / 2, mood = 'neutral', pump = true, lean = 0, talking = 0, drain = 0, glow = 0, position = SPEAKER, pose,
}) => {
  const phase = (((travel - 7.9) % 1) + 1) % 1; // a rider reaches the press once per metre of belt
  const shaking = pump && phase > 0.55;
  return (
    <Character who="stranger_c" t={t} position={position} rotY={rotY} pose={pose ?? (shaking ? 'point' : 'idle')} lean={lean + (shaking ? Math.sin(t * 16) * 0.05 : 0)} mood={mood} talking={talking} drain={drain} glow={glow} seed={5} />
  );
};

/** Belt travel in the room: it starts on "queue" and grinds to a halt on shot 6's "forty". */
const useRoomTravel = () => {
  const {cue} = useTiming();
  return (t: number) => beltTravel(t, cue(1, 'queue'), 1.0, cue(6, 'forty'), 0.7);
};

// ---------- Shot 1: the talk ends, the aisle becomes a belt, you turn ----------
const OffTheBelt: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(1);
  const queue = cue(1, 'queue');
  const turn = cue(1, 'Turn');
  const travel = useRoomTravel()(t);
  const cam = t < turn
    ? camPath(t, [[0, {pos: [0.2, 3.9, 11.0], target: [0, 1.0, -1.0], fov: 34}], [turn, {pos: [0.1, 3.4, 9.6], target: [-0.1, 1.0, -0.6], fov: 34}]])
    : camPath(t, [[turn, {pos: [-1.0, 1.95, -2.9], target: [-1.26, 1.5, 2.2], fov: 32}], [s.end, {pos: [-1.05, 1.9, -2.4], target: [-1.26, 1.5, 2.2], fov: 32}]]);
  const k = p(t, turn, turn + 0.6);
  return (
    <AbsoluteFill>
      <Room t={t} cam={cam} travel={travel} belt={clamp(spr(t, queue, {damping: 11, stiffness: 120, mass: 0.8}))} clap={1 - p(t, queue - 0.4, queue + 0.6)}>
        <Speaker t={t} travel={travel} rotY={lerp(0, -Math.PI / 2, p(t, queue, queue + 0.8))} pump={t > queue + 0.8} />
        <Character who="you" t={t} position={YOU_SEAT} rotY={Math.PI + k * 0.55} sit look={k * 0.5} mood={k > 0.5 ? 'happy' : 'neutral'} pose="idle" />
        <Character who="stranger_a" t={t} position={NIA_SEAT} rotY={Math.PI} sit pose="hold" lookUp={-0.35} mood="happy" seed={3} />
        <Notebook t={t} position={[NIA_SEAT[0], 0.62, NIA_SEAT[2] - 0.64]} rotation={[0.25, Math.PI, 0]} scale={1.1} />
      </Room>
      <BigText t={t} at={0.05} text="Don't queue for the speaker" highlight="queue" y={230} size={100} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: processed (an abstract factory), then the parking lot ----------
const SPEED2 = 1.2;
const Processed: React.FC<{t: number}> = ({t}) => {
  const {cue, line} = useTiming();
  const rush = cue(2, 'rush');
  const hand = cue(2, 'handshake');
  const forgotten = cue(2, 'forgotten');
  const park = line(5).start;
  if (t >= park) {
    // the speaker walks to his car; the faces in his head fog over
    const walkX = lerp(-0.9, 0.7, p(t, park, park + 3.4, (x) => x));
    const cam: Cam = {pos: [walkX * 0.6 + 0.2, 2.1, 5.6], target: [walkX * 0.8, 2.1, 0], fov: 34};
    const fog = p(t, forgotten, forgotten + 1.1);
    const faces: V3[] = [[-0.45, 3.05, 0.35], [0.0, 3.25, 0.4], [0.45, 3.0, 0.35], [-0.2, 2.75, 0.45], [0.3, 2.72, 0.42]];
    return (
      <AbsoluteFill>
        <Stage t={t} cam={cam} backdrop="night" light="night" drain={0.25}>
          <ParkingLot t={t} drain={0.2} />
          <Character who="stranger_c" t={t} position={[walkX, 0, 0]} rotY={1.2} pose="idle" mood={fog > 0.5 ? 'bored' : 'neutral'} hop={Math.abs(Math.sin(t * 7)) * 0.04} seed={5} />
          <group position={[walkX, 0, 0]}>
            <Bubble3D position={[0, 2.95, 0.1]} scale={1.7} opacity={0.55} />
            {faces.map((f, i) => (
              <mesh key={i} position={f} scale={1 - fog * 0.4}>
                <sphereGeometry args={[0.11, 16, 12]} />
                <meshStandardMaterial color={i === 1 ? '#E9B88E' : '#B9B3AA'} transparent opacity={1 - fog} roughness={0.9} />
              </mesh>
            ))}
            {/* your face: the only one with hair, until it fogs */}
            <mesh position={[0.0, 3.32, 0.42]} scale={1 - fog * 0.4}>
              <sphereGeometry args={[0.08, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
              <meshStandardMaterial color="#2E221A" transparent opacity={1 - fog} />
            </mesh>
            {fog > 0 &&
              Array.from({length: 8}, (_, i) => (
                <mesh key={'f' + i} position={[-0.5 + (i % 4) * 0.33, 2.8 + Math.floor(i / 4) * 0.35 + Math.sin(t * 2 + i) * 0.04, 0.5]}>
                  <sphereGeometry args={[0.2 + fog * 0.1, 14, 10]} />
                  <meshStandardMaterial color="#C9CED6" transparent opacity={0.8 * fog} depthWrite={false} roughness={1} />
                </mesh>
              ))}
          </group>
        </Stage>
      </AbsoluteFill>
    );
  }
  // the belt, side-on: rider 3 is you
  const travel = (t - hand) * SPEED2 + 7.7 + 3;
  const xYou = 3.5 + (t - hand) * SPEED2; // press is at local x = 3.5
  const youPos: V3 = xYou <= 4 ? [xYou, 0.32, 0] : conveyorDrop(xYou - 4);
  const stamped = t >= hand;
  const drain = 0.2 + 0.5 * p(t, hand, hand + 0.6);
  const cam = camPath(t, [
    [line(3).start, {pos: [-5.6, 2.5, 3.9], target: [1.4, 1.0, 0], fov: 36}],
    [hand, {pos: [-3.4, 2.1, 3.4], target: [2.9, 1.1, 0], fov: 33}],
    [park, {pos: [-2.6, 2.4, 3.8], target: [3.6, 0.9, 0], fov: 33}],
  ], EIO);
  const youHead = toScreen(cam, [youPos[0], 2.2, 0]);
  return (
    <AbsoluteFill>
      <Shake t={t} hits={[hand]} amp={24}>
        <Stage t={t} cam={cam} backdrop="void" drain={drain}>
          <Floor color={C.base2} drain={drain} />
          <QueueConveyor t={t} travel={travel} riders={14} gap={1.0} drain={drain} hideRider={(i) => i === 3 || (i > 3 && t < rush)} />
          <Speaker t={t} travel={travel} position={[3.5, 0, -0.95]} rotY={0.35} drain={drain} mood="bored" />
          {xYou < 5 && (
            <Character who="you" t={t} position={youPos} rotY={-0.6} pose="idle" mood={stamped ? 'sad' : 'neutral'} look={stamped ? 0 : 0.3} drain={drain}
              costume={stamped ? <mesh position={[0, 1.0, 0.3]}><planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial color={C.red} /></mesh> : undefined} />
          )}
          {t > rush && t < rush + 0.6 && <Dust t={t} k={p(t, rush, rush + 0.6)} position={[-3.6, 0.6, 0]} spread={1.0} />}
        </Stage>
        <Stamp t={t} at={cue(2, 'forty')} out={hand - 0.05} text="40 SECONDS" y={420} size={110} />
        <Label t={t} at={hand + 0.05} out={park - 0.1} text="you" x={youHead[0]} y={youHead[1]} rise={90} color={C.coldLight} />
      </Shake>
      <Flash t={t} at={hand} dur={0.2} max={0.5} />
    </AbsoluteFill>
  );
};

// ---------- Shot 3: rewind, then Nia still in her seat ----------
const NiaScene: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(3);
  const seat = cue(3, 'seat');
  const book = cue(3, 'Notebook');
  const heard = cue(3, 'heard');
  const travel = useRoomTravel()(t);
  const cam = camPath(t, [
    [s.start + 0.6, {pos: [0.4, 2.1, -2.6], target: [-0.8, 1.35, 2.0], fov: 34}],
    [seat + 0.7, {pos: [-1.3, 1.85, -1.5], target: [-1.55, 1.6, 2.2], fov: 32}],
    [book - 0.05, {pos: [-1.35, 1.82, -1.2], target: [-1.55, 1.58, 2.2], fov: 32}],
    [book + 0.7, {pos: [-1.75, 1.15, 0.75], target: [-1.75, 0.62, 1.7], fov: 34}],
    [s.end, {pos: [-1.75, 1.12, 0.85], target: [-1.75, 0.62, 1.7], fov: 33}],
  ], EIO);
  const head = toScreen(cam, [NIA_SEAT[0], 1.9, NIA_SEAT[2]]);
  return (
    <AbsoluteFill>
      <Room t={t} cam={cam} travel={travel} full={0.25}>
        <Speaker t={t} travel={travel} />
        <Character who="stranger_a" t={t} position={NIA_SEAT} rotY={Math.PI} sit pose="hold" lookUp={-0.35 + 0.1 * Math.sin(t * 1.3)} mood="happy" seed={3} glow={p(t, heard, heard + 0.6) * 0.4} />
        <Notebook t={t} position={[NIA_SEAT[0], 0.62, NIA_SEAT[2] - 0.64]} rotation={[0.25, Math.PI, 0]} scale={1.1} glow={p(t, heard, heard + 0.5)} flutter={0} />
      </Room>
      <Label t={t} at={cue(3, 'Nia')} out={book - 0.1} text="Nia" x={head[0]} y={head[1]} rise={110} />
    </AbsoluteFill>
  );
};

const RewindToNia: React.FC<{t: number}> = ({t}) => {
  const {shot, cue} = useTiming();
  const from = shot(3).start;
  const to = from + 0.7;
  if (t < to) return <VhsRewind t={t} from={from} to={to} landOn={cue(2, 'rush')}>{(tt) => <Processed t={tt} />}</VhsRewind>;
  return <NiaScene t={t} />;
};

// ---------- Shots 4 and 5: comparing notes, then the tug of war ----------
const NotesScene: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s4 = shot(4), s5 = shot(5);
  const ask = line(11).start;
  const use = cue(4, 'use');
  const comparing = cue(4, 'comparing');
  const yank = cue(5, 'speaker');
  const can = cue(5, 'can');
  const alone = cue(5, 'alone');
  const travel = useRoomTravel()(t);
  const inS5 = t >= s5.start;
  const turnBook = p(t, use, use + 0.5, EIO) * (1 - p(t, s5.start, s5.start + 0.4));
  const glow = p(t, comparing, comparing + 0.6) * (1 - p(t, s5.start, s5.start + 0.6));
  // shot 5: the belt drags you out of your seat on "speaker", lets go on "can", you grab Nia on "alone"
  const pulled = inS5 ? p(t, yank - 0.15, yank + 0.35, EO) * (1 - p(t, can, can + 0.35)) : 0;
  const standing = inS5 && t >= yank - 0.15;
  const youPos: V3 = standing ? [lerp(-0.95, -0.84, pulled) + wobble(t, 3) * 0.02 * pulled, 0, 1.55] : YOU_SEAT;
  const niaUp = inS5 && t >= alone - 0.1;
  const grab = p(t, alone, alone + 0.4);
  const cam = camPath(t, [
    [s4.start, {pos: [-1.25, 1.95, -2.9], target: [-1.26, 1.6, 2.2], fov: 32}],
    [line(11).end, {pos: [-1.25, 1.95, -2.6], target: [-1.26, 1.6, 2.2], fov: 32}],
    [comparing + 0.3, {pos: [-1.25, 1.75, -1.3], target: [-1.26, 1.05, 2.0], fov: 32}],
    [s5.start, {pos: [-1.25, 1.75, -1.2], target: [-1.26, 1.05, 2.0], fov: 32}],
    [s5.start + 0.5, {pos: [-2.6, 3.0, -2.4], target: [-0.4, 1.0, 1.6], fov: 38}],
    [can, {pos: [-2.5, 2.9, -2.3], target: [-0.4, 1.0, 1.6], fov: 38}],
    [can + 0.35, {pos: [-1.4, 1.95, -2.4], target: [-1.1, 1.5, 1.9], fov: 33}],
    [s5.end, {pos: [-1.4, 1.9, -2.2], target: [-1.1, 1.5, 1.9], fov: 33}],
  ], EIO);
  const youHead = toScreen(cam, [YOU_SEAT[0], 1.9, YOU_SEAT[2]]);
  const hand: V3 = [youPos[0] + 0.32, 1.15, youPos[2] - 0.42];
  const hook: V3 = [0, 0.5, youPos[2] - 1.3 - pulled * 0.4];
  return (
    <AbsoluteFill>
      <Shake t={t} hits={[yank, can]} amp={18}>
        <Room t={t} cam={cam} travel={travel} full={0.25} glow={glow * 0.6} drain={pulled * 0.5}>
          <Speaker t={t} travel={travel} />
          <Character who="you" t={t} position={youPos} rotY={standing ? (niaUp ? Math.PI + 0.9 : Math.PI - 0.5 * pulled) : Math.PI + 0.45 * p(t, ask - 0.3, ask + 0.2)} sit={!standing}
            pose={standing ? (pulled > 0.1 ? 'point' : niaUp ? 'point' : 'idle') : t > use + 0.4 ? 'hold' : 'idle'} lean={standing ? -0.25 * pulled : 0.12 * p(t, ask, ask + 0.4)}
            look={standing ? (pulled > 0.1 ? -0.4 : 0.3) : 0.5 * p(t, ask - 0.3, ask + 0.2)} talking={talk(t, line(11).start, line(11).end)} mood={pulled > 0.1 ? 'wince' : glow > 0.3 || niaUp ? 'excited' : 'happy'} drain={pulled * 0.4} glow={glow * 0.5} />
          <Character who="stranger_a" t={t} position={niaUp ? [NIA_SEAT[0] + 0.05, 0, 1.55] : NIA_SEAT} rotY={niaUp ? Math.PI - 0.6 : Math.PI - 0.5 * turnBook} sit={!niaUp} pose={niaUp ? (grab > 0.5 ? 'hold' : 'idle') : 'hold'}
            lookUp={niaUp ? 0 : -0.3 + 0.3 * turnBook} look={-0.4 * turnBook} mood={glow > 0.3 ? 'excited' : 'happy'} seed={3} glow={glow * 0.5} hop={niaUp ? Math.max(0, Math.sin(grab * Math.PI)) * 0.1 : 0} />
          {!niaUp && <Notebook t={t} position={[NIA_SEAT[0] + turnBook * 0.1, 0.62 + turnBook * 0.1, NIA_SEAT[2] - 0.72]} rotation={[0.25 + turnBook * 0.5, Math.PI - turnBook * Math.PI * 0.6, 0]} scale={1.1} glow={glow} flutter={glow * (1 - p(t, comparing + 1.6, comparing + 2.2))} />}
          {!standing && t > use && <Notebook t={t} position={[YOU_SEAT[0] - 0.05, 0.62, YOU_SEAT[2] - 0.72]} rotation={[0.25 + turnBook * 0.4, Math.PI - turnBook * Math.PI * 0.5, 0]} scale={1.1} cover="#C9860F" glow={glow} open={turnBook} flutter={glow * 0.8} />}
          {glow > 0.2 && Array.from({length: 6}, (_, i) => {
            const k = ((t - comparing) * 0.6 + i / 6) % 1;
            return <mesh key={i} position={[lerp(NIA_SEAT[0], YOU_SEAT[0], i % 2 ? k : 1 - k), 1.0 + Math.sin(k * Math.PI) * 0.45, 1.85]} rotation={[k * 6, k * 4 + i, 0]}><boxGeometry args={[0.22, 0.004, 0.3]} /><meshStandardMaterial color="#FFFCF6" emissive={C.gold} emissiveIntensity={glow * 0.8} /></mesh>;
          })}
          {pulled > 0.05 && <Rope from={hand} to={hook} r={0.045} color="#E2B23A" />}
          {t > can && t < can + 0.6 && <Dust t={t} k={p(t, can, can + 0.6)} position={[hand[0] - 0.1, 0.9, hand[2] - 0.4]} color="#9CA3AB" />}
        </Room>
      </Shake>
      <QuoteBubble t={t} at={line(11).start} out={line(12).start - 0.1} speaker="you" text="What's the one thing you're actually going to use?" x={youHead[0]} y={youHead[1] - 20} side="left" width={720} />
    </AbsoluteFill>
  );
};

// ---------- Shot 6: walk up together, the belt stops (screenshot moment) ----------
const BeltStops: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(6);
  const together = cue(6, 'together');
  const forty = cue(6, 'forty');
  const pair = cue(6, 'pair');
  const travel = useRoomTravel()(t);
  const walk = p(t, s.start + 0.3, together + 0.9, (x) => x);
  const bob = (seed: number) => (walk > 0 && walk < 1 ? Math.abs(Math.sin(t * 8 + seed)) * 0.05 : 0);
  const you: V3 = [lerp(-1.25, -1.5, walk), 0, lerp(-0.2, -1.5, walk)];
  const nia: V3 = [lerp(-1.85, -2.1, walk), 0, lerp(-0.05, -1.35, walk)];
  const face = p(t, together + 0.6, together + 1.2); // turn from walking to facing him
  const turnK = p(t, forty, forty + 0.6);
  const glow = p(t, pair - 0.2, pair + 0.7);
  const cam = camPath(t, [
    [s.start, {pos: [-1.55, 1.1, -5.0], target: [-1.6, 1.75, -0.4], fov: 34}],
    [together + 0.6, {pos: [-1.6, 1.15, -4.8], target: [-1.6, 1.75, -0.9], fov: 34}],
    [forty + 0.2, {pos: [-1.4, 1.9, -6.2], target: [-1.4, 1.45, -1.5], fov: 40}],
    [s.end, {pos: [-1.4, 1.85, -5.9], target: [-1.4, 1.45, -1.5], fov: 39}],
  ], EIO);
  const youHead = toScreen(cam, [you[0], 2.05, you[2]]);
  return (
    <AbsoluteFill>
      <Shake t={t} hits={[forty]} amp={20}>
        <Room t={t} cam={cam} travel={travel} full={0.25} glow={glow * 0.3}>
          <Speaker t={t} travel={t < forty ? travel : 0} pump={t < forty} position={SPEAKER_L} rotY={lerp(Math.PI / 2, Math.PI + 0.9, turnK)} pose={t > pair ? 'talk' : undefined} lean={glow * 0.2} mood={t > pair ? 'excited' : t > forty ? 'happy' : 'neutral'} talking={t > pair ? talk(t, pair, pair + 0.9, 2) : 0} glow={glow * 0.6} />
          <Character who="you" t={t} position={you} rotY={lerp(Math.PI - 0.3, 2.24, face)} pose={t < line(16).end ? 'talk' : t > pair ? 'idle' : 'hold'} talking={talk(t, line(16).start, line(16).end)} mood={t > pair ? 'excited' : 'happy'} look={t < together ? 0.6 : 0} hop={bob(0)} glow={glow * 0.3} />
          <Character who="stranger_a" t={t} position={nia} rotY={lerp(Math.PI - 0.3, 2.4, face)} pose="present" mood={t > pair ? 'excited' : 'happy'} look={t < together ? -0.4 : 0} hop={bob(2)} seed={3} glow={glow * 0.3}
            leftHand={<Notebook t={t} position={[0, -0.05, 0.05]} rotation={[0, 0, Math.PI / 2]} scale={0.9} glow={glow} />} />
          {t > forty && t < forty + 0.8 && <Dust t={t} k={p(t, forty, forty + 0.8)} position={[0, 0.5, PRESS_Z + 1]} spread={1.2} color="#9CA3AB" />}
          {glow > 0.05 && <pointLight position={[-1.4, 2.6, -1.4]} color="#FFF3D4" intensity={glow * 2} distance={5} />}
        </Room>
      </Shake>
      <QuoteBubble t={t} at={line(16).start} out={line(17).start - 0.1} speaker="you" text="Want to go ask him about that hiring bit together?" x={youHead[0]} y={youHead[1] - 10} side="left" width={700} tone="right" />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: walked in alone (top) / walked out with Nia (bottom) ----------
const Half: React.FC<{top: boolean; children: React.ReactNode}> = ({top, children}) => (
  <div style={{position: 'absolute', left: 0, width: 1080, top: top ? 0 : 960, height: 960, overflow: 'hidden'}}>
    <AbsoluteFill style={{top: -480, height: 1920}}>{children}</AbsoluteFill>
  </div>
);
const Split: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(7);
  const out = cue(7, 'out');
  const knows = cue(7, 'knows');
  const lit = p(t, out - 0.1, out + 0.5);
  const topCam: Cam = {pos: [0, 1.5, 4.8 - p(t, s.start, s.end, (x) => x) * 0.4], target: [0, 1.35, -1.0], fov: 34};
  const botCam: Cam = {pos: [0.5, 1.7, 6.2 - p(t, s.start, s.end, (x) => x) * 0.4], target: [0.35, 1.25, -0.6], fov: 40};
  const waveBack = t > knows;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Half top>
        <Stage t={t} cam={topCam} backdrop="dark" drain={0.6}>
          <Floor color="#7D5A4A" drain={0.6} />
          <Doorway position={[0, 0, -2.0]} light={0.5} drain={0.6} />
          <Character who="you" t={t} position={[0, 0, -1.05]} rotY={0} pose="idle" mood="neutral" lookUp={0.12} drain={0.6} talking={talk(t, line(19).start, line(19).end)} />
        </Stage>
      </Half>
      <Half top={false}>
        <Stage t={t} cam={botCam} backdrop="warm" glow={lit * 0.3} drain={0.5 * (1 - lit)}>
          <Floor color="#7D5A4A" drain={0.5 * (1 - lit)} />
          <Doorway position={[0, 0, -2.0]} light={0.4 + lit * 0.8} drain={0.5 * (1 - lit)} glow={lit * 0.3} />
          <Character who="you" t={t} position={[-0.35, 0, -1.15]} rotY={0.15} pose={t > out ? 'wave' : 'idle'} mood="excited" glow={lit * 0.5} drain={0.4 * (1 - lit)} />
          <Character who="stranger_a" t={t} position={[0.3, 0, -1.25]} rotY={-0.1} pose={t > out + 0.2 ? 'wave' : 'hold'} mood="happy" seed={3} glow={lit * 0.5} drain={0.4 * (1 - lit)} />
          <Character who="stranger_c" t={t} position={[1.25, 0, 0.6]} rotY={Math.PI + 0.5} pose={waveBack ? 'wave' : 'idle'} mood="happy" seed={5} glow={lit * 0.4} hop={waveBack ? Math.max(0, Math.sin((t - knows) * 6)) * 0.06 : 0} />
        </Stage>
      </Half>
      <div style={{position: 'absolute', left: 0, right: 0, top: 954, height: 12, background: C.white}} />
      <Pill t={t} at={s.start + 0.1} text="Walked in" y={190} cold />
      <Pill t={t} at={line(20).start} text="Walked out" y={1010} />
    </AbsoluteFill>
  );
};
const Pill: React.FC<{t: number; at: number; text: string; y: number; cold?: boolean}> = ({t, at, text, y, cold}) => {
  const k = clamp(spr(t, at));
  if (k <= 0.01) return null;
  return (
    <div style={{position: 'absolute', left: 90, top: y, transform: `scale(${k})`, transformOrigin: '0 50%', background: cold ? C.white : C.gold, borderRadius: 999, padding: '10px 30px', fontFamily: "'Antonio', sans-serif", fontWeight: 600, fontSize: 60, textTransform: 'uppercase', color: C.ink, boxShadow: '0 10px 30px rgba(31,32,35,0.12)'}}>
      {text}
    </div>
  );
};

// ---------- Shot 8: Jay vaults the seats onto the belt ----------
const JAY_SEAT = seatAt(3, 0, -1);
const Jay: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(8);
  const sprint = cue(8, 'sprints');
  const land = sprint + 0.55;
  const SPEED = 3.2;
  const travel = beltTravel(t, s.start, SPEED);
  // Jay's spot: seat → a hop onto the belt → riding it (world z = BELT_Z - local x) → the bin
  const beltX = BELT_Z - JAY_SEAT[2] + (t - land) * SPEED;
  let pos: V3 = JAY_SEAT;
  let rotY = Math.PI;
  if (t >= sprint && t < land) {
    const k = p(t, sprint, land, (x) => x);
    pos = [lerp(JAY_SEAT[0], 0, k), lerp(0.45, 0.32, k) + Math.sin(k * Math.PI) * 0.8, lerp(JAY_SEAT[2] - 0.12, JAY_SEAT[2] - 0.3, k)];
    rotY = Math.PI + 0.9;
  } else if (t >= land) {
    if (beltX <= 4) pos = [0, 0.32, BELT_Z - beltX];
    else {
      const d = conveyorDrop(beltX - 4);
      pos = [0, d[1], BELT_Z - d[0]];
    }
    rotY = Math.PI;
  }
  const stamped = t >= land && beltX >= 3.5;
  const cam = camPath(t, [
    [s.start, {pos: [-1.4, 4.4, 8.2], target: [-0.4, 0.6, 1.0], fov: 40}],
    [s.end, {pos: [-1.0, 4.0, 6.6], target: [-0.1, 0.6, -0.6], fov: 40}],
  ], EIO);
  const head = toScreen(cam, [JAY_SEAT[0], 1.9, JAY_SEAT[2]]);
  return (
    <AbsoluteFill>
      <Room t={t} cam={cam} travel={travel} full={0.5} clap={1}>
        <Speaker t={t} travel={travel} />
        {pos[2] > -3.1 && (
          <Character who="friend" t={t} position={pos} rotY={rotY} sit={t < sprint} pose={t < sprint ? 'idle' : t < land ? 'cheer' : 'idle'} mood={stamped ? 'shock' : 'excited'} seed={7}
            costume={stamped ? <mesh position={[0, 1.0, 0.3]}><planeGeometry args={[0.36, 0.18]} /><meshBasicMaterial color={C.red} /></mesh> : undefined} />
        )}
      </Room>
      <Label t={t} at={cue(8, 'friend')} out={sprint + 0.2} text="Jay" x={head[0]} y={head[1]} rise={110} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound ----------
const Sound: React.FC = () => {
  const {cue, shot, line} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="thud" at={cue(1, 'queue')} volume={0.4} />
      <Sfx name="whoosh" at={cue(1, 'Turn')} volume={0.3} />
      <Sfx name="whoosh" at={shot(2).start - 0.1} volume={0.3} />
      <Sfx name="pop" at={cue(2, 'rush')} volume={0.35} />
      <Sfx name="thud" at={cue(2, 'forty')} volume={0.4} />
      <Sfx name="buzzer" at={cue(2, 'handshake')} volume={0.3} />
      <Sfx name="whoosh" at={line(5).start - 0.1} volume={0.25} />
      <Sfx name="swell" at={cue(2, 'forgotten') - 0.3} volume={0.2} />
      <Sfx name="rewind" at={shot(3).start} volume={0.35} />
      <Sfx name="pop" at={cue(3, 'Nia')} volume={0.3} />
      <Sfx name="sparkle" at={cue(3, 'heard')} volume={0.3} />
      <Sfx name="pop" at={line(11).start} volume={0.3} />
      <Sfx name="click" at={cue(4, 'use')} volume={0.35} />
      <Sfx name="sparkle" at={cue(4, 'comparing')} volume={0.35} />
      <Sfx name="scratch" at={cue(5, 'speaker')} volume={0.4} />
      <Sfx name="pop" at={cue(5, 'can')} volume={0.4} />
      <Sfx name="ding" at={cue(5, 'alone')} volume={0.25} />
      <Sfx name="pop" at={line(16).start} volume={0.3} />
      <Sfx name="thud" at={cue(6, 'forty')} volume={0.45} />
      <Sfx name="swell" at={cue(6, 'pair') - 1.0} volume={0.3} />
      <Sfx name="ding" at={cue(6, 'pair')} volume={0.3} />
      <Sfx name="whoosh" at={shot(7).start - 0.1} volume={0.3} />
      <Sfx name="sparkle" at={cue(7, 'out')} volume={0.35} />
      <Sfx name="whoosh" at={shot(8).start - 0.1} volume={0.3} />
      <Sfx name="whoosh" at={cue(8, 'sprints')} volume={0.35} />
      <Sfx name="buzzer" at={cue(8, 'sprints') + 1.75} volume={0.25} />
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
          {id: 1, render: (tt) => <OffTheBelt t={tt} />},
          {id: 2, enter: 'whip', render: (tt) => <Processed t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <RewindToNia t={tt} />},
          {id: 4, enter: 'cut', render: (tt) => <NotesScene t={tt} />},
          {id: 5, render: (tt) => <NotesScene t={tt} />},
          {id: 6, enter: 'whip', render: (tt) => <BeltStops t={tt} />},
          {id: 7, enter: 'push', render: (tt) => <Split t={tt} />},
          {id: 8, enter: 'whip', render: (tt) => <Jay t={tt} />},
        ]}
      />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, shot(1).end]]} />
      <Grain />
      <Sound />
      {t > line(21).end + 0.1 && <AbsoluteFill style={{background: C.ink, opacity: p(t, line(21).end + 0.1, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
