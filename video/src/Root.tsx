import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './kit/tokens';
import {CastLineup} from './preview/CastLineup';
import {VIDEOS} from './videos';

export const Root: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition key={v.id} id={v.id} component={v.component} durationInFrames={Math.ceil(v.timing.duration * FPS)} fps={FPS} width={W} height={H} />
    ))}
    <Composition id="CastLineup" component={CastLineup} durationInFrames={FPS * 6} fps={FPS} width={W} height={H} />
  </>
);
