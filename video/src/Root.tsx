import React from 'react';
import {Composition} from 'remotion';
import {FPS, H, W} from './kit/tokens';
import {Cover} from './Cover';
import {CastLineup} from './preview/CastLineup';
import {PropLineup} from './preview/PropLineup';
import {VIDEOS} from './videos';

export const Root: React.FC = () => (
  <>
    {VIDEOS.map((v) => (
      <Composition key={v.id} id={v.id} component={v.component} durationInFrames={Math.ceil(v.timing.duration * FPS)} fps={FPS} width={W} height={H} />
    ))}
    <Composition id="Cover" component={Cover} durationInFrames={FPS * 120} fps={FPS} width={W} height={H} defaultProps={{id: VIDEOS[0].id, title: 'Cover title'}} />
    <Composition id="PropLineup" component={PropLineup} durationInFrames={4} fps={FPS} width={W} height={H} />
    <Composition id="CastLineup" component={CastLineup} durationInFrames={FPS * 6} fps={FPS} width={W} height={H} />
  </>
);
