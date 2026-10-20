# Wait for the laugh

**Format:** F3 Exact Words
**Tier:** 1 (joining a group at an event, with the timing and the exact line)
**Situation:** a circle of three already talking at an event, and you want in
**A vs B:** drift closer and hover until someone notices you → wait for the laugh, step in with one line, then hand the story back
**Length:** 169 words ≈ 58s (at 175 wpm)
**Hook code:** N4 · **Ending code:** E1 · **Named tool:** none (the "gap" is a light frame, not a coined name)

---

## TITLE / COVER OPTIONS
1. How to join a group without hovering
2. Wait for the laugh
3. The line that gets you into any circle

---

## HOOK OPTIONS
**A (used, N4):** Here's how to join a group that's already talking, without hovering.
**B (N1):** When a group at an event looks closed, wait for this one moment.
**C (N3):** Stop waiting for a group to invite you in. Wait for the laugh.

---

## SCRIPT


Here's how to join a group that's already talking, without hovering.

You spot three people mid-conversation.
You drift closer.
And closer.
Nobody looks up.
Now you're the guy standing half a step behind a circle.

So stop waiting for an invite.
Wait for the laugh.
Right after a laugh, the circle loosens for a second.
That's your gap.

Step in and say, okay, that laugh sounded like the best story here. What did I miss?

You're thinking, isn't that interrupting?
Not in the gap.
You just told them they're the fun group.

But the next ten seconds decide if you stay.
You get in and want to talk about yourself.
Don't.
Turn to whoever was telling the story and say, go on, finish it.

Now the storyteller's on your side.
And the circle opens a little wider.

Hovering makes you the guy at the edge.
One line makes you the guy who asked for the story.

Send this to the friend who orbits groups like a lost satellite.

---

## ELEVENLABS

```text
[curious] Here's how to join a group that's already talking, without hovering. You spot three people mid-conversation. You drift closer. And closer. [sighs] Nobody looks up. Now you're the guy standing half a step behind a circle. [confident] So stop waiting for an invite. Wait for the laugh. [thoughtful] Right after a laugh, the circle loosens for a second. That's your gap. [encouraging] Step in and say, okay, that laugh sounded like the best story here. What did I miss? You're thinking, isn't that interrupting? [chuckles] Not in the gap. You just told them they're the fun group. [short pause] But the next ten seconds decide if you stay. You get in and want to talk about yourself. Don't. [warm] Turn to whoever was telling the story and say, go on, finish it. Now the storyteller's on your side. And the circle opens a little wider. Hovering makes you the guy at the edge. [happy] One line makes you the guy who asked for the story. [playful] Send this to the friend who orbits groups like a lost satellite.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Joining a group is jumping into a double-dutch skipping rope. The conversation is two ropes turning around the circle. Hover at the edge and you're just watching the ropes spin. Wait for the beat, the laugh, and you hop in clean.",
    "why": "The lesson is about timing, not courage. Everyone knows you can't walk into a turning rope, you jump on the beat. Seeing the laugh as the moment the ropes open makes 'wait for the gap' instantly clear.",
    "library_metaphor": "jump_rope_metaphor"
  },
  "names": {"stranger_a": "the storyteller", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 1], "title": "The ropes",
      "what_we_see": "At the event, three people talk in a tight circle. Two glowing skipping ropes turn around them, double-dutch style, sweeping the floor in a steady rhythm. You stand at the edge, rocking on your heels and timing the ropes.",
      "camera": "Low, wide angle with the ropes sweeping through frame",
      "transition_in": "cold open",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c", "crowd"],
      "uses": ["event_hall"],
      "new": ["jump_ropes"],
      "cues": [
        {"word": "group", "what": "the ropes start turning around the circle"},
        {"word": "hovering", "what": "you rock on your heels at the edge"}
      ],
      "on_screen": [{"type": "big_text", "text": "Join a group without hovering"}]
    },
    {
      "id": 2, "lines": [2, 6], "title": "The hover",
      "what_we_see": "You shuffle closer, then closer, nearly getting clipped by the ropes. Nobody looks up. A wide shot shows you standing half a step outside the circle, drink in hand, the ropes whipping past your nose, the colour draining out of you.",
      "camera": "Medium on you, then a wide that shows how outside you are",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c"],
      "uses": ["jump_ropes", "drink_glass", "colour_drain"],
      "new": [],
      "cues": [
        {"word": "drift", "what": "you shuffle closer"},
        {"word": "closer", "what": "a rope whips past your nose"},
        {"word": "Nobody", "what": "nobody turns"},
        {"word": "behind", "what": "wide shot, you drain grey at the edge"}
      ],
      "on_screen": []
    },
    {
      "id": 3, "lines": [7, 10], "title": "The beat",
      "what_we_see": "The circle bursts out laughing. On the laugh, the ropes slow and swing wide open for a moment, leaving a clear gold gap right in front of you, and the three of them glance around.",
      "camera": "Slow motion on the ropes opening, push in on the gap",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c"],
      "uses": ["jump_ropes", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "invite", "what": "you stop shuffling"},
        {"word": "laugh", "what": "the circle bursts out laughing"},
        {"word": "loosens", "what": "the ropes swing wide open"},
        {"word": "gap", "what": "the gold gap glows in front of you"}
      ],
      "on_screen": [{"type": "stamp", "text": "NOW", "at": "gap"}]
    },
    {
      "id": 4, "lines": [11, 11], "title": "Jump in",
      "what_we_see": "You hop into the gap, landing clean inside the circle as the ropes close back around all four of you. The three of them turn to you, grinning.",
      "camera": "Side-on tracking your jump, then a medium four-shot",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c"],
      "uses": ["jump_ropes", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "Step", "what": "you hop into the gap"},
        {"word": "miss", "what": "the ropes close around all four of you"}
      ],
      "on_screen": [{"type": "quote_bubble", "speaker": "you", "text": "Okay, that laugh sounded like the best story here. What did I miss?", "at": "say"}]
    },
    {
      "id": 5, "lines": [12, 14], "title": "Interrupting?",
      "what_we_see": "The fear: you crash into the circle like a wrecking ball, ropes tangling and everyone flying. Snap back: the clean jump again, and the three of them point at each other, proud to be the fun group.",
      "camera": "Wide on the crash, then a snap back to the medium four-shot",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c"],
      "uses": ["jump_ropes", "vhs_rewind"],
      "new": [],
      "cues": [
        {"word": "interrupting", "what": "the wrecking-ball crash"},
        {"word": "gap", "what": "rewind to the clean jump"},
        {"word": "fun", "what": "they point at each other, proud"}
      ],
      "on_screen": []
    },
    {
      "id": 6, "lines": [15, 18], "title": "Hand it back",
      "what_we_see": "You open your mouth to talk about yourself and the ropes start to wobble and slow. You stop, turn to the storyteller and hand her a glowing baton. She grabs it and carries on, and the ropes find their rhythm again.",
      "camera": "Medium, push in on the baton handover",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c"],
      "uses": ["jump_ropes", "colour_drain", "gold_glow"],
      "new": ["story_baton"],
      "cues": [
        {"word": "yourself", "what": "the ropes wobble and slow"},
        {"word": "Don't", "what": "you stop yourself"},
        {"word": "finish", "what": "you hand her the glowing baton"}
      ],
      "on_screen": [{"type": "x_check", "wrong": "So anyway, I run an agency…", "right": "Go on, finish it.", "at": "Turn"}]
    },
    {
      "id": 7, "lines": [19, 20], "title": "Wider",
      "screenshot": true,
      "what_we_see": "The storyteller finishes, pointing at you as she hits the punchline. The circle widens and the ropes swing bigger, fast and gold, with you right in the middle.",
      "camera": "Top-down as the circle widens",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c"],
      "uses": ["jump_ropes", "story_baton", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "side", "what": "she points at you on the punchline"},
        {"word": "wider", "what": "the circle widens and the ropes go gold"}
      ],
      "on_screen": []
    },
    {
      "id": 8, "lines": [21, 22], "title": "Edge or middle",
      "what_we_see": "Split. Left: a grey you at the edge, ropes whipping past. Right: a gold you in the middle of the circle, mid-laugh.",
      "camera": "Locked-off split screen",
      "transition_in": "wipe",
      "cast": ["you", "stranger_a", "stranger_b", "stranger_c"],
      "uses": ["jump_ropes", "colour_drain", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "edge", "what": "the grey left side"},
        {"word": "story", "what": "the gold right side"}
      ],
      "on_screen": [{"type": "big_text", "text": "Ask for the story", "at": "asked"}]
    },
    {
      "id": 9, "lines": [23, 23], "title": "Jay in orbit",
      "what_we_see": "Top-down on the event: Jay circles slowly around a group like a little satellite, a tiny antenna on his head blinking, never getting closer.",
      "camera": "Top-down, slow rotation",
      "transition_in": "cut",
      "cast": ["friend", "crowd"],
      "uses": ["event_hall", "jump_ropes"],
      "new": [],
      "cues": [{"word": "orbits", "what": "Jay circles the group"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "jump_rope_metaphor", "kind": "metaphor", "name": "Double-dutch", "description": "Joining a conversation is jumping into two turning skipping ropes. The ropes open on the beat, the laugh, and you hop in clean.", "reuse": "Timing, joining groups, interrupting well, knowing when to speak"},
    {"id": "jump_ropes", "kind": "prop", "name": "Double-dutch ropes", "description": "Two long glowing skipping ropes turning around a group of characters with no one holding them. They sweep the floor in a steady beat, swing wide open in slow motion on a cue, wobble and slow when the energy drops, and glow gold when it's good.", "reuse": "Group rhythm, timing, momentum, joining in"},
    {"id": "story_baton", "kind": "prop", "name": "Story baton", "description": "A short relay baton, hand-sized, that glows gold. Passing it hands over the turn to speak, and it glows brighter when someone's on a roll.", "reuse": "Turn-taking, handing the floor to someone, letting others shine"}
  ]
}
```

---

## CAPTION

How to join a group without hovering.

You can't walk into a turning skipping rope. You wait for the beat. In a group, the beat is the laugh.

How to do it:
📍 Stand close enough to hear, but don't hover.
📍 Wait for the laugh. Right after it, the circle loosens.
📍 Step in: "Okay, that laugh sounded like the best story here. What did I miss?"
📍 Then hand it back: "Go on, finish it." Don't start talking about yourself.

Try it at your next event and tell me what story you walked into 👇

Follow, the networking playbook drops soon.

#networking #socialskills #entrepreneur #networkingevent

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| No study cited. "Right after a laugh, the circle loosens" is an observation, framed as advice, not a finding. | n/a | n/a |

### ⚠️ Check before posting
- The line is cheeky. If it sounds wrong in your voice, a softer version for the caption: "Sorry to jump in, you all look like you're having the most fun here."
- If the group is clearly in a private or serious chat (no laughing), this isn't the group to join. Worth a reply in the comments if someone asks.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=event_conversation tier=1 format=F3 hook=N4 named_tool=no proof=none objection=yes character=generic ending=E1 cta=share -->
