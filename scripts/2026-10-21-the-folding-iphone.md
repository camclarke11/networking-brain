# The folding iPhone

**Format:** F7 Brand X-ray
**Tier:** 1 (the biggest product launch of the season, a pricing move any business with more than one package can use)
**Situation:** Apple's September 2026 lineup: a $1,999 folding phone, and a quiet $100 rise on the Pros
**A vs B:** show your cheapest option first → show the premium one first, so your best seller looks reasonable
**Length:** 159 words ≈ 55s (at 175 wpm)
**Hook code:** N9 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Price and package

---

## TITLE / COVER OPTIONS
1. Apple's folding iPhone isn't there to sell
2. The $1,999 phone that sells the $1,299 one
3. Why Apple shows you the expensive one first

---

## HOOK OPTIONS
**A (used, N9):** Apple's folding iPhone isn't there to sell. It's there to make the others look cheap.
**B (N11):** $1,999 for a phone. It worked even if you didn't buy it.
**C (N9):** Apple raised the price of the iPhone Pro. Almost nobody noticed. Here's why.

---

## SCRIPT

Apple's folding iPhone isn't there to sell.
It's there to make the others look cheap.

In September, Apple launched its first folding phone, the iPhone Duo.
$1,999.
At the same event, the iPhone 18 Pro and Pro Max both went up a hundred dollars.
But the fold got the spotlight.

Here's the trick.
It's called anchoring.
The first big number you see becomes your ruler.

In 1974, psychologists Tversky and Kahneman spun a rigged wheel that stopped on 10 or 65.
Then they asked what share of UN countries were in Africa.
People who saw 10 guessed 25 percent.
People who saw 65 guessed 45.
A $1,999 phone moves your answer too.

And it does a second job.
It gives the price rise somewhere to hide.

So if you sell anything, show your premium option first.
Your best seller looks reasonable next to it.

Send this to the friend who hides his best package at the bottom.

---

## ELEVENLABS

```text
[confident] Apple's folding iPhone isn't there to sell. It's there to make the others look cheap. [matter-of-fact] In September, Apple launched its first folding phone, the iPhone Duo. $1,999. At the same event, the iPhone 18 Pro and Pro Max both went up a hundred dollars. [sarcastic] But the fold got the spotlight. [short pause] Here's the trick. It's called anchoring. [thoughtful] The first big number you see becomes your ruler. [serious] In 1974, psychologists Tversky and Kahneman spun a rigged wheel that stopped on 10 or 65. Then they asked what share of UN countries were in Africa. People who saw 10 guessed 25 percent. [excited] People who saw 65 guessed 45. A $1,999 phone moves your answer too. [curious] And it does a second job. It gives the price rise somewhere to hide. [confident] So if you sell anything, show your premium option first. Your best seller looks reasonable next to it. [playful] Send this to the friend who hides his best package at the bottom.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Every price is measured against a giant ruler. The first number you see plants itself as the top of the ruler, and everything after it is measured from there, so the next price looks short.",
    "why": "Anchoring means the first number becomes your measuring stick. Making the stick literal shows why a $1,299 phone looks small next to a $1,999 one."
  },
  "names": {
    "friend": "Jay"
  },
  "shots": [
    {
      "id": 1,
      "lines": [
        1,
        2
      ],
      "title": "Not for sale",
      "what_we_see": "A white phone on a plinth unfolds like a book, glowing. Beside it, a normal phone on a smaller plinth. A tall ruler rises behind the folding phone, and the normal phone suddenly looks short against it.",
      "camera": "Low angle, slow push",
      "transition_in": "cold open",
      "cast": [],
      "uses": [
        "void",
        "phone"
      ],
      "new": [
        "folding_phone",
        "measuring_ruler"
      ],
      "cues": [
        {
          "word": "folding",
          "what": "the phone unfolds"
        },
        {
          "word": "cheap",
          "what": "the ruler rises and the normal phone looks short"
        }
      ],
      "on_screen": [
        {
          "type": "big_text",
          "text": "Apple's folding iPhone isn't there to sell",
          "at": "Apple's"
        }
      ]
    },
    {
      "id": 2,
      "lines": [
        3,
        6
      ],
      "title": "The lineup",
      "what_we_see": "A row of phones on plinths with price tags. The folding one lands with a $1,999 tag and a spotlight. Behind it, the two Pro tags quietly tick up by $100 in the shadow.",
      "camera": "Side-on dolly along the row",
      "transition_in": "whip pan",
      "cast": [],
      "uses": [
        "void",
        "folding_phone",
        "phone",
        "price_tag"
      ],
      "new": [],
      "cues": [
        {
          "word": "Duo",
          "what": "the folding phone lands in a spotlight"
        },
        {
          "word": "hundred",
          "what": "the Pro tag ticks up, unlit"
        },
        {
          "word": "spotlight",
          "what": "the spotlight widens on the fold, the Pros fade to grey"
        },
        {
          "word": "event",
          "what": "the Pro tags appear in the shadow"
        },
        {
          "word": "Max",
          "what": "the Pro Max tag ticks up"
        }
      ],
      "on_screen": [
        {
          "type": "stamp",
          "text": "$1,999",
          "at": "$1,999"
        }
      ]
    },
    {
      "id": 3,
      "lines": [
        7,
        9
      ],
      "title": "The ruler",
      "what_we_see": "You stand in front of the giant ruler. A $1,999 tag hammers itself in at the top. Every tag after it is measured from there, and reads short.",
      "camera": "Medium, you and the ruler",
      "transition_in": "cut",
      "cast": [
        "you"
      ],
      "uses": [
        "measuring_ruler",
        "price_tag"
      ],
      "new": [],
      "cues": [
        {
          "word": "anchoring",
          "what": "the top tag hammers into the ruler"
        },
        {
          "word": "ruler",
          "what": "the ruler's marks light up from that top tag"
        }
      ],
      "on_screen": []
    },
    {
      "id": 4,
      "lines": [
        10,
        14
      ],
      "title": "The wheel",
      "what_we_see": "The Professor spins a big rigged prize wheel. It lands on 10 for one figure and on 65 for another. Each writes a guess on a card. The 65 card's guess is far higher.",
      "camera": "Wide on the wheel, then over the two figures' cards",
      "transition_in": "push",
      "cast": [
        "professor",
        "stranger_a",
        "stranger_b"
      ],
      "uses": [
        "void"
      ],
      "new": [
        "prize_wheel"
      ],
      "cues": [
        {
          "word": "wheel",
          "what": "the wheel spins"
        },
        {
          "word": "25",
          "what": "the first card reads 25%"
        },
        {
          "word": "45",
          "what": "the second card reads 45%"
        },
        {
          "word": "65",
          "what": "the wheel lands on 65"
        },
        {
          "word": "Africa",
          "what": "a simple map card flips up"
        },
        {
          "word": "$1,999",
          "what": "the folding phone's tag hammers into the ruler"
        }
      ],
      "on_screen": [
        {
          "type": "study_card",
          "year": 1974,
          "who": "Amos Tversky & Daniel Kahneman",
          "finding": "A random spin of 10 or 65 moved people's guesses from 25% to 45%",
          "at": "1974"
        }
      ]
    },
    {
      "id": 5,
      "lines": [
        15,
        16
      ],
      "title": "Somewhere to hide",
      "what_we_see": "The spotlight on the folding phone is so bright that the Pro's rising tag behind it vanishes into its shadow.",
      "camera": "Locked-off, then a slow pan into the shadow",
      "transition_in": "cut",
      "cast": [],
      "uses": [
        "folding_phone",
        "price_tag",
        "colour_drain"
      ],
      "new": [],
      "cues": [
        {
          "word": "second",
          "what": "the camera pans into the shadow"
        },
        {
          "word": "hide",
          "what": "the Pro's tag ducks behind the folding phone"
        }
      ],
      "on_screen": []
    },
    {
      "id": 6,
      "lines": [
        17,
        18
      ],
      "title": "Premium first",
      "screenshot": true,
      "what_we_see": "You lay out three package cards on a white counter. You place the premium one first and it plants the ruler. The middle one, your real best seller, looks small against it and glows yellow as a customer taps it.",
      "camera": "Top-down on the counter, then a push on the glowing card",
      "transition_in": "cut",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [
        "drinks_table",
        "measuring_ruler",
        "gold_glow"
      ],
      "new": [],
      "cues": [
        {
          "word": "premium",
          "what": "the premium card goes down first and the ruler rises"
        },
        {
          "word": "reasonable",
          "what": "the middle card glows and gets tapped"
        }
      ],
      "on_screen": [
        {
          "type": "x_check",
          "wrong": "Cheapest option first",
          "right": "Premium option first",
          "at": "So"
        }
      ]
    },
    {
      "id": 7,
      "lines": [
        19,
        19
      ],
      "title": "Jay",
      "what_we_see": "Jay's website as a long scrolling page on a laptop. His best package sits at the very bottom, under everything, while a visitor's cursor gives up and closes the tab.",
      "camera": "Over Jay's shoulder onto the laptop",
      "transition_in": "whip pan",
      "cast": [
        "friend"
      ],
      "uses": [
        "laptop"
      ],
      "new": [],
      "cues": [
        {
          "word": "bottom",
          "what": "the page scrolls to the buried package as the tab closes"
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
      "id": "folding_phone",
      "kind": "prop",
      "name": "Folding phone",
      "description": "A white phone that opens like a small book into a wide glowing screen, no logos, about the size of a character's hand. Opens, closes and sits on a plinth under a spotlight.",
      "reuse": "Phone launches, flagships, premium options"
    },
    {
      "id": "measuring_ruler",
      "kind": "prop",
      "name": "Giant ruler",
      "description": "A tall white ruler about twice a character's height with black tick marks, standing upright. It can rise out of the floor, and a price tag can hammer into its top so every mark is read from there.",
      "reuse": "Anchoring, comparisons, expectations"
    },
    {
      "id": "prize_wheel",
      "kind": "prop",
      "name": "Prize wheel",
      "description": "A big upright game-show wheel in white and greys with numbered segments and a yellow pointer, about a character's height. It spins, slows and lands on a chosen number.",
      "reuse": "Random numbers, chance, experiments, anchoring"
    }
  ]
}
```

---

## CAPTION


Why would a company show you the thing you'll never buy first?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #apple #iphone #pricing

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| September 2026: Apple launched its first folding phone, the iPhone Duo, from $1,999 | [CNBC live coverage, 9 Sept 2026](https://www.cnbc.com/2026/09/09/apple-event-today-live-updates.html), [GSMArena pricing overview](https://www.gsmarena.com/iphone_18_pro_and_duo_pricing_overview-news-74546.php) | Confirmed |
| The iPhone 18 Pro went up $100 (to $1,199), and so did the Pro Max (to $1,299) | Same sources | Confirmed |
| 1974, Tversky and Kahneman: a rigged wheel stopping on 10 or 65; median estimates of the share of African countries in the UN were 25% and 45% | Tversky & Kahneman, "Judgment under Uncertainty: Heuristics and Biases", Science (1974). See [Anchoring effect](https://en.wikipedia.org/wiki/Anchoring_effect) | Confirmed |

### ⚠️ Check before posting
- "The phone that folds got the spotlight" is a fair read of the launch coverage, not a measured claim.
- "It gives the price rise somewhere to hide" is our interpretation of the timing. Apple hasn't said that, so keep it framed as the trick, not as Apple's intent.
- Tversky and Kahneman's 25% and 45% figures are medians. "Guessed 25 percent" is fine for speech.
- Like "The car that flies", this is an anchoring script. Don't post them back to back.
- Remake of @decoyreport's folding-iPhone post (157k). Our wording, examples, study and sign-off. Their lines aren't reused.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=pricing tier=1 format=F7 hook=N9 named_tool=no proof=both objection=no character=none ending=E6 cta=share -->
