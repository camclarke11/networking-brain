# The name from the Bronx

**Format:** F7 Brand X-ray
**Tier:** 1 (anyone selling a product or a service has to name it, and can rename it this week)
**Situation:** naming your product or package, and wondering why the fancy brands can charge more
**A vs B:** a plain, descriptive name ("website package") → a name that sounds like the price you want
**Length:** 148 words ≈ 51s (at 175 wpm)
**Hook code:** N12 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Price and package

---

## TITLE / COVER OPTIONS
1. Häagen-Dazs isn't from Denmark
2. The ice cream name that means nothing
3. Your price starts with your name

Cover (video/out/2026-10-21-the-name-from-the-bronx-cover.jpg): `python3 tools/make_video.py scripts/2026-10-21-the-name-from-the-bronx.md cover --at 31.9 --title "Häagen-Dazs isn't from Denmark" --highlight Denmark --shift 500`

---

## HOOK OPTIONS
**A (used, N12):** You're in the freezer aisle, holding the tub with the fancy foreign name. Häagen-Dazs.
**B (N9):** Häagen-Dazs made up its name. On purpose.
**C (N12):** You'd swear Häagen-Dazs came from Denmark. It came from the Bronx.

---

## LOOP MAP

```text
L1  line 1   Why does that fancy name matter?        → surface line 9, full answer line 17
L2  line 3   If not Denmark, where?                  → closed line 4
L3  line 5   Why make up a name that means nothing?  → closed lines 8, 9
L4  line 9   What does the name do before you taste? → closed lines 10, 11, 13
L5  line 14  What would that look like for me?       → closed lines 15, 16
```

---

## SCRIPT

You're in the freezer aisle, holding the tub with the fancy foreign name.
Häagen-Dazs.
You'd guess it came from Denmark.
It came from the Bronx.
Reuben Mattus made the name up at his kitchen table.
It doesn't mean anything, in any language.
Danish doesn't even have that dotted A.
But he knew exactly what he was doing.
Because that name gets to you before the ice cream does.
You read it and picture somewhere cold, old and serious about cream.
So the tub in your hand already feels like the good stuff.
He made the ice cream rich.
The name made you expect rich.
So if you sell anything, name it like the price you want to charge.
Not website package.
The Launch Build.
Because people read the name long before they read the price.
Send this to the friend whose business is still called something solutions.

---

## ELEVENLABS

```text
[curious] You're in the freezer aisle, holding the tub with the fancy foreign name. Häagen-Dazs. [thoughtful] You'd guess it came from Denmark. [chuckles] It came from the Bronx. [matter-of-fact] Reuben Mattus made the name up at his kitchen table. It doesn't mean anything, in any language. Danish doesn't even have that dotted A. [short pause] But he knew exactly what he was doing. [serious] Because that name gets to you before the ice cream does. You read it and picture somewhere cold, old and serious about cream. So the tub in your hand already feels like the good stuff. [thoughtful] He made the ice cream rich. The name made you expect rich. [confident] So if you sell anything, name it like the price you want to charge. Not website package. The Launch Build. [happy] Because people read the name long before they read the price. [playful] Send this to the friend whose business is still called something solutions.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "The name is a price tag. Every tub has a small price tag hanging off it, and whenever the fancy name types onto the label, the tag grows and glows, though the tub and the ice cream never change.",
    "why": "The lesson is that a name sets the price before anyone tastes the product. A tag that grows as the name appears shows that in one picture, and the same tag comes back on your own package at the end."
  },
  "names": {"stranger_a": "Reuben", "friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "The fancy tub",
      "what_we_see": "You stand in front of a tall white freezer case with glass doors, cold light inside. You hold a white ice cream tub with a blank label. On 'fancy' the label starts typing letters, and on 'Häagen' the full name lands in tall black letters while a small price tag swings on a string from the tub.",
      "camera": "Low and close on you and the tub, slow push in on the label",
      "transition_in": "cold open",
      "cast": ["you"], "uses": ["void", "price_tag"], "new": ["freezer_case", "ice_cream_tub"],
      "cues": [{"word": "freezer", "what": "the freezer doors glow cold"}, {"word": "fancy", "what": "letters start typing on the label"}, {"word": "Häagen", "what": "the name lands and the price tag swings in"}],
      "on_screen": [{"type": "big_text", "text": "The fanciest name in the freezer", "at": "You're"}]
    },
    {
      "id": 2, "lines": [3, 4], "title": "Not Denmark",
      "what_we_see": "A tall upright sign card stands on white space reading DENMARK? with a small yellow question mark. On 'Bronx' it flips like a departure board to THE BRONX, NEW YORK, and you look up at it, surprised.",
      "camera": "Straight on, the sign fills the upper half, you small at the bottom",
      "transition_in": "cut",
      "cast": ["you"], "uses": [], "new": ["text_card"],
      "cues": [{"word": "Denmark", "what": "the sign reads DENMARK?"}, {"word": "Bronx", "what": "the sign flips to THE BRONX, NEW YORK and you jolt"}],
      "on_screen": []
    },
    {
      "id": 3, "lines": [5, 7], "title": "The kitchen table",
      "what_we_see": "Reuben sits at a small white kitchen table pushing letter blocks around until they read HÄAGEN-DAZS. On 'anything' the blocks briefly flash blank. On 'dotted' a card slides in showing the Danish letters Æ Ø Å, and the Ä block gets a yellow strike-through.",
      "camera": "Three-quarter view on the table, close on the blocks, then over Reuben's shoulder",
      "transition_in": "push",
      "cast": ["stranger_a"], "uses": ["store_table", "syllable_train"], "new": [],
      "cues": [{"word": "kitchen", "what": "the blocks slide into the name"}, {"word": "anything", "what": "the blocks flash blank"}, {"word": "dotted", "what": "the Danish letter card slides in and the Ä is struck"}],
      "on_screen": [{"type": "label", "text": "Reuben Mattus", "target": "stranger_a", "at": "Reuben"}]
    },
    {
      "id": 4, "lines": [8, 11], "title": "The name gets there first",
      "what_we_see": "Back to the tub, now on its own in white space with a plain label reading ICE CREAM and a small price tag. On 'name' the fancy name types over the plain label and the price tag grows and starts to glow. On 'picture' soft snowy peaks rise behind the tub. On 'good' the tag glows yellow.",
      "camera": "Slow orbit around the tub, ending straight on",
      "transition_in": "cut",
      "cast": [], "uses": ["price_tag", "ice_cream_tub"], "new": [],
      "cues": [{"word": "knew", "what": "the plain label flickers"}, {"word": "before", "what": "the name types over the plain label and the tag grows"}, {"word": "picture", "what": "snowy peaks rise behind the tub"}, {"word": "serious", "what": "an old dairy sign glides in behind the peaks"}, {"word": "hand", "what": "the tub lifts slightly as if in your hand"}, {"word": "good", "what": "the price tag glows yellow"}],
      "on_screen": [], "screenshot": true
    },
    {
      "id": 5, "lines": [12, 13], "title": "Rich, and expected rich",
      "what_we_see": "Two identical tubs side by side, lids off, the same thick scoop on top. The left label says ICE CREAM with a small tag, the right says HÄAGEN-DAZS with a big glowing tag. On 'expect' the right tag swings up even bigger.",
      "camera": "Straight on, both tubs centered",
      "transition_in": "cut",
      "cast": [], "uses": ["ice_cream_tub", "price_tag"], "new": [],
      "cues": [{"word": "rich", "what": "both scoops wobble, identical"}, {"word": "expect", "what": "only the right tag grows"}],
      "on_screen": []
    },
    {
      "id": 6, "lines": [14, 17], "title": "Name your package",
      "what_we_see": "You at a white desk with a laptop. Above you a plain card reads WEBSITE PACKAGE with a small price tag. On 'Launch' it retypes to THE LAUNCH BUILD and the tag grows and glows, the same move the tub made.",
      "camera": "Medium on you and the card, slight push in on 'Launch'",
      "transition_in": "fade",
      "cast": ["you"], "uses": ["laptop", "store_table", "price_tag", "text_card"], "new": [],
      "cues": [{"word": "sell", "what": "the card drops in"}, {"word": "Launch", "what": "the card retypes and the tag grows"}, {"word": "price", "what": "the tag glows"}],
      "on_screen": [{"type": "x_check", "wrong": "Website package", "right": "The Launch Build", "at": "Not"}]
    },
    {
      "id": 7, "lines": [18, 18], "title": "Jay's sign",
      "what_we_see": "Jay stands bored under a plain shop sign reading JAY'S SOLUTIONS, with a tiny price tag hanging off the sign.",
      "camera": "Wide, straight on",
      "transition_in": "cut",
      "cast": ["friend"], "uses": ["text_card", "price_tag"], "new": [],
      "cues": [{"word": "solutions", "what": "the sign's tiny tag swings"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "freezer_case", "kind": "set", "name": "Freezer case", "description": "A tall white supermarket freezer case with three glass doors, chrome-grey handles and cold white light inside, shelves of plain tubs behind the glass. About 2.2 high and 3 wide next to a character. The inside light can glow brighter.", "reuse": "Any supermarket or grocery scene, chilled products, a cold shoulder joke"},
    {"id": "ice_cream_tub", "kind": "prop", "name": "Ice cream tub", "description": "A round white pint tub slightly wider at the top, with a lid that can come off and a label band whose text can type on letter by letter. A thick scoop can sit on top. About 0.25 high in a character's hand, scales up for hero shots.", "reuse": "Any packaged food, naming and labelling, before and after rebrands"},
    {"id": "text_card", "kind": "prop", "name": "Text card", "description": "A soft white rounded card with tall black condensed text, standing upright or lying flat, that can flip like a departure board to new text and glow at the edges. Sized from a hand-held card to a shop sign.", "reuse": "Signs, menus, package names, shop fronts, any word that needs to live in the 3D scene"}
  ]
}
```

---

## CAPTION





You've probably paid extra for a word that doesn't mean anything. Do you know which one?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #branding #naming #marketing

---

## FACT SHEET & SOURCES

| Claim, as the script tells it | What it rests on | Source (link) | Status |
|---|---|---|---|
| "It came from the Bronx." | Häagen-Dazs was founded by Reuben and Rose Mattus in the Bronx, New York (launched around 1960 to 1961) | [Wikipedia: Häagen-Dazs](https://en.wikipedia.org/wiki/H%C3%A4agen-Dazs), citing the NYT obituary of Rose Mattus (2006) and People (1981); [Tasting Table](https://www.tastingtable.com/2256851/haagen-dazs-origins-not-german-dutch/) | Confirmed |
| "Reuben Mattus made the name up at his kitchen table." | His daughter Doris Hurley said in a 1996 PBS documentary that he tried out nonsense words at the kitchen table until he found a combination he liked | [Wikipedia: Häagen-Dazs](https://en.wikipedia.org/wiki/H%C3%A4agen-Dazs) | Confirmed (secondary) |
| "It doesn't mean anything, in any language." | The 1994 NYT obituary says the name means as little in Danish as in English; Food Republic: it doesn't mean anything in any language | [Tampa Bay Times reprint of the NYT obituary, 31 Jan 1994](https://www.tampabay.com/archive/1994/01/31/reuben-mattus-81-creator-of-haagen-dazs-ice-cream) (headline only online); [Food Republic](https://www.foodrepublic.com/1683744/what-does-haagen-dazs-mean/) | Confirmed |
| "Danish doesn't even have that dotted A." | Neither "ä" nor "zs" exists in Danish (Danish uses æ, ø, å) | [Wikipedia: Häagen-Dazs](https://en.wikipedia.org/wiki/H%C3%A4agen-Dazs) | Confirmed |
| "But he knew exactly what he was doing." | Mattus gave it a "foreign-sounding" name; his "ultra-premium ice cream needed a certain cosmopolitan cache" for sophisticated, moneyed buyers. In 1981 he told People he "made a name and created a meaning for it" | [My Jewish Learning](https://www.myjewishlearning.com/the-nosher/the-jewish-history-of-americas-most-famous-ice-cream/); People, 17 Aug 1981, via [Wikipedia](https://en.wikipedia.org/wiki/H%C3%A4agen-Dazs) | Confirmed |
| "He made the ice cream rich." | Marketed as super-premium: dense, little air, high butterfat | [Wikipedia: Häagen-Dazs](https://en.wikipedia.org/wiki/H%C3%A4agen-Dazs) | Confirmed |
| "That name gets to you before the ice cream does." | Foreign-sounding brand names change how people perceive a product (Leclerc, Schmitt and Dubé, "Foreign Branding and Its Effects on Product Perceptions and Attitudes", Journal of Marketing Research, 1994) | Journal of Marketing Research 31, May 1994, pp. 263–270, listed in [UPenn foreign-branding bibliography](https://www.sas.upenn.edu/~haroldfs/popcult/handouts/adverts/forbrbib.htm) | Backing only, not narrated |

### ⚠️ Check before posting
- The Danish sound was also a tribute to Denmark's rescue of its Jews in the Second World War. The script leaves that out for time; the caption says it, so comments that bring it up are already answered.
- "The Launch Build" is our example name, not a real product.
- "Danish doesn't even have that dotted A": true of the letter ä. Danish has å (a ring, not dots), so a Dane in the comments might point that out. It's still accurate.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=brand_strategy tier=1 format=F7 hook=N12 named_tool=no proof=none objection=no character=named ending=E6 cta=share -->
