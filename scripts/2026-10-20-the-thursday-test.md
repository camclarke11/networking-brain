# The Thursday test

**Format:** F4 Read
**Tier:** 1 (a live moment every founder has had, with a test and the exact text)
**Situation:** the end of a good chat with someone busy, who says "we should grab coffee sometime"
**A vs B:** wait for "sometime" to turn into a plan → send one specific day and time, and read how she answers
**Length:** 168 words ≈ 58s (at 175 wpm)
**Hook code:** N2 · **Ending code:** E1 · **Named tool:** the Thursday test

---

## TITLE / COVER OPTIONS
1. "Let's grab coffee sometime" means one of two things
2. How to tell if they actually want that coffee
3. The Thursday test

---

## HOOK OPTIONS
**A (used, N2):** We should grab coffee sometime. Means one of two things. One text tells you which.
**B (N4):** How to tell in one text if "let's grab coffee" was real or just polite.
**C (N3):** Stop waiting for "sometime". Send a Thursday.

---

## SCRIPT


We should grab coffee sometime.
Means one of two things.
One text tells you which.

Lena says it to you after a great chat.
You go home buzzing.
Three weeks later, you've heard nothing.
Because sometime isn't a day.

So give her one.
Loved chatting. I'm near you Thursday. Does 9 work for 20 minutes?
I call it the Thursday test.

If she meant it, she moves the day.
Thursday's bad, how about Monday?
That's a yes.

If not, you get, crazy month, let's play it by ear.
No new day.
That's a polite no.

You're thinking, isn't pinning her down a bit pushy?
It's the opposite.
Sometime leaves her all the work.
You just made yes easy.

But here's where you could blow it.
You get the polite no and keep chasing.
Don't.
Reply, no stress, see you at the next one.

Sometime is where coffees go to die.
Thursday is where they actually happen.

Send this to the friend still waiting on a coffee from June.

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "'Sometime' is a wall calendar full of fog, with no days on it. A specific text slams a gold pin into one real day and the fog clears around it. Her answer either moves the pin (a yes) or lets the fog roll back over everything (a polite no).",
    "why": "The lesson is that a vague plan has nowhere to land, and a specific day makes her real answer visible. Fog against a pinned day shows both at a glance, and the moving pin versus the returning fog is the read itself.",
    "library_metaphor": "fog_calendar_metaphor"
  },
  "names": {"big_name": "Lena", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 3], "title": "Sometime",
      "what_we_see": "At the event, Lena smiles and says the line, phone in hand. Behind her, a big wall calendar appears and its days dissolve into fog. On 'two' the calendar splits into two pages, one warm gold and one cold grey.",
      "camera": "Medium on Lena, then a slow push past her onto the calendar",
      "transition_in": "cold open",
      "cast": ["big_name", "you", "crowd"],
      "uses": ["event_hall", "phone"],
      "new": ["fog_calendar"],
      "cues": [
        {"word": "sometime", "what": "the calendar's days dissolve into fog"},
        {"word": "two", "what": "the calendar splits into a gold page and a grey page"}
      ],
      "on_screen": [
        {"type": "big_text", "text": "\"Coffee sometime\" means one of two things"},
        {"type": "quote_bubble", "speaker": "big_name", "text": "We should grab coffee sometime."}
      ]
    },
    {
      "id": 2, "lines": [4, 7], "title": "Three weeks of fog",
      "what_we_see": "You bounce down a wet street at night, grinning. Cut to the fog calendar on your bedroom wall: the pages flip by, three weeks of nothing, and the fog thickens until the calendar disappears.",
      "camera": "Tracking you down the street, then locked off on the calendar",
      "transition_in": "cut",
      "cast": ["you", "big_name"],
      "uses": ["street_night", "fog_calendar"],
      "new": [],
      "cues": [
        {"word": "buzzing", "what": "you bounce down the street"},
        {"word": "nothing", "what": "the pages flip by in fog"},
        {"word": "day", "what": "the fog swallows the calendar"}
      ],
      "on_screen": [{"type": "label", "text": "Lena", "target": "big_name", "at": "Lena"}]
    },
    {
      "id": 3, "lines": [8, 10], "title": "The pin",
      "what_we_see": "Your phone with the text. As you hit send, a gold pin flies out of the screen and slams into Thursday on the calendar. The fog blows back from that one square, and it glows.",
      "camera": "Phone full frame, then a whip pan to the calendar as the pin lands",
      "transition_in": "cut",
      "cast": ["you"],
      "uses": ["phone_screen", "fog_calendar", "gold_glow", "whip_pan"],
      "new": [],
      "cues": [
        {"word": "Thursday", "what": "the gold pin slams into Thursday"},
        {"word": "test", "what": "the fog blows back from the square"}
      ],
      "on_screen": [
        {"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "Loved chatting. I'm near you Thursday. Does 9 work for 20 minutes?"}]},
        {"type": "big_text", "text": "The Thursday test", "at": "test"}
      ]
    },
    {
      "id": 4, "lines": [11, 13], "title": "The pin moves",
      "what_we_see": "Lena's hand reaches into the calendar, pulls the gold pin out of Thursday and pushes it into Monday. The whole calendar clears and warms up.",
      "camera": "Close on the calendar, Lena's hand entering frame",
      "transition_in": "cut",
      "cast": ["big_name"],
      "uses": ["fog_calendar", "gold_glow", "phone_screen"],
      "new": [],
      "cues": [
        {"word": "moves", "what": "her hand pulls the pin out"},
        {"word": "Monday", "what": "the pin goes into Monday"},
        {"word": "yes", "what": "the calendar clears and glows"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "Lena", "messages": [{"side": "them", "text": "Thursday's bad, how about Monday?"}]}]
    },
    {
      "id": 5, "lines": [14, 16], "title": "The fog comes back",
      "what_we_see": "Rewind to the pinned Thursday. This time the fog rolls back in over everything, the pin drops out and bounces on the floor, and the whole frame drains grey-blue.",
      "camera": "Same angle on the calendar, slow pull back",
      "transition_in": "vhs rewind",
      "cast": [],
      "uses": ["fog_calendar", "vhs_rewind", "colour_drain"],
      "new": [],
      "cues": [
        {"word": "crazy", "what": "the fog rolls back over the calendar"},
        {"word": "new", "what": "the pin drops out and bounces"},
        {"word": "polite", "what": "the frame drains grey-blue"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "Lena", "messages": [{"side": "them", "text": "Crazy month, let's play it by ear."}]}]
    },
    {
      "id": 6, "lines": [17, 20], "title": "Pushy?",
      "what_we_see": "The fear: you lasso a giant calendar and drag it across the room towards a startled Lena. Snap back to reality: you simply hand her a small calendar with one day already circled, and she nods with relief.",
      "camera": "Wide on the absurd lasso, then a snap cut to a calm medium two-shot",
      "transition_in": "cut",
      "cast": ["you", "big_name"],
      "uses": ["fog_calendar", "coffee_shop"],
      "new": [],
      "cues": [
        {"word": "pushy", "what": "you lasso the giant calendar"},
        {"word": "opposite", "what": "snap to you handing her a small calendar"},
        {"word": "easy", "what": "Lena nods with relief"}
      ],
      "on_screen": []
    },
    {
      "id": 7, "lines": [21, 24], "title": "Don't chase",
      "what_we_see": "You chase a runaway coffee cup with little legs down the wet street. On 'Don't' everything freezes mid-step. You straighten up, type the reply, and the cup trots back and sits at your feet.",
      "camera": "Tracking the chase, then a freeze and a slow push in",
      "transition_in": "cut",
      "cast": ["you"],
      "uses": ["street_night", "freeze_frame", "phone"],
      "new": ["runaway_cup"],
      "cues": [
        {"word": "chasing", "what": "you sprint after the runaway cup"},
        {"word": "Don't", "what": "freeze mid-step"},
        {"word": "next", "what": "the cup trots back to you"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "No stress, see you at the next one."}]}]
    },
    {
      "id": 8, "lines": [25, 26], "title": "Two calendars",
      "screenshot": true,
      "what_we_see": "Two calendars side by side on the void. The foggy one has cold, abandoned coffee cups scattered at its feet. The other has one gold pin and a steaming cup sitting on Thursday.",
      "camera": "Locked off, push in on the gold Thursday",
      "transition_in": "cut",
      "cast": [],
      "uses": ["void", "fog_calendar", "runaway_cup", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "die", "what": "the abandoned cups slump"},
        {"word": "happen", "what": "the Thursday cup steams and glows"}
      ],
      "on_screen": [{"type": "big_text", "text": "Sometime isn't a day", "at": "Thursday"}]
    },
    {
      "id": 9, "lines": [27, 27], "title": "Jay's coffee",
      "what_we_see": "Jay alone at a coffee shop table with two cups. The one opposite him is cold and has a cobweb on it. The calendar on the wall still says June.",
      "camera": "Medium on Jay, slow push in on the cobweb",
      "transition_in": "cut",
      "cast": ["friend"],
      "uses": ["coffee_shop", "fog_calendar"],
      "new": [],
      "cues": [{"word": "June", "what": "the camera finds the June calendar"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "fog_calendar_metaphor", "kind": "metaphor", "name": "The fog calendar", "description": "A vague plan is a calendar full of fog with no days on it. A specific time slams a gold pin into one real day and clears the fog around it.", "reuse": "Any video about vague plans, 'let's catch up', scheduling or follow-through"},
    {"id": "fog_calendar", "kind": "prop", "name": "Fog calendar", "description": "A big paper wall calendar, taller than a character, whose day squares can dissolve into drifting grey fog or clear. A thumb-sized gold pin can slam into one square, glow, be pulled out and moved, or drop and bounce. Pages flip to show time passing.", "reuse": "Scheduling, time passing, deadlines, vague plans"},
    {"id": "runaway_cup", "kind": "prop", "name": "Runaway coffee cup", "description": "A takeaway coffee cup with a lid, about knee height, with two little legs. It trots away when chased, and trots back and sits when you stop. Can be steaming hot or cold and abandoned.", "reuse": "Coffee meetings, chasing people, plans that keep getting away"}
  ]
}
```

---

## CAPTION

"Let's grab coffee sometime" means one of two things.

"Sometime" isn't a day, so it never happens. Give it one, and their answer tells you if they meant it.

The Thursday test:
📍 Send one day, one time, one length: "Loved chatting. I'm near you Thursday. Does 9 work for 20 minutes?"
📍 They move the day ("Thursday's bad, how about Monday?") → that's a yes.
📍 No new day ("crazy month, let's play it by ear") → that's a polite no.
📍 Polite no? Reply "No stress, see you at the next one." Then let it go.

Who still owes you a coffee? Send them a Thursday this week 👇

Follow, the networking playbook drops soon.

#networking #socialskills #entrepreneur #coffeechat

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| No study cited. The test is practical advice, so it's framed as a read, not a rule. | n/a | n/a |

### ⚠️ Check before posting
- One "no new day" reply can just mean a genuinely busy week. The caption says to let it go, not to write them off. Consider adding "one more try in a month is fine" to the caption if comments push back.
- The Thursday test is a new tool name. Add it to the content log.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=reading_people tier=1 format=F4 hook=N2 named_tool=yes proof=none objection=yes character=named ending=E1 cta=share -->
