// The cast: minimal pill figures (a sphere head over a capsule body, dot eyes, small arms only while
// gesturing). Light figures get a thin ink outline. Each root group is tagged for the clipping check.
import React from 'react';
import * as THREE from 'three';
import {C} from '../tokens';
import {clamp, wobble} from '../time';

export type CastId = 'you' | 'connector' | 'big_name' | 'friend' | 'stranger_a' | 'stranger_b' | 'stranger_c' | 'professor';
type Look = {top: string; outline?: boolean; glasses?: boolean; cap?: boolean; height: number; shiny?: boolean};

export const CAST: Record<CastId, Look> = {
  you: {top: '#FFFFFF', outline: true, height: 1},
  connector: {top: '#2B2C30', shiny: true, height: 1.04},
  big_name: {top: '#2B2C30', shiny: true, height: 1.0},
  friend: {top: '#8E9197', cap: true, height: 0.98},
  stranger_a: {top: '#C6C8CC', height: 0.96},
  stranger_b: {top: '#A3A6AB', height: 1.02},
  stranger_c: {top: '#5F6268', height: 1.0},
  professor: {top: '#FFFFFF', outline: true, glasses: true, height: 1.0},
};

export type Pose = 'idle' | 'talk' | 'wave' | 'point' | 'shrug' | 'phone' | 'hold' | 'cheer' | 'think' | 'lean' | 'swing' | 'cards' | 'present' | 'pocket';
export type Mood = 'happy' | 'neutral' | 'sad' | 'shock' | 'wince' | 'bored' | 'excited';

type ArmPose = {out: number; fwd: number; twist?: number};
// [left arm (character's left, viewer's right), right arm]. idle and pocket hide the arms.
const POSES: Record<Pose, (t: number, k: number) => [ArmPose, ArmPose]> = {
  idle: () => [{out: 0.1, fwd: 0}, {out: 0.1, fwd: 0}],
  pocket: () => [{out: 0.1, fwd: 0}, {out: 0.1, fwd: 0}],
  talk: (t) => [{out: 0.35, fwd: 0.7 + 0.25 * wobble(t, 2.2)}, {out: 0.3, fwd: 0.35 + 0.2 * wobble(t, 1.7, 1)}],
  wave: (t) => [{out: 0.3, fwd: 0.1}, {out: 2.5 + 0.3 * Math.sin(t * 9), fwd: 0.15}],
  point: () => [{out: 0.3, fwd: 0.1}, {out: 0.25, fwd: 1.5}],
  shrug: () => [{out: 1.0, fwd: 0.5}, {out: 1.0, fwd: 0.5}],
  phone: () => [{out: 0.35, fwd: 1.05}, {out: 0.35, fwd: 1.1}],
  hold: (t) => [{out: 0.3, fwd: 0.1 + 0.03 * wobble(t, 0.5)}, {out: 0.3, fwd: 1.0}],
  cheer: (t) => [{out: 2.6 + 0.08 * Math.sin(t * 7), fwd: 0.1}, {out: 2.6 + 0.08 * Math.sin(t * 7 + 1), fwd: 0.1}],
  think: () => [{out: 0.5, fwd: 0.9}, {out: 0.4, fwd: 2.1}],
  lean: () => [{out: 0.3, fwd: 1.25}, {out: 0.3, fwd: 1.35}],
  swing: (_t, k) => [{out: 0.3, fwd: 0.3}, {out: 1.1 - 0.85 * k, fwd: -0.2 + 1.8 * k, twist: -0.6 + 1.2 * k}],
  cards: () => [{out: 0.35, fwd: 1.2}, {out: 0.35, fwd: 1.25}],
  present: (t) => [{out: 0.65 + 0.05 * wobble(t, 1), fwd: 0.9}, {out: 0.3, fwd: 0.1}],
};
const ARMLESS: Pose[] = ['idle', 'pocket'];

export type CharacterProps = {
  who: CastId;
  t: number;
  position?: [number, number, number];
  rotY?: number; // which way the body faces (0 = camera, +z)
  pose?: Pose;
  poseK?: number;
  mood?: Mood;
  talking?: number; // 0..1 mouth open, use talk() from time.ts
  look?: number; // head turn, radians (+ = character's left)
  lookUp?: number; // head tilt, radians (+ = up)
  lean?: number; // whole figure pitch forward, radians
  hop?: number; // 0..1 jump height
  sit?: boolean; // seated on a chair whose seat top is at y = 0.45 (pair with <Chair>)
  drain?: number;
  glow?: number;
  frozen?: boolean;
  scale?: number;
  seed?: number;
  rightHand?: React.ReactNode;
  leftHand?: React.ReactNode;
  costume?: React.ReactNode; // extra meshes on the body (local coords, front is +z)
  sweat?: number;
};

/** Drain and glow on an exact colour (the cast keeps its own greys). */
const shade = (hex: string, drain = 0, glow = 0) => {
  const c = new THREE.Color(hex);
  if (drain > 0) c.lerp(new THREE.Color(C.cold), drain * 0.55);
  if (glow > 0) c.lerp(new THREE.Color('#FFF6D6'), glow * 0.3);
  return '#' + c.getHexString();
};

const Mat: React.FC<{color: string; shiny?: boolean; glow?: number}> = ({color, shiny, glow = 0}) => (
  <meshStandardMaterial color={color} roughness={shiny ? 0.32 : 0.55} metalness={0} emissive="#FFF3D4" emissiveIntensity={glow * 0.12} />
);
const Ink: React.FC = () => <meshBasicMaterial color={C.ink} side={THREE.BackSide} />;

const Face: React.FC<{mood: Mood; talking: number; blink: number; dark: boolean}> = ({mood, talking, blink, dark}) => {
  const ink = dark ? '#F4F4F2' : C.ink;
  const eyeY = mood === 'sad' ? 0.0 : 0.03;
  const sy = (mood === 'shock' ? 1.35 : mood === 'excited' ? 1.15 : mood === 'bored' ? 0.4 : mood === 'wince' ? 0.3 : 1) * blink;
  const r = mood === 'shock' ? 0.036 : 0.03;
  const mouth = () => {
    if (talking > 0.05 || mood === 'shock') {
      const open = mood === 'shock' ? 0.8 : talking;
      return (
        <mesh position={[0, -0.09, 0.262]} scale={[1, 0.4 + open * 0.8, 0.4]}>
          <sphereGeometry args={[0.035, 14, 10]} />
          <meshBasicMaterial color={ink} />
        </mesh>
      );
    }
    if (mood === 'happy' || mood === 'excited') {
      return (
        <mesh position={[0, -0.06, 0.262]} rotation={[0.25, 0, Math.PI]}>
          <torusGeometry args={[0.05, 0.008, 6, 18, Math.PI]} />
          <meshBasicMaterial color={ink} />
        </mesh>
      );
    }
    if (mood === 'sad' || mood === 'wince') {
      return (
        <mesh position={[0, -0.11, 0.258]} rotation={[0.25, 0, 0]}>
          <torusGeometry args={[0.04, 0.008, 6, 18, Math.PI]} />
          <meshBasicMaterial color={ink} />
        </mesh>
      );
    }
    return null;
  };
  return (
    <group>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, eyeY, 0.262]} scale={[1, sy, 0.5]}>
          <sphereGeometry args={[r, 14, 10]} />
          <meshBasicMaterial color={ink} />
        </mesh>
      ))}
      {mouth()}
    </group>
  );
};

const Arm: React.FC<{side: 1 | -1; pose: ArmPose; color: string; shiny?: boolean; glow: number; outline?: boolean; hand?: React.ReactNode; y: number}> = ({side, pose, color, shiny, glow, outline, hand, y}) => (
  <group position={[side * 0.27, y, 0]} rotation={[-pose.fwd, side * (pose.twist ?? 0), side * pose.out]}>
    <mesh position={[0, -0.17, 0]} castShadow>
      <capsuleGeometry args={[0.06, 0.24, 6, 12]} />
      <Mat color={color} shiny={shiny} glow={glow} />
    </mesh>
    {outline && (
      <mesh position={[0, -0.17, 0]} scale={1.12}>
        <capsuleGeometry args={[0.06, 0.24, 6, 12]} />
        <Ink />
      </mesh>
    )}
    <group position={[0, -0.36, 0]}>{hand}</group>
  </group>
);

export const Character: React.FC<CharacterProps> = ({
  who, t, position = [0, 0, 0], rotY = 0, pose = 'idle', poseK = 0, mood = 'happy', talking = 0, look = 0, lookUp = 0, lean = 0, hop = 0,
  sit = false, drain = 0, glow = 0, frozen = false, scale = 1, seed = 0, rightHand, leftHand, costume, sweat = 0,
}) => {
  const L = CAST[who];
  const tt = frozen ? 0 : t;
  const breathe = frozen ? 0 : Math.sin(tt * 2.2 + seed) * 0.008;
  const sway = frozen ? 0 : wobble(tt, 0.5, seed) * 0.02;
  const blinkPhase = (tt + seed * 0.37) % 3.7;
  const blink = frozen ? 1 : blinkPhase < 0.12 ? clamp(Math.abs(blinkPhase - 0.06) / 0.06, 0.1, 1) : 1;
  const color = shade(L.top, drain, glow);
  const dark = new THREE.Color(L.top).getHSL({h: 0, s: 0, l: 0}).l < 0.4;
  // Body: capsule r 0.29. Standing: bottom at 0.1 (on its feet), top at 1.1, head centre 1.44. Seated: bottom on the seat.
  const R = 0.29;
  const len = sit ? 0.08 : 0.42;
  const bottom = sit ? 0.45 : 0.1;
  const bodyY = bottom + R + len / 2;
  const top = bodyY + len / 2 + R;
  const headR = 0.29;
  const headY = top + 0.05 + headR + breathe;
  const fwdZ = sit ? 0.09 : 0; // seated: sit forward off the backrest
  const [la, ra] = POSES[pose](tt + seed, poseK);
  const arms = !ARMLESS.includes(pose) || !!rightHand || !!leftHand;
  const headDown = pose === 'phone' ? -0.35 : 0;
  const headLook = look + (frozen ? 0 : wobble(tt, 0.4, seed + 3) * 0.05);
  const s = L.height * scale;
  return (
    <group position={[position[0], position[1] + hop * 0.6, position[2]]} rotation={[0, rotY, sway]} scale={[s, s, s]}>
      <group position={[0, bottom, fwdZ]} userData={{clip: {kind: 'body', name: who, r: R, h: headY + headR - bottom, sit}}} />
      {/* feet */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.11, 0.045, sit ? 0.42 : 0.05]} scale={[1, 0.5, 1.3]} castShadow>
          <sphereGeometry args={[0.085, 14, 10]} />
          <Mat color={color} shiny={L.shiny} glow={glow} />
        </mesh>
      ))}
      <group position={[0, bottom, fwdZ]} rotation={[lean, 0, 0]}>
        <group position={[0, -bottom, 0]}>
          {/* body */}
          <mesh position={[0, bodyY, 0]} castShadow>
            <capsuleGeometry args={[R, len, 12, 28]} />
            <Mat color={color} shiny={L.shiny} glow={glow} />
          </mesh>
          {L.outline && (
            <mesh position={[0, bodyY, 0]} scale={[1.035, 1.025, 1.035]}>
              <capsuleGeometry args={[R, len, 12, 28]} />
              <Ink />
            </mesh>
          )}
          {costume && <group position={[0, bodyY - 0.69, 0]}>{costume}</group>}
          {arms && (
            <>
              <Arm side={1} pose={la} color={color} shiny={L.shiny} glow={glow} outline={L.outline} hand={leftHand} y={top - 0.2} />
              <Arm side={-1} pose={ra} color={color} shiny={L.shiny} glow={glow} outline={L.outline} hand={rightHand} y={top - 0.2} />
            </>
          )}
          {/* head */}
          <group position={[0, headY, 0.01]} rotation={[-lookUp - headDown, headLook, 0]}>
            <mesh castShadow>
              <sphereGeometry args={[headR, 36, 28]} />
              <Mat color={color} shiny={L.shiny} glow={glow} />
            </mesh>
            {L.outline && (
              <mesh scale={1.045}>
                <sphereGeometry args={[headR, 36, 28]} />
                <Ink />
              </mesh>
            )}
            <Face mood={mood} talking={talking} blink={blink} dark={dark} />
            {L.glasses && (
              <group position={[0, 0.03, 0.258]}>
                {[-0.09, 0.09].map((x) => (
                  <mesh key={x} position={[x, 0, 0]}>
                    <torusGeometry args={[0.055, 0.009, 8, 24]} />
                    <meshBasicMaterial color={C.ink} />
                  </mesh>
                ))}
              </group>
            )}
            {L.cap && (
              <group>
                <mesh position={[0, 0.06, 0]} rotation={[-0.15, 0, 0]}>
                  <sphereGeometry args={[headR * 1.03, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
                  <meshStandardMaterial color={shade('#2B2C30', drain)} roughness={0.5} />
                </mesh>
                <mesh position={[0, 0.13, 0.22]} rotation={[0.35, 0, 0]} scale={[1, 0.1, 0.9]}>
                  <cylinderGeometry args={[0.17, 0.17, 0.12, 24, 1, false, -Math.PI / 2, Math.PI]} />
                  <meshStandardMaterial color={shade('#2B2C30', drain)} roughness={0.5} />
                </mesh>
              </group>
            )}
            {sweat > 0 && (
              <mesh position={[0.2, 0.12 - sweat * 0.22, 0.17]} scale={[1, 1.4, 1]}>
                <sphereGeometry args={[0.03, 12, 10]} />
                <meshStandardMaterial color="#9FC4E8" transparent opacity={0.85} roughness={0.1} />
              </mesh>
            )}
          </group>
        </group>
      </group>
    </group>
  );
};

/** Background people: plain grey pills, no faces. */
export const Crowd: React.FC<{t: number; spots: [number, number][]; drain?: number; frozen?: boolean; seed?: number; color?: string}> = ({t, spots, drain = 0, frozen = false, seed = 0}) => (
  <group>
    {spots.map(([x, z], i) => {
      const tt = frozen ? 0 : t;
      const h = 0.92 + ((i * 37 + seed) % 10) / 60;
      const c = shade(['#D3D4D7', '#C2C4C8', '#B1B3B8'][(i + seed) % 3], drain);
      return (
        <group key={i} position={[x, Math.abs(Math.sin(tt * 1.6 + i)) * 0.015, z]} rotation={[0, Math.sin(i * 1.3) * 0.8, 0]} scale={[h, h, h]} userData={{clip: {kind: 'body', name: 'crowd', r: 0.25, h: 1.75}}}>
          <mesh position={[0, 0.7, 0]} castShadow>
            <capsuleGeometry args={[0.25, 0.6, 8, 18]} />
            <meshStandardMaterial color={c} roughness={0.6} />
          </mesh>
          <mesh position={[0, 1.5, 0]} castShadow>
            <sphereGeometry args={[0.24, 20, 16]} />
            <meshStandardMaterial color={c} roughness={0.6} />
          </mesh>
        </group>
      );
    })}
  </group>
);
