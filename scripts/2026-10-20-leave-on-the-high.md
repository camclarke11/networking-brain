# Leave on the high

**Format:** F3 Exact Words
**Tier:** 1 (a live event conversation, with the exact exit line)
**Situation:** twenty minutes into the best conversation of the night, at the event
**A vs B:** stay until it fizzles into small talk → leave right after a laugh, with one line
**Length:** 167 words ≈ 57s (at 175 wpm)
**Hook code:** N3 · **Ending code:** E1 · **Named tool:** none
**Pillar:** The Move · **Playbook chapter:** Get clients

---

## TITLE / COVER OPTIONS
1. Leave the best conversation of the night early
2. How to end a conversation so they come find you later
3. The exit line that makes them want round two

---

## HOOK OPTIONS
**A (used, N3):** Leave the best conversation of the night early.
**B (N5):** The last two minutes of a conversation are all they'll remember about you.
**C (N4):** How to leave a great conversation so they come and find you later.

---

## SCRIPT


Leave the best conversation of the night early.

You're twenty minutes in with Marco.
It's going great.
So you stay.
And stay.
Till you're both talking about the weather.
That's the bit he'll remember.

In 1993, psychologists had people hold a hand in painfully cold water.
One round lasted 60 seconds.
Another lasted 90, but the last 30 got slightly less cold.
Most chose to repeat the longer one.
The ending mattered more than the length.

So end on the high.
Next time you both crack up, use this line.
Let me grab you again later, I promised myself three new people tonight.

You're thinking, won't leaving a good chat feel rude?
Not if you say what you loved first.
That bit about firing your first client is staying with me.

Now he watches you go, still smiling.
Fizzling out makes you forgettable.
Leaving on a laugh makes him come find you later.

Send this to the friend who's always the last one talking at the bar.

---

## ELEVENLABS

```text
[thoughtful] Leave the best conversation of the night early. You're twenty minutes in with Marco. It's going great. So you stay. And stay. [sighs] Till you're both talking about the weather. [short pause] That's the bit he'll remember. [matter-of-fact] In 1993, psychologists had people hold a hand in painfully cold water. One round lasted 60 seconds. Another lasted 90, but the last 30 got slightly less cold. Most chose to repeat the longer one. The ending mattered more than the length. [confident] So end on the high. Next time you both crack up, use this line. [encouraging] Let me grab you again later, I promised myself three new people tonight. You're thinking, won't leaving a good chat feel rude? [chuckles] Not if you say what you loved first. That bit about firing your first client is staying with me. [warm] Now he watches you go, still smiling. Fizzling out makes you forgettable. [happy] Leaving on a laugh makes him come find you later. [playful] Send this to the friend who's always the last one talking at the bar.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "A glowing line floats above every conversation like a heart monitor, rising with every laugh and sagging when it goes flat. When the conversation ends, a polaroid snaps whatever the line is doing at that moment, and that photo is what the other person keeps.",
    "why": "The lesson is that people remember a conversation by how it ended. The line makes the energy visible and the polaroid shows that the last moment is the one that's kept, so leaving at the peak is obviously the move.",
    "library_metaphor": "energy_line_metaphor"
  },
  "names": {"connector": "Marco", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 1], "title": "The peak",
      "what_we_see": "At the event, you and Marco are mid-laugh. A gold line floats above you both like a heart monitor, right at its highest point. You raise your glass, step back and walk away while it's still up there.",
      "camera": "Medium two-shot, the line arcing across the top of frame",
      "transition_in": "cold open",
      "cast": ["you", "connector", "crowd"],
      "uses": ["event_hall", "drink_glass"],
      "new": ["energy_line"],
      "cues": [
        {"word": "best", "what": "the line spikes to its peak"},
        {"word": "early", "what": "you step back and walk away"}
      ],
      "on_screen": [{"type": "big_text", "text": "Leave the best chat early"}]
    },
    {
      "id": 2, "lines": [2, 7], "title": "The fizzle",
      "what_we_see": "Rewind to the start. Twenty minutes of great chat: the line climbs. Then you stay, and stay. The line sags, flattens, and beeps flat as you both stare at the ceiling and glance at the exit. A polaroid snaps the flatline and slides into Marco's pocket.",
      "camera": "Medium two-shot, slow pull out as the energy dies",
      "transition_in": "vhs rewind",
      "cast": ["you", "connector"],
      "uses": ["drinks_table", "energy_line", "vhs_rewind", "colour_drain", "loading_spinner"],
      "new": ["memory_polaroid"],
      "cues": [
        {"word": "great", "what": "the line climbs high"},
        {"word": "stay", "what": "the line starts to sag"},
        {"word": "weather", "what": "the line goes flat, a loading spinner appears"},
        {"word": "remember", "what": "a polaroid snaps the flatline and goes in his pocket"}
      ],
      "on_screen": [{"type": "label", "text": "Marco", "target": "connector", "at": "Marco"}]
    },
    {
      "id": 3, "lines": [8, 12], "title": "Cold water",
      "what_we_see": "The Professor beside two ice buckets. Two small energy lines float over them: one short, one longer that ends slightly higher. A hand points at the longer one, and a polaroid of its gentler ending glows.",
      "camera": "Close on the Professor, then a push in on the two lines",
      "transition_in": "the polaroid flips into the study",
      "cast": ["professor"],
      "uses": ["void", "energy_line", "memory_polaroid", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "cold", "what": "ice clinks in the buckets"},
        {"word": "60", "what": "the short line draws"},
        {"word": "90", "what": "the longer line draws, rising at the end"},
        {"word": "longer", "what": "a hand points at the longer one"},
        {"word": "ending", "what": "its polaroid glows"}
      ],
      "on_screen": [{"type": "study_card", "year": 1993, "who": "Kahneman, Fredrickson, Schreiber and Redelmeier", "finding": "Most people chose to repeat the longer cold-water trial because it ended slightly better", "at": "1993"}]
    },
    {
      "id": 4, "lines": [13, 15], "title": "The exit line",
      "what_we_see": "Back with Marco. He cracks you up, the line spikes, and you deliver the line right at the top, raising your glass as you step away.",
      "camera": "Medium two-shot, holding on the spike",
      "transition_in": "cut",
      "cast": ["you", "connector"],
      "uses": ["drinks_table", "energy_line", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "high", "what": "the line rises"},
        {"word": "crack", "what": "you both crack up, the line spikes"},
        {"word": "tonight", "what": "you raise your glass and step away"}
      ],
      "on_screen": [{"type": "quote_bubble", "speaker": "you", "text": "Let me grab you again later, I promised myself three new people tonight.", "at": "Let"}]
    },
    {
      "id": 5, "lines": [16, 18], "title": "Rude?",
      "what_we_see": "The fear: you walk off and Marco shatters like glass, a single tear rolling. Snap back: you stop, turn and say what you loved first, and he grins and points at you.",
      "camera": "Wide on the absurd shatter, then a snap to medium",
      "transition_in": "cut",
      "cast": ["you", "connector"],
      "uses": ["colour_drain", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "rude", "what": "Marco shatters like glass"},
        {"word": "loved", "what": "snap back as you turn round"},
        {"word": "staying", "what": "Marco grins and points at you"}
      ],
      "on_screen": [{"type": "quote_bubble", "speaker": "you", "text": "That bit about firing your first client is staying with me.", "at": "firing"}]
    },
    {
      "id": 6, "lines": [19, 21], "title": "The polaroid he keeps",
      "screenshot": true,
      "what_we_see": "As you walk away, a polaroid snaps the line at its peak and slides into Marco's pocket, glowing. Split: the flatline polaroid in grey against the peak polaroid in gold. Later, Marco crosses the room towards you.",
      "camera": "Close on the polaroid, then a split, then wide on Marco crossing the room",
      "transition_in": "cut",
      "cast": ["you", "connector", "crowd"],
      "uses": ["memory_polaroid", "energy_line", "colour_drain", "gold_glow", "event_hall"],
      "new": [],
      "cues": [
        {"word": "smiling", "what": "the peak polaroid slides into his pocket"},
        {"word": "Fizzling", "what": "the grey flatline polaroid"},
        {"word": "laugh", "what": "the gold peak polaroid"},
        {"word": "find", "what": "Marco crosses the room towards you"}
      ],
      "on_screen": [{"type": "x_check", "wrong": "Stay till it fizzles", "right": "Leave on the laugh", "at": "Fizzling"}]
    },
    {
      "id": 7, "lines": [22, 22], "title": "Jay at the bar",
      "what_we_see": "Jay at the bar at closing time, still talking at one exhausted person, a flatline beeping above them as the staff stack chairs.",
      "camera": "Wide, slow push in on Jay",
      "transition_in": "cut",
      "cast": ["friend", "stranger_b"],
      "uses": ["drinks_table", "energy_line"],
      "new": [],
      "cues": [{"word": "last", "what": "the flatline beeps over them"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "energy_line_metaphor", "kind": "metaphor", "name": "The energy line", "description": "A glowing heart-monitor line floats over a conversation, rising with laughs and sagging when it goes flat. A polaroid snaps whatever it's doing at the end, and that's the memory kept.", "reuse": "Endings, first and last impressions, timing, reading energy"},
    {"id": "energy_line", "kind": "effect", "name": "Energy line", "description": "A thick glowing line floating above two characters like a heart-monitor trace. It glows gold and climbs on laughs, sags and turns grey when the talk goes flat, and can beep flat. Can also be drawn small over any object.", "reuse": "Conversation energy, mood, momentum, before and after"},
    {"id": "memory_polaroid", "kind": "prop", "name": "Memory polaroid", "description": "A hand-sized instant photo that snaps out of the air with a flash and shows the last moment of something. It can slide into a pocket, glow gold or drain grey.", "reuse": "What people remember, first impressions, last impressions, highlights"}
  ]
}
```

---

## CAPTION


When's the right moment to walk away from a great conversation?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #networking

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| In 1993, psychologists had people hold a hand in painfully cold water | Kahneman, Fredrickson, Schreiber and Redelmeier (1993), "When More Pain Is Preferred to Less: Adding a Better End", *Psychological Science* 4(6); [paper PDF](https://ius.uzh.ch/dam/jcr:5ae9adc9-61ec-4174-b37c-4b752f36c23b/Kahnemann%20et%20al.%20-%20When%20More%20Pain%20is%20Preferred%20to%20Less%20(1993).pdf) | Confirmed (14°C water) |
| One round lasted 60 seconds; another lasted 90, with the last 30 slightly less cold | Same paper: short trial 60s at 14°C; long trial the same 60s plus 30s while the water warmed to 15°C | Confirmed |
| Most chose to repeat the longer one | Same paper: a significant majority chose to repeat the long trial | Confirmed |
| The ending mattered more than the length | Same paper: duration played a small role; evaluations were dominated by the peak and the end | Confirmed (paraphrase) |

### ⚠️ Check before posting
- The study is about physical discomfort, not conversations. The script uses it to show that endings drive memory, which is the authors' own conclusion, but don't claim it was tested on conversations.
- The exit line includes "three new people tonight". Only say it if it's true. The caption says to actually go back later.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=event_conversation tier=1 format=F3 hook=N3 named_tool=no proof=study objection=yes character=named ending=E1 cta=share -->
