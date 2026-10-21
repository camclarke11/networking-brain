# The pizza in the oven

**Format:** F7 Brand X-ray
**Tier:** 1 (every freelancer and agency makes clients wait, and can send a progress photo today)
**Situation:** a client waiting on work you're halfway through
**A vs B:** going quiet until it's finished → showing the work while it happens
**Length:** 144 words ≈ 49s (at 175 wpm)
**Hook code:** N12 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Keep clients

---

## TITLE / COVER OPTIONS
1. Why Domino's shows you the oven
2. The pizza tracker isn't about the pizza
3. Your clients don't hate waiting

Cover (video/out/2026-10-21-the-pizza-in-the-oven-cover.jpg): `python3 tools/make_video.py scripts/2026-10-21-the-pizza-in-the-oven.md cover --at 27.2 --title "Why Domino's|shows you|the oven" --highlight oven --shift 420`

---

## HOOK OPTIONS
**A (used, N12):** You order a Domino's, then sit there staring at your phone. Being made. In the oven.
**B (N9):** Domino's built a progress bar for a pizza. It's the reason you don't mind waiting.
**C (N12):** You've watched a pizza go in an oven you can't even see.

---

## LOOP MAP

```text
L1  line 1   Why does Domino's show you all this?      → surface line 8, full answer line 13
L2  line 5   If it's not for the door, what is it for? → closed line 8
L3  line 8   How can the same wait feel different?    → closed lines 9, 10
L4  line 11  So what did the tracker actually change?  → closed lines 12, 13
L5  line 14  What does showing the work look like?     → closed lines 15, 16
```

---

## SCRIPT

You order a Domino's, then sit there staring at your phone.
Being made.
In the oven.
Now Mike's bringing it to you.
You'd think that tracker is there so you know when to open the door.
That's the small part.
The pizza doesn't get to you a second faster.
But the wait stops feeling like a wait.
Because a silent wait feels like nobody's working on it.
A wait you can watch feels like somebody is.
And when you can see the work, you'll wait longer and like them more for it.
The tracker didn't make the pizza better.
It just stopped hiding the kitchen.
So if you sell anything, show them the work.
Don't go quiet for a week and drop the finished thing.
Send a photo of it in the oven.
Send this to the friend whose clients always text, any update?

---

## ELEVENLABS

```text
[curious] You order a Domino's, then sit there staring at your phone. Being made. In the oven. [excited] Now Mike's bringing it to you. [thoughtful] You'd think that tracker is there so you know when to open the door. [matter-of-fact] That's the small part. The pizza doesn't get to you a second faster. But the wait stops feeling like a wait. [serious] Because a silent wait feels like nobody's working on it. A wait you can watch feels like somebody is. [warm] And when you can see the work, you'll wait longer and like them more for it. [thoughtful] The tracker didn't make the pizza better. It just stopped hiding the kitchen. [confident] So if you sell anything, show them the work. Don't go quiet for a week and drop the finished thing. [happy] Send a photo of it in the oven. [playful] Send this to the friend whose clients always text, any update?
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "The wall turns to glass. While you wait, the kitchen is hidden behind a blank wall and you fidget. When the wall turns to glass and you can watch the cook work, you relax, even though the clock keeps going.",
    "why": "The lesson is that showing the work changes how a wait feels, not how long it is. A wall that becomes a window, with the same clock running on both sides, shows exactly that."
  },
  "names": {"stranger_a": "Mike", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 4], "title": "Staring at the tracker",
      "what_we_see": "You stand holding your phone, staring at it. A big pizza tracker card shows three steps that light in turn: BEING MADE, IN THE OVEN, MIKE'S ON THE WAY. Behind you a plain closed wall.",
      "camera": "Medium close on you and the phone, the tracker card above",
      "transition_in": "cold open",
      "cast": ["you"], "uses": ["phone"], "new": [],
      "cues": [{"word": "staring", "what": "you lean into the phone"}, {"word": "made", "what": "step one lights"}, {"word": "oven", "what": "step two lights"}, {"word": "Mike's", "what": "step three lights"}],
      "on_screen": [{"type": "big_text", "text": "You're watching a pizza you can't see", "at": "You"}, {"type": "tool_card", "title": "Your pizza", "items": ["Being made", "In the oven", "Mike's on the way"]}]
    },
    {
      "id": 2, "lines": [5, 6], "title": "Not the door",
      "what_we_see": "You by your front door, hand hovering near the handle, checking the phone. On 'small' the door shrinks away into the background.",
      "camera": "Wide on you and the door",
      "transition_in": "cut",
      "cast": ["you"], "uses": ["doorway", "phone"], "new": [],
      "cues": [{"word": "door", "what": "your hand hovers at the handle"}, {"word": "small", "what": "the door slides back and shrinks"}],
      "on_screen": []
    },
    {
      "id": 3, "lines": [7, 8], "title": "Same clock",
      "what_we_see": "A big wall clock above you ticks at the same speed. On 'wait' the clock's red ticking ring turns calm yellow, though the hands keep moving at the same pace.",
      "camera": "Low angle on you under the clock",
      "transition_in": "cut",
      "cast": ["you"], "uses": [], "new": ["wall_clock"],
      "cues": [{"word": "faster", "what": "the clock ticks on, same speed"}, {"word": "wait", "what": "the clock's ring turns from red to yellow"}],
      "on_screen": []
    },
    {
      "id": 4, "lines": [9, 10], "title": "Wall or window",
      "what_we_see": "Split stage. Left: you wait in front of a blank wall, tapping your foot, a question mark above your head. Right: the same wall is glass, and behind it Mike slides a pizza into a glowing oven. The you on the right leans on the glass, smiling.",
      "camera": "Wide, straight on, both halves at once",
      "transition_in": "cut",
      "cast": ["you", "stranger_a"], "uses": [], "new": ["pizza_oven"],
      "cues": [{"word": "silent", "what": "the left you taps a foot, a question mark pops"}, {"word": "watch", "what": "the right wall turns to glass and the oven glows"}],
      "on_screen": [], "screenshot": true
    },
    {
      "id": 5, "lines": [11, 11], "title": "Wait longer, like it more",
      "what_we_see": "Just the glass side. The clock above moves on further, but you keep smiling and give a thumbs up as Mike boxes the pizza.",
      "camera": "Slow push toward the glass",
      "transition_in": "push",
      "cast": ["you", "stranger_a"], "uses": ["pizza_oven", "wall_clock"], "new": ["pizza_box"],
      "cues": [{"word": "work", "what": "Mike slides the pizza out"}, {"word": "longer", "what": "the clock hand jumps on"}, {"word": "more", "what": "you cheer"}],
      "on_screen": []
    },
    {
      "id": 6, "lines": [12, 13], "title": "Stop hiding the kitchen",
      "what_we_see": "The pizza box on a counter, unchanged. On 'kitchen' the wall behind it slides down like a shutter to reveal the whole kitchen, glowing.",
      "camera": "Straight on the box, then a pull back as the wall drops",
      "transition_in": "cut",
      "cast": ["stranger_a"], "uses": ["pizza_box", "pizza_oven"], "new": [],
      "cues": [{"word": "better", "what": "the box sits still, nothing changes"}, {"word": "kitchen", "what": "the wall drops and the kitchen lights up"}],
      "on_screen": []
    },
    {
      "id": 7, "lines": [14, 16], "title": "Send the photo",
      "what_we_see": "You at a laptop on a white desk, halfway through a client's homepage. You snap a photo of the screen and send it. A chat pops up with the client.",
      "camera": "Over your shoulder at the laptop, then the chat fills the frame",
      "transition_in": "fade",
      "cast": ["you"], "uses": ["laptop", "store_table", "phone"], "new": [],
      "cues": [{"word": "work", "what": "you lift the phone to the laptop"}, {"word": "quiet", "what": "a grey silent week flashes past"}, {"word": "photo", "what": "the message sends"}],
      "on_screen": [{"type": "dm_screen", "from": "Client", "messages": [{"side": "me", "text": "Day 2. Your homepage is in the oven."}, {"side": "them", "text": "Love seeing this!"}]}]
    },
    {
      "id": 8, "lines": [17, 17], "title": "Jay's phone",
      "what_we_see": "Jay at his desk as his phone buzzes again and again with the same message from three clients.",
      "camera": "Medium on Jay and the buzzing phone",
      "transition_in": "cut",
      "cast": ["friend"], "uses": ["phone"], "new": [],
      "cues": [{"word": "update", "what": "the phone buzzes with any update?"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "pizza_box", "kind": "prop", "name": "Pizza box", "description": "A flat square white pizza box with a plain lid that can open to show a round pizza with yellow cheese and a few red dots. About 0.45 wide next to a character, carried flat on one hand.", "reuse": "Food deliveries, orders, anything that arrives in a box"},
    {"id": "pizza_oven", "kind": "prop", "name": "Pizza oven", "description": "A rounded white brick oven with a dark arched mouth whose inside glows warm orange, on a white counter, about character height. A cook character can slide a pizza in and out on a flat paddle.", "reuse": "Kitchens, 'in the oven' progress, work happening behind the scenes"},
    {"id": "wall_clock", "kind": "prop", "name": "Wall clock", "description": "A large round white wall clock with black hands and a thin outer ring that can glow red when the wait feels bad and calm yellow when it feels fine. The hands move at a set speed and can jump forward. Hangs above a character's head.", "reuse": "Waiting, deadlines, time pressure, response times"}
  ]
}
```

---

## CAPTION





Your clients don't hate waiting. So what do they hate?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #freelancing #agency #customerexperience

---

## FACT SHEET & SOURCES

| Claim, as the script tells it | What it rests on | Source (link) | Status |
|---|---|---|---|
| "Being made. In the oven. Now Mike's bringing it to you." | Domino's Pizza Tracker, unveiled January 2008, shows when an order is being prepared, when it's out of the oven and on its way, and the delivery driver's first name. CIO Chris McGlothlin: "Now we can prove it every step of the way" | [Nation's Restaurant News, 27 Feb 2008](https://www.nrn.com/archive/inside-dominos-pizza-tracker-what-it-does-why-and-how); [NPR Planet Money, Sept 2026](https://www.npr.org/2026/09/18/nx-s1-5974101/dominos-pizza-tracker-labor-illusion) | Confirmed |
| "And when you can see the work, you'll wait longer and like them more for it." | Buell and Norton (2011), "The Labor Illusion: How Operational Transparency Increases Perceived Value", Management Science 57(9): five experiments (online travel and dating); "people can actually prefer websites with longer waits to those that return instantaneous results", and perceived value rose | [RePEc / Management Science](https://ideas.repec.org/a/inm/ormnsc/v57y2011i9p1564-1579.html); [Marketing Week (Richard Shotton)](https://www.marketingweek.com/richard-shotton-labour-illusion/) | Confirmed (backing only, not narrated) |
| "The pizza doesn't get to you a second faster." | The tracker displays order status; it doesn't change prep or delivery time | Logic, consistent with [The Hustle](https://thehustle.co/originals/how-the-dominos-pizza-tracker-conquered-the-business-world) | Fair |
| "It just stopped hiding the kitchen." | Domino's was already tracking order status on its back end and chose to show it to customers | [The Hustle](https://thehustle.co/originals/how-the-dominos-pizza-tracker-conquered-the-business-world) | Our reframe |

### ⚠️ Check before posting
- People online argue about whether the tracker is truly live or partly a timer. NRN (2008) said the display lags real progress by no more than 40 seconds; later reports describe employee-entered checkpoints plus timing. The script doesn't claim it's perfectly live.
- "Mike" is an example driver name. The tracker shows the real driver's first name.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=consumer_psych tier=1 format=F7 hook=N12 named_tool=no proof=none objection=no character=named ending=E6 cta=share -->
