// Brand X-ray props (pillar 2): products, price tags, displays and the machinery of a trick.
// Each export notes its library id. Solids people could bump into are tagged for the clipping check.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {Clay, tint} from './Stage';
import {C} from '../tokens';
import {clamp, lerp} from '../time';

type V3 = [number, number, number];
type D = {drain?: number; glow?: number};
const solid = (name: string) => ({clip: {kind: 'solid', name}});

/** A canvas texture you draw into (text, dials, pages). Rebuilt when `key` changes. */
export const useCanvas = (key: string, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w = 512, h = 256) => {
  const ready = typeof document !== 'undefined' && document.fonts?.check?.(`600 40px "Antonio"`);
  return useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = w;
    cv.height = h;
    const ctx = cv.getContext('2d')!;
    draw(ctx, w, h);
    const tx = new THREE.CanvasTexture(cv);
    tx.colorSpace = THREE.SRGBColorSpace;
    tx.anisotropy = 4;
    return tx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, w, h, ready]);
};

/** Draw one line of text, shrunk to fit the width. */
export const fitText = (ctx: CanvasRenderingContext2D, text: string, w: number, h: number, color: string = C.ink, font = '"Antonio", sans-serif', weight = 600, size = 0.62) => {
  let px = h * size;
  ctx.font = `${weight} ${px}px ${font}`;
  const wide = ctx.measureText(text).width;
  if (wide > w * 0.88) {
    px *= (w * 0.88) / wide;
    ctx.font = `${weight} ${px}px ${font}`;
  }
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h * 0.53);
};

/** A white pedestal. Top at y = height. */
export const Plinth: React.FC<D & {position?: V3; height?: number; r?: number; square?: boolean}> = ({position = [0, 0, 0], height = 0.5, r = 0.9, square = false, drain = 0, glow = 0}) => (
  <group position={position} userData={solid('plinth')}>
    {square ? (
      <RoundedBox args={[r * 2, height, r * 1.3]} radius={0.04} smoothness={3} position={[0, height / 2, 0]} castShadow receiveShadow>
        <Clay color="#FFFFFF" drain={drain} glow={glow} />
      </RoundedBox>
    ) : (
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[r, r * 1.02, height, 48]} />
        <Clay color="#FFFFFF" drain={drain} glow={glow} />
      </mesh>
    )}
  </group>
);

/** library: roadster_model. A low, sleek two-seat sports car, no logos, 2.3 long, nose towards +x. `hover` lifts it,
 * `thrust` 0..1 puffs from the rear, `lift` 0..1 puffs downwards (flying). */
export const SportsCar: React.FC<D & {t: number; position?: V3; rotY?: number; color?: string; hover?: number; thrust?: number; lift?: number; pitch?: number; scale?: number; jets?: boolean}> = ({
  t, position = [0, 0, 0], rotY = 0, color = '#FFFFFF', hover = 0, thrust = 0, lift = 0, pitch = 0, scale = 1, jets = false, drain = 0, glow = 0,
}) => {
  const puff = (i: number, k: number, p: V3, s: number) => (
    <mesh key={i} position={p} scale={s} userData={{noClip: true}}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshStandardMaterial color="#FFFFFF" transparent opacity={(1 - k) * 0.75} depthWrite={false} roughness={1} />
    </mesh>
  );
  return (
    <group position={[position[0], position[1] + hover, position[2]]} rotation={[0, rotY, pitch]} scale={scale} userData={{clip: {kind: 'solid', name: 'car', moving: true}}}>
      {/* low body with a tapered nose */}
      <RoundedBox args={[2.3, 0.26, 0.98]} radius={0.12} smoothness={5} position={[0, 0.3, 0]} castShadow receiveShadow>
        <Clay color={color} drain={drain} glow={glow} rough={0.22} />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.12, 0.9]} radius={0.06} smoothness={4} position={[-0.25, 0.46, 0]} castShadow>
        <Clay color={color} drain={drain} glow={glow} rough={0.22} />
      </RoundedBox>
      {/* glass canopy, low and raked */}
      <mesh position={[-0.2, 0.52, 0]} scale={[0.62, 0.17, 0.36]} castShadow>
        <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={tint('#3B3D42', drain)} roughness={0.08} metalness={0.25} />
      </mesh>
      {/* wheels, tucked in */}
      {[[0.78, 0.43], [-0.78, 0.43], [0.78, -0.43], [-0.78, -0.43]].map(([x, z], i) => (
        <group key={i} position={[x, 0.19, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.13, 28]} />
            <meshStandardMaterial color="#26272B" roughness={0.6} />
          </mesh>
          <mesh position={[0, z > 0 ? 0.066 : -0.066, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.005, 20]} />
            <meshStandardMaterial color="#C9CBCF" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* light strips */}
      <mesh position={[1.151, 0.32, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.8, 0.03]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-1.151, 0.34, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.85, 0.04]} />
        <meshBasicMaterial color={C.red} />
      </mesh>
      {jets &&
        [-0.3, 0.3].map((z) => (
          <mesh key={z} position={[-1.19, 0.3, z]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.06, 0.08, 0.1, 16]} />
            <meshStandardMaterial color="#5F6268" metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      {thrust > 0.01 &&
        Array.from({length: 10}, (_, i) => {
          const k = (t * 3 + i / 10) % 1;
          return puff(i, k, [-1.25 - k * 0.9, 0.3 - k * 0.08, (i % 2 ? 0.3 : -0.3) + Math.sin(i * 7) * 0.05], (0.07 + k * 0.2) * thrust);
        })}
      {lift > 0.01 &&
        Array.from({length: 12}, (_, i) => {
          const k = (t * 2.5 + i / 12) % 1;
          const cx = (i % 4) * 0.55 - 0.82, cz = i % 8 < 4 ? 0.3 : -0.3;
          return puff(100 + i, k, [cx, 0.12 - k * 0.6, cz], (0.06 + k * 0.16) * lift);
        })}
    </group>
  );
};

/** A generic angular pickup (to jump over). 2.6 long, nose towards +x. */
export const Pickup: React.FC<D & {position?: V3; rotY?: number}> = ({position = [0, 0, 0], rotY = 0, drain = 0}) => {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.3, 0.25);
    s.lineTo(1.3, 0.25);
    s.lineTo(1.3, 0.72);
    s.lineTo(0.1, 1.18);
    s.lineTo(-1.3, 0.85);
    s.closePath();
    return s;
  }, []);
  return (
    <group position={position} rotation={[0, rotY, 0]} userData={solid('pickup')}>
      <mesh position={[0, 0, -0.55]} castShadow receiveShadow>
        <extrudeGeometry args={[shape, {depth: 1.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2}]} />
        <meshStandardMaterial color={tint('#B9BBBF', drain)} metalness={0.35} roughness={0.35} />
      </mesh>
      {[[0.85, 0.58], [-0.85, 0.58], [0.85, -0.58], [-0.85, -0.58]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.24, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.24, 0.16, 24]} />
          <meshStandardMaterial color="#26272B" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

/** A clear display case with thin edges. */
export const GlassCase: React.FC<{position?: V3; size?: V3; drop?: number}> = ({position = [0, 0, 0], size = [2.6, 1.1, 1.3], drop = 1}) => {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size[0], size[1], size[2]]);
  if (drop <= 0.001) return null;
  const y = position[1] + size[1] / 2 + (1 - drop) * 2.5;
  return (
    <group position={[position[0], y, position[2]]}>
      <mesh>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.12 * drop} roughness={0.05} depthWrite={false} />
      </mesh>
      <lineSegments geometry={geo}>
        <lineBasicMaterial color={C.ink} transparent opacity={0.35 * drop} />
      </lineSegments>
    </group>
  );
};

/** library: price_tag. A white card tag on a string. `swing` radians, `flip` 0..1 turns it over, `glow` warms it yellow. Hangs from `position` (the string's top). */
export const PriceTag: React.FC<D & {text: string; sub?: string; back?: string; position?: V3; string?: number; swing?: number; flip?: number; scale?: number; rotY?: number}> = ({
  text, sub = '', back = '', position = [0, 0, 0], string = 0.35, swing = 0, flip = 0, scale = 1, rotY = 0, drain = 0, glow = 0,
}) => {
  const front = useCanvas(`tag:${sub}:${text}`, (ctx, w, h) => {
    if (!sub) return fitText(ctx, text, w, h);
    ctx.save();
    ctx.translate(0, -h * 0.2);
    fitText(ctx, sub, w, h, C.ink2, '"Inter", sans-serif', 700, 0.2);
    ctx.restore();
    ctx.save();
    ctx.translate(0, h * 0.12);
    fitText(ctx, text, w, h, C.ink, '"Antonio", sans-serif', 600, 0.46);
    ctx.restore();
  });
  const rear = useCanvas(`tag:${back}`, (ctx, w, h) => fitText(ctx, back, w, h));
  const col = new THREE.Color(tint('#FFFFFF', drain)).lerp(new THREE.Color(C.gold), glow).getStyle();
  return (
    <group position={position} rotation={[0, rotY, swing]} scale={scale}>
      <mesh position={[0, -string / 2, 0]}>
        <cylinderGeometry args={[0.006, 0.006, string, 6]} />
        <meshBasicMaterial color={C.ink2} />
      </mesh>
      <group position={[0, -string - 0.17, 0]} rotation={[0, flip * Math.PI, 0]}>
        <RoundedBox args={[0.62, 0.32, 0.02]} radius={0.04} smoothness={3} castShadow>
          <meshStandardMaterial color={col} roughness={0.6} emissive={C.gold} emissiveIntensity={glow * 0.35} />
        </RoundedBox>
        <mesh position={[-0.24, 0.1, 0.012]}>
          <circleGeometry args={[0.025, 16]} />
          <meshBasicMaterial color={C.ink2} />
        </mesh>
        <mesh position={[0.04, -0.01, 0.012]}>
          <planeGeometry args={[0.5, 0.25]} />
          <meshBasicMaterial map={front} transparent />
        </mesh>
        <mesh position={[0.04, -0.01, -0.012]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[0.5, 0.25]} />
          <meshBasicMaterial map={rear} transparent />
        </mesh>
      </group>
    </group>
  );
};

/** library: anchor_weight. A black ship's anchor, about 1.6 tall, its ring at the top (y = height). */
export const Anchor: React.FC<D & {position?: V3; scale?: number; rotY?: number}> = ({position = [0, 0, 0], scale = 1, rotY = 0, drain = 0}) => {
  const ink = tint('#2B2C30', drain);
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale} userData={{clip: {kind: 'solid', name: 'anchor', moving: true}}}>
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 1.4, 16]} />
        <meshStandardMaterial color={ink} roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.7, 12]} />
        <meshStandardMaterial color={ink} roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.66, 0]} castShadow>
        <torusGeometry args={[0.12, 0.035, 10, 24]} />
        <meshStandardMaterial color={ink} roughness={0.35} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, Math.PI]} castShadow>
        <torusGeometry args={[0.55, 0.07, 12, 32, Math.PI]} />
        <meshStandardMaterial color={ink} roughness={0.35} metalness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.55, 0.7, 0]} rotation={[0, 0, s * 0.5]} castShadow>
          <coneGeometry args={[0.13, 0.3, 4]} />
          <meshStandardMaterial color={ink} roughness={0.35} metalness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

/** A chain of links from `from` straight down to `to` (y only). */
export const Chain: React.FC<{x: number; z: number; top: number; bottom: number}> = ({x, z, top, bottom}) => {
  const n = Math.max(0, Math.floor((top - bottom) / 0.09));
  return (
    <group>
      {Array.from({length: n}, (_, i) => (
        <mesh key={i} position={[x, top - i * 0.09, z]} rotation={[0, i % 2 ? Math.PI / 2 : 0, 0]}>
          <torusGeometry args={[0.035, 0.011, 6, 12]} />
          <meshStandardMaterial color="#3B3D42" metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
    </group>
  );
};

/** library: laptop. Thin silver laptop, no logo, 0.42 wide, opening `openDeg` degrees (0 shut, 90 upright). Faces +z. */
export const Laptop: React.FC<D & {position?: V3; rotY?: number; openDeg?: number; screen?: THREE.Texture | null; scale?: number}> = ({
  position = [0, 0, 0], rotY = 0, openDeg = 105, screen = null, scale = 1, drain = 0, glow = 0,
}) => {
  const a = (openDeg * Math.PI) / 180;
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale}>
      <RoundedBox args={[0.42, 0.016, 0.29]} radius={0.006} smoothness={2} position={[0, 0.008, 0]} castShadow>
        <meshStandardMaterial color={tint('#D9DADD', drain, glow)} metalness={0.45} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.0165, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.36, 0.17]} />
        <meshStandardMaterial color={tint('#8D9096', drain)} roughness={0.7} />
      </mesh>
      {/* lid, hinged at the back edge: built along +y, rotated down by (90° - open angle) */}
      <group position={[0, 0.016, -0.145]} rotation={[Math.PI / 2 - a, 0, 0]}>
        <group>
          <RoundedBox args={[0.42, 0.28, 0.01]} radius={0.006} smoothness={2} position={[0, 0.14, -0.004]} castShadow>
            <meshStandardMaterial color={tint('#D9DADD', drain, glow)} metalness={0.45} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0.14, 0.0015]}>
            <planeGeometry args={[0.38, 0.24]} />
            {screen ? <meshBasicMaterial map={screen} /> : <meshStandardMaterial color="#F7F8FA" emissive="#FFFFFF" emissiveIntensity={0.55} />}
          </mesh>
        </group>
      </group>
    </group>
  );
};

/** library: store_table. A long pale display table, top at y = 0.92. */
export const StoreTable: React.FC<D & {position?: V3; length?: number; depth?: number; rotY?: number}> = ({position = [0, 0, 0], length = 3.4, depth = 0.95, rotY = 0, drain = 0, glow = 0}) => (
  <group position={position} rotation={[0, rotY, 0]} userData={solid('table')}>
    <RoundedBox args={[length, 0.07, depth]} radius={0.02} smoothness={3} position={[0, 0.885, 0]} castShadow receiveShadow>
      <Clay color="#E9DCC8" drain={drain} glow={glow} rough={0.6} />
    </RoundedBox>
    {[-1, 1].map((s) => (
      <RoundedBox key={s} args={[0.08, 0.85, depth * 0.8]} radius={0.02} position={[s * (length / 2 - 0.25), 0.425, 0]} castShadow>
        <Clay color="#E9DCC8" drain={drain} glow={glow} rough={0.6} />
      </RoundedBox>
    ))}
  </group>
);

/** library: name_tag. A small rounded tag with one bold initial that pops on (`pop` 0..1). */
export const OwnTag: React.FC<{letter: string; position?: V3; pop?: number; rotY?: number; scale?: number}> = ({letter, position = [0, 0, 0], pop = 1, rotY = 0, scale = 1}) => {
  const tex = useCanvas(`own:${letter}`, (ctx, w, h) => fitText(ctx, letter, w, h, C.ink, '"Inter", sans-serif', 800, 0.7), 256, 256);
  if (pop <= 0.01) return null;
  const s = scale * (pop < 1 ? Math.sin(pop * Math.PI * 0.75) / Math.sin(Math.PI * 0.75) : 1);
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={Math.max(0, s)}>
      <RoundedBox args={[0.2, 0.2, 0.02]} radius={0.05} smoothness={3} castShadow>
        <meshStandardMaterial color={C.gold} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[0.17, 0.17]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
    </group>
  );
};

/** A line between two points that is dotted (k = 0) and snaps solid (k = 1). */
export const DotLine: React.FC<{from: V3; to: V3; k?: number; color?: string}> = ({from, to, k = 0, color = C.ink}) => {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const len = a.distanceTo(b);
  if (k >= 0.99) {
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    return (
      <mesh position={mid.toArray() as V3} quaternion={q}>
        <cylinderGeometry args={[0.008, 0.008, len, 6]} />
        <meshBasicMaterial color={C.gold} />
      </mesh>
    );
  }
  const n = Math.max(2, Math.floor(len / 0.06));
  return (
    <group>
      {Array.from({length: n}, (_, i) => {
        const p = a.clone().lerp(b, (i + 0.5) / n);
        return (
          <mesh key={i} position={p.toArray() as V3}>
            <sphereGeometry args={[0.009, 6, 4]} />
            <meshBasicMaterial color={color} transparent opacity={0.55} />
          </mesh>
        );
      })}
    </group>
  );
};

/** library: balance_scales. Two-pan balance, beam at y = 1.5. `tilt` -1..1 (+ = right pan down). Items sit on the pans. */
export const Scales: React.FC<D & {position?: V3; tilt?: number; left?: React.ReactNode; right?: React.ReactNode; scale?: number}> = ({position = [0, 0, 0], tilt = 0, left, right, scale = 1, drain = 0}) => {
  const ang = clamp(tilt, -1, 1) * 0.32;
  const half = 0.75;
  const steel = tint('#C9CBCF', drain);
  return (
    <group position={position} scale={scale}>
      <group userData={solid('scales')}>
        <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.36, 0.06, 32]} />
          <meshStandardMaterial color={tint('#FFFFFF', drain)} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.78, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 1.5, 16]} />
          <meshStandardMaterial color={steel} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.07, 16, 12]} />
        <meshStandardMaterial color={C.gold} roughness={0.4} />
      </mesh>
      <group position={[0, 1.5, 0]} rotation={[0, 0, ang]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, half * 2, 12]} />
          <meshStandardMaterial color={steel} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>
      {[-1, 1].map((side) => {
        const x = side * half * Math.cos(ang);
        const yTop = 1.5 + side * half * Math.sin(ang);
        const y = yTop - 0.55;
        return (
          <group key={side}>
            {[-0.18, 0.18].map((dz) => (
              <mesh key={dz} position={[x, (yTop + y) / 2, dz * 0.6]} rotation={[dz > 0 ? -0.32 : 0.32, 0, 0]}>
                <cylinderGeometry args={[0.004, 0.004, 0.58, 4]} />
                <meshBasicMaterial color={C.ink2} />
              </mesh>
            ))}
            <mesh position={[x, y, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.3, 0.24, 0.04, 32]} />
              <meshStandardMaterial color={steel} metalness={0.5} roughness={0.3} />
            </mesh>
            <group position={[x, y + 0.02, 0]}>{side < 0 ? left : right}</group>
          </group>
        );
      })}
    </group>
  );
};

/** library: syllable_train. A row of rounded block carriages, one per syllable or symbol. `pop[i]` 0..1 knocks a carriage off. Runs along +x from `position`. */
export const SyllableTrain: React.FC<D & {items: string[]; position?: V3; pop?: number[]; gap?: number; size?: number; hl?: number[]; center?: boolean}> = ({items, position = [0, 0, 0], pop = [], gap = 0.04, size = 0.34, hl = [], center = false}) => {
  const widths = items.map((it) => (it.length > 2 ? size * 1.4 : size));
  // popped carriages lift away while the rest close up smoothly
  const steps = widths.map((w, i) => (w + gap) * (1 - clamp(pop[i] ?? 0)));
  const total = steps.reduce((a, b) => a + b, 0) - gap;
  let x = center ? -total / 2 : 0;
  return (
    <group position={position}>
      {items.map((it, i) => {
        const k = clamp(pop[i] ?? 0);
        const w = widths[i];
        const cx = x + w / 2;
        x += steps[i];
        if (k >= 1) return null;
        return <Carriage key={i} text={it} w={w} h={size} position={[cx, size / 2 + k * size * 2.2, k * size * 1.4]} rot={k * 1.2} opacity={1 - k} hl={hl.includes(i)} />;
      })}
    </group>
  );
};
const Carriage: React.FC<{text: string; w: number; h: number; position: V3; rot: number; opacity: number; hl: boolean}> = ({text, w, h, position, rot, opacity, hl}) => {
  const tex = useCanvas(`car:${text}`, (ctx, cw, ch) => fitText(ctx, text, cw, ch, C.ink, '"Antonio", sans-serif', 600, 0.6), 256, 256);
  return (
    <group position={position} rotation={[0, 0, rot]}>
      <RoundedBox args={[w, h, h]} radius={0.05} smoothness={3} castShadow>
        <meshStandardMaterial color={hl ? C.gold : '#FFFFFF'} roughness={0.5} transparent={opacity < 1} opacity={opacity} />
      </RoundedBox>
      <mesh position={[0, 0, h / 2 + 0.002]}>
        <planeGeometry args={[w * 0.9, h * 0.9]} />
        <meshBasicMaterial map={tex} transparent opacity={opacity} />
      </mesh>
    </group>
  );
};

/** library: folding_phone. A white phone that opens like a book (`open` 0..1), 0.5 tall when shown on a plinth. Faces +z. */
export const FoldingPhone: React.FC<D & {position?: V3; rotY?: number; open?: number; scale?: number}> = ({position = [0, 0, 0], rotY = 0, open = 1, scale = 1, drain = 0, glow = 0}) => {
  const body = tint('#F4F4F6', drain, glow);
  const half = (x: number) => (
    <group>
      <RoundedBox args={[0.2, 0.42, 0.012]} radius={0.012} smoothness={3} position={[x, 0, 0]} castShadow>
        <meshStandardMaterial color={body} metalness={0.2} roughness={0.3} />
      </RoundedBox>
      <mesh position={[x, 0, 0.007]}>
        <planeGeometry args={[0.186, 0.4]} />
        <meshStandardMaterial color="#F9FAFC" emissive="#FFFFFF" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
  const o = clamp(open);
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale}>
      {half(-0.1)}
      {/* the right half swings forward on the hinge and closes screen-to-screen */}
      <group position={[0, 0, 0.014 * (1 - o)]} rotation={[0, -Math.PI * (1 - o), 0]}>{half(0.1)}</group>
      <mesh position={[0, 0, -0.004]}>
        <cylinderGeometry args={[0.008, 0.008, 0.42, 8]} />
        <meshStandardMaterial color={tint('#C9CBCF', drain)} metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  );
};

/** library: measuring_ruler. A tall white ruler, `height` tall, with tick marks; `rise` 0..1 out of the floor. */
export const Ruler: React.FC<D & {position?: V3; height?: number; rise?: number; lit?: number}> = ({position = [0, 0, 0], height = 3.2, rise = 1, lit = 0, drain = 0}) => {
  if (rise <= 0.01) return null;
  const ticks = Math.floor(height / 0.1);
  return (
    <group position={[position[0], position[1] - (1 - rise) * height, position[2]]} userData={solid('ruler')}>
      <RoundedBox args={[0.32, height, 0.06]} radius={0.02} smoothness={3} position={[0, height / 2, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={tint('#FFFFFF', drain)} roughness={0.5} />
      </RoundedBox>
      {Array.from({length: ticks}, (_, i) => {
        const big = i % 5 === 0;
        const on = lit > 0 && i / ticks > 1 - lit;
        return (
          <mesh key={i} position={[-0.16 + (big ? 0.07 : 0.045), 0.05 + i * 0.1, 0.032]}>
            <planeGeometry args={[big ? 0.14 : 0.09, 0.012]} />
            <meshBasicMaterial color={on ? C.goldDeep : C.ink} />
          </mesh>
        );
      })}
    </group>
  );
};

/** library: prize_wheel. A game-show wheel with numbered segments, facing +z, centre at y = 1.4. `angle` radians. The pointer is at the top. */
export const PRIZE_NUMBERS = [10, 35, 80, 5, 65, 20, 50, 90, 15, 40, 70, 25];
export const wheelAngleFor = (n: number) => {
  const i = PRIZE_NUMBERS.indexOf(n);
  return (i / PRIZE_NUMBERS.length) * Math.PI * 2; // turns segment i to the pointer at the top
};
export const PrizeWheel: React.FC<D & {position?: V3; angle?: number; r?: number}> = ({position = [0, 0, 0], angle = 0, r = 0.8, drain = 0}) => {
  const face = useCanvas('wheel', (ctx, w, h) => {
    const n = PRIZE_NUMBERS.length;
    const cx = w / 2, cy = h / 2, R = w / 2 - 6;
    for (let i = 0; i < n; i++) {
      const a0 = -Math.PI / 2 + ((i - 0.5) / n) * Math.PI * 2;
      const a1 = -Math.PI / 2 + ((i + 0.5) / n) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, a0, a1);
      ctx.closePath();
      ctx.fillStyle = i % 2 ? '#E6E5E1' : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#1F2023';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((i / n) * Math.PI * 2);
      ctx.fillStyle = '#1F2023';
      ctx.font = `600 ${w * 0.085}px "Antonio", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(PRIZE_NUMBERS[i]), 0, -R * 0.72);
      ctx.restore();
    }
    ctx.beginPath();
    ctx.arc(cx, cy, w * 0.06, 0, Math.PI * 2);
    ctx.fillStyle = '#F5CF2E';
    ctx.fill();
  }, 1024, 1024);
  return (
    <group position={position}>
      <group userData={solid('wheel stand')}>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.32, 0.7, -0.08]} rotation={[0, 0, s * 0.22]} castShadow>
            <boxGeometry args={[0.07, 1.45, 0.07]} />
            <meshStandardMaterial color={tint('#5F6268', drain)} roughness={0.4} />
          </mesh>
        ))}
      </group>
      <group position={[0, 1.4, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]} castShadow>
          <cylinderGeometry args={[r * 1.03, r * 1.03, 0.06, 64]} />
          <meshStandardMaterial color="#2B2C30" roughness={0.4} />
        </mesh>
        <mesh rotation={[0, 0, angle]} position={[0, 0, 0.002]}>
          <circleGeometry args={[r, 64]} />
          <meshBasicMaterial map={face} />
        </mesh>
        <mesh position={[0, r + 0.06, 0.04]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.07, 0.16, 3]} />
          <meshStandardMaterial color={C.gold} roughness={0.4} />
        </mesh>
      </group>
    </group>
  );
};

/** library: yogurt_bowl. A plain white bowl of yogurt, 0.3 across, sitting at y = 0. */
export const YogurtBowl: React.FC<D & {position?: V3; scale?: number; tilt?: number}> = ({position = [0, 0, 0], scale = 1, tilt = 0, drain = 0, glow = 0}) => {
  const geo = useMemo(() => {
    const pts = [new THREE.Vector2(0, 0), new THREE.Vector2(0.07, 0), new THREE.Vector2(0.08, 0.01), new THREE.Vector2(0.13, 0.06), new THREE.Vector2(0.155, 0.12), new THREE.Vector2(0.15, 0.125), new THREE.Vector2(0.125, 0.065), new THREE.Vector2(0, 0.05)];
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group position={position} scale={scale} rotation={[tilt, 0, 0]}>
      <mesh geometry={geo} castShadow receiveShadow>
        <meshStandardMaterial color={tint('#FFFFFF', drain, glow)} roughness={0.35} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.135, 40]} />
        <meshStandardMaterial color={tint('#FBF7EE', drain, glow)} roughness={0.8} />
      </mesh>
      <mesh position={[0.02, 0.108, 0.01]} rotation={[-Math.PI / 2, 0, 0.6]}>
        <torusGeometry args={[0.045, 0.012, 8, 24, Math.PI * 1.4]} />
        <meshStandardMaterial color={tint('#FBF7EE', drain, glow)} roughness={0.8} />
      </mesh>
    </group>
  );
};

/** A spoon, 0.22 long along +x. `heavy` makes it thick steel, otherwise light white plastic. */
export const Spoon: React.FC<{position?: V3; rotation?: [number, number, number]; heavy?: boolean; scale?: number}> = ({position = [0, 0, 0], rotation = [0, 0, 0], heavy = false, scale = 1}) => (
  <group position={position} rotation={rotation} scale={scale}>
    <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
      <capsuleGeometry args={[heavy ? 0.014 : 0.008, 0.14, 4, 8]} />
      <meshStandardMaterial color={heavy ? '#9EA2A8' : '#FFFFFF'} metalness={heavy ? 0.8 : 0} roughness={heavy ? 0.25 : 0.5} />
    </mesh>
    <mesh position={[-0.06, 0, 0]} scale={[1.3, 0.35, 0.9]} castShadow>
      <sphereGeometry args={[0.03, 16, 10]} />
      <meshStandardMaterial color={heavy ? '#9EA2A8' : '#FFFFFF'} metalness={heavy ? 0.8 : 0} roughness={heavy ? 0.25 : 0.5} />
    </mesh>
  </group>
);

/** A glass jar with a lid, a box, a flimsy bag: packaging for comparisons. All sit at y = 0. */
export const Jar: React.FC<D & {position?: V3; scale?: number}> = ({position = [0, 0, 0], scale = 1}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.11, 0]} castShadow>
      <cylinderGeometry args={[0.085, 0.085, 0.22, 32]} />
      <meshPhysicalMaterial color="#FFFFFF" transparent opacity={0.45} roughness={0.05} thickness={0.5} />
    </mesh>
    <mesh position={[0, 0.09, 0]}>
      <cylinderGeometry args={[0.07, 0.07, 0.15, 24]} />
      <meshStandardMaterial color="#F5E6B8" roughness={0.6} />
    </mesh>
    <mesh position={[0, 0.235, 0]} castShadow>
      <cylinderGeometry args={[0.09, 0.09, 0.04, 32]} />
      <meshStandardMaterial color="#2B2C30" roughness={0.4} />
    </mesh>
  </group>
);
export const GiftBox: React.FC<D & {position?: V3; scale?: number; rotY?: number}> = ({position = [0, 0, 0], scale = 1, rotY = 0}) => (
  <group position={position} scale={scale} rotation={[0, rotY, 0]}>
    <RoundedBox args={[0.3, 0.16, 0.22]} radius={0.012} smoothness={3} position={[0, 0.08, 0]} castShadow>
      <meshStandardMaterial color="#2B2C30" roughness={0.45} />
    </RoundedBox>
    <mesh position={[0, 0.161, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.3, 0.012]} />
      <meshBasicMaterial color={C.gold} />
    </mesh>
  </group>
);
export const FlimsyBag: React.FC<{position?: V3; scale?: number; sag?: number}> = ({position = [0, 0, 0], scale = 1, sag = 0}) => (
  <group position={position} scale={scale} rotation={[0, 0, sag * 0.35]}>
    <RoundedBox args={[0.2, 0.24 * (1 - sag * 0.3), 0.07]} radius={0.03} smoothness={3} position={[0, 0.12 * (1 - sag * 0.3), 0]} rotation={[0, 0, 0.04]} castShadow>
      <meshStandardMaterial color="#F1F1F3" roughness={0.95} />
    </RoundedBox>
    {[-0.05, 0.05].map((x) => (
      <mesh key={x} position={[x, 0.25 * (1 - sag * 0.3), 0]} rotation={[0, 0, sag * 0.6]}>
        <torusGeometry args={[0.03, 0.006, 6, 14, Math.PI]} />
        <meshStandardMaterial color="#E3E4E7" roughness={0.95} />
      </mesh>
    ))}
  </group>
);

/** A mug on its own, for touch demos. */
export const Mug: React.FC<{position?: V3; scale?: number}> = ({position = [0, 0, 0], scale = 1}) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.07, 0]} castShadow>
      <cylinderGeometry args={[0.06, 0.055, 0.14, 28]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.35} />
    </mesh>
    <mesh position={[0.065, 0.075, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.03, 0.01, 8, 16]} />
      <meshStandardMaterial color="#FFFFFF" roughness={0.35} />
    </mesh>
  </group>
);

/** A simple two-seat sofa, seat top at y = 0.45, facing +z. */
export const Sofa: React.FC<D & {position?: V3; rotY?: number}> = ({position = [0, 0, 0], rotY = 0, drain = 0}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <RoundedBox args={[1.6, 0.3, 0.75]} radius={0.1} smoothness={4} position={[0, 0.3, 0]} castShadow receiveShadow userData={solid('sofa seat')}>
      <Clay color="#C9CBCF" drain={drain} />
    </RoundedBox>
    <RoundedBox args={[1.6, 0.55, 0.2]} radius={0.1} smoothness={4} position={[0, 0.62, -0.3]} castShadow userData={solid('sofa back')}>
      <Clay color="#C9CBCF" drain={drain} />
    </RoundedBox>
    {[-1, 1].map((s) => (
      <RoundedBox key={s} args={[0.2, 0.42, 0.75]} radius={0.08} smoothness={4} position={[s * 0.8, 0.42, 0]} castShadow userData={solid('sofa arm')}>
        <Clay color="#C9CBCF" drain={drain} />
      </RoundedBox>
    ))}
  </group>
);

/** A flat card with text (menus, price lists). Lies flat at y = 0 unless rotated. */
export const TextCard: React.FC<D & {lines: string[]; position?: V3; rotation?: [number, number, number]; size?: [number, number]; glow?: number; scale?: number}> = ({lines, position = [0, 0, 0], rotation = [-Math.PI / 2, 0, 0], size = [0.42, 0.56], glow = 0, scale = 1}) => {
  const tex = useCanvas(`card:${lines.join('|')}`, (ctx, w, h) => {
    ctx.fillStyle = '#1F2023';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    lines.forEach((l, i) => {
      const big = i === 0;
      ctx.font = `${big ? 700 : 500} ${big ? h * 0.075 : h * 0.06}px ${big ? '"Antonio"' : '"Inter"'}, sans-serif`;
      ctx.fillText(l, w / 2, h * (0.14 + i * 0.12));
    });
  }, 512, 683);
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox args={[size[0], size[1], 0.006]} radius={0.01} smoothness={2} castShadow receiveShadow>
        <meshStandardMaterial color={new THREE.Color('#FFFFFF').lerp(new THREE.Color(C.goldGlow), glow).getStyle()} roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[size[0] * 0.94, size[1] * 0.94]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
    </group>
  );
};

/** A stack of coins (accent yellow), `n` high. */
export const Coins: React.FC<{position?: V3; n: number}> = ({position = [0, 0, 0], n}) => (
  <group position={position}>
    {Array.from({length: Math.max(0, Math.floor(n))}, (_, i) => (
      <mesh key={i} position={[Math.sin(i * 2.1) * 0.004, 0.006 + i * 0.012, Math.cos(i * 1.7) * 0.004]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.011, 20]} />
        <meshStandardMaterial color={C.gold} metalness={0.5} roughness={0.35} />
      </mesh>
    ))}
  </group>
);

/** A grey billboard on two legs, with one word. Shrinks with `k` 1→0. */
export const Billboard: React.FC<{text: string; position?: V3; k?: number; rotY?: number}> = ({text, position = [0, 0, 0], k = 1, rotY = 0}) => {
  const tex = useCanvas(`bb:${text}`, (ctx, w, h) => fitText(ctx, text, w, h, '#5B5D62'));
  if (k <= 0.01) return null;
  return (
    <group position={position} scale={k} rotation={[0, rotY, 0]}>
      {[-0.5, 0.5].map((x) => (
        <mesh key={x} position={[x, 0.6, 0]} castShadow>
          <boxGeometry args={[0.05, 1.2, 0.05]} />
          <meshStandardMaterial color="#8D9096" />
        </mesh>
      ))}
      <RoundedBox args={[1.5, 0.75, 0.06]} radius={0.02} position={[0, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#E3E4E7" roughness={0.6} />
      </RoundedBox>
      <mesh position={[0, 1.5, 0.032]}>
        <planeGeometry args={[1.3, 0.62]} />
        <meshBasicMaterial map={tex} transparent />
      </mesh>
    </group>
  );
};

/** A soft spotlight cone from above onto a point, plus the light itself. */
export const SpotCone: React.FC<{position: V3; height?: number; r?: number; k?: number}> = ({position, height = 3.2, r = 0.9, k = 1}) => {
  if (k <= 0.01) return null;
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[r, height, 40, 1, true]} />
        <meshBasicMaterial color="#FFF6D8" transparent opacity={0.16 * k} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[r, 40]} />
        <meshBasicMaterial color="#FFF6D8" transparent opacity={0.35 * k} depthWrite={false} />
      </mesh>
      <pointLight position={[0, height * 0.7, 0.5]} intensity={k * 3} distance={5} color="#FFF8E6" />
    </group>
  );
};

/** A web page texture: a header and rows, one row highlighted. */
export const usePage = (rows: string[], hl = -1, scroll = 0) =>
  useCanvas(`page:${rows.join('|')}:${hl}:${Math.round(scroll * 100)}`, (ctx, w, h) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#E6E5E1';
    ctx.fillRect(0, 0, w, h * 0.12);
    const rowH = h * 0.2;
    rows.forEach((r, i) => {
      const y = h * 0.16 + i * rowH - scroll * rowH * Math.max(0, rows.length - 4);
      if (y < h * 0.12 || y > h) return;
      ctx.fillStyle = i === hl ? '#F5CF2E' : '#F3F2EE';
      ctx.fillRect(w * 0.06, y, w * 0.88, rowH * 0.8);
      ctx.fillStyle = '#1F2023';
      ctx.font = `600 ${h * 0.07}px "Inter", sans-serif`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(r, w * 0.1, y + rowH * 0.4);
    });
  }, 512, 340);

export const mix = lerp;
