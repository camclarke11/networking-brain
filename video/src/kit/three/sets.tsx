// Built sets and props from visuals/library.json. Each export notes its library id.
// When you build a new asset, add it here (or in props.tsx), then run
// `python3 tools/library.py status <id> built` so later scripts know they can reuse it.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {Clay, tint} from './Stage';
import {C} from '../tokens';

type D = {drain?: number; glow?: number};

/** library: drink_glass */
export const DrinkGlass: React.FC<D & {fill?: string; scale?: number; position?: [number, number, number]}> = ({fill = '#F2B33D', drain = 0, scale = 1, position = [0, 0, 0]}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.09, 0]}>
      <cylinderGeometry args={[0.065, 0.05, 0.18, 20, 1, true]} />
      <meshPhysicalMaterial color="#ffffff" transparent opacity={0.35} roughness={0.05} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.058, 0.048, 0.11, 20]} />
      <meshStandardMaterial color={tint(fill, drain)} transparent opacity={0.85} roughness={0.2} />
    </mesh>
  </group>
);

/** library: phone */
export const Phone: React.FC<D & {screen?: string; position?: [number, number, number]; rotation?: [number, number, number]; scale?: number}> = ({screen = '#9FC4E8', drain = 0, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <RoundedBox args={[0.13, 0.24, 0.02]} radius={0.015} smoothness={3} castShadow>
      <meshStandardMaterial color={tint('#25211D', drain)} roughness={0.4} />
    </RoundedBox>
    <mesh position={[0, 0, 0.011]}>
      <planeGeometry args={[0.11, 0.21]} />
      <meshStandardMaterial color={tint(screen, drain)} emissive={screen} emissiveIntensity={0.6 * (1 - drain)} />
    </mesh>
  </group>
);

/** A cocktail high table: thin pedestal, round top at y = 1.1 (part of event_hall). */
export const HighTable: React.FC<D & {position?: [number, number, number]; cloth?: string; glasses?: number}> = ({position = [0, 0, 0], cloth = '#FFFCF6', drain = 0, glow = 0, glasses = 2}) => (
  <group position={position} userData={{clip: {kind: 'solid', name: 'table'}}}>
    <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.26, 0.3, 0.06, 28]} />
      <Clay color="#3A332B" drain={drain} />
    </mesh>
    <mesh position={[0, 0.55, 0]} castShadow>
      <cylinderGeometry args={[0.035, 0.035, 1.05, 12]} />
      <Clay color="#3A332B" drain={drain} />
    </mesh>
    <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.36, 0.36, 0.05, 32]} />
      <Clay color={cloth} drain={drain} glow={glow} />
    </mesh>
    {Array.from({length: glasses}, (_, i) => (
      <DrinkGlass key={i} drain={drain} position={[Math.cos(i * 2.4) * 0.2, 1.125, Math.sin(i * 2.4) * 0.2]} fill={i % 2 ? '#E8C27A' : '#C9475A'} />
    ))}
  </group>
);

/** library: event_hall. Floor, warm string lights, high tables. Pair with <Stage backdrop="event">. */
export const EventHall: React.FC<D & {t: number; tables?: [number, number][]}> = ({t, drain = 0, glow = 0, tables = [[-3.2, -3], [3.4, -4.5], [-1.5, -7], [2.2, -9]]}) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[40, 64]} />
      <Clay color="#C9A98A" drain={drain} rough={0.9} />
    </mesh>
    {/* string lights across the back */}
    {[-10, -14].map((z, row) =>
      Array.from({length: 18}, (_, i) => {
        const x = -9 + i;
        const y = 4.2 - Math.cos(((i - 8.5) / 8.5) * 1.2) * 0.6 + row * 0.6;
        const on = 0.75 + 0.25 * Math.sin(t * 2 + i * 1.7 + row);
        return (
          <mesh key={`${row}-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <meshStandardMaterial color={tint('#FFE2A8', drain)} emissive={tint('#FFC46B', drain)} emissiveIntensity={2.2 * on * (1 - drain * 0.7)} />
          </mesh>
        );
      }),
    )}
    {tables.map(([x, z], i) => (
      <HighTable key={i} position={[x, 0, z]} drain={drain} glow={glow} glasses={1 + (i % 3)} />
    ))}
  </group>
);

/** library: drinks_table. A bar counter with bottles and glasses. Front edge sits at z = 0.45. */
export const DrinksTable: React.FC<D & {position?: [number, number, number]; length?: number}> = ({position = [0, 0, 0], length = 3.2, drain = 0, glow = 0}) => (
  <group position={position} userData={{clip: {kind: 'solid', name: 'bar'}}}>
    <RoundedBox args={[length, 1.05, 0.9]} radius={0.08} smoothness={4} position={[0, 0.525, 0]} castShadow receiveShadow>
      <Clay color="#8A5A3C" drain={drain} glow={glow} />
    </RoundedBox>
    <RoundedBox args={[length + 0.15, 0.07, 1.0]} radius={0.03} smoothness={3} position={[0, 1.08, 0]} castShadow receiveShadow>
      <Clay color="#F3E9DA" drain={drain} glow={glow} />
    </RoundedBox>
    {[-1.3, -1.05, -0.8, 1.0, 1.25].map((x, i) => (
      <group key={i} position={[x, 1.12, -0.25]}>
        <mesh position={[0, 0.17, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.34, 16]} />
          <meshStandardMaterial color={tint(['#3E6B48', '#7A2E2E', '#C9A04A', '#2F4A5C', '#8C5A9C'][i], drain)} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.39, 0]}>
          <cylinderGeometry args={[0.025, 0.04, 0.1, 12]} />
          <meshStandardMaterial color={tint(['#3E6B48', '#7A2E2E', '#C9A04A', '#2F4A5C', '#8C5A9C'][i], drain)} roughness={0.25} />
        </mesh>
      </group>
    ))}
    {[-0.5, 0.45].map((x, i) => (
      <DrinkGlass key={i} position={[x, 1.12, 0.15]} drain={drain} fill={i ? '#C9475A' : '#E8C27A'} />
    ))}
  </group>
);

/** library: glowing_door. Knee-height door that rises out of a surface, shrinks shut, or swings open. */
export const GlowingDoor: React.FC<D & {position?: [number, number, number]; rise?: number; open?: number; shut?: number; shine?: number; icon?: 'bottle' | 'none'; scale?: number; rotY?: number}> = ({
  position = [0, 0, 0], rise = 1, open = 0, shut = 0, shine = 1, icon = 'bottle', drain = 0, scale = 1, rotY = 0,
}) => {
  const s = scale * (1 - shut * 0.92) * Math.min(1, rise * 1.4);
  if (s <= 0.01) return null;
  const glowI = shine * (1 - drain) * (1 - shut);
  return (
    <group position={[position[0], position[1] - (1 - rise) * 0.62 * scale, position[2]]} rotation={[0, rotY, 0]} scale={s}>
      {/* frame */}
      <RoundedBox args={[0.46, 0.66, 0.08]} radius={0.03} smoothness={3} position={[0, 0.33, 0]} castShadow>
        <Clay color="#7A4E30" drain={drain} />
      </RoundedBox>
      {/* light behind the door */}
      <mesh position={[0, 0.31, -0.01]}>
        <planeGeometry args={[0.36, 0.56]} />
        <meshBasicMaterial color={tint('#FFE3A0', drain)} />
      </mesh>
      {/* the door panel, hinged on its left edge */}
      <group position={[-0.18, 0.31, 0.045]} rotation={[0, -open * 1.9, 0]}>
        <RoundedBox args={[0.36, 0.56, 0.04]} radius={0.02} smoothness={3} position={[0.18, 0, 0]} castShadow>
          <Clay color="#B8794A" drain={drain} glow={glowI * 0.5} />
        </RoundedBox>
        <mesh position={[0.31, -0.02, 0.03]}>
          <sphereGeometry args={[0.025, 12, 10]} />
          <meshStandardMaterial color={tint('#F2B33D', drain)} metalness={0.6} roughness={0.3} />
        </mesh>
        {icon === 'bottle' && (
          <group position={[0.18, 0.08, 0.025]}>
            <mesh>
              <capsuleGeometry args={[0.045, 0.08, 6, 12]} />
              <meshStandardMaterial color={tint('#F6D9E0', drain)} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.05, 10]} />
              <meshStandardMaterial color={tint('#E06C8C', drain)} />
            </mesh>
          </group>
        )}
      </group>
      {/* glow spilling from the gap under the door */}
      <mesh position={[0, 0.01, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.32 + open * 0.5, 32]} />
        <meshBasicMaterial color={C.goldGlow} transparent opacity={0.45 * glowI} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0.3, 0.35]} color={C.gold} intensity={glowI * (1.2 + open * 4)} distance={2.5 + open * 2} decay={2} />
    </group>
  );
};

/** library: loading_spinner. Grey dots turning above a stalled character's head. */
export const LoadingSpinner: React.FC<{t: number; position?: [number, number, number]; scale?: number; appear?: number}> = ({t, position = [0, 2.3, 0], scale = 1, appear = 1}) => {
  if (appear <= 0.01) return null;
  return (
    <group position={position} scale={scale * appear}>
      {Array.from({length: 8}, (_, i) => {
        const a = (i / 8) * Math.PI * 2;
        const k = ((i / 8 + t * 1.2) % 1);
        return (
          <mesh key={i} position={[Math.cos(a) * 0.22, Math.sin(a) * 0.22, 0]}>
            <sphereGeometry args={[0.035 + 0.025 * k, 12, 10]} />
            <meshStandardMaterial color="#8E99A6" transparent opacity={0.3 + 0.7 * k} />
          </mesh>
        );
      })}
    </group>
  );
};

/** library: question_cards. Two speech-bubble cards held like playing cards. */
export const QuestionCard: React.FC<D & {label: string; position?: [number, number, number]; rotation?: [number, number, number]; shine?: number; crumble?: number; t?: number}> = ({
  label, position = [0, 0, 0], rotation = [0, 0, 0], shine = 0, crumble = 0, drain = 0, t = 0,
}) => {
  const tex = useTextTexture(label, shine > 0.5 ? C.ink : C.ink2);
  if (crumble >= 1) return <Dust t={t} position={position} k={1} />;
  const color = shine > 0 ? tint(C.white, drain, 0).toString() : C.white;
  return (
    <group position={position} rotation={rotation}>
      <group scale={1 - crumble * 0.4} position={[0, -crumble * 0.2, 0]}>
        <RoundedBox args={[0.42, 0.34, 0.03]} radius={0.06} smoothness={4} castShadow>
          <meshStandardMaterial color={shine > 0 ? new THREE.Color(color).lerp(new THREE.Color(C.gold), shine).getStyle() : tint(C.white, drain)} emissive={C.gold} emissiveIntensity={shine * 0.55} roughness={0.6} transparent opacity={1 - crumble * 0.6} />
        </RoundedBox>
        <mesh position={[-0.1, -0.2, 0]} rotation={[0, 0, 0.6]}>
          <coneGeometry args={[0.05, 0.12, 3]} />
          <meshStandardMaterial color={shine > 0 ? C.gold : tint(C.white, drain)} roughness={0.6} transparent opacity={1 - crumble * 0.6} />
        </mesh>
        <mesh position={[0, 0, 0.017]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshBasicMaterial map={tex} transparent opacity={1 - crumble} />
        </mesh>
      </group>
      {crumble > 0 && <Dust t={t} position={[0, 0, 0]} k={crumble} />}
    </group>
  );
};

/** Dust puff for things crumbling or doors shutting. k 0..1 = progress. */
export const Dust: React.FC<{t: number; k: number; position?: [number, number, number]; color?: string; spread?: number}> = ({k, position = [0, 0, 0], color = '#CFC6BA', spread = 0.5}) => (
  <group position={position}>
    {Array.from({length: 14}, (_, i) => {
      const a = i * 2.39;
      const r = spread * k * (0.4 + (i % 4) * 0.2);
      return (
        <mesh key={i} position={[Math.cos(a) * r, Math.sin(a * 1.3) * r * 0.6 - k * 0.3 * (i % 3), Math.sin(a) * r * 0.5]} scale={(1 - k) * 1.2 + 0.05}>
          <sphereGeometry args={[0.04 + (i % 3) * 0.02, 8, 6]} />
          <meshStandardMaterial color={color} transparent opacity={(1 - k) * 0.9} roughness={1} />
        </mesh>
      );
    })}
  </group>
);

/** Text drawn onto a canvas texture (uses the brand display font once it has loaded). */
export const useTextTexture = (text: string, color: string = C.ink, size = 256) => {
  const ready = typeof document !== 'undefined' && document.fonts?.check?.(`700 100px "Antonio"`);
  return useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = size;
    cv.height = size;
    const ctx = cv.getContext('2d')!;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let px = size * 0.62;
    ctx.font = `700 ${px}px "Antonio", sans-serif`;
    const wide = ctx.measureText(text).width;
    if (wide > size * 0.92) {
      px *= (size * 0.92) / wide; // shrink long words to fit the canvas
      ctx.font = `700 ${px}px "Antonio", sans-serif`;
    }
    ctx.fillText(text, size / 2, size * 0.54);
    const tx = new THREE.CanvasTexture(cv);
    tx.colorSpace = THREE.SRGBColorSpace;
    return tx;
  }, [text, color, size, ready]);
};

/** library: night_kitchen_lab. A small kitchen at 2am covered in test bottles. Counter front at z = 0.4. */
export const NightKitchenLab: React.FC<D & {t: number; lampX?: number}> = ({t, drain = 0, glow = 0, lampX = 1.3}) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[20, 48]} />
      <Clay color="#6F5A4A" drain={drain} />
    </mesh>
    {/* back wall with a night window */}
    <mesh position={[0, 3, -2.2]} receiveShadow>
      <planeGeometry args={[14, 6]} />
      <Clay color="#3C4A66" drain={drain} />
    </mesh>
    <RoundedBox args={[1.6, 1.3, 0.05]} radius={0.05} position={[1.6, 2.6, -2.15]}>
      <meshStandardMaterial color="#1A2238" emissive="#22305A" emissiveIntensity={0.5} />
    </RoundedBox>
    <mesh position={[2.0, 2.95, -2.1]}>
      <circleGeometry args={[0.16, 24]} />
      <meshBasicMaterial color="#FFF3C8" />
    </mesh>
    {/* counter */}
    <RoundedBox args={[4.2, 1.0, 0.8]} radius={0.06} smoothness={4} position={[0, 0.5, 0]} castShadow receiveShadow>
      <Clay color="#E6DCCB" drain={drain} glow={glow} />
    </RoundedBox>
    <RoundedBox args={[4.4, 0.08, 0.9]} radius={0.03} position={[0, 1.04, 0]} castShadow receiveShadow>
      <Clay color="#F7F1E6" drain={drain} glow={glow} />
    </RoundedBox>
    {/* test bottles with handwritten labels */}
    {Array.from({length: 11}, (_, i) => {
      const x = -1.8 + i * 0.33 + (i % 2) * 0.05;
      const z = -0.2 + (i % 3) * 0.15;
      const h = 0.2 + (i % 4) * 0.06;
      const col = ['#F6C9D3', '#BFE3D0', '#F8E3B0', '#D4C8F0', '#FFFFFF'][i % 5];
      return (
        <group key={i} position={[x, 1.08, z]}>
          <mesh position={[0, h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.065, h, 16]} />
            <meshStandardMaterial color={tint(col, drain)} roughness={0.3} />
          </mesh>
          <mesh position={[0, h / 2, 0.064]}>
            <planeGeometry args={[0.07, 0.06]} />
            <meshStandardMaterial color="#FFFCF6" />
          </mesh>
          <mesh position={[0, h + 0.03, 0]}>
            <cylinderGeometry args={[0.025, 0.03, 0.06, 10]} />
            <meshStandardMaterial color={tint('#E06C8C', drain)} />
          </mesh>
        </group>
      );
    })}
    {/* laptop */}
    <group position={[1.4, 1.09, 0.1]} rotation={[0, -0.4, 0]}>
      <RoundedBox args={[0.6, 0.03, 0.4]} radius={0.01} castShadow>
        <meshStandardMaterial color="#B9BEC5" metalness={0.3} roughness={0.4} />
      </RoundedBox>
      <group position={[0, 0.02, -0.2]} rotation={[-0.3, 0, 0]}>
        <RoundedBox args={[0.6, 0.4, 0.02]} radius={0.01} position={[0, 0.2, 0]}>
          <meshStandardMaterial color="#B9BEC5" metalness={0.3} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.2, 0.012]}>
          <planeGeometry args={[0.54, 0.34]} />
          <meshStandardMaterial color="#CFE3FF" emissive="#9CC2FF" emissiveIntensity={0.8} />
        </mesh>
      </group>
    </group>
    {/* pendant lamp */}
    <mesh position={[lampX, 3.4, 0]}>
      <cylinderGeometry args={[0.01, 0.01, 1.4, 6]} />
      <meshStandardMaterial color="#222" />
    </mesh>
    <mesh position={[lampX, 2.65, 0]} castShadow>
      <coneGeometry args={[0.35, 0.3, 24, 1, true]} />
      <meshStandardMaterial color={tint('#F2B33D', drain)} side={THREE.DoubleSide} />
    </mesh>
    <pointLight position={[lampX * 0.6, 2.4, 0.4]} color="#FFC46B" intensity={6 + Math.sin(t * 3) * 0.2} distance={7} decay={1.6} castShadow />
  </group>
);

/** library: interrogation_room. Played for comedy. `lampSwing` in radians. */
export const InterrogationRoom: React.FC<D & {t: number; lampSwing?: number; flipK?: number}> = ({t, lampSwing = 0, drain = 0}) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[20, 48]} />
      <Clay color="#4A4E54" drain={drain} />
    </mesh>
    <mesh position={[0, 3, -2.6]} receiveShadow>
      <planeGeometry args={[14, 6]} />
      <Clay color="#5A6068" drain={drain} />
    </mesh>
    {/* one-way mirror */}
    <mesh position={[-1.4, 2.0, -2.58]}>
      <planeGeometry args={[2.0, 1.0]} />
      <meshStandardMaterial color="#1E2226" metalness={0.6} roughness={0.15} />
    </mesh>
    {/* lamp on a cord */}
    <group position={[0, 4.2, 0]} rotation={[0, 0, lampSwing]}>
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 1.4, 6]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, -1.45, 0]} castShadow>
        <coneGeometry args={[0.4, 0.3, 24, 1, true]} />
        <meshStandardMaterial color="#3B4148" metalness={0.5} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[0.1, 12, 10]} />
        <meshBasicMaterial color="#FFF6D8" />
      </mesh>
      <spotLight position={[0, -1.5, 0]} target-position={[0, -6, 0]} angle={0.7} penumbra={0.5} intensity={30} distance={8} decay={1.5} color="#FFF1CF" castShadow />
    </group>
    {/* metal table */}
    <RoundedBox args={[1.9, 0.06, 1.0]} radius={0.02} position={[0, 0.95, 0]} castShadow receiveShadow userData={{clip: {kind: 'solid', name: 'metal table'}}}>
      <meshStandardMaterial color="#9CA3AB" metalness={0.6} roughness={0.35} />
    </RoundedBox>
    {[[-0.85, -0.42], [0.85, -0.42], [-0.85, 0.42], [0.85, 0.42]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.46, z]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.92, 8]} />
        <meshStandardMaterial color="#7D848C" metalness={0.6} roughness={0.4} />
      </mesh>
    ))}
    {/* tape recorder with spinning reels */}
    <group position={[0.45, 0.99, 0.1]}>
      <RoundedBox args={[0.4, 0.1, 0.26]} radius={0.02} castShadow>
        <meshStandardMaterial color="#2B2B2B" roughness={0.6} />
      </RoundedBox>
      {[-0.09, 0.09].map((x) => (
        <mesh key={x} position={[x, 0.055, 0]} rotation={[0, t * 4, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.015, 6]} />
          <meshStandardMaterial color="#C9C2B4" />
        </mesh>
      ))}
    </group>
  </group>
);

/** library: ping_pong_table. Net along x = 0, players at x = ±1.7. */
export const PingPongTable: React.FC<D & {position?: [number, number, number]; scale?: number}> = ({position = [0, 0, 0], scale = 1, drain = 0, glow = 0}) => (
  <group position={position} scale={scale}>
    <RoundedBox args={[2.74, 0.05, 1.52]} radius={0.015} position={[0, 0.76, 0]} castShadow receiveShadow userData={{clip: {kind: 'solid', name: 'ping-pong table'}}}>
      <Clay color="#2F6E8F" drain={drain} glow={glow} rough={0.6} />
    </RoundedBox>
    {/* white lines */}
    <mesh position={[0, 0.786, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.7, 0.02]} />
      <meshBasicMaterial color="#FFFFFF" />
    </mesh>
    {[[0, 0.74, 2.7, 0.03], [0, -0.74, 2.7, 0.03]].map(([x, z, w, h], i) => (
      <mesh key={i} position={[x, 0.786, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    ))}
    {/* net */}
    <mesh position={[0, 0.86, 0]}>
      <boxGeometry args={[0.02, 0.15, 1.7]} />
      <meshStandardMaterial color="#F4F1EA" transparent opacity={0.85} />
    </mesh>
    {[[-1.2, -0.6], [1.2, -0.6], [-1.2, 0.6], [1.2, 0.6]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.37, z]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.74, 8]} />
        <Clay color="#3A3530" drain={drain} />
      </mesh>
    ))}
  </group>
);

export const Paddle: React.FC<D & {color?: string}> = ({color = '#D9483B', drain = 0}) => (
  <group rotation={[Math.PI / 2, 0, 0]} position={[0, -0.12, 0.05]}>
    <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
      <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
      <Clay color={color} drain={drain} rough={0.6} />
    </mesh>
    <mesh>
      <cylinderGeometry args={[0.025, 0.03, 0.14, 10]} />
      <Clay color="#B8794A" drain={drain} />
    </mesh>
  </group>
);

/** A ball that can glow gold (heat 0..1). */
export const GlowBall: React.FC<{position: [number, number, number]; heat?: number; r?: number}> = ({position, heat = 0, r = 0.06}) => (
  <group position={position}>
    <mesh castShadow>
      <sphereGeometry args={[r, 20, 16]} />
      <meshStandardMaterial color={new THREE.Color('#FFFFFF').lerp(new THREE.Color(C.gold), heat).getStyle()} emissive={C.gold} emissiveIntensity={heat * 2} roughness={0.3} />
    </mesh>
    {heat > 0.05 && (
      <mesh>
        <sphereGeometry args={[r * (1.8 + heat * 1.5), 16, 12]} />
        <meshBasicMaterial color={C.goldGlow} transparent opacity={0.25 * heat} depthWrite={false} />
      </mesh>
    )}
    {heat > 0.3 && <pointLight color={C.gold} intensity={heat * 2} distance={2} />}
  </group>
);

/** library: speed_date_grid. Instanced tiny two-person tables seen from above. `lit(i)` returns 0..1 warmth per table. */
export const SpeedDateGrid: React.FC<D & {cols?: number; rows?: number; spacing?: number; lit: (i: number, x: number, z: number) => number}> = ({cols = 50, rows = 40, spacing = 0.9, lit, drain = 0}) => {
  const n = cols * rows;
  const tables = useMemo(() => new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 14), new THREE.MeshStandardMaterial({roughness: 0.8}), n), [n]);
  const people = useMemo(() => new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.08, 0.14, 4, 8), new THREE.MeshStandardMaterial({roughness: 0.9}), n * 2), [n]);
  const m = new THREE.Matrix4();
  const col = new THREE.Color();
  const warm = new THREE.Color(C.gold);
  const grey = new THREE.Color(tint('#B9B3AA', drain));
  for (let i = 0; i < n; i++) {
    const cx = (i % cols) - (cols - 1) / 2;
    const cz = Math.floor(i / cols) - (rows - 1) / 2;
    const x = cx * spacing, z = cz * spacing;
    const k = lit(i, x, z);
    m.makeTranslation(x, 0.4, z);
    tables.setMatrixAt(i, m);
    tables.setColorAt(i, col.copy(grey).lerp(warm, k));
    for (let s = 0; s < 2; s++) {
      m.makeTranslation(x + (s ? 0.28 : -0.28), 0.42, z);
      people.setMatrixAt(i * 2 + s, m);
      people.setColorAt(i * 2 + s, col.set(s ? '#A3A6AB' : '#C6C8CC').lerp(warm, k * 0.6));
    }
  }
  tables.instanceMatrix.needsUpdate = true;
  people.instanceMatrix.needsUpdate = true;
  if (tables.instanceColor) tables.instanceColor.needsUpdate = true;
  if (people.instanceColor) people.instanceColor.needsUpdate = true;
  return (
    <group>
      <primitive object={tables} />
      <primitive object={people} />
    </group>
  );
};

/** library: question_bubbles. A floating 3D speech bubble (grey or gold). */
export const Bubble3D: React.FC<{position: [number, number, number]; gold?: number; scale?: number; opacity?: number}> = ({position, gold = 0, scale = 1, opacity = 1}) => {
  const c = new THREE.Color('#C9CED6').lerp(new THREE.Color(C.gold), gold).getStyle();
  return (
    <group position={position} scale={scale}>
      <mesh scale={[1.3, 1, 0.7]} castShadow>
        <sphereGeometry args={[0.22, 24, 18]} />
        <meshStandardMaterial color={c} emissive={C.gold} emissiveIntensity={gold * 0.7} roughness={0.5} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      <mesh position={[-0.12, -0.2, 0]} rotation={[0, 0, 0.5]}>
        <coneGeometry args={[0.06, 0.14, 8]} />
        <meshStandardMaterial color={c} emissive={C.gold} emissiveIntensity={gold * 0.7} roughness={0.5} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {[-0.1, 0, 0.1].map((x) => (
        <mesh key={x} position={[x, 0, 0.15]}>
          <sphereGeometry args={[0.025, 8, 6]} />
          <meshBasicMaterial color={gold > 0.5 ? '#7A4A00' : '#8B929C'} transparent={opacity < 1} opacity={opacity} />
        </mesh>
      ))}
      {gold > 0.3 && <pointLight color={C.gold} intensity={gold * 1.5} distance={1.6} />}
    </group>
  );
};
