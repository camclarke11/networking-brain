---
description: Research a topic, write the script, then make the video, start to finish
argument-hint: <topic or topic-bank id, e.g. T06>
---
Make a finished video for: $ARGUMENTS

1. Write the script exactly as `/script` does: AGENTS.md Step 0 to Step 12, saved to scripts/, passing `python3 tools/check_script.py`, registered with `python3 tools/library.py add`, logged in content-log.md.
2. Show me the SCRIPT section and the one-line metaphor, then carry straight on (don't wait) unless the topic was ambiguous.
3. Make the video exactly as `/video` does: knowledge/13-video-production.md, `python3 tools/make_video.py <script> prep`, write the shots, review the stills (at least two passes), `render`.
4. Finish with the path to video/out/<slug>.mp4, its length, and anything I should check before posting (the script's "Check before posting" list plus any visual compromises).
