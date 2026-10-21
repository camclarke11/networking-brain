# The seat next to you

**Format:** F2 Person
**Tier:** 1 (the moment a talk ends, with one person to turn to and the exact words)
**Situation:** the speaker just finished and everyone's rushing the stage
**A vs B:** join the queue for the speaker → turn to the person next to you, then go up together
**Length:** 167 words ≈ 57s (at 175 wpm)
**Hook code:** N1 · **Ending code:** E4 · **Named tool:** none
**Pillar:** The Move · **Playbook chapter:** Get clients

---

## TITLE / COVER OPTIONS
1. When the talk ends, don't queue for the speaker
2. The best person at a talk isn't on stage
3. Turn to your left

---

## HOOK OPTIONS
**A (used, N1):** When the talk ends, don't join the queue for the speaker. Turn to the person sitting next to you.
**B (N3):** Stop rushing the stage after a talk. The best contact is in the next seat.
**C (N5):** The 40 seconds you get with the speaker is why nobody from that event remembers you.

---

## SCRIPT


When the talk ends, don't join the queue for the speaker.
Turn to the person sitting next to you.

Thirty people rush the stage.
You get forty seconds and a handshake.
By the parking lot, he's forgotten your face.

But look who's still in her seat.
Say her name's Nia.
Notebook open.
She heard everything you heard.

So you've already got something to talk about.
Ask, what's the one thing you're actually going to use?
Now you're comparing notes, not making small talk.

You're thinking, but I came here to meet the speaker.
You still can.
Just don't go alone.

Say, want to go ask him about that hiring bit together?
Two people with one sharp question get more than forty seconds.
He'll remember the pair who listened.

You walked in to meet the speaker.
You walked out with a speaker who knows you, and someone to go to the next one with.

Send this to the friend who sprints to the stage before the clapping stops.

---

## ELEVENLABS

```text
[confident] When the talk ends, don't join the queue for the speaker. Turn to the person sitting next to you. Thirty people rush the stage. You get forty seconds and a handshake. [sighs] By the parking lot, he's forgotten your face. [short pause] But look who's still in her seat. Say her name's Nia. Notebook open. She heard everything you heard. So you've already got something to talk about. [encouraging] Ask, what's the one thing you're actually going to use? Now you're comparing notes, not making small talk. You're thinking, but I came here to meet the speaker. [chuckles] You still can. Just don't go alone. [confident] Say, want to go ask him about that hiring bit together? Two people with one sharp question get more than forty seconds. [warm] He'll remember the pair who listened. You walked in to meet the speaker. [happy] You walked out with a speaker who knows you, and someone to go to the next one with. [playful] Send this to the friend who sprints to the stage before the clapping stops.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "The queue for the speaker is a factory conveyor belt. Each person rides up, gets a handshake stamped onto them, and drops off the end into a bin of identical faces. Turning to the person next to you steps you off the belt, and when you two walk up together the belt stops for you.",
    "why": "The lesson is that the speaker queue turns you into one of thirty forgettable handshakes. A conveyor belt shows the 'processed and forgotten' feeling at once, and stepping off it shows the alternative.",
    "library_metaphor": "conveyor_metaphor"
  },
  "names": {"stranger_a": "Nia", "stranger_c": "the speaker", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "Off the belt",
      "what_we_see": "A talk ends to applause. The aisle in front of the stage turns into a grey conveyor belt carrying a line of people up to the speaker. You're about to step on. Instead you turn to the seat beside you, where Nia is still writing.",
      "camera": "Wide from the back of the room, then a quick push to you and Nia",
      "transition_in": "cold open",
      "cast": ["you", "stranger_a", "stranger_c", "crowd"],
      "uses": ["stage_talk"],
      "new": ["queue_conveyor"],
      "cues": [
        {"word": "queue", "what": "the aisle becomes a conveyor belt"},
        {"word": "Turn", "what": "you turn to the seat beside you"}
      ],
      "on_screen": [{"type": "big_text", "text": "Don't queue for the speaker"}]
    },
    {
      "id": 2, "lines": [3, 5], "title": "Processed",
      "what_we_see": "On the belt: people ride up one by one, the speaker shakes each hand with a mechanical arm-pump and a 'HANDSHAKE' stamp lands on them, then they drop off the end into a bin of identical grey faces. A version of you gets stamped and dropped. Later the speaker walks across the parking lot and the faces in his head blur into fog.",
      "camera": "Side-on along the belt, then a cut to the speaker in the parking lot",
      "transition_in": "cut",
      "cast": ["you", "stranger_c", "crowd"],
      "uses": ["queue_conveyor", "colour_drain", "question_bubbles"],
      "new": [],
      "cues": [
        {"word": "rush", "what": "the belt fills up"},
        {"word": "handshake", "what": "the stamp lands on you"},
        {"word": "forgotten", "what": "the faces in his head blur into fog"}
      ],
      "on_screen": [{"type": "stamp", "text": "40 SECONDS", "at": "forty"}]
    },
    {
      "id": 3, "lines": [6, 9], "title": "Nia",
      "what_we_see": "Back in the room, half empty now. Nia's still in her seat with her notebook open, still writing, the pages glowing softly where she's underlined things.",
      "camera": "Slow dolly along the empty row to Nia",
      "transition_in": "vhs rewind",
      "cast": ["stranger_a", "crowd"],
      "uses": ["stage_talk", "vhs_rewind", "lanyard"],
      "new": ["notebook"],
      "cues": [
        {"word": "seat", "what": "the camera finds Nia"},
        {"word": "Notebook", "what": "close on her pages glowing"},
        {"word": "heard", "what": "her underlines light up gold"}
      ],
      "on_screen": [{"type": "label", "text": "Nia", "target": "stranger_a", "at": "Nia"}]
    },
    {
      "id": 4, "lines": [10, 12], "title": "Comparing notes",
      "what_we_see": "You lean over and ask. Nia turns her notebook round, you turn yours, and pages flutter between you, glowing gold where you both underlined the same thing.",
      "camera": "Medium two-shot, pushing in on the notebooks",
      "transition_in": "cut",
      "cast": ["you", "stranger_a"],
      "uses": ["notebook", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "use", "what": "Nia turns her notebook round"},
        {"word": "comparing", "what": "the matching pages glow gold"}
      ],
      "on_screen": [{"type": "quote_bubble", "speaker": "you", "text": "What's the one thing you're actually going to use?", "at": "Ask"}]
    },
    {
      "id": 5, "lines": [13, 15], "title": "But the speaker",
      "what_we_see": "You glance longingly at the belt. A cartoon tug-of-war: the belt pulls one arm, Nia's notebook pulls the other. Then you just grab Nia's sleeve.",
      "camera": "Wide on the tug-of-war, then a snap to medium",
      "transition_in": "cut",
      "cast": ["you", "stranger_a"],
      "uses": ["queue_conveyor", "notebook"],
      "new": [],
      "cues": [
        {"word": "speaker", "what": "the belt yanks your arm"},
        {"word": "can", "what": "you stop pulling"},
        {"word": "alone", "what": "you grab Nia's sleeve"}
      ],
      "on_screen": []
    },
    {
      "id": 6, "lines": [16, 18], "title": "The belt stops",
      "screenshot": true,
      "what_we_see": "You and Nia walk up together. The conveyor belt grinds to a halt for you, the speaker leans in, and the three of you laugh at the edge of the stage while the queue waits.",
      "camera": "Low angle as you approach, then a warm medium three-shot",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_c", "crowd"],
      "uses": ["stage_talk", "queue_conveyor", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "together", "what": "you walk up side by side"},
        {"word": "forty", "what": "the belt grinds to a halt"},
        {"word": "pair", "what": "the speaker leans in and laughs, the stage glows gold"}
      ],
      "on_screen": [{"type": "quote_bubble", "speaker": "you", "text": "Want to go ask him about that hiring bit together?", "at": "Say"}]
    },
    {
      "id": 7, "lines": [19, 20], "title": "Walking out",
      "what_we_see": "Split. Left: you arriving alone, staring at the stage. Right: you leaving with Nia, both waving back at the speaker, who waves back.",
      "camera": "Locked-off split screen",
      "transition_in": "wipe",
      "cast": ["you", "stranger_a", "stranger_c"],
      "uses": ["doorway", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "out", "what": "the right side lights up"},
        {"word": "knows", "what": "the speaker waves back"}
      ],
      "on_screen": []
    },
    {
      "id": 8, "lines": [21, 21], "title": "Jay sprints",
      "what_we_see": "Jay vaults over a row of seats mid-applause to be first on the conveyor belt, and gets stamped and dropped off the end.",
      "camera": "Wide, tracking Jay's sprint",
      "transition_in": "cut",
      "cast": ["friend", "crowd"],
      "uses": ["stage_talk", "queue_conveyor"],
      "new": [],
      "cues": [{"word": "sprints", "what": "Jay vaults the seats"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "conveyor_metaphor", "kind": "metaphor", "name": "The conveyor belt", "description": "Doing what everyone does puts you on a factory conveyor belt: you get processed the same way as everyone else and dropped off the end, forgotten. Stepping off it is the move.", "reuse": "Queues, mass outreach, generic DMs, anything where everyone does the same thing"},
    {"id": "queue_conveyor", "kind": "effect", "name": "Queue conveyor", "description": "A floor or aisle turns into a grey industrial conveyor belt carrying people in a line. At the end, a stamp marks each person and they drop into a bin of identical grey faces. The belt can grind to a halt with a clunk.", "reuse": "Queues, processes, being one of many, standing out from the line"},
    {"id": "notebook", "kind": "prop", "name": "Notebook", "description": "A hand-sized notebook with a pen clipped on, pages that flutter and turn, and underlined lines that can glow gold. Two notebooks can swap pages through the air.", "reuse": "Talks, learning, comparing notes, preparation"}
  ]
}
```

---

## CAPTION


Everyone in the room wants the same person's attention. Should you?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #networking #conference

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| No study cited. "Thirty people" and "forty seconds" are scene details, not statistics. | n/a | n/a |

### ⚠️ Check before posting
- "Two people with one sharp question get more than forty seconds" is a judgement call, not a finding. It's reasonable, but don't present it as data in the caption.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=event_conversation tier=1 format=F2 hook=N1 named_tool=no proof=none objection=yes character=named ending=E4 cta=share -->
