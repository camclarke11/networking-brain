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
  // neutral base: off-white space and soft greys
  base: '#F3F2EE',
  base2: '#E6E5E1',
  base3: '#C9C9C6',
  white: '#FFFFFF',
  ink: '#1F2023',
  ink2: '#5B5D62',
  // the one accent (yellow): the right move
  gold: '#F5CF2E',
  goldDeep: '#D9AE00',
  goldGlow: '#FFE88A',
  // the "wrong" tone (flat cold grey): the wrong move
  cold: '#8D9096',
  coldDeep: '#5E6167',
  coldLight: '#E3E4E7',
  // verdicts
  red: '#E5484D',
  green: '#2FA36B',
};

// Fonts ship with the repo (public/fonts, SIL Open Font License) so renders never need the network.
loadFont({family: 'Antonio', url: staticFile('fonts/Antonio-var.ttf'), weight: '100 700'});
loadFont({family: 'Bricolage Grotesque', url: staticFile('fonts/BricolageGrotesque-800.woff2'), weight: '800'});
loadFont({family: 'Inter', url: staticFile('fonts/Inter-var.woff2'), weight: '100 900'});
loadFont({family: 'Caveat', url: staticFile('fonts/Caveat-700.woff2'), weight: '700'});

export const FONT = {
  display: "'Antonio', sans-serif", // tall condensed headlines, weights 100 to 700
  ui: "'Inter', sans-serif",
  hand: "'Caveat', cursive",
};

export const SHADOW = '0 14px 40px rgba(31,32,35,0.12), 0 2px 8px rgba(31,32,35,0.06)';
