// Talk-room sets and props: stage_talk, chairs, queue_conveyor, notebook, doorway, parking lot.
// Each export notes its library id. Like sets.tsx, every one takes drain/glow so the grammar works.
import React from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {Clay, tint} from './Stage';
import {useTextTexture} from './sets';
import {C} from '../tokens';
import {clamp, lerp} from '../time';

type D = {drain?: number; glow?: number};
type V3 = [number, number, number];

/** A folding chair. Seat top at y = 0.45, faces +z at rotY 0 (pair with <Character sit>). */
export const Chair: React.FC<D & {position?: V3; rotY?: number; color?: string}> = ({position = [0, 0, 0], rotY = 0, color = '#B4443A', drain = 0, glow = 0}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <RoundedBox args={[0.5, 0.07, 0.46]} radius={0.03} smoothness={3} position={[0, 0.415, 0.02]} castShadow receiveShadow userData={{clip: {kind: 'solid', name: 'chair seat'}}}>
      <Clay color={color} drain={drain} glow={glow} />
    </RoundedBox>
    <RoundedBox args={[0.5, 0.5, 0.06]} radius={0.03} smoothness={3} position={[0, 0.72, -0.27]} rotation={[-0.08, 0, 0]} castShadow userData={{clip: {kind: 'solid', name: 'chair back'}}}>
      <Clay color={color} drain={drain} glow={glow} />
    </RoundedBox>
    {[[-0.21, -0.18], [0.21, -0.18], [-0.21, 0.2], [0.21, 0.2]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.19, z]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.38, 8]} />
        <meshStandardMaterial color={tint('#2B2B2B', drain)} roughness={0.5} metalness={0.4} />
      </mesh>
    ))}
  </group>
);

/** A seated background person (simple, like <Crowd>), for filling chairs. */
const Sitter: React.FC<{position: V3; shade: string; rotY: number; bob: number}> = ({position, shade, rotY, bob}) => (
  <group position={[position[0], position[1] + bob, position[2]]} rotation={[0, rotY, 0]}>
    <group position={[0, 0.45, 0.08]} userData={{clip: {kind: 'body', name: 'audience', r: 0.24, h: 1.1, sit: true}}} />
    <mesh position={[0, 0.84, 0.08]} castShadow>
      <capsuleGeometry args={[0.24, 0.3, 8, 16]} />
      <meshStandardMaterial color={shade} roughness={0.6} />
    </mesh>
    <mesh position={[0, 1.33, 0.08]} castShadow>
      <sphereGeometry args={[0.22, 18, 14]} />
      <meshStandardMaterial color={shade} roughness={0.6} />
    </mesh>
  </group>
);

export type SeatSpot = {x: number; z: number};

/**
 * library: stage_talk. A talk room: a raised stage at the far end (front edge z = stageZ), a podium,
 * a screen with the talk title, and rows of chairs facing the stage (rows at z = 0, 1.1, 2.2, ...),
 * split by a centre aisle 1.3 wide. `filled(row, seat, side)` says which chairs have someone in them;
 * `clap` 0..1 makes the audience bob. Rows go left (side -1) and right (side 1) of the aisle.
 */
export const StageHall: React.FC<D & {t: number; rows?: number; seats?: number; stageZ?: number; title?: string; filled?: (row: number, seat: number, side: number) => boolean; clap?: number; skip?: (row: number, seat: number, side: number) => boolean}> = ({
  t, rows = 6, seats = 5, stageZ = -3.2, title = 'GROWTH 2026', filled = () => true, clap = 0, skip = () => false, drain = 0, glow = 0,
}) => {
  const screen = useTextTexture(title, '#FFFCF6', 512);
  const shades = ['#BFA98F', C.base3, '#D3C2AB', '#A99A8A'];
  return (
    <group>
      {/* carpet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[40, 64]} />
        <Clay color="#7D5A4A" drain={drain} glow={glow} rough={1} />
      </mesh>
      {/* stage */}
      <RoundedBox args={[9, 0.6, 3.2]} radius={0.06} smoothness={3} position={[0, 0.3, stageZ - 1.6]} castShadow receiveShadow userData={{clip: {kind: 'solid', name: 'stage'}}}>
        <Clay color="#3A332B" drain={drain} glow={glow} />
      </RoundedBox>
      <mesh position={[0, 0.605, stageZ - 1.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8.9, 3.1]} />
        <Clay color="#5A4A3C" drain={drain} glow={glow} />
      </mesh>
      {/* back wall and the talk screen */}
      <mesh position={[0, 3.5, stageZ - 3.3]} receiveShadow>
        <planeGeometry args={[16, 7]} />
        <Clay color="#2F2A33" drain={drain} glow={glow} />
      </mesh>
      <mesh position={[0, 2.9, stageZ - 3.25]}>
        <planeGeometry args={[4.4, 2.3]} />
        <meshStandardMaterial color={tint('#2F4A5C', drain)} emissive={tint('#2F4A5C', drain)} emissiveIntensity={0.55} />
      </mesh>
      <mesh position={[0, 2.95, stageZ - 3.24]}>
        <planeGeometry args={[3.4, 3.4]} />
        <meshBasicMaterial map={screen} transparent />
      </mesh>
      {/* podium */}
      <group position={[1.6, 0.6, stageZ - 1.0]} userData={{clip: {kind: 'solid', name: 'podium'}}}>
        <RoundedBox args={[0.7, 1.05, 0.5]} radius={0.04} smoothness={3} position={[0, 0.525, 0]} castShadow>
          <Clay color="#8A5A3C" drain={drain} glow={glow} />
        </RoundedBox>
        <mesh position={[0, 1.1, 0.1]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>
      {/* stage lights */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} position={[x, 5.4, stageZ + 0.6]}>
          <sphereGeometry args={[0.12, 12, 10]} />
          <meshStandardMaterial color={tint('#FFE2A8', drain)} emissive={tint('#FFC46B', drain)} emissiveIntensity={2} />
        </mesh>
      ))}
      <pointLight position={[0, 4.2, stageZ]} color={glow > 0 ? '#FFF3D4' : '#FFFFFF'} intensity={3 + glow * 5} distance={9} decay={1.6} />
      {/* chairs and audience */}
      {Array.from({length: rows}, (_, r) =>
        [-1, 1].flatMap((side) =>
          Array.from({length: seats}, (_, s) => {
            if (skip(r, s, side)) return null;
            const x = side * (0.65 + 0.3 + s * 0.7);
            const z = r * 1.1;
            const on = filled(r, s, side);
            const i = r * 20 + s * 2 + (side > 0 ? 1 : 0);
            return (
              <group key={`${r}-${side}-${s}`}>
                <Chair position={[x, 0, z]} rotY={Math.PI} drain={drain} glow={glow} />
                {on && <Sitter position={[x, 0, z + 0.02]} rotY={Math.PI + Math.sin(i) * 0.15} shade={tint(shades[i % 4], drain)} bob={clap * Math.abs(Math.sin(t * 9 + i)) * 0.05} />}
              </group>
            );
          }),
        ),
      )}
    </group>
  );
};

/** Seat position in a StageHall (the chair's centre). */
export const seatAt = (row: number, seat: number, side: number): V3 => [side * (0.65 + 0.3 + seat * 0.7), 0, row * 1.1];

/** A grey rider for the conveyor: a plain, featureless person, optionally stamped. */
const Rider: React.FC<{position: V3; shade: string; stamped: number; rot: [number, number, number]; drain: number}> = ({position, shade, stamped, rot, drain}) => (
  <group position={position} rotation={rot}>
    <mesh position={[0, 0.62, 0]} castShadow>
      <capsuleGeometry args={[0.22, 0.6, 8, 16]} />
      <meshStandardMaterial color={tint(shade, drain)} roughness={0.95} />
    </mesh>
    <mesh position={[0, 1.4, 0]} castShadow>
      <sphereGeometry args={[0.2, 18, 14]} />
      <meshStandardMaterial color={tint(shade, drain)} roughness={0.95} />
    </mesh>
    {stamped > 0 && (
      <mesh position={[0, 0.75, 0.215]} scale={stamped}>
        <planeGeometry args={[0.26, 0.14]} />
        <meshBasicMaterial color={C.red} transparent opacity={0.9} />
      </mesh>
    )}
  </group>
);

/**
 * library: queue_conveyor. A grey industrial belt along local +x, from x = -length/2 (start) to
 * +length/2 (the end, where the stamp press and the bin are). Belt top at y = 0.32.
 * `travel` = how far the belt has moved (metres); pass a value that stops growing to halt it.
 * `riders` = how many grey people ride it, `gap` metres apart; they get stamped at the press and
 * tip into the bin. `appear` 0..1 raises the belt out of the floor. `press` 0..1 overrides the press.
 * Riders are skipped while `hideRider(i)` is true (so a cast member can ride in their place).
 */
export const QueueConveyor: React.FC<D & {t: number; travel: number; length?: number; riders?: number; gap?: number; appear?: number; position?: V3; rotY?: number; hideRider?: (i: number) => boolean; label?: string}> = ({
  t, travel, length = 8, riders = 8, gap = 1.0, appear = 1, position = [0, 0, 0], rotY = 0, hideRider = () => false, label = 'HANDSHAKE', drain = 0, glow = 0,
}) => {
  const tex = useTextTexture(label, C.red, 512);
  if (appear <= 0.01) return null;
  const half = length / 2;
  const slats = Math.floor(length / 0.3);
  const pressX = half - 0.5;
  // press slams once per rider passing under it
  const phase = ((travel - (half + 0.4)) % gap + gap) % gap;
  const slam = phase < 0.18 ? 1 - phase / 0.18 : 0;
  const shades = ['#9AA3AD', '#A7ADB4', '#8E99A6', '#B3B8BE'];
  return (
    <group position={[position[0], position[1] - (1 - appear) * 0.5, position[2]]} rotation={[0, rotY, 0]}>
      {/* frame */}
      <RoundedBox args={[length, 0.24, 1.0]} radius={0.04} smoothness={3} position={[0, 0.16, 0]} castShadow receiveShadow userData={{clip: {kind: 'solid', name: 'belt'}}}>
        <meshStandardMaterial color={tint('#5A6068', drain)} metalness={0.5} roughness={0.45} />
      </RoundedBox>
      {/* moving slats */}
      {Array.from({length: slats}, (_, i) => {
        const x = ((((i * 0.3 + travel) % length) + length) % length) - half;
        return (
          <mesh key={i} position={[x, 0.3, 0]} receiveShadow>
            <boxGeometry args={[0.26, 0.03, 0.9]} />
            <meshStandardMaterial color={tint(i % 2 ? '#3B4148' : '#454B53', drain)} roughness={0.7} />
          </mesh>
        );
      })}
      {/* rollers at the ends and side rails */}
      {[-half, half].map((x) => (
        <mesh key={x} position={[x, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 1.02, 16]} />
          <meshStandardMaterial color={tint('#7D848C', drain)} metalness={0.6} roughness={0.35} />
        </mesh>
      ))}
      {[-0.52, 0.52].map((z) => (
        <mesh key={z} position={[0, 0.42, z]}>
          <boxGeometry args={[length, 0.06, 0.05]} />
          <meshStandardMaterial color={tint('#E2B23A', drain)} roughness={0.5} />
        </mesh>
      ))}
      {/* the stamp press */}
      <group position={[pressX, 0, 0]}>
        {[-0.6, 0.6].map((z) => (
          <mesh key={z} position={[0, 1.2, z]} castShadow userData={{clip: {kind: 'solid', name: 'press'}}}>
            <boxGeometry args={[0.12, 2.4, 0.12]} />
            <meshStandardMaterial color={tint('#5A6068', drain)} metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        <RoundedBox args={[0.5, 0.35, 1.3]} radius={0.04} position={[0, 2.35, 0]} castShadow>
          <meshStandardMaterial color={tint('#3B4148', drain)} metalness={0.4} roughness={0.5} />
        </RoundedBox>
        <group position={[0, 2.0 - slam * 0.45, 0]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.4, 10]} />
            <meshStandardMaterial color={tint('#9CA3AB', drain)} metalness={0.7} roughness={0.3} />
          </mesh>
          <RoundedBox args={[0.42, 0.14, 0.7]} radius={0.03}>
            <meshStandardMaterial color={tint(C.red, drain)} roughness={0.6} />
          </RoundedBox>
        </group>
        {/* sign */}
        <mesh position={[0, 2.35, 0.66]}>
          <planeGeometry args={[1.3, 1.3]} />
          <meshBasicMaterial map={tex} transparent />
        </mesh>
      </group>
      {/* the bin of identical grey faces */}
      <group position={[half + 0.75, 0, 0]}>
        <RoundedBox args={[1.1, 0.7, 1.2]} radius={0.05} position={[0, 0.35, 0]} castShadow receiveShadow userData={{clip: {kind: 'solid', name: 'bin'}}}>
          <meshStandardMaterial color={tint('#6B7480', drain)} metalness={0.3} roughness={0.6} />
        </RoundedBox>
        {Array.from({length: 9}, (_, i) => (
          <mesh key={i} position={[-0.32 + (i % 3) * 0.32, 0.72 + ((i * 7) % 3) * 0.03, -0.32 + Math.floor(i / 3) * 0.32]}>
            <sphereGeometry args={[0.16, 14, 10]} />
            <meshStandardMaterial color={tint('#A7ADB4', drain)} roughness={0.95} />
          </mesh>
        ))}
      </group>
      {/* riders */}
      {Array.from({length: riders}, (_, i) => {
        if (hideRider(i)) return null;
        const x = conveyorX(travel, i, length, gap);
        if (x === null) return null;
        const pos: V3 = x <= half ? [x, 0.32, 0] : conveyorDrop(x - half, length);
        const tip = x > half ? clamp((x - half) / 0.8) * 1.3 : 0;
        return <Rider key={i} position={pos} rot={[0, -Math.PI / 2, -tip]} shade={shades[i % 4]} stamped={x > pressX ? clamp((x - pressX) / 0.1) : 0} drain={drain} />;
      })}
      {glow > 0 && <pointLight position={[0, 1.5, 0]} color="#FFF3D4" intensity={glow * 2} distance={5} />}
    </group>
  );
};

/** Where rider i is along a conveyor's local x (null once it's gone into the bin). Riders start spread behind the belt start. */
export const conveyorX = (travel: number, i: number, length = 8, gap = 1.0): number | null => {
  const x = -length / 2 - 0.2 + travel - i * gap;
  if (x < -length / 2 - 0.2) return null;
  if (x > length / 2 + 1.0) return null;
  return x;
};

/** Where a rider `d` metres past the end of the belt is, falling in an arc into the bin (local coords). */
export const conveyorDrop = (d: number, length = 8): V3 => {
  const k = clamp(d / 1.0);
  return [length / 2 + lerp(0, 0.75, k), lerp(0.32, 0.88, k) + Math.sin(k * Math.PI) * 0.6, 0];
};

/**
 * library: notebook. A hand-sized notebook (pen clipped on). `open` 0..1 swings the cover,
 * `flutter` 0..1 lifts the pages, `glow` lights the underlined lines gold.
 * Lies flat at rotation 0; pass rotation to hold it up.
 */
export const Notebook: React.FC<D & {t: number; position?: V3; rotation?: [number, number, number]; open?: number; flutter?: number; scale?: number; cover?: string}> = ({
  t, position = [0, 0, 0], rotation = [0, 0, 0], open = 1, flutter = 0, scale = 1, cover = '#2F4A5C', drain = 0, glow = 0,
}) => (
  <group position={position} rotation={rotation} scale={scale} userData={{clip: {kind: 'solid', name: 'notebook'}}}>
    {/* back cover and page block (right side) */}
    <RoundedBox args={[0.3, 0.02, 0.4]} radius={0.008} position={[0.15, 0, 0]} castShadow>
      <Clay color={cover} drain={drain} />
    </RoundedBox>
    <mesh position={[0.15, 0.017, 0]}>
      <boxGeometry args={[0.28, 0.02, 0.38]} />
      <meshStandardMaterial color={tint('#FFFCF6', drain)} roughness={0.9} />
    </mesh>
    {/* lines on the right page, underlines glow */}
    {Array.from({length: 6}, (_, i) => (
      <mesh key={i} position={[0.15, 0.028, -0.13 + i * 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[i % 2 ? 0.2 : 0.23, i === 1 || i === 4 ? 0.012 : 0.006]} />
        <meshBasicMaterial color={i === 1 || i === 4 ? new THREE.Color(tint('#4A4037', drain)).lerp(new THREE.Color(C.gold), glow).getStyle() : tint('#9AA7B5', drain)} />
      </mesh>
    ))}
    {glow > 0.05 && <pointLight position={[0.15, 0.2, 0]} color="#FFF3D4" intensity={glow * 1.2} distance={0.9} />}
    {/* fluttering pages */}
    {flutter > 0 &&
      Array.from({length: 4}, (_, i) => {
        const a = clamp(flutter * 1.3 - i * 0.12) * Math.PI * (0.55 + 0.4 * Math.abs(Math.sin(t * 6 + i)));
        return (
          <group key={i} rotation={[0, 0, a]}>
            <mesh position={[0.14, 0.03 + i * 0.002, 0]}>
              <boxGeometry args={[0.28, 0.003, 0.37]} />
              <meshStandardMaterial color={tint('#FFFCF6', drain)} emissive={C.gold} emissiveIntensity={glow * 0.4} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    {/* front cover, hinged at x = 0 */}
    <group rotation={[0, 0, Math.PI * open * 0.98]}>
      <RoundedBox args={[0.3, 0.02, 0.4]} radius={0.008} position={[0.15, 0.03, 0]} castShadow>
        <Clay color={cover} drain={drain} />
      </RoundedBox>
    </group>
    {/* spine and pen */}
    <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.02, 0.02, 0.4, 10]} />
      <Clay color={cover} drain={drain} />
    </mesh>
    <mesh position={[0.31, 0.04, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 0.34, 8]} />
      <meshStandardMaterial color={tint(C.gold, drain)} metalness={0.5} roughness={0.3} />
    </mesh>
  </group>
);

/** library: doorway. An event entrance: a door frame with warm light spilling out. `light` 0..1. */
export const Doorway: React.FC<D & {position?: V3; rotY?: number; light?: number}> = ({position = [0, 0, 0], rotY = 0, light = 1, drain = 0, glow = 0}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <mesh position={[0, 2.5, -0.1]} receiveShadow>
      <planeGeometry args={[8, 5]} />
      <Clay color="#4A4037" drain={drain} glow={glow} />
    </mesh>
    <RoundedBox args={[1.5, 2.5, 0.16]} radius={0.04} position={[0, 1.25, 0]} castShadow>
      <Clay color="#7A4E30" drain={drain} glow={glow} />
    </RoundedBox>
    <mesh position={[0, 1.15, 0.09]}>
      <planeGeometry args={[1.15, 2.25]} />
      <meshBasicMaterial color={new THREE.Color(tint('#5A4A3C', drain)).lerp(new THREE.Color('#FFE3A0'), light * (1 - drain)).getStyle()} />
    </mesh>
    <mesh position={[0, 0.01, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[1.1, 32]} />
      <meshBasicMaterial color={C.goldGlow} transparent opacity={0.35 * light * (1 - drain)} depthWrite={false} />
    </mesh>
    <pointLight position={[0, 1.4, 0.8]} color="#FFF3D4" intensity={light * (1 - drain) * 3} distance={4} />
  </group>
);

/** A night car park: asphalt, bay lines, a few clay cars and lamp posts. */
export const ParkingLot: React.FC<D & {t: number}> = ({drain = 0}) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[40, 48]} />
      <Clay color="#3B3F47" drain={drain} rough={1} />
    </mesh>
    {Array.from({length: 9}, (_, i) => (
      <mesh key={i} position={[-6 + i * 1.5, 0.005, -2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 2.2]} />
        <meshBasicMaterial color={tint('#E9E4D8', drain)} />
      </mesh>
    ))}
    {[[-3.75, '#5E8A5B'], [-0.75, '#B4443A'], [2.25, '#2F4A5C'], [3.75, '#C9A04A']].map(([x, col], i) => (
      <group key={i} position={[x as number, 0, -2.6]}>
        <RoundedBox args={[1.2, 0.55, 2.0]} radius={0.15} smoothness={3} position={[0, 0.45, 0]} castShadow>
          <Clay color={col as string} drain={drain} />
        </RoundedBox>
        <RoundedBox args={[1.0, 0.42, 1.1]} radius={0.15} smoothness={3} position={[0, 0.88, -0.1]} castShadow>
          <meshStandardMaterial color={tint('#9FC4E8', drain)} roughness={0.2} />
        </RoundedBox>
        {[-0.45, 0.45].flatMap((wx) => [-0.65, 0.65].map((wz) => (
          <mesh key={`${wx}${wz}`} position={[wx * 1.25, 0.2, wz]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 0.2, 0.14, 16]} />
            <meshStandardMaterial color="#1E1E1E" />
          </mesh>
        )))}
      </group>
    ))}
    {[-5, 5].map((x) => (
      <group key={x} position={[x, 0, -4]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.05, 0.06, 4, 8]} />
          <meshStandardMaterial color="#2B2B2B" />
        </mesh>
        <mesh position={[0, 4.05, 0]}>
          <sphereGeometry args={[0.18, 12, 10]} />
          <meshBasicMaterial color="#FFE2A8" />
        </mesh>
        <pointLight position={[0, 3.8, 0.4]} color={tint('#FFD49A', drain)} intensity={5} distance={8} decay={1.6} />
      </group>
    ))}
  </group>
);

/** A rope (or any straight line) between two points. */
export const Rope: React.FC<{from: V3; to: V3; r?: number; color?: string; drain?: number}> = ({from, to, r = 0.02, color = '#C9A26A', drain = 0}) => {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const len = a.distanceTo(b);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
  return (
    <mesh position={mid.toArray() as V3} quaternion={q}>
      <cylinderGeometry args={[r, r, len, 8]} />
      <meshStandardMaterial color={tint(color, drain)} roughness={0.9} />
    </mesh>
  );
};

/** Belt travel that runs at `speed` m/s from `start`, and grinds to a stop over `stopDur` from `stopAt`. */
export const beltTravel = (t: number, start: number, speed: number, stopAt = Infinity, stopDur = 0.6) => {
  if (t < start) return 0;
  if (t < stopAt) return (t - start) * speed;
  const run = (stopAt - start) * speed;
  const k = clamp((t - stopAt) / stopDur);
  return run + speed * stopDur * (k - (k * k) / 2); // linear slow-down to zero
};

