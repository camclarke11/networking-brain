# The car that flies

**Format:** F7 Brand X-ray
**Tier:** 1 (a brand everyone knows, a trick a one-person business can copy this week, and it's this month's news)
**Situation:** Tesla's October 2026 Roadster reveal, three versions, one that flies and can't be bought
**A vs B:** one price for everything → one wild option above your best seller, so the best seller looks sensible
**Length:** 156 words ≈ 53s (at 175 wpm)
**Hook code:** N9 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Price and package

---

## TITLE / COVER OPTIONS
1. Tesla's flying car isn't for sale
2. Why Tesla made a car nobody can buy
3. The option nobody buys sells everything else

---

## HOOK OPTIONS
**A (used, N9):** Tesla's flying car has no price. It's not there to be bought.
**B (N11):** $50,000 just to reserve a car. And that's the sensible one.
**C (N9):** Tesla built a car almost nobody will ever own. On purpose.

---

## SCRIPT

Tesla's flying car has no price.
It's not there to be bought.

This month, Tesla showed three versions of its new Roadster.
Performance, the one that just drives.
$50,000 just to reserve one.
Thrust, the one with rocket thrusters.
$250,000 to reserve.
And Rocket, the one that flies.
Invite only.

Here's the trick.
Almost nobody will ever own the one that flies.
But it does two jobs.

First, it gets filmed.
A car jumping over a Cybertruck gets more attention than any ad Tesla could buy.

Second, it moves the anchor.
Next to a car that flies, $50,000 for one that drives sounds almost sensible.
That's why menus put one crazy expensive dish right at the top.

So if you sell anything, add one wild option above your best seller.
Hardly anyone will pick it.
It's there to sell the one below it.

Send this to the friend who only has one price.

---

## ELEVENLABS

```text
[confident] Tesla's flying car has no price. It's not there to be bought. [matter-of-fact] This month, Tesla showed three versions of its new Roadster. Performance, the one that just drives. $50,000 just to reserve one. Thrust, the one with rocket thrusters. $250,000 to reserve. [excited] And Rocket, the one that flies. Invite only. [short pause] Here's the trick. Almost nobody will ever own the one that flies. [thoughtful] But it does two jobs. [curious] First, it gets filmed. A car jumping over a Cybertruck gets more attention than any ad Tesla could buy. [confident] Second, it moves the anchor. [chuckles] Next to a car that flies, $50,000 for one that drives sounds almost sensible. That's why menus put one crazy expensive dish right at the top. [encouraging] So if you sell anything, add one wild option above your best seller. Hardly anyone will pick it. [warm] It's there to sell the one below it. [playful] Send this to the friend who only has one price.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "Every option sits on a white plinth with a price tag hanging from it. The wild option's tag is so heavy it drops a ship's anchor onto the floor, and everything next to it suddenly looks small and sensible.",
    "why": "The lesson is that the top option is there to change how the others feel. A literal anchor dropping from the extreme option makes 'it moves the anchor' something you can see."
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
      "title": "No price",
      "what_we_see": "Empty off-white space. A sleek low sports car, simple and rounded, floats a hand's width above a white plinth. A blank price tag hangs from its mirror on a string, spinning slowly. On 'price' it flips: nothing written on it.",
      "camera": "Low three-quarter angle, slow orbit",
      "transition_in": "cold open",
      "cast": [],
      "uses": [
        "void"
      ],
      "new": [
        "roadster_model",
        "price_tag"
      ],
      "cues": [
        {
          "word": "price",
          "what": "the tag flips round: it's blank"
        },
        {
          "word": "bought",
          "what": "a glass case drops over the car"
        }
      ],
      "on_screen": [
        {
          "type": "big_text",
          "text": "Tesla's flying car has no price"
        }
      ]
    },
    {
      "id": 2,
      "lines": [
        3,
        9
      ],
      "title": "Three versions",
      "what_we_see": "Three plinths in a row, a car on each. Each lights up as it's named and its tag swings in: $50,000, then $250,000, then the third car lifts off its plinth on small thrusters and its tag just says invite only.",
      "camera": "Side-on dolly along the three plinths",
      "transition_in": "whip pan",
      "cast": [],
      "uses": [
        "void",
        "roadster_model",
        "price_tag"
      ],
      "new": [],
      "cues": [
        {
          "word": "Performance",
          "what": "car one lights, its tag swings in: $50,000"
        },
        {
          "word": "Thrust",
          "what": "car two lights, puffs from rear thrusters"
        },
        {
          "word": "flies",
          "what": "car three lifts off its plinth"
        },
        {
          "word": "Roadster",
          "what": "the three plinths rise into view"
        },
        {
          "word": "reserve",
          "what": "the $50,000 tag swings in"
        },
        {
          "word": "$250,000",
          "what": "the $250,000 tag swings in"
        }
      ],
      "on_screen": [
        {
          "type": "stamp",
          "text": "INVITE ONLY",
          "at": "Invite"
        }
      ]
    },
    {
      "id": 3,
      "lines": [
        10,
        12
      ],
      "title": "Two jobs",
      "what_we_see": "You walk in and look up at the flying car hovering above everyone. Two cards slide in beside it.",
      "camera": "Low angle from behind you, looking up at the hovering car",
      "transition_in": "cut",
      "cast": [
        "you"
      ],
      "uses": [
        "void",
        "roadster_model"
      ],
      "new": [],
      "cues": [
        {
          "word": "nobody",
          "what": "the glass case locks shut with a click"
        }
      ],
      "on_screen": [
        {
          "type": "tool_card",
          "title": "Two jobs",
          "items": [
            "It gets filmed",
            "It moves the anchor"
          ],
          "at": "jobs"
        }
      ]
    },
    {
      "id": 4,
      "lines": [
        13,
        14
      ],
      "title": "Filmed",
      "what_we_see": "The flying car hops clean over a big angular grey pickup. A crowd raises phones in a wave. A small grey billboard beside them shrinks to nothing.",
      "camera": "Wide, then a quick tilt up as it jumps",
      "transition_in": "cut",
      "cast": [
        "crowd"
      ],
      "uses": [
        "void",
        "roadster_model",
        "phone"
      ],
      "new": [],
      "cues": [
        {
          "word": "filmed",
          "what": "phones go up across the crowd"
        },
        {
          "word": "jumping",
          "what": "the car hops over the pickup"
        },
        {
          "word": "ad",
          "what": "the billboard shrinks away"
        }
      ],
      "on_screen": []
    },
    {
      "id": 5,
      "lines": [
        15,
        17
      ],
      "title": "The anchor",
      "what_we_see": "Back to the plinths. The flying car's tag swells and a heavy black ship's anchor drops from it with a thud. The $50,000 car next to it now looks small and reasonable, and its tag glows yellow. A simple menu card slides in.",
      "camera": "Locked-off wide on the two plinths",
      "transition_in": "cut",
      "cast": [],
      "uses": [
        "void",
        "roadster_model",
        "price_tag",
        "gold_glow"
      ],
      "new": [
        "anchor_weight"
      ],
      "cues": [
        {
          "word": "anchor",
          "what": "the anchor drops with a thud and cracks the floor"
        },
        {
          "word": "sensible",
          "what": "the $50,000 tag glows yellow"
        },
        {
          "word": "drives",
          "what": "the $50,000 car slides in beside the anchor"
        },
        {
          "word": "car",
          "what": "the flying car hovers in beside the plinth"
        }
      ],
      "on_screen": [
        {
          "type": "tool_card",
          "title": "Menu",
          "items": [
            "The crazy expensive dish",
            "The dish people actually order"
          ],
          "at": "menus"
        }
      ]
    },
    {
      "id": 6,
      "lines": [
        18,
        20
      ],
      "title": "Your version",
      "screenshot": true,
      "what_we_see": "You at a small white counter with your product on it. You hang a huge tag above it, the wild option. Your normal tag below it lights up yellow and people walk up to buy that one.",
      "camera": "Medium, straight on, slow push in",
      "transition_in": "cut",
      "cast": [
        "you",
        "stranger_a"
      ],
      "uses": [
        "drinks_table",
        "price_tag",
        "anchor_weight",
        "gold_glow"
      ],
      "new": [],
      "cues": [
        {
          "word": "wild",
          "what": "the huge tag drops in above, with a small anchor"
        },
        {
          "word": "below",
          "what": "the normal tag glows and a customer picks it"
        },
        {
          "word": "Hardly",
          "what": "the wild tag sways untouched"
        }
      ],
      "on_screen": [
        {
          "type": "x_check",
          "wrong": "One price for everything",
          "right": "One wild option above your best seller",
          "at": "So"
        }
      ]
    },
    {
      "id": 7,
      "lines": [
        21,
        21
      ],
      "title": "Jay",
      "what_we_see": "Jay behind his own counter with a single lonely price tag, staring at his phone while nobody stops.",
      "camera": "Medium, slight push",
      "transition_in": "whip pan",
      "cast": [
        "friend"
      ],
      "uses": [
        "drinks_table",
        "price_tag",
        "phone"
      ],
      "new": [],
      "cues": [
        {
          "word": "one",
          "what": "his single tag swings in the breeze"
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
      "id": "roadster_model",
      "kind": "prop",
      "name": "Sports car",
      "description": "A low, sleek two-seat sports car in smooth white plastic, no logos, about as long as two characters lying down. Can hover on small thruster puffs, hop, and sit on a plinth under a glass case.",
      "reuse": "Any car, luxury product, flagship or show-off option"
    },
    {
      "id": "price_tag",
      "kind": "prop",
      "name": "Price tag",
      "description": "A white card tag on a string with a punched hole, big enough to read on screen, text set per shot. Swings, flips, glows yellow, and can swell to a huge size.",
      "reuse": "Every pricing video"
    },
    {
      "id": "anchor_weight",
      "kind": "prop",
      "name": "Anchor",
      "description": "A heavy black ship's anchor about the height of a character, dropping on a chain from a price tag and landing with a thud and a small floor crack.",
      "reuse": "Anchoring, first numbers, the most expensive option"
    }
  ]
}
```

---

## CAPTION


Why would anyone build something almost nobody can buy?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #tesla #pricing #marketing

---

## FACT SHEET & SOURCES

| Claim in script | Source (link) | Status |
|---|---|---|
| Tesla revealed three Roadster versions in October 2026: Performance ("road ready", $50,000 reservation), Thrust ("race ready", cold-gas thrusters, $250,000 reservation), Rocket ("air ready", flies briefly, invite only) | [TechCrunch, 15 Oct 2026](https://techcrunch.com/2026/10/15/tesla-reveals-spacex-powered-roadster-that-flies-and-falls-with-style/), [Fortune, 17 Oct 2026](https://fortune.com/2026/10/17/tesla-flying-roadster-spacex-thrusters-2028-production-price/) | Confirmed |
| No final price was announced for any version | Fortune (above): "Tesla hasn't announced final prices for any version" | Confirmed |
| In the demo the Roadster lifted itself over a Cybertruck (and a Cybercab, Semi, Model Y and Model 3) | TechCrunch (above) | Confirmed |
| Anchoring: the first number seen shapes later judgments | Tversky and Kahneman (1974), Science, see [Anchoring effect](https://en.wikipedia.org/wiki/Anchoring_effect) | Confirmed (concept, not quoted as a study in this script) |

### ⚠️ Check before posting
- "This month" dates the script to October 2026. Post it this week, or change it to "In October".
- "More attention than any ad Tesla could buy" is a reasonable claim, not a measured one. Keep it phrased as opinion.
- "Menus put one crazy expensive dish at the top" is a common menu tactic, stated generally. Don't name a restaurant.
- Remake of @decoyreport's Tesla post (9.75M). Our wording, our examples and our sign-off. Their lines aren't reused.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=pricing tier=1 format=F7 hook=N9 named_tool=no proof=history objection=no character=none ending=E6 cta=share -->
