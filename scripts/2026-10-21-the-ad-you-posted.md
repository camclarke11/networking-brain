# The ad you posted

**Format:** F7 Brand X-ray
**Tier:** 1 (any freelancer or agency can turn a client report into something the client wants to post)
**Situation:** sending clients a monthly report nobody reads, let alone shares
**A vs B:** a report about your work → a recap about them that they want to post
**Length:** 150 words ≈ 51s (at 175 wpm)
**Hook code:** N12 · **Ending code:** E6 · **Named tool:** none
**Pillar:** Brand X-ray · **Playbook chapter:** Get seen

---

## TITLE / COVER OPTIONS
1. Spotify Wrapped is an ad you post for free
2. Why everyone posts the same screenshot
3. Nobody shares your ad. They share themselves

Cover (video/out/2026-10-21-the-ad-you-posted-cover.jpg): `python3 tools/make_video.py scripts/2026-10-21-the-ad-you-posted.md cover --at 38.6 --title "Spotify Wrapped|is an ad you post" --highlight ad --shift 430 --size 140`

---

## HOOK OPTIONS
**A (used, N12):** It's early December and every story you tap is the same screenshot.
**B (N9):** Spotify gets millions of people to post its ad every December. For free.
**C (N12):** You've posted an ad for Spotify. You just didn't call it that.

---

## LOOP MAP

```text
L1  line 1   Why is everyone posting the same thing?   → surface line 7, full answer line 22
L2  line 5   How did they get it for free?             → closed lines 7, 8
L3  line 9   Why would anyone happily post an ad?      → closed lines 10 to 14
L4  line 15  How big is this?                          → closed lines 15, 16
L5  line 17  What does that look like for my clients?  → closed lines 18 to 20
```

---

## SCRIPT

It's early December and every story you tap is the same screenshot.
Someone's top five artists.
Someone's minutes listened.
Someone's top song, which is a bit embarrassing.
Spotify didn't pay for a single one of those posts.
You'd think Wrapped is just a fun recap for the fans.
It's an ad.
Posted by you.
And you're happy to post it.
Because it isn't really about Spotify.
It's about you.
Your taste.
Your weird year.
So you share it the way you'd never share an ad.
In 2022, more than 156 million people went through theirs.
And every share put Spotify's name in front of their friends.
So if you sell anything, give your customers something about themselves worth posting.
Their results.
Their numbers.
Their before and after.
Because nobody screenshots your ad.
They screenshot themselves.
Send this to the friend whose clients get the same boring report every month.

---

## ELEVENLABS

```text
[curious] It's early December and every story you tap is the same screenshot. Someone's top five artists. Someone's minutes listened. [chuckles] Someone's top song, which is a bit embarrassing. [thoughtful] Spotify didn't pay for a single one of those posts. You'd think Wrapped is just a fun recap for the fans. [short pause] It's an ad. Posted by you. [matter-of-fact] And you're happy to post it. Because it isn't really about Spotify. [warm] It's about you. Your taste. Your weird year. So you share it the way you'd never share an ad. [serious] In 2022, more than 156 million people went through theirs. And every share put Spotify's name in front of their friends. [confident] So if you sell anything, give your customers something about themselves worth posting. Their results. Their numbers. Their before and after. [happy] Because nobody screenshots your ad. They screenshot themselves. [playful] Send this to the friend whose clients get the same boring report every month.
```

---

## STORYBOARD

```json
{
  "version": 2,
  "concept": {
    "metaphor": "A billboard made of people. Everyone in a crowd holds up a phone with their own recap card, and as the camera pulls back, all those little screens line up into one giant billboard nobody paid for.",
    "why": "The lesson is that people share things about themselves, and every share carries your name. A billboard built out of the crowd's own phones shows the ad and who posted it in one picture."
  },
  "names": {"friend": "Jay"},
  "shots": [
    {
      "id": 1, "lines": [1, 4], "title": "The same screenshot",
      "what_we_see": "You thumb through stories on your phone. Big recap cards flick past one after another in the same bright style: TOP 5 ARTISTS, MINUTES LISTENED 48,213, TOP SONG with a blushing face.",
      "camera": "Close on you and the phone, the cards large in front",
      "transition_in": "cold open",
      "cast": ["you"], "uses": ["phone"], "new": ["recap_card"],
      "cues": [{"word": "screenshot", "what": "the first card flicks in"}, {"word": "artists", "what": "TOP 5 ARTISTS card"}, {"word": "minutes", "what": "MINUTES LISTENED card"}, {"word": "embarrassing", "what": "TOP SONG card with a blushing face"}],
      "on_screen": [{"type": "big_text", "text": "Every story, the same screenshot", "at": "It's"}]
    },
    {
      "id": 2, "lines": [5, 5], "title": "Not one paid",
      "what_we_see": "A stack of recap cards on white space, each with a little price tag reading $0.",
      "camera": "Straight on, slight push",
      "transition_in": "cut",
      "cast": [], "uses": ["recap_card", "price_tag"], "new": [],
      "cues": [{"word": "pay", "what": "the $0 tags swing in"}, {"word": "posts", "what": "the stack fans out"}],
      "on_screen": []
    },
    {
      "id": 3, "lines": [6, 8], "title": "It's an ad",
      "what_we_see": "A single card reading FAN RECAP flips over like a sign to read AD. Then you're holding it up on your phone, and a label points at you.",
      "camera": "Close on the card, pull back to you holding it",
      "transition_in": "cut",
      "cast": ["you"], "uses": ["recap_card", "text_card", "phone"], "new": [],
      "cues": [{"word": "recap", "what": "the card reads FAN RECAP"}, {"word": "ad", "what": "it flips to AD"}, {"word": "you", "what": "you hold it up"}],
      "on_screen": [{"type": "label", "text": "Posted by you", "target": "you", "at": "Posted"}]
    },
    {
      "id": 4, "lines": [9, 13], "title": "It's about you",
      "what_we_see": "Your card turns toward you like a mirror and shows your own face, your taste, your weird year: a tiny pill version of you with headphones and a funny top song.",
      "camera": "Over the card toward you, then close on the card",
      "transition_in": "cut",
      "cast": ["you"], "uses": ["recap_card", "phone"], "new": [],
      "cues": [{"word": "happy", "what": "you grin"}, {"word": "you", "what": "the card shows your face"}, {"word": "taste", "what": "your top artists appear"}, {"word": "weird", "what": "your strange top song appears"}],
      "on_screen": []
    },
    {
      "id": 5, "lines": [14, 16], "title": "A billboard made of people",
      "what_we_see": "A crowd of people each hold up a phone with their own recap card. The camera pulls back and up until all the little screens line up into one giant billboard. On '156' the screens flip, one by one, into 156 MILLION.",
      "camera": "Low in the crowd, then a long crane up and back",
      "transition_in": "push",
      "cast": ["crowd", "you"], "uses": ["recap_card", "phone"], "new": ["phone_wall"],
      "cues": [{"word": "share", "what": "everyone lifts their phone"}, {"word": "2022", "what": "the crane up starts"}, {"word": "156", "what": "the screens flip one by one into a 156 MILLION billboard"}, {"word": "friends", "what": "the billboard glows"}],
      "on_screen": [], "screenshot": true
    },
    {
      "id": 6, "lines": [17, 20], "title": "Your client's recap",
      "what_we_see": "You at a laptop building a recap card for a client. The card fills with their results: 41 NEW LEADS, REACH UP 3X, and a before and after. The client grabs their phone and posts it straight away.",
      "camera": "Over your shoulder, then the client in close-up posting",
      "transition_in": "fade",
      "cast": ["you", "stranger_a"], "uses": ["laptop", "store_table", "recap_card", "phone"], "new": [],
      "cues": [{"word": "results", "what": "41 NEW LEADS appears"}, {"word": "numbers", "what": "REACH UP 3X appears"}, {"word": "after", "what": "the before and after slides in and the client posts it"}],
      "on_screen": [{"type": "x_check", "wrong": "Monthly report, page 1 of 14", "right": "Your month, made to post", "at": "sell"}]
    },
    {
      "id": 7, "lines": [21, 22], "title": "Ad versus you",
      "what_we_see": "A plain billboard advert stands ignored while people walk past. Next to it a person holds up their own recap card and everyone crowds round to look.",
      "camera": "Wide, both side by side",
      "transition_in": "cut",
      "cast": ["stranger_a", "stranger_b", "crowd"], "uses": ["recap_card", "text_card"], "new": [],
      "cues": [{"word": "ad", "what": "people walk past the billboard"}, {"word": "themselves", "what": "everyone crowds round the recap card"}],
      "on_screen": []
    },
    {
      "id": 8, "lines": [23, 23], "title": "Jay's report",
      "what_we_see": "Jay sends a grey fourteen-page report. On the other side his client yawns and drops the phone face down.",
      "camera": "Medium on Jay, quick cut to the client",
      "transition_in": "cut",
      "cast": ["friend", "stranger_b"], "uses": ["phone", "laptop"], "new": [],
      "cues": [{"word": "boring", "what": "the client yawns"}, {"word": "month", "what": "the phone goes face down"}],
      "on_screen": [{"type": "label", "text": "Jay", "target": "friend", "at": "friend"}]
    }
  ],
  "new_assets": [
    {"id": "recap_card", "kind": "effect", "name": "Recap card", "description": "A tall phone-shaped story card in bold color blocks with a big headline number or list (TOP 5 ARTISTS, MINUTES LISTENED, 41 NEW LEADS). Cards can flick in like stories, flip like a sign, and show a tiny face. Works on a phone screen in 3D or flat on screen.", "reuse": "Year-end recaps, client reports, results, social proof, anything people share"},
    {"id": "phone_wall", "kind": "effect", "name": "Phone billboard", "description": "A crowd of pill figures each holding up a glowing phone. From far away the screens line up into one big billboard that can show a number or a word, built from each phone's color block.", "reuse": "Word of mouth, virality, user-generated content, a crowd doing your marketing"}
  ]
}
```

---

## CAPTION





You've probably done free advertising for a billion-dollar company. Did you even notice?

The full playbook is coming soon. Follow so you don't miss it.

#smallbusiness #entrepreneur #marketing #agency #freelancing

---

## FACT SHEET & SOURCES

| Claim, as the script tells it | What it rests on | Source (link) | Status |
|---|---|---|---|
| "Wrapped" (the personal year-end recap, released each December) | Spotify ran a platform-wide "Year in Music" in 2015, then personal "Wrapped" stats for every user from December 2016 | [Wikipedia: Spotify Wrapped](https://en.wikipedia.org/wiki/Spotify_Wrapped) | Confirmed |
| "Spotify didn't pay for a single one of those posts." | The posts are users' own shares of their Wrapped cards (organic, not paid placements) | [TIME, 2023 guide to Wrapped](https://time.com/6340656) | Fair |
| "In 2022, more than 156 million people went through theirs." | A Spotify spokesperson told TIME that more than 156 million users engaged with Wrapped in 2022 | [TIME](https://time.com/6340656) | Confirmed |
| "And every share put Spotify's name in front of their friends." | Wrapped share cards carry Spotify's branding | [Cannes Lions: Wrapped case study](https://www.lovethework.com/work-awards/campaigns/wrapped-design-1531758) | Confirmed |

### ⚠️ Check before posting
- Cannes Lions lists 66.5 million shares for the 2022 campaign. That's an awards entry, so the script doesn't use it.
- The video shows generic color-block recap cards, never Spotify's logo or real Wrapped artwork.
- The client numbers in shot 6 (41 new leads, reach up 3x) are an on-screen example, not a claim.

<!-- Labels for data/<handle>/post-tags.csv once posted:
category=brand_strategy tier=1 format=F7 hook=N12 named_tool=no proof=none objection=no character=none ending=E6 cta=share -->
