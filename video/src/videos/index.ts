// Every video registers here. tools/make_video.py adds the line for a new one.
import type React from 'react';
import type {Timing} from '../kit/timing';
import * as v_2026_10_20_the_second_question from './2026-10-20-the-second-question/Video';
import * as v_2026_10_20_the_seat_next_to_you from './2026-10-20-the-seat-next-to-you/Video';
import * as v_2026_10_21_the_car_that_flies from './2026-10-21-the-car-that-flies/Video';
import * as v_2026_10_21_the_tilted_laptop from './2026-10-21-the-tilted-laptop/Video';
import * as v_2026_10_21_the_comma_in_the_price from './2026-10-21-the-comma-in-the-price/Video';
import * as v_2026_10_21_the_folding_iphone from './2026-10-21-the-folding-iphone/Video';
import * as v_2026_10_21_the_heavy_bowl from './2026-10-21-the-heavy-bowl/Video';
import * as v_2026_10_21_the_name_from_the_bronx from './2026-10-21-the-name-from-the-bronx/Video';
import * as v_2026_10_21_the_chicken_at_the_back from './2026-10-21-the-chicken-at-the-back/Video';
import * as v_2026_10_21_the_pizza_in_the_oven from './2026-10-21-the-pizza-in-the-oven/Video';
import * as v_2026_10_21_the_bottle_in_the_dark from './2026-10-21-the-bottle-in-the-dark/Video';
import * as v_2026_10_21_the_ad_you_posted from './2026-10-21-the-ad-you-posted/Video';

export type VideoEntry = {id: string; component: React.FC; timing: Timing};

export const VIDEOS: VideoEntry[] = [
  {id: '2026-10-21-the-ad-you-posted', component: v_2026_10_21_the_ad_you_posted.Video, timing: v_2026_10_21_the_ad_you_posted.timing as unknown as Timing},
  {id: '2026-10-21-the-bottle-in-the-dark', component: v_2026_10_21_the_bottle_in_the_dark.Video, timing: v_2026_10_21_the_bottle_in_the_dark.timing as unknown as Timing},
  {id: '2026-10-21-the-pizza-in-the-oven', component: v_2026_10_21_the_pizza_in_the_oven.Video, timing: v_2026_10_21_the_pizza_in_the_oven.timing as unknown as Timing},
  {id: '2026-10-21-the-chicken-at-the-back', component: v_2026_10_21_the_chicken_at_the_back.Video, timing: v_2026_10_21_the_chicken_at_the_back.timing as unknown as Timing},
  {id: '2026-10-21-the-name-from-the-bronx', component: v_2026_10_21_the_name_from_the_bronx.Video, timing: v_2026_10_21_the_name_from_the_bronx.timing as unknown as Timing},
  {id: '2026-10-21-the-heavy-bowl', component: v_2026_10_21_the_heavy_bowl.Video, timing: v_2026_10_21_the_heavy_bowl.timing as unknown as Timing},
  {id: '2026-10-21-the-folding-iphone', component: v_2026_10_21_the_folding_iphone.Video, timing: v_2026_10_21_the_folding_iphone.timing as unknown as Timing},
  {id: '2026-10-21-the-comma-in-the-price', component: v_2026_10_21_the_comma_in_the_price.Video, timing: v_2026_10_21_the_comma_in_the_price.timing as unknown as Timing},
  {id: '2026-10-21-the-tilted-laptop', component: v_2026_10_21_the_tilted_laptop.Video, timing: v_2026_10_21_the_tilted_laptop.timing as unknown as Timing},
  {id: '2026-10-21-the-car-that-flies', component: v_2026_10_21_the_car_that_flies.Video, timing: v_2026_10_21_the_car_that_flies.timing as unknown as Timing},
  {id: '2026-10-20-the-seat-next-to-you', component: v_2026_10_20_the_seat_next_to_you.Video, timing: v_2026_10_20_the_seat_next_to_you.timing as unknown as Timing},
  {id: '2026-10-20-the-second-question', component: v_2026_10_20_the_second_question.Video, timing: v_2026_10_20_the_second_question.timing as unknown as Timing},
];
