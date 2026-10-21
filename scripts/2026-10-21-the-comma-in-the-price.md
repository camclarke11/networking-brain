# The comma in the price

**Format:** F7 Brand X-ray
**Tier:** 1 (every founder writes a price this week, and the fix takes ten seconds)
**Situation:** writing the price on your website, menu or sales page
**A vs B:** $1,499.00 with a dollar sign → 1499, short, no comma, no cents
**Length:** 152 words ≈ 52s (at 175 wpm)
**Hook code:** N11 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Price and package

---

## TITLE / COVER OPTIONS
1. Delete one comma, sell for more
2. Why $1499 feels cheaper than $1,499
3. Your price is too long

---

## HOOK OPTIONS
**A (used, N11):** Take the comma out of your price, and it looks cheaper.
**B (N11):** $1,499 and $1499 are the same price. Your brain disagrees.
**C (N10):** Same menu. Same prices. No dollar signs. People spent more.

---

## SCRIPT

Take the comma out of your price, and it looks cheaper.
$1,499 and $1499 are the same price.
Your brain doesn't think so.

Here's the trick.
You read prices in your head, even when you don't say them.
One thousand, four hundred and ninety nine.
Fourteen ninety nine.

In 2012, researchers Keith Coulter, Pilsik Choi and Kent Monroe found that the longer a price sounds, the bigger it feels.
A comma makes it sound longer.
So do cents.

But it gets weirder.
Cornell researchers gave diners the same menu three ways.
Dollar signs, words, or just the numbers.
With just the numbers, people spent about eight percent more.
The dollar sign reminds you you're paying.

So if you sell anything, write your price short.
No comma, no cents, no dollar sign if you can get away with it.

Send this to the friend whose price list looks like a tax form.

---

## ELEVENLABS

```text
[confident] Take the comma out of your price, and it looks cheaper. $1,499 and $1499 are the same price. [chuckles] Your brain doesn't think so. [short pause] Here's the trick. [thoughtful] You read prices in your head, even when you don't say them. [matter-of-fact] One thousand, four hundred and ninety nine. Fourteen ninety nine. [serious] In 2012, researchers Keith Coulter, Pilsik Choi and Kent Monroe found that the longer a price sounds, the bigger it feels. A comma makes it sound longer. So do cents. [curious] But it gets weirder. Cornell researchers gave diners the same menu three ways. Dollar signs, words, or just the numbers. [excited] With just the numbers, people spent about eight percent more. The dollar sign reminds you you're paying. [confident] So if you sell anything, write your price short. No comma, no cents, no dollar sign if you can get away with it. [playful] Send this to the friend whose price list looks like a tax form.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "A price is a train of chunky letter blocks that rolls across the screen. Every comma, cent and dollar sign is an extra carriage, and the longer the train, the heavier it sinks into a set of scales. Take carriages off and it floats up.",
    "why": "The lesson is that a price feels as big as it sounds. Seeing the spoken syllables as carriages that weigh the price down makes 'shorter feels cheaper' obvious."
  },
  "names": {
    "friend": "Jay"
  },
  "shots": [
    {
      "id": 1,
      "lines": [
        1,
        3
      ],
      "title": "Two prices",
      "what_we_see": "Two identical price tags hang side by side in white space. One reads $1,499, the other 1499. On 'comma' the comma on the left tag pops off and bounces away. Both tags are lowered onto a set of scales, and the one with the comma sinks.",
      "camera": "Straight on, slow push in",
      "transition_in": "cold open",
      "cast": [],
      "uses": [
        "void",
        "price_tag"
      ],
      "new": [
        "balance_scales"
      ],
      "cues": [
        {
          "word": "comma",
          "what": "the comma pops off one tag"
        },
        {
          "word": "same",
          "what": "an equals sign drops between the tags"
        },
        {
          "word": "brain",
          "what": "the scales tip, the comma tag sinks"
        },
        {
          "word": "$1,499",
          "what": "the comma tag swings in"
        },
        {
          "word": "$1499",
          "what": "the comma-free tag swings in"
        },
        {
          "word": "cheaper",
          "what": "the comma-free tag lifts a little"
        },
        {
          "word": "are",
          "what": "an equals sign starts to draw between the tags"
        }
      ],
      "on_screen": [
        {
          "type": "big_text",
          "text": "Delete one comma. Sell for more.",
          "at": "Take"
        }
      ]
    },
    {
      "id": 2,
      "lines": [
        4,
        7
      ],
      "title": "How it sounds",
      "what_we_see": "The $1,499 tag unrolls into a long train of block carriages, one per spoken syllable, chugging across the screen. Then 1499 rolls past as a short train of three.",
      "camera": "Side-on tracking with the trains",
      "transition_in": "cut",
      "cast": [
        "you"
      ],
      "uses": [
        "void"
      ],
      "new": [
        "syllable_train"
      ],
      "cues": [
        {
          "word": "head",
          "what": "a thought bubble opens above you"
        },
        {
          "word": "thousand",
          "what": "the long train rolls out of it"
        },
        {
          "word": "Fourteen",
          "what": "the short train zips past"
        }
      ],
      "on_screen": []
    },
    {
      "id": 3,
      "lines": [
        8,
        10
      ],
      "title": "The study",
      "what_we_see": "The Professor stands by the scales. The long train is loaded onto one side, the short one onto the other. The long side sinks. A cents carriage is added and it sinks further.",
      "camera": "Medium, the Professor and the scales",
      "transition_in": "push",
      "cast": [
        "professor"
      ],
      "uses": [
        "balance_scales",
        "syllable_train"
      ],
      "new": [],
      "cues": [
        {
          "word": "bigger",
          "what": "the long side sinks"
        },
        {
          "word": "cents",
          "what": "a .00 carriage clanks on and it sinks further"
        },
        {
          "word": "longer",
          "what": "the long train couples onto the scale"
        },
        {
          "word": "comma",
          "what": "a comma carriage clanks on"
        }
      ],
      "on_screen": [
        {
          "type": "study_card",
          "year": 2012,
          "who": "Coulter, Choi & Monroe",
          "finding": "The longer a price sounds, the bigger it feels",
          "at": "Coulter"
        }
      ]
    },
    {
      "id": 4,
      "lines": [
        11,
        15
      ],
      "title": "Three menus",
      "what_we_see": "Three small white menu cards on a restaurant table. One shows $18.00, one says eighteen dollars, one just 18. The Professor taps the plain one and a small stack of coins rises beside it, taller than the others.",
      "camera": "Top-down on the table, then tilt to the Professor",
      "transition_in": "cut",
      "cast": [
        "professor"
      ],
      "uses": [
        "void"
      ],
      "new": [],
      "cues": [
        {
          "word": "weirder",
          "what": "the cards slide in one by one"
        },
        {
          "word": "numbers",
          "what": "the plain card lifts and glows"
        },
        {
          "word": "eight",
          "what": "its coin stack rises highest"
        },
        {
          "word": "menu",
          "what": "three menu cards slide in"
        },
        {
          "word": "reminds",
          "what": "the dollar sign card greys out"
        }
      ],
      "on_screen": [
        {
          "type": "study_card",
          "year": 2009,
          "who": "Yang, Kimes & Sessarego (Cornell)",
          "finding": "Diners spent about 8% more when menus had no dollar signs",
          "at": "Cornell"
        }
      ]
    },
    {
      "id": 5,
      "lines": [
        16,
        17
      ],
      "title": "Write it short",
      "screenshot": true,
      "what_we_see": "You at a laptop, your own price on the screen as a long train: $1,499.00. You delete the carriages one by one, comma, cents, dollar sign, and the tag floats up off the scales, glowing yellow.",
      "camera": "Over the shoulder onto the screen, then a push to the floating tag",
      "transition_in": "cut",
      "cast": [
        "you"
      ],
      "uses": [
        "laptop",
        "price_tag",
        "syllable_train",
        "gold_glow"
      ],
      "new": [],
      "cues": [
        {
          "word": "short",
          "what": "the first carriage is deleted"
        },
        {
          "word": "cents",
          "what": "the cents carriage pops off"
        },
        {
          "word": "dollar",
          "what": "the tag floats up and glows"
        }
      ],
      "on_screen": [
        {
          "type": "x_check",
          "wrong": "$1,499.00",
          "right": "1499",
          "at": "So"
        }
      ]
    },
    {
      "id": 6,
      "lines": [
        18,
        18
      ],
      "title": "Jay",
      "what_we_see": "Jay's price list unrolls like a long receipt off the edge of his counter and across the floor, crammed with dollar signs, commas and cents.",
      "camera": "Wide, tracking the receipt as it unrolls",
      "transition_in": "whip pan",
      "cast": [
        "friend"
      ],
      "uses": [
        "drinks_table"
      ],
      "new": [],
      "cues": [
        {
          "word": "tax",
          "what": "the receipt hits the floor and keeps going"
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
      "id": "balance_scales",
      "kind": "prop",
      "name": "Balance scales",
      "description": "An old-fashioned two-pan balance in white and brushed steel, about chest height on a character. The pans tip smoothly when weight is added and can bounce when something lifts off.",
      "reuse": "Comparisons, value, fairness, pricing"
    },
    {
      "id": "syllable_train",
      "kind": "effect",
      "name": "Syllable train",
      "description": "A short or long train of chunky rounded block carriages, each with one syllable or symbol of a spoken price printed on it, that rolls in, couples, and loses carriages that pop off with a bounce.",
      "reuse": "Anything about how long something sounds: prices, names, taglines"
    }
  ]
}
```

---

## CAPTION


Two prices, the same number. Why does one sell more?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #pricing #ecommerce #marketing

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| 2012, Keith Coulter, Pilsik Choi and Kent Monroe: prices with more syllables when read (commas, cents) are perceived as larger | Coulter, Choi & Monroe, "Comma N' Cents in Pricing", Journal of Consumer Psychology 22(3), 2012. Summaries: [strategy+business](https://strategy-business.com/article/re00212), [Nick Kolenda](https://nickkolenda.com/tactics/prices-commas) | Confirmed (from summaries; the full text is paywalled) |
| Cornell researchers gave diners menus with dollar signs, words or numerals only. With numerals only they spent more, about 8% ($5.55) more than with dollar signs | Yang, Kimes & Sessarego (2009), International Journal of Hospitality Management 28(1). [Cornell news](https://news.cornell.edu/node/273666), [paper on eCommons](https://ecommons.cornell.edu/bitstream/1813/72131/1/Kimes14_Menu_price.pdf) | Confirmed |
| "The dollar sign reminds you you're paying" | Sheryl Kimes's explanation (the "pain of paying"), per Cornell. A hypothesis, not tested in the study | Stated as the explanation |

### ⚠️ Check before posting
- Cornell: the 8% gap is numerals-only versus dollar signs. Numerals versus spelled-out words wasn't significant, and it was one restaurant at lunch. The script says "about eight percent more", which matches.
- "The dollar sign reminds you you're paying" is the researchers' explanation, not a measured result. Keep it short, as written.
- Remake of @decoyreport's comma post (314k). Our wording, our examples, our sign-off, and a different second proof (Cornell). Their lines aren't reused.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=pricing tier=1 format=F7 hook=N11 named_tool=no proof=study objection=no character=none ending=E6 cta=share -->
