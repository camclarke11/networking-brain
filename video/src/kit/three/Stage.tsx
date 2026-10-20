// The 3D stage: locked lighting, camera rig and backdrop. Every 3D shot goes inside one <Stage>.
import React, {useLayoutEffect} from 'react';
import {AbsoluteFill} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {C, H, W} from '../tokens';
import {Grade} from '../fx';

export type Vec3 = [number, number, number];
export type Cam = {pos: Vec3; target: Vec3; fov?: number; roll?: number};

/** Blend a colour towards the cold grey-blue (drain) or warm gold (glow). */
export const tint = (hex: string, drain = 0, glow = 0) => {
  const c = new THREE.Color(hex);
  if (drain > 0) {
    const lum = c.r * 0.3 + c.g * 0.59 + c.b * 0.11;
    const cold = new THREE.Color(C.cold).lerp(new THREE.Color(lum, lum, lum), 0.45);
    c.lerp(cold, drain * 0.85);
  }
  if (glow > 0) c.lerp(new THREE.Color(C.goldGlow), glow * 0.18);
  return '#' + c.getHexString();
};

const Rig: React.FC<Cam> = ({pos, target, fov = 32, roll = 0}) => {
  const {camera} = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...pos);
    cam.fov = fov;
    cam.aspect = W / H;
    cam.near = 0.05;
    cam.far = 200;
    cam.up.set(0, 1, 0);
    cam.lookAt(...target);
    if (roll) cam.rotateZ(roll);
    cam.updateProjectionMatrix();
  });
  return null;
};

export type Backdrop = 'warm' | 'event' | 'night' | 'dark' | 'void' | React.ReactNode;

const BACKDROPS: Record<string, string> = {
  warm: `radial-gradient(ellipse 90% 60% at 50% 35%, #FFF6E8 0%, ${C.base} 55%, ${C.base2} 100%)`,
  void: `radial-gradient(ellipse 80% 60% at 50% 40%, ${C.white} 0%, ${C.base} 70%, ${C.base2} 100%)`,
  night: 'radial-gradient(ellipse 90% 60% at 50% 30%, #2E3A55 0%, #1C2436 60%, #121826 100%)',
  dark: 'radial-gradient(ellipse 80% 55% at 50% 30%, #3A3F46 0%, #23272C 60%, #15181B 100%)',
};

/** The warm, out-of-focus party lights behind an event shot (fake shallow depth of field). */
export const EventBokeh: React.FC<{t: number; drain?: number}> = ({t, drain = 0}) => {
  const dots = Array.from({length: 26}, (_, i) => {
    const x = (i * 397) % 1080;
    const y = 220 + ((i * 211) % 700);
    const r = 40 + ((i * 53) % 90);
    const a = 0.25 + 0.2 * Math.sin(t * 0.8 + i);
    return <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: i % 3 ? '#FFC97A' : '#FFE7B8', opacity: a, filter: 'blur(14px)'}} />;
  });
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, #6B4A33 0%, #A7764F 38%, ${C.base2} 62%, ${C.base} 100%)`, filter: drain ? `saturate(${1 - drain * 0.8})` : undefined}}>
      {dots}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{
  cam: Cam;
  t: number;
  backdrop?: Backdrop;
  drain?: number;
  glow?: number;
  fog?: [number, number] | null;
  light?: 'warm' | 'night' | 'harsh';
  children: React.ReactNode;
}> = ({cam, t, backdrop = 'warm', drain = 0, glow = 0, fog = [14, 42], light = 'warm', children}) => {
  const bg =
    backdrop === 'event' ? <EventBokeh t={t} drain={drain} /> : typeof backdrop === 'string' ? <AbsoluteFill style={{background: BACKDROPS[backdrop] ?? backdrop}} /> : backdrop;
  const fogColor = backdrop === 'night' ? '#1C2436' : backdrop === 'dark' ? '#23272C' : backdrop === 'event' ? '#C9A88A' : C.base;
  const keyColor = tint(light === 'night' ? '#FFD49A' : light === 'harsh' ? '#FFF3D6' : '#FFE3BC', drain);
  const sky = tint(light === 'night' ? '#6F7FA6' : light === 'harsh' ? '#9AA3AD' : '#FFF1DC', drain);
  const ground = tint(light === 'night' ? '#2A2233' : '#B9A58C', drain);
  return (
    <Grade drain={drain} glow={glow}>
      {bg}
      <ThreeCanvas width={W} height={H} shadows={{type: THREE.PCFSoftShadowMap}} gl={{alpha: true, antialias: true}} dpr={1}>
        <Rig {...cam} />
        {fog && <fog attach="fog" args={[fogColor, fog[0], fog[1]]} />}
        <hemisphereLight args={[sky, ground, light === 'harsh' ? 0.7 : light === 'night' ? 0.45 : 1.0]} />
        <directionalLight
          position={[4, 9, 6]}
          intensity={light === 'harsh' ? 0.6 : 2.3}
          color={keyColor}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-radius={6}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-6, 5, -6]} intensity={1.1 + glow * 1.5} color={tint('#FFC46B', drain)} />
        <directionalLight position={[-5, 3, 6]} intensity={0.35} color={tint('#DCE8FF', drain)} />
        {children}
      </ThreeCanvas>
    </Grade>
  );
};

/** A floor that catches soft shadows and fades into the backdrop. */
export const Floor: React.FC<{color?: string; drain?: number; size?: number; y?: number}> = ({color = C.base2, drain = 0, size = 80, y = 0}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <circleGeometry args={[size / 2, 64]} />
    <meshStandardMaterial color={tint(color, drain)} roughness={0.95} />
  </mesh>
);

/** Matte clay material: the house look for every 3D object. */
export const Clay: React.FC<{color: string; drain?: number; glow?: number; rough?: number; emissive?: string; emissiveIntensity?: number; opacity?: number}> = ({
  color, drain = 0, glow = 0, rough = 0.82, emissive, emissiveIntensity = 0, opacity = 1,
}) => (
  <meshStandardMaterial
    color={tint(color, drain, glow)}
    roughness={rough}
    metalness={0}
    emissive={emissive ?? C.gold}
    emissiveIntensity={emissive ? emissiveIntensity : glow * 0.22}
    transparent={opacity < 1}
    opacity={opacity}
  />
);

/** Move a camera smoothly between keyframes [time, Cam]. */
export const camPath = (t: number, keys: [number, Cam][], ease: (x: number) => number = (x) => x * x * (3 - 2 * x)): Cam => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [ta, a] = keys[i];
    const [tb, b] = keys[i + 1];
    if (t <= tb) {
      const k = ease(Math.min(1, Math.max(0, (t - ta) / Math.max(tb - ta, 1e-6))));
      const l = (u: number, v: number) => u + (v - u) * k;
      return {
        pos: [l(a.pos[0], b.pos[0]), l(a.pos[1], b.pos[1]), l(a.pos[2], b.pos[2])],
        target: [l(a.target[0], b.target[0]), l(a.target[1], b.target[1]), l(a.target[2], b.target[2])],
        fov: l(a.fov ?? 32, b.fov ?? 32),
        roll: l(a.roll ?? 0, b.roll ?? 0),
      };
    }
  }
  return keys[keys.length - 1][1];
};

/** Turn a 3D point into screen pixels, for pinning labels and bubbles to characters. */
export const toScreen = (cam: Cam, point: Vec3): [number, number] => {
  const c = new THREE.PerspectiveCamera(cam.fov ?? 32, W / H, 0.05, 200);
  c.position.set(...cam.pos);
  c.lookAt(...cam.target);
  if (cam.roll) c.rotateZ(cam.roll);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(...point).project(c);
  return [((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H];
};
