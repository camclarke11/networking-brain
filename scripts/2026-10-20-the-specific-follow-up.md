# The specific follow-up

**Format:** F3 Exact Words
**Tier:** 1 (the morning after an event, with the exact text to send)
**Situation:** the morning after a founder event, writing to someone you had a good chat with
**A vs B:** "Great to meet you last night!" → her name, the thing she said, and what you did with it
**Length:** 167 words ≈ 57s (at 175 wpm)
**Hook code:** N2 · **Ending code:** E1 · **Named tool:** none

---

## TITLE / COVER OPTIONS
1. "Great to meet you" is why nobody texts back
2. The follow-up text people actually answer
3. Save this for the morning after your next event

---

## HOOK OPTIONS
**A (used, N2):** Great to meet you last night! Is why nobody texts you back.
**B (N4):** How to write a follow-up text that someone you met once actually answers.
**C (N3):** Stop sending "great to meet you" after events. Send her own words back.

---

## SCRIPT


Great to meet you last night!
Is why nobody texts you back.

You met Maya at an event.
Good chat.
So next morning, you send that.

She thinks, who's this again?
Half the room sent her the same one as you.

So send the one only you could send.
Her name, the thing she said, and what you did with it.

Maya, you said cold emails work when the first line is about them.
Tried it on three people this morning.
Two replied.
Now she knows exactly who you are.

You're thinking, isn't that a bit much after one chat?
It's three lines.
And she won't have to scroll back to place you.

But this is where people ruin it.
They tack on, can we jump on a call?
Don't ask for anything yet.
Let her reply first.

A generic text asks her to remember you.
A specific one gives her a reason to.

Send this to the friend with five unsent follow-ups in his drafts.

---

## ELEVENLABS

```text
[playful] Great to meet you last night! [serious] Is why nobody texts you back. You met Maya at an event. Good chat. So next morning, you send that. [sighs] She thinks, who's this again? Half the room sent her the same one as you. [confident] So send the one only you could send. Her name, the thing she said, and what you did with it. [encouraging] Maya, you said cold emails work when the first line is about them. Tried it on three people this morning. Two replied. [happy] Now she knows exactly who you are. You're thinking, isn't that a bit much after one chat? [chuckles] It's three lines. And she won't have to scroll back to place you. [short pause] But this is where people ruin it. They tack on, can we jump on a call? Don't ask for anything yet. Let her reply first. A generic text asks her to remember you. [warm] A specific one gives her a reason to. [playful] Send this to the friend with five unsent follow-ups in his drafts.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Every follow-up text is an envelope landing on the other person's desk. Generic ones are identical grey envelopes that pile into a tower nobody opens. The specific one is a gold envelope with her name handwritten on it, and it lands on top.",
    "why": "The lesson is that a generic follow-up is invisible because everyone sends it. A pile of identical envelopes shows that instantly, and the one handwritten gold envelope shows why the specific text gets opened.",
    "library_metaphor": "envelope_pile_metaphor"
  },
  "names": {"stranger_b": "Maya", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "Into the pile",
      "what_we_see": "Your phone, full frame. You hit send on the generic text. The message folds itself into a plain grey envelope and drops off the top of the screen onto a tall, wobbling tower of identical grey envelopes on someone's desk.",
      "camera": "Phone full frame, then tilt down to follow the envelope onto the pile",
      "transition_in": "cold open",
      "cast": ["you"],
      "uses": ["phone_screen"],
      "new": ["envelope_pile"],
      "cues": [
        {"word": "night", "what": "the message folds into a grey envelope"},
        {"word": "texts", "what": "it drops onto the tall grey pile"}
      ],
      "on_screen": [
        {"type": "big_text", "text": "Why nobody texts you back"},
        {"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "Great to meet you last night!"}]}
      ]
    },
    {
      "id": 2, "lines": [3, 5], "title": "The good chat",
      "what_we_see": "Quick flashback at the event: you and Maya laughing at a high table, drinks in hand. Cut to the next morning: you in bed typing the generic text with one thumb.",
      "camera": "Medium two-shot, then a match cut to a close-up on your thumb",
      "transition_in": "cut",
      "cast": ["you", "stranger_b", "crowd"],
      "uses": ["event_hall", "drink_glass", "phone", "lanyard"],
      "new": [],
      "cues": [
        {"word": "chat", "what": "you both laugh"},
        {"word": "morning", "what": "match cut to you typing in bed"}
      ],
      "on_screen": [{"type": "label", "text": "Maya", "target": "stranger_b", "at": "Maya"}]
    },
    {
      "id": 3, "lines": [6, 7], "title": "Who's this?",
      "what_we_see": "Maya at her desk squints at her phone. Behind her, the grey envelope tower keeps growing as more identical envelopes rain down, until it topples over her chair. A loading spinner turns above her head.",
      "camera": "Medium on Maya, pulling back as the pile topples",
      "transition_in": "cut",
      "cast": ["stranger_b"],
      "uses": ["envelope_pile", "loading_spinner", "colour_drain"],
      "new": [],
      "cues": [
        {"word": "again", "what": "the loading spinner appears"},
        {"word": "same", "what": "the tower topples over her chair"}
      ],
      "on_screen": [{"type": "quote_bubble", "speaker": "stranger_b", "text": "Who's this again?"}]
    },
    {
      "id": 4, "lines": [8, 9], "title": "The gold envelope",
      "what_we_see": "Close on your hands writing on a gold envelope with a fat pen. Each part of the template appears on a tool card as you write it, and the envelope glows brighter with each one.",
      "camera": "Overhead close-up on the envelope",
      "transition_in": "whip pan",
      "cast": ["you"],
      "uses": ["envelope_pile", "gold_glow", "whip_pan"],
      "new": [],
      "cues": [
        {"word": "name", "what": "you write 'Maya' in big letters"},
        {"word": "said", "what": "the envelope glows brighter"},
        {"word": "did", "what": "you seal it with a gold sticker"}
      ],
      "on_screen": [{"type": "tool_card", "title": "The follow-up", "items": ["Her name", "The thing she said", "What you did with it"], "highlight": null, "at": "name"}]
    },
    {
      "id": 5, "lines": [10, 13], "title": "It lands",
      "screenshot": true,
      "what_we_see": "The message on your phone. You send it, and the gold envelope sails onto Maya's desk, lands on top of the grey pile and glows. Maya opens it, laughs, and points at the screen as if to say 'told you'. The grey pile slides off the desk behind her.",
      "camera": "Phone full frame, then a cut to Maya's desk, pushing in on her grin",
      "transition_in": "cut",
      "cast": ["stranger_b"],
      "uses": ["phone_screen", "envelope_pile", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "replied", "what": "the gold envelope lands on top of the pile"},
        {"word": "exactly", "what": "Maya opens it and laughs"},
        {"word": "knows", "what": "she points at the screen, the grey pile slides away"}
      ],
      "on_screen": [{"type": "dm_screen", "from": "you", "messages": [{"side": "me", "text": "Maya, you said cold emails work when the first line is about them. Tried it on three people this morning. Two replied."}]}]
    },
    {
      "id": 6, "lines": [14, 16], "title": "The endless scroll",
      "what_we_see": "The fear: your message unrolls as a giant paper scroll out of Maya's phone, across her office and out of the door. Snap: it rolls back up into three short lines on the screen.",
      "camera": "Follows the scroll out of the door, then a snap back to the phone",
      "transition_in": "cut",
      "cast": ["stranger_b"],
      "uses": ["phone"],
      "new": ["endless_scroll"],
      "cues": [
        {"word": "much", "what": "the scroll unrolls out of the door"},
        {"word": "three", "what": "it snaps back into three short lines"},
        {"word": "scroll", "what": "Maya taps it once, no scrolling needed"}
      ],
      "on_screen": []
    },
    {
      "id": 7, "lines": [17, 20], "title": "Don't add the ask",
      "what_we_see": "You start typing a second line asking for a call. The gold envelope on Maya's desk drains grey and sinks into the pile. You delete the line and it rises back up, gold again.",
      "camera": "Split between your phone and Maya's desk",
      "transition_in": "cut",
      "cast": ["you"],
      "uses": ["phone_screen", "envelope_pile", "colour_drain", "gold_glow"],
      "new": [],
      "cues": [
        {"word": "call", "what": "the gold envelope drains grey and sinks"},
        {"word": "reply", "what": "you delete the line and the envelope rises gold"}
      ],
      "on_screen": [{"type": "x_check", "wrong": "Can we jump on a call?", "right": "Nothing. Let her reply first.", "at": "anything"}]
    },
    {
      "id": 8, "lines": [21, 22], "title": "Grey and gold",
      "what_we_see": "Two envelopes side by side on the void. A blank grey one, and a gold one with Maya's name handwritten on it. The grey one fades away.",
      "camera": "Locked off, slow push in on the gold envelope",
      "transition_in": "cut",
      "cast": [],
      "uses": ["void", "envelope_pile", "gold_glow"],
      "new": [],
      "cues": [{"word": "specific", "what": "the grey envelope fades, the gold one glows"}],
      "on_screen": [{"type": "big_text", "text": "Give her a reason to remember you", "at": "reason"}]
    },
    {
      "id": 9, "lines": [23, 23], "title": "Jay's drafts",
      "what_we_see": "Jay on his sofa staring at his phone. Five half-written grey envelopes hover over his head, never sent. He winces.",
      "camera": "Medium on Jay, slow push in",
      "transition_in": "cut",
      "cast": ["friend"],
      "uses": ["phone", "envelope_pile"],
      "new": [],
      "cues": [{"word": "drafts", "what": "the five grey envelopes appear above his head"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "envelope_pile_metaphor", "kind": "metaphor", "name": "The envelope pile", "description": "Every message is an envelope landing on someone's desk. Generic ones are identical grey envelopes that pile up unopened. A specific one is a gold, hand-addressed envelope that lands on top.", "reuse": "Follow-ups, cold DMs, emails, any 'stand out in their inbox' lesson"},
    {"id": "envelope_pile", "kind": "prop", "name": "Envelope pile", "description": "Hand-sized envelopes. Grey ones are plain and identical and stack into a wobbling tower taller than a person that can topple. One gold envelope with a handwritten name and a gold sticker glows softly and can sail through the air and land on top. Any envelope can drain grey or light up gold.", "reuse": "Inboxes, DMs, follow-ups, outreach volume"},
    {"id": "endless_scroll", "kind": "prop", "name": "Endless scroll", "description": "A long paper scroll that unrolls out of a phone screen, across the floor and out of a door, for a message that's far too long. It can snap back up into the phone in one move.", "reuse": "Over-long messages, rambling pitches, too much text"}
  ]
}
```

---

## CAPTION

"Great to meet you!" is why nobody texts you back.

Everyone sends that text the morning after an event. The one that gets a reply proves you were listening.

The three-part follow-up:
📍 Their name.
📍 One thing they said.
📍 What you did with it.
→ "Maya, you said cold emails work when the first line is about them. Tried it on three people this morning. Two replied."

Don't add "can we jump on a call?" Let them reply first. The ask comes in the second message.

Send one tomorrow morning and tell me if they answered 👇

Follow, the networking playbook drops soon.

#networking #socialskills #entrepreneur #followup

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| No study cited. The move is practical advice; the example numbers ("three people", "two replied") are the viewer's own scene, not a statistic. | n/a | n/a |

### ⚠️ Check before posting
- "Half the room sent her the exact same text" is scene exaggeration, not a statistic. Keep it as is; don't put a number on it.
- The example only works if the viewer actually did something with the advice. The caption makes that clear.
- If you want proof, Kumar and Epley (2018) found people underestimate how much a thank-you means to the person receiving it. It's about letters to people who mattered to the writer, so it's a stretch for a one-chat contact. I left it out on purpose.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=follow_up tier=1 format=F3 hook=N2 named_tool=no proof=none objection=yes character=named ending=E1 cta=share -->
