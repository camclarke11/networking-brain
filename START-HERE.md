# Start here

This is everything you need to carry on working locally in this folder (`~/code/networking-brain`) with Claude Code.

## What this is

The script and video brain for **@f___a___c___t___s**, a make-your-business-better account for young founders: one move a video to get clients, sell, price, stand out and keep customers. Two pillars: **the Brand X-ray** (steal a famous brand's trick) and **the Move** (one business moment, the exact move). The views feed a product, **the Playbook**, which is **coming soon**: the bio says so, and the videos don't mention it yet. (The folder is still called `networking-brain`; networking was the first niche and is now the Playbook's "Get clients" chapter.)

## Open it

- **Claude Code desktop app:** pick this folder as the working folder and start a new session.
- **Terminal:** `cd ~/code/networking-brain && claude`
- **Studio (the web app):** `python3 app/server.py`, then open http://localhost:8787 for scripts, ElevenLabs takes, video steps, topics and the library in one place.

Claude reads `CLAUDE.md`, which loads `AGENTS.md` (the rulebook), so every session already knows the account, the rules and the workflow.

## What you can type

```
/script <topic or T31>        one finished script + storyboard + teaser caption
/batch 5                      five scripts from the topic bank, mixed pillars and chapters
/ideas 10                     new topic ideas, added to the bank under their chapter
/video scripts/<file>.md      voice it, code the shots, check, render the MP4
/make <topic>                 research, script and video in one go
/align scripts/<file>.md <timestamps.json>   time a real voice take
/refresh <Media Tools export folder>         import stats, label posts, rebuild tables
```

Or just ask in plain words ("write me a script about why Costco keeps the chicken at the back", "make covers for today's videos").

Covers (thumbnails): `python3 tools/make_video.py scripts/<file>.md cover`, which writes `video/out/<name>-cover.jpg` plus a 3:4 grid preview.

## Where things are

| What | Where |
|---|---|
| Finished scripts (full: hooks, loop map, storyboard, teaser caption, sources) | `scripts/YYYY-MM-DD-<name>.md` |
| Script-only versions, split into beats | `scripts/plain/` |
| The Playbook, drafting itself from every script | `product/playbook.md` |
| What's been written and posted | `content-log.md` |
| Topics waiting to be written, by Playbook chapter | `topics/topic-bank.md` |
| Who it's for, the pillars, the Playbook and its phase | `knowledge/01-audience-and-account.md` |
| Playbook phase, bio text, voice, hashtags | `config.json` |
| Props and sets for the 3D videos | `visuals/library.json` (`python3 tools/library.py list`) |
| Rendered videos and covers | `video/out/<name>.mp4`, `video/out/<name>-cover.jpg` |
| How the videos are made | `knowledge/13-video-production.md` |

## Status (2026-10-22)

- **Niche:** pivoted to making your business better, with the Playbook as the product. Every script is tagged with a pillar and one of six chapters, and its move goes into `product/playbook.md`.
- **Scripts:** 21. Eleven networking scripts from 2026-10-20 (now the "Get clients" chapter, mostly `drafted`) and ten Brand X-rays from 2026-10-21 (all `rendered`).
- **Videos:** 12 MP4s in `video/out/`. The five newest (Häagen-Dazs, Costco, Domino's, Coca-Cola, Spotify Wrapped) are written in the new storytelling style and have covers.
- **Voice:** ElevenLabs, Archie (`config.json` → `elevenlabs`). The key lives in `.env`, which is never committed. Brand names it mispronounces go in `elevenlabs.say`.
- **Checks:** every script goes through `python3 tools/check_script.py`, and every video through the clipping and off-screen check before it renders.
- **Git:** this folder is on the branch `claude/project-thread-lqmjtd` (pull request #1 on GitHub, still a draft). Merge it into `main` when you're happy, then work on `main`.

## Decided

- **Niche:** make your business better. Two pillars, Brand X-ray and the Move, mixed so the same pillar never runs three times in a row.
- **Account:** @f___a___c___t___s, Instagram first, TikTok after. We win on volume (2 to 3 reels a day), better scripts and our own 3D look.
- **The Playbook:** coming soon. No CTA in the videos; the bio says it's coming and each caption has one line about it. Switch `playbook.status` to `live` in `config.json` when there's traction.
- **Scripts lead:** a hook that drops "you" into the moment, every line pulling to the next, and facts told as scenes, never "researchers found" (`knowledge/04-lesson-engine.md`).
- **Captions are teasers:** one line, usually a question, naming nothing from the video (`knowledge/05-endings-and-ctas.md`).
- **The look:** minimal off-white 3D, pill figures, one yellow accent. One visual metaphor per video, and a prop library that grows and gets reused.
- **Audio first:** the voiceover is recorded before the visuals, and every shot is timed to spoken words.
- **Everything runs locally** on this Mac (renders are about 50 times faster than the cloud).

## Still open

- **The Playbook's final name** (working name "the Playbook"; never "the networking playbook", which is @theoryofbehaviour's) and **when to launch it.**
- **The playbook-style account you found:** export it with Media Tools and run `/refresh` so its numbers join the reference data.
- **Older scripts that still narrate research:** the five earlier Brand X-rays and some of the networking scripts say "researchers found". The checker fails them, so rewrite them in the new style before posting.
- **Before posting "The specific follow-up":** its hook copies the shape of one of @theoryofbehaviour's hooks, so consider rewording it. Each script's "Check before posting" list covers the rest.

## After you post

Update the script's row in `content-log.md` (status `posted`, date, link). When you have stats, export them with Media Tools and run `/refresh` so the brain learns what works for our account.
