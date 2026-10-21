# [Working title]

**Format:** [F1 Tool / F2 Person / F3 Exact Words / F4 Read / F5 Mistake / F6 Inside the Experiment / F7 Brand X-ray]
**Tier:** [1 / 2 / 3, with a one-line reason. If Tier 3, give a Tier 1 alternative here]
**Situation:** [the one moment this is set in, e.g. "the client's gone quiet a week after the proposal", or for F7 the odd thing the brand does]
**A vs B:** [what they do now] → [what works]
**Length:** [N] words ≈ [N]s (at the pace in config.json)
**Hook code:** [N1–N12] · **Ending code:** [E1–E6] · **Named tool:** [name, or none]
**Pillar:** [Brand X-ray / The Move] · **Playbook chapter:** [Get clients / Sell / Price and package / Stand out / Keep clients / Get seen]

---

## TITLE / COVER OPTIONS
1. [4–9 words, sentence case. This one becomes the cover title]
2. [different angle]
3. [different angle]

---

## HOOK OPTIONS
**A (used):** [hook]
**B:** [different archetype]
**C:** [different archetype]

---

## LOOP MAP

```text
L1  line 1   [the hook's question, in the viewer's words]   → closed line [N, in the last 20%]
L2  line [N] [the next question]                            → closed line [N]
L3  line [N] […]                                            → closed line [N]
```
[Every closing line opens the next loop. No more than about 4 lines outside an open loop. knowledge/04-lesson-engine.md §4]

---

## SCRIPT

[One sentence per line.]
[Only words the narrator says out loud.]
[No headings, brackets, emojis or stage directions.]
[No citations: no "researchers", "a study", "studies show". Facts told as what happened.]

---

## ELEVENLABS

```text
[thoughtful] [The SCRIPT's exact words as one paragraph, with audio tags at the turns (knowledge/14-voice-tags.md).] [playful] Send this to…
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "[the one visual idea that runs through the video]",
    "why": "[how the picture makes the lesson clearer]",
    "library_metaphor": "[library id if reusing or creating a recurring metaphor, else leave out]"
  },
  "names": {"stranger_a": "[name, if the script gives one]"},
  "shots": [
    {
      "id": 1,
      "lines": [1, 1],
      "title": "[short name]",
      "what_we_see": "[plain words, detailed enough to build]",
      "camera": "[framing and movement]",
      "transition_in": "[cut, whip pan, match cut…]",
      "cast": ["you", "crowd"],
      "uses": ["event_hall"],
      "new": [],
      "cues": [{"word": "[a word spoken in these lines]", "what": "[what happens on that word]"}],
      "on_screen": [{"type": "big_text", "text": "[short hook, 4–9 words]"}],
      "screenshot": false
    }
  ],
  "new_assets": [
    {"id": "[snake_case]", "kind": "prop", "name": "[name]", "description": "[shape, material, size next to a character, how it moves]", "reuse": "[what else it could show]"}
  ]
}
```

---

## CAPTION

[A teaser caption (knowledge/05-endings-and-ctas.md): one line under 125 characters, usually a question about the viewer's business, naming nothing from the video. Then the Playbook line for the current phase (config.json playbook) and #smallbusiness #entrepreneur + 1–3 topical tags.]

---

## FACT SHEET & SOURCES

| Claim, as the script tells it | What it rests on (year, who, what they did, what happened) | Source (link) | Status |
|---|---|---|---|
| [e.g. "Ask one more question about his answer. Watch him lean in."] | [e.g. Huang et al. 2017: people who asked more follow-up questions were liked more] | [journal or university page] | Confirmed |

### ⚠️ Check before posting
- [anything uncertain, a line that might sound off, any new asset that might be hard to build]

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=… tier=… format=… hook=… named_tool=… proof=… objection=… character=… ending=… cta=… -->
