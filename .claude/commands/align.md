---
description: Time a script's storyboard to its recorded narration
argument-hint: <scripts/file.md> <word-timestamps.json>
---
Run the timing pass in AGENTS.md ("After the narration is recorded") for: $ARGUMENTS

1. If the take's words differ from the SCRIPT, update the script, its ELEVENLABS block (and any cues on changed words) to match, then rerun `python3 tools/check_script.py`.
2. Run `python3 tools/align.py $ARGUMENTS`.
3. Fix every warning in the storyboard and rerun until it's clean. Report the shot timings in a short table.
