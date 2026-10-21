# 14 — Voice Tags (the ELEVENLABS block)

Every script ships with an `## ELEVENLABS` section: the SCRIPT's exact words as **one paragraph**, with audio tags in square brackets, ready to paste into ElevenLabs (Eleven v4) or send through `tools/voice.py --engine elevenlabs`.

The SCRIPT section stays clean (spoken words only, one sentence per line), because the storyboard, the checker and `tools/align.py` work from its lines. The ELEVENLABS block is a performance layer on top of it. **The words must match the SCRIPT exactly**; `tools/check_script.py` fails the file if they drift. Change a word in one place, change it in both.

---

## 1. How tags work

- A tag steers how the words **after it** are delivered, until the next tag or the mood naturally resets. It is never spoken.
- Tags are suggestions, not switches. The voice matters more than the tag: a calm narrator won't suddenly sound excited. Regenerate two or three takes and pick the best one.
- SSML `<break>` doesn't work on v4. Use `[short pause]`, `[pause]` or `[long pause]`.
- Allowed tags live in `config.json` → `elevenlabs.tags`. Anything else gets a checker warning. Add a tag there once you've heard it work on our voice.

## 2. Where tags go (map them to the beats)

About **7 to 11 tags** in a 150-word script: roughly one per sentence or two, placed at the **turns**, never on every line.

| Beat | Typical tag | Why |
|---|---|---|
| Hook (always open with a tag) | `[thoughtful]`, `[curious]`, `[serious]` | Sets the older-brother tone from the first word |
| The pain (fake scrolling, awkward silence) | `[sighs]` | Lands the relatable bit |
| The BUT / turn | `[short pause]` *before* the "But" | Pauses before the twist so it lands |
| The move (the exact words) | `[encouraging]`, `[confident]` | Says it like you believe it works |
| The objection ("You're thinking…") | `[chuckles]` *after* the objection, before the answer | Shows we get it, then answer warmly |
| The wrong guess / the reveal | `[matter-of-fact]` or `[thoughtful]` | Calm, so the turn after it lands |
| The re-hook / escalation | `[thoughtful]`, `[excited]` | Lifts the energy for the second half |
| The payoff | `[happy]`, `[warm]` | The loop closes on a high |
| The share prompt | `[playful]` | Light, like you're nudging a friend |

## 3. Rules

1. **Open with a tag.** The hook's delivery is the most important one.
2. **One tag per spot.** No `[happy] [excited]` stacks. They fight each other.
3. **Reactions go between sentences.** `[sighs]`, `[chuckles]` and `[laughs]` sit at a full stop, not mid-sentence.
4. **Pauses before the twist.** `[short pause]` goes before "But" or the payoff, not after.
5. **No more than one `[laughs]`.** We're kind, never smug, and laughing at the viewer's fear is smug.
6. **Never change punctuation for rhythm here.** If a line needs a different beat, fix it in the SCRIPT and copy it across.
7. **One paragraph.** No line breaks, so the paste goes in clean.

## 4. Example (The person standing alone)

```text
[thoughtful] Ten minutes into an event and everyone's already in a group? [sighs] Go find the one person who isn't. You're by the drinks, fake scrolling your phone. Every circle's closed. [short pause] But look again. Someone else is doing exactly what you're doing. Say his name's Sam. Lanyard on, full drink, eyes on the door. He just got here before his friends. [encouraging] So walk over and say, I don't know a single person here. You? You're thinking, he'll think I'm a loser. [chuckles] He's praying someone like you saves him. In 2014, researchers had Chicago commuters talk to strangers on the train. Most people predicted silence would be nicer. The ones who talked had the better ride. [thoughtful] But don't stop at two. Next person standing alone, you both wave him over. Now you're the group. You walked in waiting to be saved. [happy] You walked out with your own group. [playful] Send this to the friend who hides in the bathroom at events.
```

## 5. Timing

`tools/align.py` skips anything in square brackets in ElevenLabs' character timestamps, so tags never throw the cues off. A `[pause]` just makes a longer gap between two words, which the video holds on.

## 6. Pronunciation (say it as)

Brand names the voice gets wrong go in `config.json` → `elevenlabs.say`, as written → spoken, e.g. `"Häagen-Dazs": "Hah-gen Dahz"`. `tools/voice.py` sends the spoken form to ElevenLabs, then puts the written spelling back into the word timestamps, so the SCRIPT, ELEVENLABS block, captions and timing all keep the real spelling. After any take, check what was actually said: transcribe the mp3 without hints (faster-whisper in `.venv`) and read it against the script. Names the speech model doesn't know will come back odd even when they're said right, so judge the brand names by ear or by a second take.

