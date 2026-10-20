# Start here

This is everything you need to carry on working locally in this folder (`~/code/networking-brain`) with Claude Code.

## Open it

- **Claude Code desktop app:** pick this folder as the working folder and start a new session.
- **Terminal:** `cd ~/code/networking-brain && claude`

Claude reads `CLAUDE.md`, which loads `AGENTS.md` (the rulebook), so every session already knows the account, the rules and the workflow.

## What you can type

```
/script <topic or T12>        one finished script + storyboard
/batch 5                      five scripts from the topic bank
/ideas 10                     new topic ideas, added to the bank
/video scripts/<file>.md      voice it, code the shots, render the MP4
/make <topic>                 research, script and video in one go
/align scripts/<file>.md <timestamps.json>   time a real voice take
/refresh <Media Tools export folder>         import stats, label posts, rebuild tables
```

Or just ask in plain words ("write me a script about following up after a coffee").

## Where things are

| What | Where |
|---|---|
| Finished scripts (full: hooks, storyboard, caption, sources) | `scripts/YYYY-MM-DD-<name>.md` |
| Script-only versions, split into beats | `scripts/plain/` |
| What's been written and posted | `content-log.md` |
| Topics waiting to be written | `topics/topic-bank.md` |
| Props and sets for the 3D videos | `visuals/library.json` (`python3 tools/library.py list`) |
| Rendered videos | `video/out/<name>.mp4` |
| How the videos are made | `knowledge/13-video-production.md` |

## Status (2026-10-20)

- **Script brain:** done. Every script goes through `python3 tools/check_script.py`.
- **10 scripts:** written on 2026-10-20, status `drafted` in `content-log.md`. Kept at their current length on purpose (about 50 to 55 seconds each).
- **Video step:** built and tested on this Mac. `./setup.sh` has been run. The sample (`2026-10-20-the-second-question`) renders in under a minute with the GPU.
- **Git:** this folder is on the branch `claude/project-thread-lqmjtd` (pull request #1 on GitHub, still a draft). Merge it into `main` when you're happy, then work on `main`.

## Decided

- Same niche as @theoryofbehaviour. We win on volume (2 to 3 reels a day), better scripts and our own 3D look.
- Account: @f___a___c___t___s, Instagram first, TikTok after.
- Creative storyboards: one visual metaphor per video, a locked look and cast, and a prop library that grows and gets reused.
- Audio first: the voiceover is recorded before the visuals, and every shot is timed to spoken words.
- Everything runs locally on this Mac (renders are about 50 times faster than the cloud).

## Still open

- **The voice.** Videos use a free placeholder voice (Edge, "Andrew") for now. Once you pick one, use `--engine elevenlabs --voice <id>` (needs `ELEVENLABS_API_KEY`), or record it yourself and drop the file at `video/public/<name>/voice.mp3`.
- **Spelling.** US English by default (`config.json`).
- **The exact palette and materials** of the 3D look are provisional (`knowledge/12-visual-storyboard.md` §1).
- **Before posting script 2** ("The specific follow-up"): its hook copies the shape of one of @theoryofbehaviour's hooks, so consider rewording it. Each script's "Check before posting" list covers the rest.

## After you post

Update the script's row in `content-log.md` (status `posted`, date, link). When you have stats, export them with Media Tools and run `/refresh` so the brain learns what works for our account.
