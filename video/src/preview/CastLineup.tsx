// The locked cast side by side, for checking the look. `npm run studio` → CastLineup.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Character, CastId} from '../kit/three/Character';
import {Floor, Stage} from '../kit/three/Stage';
import {useT} from '../kit/timing';
import {talk} from '../kit/time';
import {C, FONT} from '../kit/tokens';

const ROW1: CastId[] = ['connector', 'you', 'big_name', 'friend'];
const ROW2: CastId[] = ['stranger_a', 'stranger_b', 'stranger_c', 'professor'];

export const CastLineup: React.FC = () => {
  const t = useT();
  return (
    <AbsoluteFill>
      <Stage t={t} cam={{pos: [0, 3.2, 11.5], target: [0, 1.3, -1.2], fov: 30}}>
        <Floor />
        {ROW1.map((id, i) => (
          <Character key={id} who={id} t={t} position={[(i - 1.5) * 1.25, 0, 0.4]} rotY={Math.sin(t * 0.8 + i) * 0.4} pose={i === 0 ? 'wave' : i === 2 ? 'phone' : i === 3 ? 'cheer' : 'talk'} talking={i === 1 ? talk(t, 0, 99) : 0} seed={i} />
        ))}
        {ROW2.map((id, i) => (
          <Character key={id} who={id} t={t} position={[(i - 1.5) * 1.25, 0, -2.2]} rotY={Math.sin(t * 0.8 + i + 2) * 0.4} pose={i === 3 ? 'present' : 'idle'} mood={i === 1 ? 'shock' : 'happy'} seed={i + 4} />
        ))}
      </Stage>
      <div style={{position: 'absolute', top: 180, width: '100%', textAlign: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 84, color: C.ink}}>The cast</div>
    </AbsoluteFill>
  );
};
