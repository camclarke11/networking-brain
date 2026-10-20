// The locked look (knowledge/12-visual-storyboard.md §1 and knowledge/13-video-production.md).
// Change these here, never inside a video, so every video stays on-brand.
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Instagram and TikTok cover the bottom ~420px and the right ~150px with their own UI.
export const SAFE = {top: 170, bottom: 1500, left: 70, right: 930};

export const C = {
  // neutral base (warm greys and off-white)
  base: '#EFE6DA',
  base2: '#E2D5C3',
  base3: '#CDBDA8',
  white: '#FFFCF6',
  ink: '#211C17',
  ink2: '#4A4037',
  // brand accent (warm gold): the right move
  gold: '#F2B33D',
  goldDeep: '#C9860F',
  goldGlow: '#FFD983',
  // the "wrong" tone (cold grey-blue): the wrong move
  cold: '#7F93AB',
  coldDeep: '#4B5C72',
  coldLight: '#C4CFDB',
  // verdicts
  red: '#D9483B',
  green: '#3E9E68',
};

// Fonts ship with the repo (public/fonts, SIL Open Font License) so renders never need the network.
loadFont({family: 'Bricolage Grotesque', url: staticFile('fonts/BricolageGrotesque-800.woff2'), weight: '800'});
loadFont({family: 'Inter', url: staticFile('fonts/Inter-var.woff2'), weight: '100 900'});
loadFont({family: 'Caveat', url: staticFile('fonts/Caveat-700.woff2'), weight: '700'});

export const FONT = {
  display: "'Bricolage Grotesque', sans-serif", // weight 800 only
  ui: "'Inter', sans-serif",
  hand: "'Caveat', cursive",
};

export const SHADOW = '0 18px 40px rgba(33,28,23,0.22), 0 4px 10px rgba(33,28,23,0.12)';
