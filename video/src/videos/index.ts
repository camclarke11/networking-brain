// Every video registers here. tools/make_video.py adds the line for a new one.
import type React from 'react';
import type {Timing} from '../kit/timing';
import * as v_2026_10_20_the_second_question from './2026-10-20-the-second-question/Video';

export type VideoEntry = {id: string; component: React.FC; timing: Timing};

export const VIDEOS: VideoEntry[] = [
  {id: '2026-10-20-the-second-question', component: v_2026_10_20_the_second_question.Video, timing: v_2026_10_20_the_second_question.timing as unknown as Timing},
];
