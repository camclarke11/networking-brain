# Message three old ones

**Format:** F6 Study
**Tier:** 1 (outreach for first clients, with the exact message and who to send it to)
**Situation:** you need your first clients and your cold DMs aren't getting replies
**A vs B:** cold DM more strangers → message three people you've lost touch with, starting with the ones you only half knew
**Length:** 168 words ≈ 58s (at 175 wpm)
**Hook code:** N3 · **Ending code:** E1 · **Named tool:** none

---

## TITLE / COVER OPTIONS
1. Your next client is already in your phone
2. Stop cold DMing. Message three old contacts.
3. The people you've lost touch with are worth more

---

## HOOK OPTIONS
**A (used, N3):** Stop hunting for new contacts. Message three old ones.
**B (N6):** Your next client isn't a stranger. It's someone who forgot you exist.
**C (N5):** The reason your cold DMs don't work is you're messaging the wrong people.

---

## SCRIPT


Stop hunting for new contacts.
Message three old ones.

You need your first clients.
So you're cold DMing strangers who never reply.

Your phone's full of people who already like you.
The guy from your old job.
Your friend's older brother with the shop.
You just stopped talking.

In 2011, researchers had executives ask old contacts for advice on a real project.
Those contacts gave fresher ideas than their current ones.

You're thinking, it'll be weird after two years.
For about four seconds.
Then it's just two people catching up.

Here's what you send.
Saw the new job, congrats. I just started my own thing. How's it going?
No pitch.
Just hello.

But most people message the wrong three.
They pick their old best friend.
The best ones turned out to be people they barely knew.
So pick the one you only half knew.

Your next client isn't a stranger.
It's someone who forgot you exist.

Send this to the friend who hasn't texted you back since 2023.

---

## ELEVENLABS

```text
[serious] Stop hunting for new contacts. Message three old ones. You need your first clients. [sighs] So you're cold DMing strangers who never reply. [short pause] Your phone's full of people who already like you. The guy from your old job. Your friend's older brother with the shop. You just stopped talking. [matter-of-fact] In 2011, researchers had executives ask old contacts for advice on a real project. Those contacts gave fresher ideas than their current ones. You're thinking, it'll be weird after two years. [chuckles] For about four seconds. Then it's just two people catching up. [encouraging] Here's what you send. Saw the new job, congrats. I just started my own thing. How's it going? No pitch. Just hello. [short pause] But most people message the wrong three. They pick their old best friend. The best ones turned out to be people they barely knew. [confident] So pick the one you only half knew. [warm] Your next client isn't a stranger. It's someone who forgot you exist. [playful] Send this to the friend who hasn't texted you back since 2023.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Your contacts are a dusty attic full of people asleep under white dust sheets. Messaging one pulls the sheet off and they wake up, glowing and waving. The ones at the back, the people you only half knew, glow brightest of all.",
    "why": "The lesson is that the people you've lost touch with are still there and still useful, they're just dormant. Sleeping figures under dust sheets make 'dormant ties' something you can see, and the brighter glow at the back shows which ones to pick.",
    "library_metaphor": "dormant_attic_metaphor"
  },
  "names": {"stranger_a": "the guy from your old job", "stranger_b": "your friend's older brother", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "The attic",
      "what_we_see": "You at your desk typing cold DMs into the void. Behind you, a door creaks open onto a dusty attic full of figures under white dust sheets. Three of the sheets twitch.",
      "camera": "Over your shoulder, then a slow push through the attic door",
      "transition_in": "cold open",
      "cast": ["you"],
      "uses": ["coworking", "phone"],
      "new": ["contact_attic"],
      "cues": [
        {"word": "new", "what": "you type another cold DM"},
        {"word": "old", "what": "the attic door creaks open, three sheets twitch"}
      ],
      "on_screen": [{"type": "big_text", "text": "Message three old contacts"}]
    },
    {
      "id": 2, "lines": [3, 4], "title": "Unread",
      "what_we_see": "Your phone screen: a column of cold DMs, every one unread, the grey ticks stacking up. The envelope pile from earlier towers next to your desk.",
      "camera": "Phone full frame, then a pull back to the pile",
      "transition_in": "cut",
      "cast": ["you"],
      "uses": ["phone_screen", "envelope_pile", "colour_drain"],
      "new": [],
      "cues": [
        {"word": "clients", "what": "you scroll the unread DMs"},
        {"word": "reply", "what": "the grey pile wobbles"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "Hi! Do you need a website?"}, {"side": "me", "text": "Just following up!"}]}]
    },
    {
      "id": 3, "lines": [5, 8], "title": "Under the sheets",
      "what_we_see": "Inside the attic. Torchlight passes over the sleeping figures and lifts each sheet just enough to show who's underneath: the guy from your old job in his work lanyard, your friend's older brother in an apron at his own shop. They're asleep, smiling.",
      "camera": "Handheld torch beam moving across the attic",
      "transition_in": "cut",
      "cast": ["stranger_a", "stranger_b"],
      "uses": ["contact_attic", "lanyard"],
      "new": ["dust_sheets"],
      "cues": [
        {"word": "like", "what": "the torch beam enters the attic"},
        {"word": "job", "what": "the first sheet lifts: the guy from your old job"},
        {"word": "brother", "what": "the second sheet lifts: the older brother"},
        {"word": "stopped", "what": "the sheets drop back down"}
      ],
      "on_screen": []
    },
    {
      "id": 4, "lines": [9, 10], "title": "The study",
      "what_we_see": "The Professor in the attic pulls the sheets off a row of sleeping figures. As each one wakes, a lightbulb above their head switches on, brighter than the bulbs over the busy figures in the next room.",
      "camera": "Medium on the Professor, then a pan along the waking row",
      "transition_in": "cut",
      "cast": ["professor", "crowd"],
      "uses": ["contact_attic", "dust_sheets", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "old", "what": "the Professor pulls the first sheet"},
        {"word": "fresher", "what": "the bulbs above the woken figures light up bright"}
      ],
      "on_screen": [{"type": "study_card", "year": 2011, "who": "Levin, Walter and Murnighan", "finding": "Reconnecting with lost-touch contacts brought fresher ideas than current contacts", "at": "2011"}]
    },
    {
      "id": 5, "lines": [11, 13], "title": "Four seconds of weird",
      "what_we_see": "The fear: you yank a sheet off and the figure screams cartoon-style, everything frozen. A tiny timer counts four seconds. Then the frozen moment thaws and you're both laughing on a video call.",
      "camera": "Snap zoom on the scream, then a cut to a warm video-call split screen",
      "transition_in": "cut",
      "cast": ["you", "stranger_a"],
      "uses": ["dust_sheets", "freeze_frame", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "weird", "what": "the cartoon scream and freeze"},
        {"word": "four", "what": "the timer counts four seconds"},
        {"word": "catching", "what": "thaw to laughing on a video call"}
      ],
      "on_screen": []
    },
    {
      "id": 6, "lines": [14, 17], "title": "The message",
      "what_we_see": "Your phone with the message. As you send it, back in the attic one sheet slides off and the figure underneath sits up, stretches and waves at the camera, glowing.",
      "camera": "Phone full frame, then a match cut to the attic",
      "transition_in": "cut",
      "cast": ["you", "stranger_b"],
      "uses": ["phone_screen", "contact_attic", "dust_sheets", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "send", "what": "you start typing"},
        {"word": "pitch", "what": "you hit send"},
        {"word": "hello", "what": "the sheet slides off and the figure waves"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "Saw the new job, congrats. I just started my own thing. How's it going?"}]}]
    },
    {
      "id": 7, "lines": [18, 21], "title": "The back of the attic",
      "screenshot": true,
      "what_we_see": "You reach for the big sheet at the front of the attic, your old best friend. Stop. The torch swings to the back corner, to figures you barely remember, and when their sheets come off they glow the brightest gold in the room.",
      "camera": "Over your shoulder, then a whip pan to the back corner",
      "transition_in": "cut",
      "cast": ["you", "crowd"],
      "uses": ["contact_attic", "dust_sheets", "gold_glow", "whip_pan"],
      "new": [],
      "cues": [
        {"word": "wrong", "what": "your hand reaches for the front sheet"},
        {"word": "best", "what": "you stop"},
        {"word": "barely", "what": "whip pan to the back corner"},
        {"word": "half", "what": "the back sheets come off, glowing brightest"}
      ],
      "on_screen": [{"type": "x_check", "wrong": "Your old best friend", "right": "The one you only half knew", "at": "pick"}]
    },
    {
      "id": 8, "lines": [22, 23], "title": "Not a stranger",
      "what_we_see": "The attic fully awake, warm and glowing, figures waving down the stairs at you. Behind you, the tower of unread cold DMs quietly topples.",
      "camera": "Wide from the attic stairs looking down at you",
      "transition_in": "cut",
      "cast": ["you", "crowd"],
      "uses": ["contact_attic", "envelope_pile", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "stranger", "what": "the cold-DM tower topples"},
        {"word": "forgot", "what": "the attic figures wave down the stairs"}
      ],
      "on_screen": [{"type": "big_text", "text": "Your next client is already in your phone", "at": "next"}]
    },
    {
      "id": 9, "lines": [24, 24], "title": "Jay under a sheet",
      "what_we_see": "In the attic, one sheet has a phone glow under it. Pull it off: it's Jay, asleep, his phone showing an unanswered text from 2023.",
      "camera": "Close on the glowing sheet, then a reveal",
      "transition_in": "cut",
      "cast": ["friend"],
      "uses": ["contact_attic", "dust_sheets", "phone"],
      "new": [],
      "cues": [{"word": "2023", "what": "the sheet comes off Jay"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "dormant_attic_metaphor", "kind": "metaphor", "name": "The dormant attic", "description": "Your old contacts are figures asleep under dust sheets in an attic. Reaching out pulls the sheet off and they wake up glowing.", "reuse": "Reconnecting, old clients, your existing network, past relationships"},
    {"id": "contact_attic", "kind": "set", "name": "Contact attic", "description": "A warm wooden attic with sloped beams, dusty floorboards, a small round window and a pull-down ladder. Rows of figures stand or sit under white dust sheets. It can be dark and torch-lit or warm and glowing once people wake up.", "reuse": "Old contacts, memories, forgotten ideas, things you already have"},
    {"id": "dust_sheets", "kind": "prop", "name": "Dust sheets", "description": "White cloth sheets draped over a standing or sitting figure, slightly dusty, that can twitch, lift at the corner or slide off in one smooth pull to reveal the person underneath waking up.", "reuse": "Reveals, dormant things, waking something up"}
  ]
}
```

---

## CAPTION

Your next client is already in your phone.

People you've lost touch with still like you, and they know people your current circle doesn't. Researchers found reconnecting with them brought fresher ideas than talking to the people you see every week.

How to do it:
📍 Pick three people you haven't spoken to in a year or more.
📍 Pick at least one you only half knew, not just your old best friend.
📍 Send: "Saw the new job, congrats. I just started my own thing. How's it going?"
📍 No pitch. If they ask what you're doing, then tell them.

Who's your three? Message them before Friday 👇

Follow, the networking playbook drops soon.

#networking #socialskills #entrepreneur #firstclient

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| In 2011, researchers had executives ask old contacts for advice on a real project | Levin, Walter and Murnighan (2011), "Dormant Ties: The Value of Reconnecting", *Organization Science* 22(4); [abstract on IDEAS/RePEc](https://ideas.repec.org/a/inm/ororsc/v22y2011i4p923-939.html) | Confirmed (Executive MBA students consulted dormant contacts about an important work project) |
| Those contacts gave fresher ideas than their current ones | [MIT Sloan Management Review, "The Power of Reconnection"](https://sloanreview.mit.edu/?p=8553): insights from dormant ties tended to be more novel and efficient than from current ties | Confirmed |
| The best ones turned out to be people they barely knew | Walter, Levin and Murnighan (2015), "Reconnection Choices", *Organization Science* 26(5); [abstract](https://ideas.repec.org/a/inm/ororsc/v26y2015i5p1447-1465.html): the most valuable reconnections offered novelty (people they hadn't spent much time with), but people preferred to reconnect with those they'd spent a lot of time with | Confirmed (paraphrase) |

### ⚠️ Check before posting
- The participants were Executive MBA students (working executives). "Executives" is fair.
- The study measured advice, not clients. The script's "your next client" line is the payoff framing, not a finding. Keep the study lines about ideas and advice.
- "Two years" in the objection is the viewer's own words, not a figure from the study.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=outreach tier=1 format=F6 hook=N3 named_tool=no proof=study objection=yes character=generic ending=E1 cta=share -->
