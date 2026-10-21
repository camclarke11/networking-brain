# 12 — Visual Direction and Storyboard

Every script ships with a storyboard. You're the director, not a clerk filling in a list: pick **one visual metaphor** for the video, then invent whatever shows it best. The kit sets the look and the cast. Everything else is open.

Three files work together:
- **This file:** the cast, the creative rules, the must-haves.
- **`visuals/library.json`:** every set, prop, effect and metaphor we've already used. **Reuse before you invent.** `python3 tools/library.py list` prints it.
- **`templates/storyboard.schema.json`:** the storyboard format. `python3 tools/check_script.py` checks it.

The narration is recorded **before** the visuals are made (text to speech or a real voice). So the storyboard never says seconds. It says which lines a shot covers, and pins key moments to **a spoken word** ("the door slams on *host*"). Once the audio exists, `tools/align.py` turns those words into exact times. See §6.

---

## 1. The look

Minimal and set by the kit (`knowledge/13-video-production.md` §2): off-white space, pill figures, one yellow accent. The wrong move drains to cold grey, the right move lifts to warm light. Everything else is your call.

## 2. The cast

| id | Default name | Use for |
|---|---|---|
| `you` | never named | The viewer stand-in, the business owner. Every video. |
| `connector` | Marco | The well-connected one: the guy who knows half the room, a partner who refers work |
| `big_name` | Lena | The big client or the busy decision-maker you want a yes from |
| `friend` | Jay | Your mate who also runs a business: share prompts, the "don't do this" contrast |
| `stranger_a`, `stranger_b`, `stranger_c` | whatever the script says | Customers, clients, prospects, staff, the founder in a brand story (Reuben, Mike) |
| `professor` | the Professor | Rare: an expert who is a character *in* the scene. Never to cite a study |
| `crowd` | none | Background people |

The narrator is the only voice.

## 3. Creative rules

1. **One metaphor per video.** Pick the picture that makes the lesson clearer. Test it: could someone explain the lesson just by describing what they saw? If the metaphor is only pretty, find another. Write it in `concept.metaphor`, and why it works in `concept.why`.
2. **Start real, then break reality.** The hook frame shows the real situation (the shop, the product, the call, the quote on a phone, the event). The metaphor arrives in the first few seconds and escalates from there. The biggest visual surprise lands on the objection or the re-hook, not on line 1.
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
| `study_card` | `year`, `who`, `finding` | Retired for new scripts: the script doesn't cite, so the screen doesn't either. Kept for old videos. Show a striking number with `big_text` |
| `dm_screen` | `from`, `messages` (list of `{ "side": "me" | "them", "text" }`) | DMs and texts |
| `label` | `text`, `target` (cast id) | Naming someone |
| `stamp` | `text` | A short verdict slammed onto the frame ("INTERVIEW OVER") |

Add `"at": "<word>"` to pin a component to the spoken word it appears on. Leave it out to show the component for the whole shot.

## 5. Must-haves (the checker enforces these)

1. Every spoken line belongs to exactly one shot, in order.
2. Shot 1 shows the situation in line 1 and carries a `big_text` with the short hook.
3. The exact words the viewer will say appear on screen (`quote_bubble`, `x_check` or `dm_screen`).
4. No `study_card` in new scripts (the checker warns). If the scene runs an experiment, show the experiment happening.
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
