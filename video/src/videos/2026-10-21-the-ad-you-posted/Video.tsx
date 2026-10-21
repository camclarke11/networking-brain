// "The ad you posted" (scripts/2026-10-21-the-ad-you-posted.md).
// Metaphor: a billboard made of people. Everyone in a crowd holds up their own recap card, and the cards line up
// into one giant billboard nobody paid for. Every time comes from the narration (cue / word / line / shot).
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {BigText, Captions, Label, XCheck} from '../../kit/ui';
import {Grain, Sfx, Vignette} from '../../kit/fx';
import {Timeline} from '../../kit/Timeline';
import {TimingProvider, useT, useTiming} from '../../kit/timing';
import {Cam, camPath, Floor, Stage, toScreen} from '../../kit/three/Stage';
import {Character, Crowd} from '../../kit/three/Character';
import {Phone} from '../../kit/three/sets';
import {Billboard, Laptop, PriceTag, StoreTable, useCanvas} from '../../kit/three/brand';
import {StandCard} from '../../kit/three/shop';
import {clamp, EIO, EO, lerp, p} from '../../kit/time';
import {C, FONT} from '../../kit/tokens';
import timing from './timing.json';

const SLUG = '2026-10-21-the-ad-you-posted';
type V3 = [number, number, number];
const HeldPhone: React.FC = () => <Phone position={[0.02, -0.04, 0.08]} rotation={[1.45, 0, 0]} scale={1.1} />;

// ---------------------------------------------------------------------------------------------
// The recap card (library: recap_card): a 9:16 story card in bold colour blocks. One drawing for 3D textures.
type RecapKind = 'year' | 'artists' | 'minutes' | 'song' | 'you' | 'taste' | 'weird' | 'client' | 'report';
const BG: Record<RecapKind, string> = {year: C.gold, artists: C.ink, minutes: '#FFFFFF', song: C.gold, you: C.ink, taste: C.ink, weird: C.gold, client: '#FFFFFF', report: '#E3E4E7'};
const drawRecap = (ctx: CanvasRenderingContext2D, w: number, h: number, kind: RecapKind, rows = 3) => {
  const ink = kind === 'artists' || kind === 'you' || kind === 'taste' ? '#FFFFFF' : C.ink;
  ctx.fillStyle = BG[kind];
  ctx.fillRect(0, 0, w, h);
  const title = (txt: string, y: number, size: number, col = ink) => {
    ctx.fillStyle = col;
    ctx.font = `700 ${size}px "Antonio", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    txt.split('\n').forEach((l, i) => ctx.fillText(l, w / 2, y + i * size * 1.02));
  };
  const bars = (y0: number, n: number, col: string) => {
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = i === 0 ? C.gold : col;
      ctx.fillRect(w * 0.14, y0 + i * h * 0.085, w * (0.72 - i * 0.09), h * 0.05);
    }
  };
  const face = (cx: number, cy: number, r: number, blush = false) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = r * 0.08;
    ctx.stroke();
    ctx.fillStyle = C.ink;
    [-1, 1].forEach((s) => {
      ctx.beginPath();
      ctx.arc(cx + s * r * 0.32, cy - r * 0.05, r * 0.09, 0, Math.PI * 2);
      ctx.fill();
    });
    if (blush) {
      ctx.fillStyle = 'rgba(229,72,77,0.55)';
      [-1, 1].forEach((s) => {
        ctx.beginPath();
        ctx.ellipse(cx + s * r * 0.5, cy + r * 0.25, r * 0.16, r * 0.1, 0, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  };
  if (kind === 'year') title('YOUR\nYEAR', h * 0.38, h * 0.16);
  if (kind === 'artists') { title('TOP 5\nARTISTS', h * 0.2, h * 0.1); bars(h * 0.45, 5, '#5B5D62'); }
  if (kind === 'minutes') { title('MINUTES\nLISTENED', h * 0.25, h * 0.1); title('48,213', h * 0.62, h * 0.15, C.goldDeep); }
  if (kind === 'song') { title('TOP\nSONG', h * 0.22, h * 0.11); face(w / 2, h * 0.65, w * 0.22, true); }
  if (kind === 'you') { face(w / 2, h * 0.36, w * 0.26); title('YOUR\nYEAR', h * 0.7, h * 0.09); }
  if (kind === 'taste') { face(w / 2, h * 0.2, w * 0.13); title('YOUR TASTE', h * 0.38, h * 0.075); bars(h * 0.5, 4, '#5B5D62'); }
  if (kind === 'weird') { face(w / 2, h * 0.2, w * 0.13, true); title('TOP GENRE', h * 0.42, h * 0.075); title('SEA\nSHANTIES', h * 0.58, h * 0.12); }
  if (kind === 'client') {
    title('YOUR\nMONTH', h * 0.15, h * 0.09);
    const lines = ['41 NEW LEADS', 'REACH UP 3X', 'BEFORE → AFTER'];
    lines.slice(0, rows).forEach((l, i) => {
      ctx.fillStyle = i === 0 ? C.gold : C.base2;
      ctx.fillRect(w * 0.08, h * (0.38 + i * 0.17), w * 0.84, h * 0.13);
      title(l, h * (0.445 + i * 0.17), h * 0.06, C.ink);
    });
  }
  if (kind === 'report') {
    title('REPORT.PDF', h * 0.12, h * 0.07, C.ink2);
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = '#C9C9C6';
      ctx.fillRect(w * 0.12, h * (0.24 + i * 0.07), w * (0.76 - (i % 3) * 0.12), h * 0.025);
    }
    title('PAGE 1 OF 14', h * 0.9, h * 0.04, C.ink2);
  }
};

/** A recap card standing in 3D (0.56 × 1.0 at scale 1), facing +z. */
const RecapCard3D: React.FC<{kind: RecapKind; position?: V3; rotation?: [number, number, number]; scale?: number; rows?: number; flip?: number; back?: RecapKind}> = ({kind, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, rows = 3, flip = 0, back}) => {
  const shown = back && flip >= 0.5 ? back : kind;
  const tex = useCanvas(`recap:${shown}:${rows}`, (ctx, w, h) => drawRecap(ctx, w, h, shown, rows), 540, 960);
  const sy = back ? Math.max(0.02, Math.abs(Math.cos(flip * Math.PI))) : 1;
  return (
    <group position={position} rotation={rotation} scale={[scale, scale * sy, scale]}>
      <RoundedBox args={[0.6, 1.04, 0.03]} radius={0.04} smoothness={3} castShadow>
        <meshStandardMaterial color={C.ink} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.016]}>
        <planeGeometry args={[0.56, 1.0]} />
        <meshBasicMaterial map={tex} />
      </mesh>
    </group>
  );
};

/** The 2D story card for the opening (the same drawing, as a flat overlay with story bars). */
const StoryCard: React.FC<{kind: RecapKind; enter: number; leave: number; index: number; t: number}> = ({kind, enter, leave, index, t}) => {
  const tex = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = 540;
    cv.height = 960;
    drawRecap(cv.getContext('2d')!, 540, 960, kind);
    return cv.toDataURL();
  }, [kind]);
  const kIn = p(t, enter - 0.25, enter + 0.05, EO);
  const kOut = p(t, leave - 0.15, leave + 0.15, EIO);
  if (kIn <= 0 || kOut >= 1) return null;
  const x = lerp(80, 0, kIn) + lerp(0, -80, kOut);
  return (
    <div data-ui="StoryCard" style={{position: 'absolute', left: 540 - 230 + x, top: 230, width: 460, height: 818, borderRadius: 34, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,0.18)', background: C.ink, opacity: kIn * (1 - kOut), transform: `scale(${lerp(0.94, 1, kIn) * lerp(1, 0.94, kOut)})`}}>
      <img src={tex} style={{width: '100%', height: '100%', display: 'block'}} />
      <div style={{position: 'absolute', left: 18, right: 18, top: 16, display: 'flex', gap: 8}}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{flex: 1, height: 7, borderRadius: 4, background: i < index ? 'rgba(255,255,255,0.95)' : i === index ? `linear-gradient(90deg, rgba(255,255,255,0.95) ${clamp((t - enter) / 2.2) * 100}%, rgba(255,255,255,0.4) 0)` : 'rgba(255,255,255,0.4)', mixBlendMode: 'difference'}} />
        ))}
      </div>
      <div style={{position: 'absolute', left: 22, top: 38, fontFamily: FONT.ui, fontWeight: 700, fontSize: 22, color: BG[kind] === C.ink ? '#FFFFFF' : C.ink, opacity: 0.8}}>@someone</div>
    </div>
  );
};

// ---------- Shot 1: the same screenshot ----------
const SameScreenshot: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(1);
  const cards: {kind: RecapKind; at: number}[] = [
    {kind: 'year', at: cue(1, 'screenshot')},
    {kind: 'artists', at: line(2).start},
    {kind: 'minutes', at: line(3).start},
    {kind: 'song', at: line(4).start},
  ];
  const cam = camPath(t, [[s.start, {pos: [0, 2.2, 3.6], target: [0, 2.45, 0], fov: 40}], [s.end, {pos: [0, 2.15, 3.3], target: [0, 2.4, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <Character who="you" t={t} position={[0, 0, 0]} pose="phone" mood={t > cue(1, 'embarrassing') ? 'excited' : 'happy'} rightHand={<HeldPhone />} />
      </Stage>
      {cards.map((c, i) => (
        <StoryCard key={i} t={t} kind={c.kind} enter={c.at} leave={cards[i + 1]?.at ?? s.end + 1} index={i} />
      ))}
    </AbsoluteFill>
  );
};

// ---------- Shot 2: not one of them paid ----------
const NotOnePaid: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(2);
  const pay = cue(2, 'pay');
  const posts = cue(2, 'posts');
  const fan = p(t, posts - 0.2, posts + 0.6, EO);
  const kinds: RecapKind[] = ['artists', 'minutes', 'song'];
  const cam = camPath(t, [[s.start, {pos: [0, 1.45, 3.7], target: [0, 1.3, 0], fov: 40}], [s.end, {pos: [0, 1.42, 3.4], target: [0, 1.3, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        {kinds.map((k, i) => {
          const off = (i - 1) * lerp(0.08, 0.3, fan);
          return (
            <group key={i}>
              <RecapCard3D kind={k} position={[off, 1.15, -i * 0.06]} rotation={[0, 0, -(i - 1) * lerp(0.05, 0.12, fan)]} scale={0.9} />
              <PriceTag text="$0" position={[off + 0.08, 1.82, 0.05 - i * 0.06]} string={0.12} scale={0.42 * p(t, pay - 0.2 + i * 0.12, pay + 0.2 + i * 0.12, EO)} swing={0.06 * Math.sin(t * 2 + i)} />
            </group>
          );
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 3: it's an ad, posted by you ----------
const ItsAnAd: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(3);
  const recap = cue(3, 'recap');
  const ad = cue(3, 'ad');
  const posted = line(8).start;
  const flip = p(t, ad - 0.25, ad + 0.15, EIO);
  const pull = p(t, posted - 0.5, posted + 0.4, EIO);
  const cam: Cam = {pos: [0, lerp(1.95, 1.7, pull), lerp(2.3, 4.4, pull)], target: [0, lerp(1.95, 1.45, pull), 0], fov: 40};
  const head = toScreen(cam, [0, 1.76, 0.0]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StandCard text={'FAN\nRECAP'} back="AD" position={[0, 1.6, 0.35]} size={[0.7, 0.62]} stand={0} flip={flip} pop={p(t, recap - 0.4, recap, EO)} glow={flip > 0.5 ? 0.5 : 0} />
        <Character who="you" t={t} position={[0, 0, 0]} pose={pull > 0.3 ? 'cheer' : 'idle'} mood="happy" />
      </Stage>
      <Label t={t} at={posted} out={s.end} text="Posted by you" x={head[0]} y={head[1] + 140} rise={30} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Shot 4: it's about you ----------
const AboutYou: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(4);
  const happy = cue(4, 'happy');
  const you = cue(4, 'you');
  const taste = cue(4, 'taste');
  const weird = cue(4, 'weird');
  const kind: RecapKind = t > weird ? 'weird' : t > taste ? 'taste' : t > you ? 'you' : 'year';
  const turn = p(t, you - 0.5, you, EIO);
  const cam = camPath(t, [[s.start, {pos: [0.9, 1.6, 3.6], target: [0.15, 1.35, 0], fov: 40}], [s.end, {pos: [0.45, 1.55, 3.0], target: [0.1, 1.4, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <RecapCard3D kind={kind} position={[0.35, 1.45, 0.1]} rotation={[0, lerp(-0.9, -0.15, turn), 0]} scale={1.05} />
        <Character who="you" t={t} position={[-0.45, 0, 0.2]} rotY={0.6} pose="present" mood={t > weird ? 'excited' : t > happy ? 'happy' : 'neutral'} />
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 5: a billboard made of people (screenshot moment) ----------
const COLS = 7;
const ROWS = 8;
const TILE_W = 0.62;
const TILE_H = 0.5;
const SEATS = Array.from({length: COLS * ROWS}, (_, i) => {
  const c = i % COLS;
  const r = Math.floor(i / COLS);
  return {c, r, x: (c - (COLS - 1) / 2) * TILE_W, y: r * 0.5, z: -r * 0.62};
});
const TILE_KINDS: RecapKind[] = ['year', 'artists', 'minutes', 'song', 'weird', 'taste'];

/** One card in the stunt: before `flip` it shows its own recap; after, its slice of the big picture. */
const StuntTile: React.FC<{seat: (typeof SEATS)[number]; big: THREE.Texture; flip: number; glow: number; lift: number}> = ({seat, big, flip, glow, lift}) => {
  const own = useCanvas(`tile:${TILE_KINDS[(seat.c * 3 + seat.r * 5) % TILE_KINDS.length]}`, (ctx, w, h) => drawRecap(ctx, w, h, TILE_KINDS[(seat.c * 3 + seat.r * 5) % TILE_KINDS.length]), 270, 480);
  const slice = useMemo(() => {
    const tx = big.clone();
    tx.needsUpdate = true;
    tx.repeat.set(1 / COLS, 1 / ROWS);
    tx.offset.set(seat.c / COLS, seat.r / ROWS);
    return tx;
  }, [big, seat.c, seat.r]);
  const showBig = flip >= 0.5;
  const sy = Math.max(0.03, Math.abs(Math.cos(flip * Math.PI)));
  const y = seat.y + lerp(1.55, 2.1, lift);
  return (
    <group position={[seat.x, y, seat.z + 0.05]} rotation={[-0.12, 0, 0]} scale={[1, sy, 1]}>
      <mesh>
        <planeGeometry args={showBig ? [TILE_W * 0.97, TILE_H * 0.97] : [0.3, 0.5]} />
        <meshBasicMaterial map={showBig ? slice : own} color={showBig ? new THREE.Color('#FFFFFF').lerp(new THREE.Color(C.goldGlow), glow * 0.4) : '#FFFFFF'} />
      </mesh>
    </group>
  );
};

const PeopleBillboard: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, word, line} = useTiming();
  const s = shot(5);
  const share = cue(5, 'share');
  const y2022 = cue(5, '2022');
  const n156 = word('156', line(15).start);
  const friends = cue(5, 'friends');
  const lift = p(t, share - 0.2, share + 0.6, EO);
  const crane = p(t, y2022 - 1.0, n156, EIO);
  const glow = p(t, friends - 0.2, friends + 0.5);
  const cam: Cam = {pos: [0, lerp(1.7, 4.1, crane), lerp(2.6, 11.8, crane)], target: [0, lerp(1.9, 3.55, crane), lerp(-1.0, -2.1, crane)], fov: 40};
  const big = useCanvas('stunt:156', (ctx, w, h) => {
    ctx.fillStyle = C.ink;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = C.gold;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `700 ${h * 0.42}px "Antonio", sans-serif`;
    ctx.fillText('156', w / 2, h * 0.34);
    ctx.font = `700 ${h * 0.24}px "Antonio", sans-serif`;
    ctx.fillText('MILLION', w / 2, h * 0.74);
  }, COLS * 120, ROWS * 97);
  const crowdSpots = SEATS.filter((st) => !(st.r === 0 && st.c === 3)).map((st) => [st.x, st.z] as [number, number]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm" glow={glow * 0.2} fog={null}>
        <Floor />
        {/* bleachers: each row stands a step higher */}
        {Array.from({length: ROWS}, (_, r) => (
          <mesh key={r} position={[0, r * 0.25, -r * 0.62 - 0.05]} receiveShadow userData={{noClip: true}}>
            <boxGeometry args={[COLS * TILE_W + 0.4, r * 0.5 + 0.001, 0.62]} />
            <meshStandardMaterial color="#E3E4E7" roughness={0.9} />
          </mesh>
        ))}
        {Array.from({length: ROWS}, (_, r) => (
          <group key={r} position={[0, r * 0.5, 0]}>
            <Crowd t={t} spots={crowdSpots.filter(([, z]) => Math.abs(z + r * 0.62) < 0.01)} seed={r} />
          </group>
        ))}
        <Character who="you" t={t} position={[SEATS[3].x, 0, SEATS[3].z]} pose="cheer" mood="excited" />
        {SEATS.map((st, i) => {
          // flip from the bottom-left corner outwards, like a stadium card stunt
          const f = p(t, n156 - 0.2 + (st.c + (ROWS - 1 - st.r)) * 0.045, n156 + 0.15 + (st.c + (ROWS - 1 - st.r)) * 0.045);
          return <StuntTile key={i} seat={{...st, r: st.r}} big={big} flip={f} glow={glow} lift={lift} />;
        })}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 6: your client's recap ----------
const ClientRecap: React.FC<{t: number}> = ({t}) => {
  const {cue, shot, line} = useTiming();
  const s = shot(6);
  const results = cue(6, 'results');
  const numbers = cue(6, 'numbers');
  const after = cue(6, 'after');
  const rows = t > after ? 3 : t > numbers ? 2 : t > results ? 1 : 0;
  const post = p(t, after + 0.1, after + 0.5, EO);
  const cam = camPath(t, [[s.start, {pos: [0.4, 1.75, 4.6], target: [0.2, 1.35, 0], fov: 40}], [s.end, {pos: [0.35, 1.7, 4.2], target: [0.2, 1.35, 0], fov: 40}]]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[-0.2, 0, 0.2]} length={1.2} depth={0.6} />
        <Laptop position={[-0.2, 0.92, 0.2]} rotY={Math.PI} openDeg={105} />
        <Character who="you" t={t} position={[-0.2, 0, -0.45]} pose="lean" mood="happy" />
        <RecapCard3D kind="client" rows={rows} position={[0.42, 1.55, 0.35]} rotation={[0, -0.2, 0]} scale={1.0} />
        <Character who="stranger_a" t={t} position={[1.0, 0, -0.35]} rotY={-0.5} pose={post > 0.2 ? 'cheer' : 'idle'} mood={post > 0.2 ? 'excited' : 'neutral'} seed={4} hop={post > 0 && post < 1 ? 0.08 * Math.sin(post * Math.PI) : 0} />
      </Stage>
      <XCheck t={t} at={line(17).start + 0.4} out={s.end} wrong="Monthly report, page 1 of 14" right="Your month, made to post" rightAt={results} y={230} />
    </AbsoluteFill>
  );
};

// ---------- Shot 7: an ad versus you ----------
const AdVsYou: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(7);
  const ad = cue(7, 'ad');
  const themselves = cue(7, 'themselves');
  const walk = p(t, s.start, s.end, (k) => k);
  const gather = p(t, themselves - 0.4, themselves + 0.6, EIO);
  const cam: Cam = {pos: [0.0, 2.0, 7.4], target: [0.0, 1.45, 0], fov: 40};
  const fans: [number, number][] = [[0.2, 0.15], [1.4, 0.15], [0.8, 0.75]];
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <group position={[-0.7, 0, -1.0]} scale={1.35}><Billboard text="BUY OUR STUFF" /></group>
        <Character who="stranger_b" t={t} position={[lerp(-2.2, -0.55, walk), 0, 0.3]} rotY={Math.PI / 2} pose="idle" mood="bored" seed={9} look={t > ad ? -0.4 : 0} />
        <Character who="stranger_a" t={t} position={[0.8, 0, -0.45]} pose="cheer" mood="excited" seed={4} />
        <RecapCard3D kind="weird" position={[0.8, 2.3, -0.4]} scale={0.6} />
        {fans.map(([x, z], i) => (
          <Character key={i} who={i === 1 ? 'stranger_c' : 'stranger_b'} t={t} position={[lerp(x + 1.3, x, gather), 0, lerp(z + 0.9, z, gather)]} rotY={Math.atan2(0.8 - x, -0.45 - z)} pose="idle" mood={gather > 0.6 ? 'excited' : 'neutral'} seed={i + 11} />
        ))}
      </Stage>
    </AbsoluteFill>
  );
};

// ---------- Shot 8: Jay's report ----------
const JaysReport: React.FC<{t: number}> = ({t}) => {
  const {cue, shot} = useTiming();
  const s = shot(8);
  const boring = cue(8, 'boring');
  const month = cue(8, 'month');
  const send = p(t, s.start + 0.3, s.start + 1.2, EIO);
  const down = p(t, month - 0.2, month + 0.3, EIO);
  const cam: Cam = {pos: [0.0, 1.8, 6.0], target: [0.0, 1.35, 0], fov: 40};
  const head = toScreen(cam, [-0.62, 1.76, -0.6]);
  return (
    <AbsoluteFill>
      <Stage t={t} cam={cam} backdrop="warm">
        <Floor />
        <StoreTable position={[-0.62, 0, 0]} length={1.0} depth={0.6} />
        <Laptop position={[-0.62, 0.92, 0.05]} rotY={Math.PI} openDeg={105} />
        <Character who="friend" t={t} position={[-0.62, 0, -0.6]} pose="lean" mood="neutral" seed={7} />
        <RecapCard3D kind="report" position={[lerp(-0.62, 0.3, send), lerp(1.55, 1.85, Math.sin(send * Math.PI)) + 0.25 * send, 0.35]} scale={lerp(0.5, 0.7, send)} rotation={[0, 0, lerp(0, -0.1, send)]} />
        <Character who="stranger_b" t={t} position={[0.75, 0, -0.35]} rotY={-0.4} pose={down > 0.5 ? 'idle' : 'phone'} mood={t > boring ? 'bored' : 'neutral'} seed={9}
          rightHand={down < 0.5 ? <HeldPhone /> : undefined} lookUp={t > boring ? 0.3 : 0} />
        {down > 0.5 && <Phone position={[0.95, 0.02, 0.2]} rotation={[Math.PI / 2, 0, 0.3]} scale={1.2} />}
      </Stage>
      <Label t={t} at={s.start + 0.6} text="Jay" x={head[0]} y={head[1]} rise={50} color={C.gold} />
    </AbsoluteFill>
  );
};

// ---------- Sound (quiet) ----------
const Sound: React.FC = () => {
  const {cue, word, line} = useTiming();
  return (
    <>
      <Audio src={staticFile(`${SLUG}/voice.mp3`)} />
      <Sfx name="whoosh" at={cue(1, 'screenshot') - 0.2} volume={0.05} />
      <Sfx name="whoosh" at={line(2).start - 0.2} volume={0.05} />
      <Sfx name="whoosh" at={line(3).start - 0.2} volume={0.05} />
      <Sfx name="whoosh" at={line(4).start - 0.2} volume={0.05} />
      <Sfx name="pop" at={cue(2, 'pay')} volume={0.07} />
      <Sfx name="click" at={cue(3, 'ad') - 0.15} volume={0.1} />
      <Sfx name="swell" at={word('156', line(15).start) - 0.3} volume={0.07} />
      <Sfx name="ding" at={cue(5, 'friends')} volume={0.07} />
      <Sfx name="pop" at={cue(6, 'results')} volume={0.07} />
      <Sfx name="pop" at={cue(6, 'numbers')} volume={0.07} />
      <Sfx name="pop" at={cue(6, 'after')} volume={0.07} />
    </>
  );
};

const Edit: React.FC = () => {
  const t = useT();
  const {words, shot, line, cue, timing: tm} = useTiming();
  return (
    <AbsoluteFill style={{background: C.base}}>
      <Timeline
        shots={[
          {id: 1, render: (tt) => <SameScreenshot t={tt} />},
          {id: 2, enter: 'cut', render: (tt) => <NotOnePaid t={tt} />},
          {id: 3, enter: 'cut', render: (tt) => <ItsAnAd t={tt} />},
          {id: 4, enter: 'cut', render: (tt) => <AboutYou t={tt} />},
          {id: 5, enter: 'push', render: (tt) => <PeopleBillboard t={tt} />},
          {id: 6, enter: 'fade', render: (tt) => <ClientRecap t={tt} />},
          {id: 7, enter: 'cut', render: (tt) => <AdVsYou t={tt} />},
          {id: 8, enter: 'cut', render: (tt) => <JaysReport t={tt} />},
        ]}
      />
      <BigText t={t} at={0.13} out={cue(1, 'screenshot') - 0.2} text="Every story, the same screenshot" highlight="same" y={220} size={92} />
      <Vignette />
      <Captions t={t} words={words} lineBreaks={tm.lines.map((l) => l.start ?? -1)} hide={[[0, cue(1, 'screenshot') - 0.2]]} />
      <Grain />
      <Sound />
      {t > line(23).end + 0.15 && <AbsoluteFill style={{background: C.base, opacity: p(t, line(23).end + 0.15, tm.duration)}} />}
    </AbsoluteFill>
  );
};

export const Video: React.FC = () => (
  <TimingProvider timing={timing as never}>
    <Edit />
  </TimingProvider>
);

export {timing};
