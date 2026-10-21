# The person standing alone

**Format:** F2 Person
**Tier:** 1 (the most dreaded event moment, with one person to find and the exact words to say)
**Situation:** ten minutes into an event, every group already closed, you by the drinks on your phone
**A vs B:** hover near a group hoping someone lets you in → walk to the one other person standing alone
**Length:** 157 words ≈ 54s (at 175 wpm)
**Hook code:** N1 · **Ending code:** E4 · **Named tool:** none
**Pillar:** The Move · **Playbook chapter:** Get clients

---

## TITLE / COVER OPTIONS
1. Everyone's in a group? Find this person
2. The easiest person to talk to at any event
3. Stop hovering. Go find Sam.

---

## HOOK OPTIONS
**A (used, N1):** Ten minutes into an event and everyone's already in a group? Go find the one person who isn't.
**B (N3):** Stop trying to break into groups at events. Start your own.
**C (N4):** How to stop standing alone at an event in under ten seconds, even if you're shy.

---

## SCRIPT


Ten minutes into an event and everyone's already in a group?
Go find the one person who isn't.

You're by the drinks, fake scrolling your phone.
Every circle's closed.

But look again.
Someone else is doing exactly what you're doing.
Say his name's Sam.
Lanyard on, full drink, eyes on the door.
He just got here before his friends.

So walk over and say, I don't know a single person here. You?

You're thinking, he'll think I'm a loser.
He's praying someone like you saves him.

In 2014, researchers had Chicago commuters talk to strangers on the train.
Most people predicted silence would be nicer.
The ones who talked had the better ride.

But don't stop at two.
Next person standing alone, you both wave him over.
Now you're the group.

You walked in waiting to be saved.
You walked out with your own group.

Send this to the friend who hides in the bathroom at events.

---

## ELEVENLABS

```text
[thoughtful] Ten minutes into an event and everyone's already in a group? [sighs] Go find the one person who isn't. You're by the drinks, fake scrolling your phone. Every circle's closed. [short pause] But look again. Someone else is doing exactly what you're doing. Say his name's Sam. Lanyard on, full drink, eyes on the door. He just got here before his friends. [encouraging] So walk over and say, I don't know a single person here. You? You're thinking, he'll think I'm a loser. [chuckles] He's praying someone like you saves him. In 2014, researchers had Chicago commuters talk to strangers on the train. Most people predicted silence would be nicer. The ones who talked had the better ride. [thoughtful] But don't stop at two. Next person standing alone, you both wave him over. Now you're the group. You walked in waiting to be saved. [happy] You walked out with your own group. [playful] Send this to the friend who hides in the bathroom at events.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Every group at the event stands on its own small lit island in a dark, still floor of water. People on their own stand on single stepping stones. Walking to the other lone person raises stones under your feet, and every person you wave over makes your island grow until it's the biggest, warmest one in the room.",
    "why": "The lesson is that groups aren't closed clubs you break into, they're islands anyone can start. Seeing two stepping stones join and grow into an island makes 'start your own group' obvious without explaining it.",
    "library_metaphor": "group_islands"
  },
  "names": {"stranger_a": "Sam", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "The islands",
      "what_we_see": "Top-down on the busy event hall. The floor between groups darkens into still water, each circle of people standing on its own small lit island. You stand alone on a single stepping stone by the drinks. A soft spotlight sweeps the room and lands on one other stepping stone across the water.",
      "camera": "High top-down, slow push in towards you",
      "transition_in": "cold open",
      "cast": ["you", "crowd"],
      "uses": ["event_hall"],
      "new": ["islands_floor"],
      "cues": [
        {"word": "group", "what": "the floor turns to water and the groups float apart on their islands"},
        {"word": "isn't", "what": "the spotlight lands on the other lone stepping stone"}
      ],
      "on_screen": [{"type": "big_text", "text": "Find the one person who isn't"}]
    },
    {
      "id": 2, "lines": [3, 4], "title": "Fake scrolling",
      "what_we_see": "Ground level at the drinks table. You stand on your stepping stone, thumb scrolling a phone with nothing on the screen. The nearest island's circle closes its shoulders and turns its backs, water lapping at your stone.",
      "camera": "Medium on you, the closed circle soft in the foreground",
      "transition_in": "cut",
      "cast": ["you", "crowd"],
      "uses": ["drinks_table", "phone", "islands_floor"],
      "new": [],
      "cues": [
        {"word": "phone", "what": "you scroll an empty screen"},
        {"word": "closed", "what": "the nearest circle shuffles shut, backs to you"}
      ],
      "on_screen": []
    },
    {
      "id": 3, "lines": [5, 9], "title": "Meet Sam",
      "what_we_see": "Whip pan across the water to Sam on his own stepping stone, a mirror of you. His lanyard swings, his drink is untouched and full to the brim, and he keeps glancing at the entrance. A tiny thought bubble above him shows his friends stuck in traffic.",
      "camera": "Whip pan, then a slow push in on Sam",
      "transition_in": "whip pan",
      "cast": ["stranger_a"],
      "uses": ["event_hall", "whip_pan", "islands_floor", "drink_glass"],
      "new": ["lanyard"],
      "cues": [
        {"word": "again", "what": "the whip pan across the water"},
        {"word": "Lanyard", "what": "the lanyard swings into view"},
        {"word": "door", "what": "Sam glances at the entrance"},
        {"word": "friends", "what": "a thought bubble shows his friends stuck in traffic"}
      ],
      "on_screen": [{"type": "label", "text": "Sam", "target": "stranger_a", "at": "Sam"}]
    },
    {
      "id": 4, "lines": [10, 10], "title": "Stones rise",
      "what_we_see": "You step off your stone into the water, and a new stepping stone rises under each foot as you walk across to Sam. As you speak, warm gold light spreads across both your stones.",
      "camera": "Side-on tracking shot following your walk",
      "transition_in": "cut",
      "cast": ["you", "stranger_a"],
      "uses": ["islands_floor", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "walk", "what": "the first stone rises under your foot"},
        {"word": "here", "what": "gold light spreads across both stones"}
      ],
      "on_screen": [{"type": "quote_bubble", "speaker": "you", "text": "I don't know a single person here. You?", "at": "say"}]
    },
    {
      "id": 5, "lines": [11, 12], "title": "The fear, and the truth",
      "what_we_see": "The fear: the whole room freezes and turns to point at you, everything drained grey-blue. Snap back: Sam is waving a tiny white flag at nobody in particular, beaming with relief when he sees you.",
      "camera": "Fast zoom out on the frozen room, then a snap close-up on Sam",
      "transition_in": "freeze",
      "cast": ["you", "stranger_a", "crowd"],
      "uses": ["freeze_frame", "colour_drain"],
      "new": [],
      "cues": [
        {"word": "loser", "what": "the room freezes and every head turns to point"},
        {"word": "saves", "what": "colour snaps back and Sam waves his tiny white flag"}
      ],
      "on_screen": []
    },
    {
      "id": 6, "lines": [13, 15], "title": "The train",
      "what_we_see": "The Professor in front of a huge grid of tiny two-seat train benches. Grey, silent pairs sit still. Pairs who talk light up warm, one after another, until the talking side of the grid glows.",
      "camera": "Close on the Professor, then a pull back to the whole grid",
      "transition_in": "the water ripples into the grid",
      "cast": ["professor"],
      "uses": ["speed_date_grid", "gold_glow", "colour_drain"],
      "new": [],
      "cues": [
        {"word": "commuters", "what": "pull back to reveal the grid of benches"},
        {"word": "silence", "what": "the quiet pairs drain to grey"},
        {"word": "talked", "what": "the talking pairs light up warm"}
      ],
      "on_screen": [{"type": "study_card", "year": 2014, "who": "Epley and Schroeder", "finding": "Commuters asked to talk to a stranger had a better ride than those who sat in silence", "at": "2014"}]
    },
    {
      "id": 7, "lines": [16, 18], "title": "The island grows",
      "screenshot": true,
      "what_we_see": "Back on the water. You and Sam's stones have fused into a small island. You both wave at another lone guy on a stone, and the island clunks bigger as he joins. Then again. The island becomes the warmest, biggest one in the room.",
      "camera": "Crane up as the island grows",
      "transition_in": "cut",
      "cast": ["you", "stranger_a", "stranger_b", "crowd"],
      "uses": ["islands_floor", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "wave", "what": "you both wave a lone guy over"},
        {"word": "next", "what": "the island clunks bigger as he steps on"},
        {"word": "group", "what": "the island glows gold, the biggest in the room"}
      ],
      "on_screen": []
    },
    {
      "id": 8, "lines": [19, 20], "title": "Before and after",
      "what_we_see": "Split screen. Left: you at the start, alone on a stepping stone, grey. Right: you now, laughing in the middle of the biggest gold island, other islands drifting towards it.",
      "camera": "Locked-off split screen",
      "transition_in": "wipe",
      "cast": ["you", "stranger_a", "crowd"],
      "uses": ["islands_floor", "colour_drain", "gold_glow"],
      "new": [],
      "cues": [{"word": "out", "what": "the right half lights up gold"}],
      "on_screen": [{"type": "big_text", "text": "Start your own group", "at": "own"}]
    },
    {
      "id": 9, "lines": [21, 21], "title": "Jay in the bathroom",
      "what_we_see": "Jay peeks out of the bathroom door at the edge of the event hall, phone in hand, clearly hiding. A stepping stone rises outside the door, waiting for him.",
      "camera": "Medium on the door, slow push in",
      "transition_in": "cut",
      "cast": ["friend"],
      "uses": ["event_hall", "islands_floor", "phone"],
      "new": [],
      "cues": [{"word": "hides", "what": "Jay ducks back behind the door"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "group_islands", "kind": "metaphor", "name": "Group islands", "description": "Groups at an event stand on small lit islands in a dark still floor of water; lone people stand on single stepping stones. Joining or starting a group grows an island.", "reuse": "Any video about groups, belonging, cliques, being left out or starting your own circle"},
    {"id": "islands_floor", "kind": "effect", "name": "Islands floor", "description": "The event floor turns into dark, still, reflective water. Each group stands on a round lit island just big enough for them, lone people on a knee-high stepping stone. Stones rise under feet as someone walks, and islands can fuse and grow with a soft clunk.", "reuse": "Groups, isolation, building a circle, bridges between people"},
    {"id": "lanyard", "kind": "prop", "name": "Event lanyard", "description": "A fabric neck strap with a plastic badge holder hanging at chest height, blank card with a small gold logo. Swings when the wearer turns.", "reuse": "Any event, conference or meetup scene, as a quick 'this person is at the event' tell"}
  ]
}
```

---

## CAPTION


You walk into an event where you know nobody. Who do you talk to first?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #networking

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| In 2014, researchers asked Chicago commuters to talk to a stranger on the train | Epley and Schroeder (2014), "Mistakenly Seeking Solitude", *Journal of Experimental Psychology: General*; [WNYC interview with Epley](https://wnyc.org/story/pleasant-commute-talk-stranger), [Lab Manager summary](https://www.labmanager.com/mom-was-wrong-you-should-talk-to-strangers-13225) | Confirmed (Chicago-area train commuters; some were asked to talk to a seatmate) |
| Most people predicted silence would be nicer | Same sources: commuters in the prediction condition expected solitude to be more pleasant | Confirmed |
| The ones who talked had the better ride | Same sources: commuters who talked reported a more positive commute than those who kept to themselves | Confirmed |

### ⚠️ Check before posting
- The commuters were paid participants, and the study used Chicago-area trains and buses across several experiments. "Asked" is accurate; don't add numbers.
- Sam is a one-off stranger name.
- New assets: the islands floor is the big build. It's reusable for any "groups" topic.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=event_conversation tier=1 format=F2 hook=N1 named_tool=no proof=study objection=yes character=named ending=E4 cta=share -->
