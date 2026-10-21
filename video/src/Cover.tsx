// The cover (thumbnail) for a video: one frame of the video itself, with captions and on-screen text switched off
// (CoverCtx), a soft fade behind the title, and the title in the house headline style. The title sits inside the
// middle 3:4 (y 240 to 1680), so it survives the profile grid's crop.
//   python3 tools/make_video.py scripts/<file>.md cover --at <seconds> --title "..." --highlight <word> [--dark] [--place bottom]
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CoverCtx} from './kit/ui';
import {C, FONT} from './kit/tokens';
import {VIDEOS} from './videos';

/** `shift` moves the video frame down (px) and `zoom` scales it, so the subject can sit clear of the title. */
export type CoverProps = {id: string; title: string; highlight?: string; dark?: boolean; place?: 'top' | 'bottom'; size?: number; shift?: number; zoom?: number};

const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9äöüå'$]/g, '');

export const Cover: React.FC<CoverProps> = ({id, title, highlight = '', dark = false, place = 'top', size = 150, shift = 0, zoom = 1}) => {
  const v = VIDEOS.find((x) => x.id === id);
  if (!v) return <AbsoluteFill style={{background: C.red}} />;
  const Video = v.component;
  const top = place === 'top';
  const shade = dark ? '18,19,21' : '243,242,238';
  const fade = dark
    ? `linear-gradient(${top ? 'to bottom' : 'to top'}, rgba(${shade},0.97) 0%, rgba(${shade},0.93) 36%, rgba(${shade},0) 50%)`
    : `linear-gradient(${top ? 'to bottom' : 'to top'}, rgba(${shade},0.94) 0%, rgba(${shade},0.82) 26%, rgba(${shade},0) 46%)`;
  const hl = highlight.split(' ').map(norm).filter(Boolean);
  return (
    <AbsoluteFill style={{background: dark ? '#121315' : C.base}}>
      <AbsoluteFill style={{transform: `translateY(${shift}px) scale(${zoom})`, transformOrigin: '50% 50%'}}>
        <CoverCtx.Provider value={true}>
          <Video />
        </CoverCtx.Provider>
      </AbsoluteFill>
      <AbsoluteFill style={{background: fade}} />
      <div data-ui="CoverTitle" style={{position: 'absolute', left: 70, right: 70, ...(top ? {top: 290} : {bottom: 330}), textAlign: 'center', lineHeight: 1.02}}>
        {/* "|" in the title forces a line break, so a short last word never sits alone */}
        {title.split('|').map((ln, li) => (
          <div key={li}>
            {ln.trim().split(' ').map((w, i) => {
              const on = hl.includes(norm(w));
              return (
                <span key={i} style={{display: 'inline-block', margin: '0 12px 8px', padding: on ? '0 14px' : 0, fontFamily: FONT.display, fontWeight: 600, fontSize: size, textTransform: 'uppercase',
                  color: on ? C.ink : dark ? C.white : C.ink, background: on ? C.gold : 'transparent', letterSpacing: -1}}>
                  {w}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
