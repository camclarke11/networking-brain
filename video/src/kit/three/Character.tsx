// The locked 3D cast (knowledge/12-visual-storyboard.md §2), built from rounded clay shapes.
// Faces, bodies and outfits never change between videos. Costumes are separate props.
import React from 'react';
import {Clay, tint} from './Stage';
import {C} from '../tokens';
import {clamp, lerp, wobble} from '../time';

export type CastId = 'you' | 'connector' | 'big_name' | 'friend' | 'stranger_a' | 'stranger_b' | 'stranger_c' | 'professor';
type Hair = 'short' | 'bun' | 'long' | 'cap' | 'curly' | 'swoop';
type Top = 'hoodie' | 'blazer' | 'tee' | 'labcoat' | 'blouse' | 'sweater';

type Look = {skin: string; hair: string; hairStyle: Hair; top: string; top2?: string; topStyle: Top; legs: string; shoes: string; height: number; glasses?: boolean; build?: number};

export const CAST: Record<CastId, Look> = {
  you: {skin: '#E9B88E', hair: '#2E221A', hairStyle: 'swoop', top: '#E9A93A', top2: '#C9860F', topStyle: 'hoodie', legs: '#3B342D', shoes: '#FFFCF6', height: 1},
  connector: {skin: '#C38A5E', hair: '#1D1510', hairStyle: 'short', top: '#2F4A5C', top2: '#F4EDE2', topStyle: 'blazer', legs: '#26313A', shoes: '#3A2A20', height: 1.05},
  big_name: {skin: '#F1C8A5', hair: '#6A3D24', hairStyle: 'bun', top: '#B4443A', top2: '#EADFD2', topStyle: 'blouse', legs: '#2A2522', shoes: '#2A2522', height: 1.0},
  friend: {skin: '#8C5A3C', hair: '#1A1411', hairStyle: 'cap', top: '#4E9F8A', top2: '#D9483B', topStyle: 'tee', legs: '#5B6F86', shoes: '#F2EEE6', height: 0.98},
  stranger_a: {skin: '#D9A27A', hair: '#3A2216', hairStyle: 'long', top: '#9B6BA6', topStyle: 'sweater', legs: '#3B3440', shoes: '#EDE5DA', height: 0.96},
  stranger_b: {skin: '#A8714E', hair: '#231812', hairStyle: 'curly', top: '#5E8A5B', topStyle: 'tee', legs: '#3D3A33', shoes: '#2B2B2B', height: 1.02},
  stranger_c: {skin: '#F2D2B8', hair: '#C9A26A', hairStyle: 'short', top: '#8A909A', topStyle: 'sweater', legs: '#4A4540', shoes: '#4A4540', height: 1.0},
  professor: {skin: '#E7BE98', hair: '#9A938C', hairStyle: 'curly', top: '#FFFCF6', top2: '#5B6F86', topStyle: 'labcoat', legs: '#3D3A36', shoes: '#3D3A36', height: 1.0, glasses: true},
};

export type Pose = 'idle' | 'talk' | 'wave' | 'point' | 'shrug' | 'phone' | 'hold' | 'cheer' | 'think' | 'lean' | 'swing' | 'cards' | 'present' | 'pocket';
export type Mood = 'happy' | 'neutral' | 'sad' | 'shock' | 'wince' | 'bored' | 'excited';

type ArmPose = {out: number; fwd: number; twist?: number};
// [left arm (character's left, viewer's right), right arm]
const POSES: Record<Pose, (t: number, k: number) => [ArmPose, ArmPose]> = {
  idle: (t) => [{out: 0.13 + 0.02 * wobble(t, 0.6), fwd: 0.06}, {out: 0.13 + 0.02 * wobble(t, 0.6, 2), fwd: 0.06}],
  talk: (t) => [{out: 0.28, fwd: 0.75 + 0.25 * wobble(t, 2.2)}, {out: 0.22, fwd: 0.35 + 0.2 * wobble(t, 1.7, 1)}],
  wave: (t) => [{out: 0.15, fwd: 0.08}, {out: 2.55 + 0.3 * Math.sin(t * 9), fwd: 0.15}],
  point: () => [{out: 0.15, fwd: 0.1}, {out: 0.18, fwd: 1.5}],
  shrug: () => [{out: 0.85, fwd: 0.55}, {out: 0.85, fwd: 0.55}],
  phone: () => [{out: 0.32, fwd: 1.05}, {out: 0.32, fwd: 1.1}],
  hold: (t) => [{out: 0.14, fwd: 0.08 + 0.03 * wobble(t, 0.5)}, {out: 0.22, fwd: 1.0}],
  cheer: (t) => [{out: 2.7 + 0.08 * Math.sin(t * 7), fwd: 0.1}, {out: 2.7 + 0.08 * Math.sin(t * 7 + 1), fwd: 0.1}],
  think: () => [{out: 0.5, fwd: 0.9}, {out: 0.35, fwd: 2.1}],
  lean: () => [{out: 0.2, fwd: 1.25}, {out: 0.2, fwd: 1.35}],
  // k = swing phase 0..1 (backswing → follow-through), for paddles and throws
  swing: (_t, k) => [{out: 0.25, fwd: 0.3}, {out: lerp(1.1, 0.25, k), fwd: lerp(-0.2, 1.6, k), twist: lerp(-0.6, 0.6, k)}],
  cards: () => [{out: 0.3, fwd: 1.2}, {out: 0.3, fwd: 1.25}],
  present: (t) => [{out: 0.6 + 0.05 * wobble(t, 1), fwd: 0.9}, {out: 0.15, fwd: 0.1}],
  pocket: () => [{out: 0.1, fwd: -0.15}, {out: 0.2, fwd: 0.95}],
};

export type CharacterProps = {
  who: CastId;
  t: number;
  position?: [number, number, number];
  rotY?: number; // which way the body faces (0 = camera)
  pose?: Pose;
  poseK?: number; // extra pose parameter (swing phase)
  mood?: Mood;
  talking?: number; // 0..1 mouth open, use talk() from time.ts
  look?: number; // head turn, radians (+ = character's left)
  lookUp?: number; // head tilt, radians (+ = up)
  lean?: number; // torso pitch forward, radians
  hop?: number; // 0..1 jump height
  drain?: number;
  glow?: number;
  frozen?: boolean; // stop idle motion (freeze frame)
  scale?: number;
  seed?: number;
  rightHand?: React.ReactNode; // a prop held in the right hand
  leftHand?: React.ReactNode;
  costume?: React.ReactNode; // extra meshes on the body (hats, aprons)
  sweat?: number;
};

const Eye: React.FC<{x: number; blink: number; mood: Mood; drain: number}> = ({x, blink, mood, drain}) => {
  const sy = mood === 'shock' ? 1.3 : mood === 'bored' ? 0.45 : mood === 'excited' ? 1.15 : 1;
  return (
    <group position={[x, 0.04, 0.3]}>
      <mesh scale={[1, sy * blink, 0.55]}>
        <sphereGeometry args={[0.048, 20, 16]} />
        <meshStandardMaterial color={tint('#1A1512', drain)} roughness={0.3} />
      </mesh>
      <mesh position={[0.016, 0.018 * sy, 0.022]} scale={[1, blink, 1]}>
        <sphereGeometry args={[0.012, 10, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const Mouth: React.FC<{mood: Mood; talking: number; drain: number}> = ({mood, talking, drain}) => {
  const ink = tint('#3A1F1A', drain);
  if (talking > 0.05 || mood === 'shock') {
    const open = mood === 'shock' ? 1 : talking;
    return (
      <mesh position={[0, -0.12, 0.3]} scale={[1, 0.35 + open * 0.9, 0.4]}>
        <sphereGeometry args={[0.055, 20, 14]} />
        <meshStandardMaterial color={ink} roughness={0.5} />
      </mesh>
    );
  }
  const smile = mood === 'happy' || mood === 'excited' ? 1 : mood === 'sad' || mood === 'wince' ? -1 : 0;
  if (smile === 0)
    return (
      <mesh position={[0, -0.115, 0.31]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.012, 0.07, 6, 10]} />
        <meshStandardMaterial color={ink} />
      </mesh>
    );
  return (
    <mesh position={[0, smile > 0 ? -0.09 : -0.14, 0.305]} rotation={[0, 0, smile > 0 ? Math.PI : 0]}>
      <torusGeometry args={[0.055, 0.013, 8, 20, Math.PI]} />
      <meshStandardMaterial color={ink} />
    </mesh>
  );
};

const Brow: React.FC<{x: number; mood: Mood; color: string; drain: number}> = ({x, mood, color, drain}) => {
  const side = Math.sign(x);
  const tilt = mood === 'sad' || mood === 'wince' ? -0.35 : mood === 'shock' || mood === 'excited' ? 0.15 : mood === 'bored' ? 0.05 : 0.08;
  const y = mood === 'shock' || mood === 'excited' ? 0.15 : mood === 'bored' ? 0.09 : 0.125;
  return (
    <mesh position={[x, y, 0.305]} rotation={[0, 0, Math.PI / 2 + side * tilt]}>
      <capsuleGeometry args={[0.014, 0.06, 6, 10]} />
      <meshStandardMaterial color={tint(color, drain)} roughness={0.8} />
    </mesh>
  );
};

const HairMesh: React.FC<{style: Hair; color: string; accent?: string; drain: number}> = ({style, color, accent, drain}) => {
  const m = <Clay color={color} drain={drain} rough={0.9} />;
  const cap = (
    <mesh position={[0, 0.03, -0.02]} rotation={[-0.25, 0, 0]} castShadow>
      <sphereGeometry args={[0.355, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
      {m}
    </mesh>
  );
  switch (style) {
    case 'swoop':
      return (
        <group>
          {cap}
          <mesh position={[0.08, 0.27, 0.16]} rotation={[0.5, 0.3, -0.5]} castShadow>
            <capsuleGeometry args={[0.09, 0.18, 8, 16]} />
            {m}
          </mesh>
        </group>
      );
    case 'bun':
      return (
        <group>
          {cap}
          <mesh position={[0, 0.3, -0.2]} castShadow>
            <sphereGeometry args={[0.12, 20, 16]} />
            {m}
          </mesh>
        </group>
      );
    case 'long':
      return (
        <group>
          {cap}
          <mesh position={[0, -0.04, -0.26]} scale={[1.0, 1, 0.4]} castShadow>
            <capsuleGeometry args={[0.28, 0.3, 10, 20]} />
            {m}
          </mesh>
        </group>
      );
    case 'cap':
      return (
        <group>
          <mesh position={[0, 0.05, 0]} rotation={[-0.1, 0, 0]} castShadow>
            <sphereGeometry args={[0.36, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <Clay color={accent ?? '#D9483B'} drain={drain} />
          </mesh>
          <mesh position={[0, 0.17, 0.3]} rotation={[0.25, 0, 0]} scale={[1, 0.12, 1]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.1, 24, 1, false, -Math.PI / 2, Math.PI]} />
            <Clay color={accent ?? '#D9483B'} drain={drain} />
          </mesh>
        </group>
      );
    case 'curly':
      return (
        <group>
          {cap}
          {[[-0.22, 0.2, 0.05], [0.22, 0.2, 0.05], [0, 0.3, 0.08], [-0.12, 0.3, -0.12], [0.12, 0.3, -0.12], [-0.28, 0.05, -0.05], [0.28, 0.05, -0.05]].map((pp, i) => (
            <mesh key={i} position={pp as [number, number, number]} castShadow>
              <sphereGeometry args={[0.11, 14, 12]} />
              {m}
            </mesh>
          ))}
        </group>
      );
    case 'short':
    default:
      return cap;
  }
};

const Arm: React.FC<{side: 1 | -1; pose: ArmPose; sleeve: string; skin: string; drain: number; glow: number; hand?: React.ReactNode}> = ({side, pose, sleeve, skin, drain, glow, hand}) => (
  <group position={[side * 0.31, 1.2, 0]} rotation={[-pose.fwd, side * (pose.twist ?? 0), side * pose.out]}>
    <mesh position={[0, -0.24, 0]} castShadow>
      <capsuleGeometry args={[0.085, 0.32, 8, 16]} />
      <Clay color={sleeve} drain={drain} glow={glow} />
    </mesh>
    <group position={[0, -0.5, 0]}>
      <mesh castShadow>
        <sphereGeometry args={[0.085, 16, 12]} />
        <Clay color={skin} drain={drain} glow={glow} />
      </mesh>
      {hand}
    </group>
  </group>
);

export const Character: React.FC<CharacterProps> = ({
  who, t, position = [0, 0, 0], rotY = 0, pose = 'idle', poseK = 0, mood = 'happy', talking = 0, look = 0, lookUp = 0, lean = 0, hop = 0,
  drain = 0, glow = 0, frozen = false, scale = 1, seed = 0, rightHand, leftHand, costume, sweat = 0,
}) => {
  const L = CAST[who];
  const tt = frozen ? 0 : t;
  const breathe = frozen ? 0 : Math.sin(tt * 2.2 + seed) * 0.012;
  const sway = frozen ? 0 : wobble(tt, 0.5, seed) * 0.025;
  const blinkPhase = (tt + seed * 0.37) % 3.7;
  const blink = frozen ? 1 : blinkPhase < 0.12 ? clamp(Math.abs(blinkPhase - 0.06) / 0.06, 0.1, 1) : 1;
  const shoulders = pose === 'shrug' ? 0.06 : 0;
  const [la, ra] = POSES[pose](tt + seed, poseK);
  const headLook = look + (frozen ? 0 : wobble(tt, 0.4, seed + 3) * 0.06);
  const headDown = pose === 'phone' ? -0.35 : 0;
  const sleeve = L.topStyle === 'labcoat' ? L.top : L.topStyle === 'blazer' ? L.top : L.top;
  const s = L.height * scale;
  const y = hop * 0.6;

  return (
    <group position={[position[0], position[1] + y, position[2]]} rotation={[0, rotY, sway]} scale={[s, s, s]}>
      {/* legs and shoes */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.13, 0, 0]}>
          <mesh position={[0, 0.38, 0]} castShadow>
            <capsuleGeometry args={[0.11, 0.42, 8, 16]} />
            <Clay color={L.legs} drain={drain} glow={glow} />
          </mesh>
          <mesh position={[0, 0.07, 0.06]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.7]} castShadow>
            <capsuleGeometry args={[0.1, 0.12, 8, 16]} />
            <Clay color={L.shoes} drain={drain} glow={glow} />
          </mesh>
        </group>
      ))}
      {/* upper body pivots at the hips so it can lean */}
      <group position={[0, 0.62, 0]} rotation={[lean, 0, 0]}>
        <group position={[0, -0.62 + breathe + shoulders, 0]}>
          {/* torso */}
          <mesh position={[0, 1.0, 0]} scale={[1.08, 1, 0.82]} castShadow>
            <capsuleGeometry args={[0.3, 0.38, 12, 24]} />
            <Clay color={L.top} drain={drain} glow={glow} />
          </mesh>
          {L.topStyle === 'hoodie' && (
            <>
              <mesh position={[0, 1.33, -0.1]} rotation={[1.2, 0, 0]} castShadow>
                <torusGeometry args={[0.19, 0.075, 12, 24]} />
                <Clay color={L.top} drain={drain} glow={glow} />
              </mesh>
              <mesh position={[0, 0.86, 0.225]} scale={[1.1, 0.5, 0.18]}>
                <sphereGeometry args={[0.16, 20, 12]} />
                <Clay color={L.top2 ?? L.top} drain={drain} glow={glow} />
              </mesh>
              {[-0.06, 0.06].map((x) => (
                <mesh key={x} position={[x, 1.17, 0.25]}>
                  <capsuleGeometry args={[0.01, 0.12, 4, 8]} />
                  <Clay color={C.white} drain={drain} />
                </mesh>
              ))}
            </>
          )}
          {L.topStyle === 'blazer' && (
            <mesh position={[0, 1.05, 0.2]} scale={[0.35, 1, 0.3]}>
              <capsuleGeometry args={[0.28, 0.3, 8, 16]} />
              <Clay color={L.top2 ?? C.white} drain={drain} glow={glow} />
            </mesh>
          )}
          {L.topStyle === 'labcoat' && (
            <>
              <mesh position={[0, 0.78, 0]} scale={[1.12, 1, 0.86]} castShadow>
                <cylinderGeometry args={[0.33, 0.37, 0.4, 24]} />
                <Clay color={L.top} drain={drain} glow={glow} />
              </mesh>
              <mesh position={[0, 1.05, 0.22]} scale={[0.3, 1, 0.3]}>
                <capsuleGeometry args={[0.28, 0.3, 8, 16]} />
                <Clay color={L.top2 ?? C.cold} drain={drain} glow={glow} />
              </mesh>
            </>
          )}
          {L.topStyle === 'blouse' && (
            <mesh position={[0, 1.3, 0.14]} rotation={[0.5, 0, 0]}>
              <torusGeometry args={[0.13, 0.03, 8, 20]} />
              <Clay color={L.top2 ?? C.white} drain={drain} />
            </mesh>
          )}
          {costume}
          <Arm side={1} pose={la} sleeve={sleeve} skin={L.skin} drain={drain} glow={glow} hand={leftHand} />
          <Arm side={-1} pose={ra} sleeve={sleeve} skin={L.skin} drain={drain} glow={glow} hand={rightHand} />
          {/* head */}
          <group position={[0, 1.66, 0.02]} rotation={[-lookUp - headDown, headLook, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[0.34, 40, 32]} />
              <Clay color={L.skin} drain={drain} glow={glow} rough={0.7} />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={side} position={[side * 0.33, -0.01, 0]} scale={[0.5, 1, 0.8]}>
                <sphereGeometry args={[0.07, 12, 10]} />
                <Clay color={L.skin} drain={drain} glow={glow} />
              </mesh>
            ))}
            <mesh position={[0, -0.03, 0.335]}>
              <sphereGeometry args={[0.04, 12, 10]} />
              <Clay color={tint(L.skin, 0.0)} drain={drain} glow={glow} rough={0.6} />
            </mesh>
            {[-1, 1].map((side) => (
              <mesh key={'ch' + side} position={[side * 0.19, -0.07, 0.27]} scale={[1, 0.6, 0.3]}>
                <sphereGeometry args={[0.055, 12, 10]} />
                <meshStandardMaterial color={tint('#F08A7A', drain)} transparent opacity={0.45} roughness={1} />
              </mesh>
            ))}
            <Eye x={-0.11} blink={blink} mood={mood} drain={drain} />
            <Eye x={0.11} blink={blink} mood={mood} drain={drain} />
            <Brow x={-0.11} mood={mood} color={L.hair} drain={drain} />
            <Brow x={0.11} mood={mood} color={L.hair} drain={drain} />
            <Mouth mood={mood} talking={talking} drain={drain} />
            {L.glasses && (
              <group position={[0, 0.04, 0.31]}>
                {[-0.11, 0.11].map((x) => (
                  <mesh key={x} position={[x, 0, 0]}>
                    <torusGeometry args={[0.07, 0.012, 8, 24]} />
                    <meshStandardMaterial color={tint('#2A2420', drain)} roughness={0.4} />
                  </mesh>
                ))}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <capsuleGeometry args={[0.008, 0.06, 4, 8]} />
                  <meshStandardMaterial color={tint('#2A2420', drain)} />
                </mesh>
              </group>
            )}
            {sweat > 0 && (
              <mesh position={[0.24, 0.12 - sweat * 0.25, 0.22]} scale={[1, 1.4, 1]}>
                <sphereGeometry args={[0.035, 12, 10]} />
                <meshStandardMaterial color="#9FD3F0" transparent opacity={0.85} roughness={0.1} />
              </mesh>
            )}
            <HairMesh style={L.hairStyle} color={L.hair} accent={L.top2} drain={drain} />
          </group>
        </group>
      </group>
    </group>
  );
};

/** Simple background people for busy rooms. */
export const Crowd: React.FC<{t: number; spots: [number, number][]; drain?: number; frozen?: boolean; seed?: number; color?: string}> = ({t, spots, drain = 0, frozen = false, seed = 0, color = C.base3}) => (
  <group>
    {spots.map(([x, z], i) => {
      const tt = frozen ? 0 : t;
      const h = 0.92 + ((i * 37 + seed) % 10) / 60;
      const shade = tint(i % 3 === 0 ? '#BFA98F' : i % 3 === 1 ? color : '#D3C2AB', drain);
      return (
        <group key={i} position={[x, Math.abs(Math.sin(tt * 1.6 + i)) * 0.02, z]} rotation={[0, Math.sin(i * 1.3) * 0.8 + (frozen ? 0 : Math.sin(tt * 0.5 + i) * 0.1), 0]} scale={[h, h, h]}>
          <mesh position={[0, 0.75, 0]} castShadow>
            <capsuleGeometry args={[0.28, 0.75, 8, 16]} />
            <meshStandardMaterial color={shade} roughness={0.95} />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <sphereGeometry args={[0.27, 20, 16]} />
            <meshStandardMaterial color={shade} roughness={0.95} />
          </mesh>
        </group>
      );
    })}
  </group>
);
