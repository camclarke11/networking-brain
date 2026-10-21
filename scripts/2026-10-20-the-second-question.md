# The second question

**Format:** F3 Exact Words
**Tier:** 1 (a live event conversation, with the exact line to say)
**Situation:** a few minutes into a conversation by the drinks, right after they answer your first question
**A vs B:** jump to the next stock question → ask about the answer they just gave
**Length:** 165 words ≈ 57s (at 175 wpm)
**Hook code:** N6 (bold claim, set in an event) · **Ending code:** E1 · **Named tool:** none (the "trade" is a light frame, not a coined name)
**Pillar:** The Move · **Playbook chapter:** Get clients

---

## TITLE / COVER OPTIONS
1. Your second question matters more than your first
2. The question that proves you were listening
3. Stop asking "how do you know the host?"

---

## HOOK OPTIONS
**A (used):** Your second question at an event matters more than your first.
**B (N2):** "So, how do you know the host?" Is the question that ends every good conversation.
**C (N4):** How to make someone at an event actually want to keep talking to you, with one question.

---

## SCRIPT

Your second question at an event matters more than your first.
Say you meet Priya by the drinks.
You ask what she's working on.
She says she's launching a skincare brand.
You go, nice, how do you know the host?
Interview over.
You just showed her you weren't listening.
So ask about her answer instead.
A skincare brand? What made you start that?
Now she's telling you a story, not filling a silence.
You're thinking, won't that feel like an interrogation?
Not if you trade.
She answers.
You share one small thing.
Then you dig into what she said.
Harvard researchers looked at over 2,000 speed dates.
The people who asked more follow-up questions were liked more.
And the best askers got the most second dates.
But here's the bit that matters.
Nobody remembers your first question.
Everybody asks that one.
They remember the one that proved you were listening.
Send this to the friend who asks one question and checks his phone.

---

## ELEVENLABS

```text
[thoughtful] Your second question at an event matters more than your first. Say you meet Priya by the drinks. You ask what she's working on. She says she's launching a skincare brand. You go, nice, how do you know the host? [sighs] Interview over. You just showed her you weren't listening. [confident] So ask about her answer instead. [curious] A skincare brand? What made you start that? Now she's telling you a story, not filling a silence. You're thinking, won't that feel like an interrogation? [chuckles] Not if you trade. She answers. You share one small thing. Then you dig into what she said. [matter-of-fact] Harvard researchers looked at over 2,000 speed dates. The people who asked more follow-up questions were liked more. And the best askers got the most second dates. [short pause] But here's the bit that matters. Nobody remembers your first question. Everybody asks that one. [warm] They remember the one that proved you were listening. [playful] Send this to the friend who asks one question and checks his phone.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Every answer drops a small glowing door between you. A stock question walks straight past it. A follow-up question opens it, and you step into their story.",
    "why": "The lesson is that their answer is an opening. The door makes that literal, so the viewer sees the missed chance and the right move without anything being explained.",
    "library_metaphor": "answer_door"
  },
  "names": {
    "stranger_a": "Priya",
    "friend": "Jay"
  },
  "shots": [
    {
      "id": 1,
      "lines": [
        1,
        1
      ],
      "title": "Two cards",
      "what_we_see": "A freeze-frame in the busy event hall. You hold two speech bubbles like playing cards, marked 1 and 2. The 2 starts to glow gold, then the 1 crumbles to dust in your hand.",
      "camera": "Slow push in on you through the frozen crowd",
      "transition_in": "cold open",
      "cast": [
        "you",
        "crowd"
      ],
      "uses": [
        "event_hall",
        "freeze_frame",
        "gold_glow"
      ],
      "new": [
        "question_cards"
      ],
      "cues": [
        {
          "word": "second",
          "what": "card 2 glows gold"
        },
        {
          "word": "first",
          "what": "card 1 crumbles to dust"
        }
      ],
      "on_screen": [
        {
          "type": "big_text",
          "text": "Your 2nd question matters more"
        }
      ]
    },
    {
      "id": 2,
      "lines": [
        2,
        4
      ],
      "title": "The door appears",
      "what_we_see": "The room unfreezes into the warm drinks table. You and Priya chat with drinks in hand. As she says skincare brand, a small glowing door rises out of the table between you, with a tiny bottle painted on it.",
      "camera": "Medium two-shot, easing in as the door rises",
      "transition_in": "whip pan",
      "cast": [
        "you",
        "stranger_a",
        "crowd"
      ],
      "uses": [
        "drinks_table",
        "drink_glass",
        "whip_pan"
      ],
      "new": [
        "glowing_door"
      ],
      "cues": [
        {
          "word": "skincare",
          "what": "the door rises out of the table"
        }
      ],
      "on_screen": [
        {
          "type": "label",
          "text": "Priya",
          "target": "stranger_a",
          "at": "Priya"
        },
        {
          "type": "quote_bubble",
          "speaker": "you",
          "text": "What are you working on?",
          "at": "working"
        }
      ]
    },
    {
      "id": 3,
      "lines": [
        5,
        6
      ],
      "title": "Walking past the door",
      "what_we_see": "You glance straight past the glowing door and ask your stock question. The door shrinks and shuts with a puff of smoke. The room freezes, Priya drains to grey-blue and a loading spinner turns above her head.",
      "camera": "Medium two-shot, then a slow pull-out as the room freezes",
      "transition_in": "cut",
      "cast": [
        "you",
        "stranger_a",
        "crowd"
      ],
      "uses": [
        "drinks_table",
        "glowing_door",
        "freeze_frame",
        "colour_drain"
      ],
      "new": [
        "loading_spinner"
      ],
      "cues": [
        {
          "word": "host",
          "what": "the door shuts with a puff of smoke"
        },
        {
          "word": "over",
          "what": "the room freezes and drains to grey-blue"
        }
      ],
      "on_screen": [
        {
          "type": "quote_bubble",
          "speaker": "you",
          "text": "Nice. How do you know the host?"
        },
        {
          "type": "stamp",
          "text": "INTERVIEW OVER",
          "at": "over"
        }
      ],
      "sound": "a game-show wrong buzzer on 'over'"
    },
    {
      "id": 4,
      "lines": [
        7,
        7
      ],
      "title": "Rewind",
      "what_we_see": "The whole frame scrubs backwards like a VHS tape, with tracking lines, back to the moment the door rose out of the table. You wince as it rewinds past you.",
      "camera": "Locked off, the image itself rewinds",
      "transition_in": "none, the rewind starts mid-shot",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [
        "drinks_table",
        "glowing_door"
      ],
      "new": [
        "vhs_rewind"
      ],
      "cues": [
        {
          "word": "showed",
          "what": "the picture starts scrubbing backwards"
        },
        {
          "word": "listening",
          "what": "the rewind lands on the door rising again"
        }
      ],
      "on_screen": [],
      "sound": "tape rewind whirr"
    },
    {
      "id": 5,
      "lines": [
        8,
        10
      ],
      "title": "Through the door",
      "what_we_see": "This time you crouch and open the door. The drinks table folds open like a pop-up book into Priya's world: a kitchen counter at 2am covered in test bottles and handwritten labels. She lights up telling the story, and gold colour floods back into everything.",
      "camera": "Low angle on the door, then a push through it into the kitchen",
      "transition_in": "match cut on the door",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [
        "glowing_door",
        "gold_glow"
      ],
      "new": [
        "night_kitchen_lab"
      ],
      "cues": [
        {
          "word": "ask",
          "what": "you crouch to the door"
        },
        {
          "word": "start",
          "what": "the door swings open and the table folds into the kitchen"
        },
        {
          "word": "story",
          "what": "gold colour floods back"
        }
      ],
      "on_screen": [
        {
          "type": "x_check",
          "wrong": "How do you know the host?",
          "right": "What made you start that?",
          "at": "instead"
        },
        {
          "type": "quote_bubble",
          "speaker": "you",
          "text": "A skincare brand? What made you start that?",
          "at": "skincare"
        }
      ]
    },
    {
      "id": 6,
      "lines": [
        11,
        11
      ],
      "title": "The interrogation",
      "what_we_see": "Hard cut. You're in a police interview room under a swinging lamp, firing questions across a metal table. Priya sweats while an old tape recorder spins.",
      "camera": "Harsh top light, slow handheld drift",
      "transition_in": "hard cut",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [],
      "new": [
        "interrogation_room"
      ],
      "cues": [
        {
          "word": "interrogation",
          "what": "the lamp swings across Priya's face"
        }
      ],
      "on_screen": [],
      "sound": "low hum, tape recorder clicks"
    },
    {
      "id": 7,
      "lines": [
        12,
        15
      ],
      "title": "Ping-pong",
      "what_we_see": "Record scratch. The lamp flips and the interview table becomes a ping-pong table. Each line is one hit in a friendly rally between you and Priya. The ball glows a little more gold with every hit.",
      "camera": "Side-on wide, tracking the ball",
      "transition_in": "the lamp flips into the new set",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [
        "gold_glow"
      ],
      "new": [
        "ping_pong_table"
      ],
      "cues": [
        {
          "word": "trade",
          "what": "the table flips into a ping-pong table"
        },
        {
          "word": "answers",
          "what": "hit one, Priya serves"
        },
        {
          "word": "share",
          "what": "hit two, you return"
        },
        {
          "word": "dig",
          "what": "hit three, the ball blazes gold"
        }
      ],
      "on_screen": [
        {
          "type": "tool_card",
          "title": "Trade",
          "items": [
            "She answers",
            "You share one small thing",
            "You dig into what she said"
          ],
          "highlight": null,
          "at": "answers"
        }
      ],
      "sound": "record scratch on 'trade', then a ping on each hit"
    },
    {
      "id": 8,
      "lines": [
        16,
        18
      ],
      "title": "2,000 tables",
      "what_we_see": "The Professor stands in front of a grid of tiny speed-date tables. The camera pulls back and back to show 2,000 of them. Tables where people asked follow-ups light up warm, and second-date tickets fly out of the brightest third.",
      "camera": "Starts close on the Professor, then a long pull-back to a top-down view",
      "transition_in": "the ping-pong ball flies into the camera",
      "cast": [
        "professor"
      ],
      "uses": [
        "gold_glow"
      ],
      "new": [
        "speed_date_grid"
      ],
      "cues": [
        {
          "word": "2,000",
          "what": "the camera pulls back to reveal the full grid"
        },
        {
          "word": "follow-up",
          "what": "the follow-up tables light up warm"
        },
        {
          "word": "liked",
          "what": "the Professor taps the brightest tables with a pointer"
        },
        {
          "word": "second",
          "what": "second-date tickets fly out of the brightest third"
        }
      ],
      "on_screen": [
        {
          "type": "study_card",
          "year": 2017,
          "who": "Huang, Yeomans, Brooks, Minson and Gino",
          "finding": "Over 2,000 speed-date conversations: follow-up questions meant more liking",
          "at": "Harvard"
        }
      ]
    },
    {
      "id": 9,
      "lines": [
        19,
        22
      ],
      "title": "The fog",
      "screenshot": true,
      "what_we_see": "Back at the event, wide. Everyone's first questions float up as identical grey bubbles and blur into a fog over the room. One gold bubble, your follow-up, drifts across the room to Priya, and she tucks it into her pocket with a smile.",
      "camera": "Wide crane up into the fog, then down onto Priya",
      "transition_in": "the tickets dissolve into bubbles",
      "cast": [
        "you",
        "stranger_a",
        "crowd"
      ],
      "uses": [
        "event_hall",
        "colour_drain",
        "gold_glow"
      ],
      "new": [
        "question_bubbles"
      ],
      "cues": [
        {
          "word": "matters",
          "what": "you step forward through the crowd"
        },
        {
          "word": "nobody",
          "what": "grey bubbles rise from every conversation"
        },
        {
          "word": "everybody",
          "what": "the bubbles merge into a fog"
        },
        {
          "word": "listening",
          "what": "Priya pockets the gold bubble"
        }
      ],
      "on_screen": [
        {
          "type": "big_text",
          "text": "Prove you were listening",
          "at": "proved"
        }
      ]
    },
    {
      "id": 10,
      "lines": [
        23,
        23
      ],
      "title": "Jay",
      "what_we_see": "Jay at a high table, scrolling his phone mid-conversation. Beside him a glowing door has popped up, unnoticed. It glows brighter while he keeps scrolling.",
      "camera": "Medium, slow push in on Jay",
      "transition_in": "cut",
      "cast": [
        "friend",
        "crowd"
      ],
      "uses": [
        "event_hall",
        "phone",
        "glowing_door"
      ],
      "new": [],
      "cues": [
        {
          "word": "phone",
          "what": "the door beside him glows brighter, still unnoticed"
        }
      ],
      "on_screen": [
        {
          "type": "label",
          "text": "Jay",
          "target": "friend",
          "at": "friend"
        }
      ]
    }
  ],
  "new_assets": [
    {
      "id": "answer_door",
      "kind": "metaphor",
      "name": "The answer door",
      "description": "When someone tells you something about themselves, a small glowing door appears between you. Ignoring it shuts it, a follow-up opens it into their world.",
      "reuse": "Any video about listening, follow-ups, curiosity or missed openings"
    },
    {
      "id": "glowing_door",
      "kind": "prop",
      "name": "Glowing door",
      "description": "A small wooden door, knee height next to a character, with a warm gold glow from the gap underneath. It rises from any surface, shrinks and shuts with a puff of smoke, or swings open onto a new set. A small painted icon on it shows what's behind it.",
      "reuse": "The answer door metaphor, any 'opening' or opportunity moment"
    },
    {
      "id": "question_cards",
      "kind": "prop",
      "name": "Question cards",
      "description": "Two speech bubbles held like playing cards, hand sized, marked with big numbers. One can glow gold, the other crumbles to dust.",
      "reuse": "Ranking or comparing lines, first vs second, this vs that"
    },
    {
      "id": "loading_spinner",
      "kind": "effect",
      "name": "Loading spinner",
      "description": "A floating grey loading spinner above a character's head, slowly turning, shown while they're bored or stalled.",
      "reuse": "Any stalled or boring conversation"
    },
    {
      "id": "vhs_rewind",
      "kind": "effect",
      "name": "VHS rewind",
      "description": "The whole frame scrubs backwards with VHS tracking lines and a slight colour wobble, then snaps back to normal at a chosen moment.",
      "reuse": "Showing the do-over, 'let's try that again'"
    },
    {
      "id": "night_kitchen_lab",
      "kind": "set",
      "name": "Night kitchen lab",
      "description": "A small home kitchen at 2am, lit by one warm lamp, the counter covered in test bottles, handwritten labels and a laptop. Feels like someone's first business.",
      "reuse": "Any founder's origin story or side-project moment"
    },
    {
      "id": "interrogation_room",
      "kind": "set",
      "name": "Interrogation room",
      "description": "A dark police interview room with a metal table, two chairs, a swinging overhead lamp and an old tape recorder. Played for comedy, not menace.",
      "reuse": "Asking too many questions, being grilled, awkward pressure"
    },
    {
      "id": "ping_pong_table",
      "kind": "prop",
      "name": "Ping-pong table",
      "description": "A full-size ping-pong table with paddles and a ball that can glow gold, built so the interview table or any table can flip into it.",
      "reuse": "Back-and-forth conversation, give and take, trading"
    },
    {
      "id": "speed_date_grid",
      "kind": "set",
      "name": "Study scale grid",
      "description": "A huge grid of tiny two-person tables seen from above, each one able to light up warm or go grey, with small tickets that can fly out of chosen tables.",
      "reuse": "Showing the size and result of any study with many participants"
    },
    {
      "id": "question_bubbles",
      "kind": "effect",
      "name": "Question bubbles",
      "description": "Speech bubbles that float up from conversations like balloons. Grey ones merge into a fog over the room, a gold one can drift to one person and be pocketed.",
      "reuse": "Forgettable vs memorable lines, small talk, being remembered"
    }
  ]
}
```

---

## CAPTION


Most people ask good questions. So why does nobody remember them?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #networking

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| Harvard researchers analysed over 2,000 speed-dating conversations | [HBS Working Knowledge on Huang, Yeomans, Brooks, Minson and Gino (2017), *Journal of Personality and Social Psychology*](https://www.library.hbs.edu/working-knowledge/asking-questions-can-get-you-a-better-job-or-a-second-date): 110 speed-daters, over 2,000 conversations (data from a 2013 Stanford speed-dating study) | Confirmed |
| People who asked more follow-up questions were liked more | Same source: "In all three studies, people who asked follow-up questions were better liked" | Confirmed |
| The best askers got the most second dates | Same source: the top third of question askers received the most second-date offers | Confirmed |
| "Trade": share something back, don't just ask | Same source: Brooks warns a barrage of questions without self-disclosure "may come across as guarded, or worse, invasive" | Confirmed (supports the objection answer) |

### ⚠️ Check before posting
- "Harvard researchers" is fair (the team was at Harvard) but the speed-dating data came from a Stanford study. Fine as worded; don't say "Harvard speed dates".
- Priya is a one-off stranger name; she isn't a recurring cast member.
- The storyboard invents 10 new assets because the library is new. Most should be reusable (the door, the bubbles, the study grid).
- Hook is N6, which is untested in the niche. Hook B (N2) is the safer alternative if this underperforms.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=event_conversation tier=1 format=F3 hook=N6 named_tool=no proof=study objection=yes character=named ending=E1 cta=share -->
