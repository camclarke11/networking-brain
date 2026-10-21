// The 3D stage: lighting, camera rig, backdrop, the house material, and the clipping check.
// Every 3D shot goes inside one <Stage>.
import React, {useLayoutEffect} from 'react';
import {AbsoluteFill} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {C, H, W} from '../tokens';
import {Grade} from '../fx';

export type Vec3 = [number, number, number];
export type Cam = {pos: Vec3; target: Vec3; fov?: number; roll?: number};

/**
 * The palette rule. Every colour a set asks for is pulled into the minimal look: greys keyed to its
 * lightness, near-blacks stay black, and only saturated yellows (the accent) and reds (verdicts) keep
 * their hue. Then drain pulls to flat cold grey, glow warms towards the accent.
 */
export const tint = (hex: string, drain = 0, glow = 0) => {
  const c = new THREE.Color(hex);
  const hsl = {h: 0, s: 0, l: 0};
  c.getHSL(hsl);
  const deg = hsl.h * 360;
  const accent = hsl.s > 0.55 && hsl.l > 0.35 && deg >= 36 && deg <= 64;
  const verdict = hsl.s > 0.55 && hsl.l > 0.3 && (deg <= 10 || deg >= 350);
  if (accent) c.set(C.gold).lerp(new THREE.Color(hex), 0.15);
  else if (!verdict) {
    const lum = c.r * 0.3 + c.g * 0.59 + c.b * 0.11;
    const l = lum < 0.08 ? 0.05 + lum : 0.46 + lum * 0.52;
    c.setRGB(l * 0.99, l * 0.995, l * 1.01);
  }
  if (drain > 0) c.lerp(new THREE.Color(C.cold), drain * 0.6);
  if (glow > 0) c.lerp(new THREE.Color(C.goldGlow), glow * 0.22);
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

const LIGHT_BG = `radial-gradient(ellipse 90% 60% at 50% 40%, ${C.white} 0%, ${C.base} 70%, #ECEBE7 100%)`;
const DARK_BG = 'radial-gradient(ellipse 90% 60% at 50% 35%, #34363B 0%, #2A2C30 60%, #232428 100%)';
const BACKDROPS: Record<string, string> = {warm: LIGHT_BG, event: LIGHT_BG, void: LIGHT_BG, night: DARK_BG, dark: DARK_BG};
const isDark = (b: Backdrop) => b === 'night' || b === 'dark';

/** The faint grid of crosses behind every light shot. */
const Grid: React.FC<{dark: boolean}> = ({dark}) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(circle, ${dark ? 'rgba(255,255,255,0.07)' : 'rgba(31,32,35,0.07)'} 1.6px, transparent 1.8px)`,
      backgroundSize: '90px 90px',
      backgroundPosition: '45px 45px',
    }}
  />
);

/** Kept for older videos: now the same plain light backdrop. */
export const EventBokeh: React.FC<{t: number; drain?: number}> = () => (
  <AbsoluteFill style={{background: LIGHT_BG}}>
    <Grid dark={false} />
  </AbsoluteFill>
);

// ---------- clipping check ----------
// Bodies (cast, crowd, seated audience) and solids (furniture, machines) tag their root group with
// userData.clip. After each frame renders, every body is tested against every other body and every
// solid. Overlaps are logged as "[clip] ..." lines, which tools/make_video.py check collects.
export type ClipTag = {kind: 'body'; name: string; r: number; h: number; sit?: boolean} | {kind: 'solid'; name: string; moving?: boolean};
const TOL = 0.02;

/** 26 points (corners, edge middles, face centres) on an object's own bounding box, in world space. */
const samplePoints = (o: THREE.Object3D): THREE.Vector3[] => {
  const local = new THREE.Box3();
  const inv = new THREE.Matrix4().copy(o.matrixWorld).invert();
  o.traverse((c) => {
    const mesh = c as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry || mesh.userData.noClip) return; // smoke, glow and other effects don't count
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, mesh.matrixWorld));
    local.union(b);
  });
  const pts: THREE.Vector3[] = [];
  if (local.isEmpty()) return pts;
  for (const x of [0, 0.5, 1]) for (const y of [0, 0.5, 1]) for (const z of [0, 0.5, 1]) {
    if (x === 0.5 && y === 0.5 && z === 0.5) continue;
    pts.push(new THREE.Vector3(lerp3(local.min.x, local.max.x, x), lerp3(local.min.y, local.max.y, y), lerp3(local.min.z, local.max.z, z)).applyMatrix4(o.matrixWorld));
  }
  return pts;
};
const lerp3 = (a: number, b: number, k: number) => a + (b - a) * k;
/** World-space box of an object's meshes, leaving out effects (userData.noClip). */
const worldBox = (o: THREE.Object3D) => {
  const box = new THREE.Box3();
  o.traverse((c) => {
    const mesh = c as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry || mesh.userData.noClip) return;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    box.union(mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld));
  });
  return box;
};

const ClipCheck: React.FC<{t: number}> = ({t}) => {
  const {scene} = useThree();
  useLayoutEffect(() => {
    scene.updateMatrixWorld(true);
    const bodies: {name: string; p: THREE.Vector3; r: number; h: number; sit: boolean; root: THREE.Object3D | null}[] = [];
    const solids: {name: string; box: THREE.Box3; obj: THREE.Object3D}[] = [];
    const movers: {name: string; obj: THREE.Object3D; pts: THREE.Vector3[]}[] = [];
    scene.traverse((o) => {
      const tag = o.userData.clip as ClipTag | undefined;
      if (!tag || !o.visible) return;
      if (tag.kind === 'body') {
        const p = new THREE.Vector3();
        o.getWorldPosition(p);
        const s = new THREE.Vector3();
        o.getWorldScale(s);
        bodies.push({name: tag.name, p, r: tag.r * s.x, h: tag.h * s.y, sit: !!tag.sit, root: o.parent});
      } else {
        const box = worldBox(o);
        if (!box.isEmpty()) solids.push({name: tag.name, box, obj: o});
        if (tag.moving) movers.push({name: tag.name, obj: o, pts: samplePoints(o)});
      }
    });
    const hits: string[] = [];
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
        const d = Math.hypot(a.p.x - b.p.x, a.p.z - b.p.z);
        const yOverlap = Math.min(a.p.y + a.h, b.p.y + b.h) - Math.max(a.p.y, b.p.y);
        if (d < a.r + b.r - TOL && yOverlap > TOL) hits.push(`${a.name} × ${b.name} (${Math.round((a.r + b.r - d) * 100)}cm)`);
      }
      for (const s of solids) {
        let held = false; // a prop in this body's own hands
        for (let q: THREE.Object3D | null = s.obj; q && !held; q = q.parent) held = q === a.root;
        if (held) continue;
        const cx = THREE.MathUtils.clamp(a.p.x, s.box.min.x, s.box.max.x);
        const cz = THREE.MathUtils.clamp(a.p.z, s.box.min.z, s.box.max.z);
        const d = Math.hypot(a.p.x - cx, a.p.z - cz);
        const yOverlap = Math.min(a.p.y + a.h, s.box.max.y) - Math.max(a.p.y, s.box.min.y);
        if (d < a.r - TOL && yOverlap > TOL * 2) hits.push(`${a.name} × ${s.name} (${Math.round((a.r - d) * 100)}cm, body at ${a.p.x.toFixed(2)},${a.p.z.toFixed(2)}, ${s.name} x ${s.box.min.x.toFixed(2)}..${s.box.max.x.toFixed(2)} z ${s.box.min.z.toFixed(2)}..${s.box.max.z.toFixed(2)})`);
      }
    }
    // Moving solids (cars, falling things) against every other solid: points on the mover's own rotated box.
    for (const m of movers) {
      for (const s of solids) {
        if (s.obj === m.obj) continue;
        let inside = false;
        for (let q: THREE.Object3D | null = s.obj; q && !inside; q = q.parent) inside = q === m.obj;
        if (inside) continue;
        const shrunk = s.box.clone().expandByScalar(-TOL * 1.5);
        if (shrunk.isEmpty()) continue;
        const hit = m.pts.find((pt) => shrunk.containsPoint(pt));
        if (hit) hits.push(`${m.name} × ${s.name} (at ${hit.x.toFixed(2)}, ${hit.y.toFixed(2)}, ${hit.z.toFixed(2)})`);
      }
    }
    if (hits.length) console.warn(`[clip] ${t.toFixed(2)}s ${[...new Set(hits)].slice(0, 6).join(', ')}`);
  });
  return null;
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
  const dark = isDark(backdrop);
  const bg = typeof backdrop === 'string' ? (
    <AbsoluteFill style={{background: BACKDROPS[backdrop] ?? backdrop}}>
      <Grid dark={dark} />
    </AbsoluteFill>
  ) : (
    backdrop
  );
  const fogColor = dark ? '#2A2C30' : C.base;
  return (
    <Grade drain={drain} glow={glow}>
      {bg}
      <ThreeCanvas width={W} height={H} shadows={{type: THREE.PCFSoftShadowMap}} gl={{alpha: true, antialias: true}} dpr={1}>
        <Rig {...cam} />
        {fog && <fog attach="fog" args={[fogColor, fog[0] * 1.3, fog[1] * 1.3]} />}
        <hemisphereLight args={['#FFFFFF', dark ? '#3A3C41' : '#D9D8D4', dark ? 0.9 : light === 'harsh' ? 1.1 : 1.45]} />
        <directionalLight
          position={[3, 10, 7]}
          intensity={dark ? 1.4 : 1.7}
          color="#FFFFFF"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-9}
          shadow-camera-right={9}
          shadow-camera-top={9}
          shadow-camera-bottom={-9}
          shadow-radius={10}
          shadow-bias={-0.0004}
        />
        <directionalLight position={[-6, 4, -4]} intensity={0.5 + glow * 0.8} color={glow > 0 ? '#FFF3D4' : '#FFFFFF'} />
        {children}
        <ClipCheck t={t} />
      </ThreeCanvas>
    </Grade>
  );
};

/** A floor that catches soft shadows and fades into the backdrop. */
export const Floor: React.FC<{color?: string; drain?: number; size?: number; y?: number}> = ({color = C.base, drain = 0, size = 240, y = 0}) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
    <circleGeometry args={[size / 2, 64]} />
    <meshStandardMaterial color={new THREE.Color(color === C.base ? '#FFFFFF' : tint(color)).lerp(new THREE.Color(C.cold), drain * 0.5)} roughness={1} />
  </mesh>
);

/** The house material: smooth satin plastic in the minimal palette. */
export const Clay: React.FC<{color: string; drain?: number; glow?: number; rough?: number; emissive?: string; emissiveIntensity?: number; opacity?: number}> = ({
  color, drain = 0, glow = 0, rough = 0.5, emissive, emissiveIntensity = 0, opacity = 1,
}) => (
  <meshStandardMaterial
    color={tint(color, drain, glow)}
    roughness={Math.min(rough, 0.75)}
    metalness={0}
    emissive={emissive ?? '#FFF3D4'}
    emissiveIntensity={emissive ? emissiveIntensity : glow * 0.12}
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
