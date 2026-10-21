---
description: Turn a finished script into a post-ready vertical MP4
argument-hint: <scripts/file.md> [--engine elevenlabs --voice <id>]
---
Make the video for: $ARGUMENTS

Follow knowledge/13-video-production.md exactly.

1. Read knowledge/13-video-production.md, knowledge/12-visual-storyboard.md, the script's STORYBOARD, and the worked example video/src/videos/2026-10-20-the-second-question/Video.tsx.
2. `python3 tools/make_video.py <script> prep` (add any voice options given). Fix align warnings in the storyboard until it's clean.
3. Write video/src/videos/<slug>/Video.tsx: one component per shot, every time from cue()/word()/line(), the storyboard's metaphor and cues brought to life. Build any new asset as a reusable kit component, not inside the video.
4. `cd video && npx tsc --noEmit`, then `python3 tools/make_video.py <script> check` until it says no clipping and nothing off screen, then `stills`. Look at every contact sheet as a viewer, fix, and repeat.
5. `python3 tools/make_video.py <script> render`. Sample the finished MP4 and check it once more.
6. Mark built assets with `python3 tools/library.py status <id> built`, set the content-log row to `video`, and deliver video/out/<slug>.mp4 with a two-line note on anything to check.
