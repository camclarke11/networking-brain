# The second question

**Format:** F3 Exact Words
**Tier:** 1 (a live event conversation, with the exact line to say)
**Situation:** a few minutes into a conversation by the drinks, right after they answer your first question
**A vs B:** jump to the next stock question → ask about the answer they just gave
**Length:** 165 words ≈ 57s (at 175 wpm)
**Hook code:** N6 (bold claim, set in an event) · **Ending code:** E1 · **Named tool:** none (the "trade" is a light frame, not a coined name)

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

## STORYBOARD

```json
{
  "version": 1,
  "names": {
    "stranger_a": "Priya",
    "friend": "Jay"
  },
  "shots": [
    {
      "line": 1,
      "text": "Your second question at an event matters more than your first.",
      "set": "event_hall",
      "camera": "push_in",
      "characters": [
        {
          "id": "you",
          "action": "hold_drink",
          "expression": "nervous",
          "position": "center"
        },
        {
          "id": "crowd",
          "action": "idle",
          "expression": "neutral",
          "position": "background"
        }
      ],
      "overlay": {
        "type": "big_text",
        "text": "Your second question matters more"
      }
    },
    {
      "line": 2,
      "text": "Say you meet Priya by the drinks.",
      "set": "drinks_table",
      "camera": "medium",
      "characters": [
        {
          "id": "you",
          "action": "wave",
          "expression": "happy",
          "position": "left"
        },
        {
          "id": "stranger_a",
          "action": "hold_drink",
          "expression": "neutral",
          "position": "right"
        }
      ],
      "overlay": {
        "type": "label",
        "text": "Priya",
        "target": "stranger_a"
      }
    },
    {
      "line": 3,
      "text": "You ask what she's working on.",
      "set": "drinks_table",
      "camera": "over_shoulder",
      "characters": [
        {
          "id": "you",
          "action": "talk",
          "expression": "interested",
          "position": "left"
        },
        {
          "id": "stranger_a",
          "action": "listen",
          "expression": "neutral",
          "position": "right"
        }
      ],
      "overlay": {
        "type": "quote_bubble",
        "speaker": "you",
        "text": "What are you working on right now?"
      }
    },
    {
      "line": 4,
      "text": "She says she's launching a skincare brand.",
      "set": "drinks_table",
      "camera": "close",
      "characters": [
        {
          "id": "stranger_a",
          "action": "talk",
          "expression": "happy",
          "position": "center"
        }
      ],
      "overlay": null
    },
    {
      "line": 5,
      "text": "You go, nice, how do you know the host?",
      "set": "drinks_table",
      "camera": "medium",
      "characters": [
        {
          "id": "you",
          "action": "talk",
          "expression": "neutral",
          "position": "left"
        },
        {
          "id": "stranger_a",
          "action": "listen",
          "expression": "awkward",
          "position": "right"
        }
      ],
      "overlay": {
        "type": "quote_bubble",
        "speaker": "you",
        "text": "Nice. How do you know the host?"
      }
    },
    {
      "line": 6,
      "text": "Interview over.",
      "set": "drinks_table",
      "camera": "pull_out",
      "characters": [
        {
          "id": "you",
          "action": "hold_drink",
          "expression": "awkward",
          "position": "left"
        },
        {
          "id": "stranger_a",
          "action": "look_away",
          "expression": "bored",
          "position": "right"
        }
      ],
      "overlay": {
        "type": "big_text",
        "text": "Interview over"
      }
    },
    {
      "line": 7,
      "text": "You just showed her you weren't listening.",
      "set": "void",
      "camera": "close",
      "characters": [
        {
          "id": "you",
          "action": "cringe",
          "expression": "awkward",
          "position": "center"
        }
      ],
      "overlay": null
    },
    {
      "line": 8,
      "text": "So ask about her answer instead.",
      "set": "void",
      "camera": "medium",
      "characters": [
        {
          "id": "you",
          "action": "point",
          "expression": "confident",
          "position": "center"
        }
      ],
      "overlay": {
        "type": "x_check",
        "wrong": "So how do you know the host?",
        "right": "What made you start that?"
      }
    },
    {
      "line": 9,
      "text": "A skincare brand? What made you start that?",
      "set": "drinks_table",
      "camera": "over_shoulder",
      "characters": [
        {
          "id": "you",
          "action": "lean_in",
          "expression": "interested",
          "position": "left"
        },
        {
          "id": "stranger_a",
          "action": "listen",
          "expression": "surprised",
          "position": "right"
        }
      ],
      "overlay": {
        "type": "quote_bubble",
        "speaker": "you",
        "text": "A skincare brand? What made you start that?"
      }
    },
    {
      "line": 10,
      "text": "Now she's telling you a story, not filling a silence.",
      "set": "drinks_table",
      "camera": "push_in",
      "characters": [
        {
          "id": "stranger_a",
          "action": "talk",
          "expression": "happy",
          "position": "right"
        },
        {
          "id": "you",
          "action": "nod",
          "expression": "interested",
          "position": "left"
        }
      ],
      "overlay": null
    },
    {
      "line": 11,
      "text": "You're thinking, won't that feel like an interrogation?",
      "set": "void",
      "camera": "close",
      "characters": [
        {
          "id": "you",
          "action": "think",
          "expression": "nervous",
          "position": "center"
        }
      ],
      "overlay": null
    },
    {
      "line": 12,
      "text": "Not if you trade.",
      "set": "void",
      "camera": "medium",
      "characters": [
        {
          "id": "you",
          "action": "thumbs_up",
          "expression": "confident",
          "position": "center"
        }
      ],
      "overlay": {
        "type": "big_text",
        "text": "Trade, don't interrogate"
      }
    },
    {
      "line": 13,
      "text": "She answers.",
      "set": "drinks_table",
      "camera": "medium",
      "characters": [
        {
          "id": "stranger_a",
          "action": "talk",
          "expression": "happy",
          "position": "right"
        },
        {
          "id": "you",
          "action": "listen",
          "expression": "interested",
          "position": "left"
        }
      ],
      "overlay": {
        "type": "tool_card",
        "title": "Trade",
        "items": [
          "She answers",
          "You share one small thing",
          "You dig into what she said"
        ],
        "highlight": 0
      }
    },
    {
      "line": 14,
      "text": "You share one small thing.",
      "set": "drinks_table",
      "camera": "medium",
      "characters": [
        {
          "id": "you",
          "action": "talk",
          "expression": "happy",
          "position": "left"
        },
        {
          "id": "stranger_a",
          "action": "laugh",
          "expression": "happy",
          "position": "right"
        }
      ],
      "overlay": {
        "type": "tool_card",
        "title": "Trade",
        "items": [
          "She answers",
          "You share one small thing",
          "You dig into what she said"
        ],
        "highlight": 1
      }
    },
    {
      "line": 15,
      "text": "Then you dig into what she said.",
      "set": "drinks_table",
      "camera": "push_in",
      "characters": [
        {
          "id": "you",
          "action": "lean_in",
          "expression": "interested",
          "position": "left"
        },
        {
          "id": "stranger_a",
          "action": "talk",
          "expression": "happy",
          "position": "right"
        }
      ],
      "overlay": {
        "type": "tool_card",
        "title": "Trade",
        "items": [
          "She answers",
          "You share one small thing",
          "You dig into what she said"
        ],
        "highlight": 2
      }
    },
    {
      "line": 16,
      "text": "Harvard researchers looked at over 2,000 speed dates.",
      "set": "void",
      "camera": "medium",
      "characters": [
        {
          "id": "professor",
          "action": "talk",
          "expression": "confident",
          "position": "center"
        }
      ],
      "overlay": {
        "type": "study_card",
        "year": 2017,
        "who": "Huang, Yeomans, Brooks, Minson and Gino",
        "finding": "Over 2,000 speed-dating conversations analysed"
      }
    },
    {
      "line": 17,
      "text": "The people who asked more follow-up questions were liked more.",
      "set": "void",
      "camera": "close",
      "characters": [
        {
          "id": "professor",
          "action": "point",
          "expression": "confident",
          "position": "center"
        }
      ],
      "overlay": {
        "type": "study_card",
        "year": 2017,
        "who": "Huang, Yeomans, Brooks, Minson and Gino",
        "finding": "More follow-up questions, more liking"
      }
    },
    {
      "line": 18,
      "text": "And the best askers got the most second dates.",
      "set": "coffee_shop",
      "camera": "medium",
      "characters": [
        {
          "id": "stranger_b",
          "action": "laugh",
          "expression": "happy",
          "position": "left"
        },
        {
          "id": "stranger_c",
          "action": "smile",
          "expression": "happy",
          "position": "right"
        }
      ],
      "overlay": null
    },
    {
      "line": 19,
      "text": "But here's the bit that matters.",
      "set": "event_hall",
      "camera": "pan",
      "characters": [
        {
          "id": "you",
          "action": "walk_in",
          "expression": "confident",
          "position": "center"
        },
        {
          "id": "crowd",
          "action": "idle",
          "expression": "neutral",
          "position": "background"
        }
      ],
      "overlay": null
    },
    {
      "line": 20,
      "text": "Nobody remembers your first question.",
      "set": "event_hall",
      "camera": "wide",
      "characters": [
        {
          "id": "crowd",
          "action": "talk",
          "expression": "neutral",
          "position": "background"
        }
      ],
      "overlay": null
    },
    {
      "line": 21,
      "text": "Everybody asks that one.",
      "set": "event_hall",
      "camera": "medium",
      "characters": [
        {
          "id": "stranger_b",
          "action": "talk",
          "expression": "bored",
          "position": "left"
        },
        {
          "id": "stranger_c",
          "action": "listen",
          "expression": "bored",
          "position": "right"
        }
      ],
      "overlay": null
    },
    {
      "line": 22,
      "text": "They remember the one that proved you were listening.",
      "set": "drinks_table",
      "camera": "push_in",
      "characters": [
        {
          "id": "stranger_a",
          "action": "handshake",
          "expression": "happy",
          "position": "right"
        },
        {
          "id": "you",
          "action": "handshake",
          "expression": "confident",
          "position": "left"
        }
      ],
      "overlay": {
        "type": "big_text",
        "text": "Prove you were listening"
      }
    },
    {
      "line": 23,
      "text": "Send this to the friend who asks one question and checks his phone.",
      "set": "event_hall",
      "camera": "medium",
      "characters": [
        {
          "id": "friend",
          "action": "check_phone",
          "expression": "bored",
          "position": "center"
        }
      ],
      "overlay": {
        "type": "label",
        "text": "Jay",
        "target": "friend"
      }
    }
  ]
}
```

---

## CAPTION

Your second question matters more than your first.

Anyone can ask "what are you working on?" The question after it is the one people remember, because it proves you heard the answer.

How to trade instead of interrogate:
📍 They answer. Pick one word from their answer and ask about it: "A skincare brand? What made you start that?"
📍 Share one small thing back. "I almost started something in that space."
📍 Ask about what they just said, not the next thing on your list.

Skip the stock questions that reset the conversation: "How do you know the host?" "So what else is going on?"

Try it on 3 people this week, then come back and tell me who surprised you 👇

Follow, the networking playbook drops soon.

#networking #socialskills #entrepreneur #networkingevent #psychology

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
- Hook is N6, which is untested in the niche. Hook B (N2) is the safer alternative if this underperforms.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=event_conversation tier=1 format=F3 hook=N6 named_tool=no proof=study objection=yes character=named ending=E1 cta=share -->
