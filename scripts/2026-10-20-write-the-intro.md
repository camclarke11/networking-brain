# Write the intro yourself

**Format:** F3 Exact Words
**Tier:** 1 (someone offered you an intro and it never came; the exact message to send)
**Situation:** a connector said "I'll intro you" two weeks ago, and nothing's happened
**A vs B:** ask "can you intro me?" and wait → send a message he can forward without changing a word
**Length:** 170 words ≈ 58s (at 175 wpm)
**Hook code:** N3 · **Ending code:** E1 · **Named tool:** none

---

## TITLE / COVER OPTIONS
1. If you want an intro, write it yourself
2. Why the intro you were promised never came
3. Turn "I'll intro you" into a button

---

## HOOK OPTIONS
**A (used, N3):** Stop asking people to introduce you. Write the intro for them.
**B (N5):** The intro you were promised didn't happen, and it's not because he forgot.
**C (N4):** How to get the intro someone promised you, without chasing them.

---

## SCRIPT


Stop asking people to introduce you.
Write the intro for them.

Marco knows everyone.
He says, you should meet my friend Lena, I'll intro you.
Two weeks later, you're still waiting.

He didn't forget you.
He has to explain who you are, why you matter, and what you want.
That's homework.

So do the homework for him.
Send him one he can forward as is.
Lena, meet my friend. He makes gym videos and wants his first monthly client.
He'd love 15 minutes on how you landed yours.

Marco just hits forward.
Done in ten seconds.

You're thinking, isn't writing my own intro a bit much?
It's the polite move.
You've turned a favor into a button.

But you need one more line.
Add, no pressure if the timing's off.
Now Lena can say no without Marco looking bad.
So Marco's happy to send it.

An intro he has to write waits a week.
One he can forward goes tonight.

Send this to the friend still waiting on five intros.

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Asking for an intro hands the connector a flat-pack box: loose parts, an instruction booklet, assembly required. He shoves it in a cupboard. Writing the intro yourself hands him a wrapped parcel, already labelled, sitting on a big forward button. He taps it once and it's gone.",
    "why": "The lesson is that intros stall because they're work for the person making them. A flat-pack box against a ready parcel shows the difference in effort instantly, and the button makes 'forwardable' literal.",
    "library_metaphor": "flatpack_metaphor"
  },
  "names": {"connector": "Marco", "big_name": "Lena", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "Box or parcel",
      "what_we_see": "At the event, you hand Marco a big flat-pack box marked 'INTRO' with loose parts rattling inside. He staggers under it. Rewind: you hand him a neat wrapped parcel instead, and he tucks it under one arm and waves.",
      "camera": "Medium two-shot, the rewind snapping back to the same frame",
      "transition_in": "cold open",
      "cast": ["you", "connector", "crowd"],
      "uses": ["event_hall", "vhs_rewind"],
      "new": ["intro_parcel"],
      "cues": [
        {"word": "introduce", "what": "Marco staggers under the flat-pack box"},
        {"word": "Write", "what": "rewind, you hand him the wrapped parcel"}
      ],
      "on_screen": [{"type": "big_text", "text": "Want an intro? Write it yourself."}]
    },
    {
      "id": 2, "lines": [3, 5], "title": "I'll intro you",
      "what_we_see": "Marco, mid-wave, across a busy room, promising you the intro with a thumbs up. Cut to his flat with the fog calendar on the wall flipping by, the flat-pack box gathering dust in a cupboard.",
      "camera": "Wide on Marco, then locked off on the cupboard as the calendar pages flip",
      "transition_in": "cut",
      "cast": ["connector", "you", "crowd"],
      "uses": ["event_hall", "fog_calendar", "intro_parcel"],
      "new": [],
      "cues": [
        {"word": "everyone", "what": "Marco waves at half the room"},
        {"word": "waiting", "what": "the calendar flips, the box gathers dust"}
      ],
      "on_screen": [
        {"type": "label", "text": "Marco", "target": "connector", "at": "Marco"},
        {"type": "quote_bubble", "speaker": "connector", "text": "You should meet my friend Lena, I'll intro you."}
      ]
    },
    {
      "id": 3, "lines": [6, 8], "title": "The instructions",
      "what_we_see": "Marco opens the cupboard and the flat-pack box spills loose parts across the floor. He holds up a thick instruction booklet with three steps on it and sighs.",
      "camera": "Low angle on the spilling parts, then up to Marco's face",
      "transition_in": "cut",
      "cast": ["connector"],
      "uses": ["intro_parcel", "colour_drain"],
      "new": [],
      "cues": [
        {"word": "forget", "what": "Marco opens the cupboard"},
        {"word": "explain", "what": "the parts spill across the floor"},
        {"word": "homework", "what": "he holds up the booklet and sighs, the room drains grey"}
      ],
      "on_screen": [{"type": "tool_card", "title": "Marco's homework", "items": ["Who you are", "Why you matter", "What you want"], "highlight": null, "at": "explain"}]
    },
    {
      "id": 4, "lines": [9, 12], "title": "Wrapped and ready",
      "what_we_see": "You at your desk wrapping the parcel and writing the label. The forwardable message appears on a phone screen as you type it. You slide the finished parcel across onto a big gold forward button.",
      "camera": "Overhead on the desk, then the phone full frame",
      "transition_in": "whip pan",
      "cast": ["you"],
      "uses": ["coworking", "intro_parcel", "phone_screen", "whip_pan"],
      "new": ["forward_button"],
      "cues": [
        {"word": "homework", "what": "you start wrapping"},
        {"word": "forward", "what": "the parcel slides onto the big forward button"},
        {"word": "gym", "what": "the label writes itself on the parcel"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "Lena, meet ___. He makes gym videos and wants his first monthly client. He'd love 15 minutes on how you landed yours."}]}]
    },
    {
      "id": 5, "lines": [13, 14], "title": "One tap",
      "what_we_see": "Marco on his sofa taps the forward button with one finger without looking up from the TV. The parcel shoots off with a whoosh and a gold trail.",
      "camera": "Close on his finger, then a whip pan following the parcel",
      "transition_in": "cut",
      "cast": ["connector"],
      "uses": ["forward_button", "intro_parcel", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "hits", "what": "his finger taps the button"},
        {"word": "ten", "what": "the parcel shoots off in a gold trail"}
      ],
      "on_screen": []
    },
    {
      "id": 6, "lines": [15, 17], "title": "A bit much?",
      "what_we_see": "The fear: you as a towering figure dumping a mountain of parcels on Marco's head. Snap back: you hand him one small parcel and he smiles with relief.",
      "camera": "Low angle on the mountain of parcels, then a snap to a calm medium shot",
      "transition_in": "cut",
      "cast": ["you", "connector"],
      "uses": ["intro_parcel", "forward_button"],
      "new": [],
      "cues": [
        {"word": "much", "what": "the parcels avalanche onto Marco"},
        {"word": "polite", "what": "snap back to one small parcel"},
        {"word": "button", "what": "the parcel turns into a tiny gold button in his hand"}
      ],
      "on_screen": []
    },
    {
      "id": 7, "lines": [18, 21], "title": "The escape hatch",
      "screenshot": true,
      "what_we_see": "The parcel lands on Lena's desk. On the side of the parcel is a small gold pull tab. Lena reads it, relaxes and smiles. Across town, Marco gives a relieved thumbs up.",
      "camera": "Close on the pull tab, then split between Lena and Marco",
      "transition_in": "cut",
      "cast": ["big_name", "connector"],
      "uses": ["intro_parcel", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "line", "what": "the gold pull tab appears on the parcel"},
        {"word": "no", "what": "Lena relaxes"},
        {"word": "happy", "what": "Marco gives a thumbs up"}
      ],
      "on_screen": [{"type": "x_check", "wrong": "Can you intro me?", "right": "No pressure if the timing's off.", "at": "pressure"}]
    },
    {
      "id": 8, "lines": [22, 23], "title": "Next week or tonight",
      "what_we_see": "Two cupboards side by side. In one, a flat-pack box under dust and cobwebs. In the other, nothing. The parcel already left, its gold trail still fading.",
      "camera": "Locked off, slow push in on the empty cupboard",
      "transition_in": "cut",
      "cast": [],
      "uses": ["intro_parcel", "colour_drain", "gold_glow", "void"],
      "new": [],
      "cues": [
        {"word": "waits", "what": "dust settles on the flat-pack box"},
        {"word": "tonight", "what": "the gold trail flickers out of the empty cupboard"}
      ],
      "on_screen": [{"type": "big_text", "text": "Forwardable intros get sent", "at": "forward"}]
    },
    {
      "id": 9, "lines": [24, 24], "title": "Jay's five boxes",
      "what_we_see": "Jay standing in front of a stack of five dusty flat-pack boxes, each labelled with a different intro, checking his phone hopefully.",
      "camera": "Medium on Jay, slow push in",
      "transition_in": "cut",
      "cast": ["friend"],
      "uses": ["intro_parcel", "phone"],
      "new": [],
      "cues": [{"word": "five", "what": "the five dusty boxes come into focus"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "flatpack_metaphor", "kind": "metaphor", "name": "Flat-pack vs parcel", "description": "A request that makes someone do the work is a flat-pack box with loose parts and instructions. A request you've done the work for is a wrapped parcel ready to send.", "reuse": "Any ask, intro, favor or request where making it easy is the lesson"},
    {"id": "intro_parcel", "kind": "prop", "name": "Intro parcel", "description": "A box that has two states. Flat-pack: a big brown cardboard box, chest high, with loose parts rattling and a thick instruction booklet, which can spill or gather dust. Wrapped: a neat gold-ribboned parcel, shoebox sized, with a handwritten label and a small gold pull tab on the side.", "reuse": "Asks, favors, gifts, intros, deliverables"},
    {"id": "forward_button", "kind": "prop", "name": "Forward button", "description": "A big round arcade-style button, about knee height, gold with a forward arrow on top. A parcel or message sits on it and shoots off with a whoosh and a gold trail when it's pressed.", "reuse": "Sharing, forwarding, sending, making something one tap"}
  ]
}
```

---

## CAPTION

If you want an intro, write it yourself.

"I'll intro you" usually dies because the person has to explain who you are, why you matter and what you want. Do it for them.

The forwardable intro:
📍 Who you are, in one line: "He makes videos for gyms."
📍 What you want, small and specific: "He'd love 15 minutes on how you landed your first monthly client."
📍 An easy out: "No pressure if the timing's off."
→ Send it to the connector with "Here's something you can forward if it's easier."

Who promised you an intro that never came? Send them this tonight 👇

Follow, the networking playbook drops soon.

#networking #socialskills #entrepreneur #introductions

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| No study cited. The move (a forwardable intro) is common practice in startup circles; no numbers are claimed. | n/a | n/a |

### ⚠️ Check before posting
- The on-screen message uses a blank ("meet ___") because the viewer is never named. The spoken line says "my friend".
- Possible proof if you want it later: Flynn and Lake (2008) found people underestimate how often others will say yes when asked for help. It answers a different objection, so I left it out.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=outreach tier=1 format=F3 hook=N3 named_tool=no proof=none objection=yes character=named ending=E1 cta=share -->
