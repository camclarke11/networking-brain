# [Working title]

**Format:** [F1 Tool / F2 Person / F3 Exact Words / F4 Read / F5 Mistake / F6 Study]
**Tier:** [1 / 2 / 3, with a one-line reason. If Tier 3, give a Tier 1 alternative here]
**Situation:** [the one moment this is set in, e.g. "first five minutes at an industry mixer"]
**A vs B:** [what they do now] → [what works]
**Length:** [N] words ≈ [N]s (at the pace in config.json)
**Hook code:** [N1–N8] · **Ending code:** [E1–E5] · **Named tool:** [name, or none]

---

## TITLE / COVER OPTIONS
1. [4–9 words, sentence case]
2. [different angle]
3. [different angle]

---

## HOOK OPTIONS
**A (used):** [hook]
**B:** [different archetype]
**C:** [different archetype]

---

## SCRIPT

[One sentence per line.]
[Only words the narrator says out loud.]
[No headings, brackets, emojis or stage directions.]

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

[Caption in the format from knowledge/05-endings-and-ctas.md]

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| [e.g. 2017 study: follow-up questions increased liking] | [journal or university page] | Confirmed |

### ⚠️ Check before posting
- [anything uncertain, a line that might sound off, any new asset that might be hard to build]

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=… tier=… format=… hook=… named_tool=… proof=… objection=… character=… ending=… cta=… -->
