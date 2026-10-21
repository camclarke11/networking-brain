// Every Brand X-ray prop, for checking geometry. `npm run studio` → PropLineup (frame 0 to 3 are views).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Floor, Stage} from '../kit/three/Stage';
import {Character} from '../kit/three/Character';
import {
  Anchor, Billboard, Chain, Coins, FlimsyBag, FoldingPhone, GiftBox, GlassCase, Jar, Laptop, Mug, OwnTag, Pickup, Plinth, PriceTag, PrizeWheel, Ruler, Scales, Sofa, SportsCar, Spoon, StoreTable,
  SyllableTrain, TextCard, YogurtBowl, wheelAngleFor,
} from '../kit/three/brand';

const VIEWS = [
  {pos: [0, 2.2, 7.5], target: [0, 0.9, 0], fov: 40},
  {pos: [0, 1.6, 2.2], target: [0, 0.95, 0], fov: 36},
  {pos: [4.6, 1.6, 4.2], target: [4.6, 0.8, 0], fov: 38},
  {pos: [-4.4, 1.7, 3.6], target: [-4.4, 1.0, -0.2], fov: 40},
] as const;

export const PropLineup: React.FC = () => {
  const f = useCurrentFrame();
  const v = VIEWS[Math.min(f, VIEWS.length - 1)];
  const t = 1.2;
  return (
    <AbsoluteFill>
      <Stage t={t} cam={{pos: [...v.pos], target: [...v.target], fov: v.fov}}>
        <Floor />
        {/* centre: store table with laptops at 70° and a person */}
        <StoreTable position={[0, 0, 0]} />
        {[-1.1, -0.4, 0.3, 1.0].map((x, i) => <Laptop key={x} position={[x, 0.92, 0]} openDeg={i === 1 ? 105 : 70} />)}
        <Character who="you" t={t} position={[0.6, 0, 0.9]} rotY={Math.PI} pose="point" />
        <OwnTag letter="Y" position={[1.0, 1.25, 0.1]} />
        <Mug position={[-1.4, 0.92, 0.2]} />
        <YogurtBowl position={[-0.8, 0.92, 0.25]} />
        <Spoon position={[-0.55, 0.94, 0.3]} heavy />
        <Spoon position={[-0.55, 0.94, 0.38]} />
        <Jar position={[0.7, 0.92, 0.3]} />
        <GiftBox position={[1.3, 0.92, 0.3]} />
        <FlimsyBag position={[-0.1, 0.92, 0.3]} />
        <TextCard lines={['MENU', 'Steak 18', 'Fish 16']} position={[-1.5, 0.93, -0.25]} />
        <Coins position={[-1.2, 0.92, -0.3]} n={8} />
        {/* right: car, pickup, plinth, tags, anchor */}
        <Plinth position={[4.6, 0, 0]} height={0.4} r={1.3} />
        <SportsCar t={t} position={[4.6, 0.4, 0]} rotY={0.4} hover={0.3} thrust={1} jets />
        <GlassCase position={[4.6, 0.4, 0]} size={[2.6, 1.2, 1.4]} />
        <Pickup position={[7.0, 0, -0.8]} rotY={0.3} />
        <PriceTag text="$50,000" position={[4.0, 2.0, 0.6]} swing={0.1} />
        <PriceTag text="INVITE ONLY" position={[5.2, 2.0, 0.6]} glow={1} />
        <Anchor position={[6.6, 0, 1.3]} />
        <Chain x={6.6} z={1.3} top={2.8} bottom={1.7} />
        {/* left: scales, train, ruler, wheel, phone, sofa, billboard */}
        <Scales position={[-4.3, 0, 0.4]} tilt={0.6} left={<PriceTag text="$1,499" position={[0, 0.4, 0]} string={0.1} scale={0.5} />} right={<PriceTag text="1499" position={[0, 0.4, 0]} string={0.1} scale={0.5} />} />
        <SyllableTrain items={['$', 'one', 'thou', 'sand', ',', 'four']} position={[-7.2, 0, 1.4]} pop={[0, 0, 0, 0, 0.5]} />
        <Ruler position={[-6.6, 0, -0.6]} height={3.0} lit={0.4} />
        <PrizeWheel position={[-5.6, 0, -0.8]} angle={wheelAngleFor(65)} />
        <Plinth position={[-3.2, 0, -0.6]} height={0.9} r={0.35} />
        <FoldingPhone position={[-3.2, 1.15, -0.6]} open={0.6} />
        <Sofa position={[-7.6, 0, -1.8]} />
        <Billboard text="AD" position={[8.2, 0, -1.5]} />
      </Stage>
    </AbsoluteFill>
  );
};
