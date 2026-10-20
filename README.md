# Networking Brain

A knowledge base that teaches any AI agent to write short-form scripts for our networking and social skills account (young guys starting a business), the way the best videos in the niche are written, and to direct a creative storyboard for our 3D video engine.

Give it a topic and it pins the situation, checks it against what performs, researches any study it uses, writes the script with the ending first, then directs the visuals: one visual metaphor per video, a locked look and 3D cast, and a prop library that grows (and gets reused) with every video. The narration is recorded first, and the storyboard is timed to it word by word. It's adapted from the script brain built for Elliott ([zlliott-brain](https://github.com/camclarke11/zlliott-brain)).

## How to use it

**Claude Code** (best): open this folder and type a topic, or use a command.
```
/script the follow-up text after an event
/script T12                 # a row from topics/topic-bank.md
/batch 5                    # five scripts from the topic bank
/ideas 10 outreach          # new topic ideas, added to the bank
/align scripts/<file>.md <timestamps.json>   # time the visuals to the recorded voice
/refresh ~/Downloads/Media\ Tools/Account\ Exports/<export>
```
Claude reads `CLAUDE.md`, which loads `AGENTS.md`.

**Other coding agents** (Codex, Cursor): most read `AGENTS.md` automatically. If not: *"Read AGENTS.md and follow it."*

**Claude.ai Projects**: upload `AGENTS.md`, everything in `knowledge/`, `templates/`, `topics/topic-bank.md`, `content-log.md` and the two breakout transcripts (`examples/theoryofbehaviour/13-…` and `14-…`). Paste `PROJECT-INSTRUCTIONS.md` into the project instructions and turn on web search. (The checker only runs where code can run.)

## What's inside

| Path | What it does |
|---|---|
| `AGENTS.md` | **The operating manual.** Rules, the 12-step workflow, output format. |
| `knowledge/00-what-performs.md` | Real view data and topic tiers. Overrides everything else. Bottom half is generated. |
| `knowledge/01-audience-and-account.md` | Who we're talking to, the promise, how we beat @theoryofbehaviour |
| `knowledge/02-voice-and-style.md` | The older-brother voice, rhythm, banned words, spelling |
| `knowledge/03-hooks.md` | Hook archetypes N1–N8 with their record, the loop line, the 4 hook failures |
| `knowledge/04-lesson-engine.md` | The eight beats, but/so, re-hooks, one move per video |
| `knowledge/05-endings-and-ctas.md` | Ending types E1–E5, the share prompt, the saveable caption |
| `knowledge/06-formats.md` | Formats F1–F6 with skeletons, and how to name a tool |
| `knowledge/07-research-playbook.md` | How to verify and describe studies, plus a 27-study bank |
| `knowledge/08-phrase-bank.md` | Re-hooks, objections, payoffs and share prompts, in our own words |
| `knowledge/09-annotated-breakdowns.md` | Line-by-line teardowns of the two breakouts, and why the flops flopped |
| `knowledge/10-quality-checklist.md` | The gate every script passes |
| `knowledge/11-storytelling-principles.md` | The Callaway and South Park theory underneath |
| `knowledge/12-visual-storyboard.md` | The locked look and cast, the creative rules, on-screen components, must-haves, and the audio-first timing pass |
| `visuals/library.json` | Every set, prop, effect, costume and metaphor used so far, with its build status. Reuse before inventing. |
| `templates/script-output.md` | The exact output format |
| `templates/storyboard.schema.json` | Storyboard format, version 2 (the video engine reads this) |
| `topics/topic-bank.md` | 30 starter ideas with situations, A vs B and study leads |
| `content-log.md` | Every script and post, plus tool names in use and names already taken |
| `scripts/` | Finished scripts. `2026-10-20-the-second-question.md` is the worked example. |
| `examples/theoryofbehaviour/` | The competitor's 14 transcripts (structure only, never copy) |
| `data/theoryofbehaviour/` | Their Media Tools export, our labels for every post, and per-post breakdowns |
| `tools/performance.py` | Imports Media Tools exports per account, rebuilds the live tables, breaks down any post |
| `tools/check_script.py` | Mechanical checks on a finished script and its storyboard must-haves |
| `tools/library.py` | Lists the prop library, registers a script's new assets, tracks what's built |
| `tools/align.py` | Times every shot, cue and on-screen component to the recorded narration's word timestamps |
| `config.json` | Our handle (once chosen), default account, spelling, narration pace |

## Tools

Python 3 only, nothing to install.
```bash
python3 tools/check_script.py scripts/<file>.md          # check a script and its storyboard
python3 tools/library.py list --status requested         # the 3D build queue
python3 tools/library.py add scripts/<file>.md            # register a finished script's new props
python3 tools/align.py scripts/<file>.md <stamps.json>    # time it to the recording
python3 tools/performance.py import "<export folder>"    # handle is read from the export
python3 tools/performance.py tag                         # posts needing labels
python3 tools/performance.py report                      # rebuild the live tables
python3 tools/performance.py --account theoryofbehaviour post <link>
python3 -m unittest discover -s tests                    # 20 tests
```

## Before the first real batch
- **Account:** @f___a___c___t___s (set as `our_account` in `config.json`). After its first Media Tools export is imported, set `default_account` to it too.
- **Confirm spelling** (US English by default) and **narration pace** once the voice is chosen.
- **Pick the voice:** text to speech or recording it yourself. Either works with `tools/align.py`; ElevenLabs text to speech gives word timestamps directly, a real voice needs a speech-to-text pass.
- **Lock the look:** replace the provisional style brief in `knowledge/12-visual-storyboard.md` §1 with exact colours and materials after the design pass, and build the `core` items in the library.
- **Retention data** from our own Instagram insights is the biggest missing piece, as it was for Elliott's brain.
