# The liking gap

**Format:** F6 Study
**Tier:** 1 (the walk home after an event, deciding whether to follow up)
**Situation:** walking home from an event, replaying the awkward bits, deciding not to text the person you met
**A vs B:** assume it went badly and don't follow up → assume they liked you more than you think and text anyway
**Length:** 157 words ≈ 54s (at 175 wpm)
**Hook code:** N6 · **Ending code:** E1 · **Named tool:** none (the liking gap is the researchers' name, not ours)
**Pillar:** The Move · **Playbook chapter:** Get clients

---

## TITLE / COVER OPTIONS
1. That conversation went better than you think
2. You're grading yourself on the bloopers
3. Text them anyway

---

## HOOK OPTIONS
**A (used, N6):** You think that conversation went badly. It didn't.
**B (N3):** Stop replaying the awkward bits on the way home. Text them instead.
**C (N5):** The reason you never follow up after events is a mistake your brain makes on the walk home.

---

## SCRIPT


You think that conversation went badly.
It didn't.

You're walking home from the event.
Replaying the bit where you forgot his name.
The joke that died.
The weird goodbye.
So you don't text him.
Big mistake.

In 2018, psychologists had strangers chat, then guess how much the other person liked them.
They kept guessing low.
Their partners liked them more than they thought.
Researchers call it the liking gap.

You're thinking, no, I really was awkward.
Maybe.
But you were too busy judging yourself to notice him enjoying it.

You're grading yourself on the bloopers.
He's grading you on the highlights.
So your review of that chat doesn't count.
His does.

Text him anyway.
Good chatting last night, you've got me rethinking my pricing.
That's it.

The guy who sends it gets a second conversation.
The guy who doesn't never finds out it went fine.

Send this to the friend who replays every chat in the shower.

---

## ELEVENLABS

```text
[serious] You think that conversation went badly. [reassuring] It didn't. You're walking home from the event. [sighs] Replaying the bit where you forgot his name. The joke that died. The weird goodbye. So you don't text him. [short pause] Big mistake. [matter-of-fact] In 2018, psychologists had strangers chat, then guess how much the other person liked them. They kept guessing low. Their partners liked them more than they thought. Researchers call it the liking gap. You're thinking, no, I really was awkward. [chuckles] Maybe. [warm] But you were too busy judging yourself to notice him enjoying it. You're grading yourself on the bloopers. He's grading you on the highlights. So your review of that chat doesn't count. His does. [encouraging] Text him anyway. Good chatting last night, you've got me rethinking my pricing. That's it. [happy] The guy who sends it gets a second conversation. The guy who doesn't never finds out it went fine. [playful] Send this to the friend who replays every chat in the shower.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "After every conversation, two judges hold up score paddles. You score yourself from a blooper reel playing on a screen above your head. He scores you from a highlight reel playing above his. Your paddle always comes out lower than his.",
    "why": "The lesson is that you judge the chat on your worst moments while they judge it on the best ones. Two screens playing different reels, with two different scores, makes the gap something you can see.",
    "library_metaphor": "scorecard_metaphor"
  },
  "names": {"stranger_b": "the guy you met", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "Two paddles",
      "what_we_see": "The end of a chat at the event. You and the guy you met each lift a judge's score paddle. Yours says 3. Then his flips up: 8.",
      "camera": "Medium two-shot, snap zoom onto the paddles",
      "transition_in": "cold open",
      "cast": ["you", "stranger_b", "crowd"],
      "uses": ["event_hall"],
      "new": ["score_paddles"],
      "cues": [
        {"word": "badly", "what": "your paddle says 3"},
        {"word": "didn't", "what": "his paddle flips up: 8"}
      ],
      "on_screen": [{"type": "big_text", "text": "It went better than you think"}]
    },
    {
      "id": 2, "lines": [3, 8], "title": "The blooper reel",
      "what_we_see": "You walk home along a wet street at night. A screen floats above your head playing a blooper reel of the night: you blanking on his name, a joke landing in silence with a tumbleweed, a weird half-hug goodbye. You put your phone away.",
      "camera": "Tracking alongside you, the floating screen in frame",
      "transition_in": "cut",
      "cast": ["you", "stranger_b"],
      "uses": ["street_night", "phone", "colour_drain"],
      "new": ["reel_screens"],
      "cues": [
        {"word": "name", "what": "blooper one: you blank on his name"},
        {"word": "died", "what": "blooper two: a tumbleweed rolls past the joke"},
        {"word": "goodbye", "what": "blooper three: the half-hug"},
        {"word": "text", "what": "you put your phone away"},
        {"word": "mistake", "what": "the street drains grey-blue"}
      ],
      "on_screen": []
    },
    {
      "id": 3, "lines": [9, 12], "title": "The study",
      "what_we_see": "The Professor in front of a grid of tiny two-person tables. At every table, both people hold up score paddles. Everyone's own paddle is lower than their partner's, table after table, as the grid lights up.",
      "camera": "Close on the Professor, then a pull back over the whole grid",
      "transition_in": "the floating screen fills the frame",
      "cast": ["professor"],
      "uses": ["speed_date_grid", "score_paddles"],
      "new": [],
      "cues": [
        {"word": "strangers", "what": "pull back over the grid of tables"},
        {"word": "low", "what": "every low paddle flips up"},
        {"word": "more", "what": "every partner's higher paddle flips up"}
      ],
      "on_screen": [{"type": "study_card", "year": 2018, "who": "Boothby, Cooney, Sandstrom and Clark", "finding": "After chatting, people underestimated how much their partner liked them", "at": "2018"}, {"type": "big_text", "text": "The liking gap", "at": "gap"}]
    },
    {
      "id": 4, "lines": [13, 15], "title": "Judging yourself",
      "what_we_see": "Back at the event, rewound. You're stood in a tiny courtroom dock in the middle of the conversation, banging a gavel at yourself, while behind you the guy is laughing and nodding along.",
      "camera": "Close on you in the dock, then a rack focus to him laughing behind",
      "transition_in": "vhs rewind",
      "cast": ["you", "stranger_b"],
      "uses": ["vhs_rewind", "event_hall"],
      "new": [],
      "cues": [
        {"word": "awkward", "what": "you bang the gavel at yourself"},
        {"word": "enjoying", "what": "focus pulls to him laughing"}
      ],
      "on_screen": []
    },
    {
      "id": 5, "lines": [16, 19], "title": "Two reels",
      "screenshot": true,
      "what_we_see": "Split screen. Above you, the blooper reel in grey. Above him, a highlight reel in gold: you asking a great question, the two of you laughing, him saving your number. Your paddle drops away; his 8 glows.",
      "camera": "Locked-off split screen",
      "transition_in": "cut",
      "cast": ["you", "stranger_b"],
      "uses": ["reel_screens", "score_paddles", "colour_drain", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "bloopers", "what": "your grey blooper reel plays"},
        {"word": "highlights", "what": "his gold highlight reel plays"},
        {"word": "count", "what": "your paddle drops away"},
        {"word": "His", "what": "his 8 glows gold"}
      ],
      "on_screen": [{"type": "x_check", "wrong": "Your bloopers", "right": "His highlights", "at": "grading"}]
    },
    {
      "id": 6, "lines": [20, 22], "title": "Send it",
      "what_we_see": "Back on the street. You stop, pull your phone out and type. As you send it, the street warms up gold.",
      "camera": "Over your shoulder onto the phone, then a pull back as the street warms",
      "transition_in": "cut",
      "cast": ["you"],
      "uses": ["street_night", "phone_screen", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "anyway", "what": "you pull out your phone"},
        {"word": "it", "what": "you hit send and the street warms"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "Good chatting last night, you've got me rethinking my pricing."}]}]
    },
    {
      "id": 7, "lines": [23, 24], "title": "Two futures",
      "what_we_see": "Split again. On the left, you at a coffee shop table with him, round two, laughing. On the right, a grey version of you alone in bed, still watching the blooper reel.",
      "camera": "Locked-off split screen, slow push in on the left",
      "transition_in": "wipe",
      "cast": ["you", "stranger_b"],
      "uses": ["coffee_shop", "reel_screens", "colour_drain", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "second", "what": "the left side lights up: round two"},
        {"word": "fine", "what": "the right side drains grey"}
      ],
      "on_screen": []
    },
    {
      "id": 8, "lines": [25, 25], "title": "Jay in the shower",
      "what_we_see": "Jay in a steamy shower, a blooper reel playing on the fogged-up glass, wincing at every replay.",
      "camera": "Medium on the glass, slow push in",
      "transition_in": "cut",
      "cast": ["friend"],
      "uses": ["reel_screens"],
      "new": [],
      "cues": [{"word": "shower", "what": "the blooper reel plays on the fogged glass"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "scorecard_metaphor", "kind": "metaphor", "name": "The two scorecards", "description": "After a conversation, both people hold up judge's score paddles. You score yourself from a blooper reel, they score you from a highlight reel, and your number is always lower.", "reuse": "Self-doubt, overthinking, first impressions, how others really see you"},
    {"id": "score_paddles", "kind": "prop", "name": "Score paddles", "description": "Round white judge's paddles on a short handle, held at head height, with one big number. The number can flip, glow gold, drain grey, or drop out of a hand.", "reuse": "Ratings, judgements, self-assessment vs reality"},
    {"id": "reel_screens", "kind": "effect", "name": "Reel screens", "description": "A small floating screen above a character's head, like a thought bubble, playing short clips of a moment. A grey blooper version and a gold highlight version. Can also play on any surface, like a fogged mirror.", "reuse": "Memories, replaying moments, overthinking, what someone remembers"}
  ]
}
```

---

## CAPTION


You think that conversation went badly. Are you sure?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #networking

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| In 2018, psychologists had strangers chat, then guess how much the other person liked them | Boothby, Cooney, Sandstrom and Clark (2018), "The Liking Gap in Conversations: Do People Like Us More Than We Think?", *Psychological Science* 29(11); [Scientific American](https://www.scientificamerican.com/blog/illusion-chasers/people-like-you-more-than-you-know), [Wikipedia (citation)](https://en.wikipedia.org/wiki/Liking_gap) | Confirmed (lab strangers, plus dorm mates and workshop members) |
| They kept guessing low / partners liked them more than they thought | Same sources: people consistently underestimated how much their partners liked them, across settings | Confirmed |
| Researchers call it the liking gap | Same sources | Confirmed |
| Too busy judging yourself to notice him enjoying it | Same paper: outside observers could see the liking, but participants missed the signals; the authors point to self-critical thoughts and attention | Confirmed (paraphrase of the explanation) |

### ⚠️ Check before posting
- The study measured liking, not whether a follow-up gets a reply. The script only claims they liked you more than you think, which is supported.
- "Pricing" is the example topic from the chat. Change it if another script that week uses pricing.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=follow_up tier=1 format=F6 hook=N6 named_tool=no proof=study objection=yes character=generic ending=E1 cta=share -->
