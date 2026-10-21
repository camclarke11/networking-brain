# 05 — Endings, CTAs and Captions

**Write the ending first.** The last spoken line before the share prompt is the one people repeat, screenshot and send. Then build the hook so the ending answers it.

---

## Ending types

| Code | Type | Example (shape only) | When |
|---|---|---|---|
| **E1** | **Quotable reframe**: a paired contrast that flips the viewer's belief | "People forget what you do. They remember what you noticed about them." | Default. Works for almost every format. |
| **E2** | **Direct instruction**: one line telling them what to do instead | "So stop asking people for their time. Ask what they think." | When the move itself is the takeaway (F3, F5). |
| **E3** | **Tease / open question** | "If the excitement fades, why do we want something else straight away?" | Avoid. It sends people away unsatisfied (330 views). |
| **E4** | **Before → after**: the viewer at the start versus now | "You walked in knowing nobody. Now every conversation starts with, oh, you're Daniel's friend." | Best for F2 and scene-heavy scripts. Breakout ending. |
| **E6** | **The seller's rule** (F7): "So if you sell anything, [one concrete move]." | "So if you sell anything, put it in their hands first." | Default for F7: median 109k across 16 @decoyreport posts. |
| **E5** | **Identity line**: who the viewer becomes | "That's how you go from the guy they met to the guy they call." | Strong as the line before the share prompt. |

**Rules**
- The payoff is short (under 20 words) and on its own line or two.
- It closes the hook's loop. If the hook asked "who?", the ending shows that person's effect.
- **It calls back to line 1**: a word or a picture from the hook comes back changed (the angle → "That angle was never about the screen"; Elliott's £26 robbery → "still inside" 52 years later). The video then loops cleanly on replay.
- No moral, no "the lesson here is". Elliott's Malone Lam story got 662k ending on the open question and 51k when a version spelled out the lesson.
- No summary ("So to recap…"). No "and that's how you network".

---

## The call to action (one line, after the payoff)

**The Playbook phase decides the CTA** (`config.json` → `playbook.status`, `01-audience-and-account.md`):
- **`coming_soon` (now):** never mention the Playbook, a link or the bio in the video. End on the payoff and a share prompt. The caption carries `playbook.caption_line`. The checker fails a script that breaks this.
- **`live`:** the last spoken line is `playbook.live_video_cta` ("The full playbook's in my bio."), straight after the payoff, or after the share prompt. Test both orders; keep it to one short line. The caption switches to `playbook.live_caption_line`.


| Code | CTA | Use |
|---|---|---|
| `share` ⭐ | **Send this to [one specific friend].** "Send this to the friend you always drag to events." | **Default.** Five reference posts end this way, median about 22k, both breakouts. |
| `comment` | One easy question they can answer in three words. "Comment the worst opener you've heard." | When the topic invites stories. |
| `follow` | "Follow so you don't miss the playbook." | Only in the caption while the Playbook is coming soon. |
| `playbook` | `playbook.live_video_cta` | Only once `playbook.status` is `live`. |
| `caption` | "Read the caption for the full breakdown." | When the caption holds a list they'll want to save. |
| `none` | | Fine when the payoff line is strong enough to end on. |

**Make the share friend specific and a little funny:** the friend who still charges by the hour, the friend whose business is called something solutions, the friend whose clients always text "any update?", whoever's coming with you tonight. "Send this to a friend" is too vague to trigger anyone.

One spoken CTA maximum.

---

## The caption is a teaser (rewritten 2026-10-22)

The caption's only job is to make someone want to watch. **It never says what the video is about:** no brand name, no story, no fact from the video, no answer, no move. It's one line, usually a question, that applies to the viewer's own business or life and can only be answered by watching.

**Format:**
```
[One teaser line, under 125 characters. A question, or a short claim plus a question.]

[Playbook line for the current phase (config.json playbook: caption_line now, live_caption_line after launch).]

#smallbusiness #entrepreneur [+1–3 topical tags]
```

**Shapes that work** (all from our captions):
- **The hidden reason:** "Why would a shop hide its best deal?" (Costco's chicken at the back)
- **The thing you've already done:** "You've probably done free advertising for a billion-dollar company. Did you even notice?" (Spotify Wrapped)
- **The wrong assumption:** "Your clients don't hate waiting. So what do they hate?" (the Domino's tracker)
- **Point at the picture:** "Why doesn't this need a label?" (the Coke bottle, which the viewer can see)
- **The cost you didn't notice:** "You've probably paid extra for a word that doesn't mean anything. Do you know which one?" (Häagen-Dazs)

**Rules**
- **Hide the subject.** No brand, person, place, date or number from the video. The first frame shows the brand; the caption doesn't need to.
- **Hide the answer.** No rule, payoff, "here's how", list or steps. The full breakdown belongs in the Playbook.
- **Make it about them.** "You" and "your business" beat "this brand". A viewer should feel the question is already theirs.
- **True, and no bigger than the payoff.** Hedge with "probably" when it might not apply to everyone. Never promise what the video doesn't deliver.
- **One line.** Under 125 characters, so it all shows before "more". No warm-up, no "watch till the end".
- 3 to 5 hashtags: always `#smallbusiness #entrepreneur`, plus one to three topical ones from `config.json` → `hashtags.topical` (topic words are fine there; they're for search, not the hook).
- The checker warns when a caption names something from the script, has a list, gives the move away or runs past one line.
- (Before 2026-10-22 captions held the full saveable breakdown, the @theoryofbehaviour style. We switched to teasers to protect watch time; compare saves, watch time and comments once our own data comes in, and update `00-what-performs.md` §6.)
