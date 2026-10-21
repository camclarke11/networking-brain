# The tilted laptop

**Format:** F7 Brand X-ray
**Tier:** 1 (the most-visited store in the world, a trick anyone with a product can use tomorrow)
**Situation:** walking past the laptop table in an Apple Store, every screen at the same slightly wrong angle
**A vs B:** describe the product and wait → get it into their hands before you talk price
**Length:** 150 words ≈ 51s (at 175 wpm)
**Hook code:** N9 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Sell

---

## TITLE / COVER OPTIONS
1. Why Apple tilts every laptop the same way
2. The angle that sells laptops
3. Touch it once and it's yours

---

## HOOK OPTIONS
**A (used, N9):** Apple set every laptop in its stores to the same awkward angle. Every morning.
**B (N10):** Same laptop. Screen tilted a little wrong. More people picked it up.
**C (N9):** Apple wanted you to fix its laptops. On purpose.

---

## SCRIPT

Apple set every laptop in its stores to the same awkward angle.
Every morning.

In 2012, Forbes writer Carmine Gallo reported that staff tilted every screen to about seventy degrees.
Not quite closed.
Not quite right.

Here's the trick.
The angle bugs you, so you reach out and fix it.
Now your hands are on it.

In 2009, researchers Joann Peck and Suzanne Shu found that just touching a product makes people feel like they own it.
And what feels like yours is worth more to you.

That's why ice cream shops hand you a tasting spoon.
Why furniture stores let you sit on every sofa.

So if you sell anything, get it into their hands before you talk price.
Once they've touched it, they're not deciding whether to buy it.
They're deciding whether to give it back.

Send this to the friend who keeps his products behind the counter.

---

## ELEVENLABS

```text
[curious] Apple set every laptop in its stores to the same awkward angle. Every morning. [matter-of-fact] In 2012, Forbes writer Carmine Gallo reported that staff tilted every screen to about seventy degrees. Not quite closed. [chuckles] Not quite right. [short pause] Here's the trick. [thoughtful] The angle bugs you, so you reach out and fix it. Now your hands are on it. [serious] In 2009, researchers Joann Peck and Suzanne Shu found that just touching a product makes people feel like they own it. And what feels like yours is worth more to you. [warm] That's why ice cream shops hand you a tasting spoon. Why furniture stores let you sit on every sofa. [confident] So if you sell anything, get it into their hands before you talk price. Once they've touched it, they're not deciding whether to buy it. [happy] They're deciding whether to give it back. [playful] Send this to the friend who keeps his products behind the counter.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "A thin dotted line runs from every product to the nearest hand. The moment a hand touches the product, the line snaps solid and a small name tag with the person's initial appears on it: it's theirs now.",
    "why": "The lesson is that touching makes people feel they already own it. A name tag appearing on contact turns 'perceived ownership' into a picture."
  },
  "names": {
    "stranger_a": "a shopper",
    "friend": "Jay"
  },
  "shots": [
    {
      "id": 1,
      "lines": [
        1,
        2
      ],
      "title": "The angle",
      "what_we_see": "A long white store table with a row of silver laptops, every screen tilted to exactly the same slightly-too-far-back angle. A thin dotted arc and the number 70° hover over the first one.",
      "camera": "Slow dolly down the row of laptops at table height",
      "transition_in": "cold open",
      "cast": [],
      "uses": [
        "void"
      ],
      "new": [
        "laptop",
        "store_table"
      ],
      "cues": [
        {
          "word": "angle",
          "what": "a dotted angle arc draws over every screen at once"
        },
        {
          "word": "morning",
          "what": "a sunrise light sweeps across the table"
        }
      ],
      "on_screen": [
        {
          "type": "big_text",
          "text": "Apple tilts every laptop the same way"
        }
      ]
    },
    {
      "id": 2,
      "lines": [
        3,
        5
      ],
      "title": "Seventy degrees",
      "what_we_see": "An employee figure walks the table with a phone held flat like a spirit level, nudging each screen to the exact angle. The angle arc reads 70°.",
      "camera": "Side-on, following the employee",
      "transition_in": "cut",
      "cast": [
        "stranger_c"
      ],
      "uses": [
        "laptop",
        "store_table",
        "phone"
      ],
      "new": [],
      "cues": [
        {
          "word": "seventy",
          "what": "the arc snaps to 70°"
        },
        {
          "word": "closed",
          "what": "one screen wobbles half shut"
        }
      ],
      "on_screen": [
        {
          "type": "label",
          "text": "About 70°",
          "target": "stranger_c",
          "at": "Gallo"
        }
      ]
    },
    {
      "id": 3,
      "lines": [
        6,
        8
      ],
      "title": "You fix it",
      "what_we_see": "You walk past, stop, frown at the crooked screen, and push it upright. The moment your hand touches it, the dotted line from the laptop to you snaps solid.",
      "camera": "Over your shoulder, close on the screen and your hand",
      "transition_in": "cut",
      "cast": [
        "you"
      ],
      "uses": [
        "laptop",
        "store_table"
      ],
      "new": [],
      "cues": [
        {
          "word": "bugs",
          "what": "you stop and tilt your head at it"
        },
        {
          "word": "fix",
          "what": "you push the screen upright"
        },
        {
          "word": "hands",
          "what": "the dotted line snaps solid"
        }
      ],
      "on_screen": []
    },
    {
      "id": 4,
      "lines": [
        9,
        10
      ],
      "title": "Mine",
      "what_we_see": "The Professor beside a small display: a mug on a plinth. A hand touches it and a little name tag with a Y appears on it. Its price tag next to it grows.",
      "camera": "Medium two-shot, the Professor and the plinth",
      "transition_in": "push",
      "cast": [
        "professor"
      ],
      "uses": [
        "void"
      ],
      "new": [
        "name_tag"
      ],
      "cues": [
        {
          "word": "touching",
          "what": "a hand touches the mug"
        },
        {
          "word": "own",
          "what": "a name tag pops onto it"
        },
        {
          "word": "worth",
          "what": "its price tag grows"
        }
      ],
      "on_screen": [
        {
          "type": "study_card",
          "year": 2009,
          "who": "Joann Peck & Suzanne Shu",
          "finding": "Just touching a product makes people feel they own it",
          "at": "Peck"
        }
      ]
    },
    {
      "id": 5,
      "lines": [
        11,
        12
      ],
      "title": "Everywhere",
      "what_we_see": "Two quick vignettes. A tiny tasting spoon held out over a counter, a name tag pops on the hand that takes it. A figure drops onto a grey sofa, and a name tag pops onto the sofa.",
      "camera": "Two quick locked-off shots",
      "transition_in": "whip pan",
      "cast": [
        "stranger_a",
        "stranger_b"
      ],
      "uses": [
        "name_tag",
        "void"
      ],
      "new": [],
      "cues": [
        {
          "word": "spoon",
          "what": "the spoon is handed over and tagged"
        },
        {
          "word": "sofa",
          "what": "the sofa gets a name tag"
        }
      ],
      "on_screen": []
    },
    {
      "id": 6,
      "lines": [
        13,
        15
      ],
      "title": "Give it back",
      "screenshot": true,
      "what_we_see": "You behind a small counter hand your product to a shopper before saying anything. A name tag pops onto it. Later you reach to take it back and the shopper hugs it close.",
      "camera": "Medium, straight on, then a push in on the shopper",
      "transition_in": "cut",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [
        "drinks_table",
        "name_tag",
        "gold_glow"
      ],
      "new": [],
      "cues": [
        {
          "word": "hands",
          "what": "you hand it over first"
        },
        {
          "word": "back",
          "what": "the shopper clutches it and the scene warms"
        },
        {
          "word": "touched",
          "what": "a name tag pops onto the product"
        }
      ],
      "on_screen": [
        {
          "type": "x_check",
          "wrong": "Describe it, then wait",
          "right": "Put it in their hands first",
          "at": "So"
        }
      ]
    },
    {
      "id": 7,
      "lines": [
        16,
        16
      ],
      "title": "Jay",
      "what_we_see": "Jay behind a counter with his products locked in a glass case, arms folded, while a shopper presses their nose to the glass and walks off.",
      "camera": "Medium, slight push",
      "transition_in": "whip pan",
      "cast": [
        "friend",
        "stranger_b"
      ],
      "uses": [
        "drinks_table"
      ],
      "new": [],
      "cues": [
        {
          "word": "counter",
          "what": "the shopper gives up and walks away"
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
      "id": "laptop",
      "kind": "prop",
      "name": "Laptop",
      "description": "A thin silver laptop, no logo, screen on a hinge that can open from shut to flat, glowing a soft blank white. About as wide as a character's shoulders.",
      "reuse": "Work, emails, online stores, any tech product"
    },
    {
      "id": "store_table",
      "kind": "set",
      "name": "Store table",
      "description": "A long pale wooden display table at waist height in an otherwise white space, with soft overhead light. Holds a row of products evenly spaced.",
      "reuse": "Any shop, product launch or display"
    },
    {
      "id": "name_tag",
      "kind": "effect",
      "name": "Ownership tag",
      "description": "A small white rounded tag with one bold initial that pops onto an object with a little bounce when someone touches it, with a dotted line to the person snapping solid.",
      "reuse": "Ownership, endowment, free trials, samples"
    }
  ]
}
```

---

## CAPTION


What makes you buy something you only walked over to look at?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #apple #retail #sales

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| In 2012, Forbes writer Carmine Gallo reported that Apple Store staff tilt notebook screens to about 70 degrees each morning, to get customers to touch them | Coverage of Gallo's Forbes piece: [Gizmodo](https://gizmodo.com/why-apple-stores-tilt-the-macbook-pro-exactly-70-degree-5918880), [MacTrast](https://www.mactrast.com/2012/06/why-macbook-pro-tilted-70-degrees-other-secrets-apple-store/amp/) | Confirmed (secondary coverage of the Forbes article) |
| 2009, Joann Peck and Suzanne Shu: merely touching an object increases perceived ownership, which affects how much people value it | Peck & Shu, "The Effect of Mere Touch on Perceived Ownership", Journal of Consumer Research 36(3), 2009 ([OUP](https://academic.oup.com/jcr/article-abstract/36/3/434/2900262), [PDF](https://www.anderson.ucla.edu/faculty_pages/suzanne.shu/JCR%20touch%20ownership.pdf)) | Confirmed |
| Tasting spoons and sofas you can sit on | General examples of letting customers touch or try. Not cited claims | n/a |

### ⚠️ Check before posting
- Reports from 2015 say the angle changed to 76 degrees ([Cult of Mac](https://www.cultofmac.com/?p=385754)). The script says "set" (past tense) and "about seventy", which is accurate for 2012.
- "Once they've touched it, they're deciding whether to give it back" is our reframe of the ownership finding, not a quote from the study.
- Remake of @decoyreport's tilted-laptop post (2.6M). Our wording, our examples and our sign-off. Their lines aren't reused.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=retail tier=1 format=F7 hook=N9 named_tool=no proof=both objection=no character=none ending=E6 cta=share -->
