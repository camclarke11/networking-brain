// Shop-floor props for the Brand X-ray pillar: freezers, warehouses, ovens, bottles. Built for the 2026-10-21
// batch (Häagen-Dazs, Costco, Domino's, Coca-Cola, Spotify Wrapped) and kept generic so later videos reuse them.
// Each export notes its library id. Solids people could bump into are tagged for the clipping check.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {Clay, tint} from './Stage';
import {useCanvas} from './brand';
import {C} from '../tokens';
import {clamp, EIN, EO, lerp} from '../time';

type V3 = [number, number, number];
type D = {drain?: number; glow?: number};
const solid = (name: string, moving = false) => ({clip: {kind: 'solid', name, ...(moving ? {moving: true} : {})}});
const NO_CLIP = {noClip: true};
const DARK = '#17181B';

/** Lerp a colour towards near-black as the lights go out (`dark` 0..1). */
const dim = (hex: string, dark: number) => new THREE.Color(hex).lerp(new THREE.Color(DARK), clamp(dark) * 0.92).getStyle();

/** Draw centred lines of condensed text, each shrunk to fit. `lines` split on \n. */
const drawLines = (ctx: CanvasRenderingContext2D, text: string, w: number, h: number, color: string = C.ink, weight = 700, fill = 0.62) => {
  const lines = text.split('\n');
  const lh = (h * fill) / lines.length;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((l, i) => {
    let px = lh * 0.92;
    ctx.font = `${weight} ${px}px "Antonio", sans-serif`;
    const wide = ctx.measureText(l).width;
    if (wide > w * 0.86) {
      px *= (w * 0.86) / wide;
      ctx.font = `${weight} ${px}px "Antonio", sans-serif`;
    }
    ctx.fillText(l, w / 2, h / 2 + (i - (lines.length - 1) / 2) * lh);
  });
};

// ---------------------------------------------------------------------------------------------
/** library: text_card. An upright sign card on a slim stand, condensed text. `flip` 0..1 turns it over
 * like a departure board from `text` to `back`. `glow` warms the edge. Bottom of the stand at y = 0. */
export const StandCard: React.FC<D & {text: string; back?: string; position?: V3; size?: [number, number]; flip?: number; rotY?: number; stand?: number; scale?: number; ink?: string; fill?: string; pop?: number}> = ({
  text, back, position = [0, 0, 0], size = [1.4, 0.7], flip = 0, rotY = 0, stand = 0.9, scale = 1, ink = C.ink, fill = '#FFFFFF', pop = 1, glow = 0,
}) => {
  const showBack = back !== undefined && flip >= 0.5;
  const label = showBack ? back! : text;
  const tex = useCanvas(`stand:${label}:${ink}:${size.join('x')}`, (ctx, w, h) => drawLines(ctx, label, w, h, ink), 1024, Math.round((1024 * size[1]) / size[0]));
  if (pop <= 0.01) return null;
  const sy = back !== undefined ? Math.max(0.02, Math.abs(Math.cos(flip * Math.PI))) : 1;
  const ps = pop < 1 ? EO(pop) : 1;
  const col = new THREE.Color(tint(fill)).lerp(new THREE.Color(C.goldGlow), glow * 0.6).getStyle();
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale * ps}>
      {stand > 0 && (
        <mesh position={[0, stand / 2, -0.01]} castShadow>
          <boxGeometry args={[0.05, stand, 0.05]} />
          <meshStandardMaterial color={tint('#C9C9C6')} roughness={0.6} />
        </mesh>
      )}
      <group position={[0, stand + size[1] / 2, 0]} scale={[1, sy, 1]}>
        <RoundedBox args={[size[0], size[1], 0.05]} radius={0.04} smoothness={3} castShadow>
          <meshStandardMaterial color={col} roughness={0.6} emissive={C.gold} emissiveIntensity={glow * 0.25} />
        </RoundedBox>
        <mesh position={[0, 0, 0.027]}>
          <planeGeometry args={[size[0] * 0.94, size[1] * 0.9]} />
          <meshBasicMaterial map={tex} transparent />
        </mesh>
      </group>
    </group>
  );
};

// ---------------------------------------------------------------------------------------------
/** library: freezer_case. A tall white supermarket freezer with glass doors and tubs inside, 3 wide, 2.2 high,
 * front face at z = +0.42. `cold` 0..1 brightens the inside light. */
export const FreezerCase: React.FC<D & {position?: V3; rotY?: number; cold?: number; doors?: number}> = ({position = [0, 0, 0], rotY = 0, cold = 0.4, doors = 3, drain = 0}) => {
  const w = 3.0;
  const dw = w / doors;
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <RoundedBox args={[w + 0.12, 2.3, 0.84]} radius={0.04} smoothness={3} position={[0, 1.15, 0]} castShadow receiveShadow userData={solid('freezer')}>
        <Clay color="#FFFFFF" drain={drain} />
      </RoundedBox>
      {/* the cold inside */}
      <mesh position={[0, 1.13, 0.425]}>
        <planeGeometry args={[w - 0.08, 1.9]} />
        <meshStandardMaterial color="#EEF3F8" emissive="#F4F8FC" emissiveIntensity={0.25 + cold * 0.75} roughness={0.9} />
      </mesh>
      {[0.42, 0.95, 1.48].map((y) => (
        <group key={y}>
          <mesh position={[0, y, 0.44]}>
            <boxGeometry args={[w - 0.1, 0.02, 0.06]} />
            <meshStandardMaterial color={tint('#D9DADD')} />
          </mesh>
          {Array.from({length: 10}, (_, i) => (
            <mesh key={i} position={[-w / 2 + 0.2 + i * ((w - 0.4) / 9), y + 0.1, 0.45]}>
              <cylinderGeometry args={[0.075, 0.065, 0.18, 18]} />
              <meshStandardMaterial color={i % 4 === 1 ? tint('#F5CF2E') : '#FFFFFF'} roughness={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      {/* doors: glass with frames and handles */}
      {Array.from({length: doors}, (_, i) => {
        const x = -w / 2 + dw / 2 + i * dw;
        return (
          <group key={i} position={[x, 1.13, 0.5]}>
            <mesh>
              <planeGeometry args={[dw - 0.06, 1.94]} />
              <meshStandardMaterial color="#FFFFFF" transparent opacity={0.16} roughness={0.05} depthWrite={false} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[(s * (dw - 0.04)) / 2, 0, 0.005]}>
                <boxGeometry args={[0.03, 1.96, 0.03]} />
                <meshStandardMaterial color={tint('#C9C9C6')} />
              </mesh>
            ))}
            <mesh position={[dw / 2 - 0.12, 0, 0.04]}>
              <boxGeometry args={[0.03, 0.6, 0.04]} />
              <meshStandardMaterial color={tint('#8D9096')} metalness={0.4} roughness={0.3} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------
/** library: ice_cream_tub. A white pint tub (0.2 tall, top radius 0.105) with a label band on its front whose
 * text types on (`typed` 0..1 of `label`). `lid` 0..1 lifts the lid off, `scoop` shows a scoop on top. Sits at y = 0. */
export const IceCreamTub: React.FC<D & {position?: V3; scale?: number; rotY?: number; label?: string; typed?: number; lid?: number; scoop?: number; tilt?: number}> = ({
  position = [0, 0, 0], scale = 1, rotY = 0, label = '', typed = 1, lid = 0, scoop = 0, tilt = 0, drain = 0, glow = 0,
}) => {
  const n = Math.round(clamp(typed) * label.length);
  const shown = label.slice(0, n);
  const tex = useCanvas(`tub:${shown}`, (ctx, w, h) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = C.gold;
    ctx.fillRect(0, h * 0.84, w, h * 0.06);
    if (shown) {
      // draw at the label's full width, then squeeze into the middle so the name stays on the front of the tub
      ctx.save();
      ctx.translate(w * 0.22, 0);
      drawLines(ctx, shown, w * 0.56, h, C.ink, 700, 0.5);
      ctx.restore();
    }
  }, 1024, 256);
  const arc = Math.PI * 0.8;
  return (
    <group position={position} rotation={[tilt, rotY, 0]} scale={scale} userData={solid('tub', true)}>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.105, 0.09, 0.2, 40]} />
        <meshStandardMaterial color={tint('#FFFFFF', drain, glow)} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.1, 0]} userData={NO_CLIP}>
        <cylinderGeometry args={[0.1075, 0.0925, 0.12, 40, 1, true, -arc / 2, arc]} />
        <meshBasicMaterial map={tex} side={THREE.FrontSide} />
      </mesh>
      {/* lid (gone once it's fully off) */}
      {lid < 0.999 && <group position={[lerp(0, 0.05, lid), 0.205 + lid * 0.22, lerp(0, -0.08, lid)]} rotation={[-lid * 0.5, 0, lid * 0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.112, 0.112, 0.022, 40]} />
          <meshStandardMaterial color={tint('#FFFFFF', drain, glow)} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.05, 0.07, 32]} />
          <meshBasicMaterial color={C.gold} />
        </mesh>
      </group>}
      {scoop > 0.01 && (
        <group position={[0, 0.2, 0]} scale={EO(clamp(scoop))}>
          <mesh position={[0, 0.03, 0]} scale={[1, 0.62, 1]} castShadow>
            <sphereGeometry args={[0.085, 24, 16]} />
            <meshStandardMaterial color="#FBF6EA" roughness={0.85} />
          </mesh>
          <mesh position={[0.02, 0.075, 0.01]} rotation={[0.3, 0, 0.4]} castShadow>
            <torusGeometry args={[0.03, 0.012, 8, 16, Math.PI * 1.3]} />
            <meshStandardMaterial color="#FBF6EA" roughness={0.85} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------
/** Soft snowy peaks for a "somewhere cold and old" backdrop. `rise` 0..1 lifts them out of the floor. */
export const SnowPeaks: React.FC<{position?: V3; rise?: number; scale?: number}> = ({position = [0, 0, 0], rise = 1, scale = 1}) => {
  if (rise <= 0.01) return null;
  const peaks: [number, number, number][] = [[-1.4, 1.5, 0.9], [-0.4, 2.2, 1.1], [0.7, 1.8, 1.0], [1.6, 1.3, 0.8]];
  return (
    <group position={[position[0], position[1] - (1 - EO(rise)) * 2.4, position[2]]} scale={scale}>
      {peaks.map(([x, h, r], i) => (
        <group key={i} position={[x, 0, -i * 0.15]}>
          <mesh position={[0, h / 2, 0]} castShadow receiveShadow userData={NO_CLIP}>
            <coneGeometry args={[r, h, 5]} />
            <meshStandardMaterial color={tint('#D9DADD')} roughness={0.9} flatShading />
          </mesh>
          <mesh position={[0, h * 0.82, 0]} userData={NO_CLIP}>
            <coneGeometry args={[r * 0.36, h * 0.36, 5]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------
/** library: warehouse_aisle. One tall steel shelving rack, `length` along x, 2.4 high, 0.7 deep. `kind` picks what's
 * stacked on it. `lit` 0..1 glows its shelf edges yellow. Sits at y = 0, centred. */
export type RackKind = 'boxes' | 'tv' | 'nuts' | 'towels' | 'mixed';
export const ShelfRack: React.FC<D & {position?: V3; length?: number; rotY?: number; kind?: RackKind; lit?: number; height?: number; seed?: number}> = ({
  position = [0, 0, 0], length = 3, rotY = 0, kind = 'boxes', lit = 0, height = 2.4, seed = 1, drain = 0,
}) => {
  const shelves = [0.12, 0.85, 1.6];
  const n = Math.max(2, Math.round(length / 0.55));
  const edge = new THREE.Color(tint('#8D9096', drain)).lerp(new THREE.Color(C.gold), clamp(lit)).getStyle();
  return (
    <group position={position} rotation={[0, rotY, 0]} userData={solid('rack')}>
      {[-1, 1].map((s) =>
        [-1, 1].map((d) => (
          <mesh key={`${s}${d}`} position={[(s * length) / 2, height / 2, d * 0.33]} castShadow>
            <boxGeometry args={[0.06, height, 0.06]} />
            <meshStandardMaterial color={tint('#8D9096', drain)} metalness={0.3} roughness={0.5} />
          </mesh>
        )),
      )}
      {shelves.map((y, si) => (
        <group key={y}>
          <mesh position={[0, y, 0]} receiveShadow castShadow>
            <boxGeometry args={[length, 0.05, 0.7]} />
            <meshStandardMaterial color={edge} emissive={C.gold} emissiveIntensity={clamp(lit) * 0.4} metalness={0.2} roughness={0.5} />
          </mesh>
          {Array.from({length: n}, (_, i) => {
            const x = -length / 2 + (length / n) * (i + 0.5);
            const r = Math.abs(Math.sin(seed * 7.3 + i * 3.1 + si * 5.7));
            const k: RackKind = kind === 'mixed' ? (['boxes', 'tv', 'nuts', 'towels'] as RackKind[])[Math.floor(r * 4) % 4] : kind;
            if (k === 'nuts')
              return (
                <mesh key={i} position={[x, y + 0.2, 0]} castShadow>
                  <cylinderGeometry args={[0.16, 0.16, 0.36, 24]} />
                  <meshStandardMaterial color={r > 0.7 ? tint('#F5CF2E') : '#FFFFFF'} roughness={0.5} />
                </mesh>
              );
            if (k === 'towels')
              return (
                <mesh key={i} position={[x, y + 0.2, 0]} castShadow>
                  <boxGeometry args={[length / n - 0.06, 0.36, 0.5]} />
                  <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
                </mesh>
              );
            if (k === 'tv')
              return (
                <mesh key={i} position={[x, y + 0.27, 0]} castShadow>
                  <boxGeometry args={[length / n - 0.05, 0.5, 0.18]} />
                  <meshStandardMaterial color={tint('#2B2C30')} roughness={0.5} />
                </mesh>
              );
            const bh = 0.22 + r * 0.25;
            return (
              <mesh key={i} position={[x, y + bh / 2 + 0.03, 0]} castShadow>
                <boxGeometry args={[length / n - 0.06, bh, 0.5]} />
                <meshStandardMaterial color={tint(r > 0.82 ? '#F5CF2E' : r > 0.45 ? '#E3E4E7' : '#C9C9C6')} roughness={0.7} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
};

/** The warehouse floor plan: four rows of racks with gaps at alternating ends, so the only way from the door
 * (front, z = +5) to the back counter (z = -5) snakes through every aisle. Rows run along x. */
export const WAREHOUSE_ROWS: {z: number; x0: number; x1: number; kind: RackKind; name: string}[] = [
  {z: 3, x0: -3.4, x1: 2.1, kind: 'tv', name: 'TVs'},
  {z: 1, x0: -2.1, x1: 3.4, kind: 'mixed', name: 'JEWELRY'},
  {z: -1, x0: -3.4, x1: 2.1, kind: 'nuts', name: 'NUTS'},
  {z: -3, x0: -2.1, x1: 3.4, kind: 'towels', name: 'PAPER'},
];
/** The snaking path, door to chicken, as [x, z] points. */
export const WAREHOUSE_PATH: [number, number][] = [
  [0, 5.2], [0, 4.2], [2.8, 4.0], [2.8, 2.0], [-2.8, 2.0], [-2.8, 0.0], [2.8, 0.0], [2.8, -2.0], [-2.8, -2.0], [-2.8, -4.0], [0, -4.1],
];
/** A point a fraction k (0..1) of the way along a polyline, plus the direction of travel (radians, for rotY). */
export const along = (pts: [number, number][], k: number): {x: number; z: number; dir: number} => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = clamp(k) * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const f = seg[i] ? Math.min(1, d / seg[i]) : 0;
      const [ax, az] = pts[i];
      const [bx, bz] = pts[i + 1];
      return {x: lerp(ax, bx, f), z: lerp(az, bz, f), dir: Math.atan2(bx - ax, bz - az)};
    }
    d -= seg[i];
  }
  const [x, z] = pts[pts.length - 1];
  return {x, z, dir: 0};
};

/** Dots along a floor path, drawn up to `k` (0..1), glowing with `glow`. */
export const FloorPath: React.FC<{pts: [number, number][]; k?: number; glow?: number; y?: number; size?: number; gap?: number}> = ({pts, k = 1, glow = 0, y = 0.012, size = 0.07, gap = 0.28}) => {
  const dots = useMemo(() => {
    const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
    const total = seg.reduce((a, b) => a + b, 0);
    const count = Math.floor(total / gap);
    return Array.from({length: count}, (_, i) => ({...along(pts, i / count), f: i / count}));
  }, [pts, gap]);
  const col = new THREE.Color(C.goldDeep).lerp(new THREE.Color(C.goldGlow), clamp(glow)).getStyle();
  return (
    <group>
      {dots.map((d, i) =>
        d.f <= k ? (
          <mesh key={i} position={[d.x, y, d.z]} rotation={[-Math.PI / 2, 0, 0]} userData={NO_CLIP}>
            <circleGeometry args={[size * (1 + glow * 0.4), 14]} />
            <meshBasicMaterial color={col} />
          </mesh>
        ) : null,
      )}
    </group>
  );
};

/** The whole warehouse: racks from WAREHOUSE_ROWS (each with its name painted on top for the overhead view),
 * outer walls, the front door gap and the back counter. `lit[i]` glows row i. `labels` shows the roof names. */
export const Warehouse: React.FC<D & {lit?: number[]; labels?: number; children?: React.ReactNode}> = ({lit = [], labels = 1, drain = 0, children}) => (
  <group>
    {WAREHOUSE_ROWS.map((r, i) => (
      <group key={r.z}>
        <ShelfRack position={[(r.x0 + r.x1) / 2, 0, r.z]} length={r.x1 - r.x0} kind={r.kind} lit={lit[i] ?? 0} seed={i + 2} drain={drain} />
        <RoofLabel text={r.name} position={[(r.x0 + r.x1) / 2, 2.47, r.z]} k={labels} />
      </group>
    ))}
    {/* low outer walls so the map reads as a building */}
    {[
      [0, -5.9, 7.6, 0.12],
      [-3.9, 0, 0.12, 11.8],
      [3.9, 0, 0.12, 11.8],
      [-2.3, 5.9, 3.0, 0.12],
      [2.3, 5.9, 3.0, 0.12],
    ].map(([x, z, w, d], i) => (
      <mesh key={i} position={[x, 0.6, z]} castShadow receiveShadow userData={solid('wall')}>
        <boxGeometry args={[w, 1.2, d]} />
        <meshStandardMaterial color={tint('#E3E4E7', drain)} roughness={0.8} />
      </mesh>
    ))}
    {children}
  </group>
);

const RoofLabel: React.FC<{text: string; position: V3; k?: number}> = ({text, position, k = 1}) => {
  const tex = useCanvas(`roof:${text}`, (ctx, w, h) => drawLines(ctx, text, w, h, C.ink2, 700, 0.7), 512, 128);
  if (k <= 0.01) return null;
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} userData={NO_CLIP}>
      <planeGeometry args={[1.6, 0.4]} />
      <meshBasicMaterial map={tex} transparent opacity={k} />
    </mesh>
  );
};

// ---------------------------------------------------------------------------------------------
const ROAST = '#D6A13B';
const ROAST_DARK = '#A8771E';
/** library: rotisserie_chicken. A golden roast chicken in a clear dome on a black tray, about 0.36 long. `glow`
 * warms it like a heat lamp. Sits at y = 0. */
export const RotisserieChicken: React.FC<D & {position?: V3; scale?: number; rotY?: number; dome?: boolean}> = ({position = [0, 0, 0], scale = 1, rotY = 0, dome = true, glow = 0}) => (
  <group position={position} rotation={[0, rotY, 0]} scale={scale}>
    <RoundedBox args={[0.42, 0.03, 0.3]} radius={0.01} smoothness={2} position={[0, 0.015, 0]} castShadow>
      <meshStandardMaterial color={tint('#2B2C30')} roughness={0.5} />
    </RoundedBox>
    <mesh position={[0, 0.1, 0]} scale={[1.25, 0.8, 1]} castShadow>
      <sphereGeometry args={[0.12, 28, 18]} />
      <meshStandardMaterial color={ROAST} roughness={0.4} emissive={C.gold} emissiveIntensity={glow * 0.12} />
    </mesh>
    {[-0.06, 0.02, 0.1].map((x) => (
      <mesh key={x} position={[x, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.8]} userData={NO_CLIP}>
        <torusGeometry args={[0.105 - Math.abs(x) * 0.3, 0.006, 6, 24, Math.PI]} />
        <meshStandardMaterial color={ROAST_DARK} roughness={0.5} />
      </mesh>
    ))}
    {[-1, 1].map((s) => (
      <mesh key={s} position={[0.13, 0.08, s * 0.06]} rotation={[0, 0, -1.2]} castShadow>
        <capsuleGeometry args={[0.035, 0.08, 6, 10]} />
        <meshStandardMaterial color={ROAST} roughness={0.4} emissive={C.gold} emissiveIntensity={glow * 0.12} />
      </mesh>
    ))}
    {dome && (
      <mesh position={[0, 0.03, 0]} scale={[1.25, 0.95, 0.95]} userData={NO_CLIP}>
        <sphereGeometry args={[0.2, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.18} roughness={0.05} depthWrite={false} />
      </mesh>
    )}
  </group>
);

/** A hanging heat lamp: a shade and a warm cone of light. `k` 0..1 is how bright. Hangs from `position`. */
export const HeatLamp: React.FC<{position?: V3; k?: number; drop?: number}> = ({position = [0, 2, 0], k = 1, drop = 0.9}) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]}>
      <cylinderGeometry args={[0.008, 0.008, 0.8, 6]} />
      <meshBasicMaterial color={C.ink2} />
    </mesh>
    <mesh castShadow>
      <coneGeometry args={[0.2, 0.18, 24, 1, true]} />
      <meshStandardMaterial color={tint('#2B2C30')} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, -drop / 2 - 0.05, 0]} userData={NO_CLIP}>
      <coneGeometry args={[0.45, drop, 32, 1, true]} />
      <meshBasicMaterial color={C.goldGlow} transparent opacity={0.1 * k} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
    <pointLight position={[0, -0.15, 0]} intensity={k * 0.9} distance={2.2} color="#FFE7A8" />
  </group>
);

// ---------------------------------------------------------------------------------------------
export type CartItem = 'tv' | 'nuts' | 'towels' | 'plant' | 'box' | 'chicken';
const CART_ITEMS: CartItem[] = ['tv', 'nuts', 'towels', 'plant', 'box', 'chicken'];
/** library: shopping_cart. A grey wire cart, basket top at y ≈ 0.95, handle towards -x, 0.9 long. `fill` = how many
 * of `items` are in it (fractional pops the next one in). `wobble` sways the pile. */
export const ShoppingCart: React.FC<D & {position?: V3; rotY?: number; fill?: number; items?: CartItem[]; wobble?: number}> = ({
  position = [0, 0, 0], rotY = 0, fill = 0, items = CART_ITEMS, wobble = 0, drain = 0,
}) => {
  const frame = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.8, 0.45, 0.52, 4, 2, 3)), []);
  const wire = tint('#8D9096', drain);
  const slots: V3[] = [[0.0, 0.62, 0.0], [-0.22, 0.88, 0.1], [0.2, 0.9, -0.08], [0.05, 1.12, 0.12], [-0.15, 1.18, -0.1], [0.06, 1.38, 0.0]];
  return (
    <group position={position} rotation={[0, rotY, 0]} userData={solid('cart', true)}>
      <group position={[0, 0.72, 0]}>
        <lineSegments geometry={frame}>
          <lineBasicMaterial color={wire} />
        </lineSegments>
        <mesh>
          <boxGeometry args={[0.8, 0.45, 0.52]} />
          <meshStandardMaterial color={wire} transparent opacity={0.12} depthWrite={false} />
        </mesh>
      </group>
      {/* handle */}
      <mesh position={[-0.5, 1.0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.56, 8]} />
        <meshStandardMaterial color={tint('#F5CF2E')} roughness={0.4} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[-0.45, 0.85, s * 0.26]} rotation={[0, 0, 0.5]}>
          <cylinderGeometry args={[0.012, 0.012, 0.32, 6]} />
          <meshStandardMaterial color={wire} />
        </mesh>
      ))}
      {/* base and wheels */}
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[0.74, 0.02, 0.46]} />
        <meshStandardMaterial color={wire} />
      </mesh>
      {[-0.32, 0.32].map((x) =>
        [-0.2, 0.2].map((z) => (
          <group key={`${x}${z}`}>
            <mesh position={[x, 0.36, z]}>
              <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
              <meshStandardMaterial color={wire} />
            </mesh>
            <mesh position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.035, 14]} />
              <meshStandardMaterial color={tint('#2B2C30')} />
            </mesh>
          </group>
        )),
      )}
      <group rotation={[wobble * 0.08, 0, wobble * 0.05]} position={[0, 0, 0]}>
        {items.map((it, i) => {
          const k = clamp(fill - i);
          if (k <= 0.01) return null;
          const [x, y, z] = slots[i] ?? [0, 1.2 + i * 0.15, 0];
          const drop = (1 - EO(k)) * 0.6;
          return (
            <group key={i} position={[x, y + drop, z]} scale={0.4 + 0.6 * EO(k)} userData={NO_CLIP}>
              <CartThing kind={it} />
            </group>
          );
        })}
      </group>
    </group>
  );
};

const CartThing: React.FC<{kind: CartItem}> = ({kind}) => {
  if (kind === 'chicken') return <RotisserieChicken scale={0.9} position={[0, -0.02, 0]} glow={0.4} />;
  if (kind === 'tv')
    return (
      <mesh rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.62, 0.42, 0.1]} />
        <meshStandardMaterial color={tint('#2B2C30')} roughness={0.5} />
      </mesh>
    );
  if (kind === 'nuts')
    return (
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.14, 0.3, 22]} />
        <meshStandardMaterial color={tint('#F5CF2E')} roughness={0.5} />
      </mesh>
    );
  if (kind === 'towels')
    return (
      <group>
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 0.24, 18]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} />
          </mesh>
        ))}
      </group>
    );
  if (kind === 'plant')
    return (
      <group>
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.06, 0.12, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.6} />
        </mesh>
        {[0, 1.3, 2.6, 3.9, 5.2].map((a) => (
          <mesh key={a} position={[Math.sin(a) * 0.05, 0.1, Math.cos(a) * 0.05]} rotation={[Math.cos(a) * 0.5, 0, Math.sin(a) * 0.5]} castShadow>
            <capsuleGeometry args={[0.025, 0.16, 4, 8]} />
            <meshStandardMaterial color={tint('#7C8C6A')} roughness={0.7} />
          </mesh>
        ))}
      </group>
    );
  return (
    <mesh castShadow>
      <boxGeometry args={[0.3, 0.24, 0.26]} />
      <meshStandardMaterial color={tint('#E3E4E7')} roughness={0.8} />
    </mesh>
  );
};

// ---------------------------------------------------------------------------------------------
/** library: pizza_box. A flat white pizza box, 0.45 square, 0.06 tall. `open` 0..1 lifts the lid (hinged at -z). Sits at y = 0. */
export const PizzaBox: React.FC<D & {position?: V3; rotY?: number; open?: number; scale?: number; pizza?: boolean}> = ({position = [0, 0, 0], rotY = 0, open = 0, scale = 1, pizza = true}) => (
  <group position={position} rotation={[0, rotY, 0]} scale={scale}>
    <RoundedBox args={[0.45, 0.05, 0.45]} radius={0.008} smoothness={2} position={[0, 0.025, 0]} castShadow receiveShadow>
      <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
    </RoundedBox>
    {pizza && open > 0.05 && <Pizza position={[0, 0.052, 0]} r={0.19} />}
    <group position={[0, 0.055, -0.225]} rotation={[-open * 1.9, 0, 0]}>
      <RoundedBox args={[0.45, 0.012, 0.45]} radius={0.005} smoothness={2} position={[0, 0, 0.225]} castShadow>
        <meshStandardMaterial color="#FFFFFF" roughness={0.85} />
      </RoundedBox>
      <mesh position={[0, 0.007, 0.225]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color={C.red} />
      </mesh>
    </group>
  </group>
);

/** A round pizza: yellow cheese, red dots. Lies flat at y = 0. */
export const Pizza: React.FC<{position?: V3; r?: number; cooked?: number}> = ({position = [0, 0, 0], r = 0.19, cooked = 1}) => (
  <group position={position}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[r, 40]} />
      <meshStandardMaterial color={new THREE.Color('#F6E7B8').lerp(new THREE.Color('#F5CF2E'), cooked).getStyle()} roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[r * 0.9, r, 40]} />
      <meshStandardMaterial color="#F3E3C0" roughness={0.9} />
    </mesh>
    {[[0.06, 0.05], [-0.07, 0.03], [0.02, -0.08], [-0.03, 0.09], [0.1, -0.03], [-0.09, -0.07]].map(([x, z], i) => (
      <mesh key={i} position={[x * (r / 0.19), 0.006, z * (r / 0.19)]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[r * 0.12, 18]} />
        <meshStandardMaterial color={C.red} roughness={0.6} />
      </mesh>
    ))}
  </group>
);

/** library: pizza_oven. A rounded white oven on a counter, mouth facing +z, about 1.7 tall overall. `glow` 0..1 lights
 * the mouth. The mouth's floor is at y = 1.0, x = 0, z ≈ 0.35. */
export const PizzaOven: React.FC<D & {position?: V3; rotY?: number; glow?: number}> = ({position = [0, 0, 0], rotY = 0, glow = 0.6, drain = 0}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <RoundedBox args={[1.5, 0.95, 0.9]} radius={0.04} smoothness={3} position={[0, 0.475, 0]} castShadow receiveShadow userData={solid('oven counter')}>
      <Clay color="#FFFFFF" drain={drain} />
    </RoundedBox>
    <mesh position={[0, 0.95, -0.05]} scale={[1, 0.8, 0.9]} castShadow userData={solid('oven')}>
      <sphereGeometry args={[0.62, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <Clay color="#FFFFFF" drain={drain} />
    </mesh>
    {/* the mouth: a dark arch with fire light inside */}
    <mesh position={[0, 0.98, 0.5]} userData={NO_CLIP}>
      <circleGeometry args={[0.25, 32, 0, Math.PI]} />
      <meshBasicMaterial color={new THREE.Color('#2B2C30').lerp(new THREE.Color(C.gold), clamp(glow) * 0.85).getStyle()} />
    </mesh>
    <mesh position={[0, 0.975, 0.501]} userData={NO_CLIP}>
      <planeGeometry args={[0.5, 0.012]} />
      <meshBasicMaterial color="#2B2C30" />
    </mesh>
    <pointLight position={[0, 1.1, 0.75]} intensity={clamp(glow) * 2.2} distance={2.2} color="#FFD27A" />
    {/* chimney */}
    <mesh position={[0.2, 1.55, -0.2]} castShadow>
      <cylinderGeometry args={[0.07, 0.08, 0.35, 16]} />
      <Clay color="#E3E4E7" drain={drain} />
    </mesh>
  </group>
);

/** library: wall_clock. A big round wall clock facing +z. Hands turn with `time` (minutes shown = time * speed).
 * `ring` 0 = angry red, 1 = calm yellow. Centre at `position`. */
export const WallClock: React.FC<{position?: V3; minutes?: number; ring?: number; r?: number}> = ({position = [0, 2.6, 0], minutes = 0, ring = 0, r = 0.5}) => {
  const col = new THREE.Color(C.red).lerp(new THREE.Color(C.gold), clamp(ring)).getStyle();
  const mAng = -(minutes / 60) * Math.PI * 2;
  const hAng = -(minutes / 720) * Math.PI * 2 - 0.9;
  return (
    <group position={position}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, 0.06, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
      </mesh>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.035, 10, 48]} />
          <meshStandardMaterial color={col} emissive={col} emissiveIntensity={0.25} roughness={0.4} />
        </mesh>
      </group>
      <group position={[0, 0, 0.035]}>
        {Array.from({length: 12}, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.sin(a) * r * 0.82, Math.cos(a) * r * 0.82, 0]} rotation={[0, 0, -a]}>
              <planeGeometry args={[0.02, i % 3 === 0 ? 0.08 : 0.045]} />
              <meshBasicMaterial color={C.ink} />
            </mesh>
          );
        })}
        <group rotation={[0, 0, mAng]}>
          <mesh position={[0, r * 0.34, 0.004]}>
            <planeGeometry args={[0.025, r * 0.72]} />
            <meshBasicMaterial color={C.ink} />
          </mesh>
        </group>
        <group rotation={[0, 0, hAng]}>
          <mesh position={[0, r * 0.22, 0.006]}>
            <planeGeometry args={[0.04, r * 0.46]} />
            <meshBasicMaterial color={C.ink} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.008]}>
          <circleGeometry args={[0.03, 16]} />
          <meshBasicMaterial color={C.ink} />
        </mesh>
      </group>
    </group>
  );
};

/** A wall section facing +z that can turn to glass (`glass` 0..1) or slide down into the floor like a shutter
 * (`drop` 0..1). `width` along x, bottom at y = 0. */
export const GlassWall: React.FC<D & {position?: V3; width?: number; height?: number; glass?: number; drop?: number}> = ({position = [0, 0, 0], width = 3, height = 2.6, glass = 0, drop = 0, drain = 0}) => {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(width, height, 0.1)), [width, height]);
  const g = clamp(glass);
  const y = height / 2 - EIN(clamp(drop)) * (height + 0.1);
  if (drop >= 0.999) return null;
  return (
    <group position={[position[0], position[1] + y, position[2]]}>
      <mesh castShadow={g < 0.5} receiveShadow userData={g < 0.5 ? solid('wall') : NO_CLIP}>
        <boxGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color={tint('#FFFFFF', drain)} transparent opacity={lerp(1, 0.1, g)} roughness={lerp(0.8, 0.05, g)} depthWrite={g < 0.5} />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={C.ink2} transparent opacity={0.15 + g * 0.4} />
      </lineSegments>
    </group>
  );
};

// ---------------------------------------------------------------------------------------------
/** library: drinks_cooler. A white cooler box, 0.9 × 0.5 × 0.55, lid hinged at -z. `lid` 0..1 opens it. Inside is
 * dark ice. Sits at y = 0. */
export const DrinksCooler: React.FC<D & {position?: V3; rotY?: number; lid?: number; dark?: number}> = ({position = [0, 0, 0], rotY = 0, lid = 0, dark = 0}) => (
  <group position={position} rotation={[0, rotY, 0]}>
    <RoundedBox args={[0.9, 0.5, 0.55]} radius={0.05} smoothness={3} position={[0, 0.25, 0]} castShadow receiveShadow userData={solid('cooler')}>
      <meshStandardMaterial color={dim('#FFFFFF', dark)} roughness={0.5} />
    </RoundedBox>
    <mesh position={[0, 0.505, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.8, 0.45]} />
      <meshStandardMaterial color="#1A1B1E" roughness={0.3} />
    </mesh>
    {[[-0.25, 0.1], [0.0, -0.08], [0.22, 0.12], [-0.1, 0.13], [0.3, -0.1]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.515, z]}>
        <cylinderGeometry args={[0.018, 0.018, 0.02, 12]} />
        <meshStandardMaterial color={dim('#8D9096', dark)} metalness={0.5} roughness={0.3} />
      </mesh>
    ))}
    <group position={[0, 0.5, -0.275]} rotation={[-lid * 1.75, 0, 0]}>
      <RoundedBox args={[0.92, 0.07, 0.57]} radius={0.03} smoothness={3} position={[0, 0.035, 0.275]} castShadow>
        <meshStandardMaterial color={dim('#FFFFFF', dark)} roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.072, 0.275]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.06]} />
        <meshBasicMaterial color={dim(C.gold, dark * 0.6)} />
      </mesh>
    </group>
  </group>
);

// ---------------------------------------------------------------------------------------------
// The contour bottle profile (radius, height), 0.364 tall at scale 1. Not a trademark drawing: a generic curvy soda bottle.
const CONTOUR: [number, number][] = [
  [0.0, 0], [0.03, 0], [0.033, 0.008], [0.034, 0.035], [0.029, 0.066], [0.033, 0.09], [0.036, 0.112], [0.035, 0.14], [0.031, 0.165],
  [0.027, 0.188], [0.029, 0.212], [0.027, 0.24], [0.02, 0.275], [0.0135, 0.31], [0.0115, 0.345], [0.0138, 0.352], [0.0128, 0.362], [0.0, 0.364],
];
const SPLIT = 0.188;
const lathe = (pts: [number, number][], seg = 40, phi0 = 0, phiLen = Math.PI * 2) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg, phi0, phiLen);

/** Where each broken piece ends up on the floor (relative to the bottle), and how it lies. */
const SHARDS = [
  {half: 0, q: 0, to: [0.16, 0.02, 0.08], rot: [1.5, 0.4, 0.3]},
  {half: 0, q: 1, to: [-0.14, 0.02, 0.12], rot: [1.6, -0.6, 0.2]},
  {half: 0, q: 2, to: [-0.08, 0.02, -0.14], rot: [-1.5, 0.8, 0.1]},
  {half: 0, q: 3, to: [0.12, 0.02, -0.1], rot: [-1.55, -0.3, 0.4]},
  {half: 1, q: 0, to: [0.3, 0.03, 0.02], rot: [1.4, 1.2, 0.2]},
  {half: 1, q: 1, to: [-0.26, 0.03, -0.04], rot: [1.5, -1.0, 0.6]},
  {half: 1, q: 2, to: [0.02, 0.03, 0.26], rot: [-1.45, 0.2, 1.1]},
  {half: 1, q: 3, to: [-0.02, 0.03, -0.28], rot: [-1.5, 2.2, 0.3]},
];

/** library: contour_bottle. A curvy glass soda bottle, 0.364 tall at scale 1, dark drink inside, no logo. `outline` 0..1
 * shows a glowing yellow rim, `dark` 0..1 fades the body into the dark (the rim stays), `broken` 0..1 shatters it into
 * eight curved pieces that land on the floor (y = 0 of the bottle). `morph` 0..1 grows it from a straight bottle. */
export const ContourBottle: React.FC<{position?: V3; scale?: number; rotY?: number; outline?: number; dark?: number; broken?: number; morph?: number; tilt?: number; rimOnly?: boolean}> = ({
  position = [0, 0, 0], scale = 1, rotY = 0, outline = 0, dark = 0, broken = 0, morph = 1, tilt = 0, rimOnly = false,
}) => {
  const prof = useMemo<[number, number][]>(() => CONTOUR.map(([r, y]) => {
    const straight = y > 0.25 ? r : y > 0.008 ? (y < 0.24 ? 0.032 : r) : r;
    return [lerp(straight, r, clamp(morph)), y];
  }), [Math.round(morph * 50)]);
  const whole = useMemo(() => lathe(prof), [prof]);
  const liquid = useMemo(() => lathe(prof.filter(([, y]) => y <= 0.25).map(([r, y]) => [r * 0.86, y * 0.98 + 0.004] as [number, number]), 32), [prof]);
  const pieces = useMemo(() => SHARDS.map((s) => lathe(prof.filter(([, y]) => (s.half === 0 ? y <= SPLIT : y >= SPLIT)), 10, s.q * (Math.PI / 2), Math.PI / 2)), [prof]);
  const glass = dim('#F4F5F7', dark);
  const drink = dim('#2A1E19', dark * 0.5);
  const rim = clamp(outline);
  const b = clamp(broken);
  return (
    <group position={position} rotation={[tilt, rotY, 0]} scale={scale}>
      {rimOnly && b <= 0.001 ? (
        // Only the glowing rim: the body writes depth but no colour, so the rim reads as an outline (for lights-out layers).
        <group>
          <mesh geometry={whole} userData={NO_CLIP} renderOrder={1}>
            <meshBasicMaterial colorWrite={false} />
          </mesh>
          <mesh geometry={whole} scale={[1.12, 1.03, 1.12]} position={[0, -0.005, 0]} userData={NO_CLIP} renderOrder={2}>
            <meshBasicMaterial color={C.gold} side={THREE.BackSide} transparent opacity={rim} />
          </mesh>
        </group>
      ) : b <= 0.001 ? (
        <group userData={solid('bottle', true)}>
          <mesh geometry={whole} castShadow>
            <meshPhysicalMaterial color={glass} transparent opacity={lerp(0.55, 0.15, clamp(dark))} roughness={0.08} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <mesh geometry={liquid} userData={NO_CLIP}>
            <meshStandardMaterial color={drink} roughness={0.3} transparent opacity={1 - clamp(dark) * 0.85} />
          </mesh>
          {rim > 0.01 && (
            <mesh geometry={whole} scale={[1.12, 1.03, 1.12]} position={[0, -0.005, 0]} userData={NO_CLIP}>
              <meshBasicMaterial color={C.gold} side={THREE.BackSide} transparent opacity={rim} />
            </mesh>
          )}
        </group>
      ) : (
        SHARDS.map((s, i) => {
          const fall = EIN(clamp(b * 1.25 - i * 0.03));
          const lift = s.half === 1 ? SPLIT : 0;
          const pos: V3 = [s.to[0] * fall, lerp(lift * 0.6, s.to[1], fall), s.to[2] * fall];
          return (
            <group key={i} position={pos} rotation={[s.rot[0] * fall, s.rot[1] * fall, s.rot[2] * fall]}>
              <group position={[0, -lift * (fall > 0.5 ? 1 : 0.4), 0]}>
                {!rimOnly && (
                  <mesh geometry={pieces[i]} userData={NO_CLIP}>
                    <meshPhysicalMaterial color={glass} transparent opacity={0.4} roughness={0.08} side={THREE.DoubleSide} depthWrite={false} />
                  </mesh>
                )}
                {rim > 0.01 && (
                  <mesh geometry={pieces[i]} scale={[1.14, 1.04, 1.14]} userData={NO_CLIP}>
                    <meshBasicMaterial color={C.gold} side={THREE.DoubleSide} transparent opacity={rim * 0.9} />
                  </mesh>
                )}
              </group>
            </group>
          );
        })
      )}
    </group>
  );
};

/** library: plain_bottle. A straight-sided generic bottle the same height as the contour bottle, with a paper label
 * band reading `label`. `labelScale` balloons the label, `dark` 0..1 fades it into the dark. Sits at y = 0. */
export const PlainBottle: React.FC<{position?: V3; scale?: number; rotY?: number; label?: string; labelScale?: number; dark?: number; pop?: number}> = ({
  position = [0, 0, 0], scale = 1, rotY = 0, label = '', labelScale = 1, dark = 0, pop = 1,
}) => {
  const prof = useMemo(() => lathe([[0, 0], [0.031, 0], [0.033, 0.008], [0.033, 0.235], [0.027, 0.26], [0.016, 0.3], [0.0115, 0.345], [0.0138, 0.352], [0.0128, 0.362], [0, 0.364]]), []);
  // the band's front is about as wide as it is tall, so the canvas is square; a long name splits over two lines
  const text = label.length > 6 && label.includes('-') ? label.replace('-', '-\n') : label;
  const tex = useCanvas(`pb:${text}`, (ctx, w, h) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
    if (text) {
      ctx.save();
      ctx.translate(w * 0.16, 0);
      drawLines(ctx, text, w * 0.68, h, C.ink, 700, text.includes('\n') ? 0.78 : 0.5);
      ctx.restore();
    }
  }, 512, 512);
  if (pop <= 0.01) return null;
  const k = clamp(dark);
  const arc = Math.PI * 0.9;
  return (
    <group position={position} rotation={[0, rotY, 0]} scale={scale * (pop < 1 ? EO(pop) : 1)} userData={solid('bottle')}>
      <mesh geometry={prof} castShadow={k < 0.5}>
        <meshPhysicalMaterial color={dim('#E9ECEF', k)} transparent opacity={lerp(0.6, 0.05, k)} roughness={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.11, 0]} userData={NO_CLIP}>
        <cylinderGeometry args={[0.027, 0.027, 0.2, 24]} />
        <meshStandardMaterial color={dim('#2A1E19', k * 0.5)} transparent opacity={1 - k * 0.9} />
      </mesh>
      <group position={[0, 0.13, 0]} scale={[1 + 0.12 * (labelScale - 1), labelScale, 1 + 0.12 * (labelScale - 1)]}>
        <mesh userData={NO_CLIP}>
          <cylinderGeometry args={[0.0345, 0.0345, 0.1, 32, 1, true, -arc / 2, arc]} />
          <meshBasicMaterial map={tex} transparent opacity={1 - k} side={THREE.FrontSide} />
        </mesh>
      </group>
    </group>
  );
};

// ---------------------------------------------------------------------------------------------
/** Letter tiles on a table that slide from a scramble (`order` 0) into `text` (`order` 1). `blank` 0..1 hides the
 * letters, `strike` is the index of a tile to cross out in yellow (`strikeK` 0..1). Tiles sit on y = 0, centred. */
export const LetterTiles: React.FC<{text: string; position?: V3; rotY?: number; order?: number; blank?: number; strike?: number; strikeK?: number; size?: number}> = ({
  text, position = [0, 0, 0], rotY = 0, order = 1, blank = 0, strike = -1, strikeK = 0, size = 0.11,
}) => {
  const letters = [...text];
  const gap = size * 1.12;
  const x0 = (-(letters.length - 1) * gap) / 2;
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      {letters.map((ch, i) => {
        // a fixed scramble: each tile starts somewhere else on the table, turned a little
        const sx = Math.sin(i * 2.7 + 1.3) * gap * letters.length * 0.42;
        const sz = Math.cos(i * 1.9 + 0.4) * size * 2.2;
        const k = EO(clamp(order * 1.4 - i * (0.4 / letters.length)));
        const x = lerp(sx, x0 + i * gap, k);
        const z = lerp(sz, 0, k);
        return <Tile key={i} ch={ch === '-' ? '–' : ch} position={[x, size / 2, z]} rotY={(1 - k) * Math.sin(i * 3.3) * 0.8} size={size} blank={blank} struck={i === strike ? strikeK : 0} />;
      })}
    </group>
  );
};

const Tile: React.FC<{ch: string; position: V3; rotY: number; size: number; blank: number; struck: number}> = ({ch, position, rotY, size, blank, struck}) => {
  const tex = useCanvas(`tile:${ch}`, (ctx, w, h) => drawLines(ctx, ch, w, h, C.ink, 700, 0.8), 128, 128);
  return (
    <group position={position} rotation={[0, rotY, 0]}>
      <RoundedBox args={[size, size, size * 0.5]} radius={size * 0.12} smoothness={3} castShadow>
        <meshStandardMaterial color={new THREE.Color('#FFFFFF').lerp(new THREE.Color(C.coldLight), struck).getStyle()} roughness={0.55} />
      </RoundedBox>
      <mesh position={[0, 0, size * 0.26]}>
        <planeGeometry args={[size * 0.85, size * 0.85]} />
        <meshBasicMaterial map={tex} transparent opacity={1 - clamp(blank)} />
      </mesh>
      {struck > 0.01 && (
        <mesh position={[0, 0, size * 0.27]} rotation={[0, 0, -0.7]}>
          <planeGeometry args={[size * 1.15 * struck, size * 0.12]} />
          <meshBasicMaterial color={C.gold} />
        </mesh>
      )}
    </group>
  );
};

// ---------------------------------------------------------------------------------------------
/** A plain front door in a white wall section (3 wide), facing +z, with a handle on the right at y = 1.0. */
export const FrontDoor: React.FC<D & {position?: V3; rotY?: number; scale?: number}> = ({position = [0, 0, 0], rotY = 0, scale = 1, drain = 0}) => (
  <group position={position} rotation={[0, rotY, 0]} scale={scale}>
    <mesh position={[0, 1.35, -0.06]} receiveShadow userData={solid('wall')}>
      <boxGeometry args={[3, 2.7, 0.1]} />
      <meshStandardMaterial color={tint('#FFFFFF', drain)} roughness={0.85} />
    </mesh>
    <RoundedBox args={[0.95, 2.1, 0.06]} radius={0.02} smoothness={3} position={[0, 1.05, 0.0]} castShadow>
      <Clay color="#C9C9C6" drain={drain} />
    </RoundedBox>
    {[0.55, 1.45].map((y) => (
      <mesh key={y} position={[0, y, 0.035]}>
        <planeGeometry args={[0.7, 0.62]} />
        <meshStandardMaterial color={tint('#E3E4E7', drain)} roughness={0.7} />
      </mesh>
    ))}
    <mesh position={[0.36, 1.0, 0.07]} castShadow>
      <sphereGeometry args={[0.035, 16, 12]} />
      <meshStandardMaterial color={tint('#F5CF2E')} metalness={0.5} roughness={0.3} />
    </mesh>
  </group>
);
