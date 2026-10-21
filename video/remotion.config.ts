import {Config} from '@remotion/cli/config';

// WebGL for the 3D cast. 'angle' uses the GPU on a Mac; swangle is the CPU fallback for servers.
Config.setChromiumOpenGlRenderer((process.env.REMOTION_GL as 'angle' | 'swangle') ?? 'angle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY ?? 4));
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
