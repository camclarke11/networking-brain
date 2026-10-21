# The chicken at the back

**Format:** F7 Brand X-ray
**Tier:** 1 (any business with more than one offer can put a great entry offer at the end of a path past the rest)
**Situation:** deciding what to lead with when you have one cheap offer and several better-paying ones
**A vs B:** a cheap offer on its own → a cheap offer people have to walk past everything else to reach
**Length:** 150 words ≈ 51s (at 175 wpm)
**Hook code:** N12 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Price and package

---

## TITLE / COVER OPTIONS
1. Why Costco's chicken is at the back
2. The $4.99 chicken was never the product
3. Costco loses millions on this on purpose

Cover (video/out/2026-10-21-the-chicken-at-the-back-cover.jpg): `python3 tools/make_video.py scripts/2026-10-21-the-chicken-at-the-back.md cover --at 5.95 --title "Why Costco's|chicken is|at the back" --highlight back --shift 360`

---

## HOOK OPTIONS
**A (used, N12):** You walk into Costco for one thing. The $4.99 rotisserie chicken. And it's all the way at the back.
**B (N9):** Costco keeps its cheapest best seller as far from the door as it can. On purpose.
**C (N12):** You went in for a $4.99 chicken. You came out with a TV.

---

## LOOP MAP

```text
L1  line 3   Why is it all the way at the back?        → surface line 10, full answer line 15
L2  line 7   If not the ovens, then why?               → closed lines 9, 10
L3  line 11  Why give up that much money?              → closed lines 12, 13
L4  line 14  If the chicken isn't the product, what is? → closed line 15
L5  line 16  What does that look like for me?          → closed line 17
```

---

## SCRIPT

You walk into Costco for one thing.
The $4.99 rotisserie chicken.
And it's all the way at the back.
Past the TVs.
Past the jewelry.
Past tubs of nuts the size of your head.
You'd think that's just where the ovens fit.
It isn't.
That chicken is cheap so you'll come in.
It's at the back so you'll walk past everything else.
Costco once said it gives up thirty to forty million dollars a year to keep that price.
Because hardly anyone leaves with just the chicken.
By the time you reach it, your cart's already full.
The chicken was never the product.
It was the reason you walked to the back.
So if you sell anything, have one offer so good it's almost silly.
Then make sure they see everything else on the way to it.
Send this to the friend whose cheapest offer is also his only offer.

---

## ELEVENLABS

```text
[curious] You walk into Costco for one thing. The $4.99 rotisserie chicken. [thoughtful] And it's all the way at the back. Past the TVs. Past the jewelry. [chuckles] Past tubs of nuts the size of your head. [short pause] You'd think that's just where the ovens fit. [matter-of-fact] It isn't. That chicken is cheap so you'll come in. It's at the back so you'll walk past everything else. [serious] Costco once said it gives up thirty to forty million dollars a year to keep that price. Because hardly anyone leaves with just the chicken. By the time you reach it, your cart's already full. [thoughtful] The chicken was never the product. It was the reason you walked to the back. [confident] So if you sell anything, have one offer so good it's almost silly. [happy] Then make sure they see everything else on the way to it. [playful] Send this to the friend whose cheapest offer is also his only offer.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "The walk is the product. A dotted yellow path runs from the front door to the chicken at the very back, snaking past every aisle, and your cart fills up one item at a time as you follow it.",
    "why": "The lesson is that a great cheap offer is there to make people pass everything else. A path from the door to the chicken, with the cart filling along it, shows where the money is made in one picture."
  },
  "names": {"friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "One thing",
      "what_we_see": "You stand just inside a huge warehouse entrance, tall grey shelving on both sides. Far away at the very back, a tiny rotisserie chicken in a clear dome glows under a warm heat lamp with a yellow $4.99 price tag.",
      "camera": "Behind your shoulder, looking down the long main aisle, slow push in",
      "transition_in": "cold open",
      "cast": ["you"], "uses": ["price_tag"], "new": ["warehouse_aisle", "rotisserie_chicken"],
      "cues": [{"word": "Costco", "what": "the aisle lights come up"}, {"word": "chicken", "what": "the far chicken glows and its $4.99 tag swings"}],
      "on_screen": [{"type": "big_text", "text": "You came for the $4.99 chicken", "at": "You"}]
    },
    {
      "id": 2, "lines": [3, 6], "title": "Past everything",
      "what_we_see": "You walk down the aisle with an empty cart. A dotted yellow line runs ahead on the floor. You pass a stack of big TV boxes, then a glass jewelry case, then a pile of nut tubs so big each one is the size of your head.",
      "camera": "Tracking alongside you at hip height",
      "transition_in": "cut",
      "cast": ["you"], "uses": [], "new": ["shopping_cart"],
      "cues": [{"word": "back", "what": "the dotted line draws ahead on the floor"}, {"word": "TVs", "what": "you pass the TV boxes"}, {"word": "jewelry", "what": "you pass the glass case"}, {"word": "nuts", "what": "a giant nut tub is next to your head"}],
      "on_screen": []
    },
    {
      "id": 3, "lines": [7, 10], "title": "Not the ovens",
      "what_we_see": "The camera rises to a top-down map of the whole warehouse: the door at the front, the chicken at the very back, aisles in between. On 'isn't' the dotted path lights up and snakes through every aisle to the chicken. On 'everything' each aisle you pass lights in turn.",
      "camera": "Crane up from behind you to straight down",
      "transition_in": "cut",
      "cast": ["you"], "uses": ["warehouse_aisle", "rotisserie_chicken"], "new": [],
      "cues": [{"word": "ovens", "what": "a small OVENS box at the back flashes"}, {"word": "isn't", "what": "the path lights up"}, {"word": "cheap", "what": "the chicken pulses"}, {"word": "everything", "what": "every aisle along the path lights"}],
      "on_screen": [], "screenshot": true
    },
    {
      "id": 4, "lines": [11, 11], "title": "Forty million a year",
      "what_we_see": "The chicken on its own under the heat lamp. Its yellow $4.99 tag holds still while a card above it counts up the money Costco gives up: THIRTY MILLION, then FORTY MILLION A YEAR.",
      "camera": "Close on the chicken, slow push",
      "transition_in": "push",
      "cast": [], "uses": ["rotisserie_chicken", "price_tag", "text_card"], "new": [],
      "cues": [{"word": "thirty", "what": "the card reads THIRTY MILLION"}, {"word": "forty", "what": "the card ticks to FORTY MILLION A YEAR"}, {"word": "price", "what": "the $4.99 tag glows"}],
      "on_screen": []
    },
    {
      "id": 5, "lines": [12, 13], "title": "The full cart",
      "what_we_see": "You arrive at the chicken. Your cart is piled high: a TV box, a nut tub, paper towels, a plant. You add the tiny chicken on top.",
      "camera": "Low angle on the cart, tilting up the pile",
      "transition_in": "cut",
      "cast": ["you"], "uses": ["shopping_cart", "rotisserie_chicken"], "new": [],
      "cues": [{"word": "chicken", "what": "the chicken goes on top of the pile"}, {"word": "full", "what": "the cart wobbles under the pile"}],
      "on_screen": []
    },
    {
      "id": 6, "lines": [14, 15], "title": "The walk was the product",
      "what_we_see": "Back to the top-down map. The chicken dims and the dotted path from the door to the back glows bright yellow instead.",
      "camera": "Straight down on the warehouse map",
      "transition_in": "fade",
      "cast": [], "uses": ["warehouse_aisle", "rotisserie_chicken"], "new": [],
      "cues": [{"word": "product", "what": "the chicken dims"}, {"word": "walked", "what": "the path glows"}],
      "on_screen": []
    },
    {
      "id": 7, "lines": [16, 17], "title": "Your path",
      "what_we_see": "Your own little stall: one bright card at the far end reads FREE AUDIT. A short dotted path leads to it past three cards: WEBSITES, ADS, MONTHLY CARE. A customer follows the path and stops at each card.",
      "camera": "Three-quarter view of the stall, the path in the foreground",
      "transition_in": "cut",
      "cast": ["you", "stranger_a"], "uses": ["text_card", "store_table"], "new": [],
      "cues": [{"word": "silly", "what": "the FREE AUDIT card lights"}, {"word": "everything", "what": "the customer stops at each card along the path"}],
      "on_screen": [{"type": "x_check", "wrong": "One cheap offer on its own", "right": "A great offer past everything else", "at": "sell"}]
    },
    {
      "id": 8, "lines": [18, 18], "title": "Jay's one offer",
      "what_we_see": "Jay behind a stall with a single small card reading CHEAP LOGO and nothing else. A customer takes it and leaves straight away.",
      "camera": "Wide, straight on",
      "transition_in": "cut",
      "cast": ["friend", "stranger_b"], "uses": ["text_card", "store_table"], "new": [],
      "cues": [{"word": "only", "what": "the customer leaves with the one card"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "warehouse_aisle", "kind": "set", "name": "Warehouse store", "description": "A huge pale-grey warehouse store: tall steel shelving racks with stacked plain boxes, wide aisles, a front door and a back counter with a warm heat lamp. Works from the floor and as a top-down map, with aisles that can light one by one and a dotted path drawn on the floor.", "reuse": "Any shop layout, customer journeys, funnels, 'what they walk past' ideas"},
    {"id": "rotisserie_chicken", "kind": "prop", "name": "Rotisserie chicken", "description": "A small golden-brown roast chicken in a clear plastic dome on a black tray, about the size of a character's head, that can glow warm under a heat lamp and carries a hanging price tag.", "reuse": "Loss leaders, cheap hero products, food deals"},
    {"id": "shopping_cart", "kind": "prop", "name": "Shopping cart", "description": "A grey wire shopping cart on four small wheels, waist height to a character, that a character pushes. Plain boxes, tubs and a plant can stack inside and pile up over the top, and it can wobble when full.", "reuse": "Any shopping scene, basket size, upsells, the cart filling as a metaphor for spend"}
  ]
}
```

---

## CAPTION





Why would a shop hide its best deal?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #pricing #marketing #sales

---

## FACT SHEET & SOURCES

| Claim, as the script tells it | What it rests on | Source (link) | Status |
|---|---|---|---|
| "The $4.99 rotisserie chicken." "All the way at the back. Past the TVs. Past the jewelry." | CNN (2019): the chickens sit "at the back of Costco's stores, past the televisions, jewelry, jumbo-sized ketchup jugs and tubs of mixed nuts" | [CNN via KRDO, 11 Oct 2019](https://krdo.com/news/2019/10/11/costco-is-going-to-extremes-to-keep-its-rotisserie-chickens-at-4-99/) | Confirmed |
| "It isn't. That chicken is cheap so you'll come in. It's at the back so you'll walk past everything else." | CNN: "For Costco, the chickens are a lure, pulling customers into stores and getting them to browse the aisles." Mental Floss, citing CNBC: the counters are "strategically located at the back of the store" | [CNN via KRDO](https://krdo.com/news/2019/10/11/costco-is-going-to-extremes-to-keep-its-rotisserie-chickens-at-4-99/); [Mental Floss](https://mentalfloss.com/article/568281/why-costco-rotisserie-chicken-so-cheap) | Confirmed (widely reported) |
| "Costco once said it gives up thirty to forty million dollars a year to keep that price." | CFO Richard Galanti (2015): willing to give up "$30 million, $40 million a year on gross margin by keeping it at $4.99" | [CNN via KRDO](https://krdo.com/news/2019/10/11/costco-is-going-to-extremes-to-keep-its-rotisserie-chickens-at-4-99/); [KSL](https://www.ksl.com/article/46655077/five-things-to-know-about-costcos-499-rotisserie-chickens) | Confirmed |
| "Hardly anyone leaves with just the chicken." | CNN: shoppers browse the aisles, adding sometimes hundreds of dollars of items before they pick up the bird | [CNN via KRDO](https://krdo.com/news/2019/10/11/costco-is-going-to-extremes-to-keep-its-rotisserie-chickens-at-4-99/) | Fair summary |

### ⚠️ Check before posting
- "Gives up" is margin, not necessarily a loss per bird. A 2019 Costco executive wouldn't say whether it still loses money on them, so the script says "gives up", not "loses".
- The $4.99 price briefly rose during 2008 and went back to $4.99 in 2009. The script doesn't claim it never changed.
- Store layouts vary, and some warehouses may not put the chicken at the very back.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=retail tier=1 format=F7 hook=N12 named_tool=no proof=none objection=no character=none ending=E6 cta=share -->
