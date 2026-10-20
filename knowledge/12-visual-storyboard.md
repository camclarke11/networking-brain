# 12 — Visual Direction and Storyboard

Every script ships with a storyboard. You're the director, not a clerk filling in a list: pick **one visual metaphor** for the video, then invent whatever shows it best. The **look** and the **cast** are locked so every video is unmistakably ours. Everything else is open.

Three files work together:
- **This file:** the locked look, the cast, the creative rules, the must-haves.
- **`visuals/library.json`:** every set, prop, effect and metaphor we've already used. **Reuse before you invent.** `python3 tools/library.py list` prints it.
- **`templates/storyboard.schema.json`:** the storyboard format. `python3 tools/check_script.py` checks it.

The narration is recorded **before** the visuals are made (text to speech or a real voice). So the storyboard never says seconds. It says which lines a shot covers, and pins key moments to **a spoken word** ("the door slams on *host*"). Once the audio exists, `tools/align.py` turns those words into exact times. See §6.

---

## 1. The locked look (never changes)

Until the design pass replaces these with exact values, this is the brief:

- **Style:** stylised 3D, soft and slightly toy-like (rounded shapes, matte clay-like materials). Never realistic humans, never stock footage.
- **Light:** warm key light, soft shadows, shallow depth of field.
- **Palette:** one neutral base (warm greys and off-white), one brand accent (warm gold) and one "wrong" tone (cold grey-blue).
- **Visual grammar** (the same in every video, so viewers learn it):
  - **The wrong move** drains colour: grey-blue, desaturated, the room freezes or stalls.
  - **The right move** glows: warm gold light, colour floods back.
  - **The viewer's fear** (the objection beat) is shown as an exaggerated, slightly absurd version of the fear.
  - **Proof** shows scale: the Professor with the study card, plus a picture of the size of the study.
  - **The payoff** resolves the metaphor (the door opens, the bubble lands, the ball comes back).
- **Typography:** only the on-screen components in §4. They are the brand's design system, so their look never changes.
- **Captions:** the spoken words, added automatically from the audio. Never put them in the storyboard.

## 2. The cast (locked, so viewers recognise them)

| id | Who | Default name | Look | Use for |
|---|---|---|---|---|
| `you` | The viewer stand-in, early 20s, starting a business | never named | Same hoodie and colour in every video | Every video. The main character. |
| `connector` | The guy who knows half the room | Marco | Open blazer, always mid-wave | Intros, who to talk to, being introduced |
| `big_name` | The busy, successful person you want to meet | Lena | Smart, phone in hand, slightly hard to reach | Cold DMs, coffee asks, talking to someone senior |
| `friend` | Your mate who comes along | Jay | Casual, bit chaotic, comic relief | Share prompts, contrasts, "the friend who…" |
| `stranger_a`, `stranger_b`, `stranger_c` | Other people | unnamed, or a name the script gives | Three distinct generic looks | Conversations, openers, reading signals |
| `professor` | Appears only for study citations | the Professor | Glasses, lab coat over a hoodie | The proof beat |
| `crowd` | Background people | none | Simple silhouettes | Busy rooms, wide shots |

- The cast's faces, bodies and default outfits never change. A costume for one video (Priya in an apron, you in a detective coat) is a new asset of kind `costume`.
- A script may give a stranger a name ("Say you meet Priya"). Recurring cast keep their default names.
- The narrator is the only voice. Nobody else's voice is heard.

## 3. Creative rules

1. **One metaphor per video.** Pick the picture that makes the lesson clearer. Test it: could someone explain the lesson just by describing what they saw? If the metaphor is only pretty, find another. Write it in `concept.metaphor`, and why it works in `concept.why`.
2. **Start real, then break reality.** The hook frame shows the real situation (the event, the DM, the coffee). The metaphor arrives in the first few seconds and escalates from there. The biggest visual surprise lands on the objection or the re-hook, not on line 1.
3. **Show what the words don't say.** A shot that only illustrates the line ("she says skincare brand" → she talks) is wasted. Add a layer: a reaction, a transformation, a joke, the metaphor moving.
4. **Something changes every 2 to 4 seconds.** A cut, a camera move, a transformation, or a prop arriving. A shot can cover several lines, but it can't sit still.
5. **One screenshot moment.** At least one frame someone would pause on or send to a friend. Mark it with `"screenshot": true`.
6. **Reuse before you invent.** Check `visuals/library.json` first. Reuse a set, prop or effect if one fits. A metaphor can come back too: a recurring metaphor (the door) becomes part of the account's language. Invent new things when they make the video clearly better. Aim for 3 or fewer new assets once the library has 20 or more items.
7. **Describe new things so they can be built once.** For every new asset: what it is, its shape, material and size next to a character, how it moves, and what else it could be reused for.
8. **Pin the big moments to words.** Every transformation, slam, glow or reveal is a `cue` pinned to the exact spoken word it lands on. That's how the visuals hit the audio.
9. **Stay kind and clean.** No real people's faces, no brand logos, no gore, nothing that mocks the viewer. Comic, not cruel.

## 4. On-screen components (the brand's design system)

These are the only graphics. The scene around them is free. A shot can have more than one.

| type | Fields | Use |
|---|---|---|
| `big_text` | `text` | The hook text on frame one (4 to 9 words), or a payoff line |
| `quote_bubble` | `speaker` (cast id), `text` | The exact words someone says |
| `x_check` | `wrong`, `right` | The swap: what everyone says vs what to say |
| `tool_card` | `title`, `items` (list), `highlight` (index or null) | Naming a tool or steps, with one step lit at a time |
| `study_card` | `year`, `who`, `finding` | Every study citation |
| `dm_screen` | `from`, `messages` (list of `{ "side": "me" | "them", "text" }`) | DMs and texts |
| `label` | `text`, `target` (cast id) | Naming someone |
| `stamp` | `text` | A short verdict slammed onto the frame ("INTERVIEW OVER") |

Add `"at": "<word>"` to pin a component to the spoken word it appears on. Leave it out to show the component for the whole shot.

## 5. Must-haves (the checker enforces these)

1. Every spoken line belongs to exactly one shot, in order.
2. Shot 1 shows the situation in line 1 and carries a `big_text` with the short hook.
3. The exact words the viewer will say appear on screen (`quote_bubble`, `x_check` or `dm_screen`).
4. Any study in the script gets a `study_card`, with `professor` in that shot.
5. The share prompt's shot has `friend` in it, usually doing the thing the prompt names.
6. Every cast id is from §2. Every reused asset (`uses`) exists in the library. Every new asset is described in `new_assets`, isn't already in the library, and goes under `new` in the first shot it appears in (later shots list it under `uses`).
7. Every `cue` and `at` word is actually spoken in that shot's lines.

## 6. Audio first

1. The script is approved.
2. The narration is recorded: text to speech, or a real voice. A real voice can drift from the script, so if the take changes a word, update the script to match before aligning.
3. Get word timestamps for the recording:
   - **ElevenLabs text to speech** "with timestamps" returns them as part of the voice.
   - **Your own recording:** run it through a speech-to-text tool that gives word timestamps (for example ElevenLabs speech-to-text or Whisper with word timestamps) and save the JSON.
4. Run `python3 tools/align.py scripts/<file>.md <timestamps.json>`. It matches the recording to the script, works out when every line, shot and cue happens, and writes `scripts/<file>.timing.json` for the video engine. It also flags words it couldn't find and shots that run too long.
5. The timing pass: read the alignment report. If a shot runs over about 6 seconds with no cue, or a cue lands too close to the next shot, adjust the storyboard and run it again.

## 7. Example (two shots)

```json
{
  "id": 3,
  "lines": [5, 6],
  "title": "Walking past the door",
  "what_we_see": "You glance past the glowing door and ask your stock question. The door shrinks and shuts with a puff of smoke. The room freezes, Priya drains to grey-blue and a loading spinner turns over her head.",
  "camera": "Medium two-shot, then a slow pull-out as the room freezes",
  "transition_in": "cut",
  "cast": ["you", "stranger_a", "crowd"],
  "uses": ["drinks_table", "glowing_door"],
  "new": ["loading_spinner"],
  "cues": [
    {"word": "host", "what": "the door slams shut"},
    {"word": "over", "what": "the room freezes and drains to grey"}
  ],
  "on_screen": [
    {"type": "quote_bubble", "speaker": "you", "text": "Nice. How do you know the host?"},
    {"type": "stamp", "text": "INTERVIEW OVER", "at": "over"}
  ]
}
```
