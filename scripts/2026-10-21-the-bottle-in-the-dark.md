# The bottle in the dark

**Format:** F7 Brand X-ray
**Tier:** 1 (any business can pick one color, shape or habit and use it on everything this week)
**Situation:** your product or content looks like everyone else's, so people forget whose it was
**A vs B:** a bigger logo on the same thing everyone makes → something people know with your name covered
**Length:** 147 words ≈ 50s (at 175 wpm)
**Hook code:** N12 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Stand out

---

## TITLE / COVER OPTIONS
1. You'd know a Coke bottle in the dark
2. Coca-Cola's 1915 brief
3. Make it yours with the name covered

Cover (video/out/2026-10-21-the-bottle-in-the-dark-cover.jpg): `python3 tools/make_video.py scripts/2026-10-21-the-bottle-in-the-dark.md cover --at 29.0 --title "You'd know|a Coke in|the dark" --highlight dark --dark --shift 600`

---

## HOOK OPTIONS
**A (used, N12):** You reach into a dark cooler and grab a bottle without looking. You already know it's a Coke.
**B (N9):** In 1915, Coca-Cola asked for a bottle you'd recognize broken on the ground.
**C (N12):** Close your eyes and pick up a Coke bottle. You'll still know it's a Coke.

---

## LOOP MAP

```text
L1  line 1   How do you know it's a Coke without looking? → surface line 12, full answer line 19
L2  line 4   What brief?                                  → closed lines 13, 14
L3  line 5   What was the problem?                        → closed lines 6 to 10
L4  line 11  If not a bigger logo, then what?             → closed line 12
L5  line 17  How do I do that?                            → closed line 18
```

---

## SCRIPT

You reach into a dark cooler and grab a bottle without looking.
You already know it's a Coke.
That's not luck.
It was the brief.
In 1915, Coca-Cola had a problem.
Copycats.
Koka-Nola.
Toka-Cola.
Koke.
Same curly writing, same plain bottle.
You'd think they'd just make the logo bigger.
They made the bottle the logo.
They asked glassmakers for a bottle you'd recognize by feel in the dark.
Or lying broken on the ground.
A glass company in Indiana sent back these curves.
More than a hundred years later, you still don't need the label.
So if you sell anything, make it so people know it's yours with your name covered.
A color, a shape, a way you always do it.
Something they'd know in the dark.
Send this to the friend whose stuff looks like everyone else's.

---

## ELEVENLABS

```text
[curious] You reach into a dark cooler and grab a bottle without looking. You already know it's a Coke. [short pause] That's not luck. It was the brief. [matter-of-fact] In 1915, Coca-Cola had a problem. [sighs] Copycats. Koka-Nola. Toka-Cola. [chuckles] Koke. Same curly writing, same plain bottle. [thoughtful] You'd think they'd just make the logo bigger. [confident] They made the bottle the logo. [serious] They asked glassmakers for a bottle you'd recognize by feel in the dark. Or lying broken on the ground. A glass company in Indiana sent back these curves. [warm] More than a hundred years later, you still don't need the label. [confident] So if you sell anything, make it so people know it's yours with your name covered. A color, a shape, a way you always do it. [happy] Something they'd know in the dark. [playful] Send this to the friend whose stuff looks like everyone else's.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "The lights-out test. Again and again the lights drop, and in the dark only things with a shape of their own still glow as a yellow outline. Plain bottles vanish into the black. The contour bottle stays.",
    "why": "The lesson is to make your thing recognizable without your name on it. Turning the lights off and watching what's still readable is that test, played out on screen, and it comes back on your own product at the end."
  },
  "names": {"friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 2], "title": "The dark cooler",
      "what_we_see": "Near darkness. A cooler lid opens and your hand reaches into black ice. You pull out a bottle and only its curved outline glows yellow, the unmistakable contour shape.",
      "camera": "Close and low inside the cooler, looking up at the hand",
      "transition_in": "cold open",
      "cast": ["you"], "uses": [], "new": ["drinks_cooler", "contour_bottle"],
      "cues": [{"word": "dark", "what": "the lid opens on black"}, {"word": "grab", "what": "the hand closes on a bottle"}, {"word": "Coke", "what": "the bottle's outline glows yellow"}],
      "on_screen": [{"type": "big_text", "text": "You'd know it in the dark", "at": "You"}]
    },
    {
      "id": 2, "lines": [3, 4], "title": "The brief",
      "what_we_see": "Lights up on white. The bottle stands alone and a card slides down beside it reading THE BRIEF, 1915.",
      "camera": "Straight on, medium",
      "transition_in": "flash",
      "cast": [], "uses": ["contour_bottle", "text_card"], "new": [],
      "cues": [{"word": "luck", "what": "the bottle turns slowly"}, {"word": "brief", "what": "the card drops in"}],
      "on_screen": []
    },
    {
      "id": 3, "lines": [5, 10], "title": "Copycats",
      "what_we_see": "1915. A row of plain straight-sided bottles. Each new one pops up with its own label as it's named: KOKA-NOLA, TOKA-COLA, KOKE, and they all look the same as the real one at the end of the row.",
      "camera": "Slow track along the row",
      "transition_in": "cut",
      "cast": [], "uses": ["text_card"], "new": ["plain_bottle"],
      "cues": [{"word": "1915", "what": "the date card"}, {"word": "Koka", "what": "the first copycat pops up"}, {"word": "Toka", "what": "the second pops up"}, {"word": "Koke", "what": "the third pops up"}, {"word": "Same", "what": "all four bottles wobble in sync"}],
      "on_screen": []
    },
    {
      "id": 4, "lines": [11, 12], "title": "The bottle is the logo",
      "what_we_see": "One plain bottle's label grows comically huge. On 'bottle' the label shrinks away and the bottle morphs into the contour shape.",
      "camera": "Straight on, close",
      "transition_in": "cut",
      "cast": [], "uses": ["plain_bottle", "contour_bottle"], "new": [],
      "cues": [{"word": "bigger", "what": "the label balloons"}, {"word": "logo", "what": "the label shrinks and the bottle morphs into the curves"}],
      "on_screen": []
    },
    {
      "id": 5, "lines": [13, 14], "title": "Lights out, then broken",
      "what_we_see": "The lights drop. The plain bottles vanish into black and only the contour bottle's yellow outline stays. On 'broken' it drops and shatters into a few curved pieces on the floor, and the pieces still glow in that same curve.",
      "camera": "Straight on, then a tilt down to the floor",
      "transition_in": "cut",
      "cast": [], "uses": ["contour_bottle", "plain_bottle"], "new": [],
      "cues": [{"word": "dark", "what": "lights out, only the outline glows"}, {"word": "broken", "what": "the bottle shatters into glowing curved pieces"}],
      "on_screen": [], "screenshot": true
    },
    {
      "id": 6, "lines": [15, 15], "title": "Indiana",
      "what_we_see": "Lights back. A card reads TERRE HAUTE, INDIANA, and a yellow line draws the contour shape in the air, curve by curve.",
      "camera": "Straight on",
      "transition_in": "cut",
      "cast": [], "uses": ["text_card", "contour_bottle"], "new": [],
      "cues": [{"word": "Indiana", "what": "the card drops in"}, {"word": "curves", "what": "the line traces the bottle"}],
      "on_screen": []
    },
    {
      "id": 7, "lines": [16, 16], "title": "A hundred years later",
      "what_we_see": "A modern shelf of bottles. The contour bottle has no label at all and still stands out instantly.",
      "camera": "Slow push along the shelf",
      "transition_in": "cut",
      "cast": [], "uses": ["contour_bottle", "plain_bottle"], "new": [],
      "cues": [{"word": "hundred", "what": "the shelf appears"}, {"word": "label", "what": "the contour bottle's label fades and it still glows"}],
      "on_screen": []
    },
    {
      "id": 8, "lines": [17, 19], "title": "Your name covered",
      "what_we_see": "Your stall: your product boxes have a bold yellow stripe and a rounded shape. A hand covers your name on the box. The lights drop, and your box still glows as a yellow outline while the plain grey boxes around it vanish.",
      "camera": "Medium on the stall, push in on the box",
      "transition_in": "fade",
      "cast": ["you"], "uses": ["store_table"], "new": [],
      "cues": [{"word": "covered", "what": "a hand covers the name"}, {"word": "shape", "what": "the stripe and shape light up"}, {"word": "dark", "what": "lights out, only your box glows"}],
      "on_screen": [{"type": "x_check", "wrong": "Same as everyone, bigger logo", "right": "Known with the name covered", "at": "sell"}]
    },
    {
      "id": 9, "lines": [20, 20], "title": "Jay's grey boxes",
      "what_we_see": "Jay behind a stall of plain grey boxes that look exactly like the stall next to his.",
      "camera": "Wide, straight on",
      "transition_in": "cut",
      "cast": ["friend"], "uses": ["store_table"], "new": [],
      "cues": [{"word": "else's", "what": "the stalls blur into one"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "contour_bottle", "kind": "prop", "name": "Contour bottle", "description": "A curvy glass soda bottle in the classic contour shape: narrow neck, a bulging ribbed middle, a pinched waist and a wider base. No logo. About 0.35 high in a hand, scales up for hero shots. Can show just a glowing yellow outline in the dark, and can break into a few curved glowing pieces.", "reuse": "Distinctive design, brand recognition, packaging, the lights-out test"},
    {"id": "plain_bottle", "kind": "prop", "name": "Plain bottle", "description": "A straight-sided generic glass bottle with a paper label band whose text can change, the same height as the contour bottle. Fades into the dark when the lights go out.", "reuse": "Copycats, generic products, anything that looks like everyone else's"},
    {"id": "drinks_cooler", "kind": "prop", "name": "Drinks cooler", "description": "A white picnic cooler box with a hinged lid, about knee height, full of dark ice and bottles. The inside can go fully dark.", "reuse": "Drinks, picking without looking, summer and party scenes"}
  ]
}
```

---

## CAPTION





Why doesn't this need a label?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #branding #packaging #design

---

## FACT SHEET & SOURCES

| Claim, as the script tells it | What it rests on | Source (link) | Status |
|---|---|---|---|
| "In 1915, Coca-Cola had a problem. Copycats. Koka-Nola. Toka-Cola. Koke." | Imitators sold rival drinks in look-alike packaging; named copycats include Koka-Nola, Ma Coca-Co, Toka-Cola and Koke | [The Coca-Cola Company: history of the contour bottle](https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle) | Confirmed |
| "Same curly writing, same plain bottle." | The copycats copied or lightly altered the Spencerian script logo; the drinks came in look-alike straight-sided bottles | [The Coca-Cola Company](https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle) | Confirmed |
| "They asked glassmakers for a bottle you'd recognize by feel in the dark. Or lying broken on the ground." | 1915 brief to eight to ten glass makers: a "bottle so distinct that you would recognize it by feel in the dark or lying broken on the ground" | [The Coca-Cola Company](https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle) | Confirmed |
| "A glass company in Indiana sent back these curves." | The Root Glass Company of Terre Haute, Indiana, won; patent granted 16 November 1915 | [The Coca-Cola Company](https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle); [IUPUI public history](https://publichistory.iupui.edu/items/show/614) | Confirmed |
| "More than a hundred years later, you still don't need the label." | The shape was registered as a trademark in its own right (1961) and is still used | [The Coca-Cola Company](https://www.coca-colacompany.com/about-us/history/the-history-of-the-coca-cola-contour-bottle) | Confirmed |

### ⚠️ Check before posting
- The brief's exact wording varies between sources ("recognize it by feel in the dark"). The script paraphrases it and doesn't put it in quote marks.
- The video shows a generic curvy bottle with no logo, never the real trademark artwork.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=packaging tier=1 format=F7 hook=N12 named_tool=no proof=none objection=no character=none ending=E6 cta=share -->
