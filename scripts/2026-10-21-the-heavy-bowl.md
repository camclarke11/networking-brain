# The heavy bowl

**Format:** F7 Brand X-ray
**Tier:** 1 (anyone selling a physical product can change its weight or its packaging)
**Situation:** choosing packaging for a product you want to feel premium
**A vs B:** light, cheap packaging → weight where the customer holds it
**Length:** 135 words ≈ 46s (at 175 wpm)
**Hook code:** N10 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Stand out

---

## TITLE / COVER OPTIONS
1. Same yogurt. Heavier bowl. Tasted better.
2. People taste with their hands
3. Why premium things are heavy

---

## HOOK OPTIONS
**A (used, N10):** Same yogurt. Heavier bowl. People said it tasted better.
**B (N9):** Oxford scientists made yogurt taste better without touching the yogurt.
**C (N10):** Same yogurt, heavier spoon. It tasted cheaper.

---

## SCRIPT

Same yogurt.
Heavier bowl.
People said it tasted better.

In 2011, researchers at Oxford gave fifty people the exact same yogurt in three bowls.
The bowls looked identical.
The only difference was the weight.

Here's the trick.
From the heaviest bowl, people rated the yogurt denser, nicer, and more expensive.
Your brain has a shortcut.
Heavy means quality.

But it's not that simple.
Two years later, the same lab tried heavier spoons.
The yogurt from the heavy spoon felt cheaper.
So weight isn't magic.
It works when it's in the thing that holds the product.
The bowl, the bottle, the box.

So if you sell anything premium, put the weight where they hold it.
Thick glass.
A box with some heft.

Send this to the friend who ships his best product in a flimsy bag.

---

## ELEVENLABS

```text
[curious] Same yogurt. Heavier bowl. [excited] People said it tasted better. [matter-of-fact] In 2011, researchers at Oxford gave fifty people the exact same yogurt in three bowls. The bowls looked identical. The only difference was the weight. [short pause] Here's the trick. From the heaviest bowl, people rated the yogurt denser, nicer, and more expensive. [thoughtful] Your brain has a shortcut. Heavy means quality. [serious] But it's not that simple. Two years later, the same lab tried heavier spoons. [chuckles] The yogurt from the heavy spoon felt cheaper. So weight isn't magic. [confident] It works when it's in the thing that holds the product. The bowl, the bottle, the box. [encouraging] So if you sell anything premium, put the weight where they hold it. Thick glass. A box with some heft. [playful] Send this to the friend who ships his best product in a flimsy bag.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Every object shows a little weight dial that swings when it's lifted, and the price tag beside it grows with the dial. Hand it a heavier bowl and the dial and the price both climb, though nothing inside changed.",
    "why": "The lesson is that heft reads as quality and value. A weight dial driving a price tag shows 'heavy means quality' at a glance, and the spoon twist can run the dial the other way."
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
      "title": "Same yogurt",
      "what_we_see": "Three identical white bowls of yogurt in a row on white space. A hand lifts the middle one and it sinks a little in the hand, heavy. A small weight dial above it swings up. A yellow star pops above it.",
      "camera": "Straight on, close, then a slight tilt up with the lifted bowl",
      "transition_in": "cold open",
      "cast": [],
      "uses": [
        "void"
      ],
      "new": [
        "yogurt_bowl",
        "weight_dial"
      ],
      "cues": [
        {
          "word": "Heavier",
          "what": "the middle bowl is lifted and the dial swings"
        },
        {
          "word": "better",
          "what": "a star pops above it"
        }
      ],
      "on_screen": [
        {
          "type": "big_text",
          "text": "Same yogurt. Heavier bowl.",
          "at": "Same"
        }
      ]
    },
    {
      "id": 2,
      "lines": [
        4,
        6
      ],
      "title": "The test",
      "what_we_see": "The Professor in front of a long white table. Three bowls go in front of three seated tasters. Each bowl gets a weight dial: light, medium, heavy. Only the dials differ.",
      "camera": "Wide, the Professor and the table",
      "transition_in": "cut",
      "cast": [
        "professor",
        "stranger_a",
        "stranger_b",
        "stranger_c"
      ],
      "uses": [
        "yogurt_bowl",
        "weight_dial",
        "store_table"
      ],
      "new": [],
      "cues": [
        {
          "word": "identical",
          "what": "the three bowls line up exactly the same"
        },
        {
          "word": "weight",
          "what": "three dials pop up, each at a different weight"
        },
        {
          "word": "fifty",
          "what": "a row of tasters sits down"
        },
        {
          "word": "three",
          "what": "three bowls slide in"
        }
      ],
      "on_screen": [
        {
          "type": "study_card",
          "year": 2011,
          "who": "Piqueras-Fiszman, Harrar, Alcaide & Spence (Oxford)",
          "finding": "Same yogurt from a heavier bowl was rated denser, nicer and more expensive",
          "at": "2011"
        }
      ]
    },
    {
      "id": 3,
      "lines": [
        7,
        10
      ],
      "title": "Heavy means quality",
      "what_we_see": "The taster with the heavy bowl lights up. Their price tag grows beside them. The light-bowl taster shrugs, their tag small.",
      "camera": "Medium, tracking along the three tasters",
      "transition_in": "cut",
      "cast": [
        "stranger_a",
        "stranger_b",
        "stranger_c"
      ],
      "uses": [
        "yogurt_bowl",
        "weight_dial",
        "price_tag",
        "gold_glow"
      ],
      "new": [],
      "cues": [
        {
          "word": "expensive",
          "what": "the heavy bowl's price tag grows"
        },
        {
          "word": "quality",
          "what": "the heavy bowl glows yellow"
        },
        {
          "word": "heaviest",
          "what": "the heavy bowl is lifted"
        },
        {
          "word": "shortcut",
          "what": "an arrow from weight to star draws on"
        }
      ],
      "on_screen": []
    },
    {
      "id": 4,
      "lines": [
        11,
        16
      ],
      "title": "The spoon",
      "what_we_see": "Same table. This time the bowls are equal but one taster gets a big heavy metal spoon. Their dial swings up, but their price tag shrinks and goes grey. Then the shot frames the bowl, a bottle and a box side by side, each with a dial.",
      "camera": "Close on the spoons, then a pull back to the three containers",
      "transition_in": "push",
      "cast": [
        "stranger_a",
        "professor"
      ],
      "uses": [
        "yogurt_bowl",
        "weight_dial",
        "price_tag",
        "colour_drain"
      ],
      "new": [],
      "cues": [
        {
          "word": "spoons",
          "what": "a big metal spoon clanks down"
        },
        {
          "word": "cheaper",
          "what": "the tag shrinks and drains grey"
        },
        {
          "word": "magic",
          "what": "a sparkle fizzles out"
        },
        {
          "word": "bottle",
          "what": "the bowl, a bottle and a box slide in side by side"
        }
      ],
      "on_screen": [
        {
          "type": "study_card",
          "year": 2013,
          "who": "Harrar & Spence (Oxford)",
          "finding": "The same yogurt from a heavier spoon seemed less dense and cheaper",
          "at": "Two"
        }
      ]
    },
    {
      "id": 5,
      "lines": [
        17,
        19
      ],
      "title": "Put the weight there",
      "screenshot": true,
      "what_we_see": "You at a white counter swap a thin plastic pouch for a thick glass jar and a sturdy box. A customer lifts the jar, the dial swings up, and the price tag beside it grows and glows yellow.",
      "camera": "Medium on the counter, push in as the customer lifts the jar",
      "transition_in": "cut",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [
        "drinks_table",
        "weight_dial",
        "price_tag",
        "gold_glow"
      ],
      "new": [],
      "cues": [
        {
          "word": "hold",
          "what": "the customer lifts the jar and the dial swings"
        },
        {
          "word": "glass",
          "what": "the jar clinks down solidly"
        },
        {
          "word": "heft",
          "what": "the box thuds and the tag glows"
        }
      ],
      "on_screen": [
        {
          "type": "x_check",
          "wrong": "Light, cheap packaging",
          "right": "Weight where they hold it",
          "at": "So"
        }
      ]
    },
    {
      "id": 6,
      "lines": [
        20,
        20
      ],
      "title": "Jay",
      "what_we_see": "Jay hands over his product in a crinkly thin bag. It flops in the customer's hand and the dial barely twitches.",
      "camera": "Medium, slight push",
      "transition_in": "whip pan",
      "cast": [
        "friend",
        "stranger_b"
      ],
      "uses": [
        "drinks_table",
        "weight_dial"
      ],
      "new": [],
      "cues": [
        {
          "word": "flimsy",
          "what": "the bag flops and the dial barely moves"
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
      "id": "yogurt_bowl",
      "kind": "prop",
      "name": "Bowl of yogurt",
      "description": "A plain round white bowl filled with smooth white yogurt and a little swirl on top, sized for one hand. Can be lifted, sinks slightly in the hand when heavy.",
      "reuse": "Food, taste tests, packaging, any study with a bowl"
    },
    {
      "id": "weight_dial",
      "kind": "effect",
      "name": "Weight dial",
      "description": "A small round white gauge with a black needle that floats above an object and swings to show how heavy it feels when lifted, light to heavy, with a soft spring.",
      "reuse": "Weight, heft, premium feel, effort"
    }
  ]
}
```

---

## CAPTION


You've judged how good something is before you tasted it. How?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #packaging #branding #marketing

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| 2011, Oxford researchers: the same yogurt in three bowls identical except for weight. The heavier bowl was rated denser, nicer tasting and more expensive. 50 adults | Piqueras-Fiszman, Harrar, Alcaide & Spence (2011), Food Quality and Preference 22(8). [Oxford Neuroscience listing](https://www.neuroscience.ox.ac.uk/publications/186249), [ORA](https://ora.ox.ac.uk/objects/uuid:b4d28cb9-e7e2-45b2-b90f-06c7b22dcbae), [Oxford news](https://www.ox.ac.uk/node/14449) | Confirmed |
| 2013, the same Oxford lab: yogurt eaten with a light plastic spoon was rated denser and more expensive than with a weighted spoon (so the heavy spoon felt cheaper) | Harrar & Spence (2013), "The taste of cutlery", Flavour 2:21. [Full text](https://flavourjournal.biomedcentral.com/track/pdf/10.1186/2044-7248-2-21), [ABC News](https://abcnews.go.com/blogs/health/2013/06/27/yogurt-tastes-different-depending-on-the-spoon) | Confirmed |
| "It works when it's in the thing that holds the product" | Our reading of the two results together. The authors suggest the effects depend on expectations about the cutlery or container | Interpretation, framed as one |

### ⚠️ Check before posting
- In the 2011 paper, flavor intensity didn't change, but density, price expectation and liking did. "Tasted better" in the hook matches the liking result. Don't say "tasted stronger".
- "The bowl, the bottle, the box" are examples, not things the studies tested.
- Remake of @decoyreport's heavy-bowl post (156k). Our twist is the spoon study, which they don't use. Our wording and sign-off. Their lines aren't reused.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=packaging tier=1 format=F7 hook=N10 named_tool=no proof=study objection=no character=none ending=E6 cta=share -->
