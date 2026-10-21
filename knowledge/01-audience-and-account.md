# 01 — The Audience, the Account and the Product

> Pivoted on 2026-10-22: from "networking for young founders" to **making your business better**, with a product to sell from the views: **the Playbook**. Networking is now one chapter of it, not the whole account.

## Who we're talking to
**Young founders, roughly 18 to 30, running a small business they want to grow:** an agency, freelancing, coaching, a service, a small product brand, a local business. They're good at the work. They're not natural marketers, salespeople or networkers. They undercharge, wait for clients to find them, describe their offer like everyone else, and go quiet on the clients they do have.

What they want, in their words:
- "I want more clients without begging for them."
- "I want to charge more and have people say yes."
- "I want people to remember my business and send others to it."

What they fear: looking desperate, being ignored, being the cheap option, wasting months on things that don't move the business.

**The "my business" test:** every script shows the viewer one thing they can use in their own business this week. If a 22-year-old with a new agency or a small online shop can't picture doing it, rewrite it.

## What the account is
- **Handle:** @f___a___c___t___s (Instagram first; TikTok to follow). Bio text lives in `config.json` → `playbook.bio`.
- **Promise:** one move a video that makes your business better: how to get clients, sell, price, stand out and keep customers. Often stolen from the brands that do it best.
- **Identity the viewer is buying:** "I run my business like the smart brands do."
- **The product: the Playbook** (working name; pick a distinct final name before launch, and never "the networking playbook", which is @theoryofbehaviour's). Every move from the videos, collected, expanded and sold through the link in bio. It writes itself from the content: every script adds its move to `product/playbook.md`.
- **Recurring cast:** the videos are animated with a fixed 3D cast (`12-visual-storyboard.md`), not a talking head.

## Two pillars, one niche

| Pillar | What it is | Formats | Reference accounts |
|---|---|---|---|
| **The Brand X-ray** | A famous brand's trick, and how to steal it for your business | F7 (`15-brand-xray.md`) | @decoyreport |
| **The Move** | One real business moment (a client goes quiet, a price objection, a room full of strangers, naming an offer) and the exact move | F1 to F6 (`06-formats.md`) | @theoryofbehaviour (networking moves); the playbook account you found (import its export when you have it) |

Mix them, and never post the same pillar three times in a row. Every script is tagged with its pillar and its Playbook chapter.

## The Playbook's chapters (also the topic map)

| # | Chapter | What's in it |
|---|---|---|
| 1 | **Get clients** | Outreach, referrals, networking, intros, being remembered |
| 2 | **Sell** | Sales calls, objections, follow-ups, closing, getting to yes |
| 3 | **Price and package** | Pricing, anchors, offers, naming, tiers, entry offers |
| 4 | **Stand out** | Branding, positioning, packaging, being recognizable |
| 5 | **Keep clients** | Onboarding, updates, reports, reviews, retention |
| 6 | **Get seen** | Content, word of mouth, things people share |

Aim to cover every chapter every couple of weeks, so the Playbook fills evenly.

## The funnel: two phases (`config.json` → `playbook.status`)

1. **`coming_soon` (now).** Bio: "Playbook coming soon" (exact text in `playbook.bio`). **Videos never mention the Playbook or the link.** They end on the payoff and a share prompt, which is what both @theoryofbehaviour breakouts did. Captions carry one quiet line near the end (`playbook.caption_line`). The checker fails a script that mentions the Playbook while it's coming soon.
2. **`live` (once there's traction, and only when the owner says so).** Bio: the link. Videos: the last line becomes the Playbook CTA (`playbook.live_video_cta`), either after the share prompt or in place of it: test both. Captions switch to `playbook.live_caption_line`. Change the status in `config.json`; the checker and the docs follow it.

Traction is the owner's call. A sensible bar: several posts past 100k views, or steady follower growth week on week.

## How we win
1. **Volume:** 2 to 3 reels a day.
2. **Script quality:** every script passes `10-quality-checklist.md` and leads the viewer from the first word (`04-lesson-engine.md`).
3. **A look of our own:** the 3D cast.
4. **Usefulness:** every video works as a free sample chapter. Specific, usable this week, honest. That's what makes someone want the full Playbook.
5. **Originality:** never reuse a reference account's tools, acronyms, examples, lines or sign-offs. Their transcripts in `examples/` are for structure only.
