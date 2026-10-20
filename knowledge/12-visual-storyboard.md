# 12 — The Visual Storyboard (for the 3D cast)

Every script ships with a storyboard: **one shot per spoken line**, written as JSON, using only the cast, sets, actions and overlays listed here. The video engine renders it with the recurring 3D cast, so anything not on these lists can't be drawn. If a script needs something new, say so in "Check before posting" instead of inventing it.

The full machine schema is `templates/storyboard.schema.json`. `python3 tools/check_script.py <file>` validates a script and its storyboard.

---

## Cast (always the same characters, so viewers recognise them)

| id | Who | Default name | Look (for the 3D team) | Use for |
|---|---|---|---|---|
| `you` | The viewer stand-in, early 20s, starting a business | never named | Same hoodie and colour in every video | Every video. The main character. |
| `connector` | The guy who knows half the room | Marco | Open blazer, always mid-wave | Intros, who to talk to, being introduced |
| `big_name` | The busy, successful person you want to meet | Lena | Smart, phone in hand, slightly hard to reach | Cold DMs, coffee asks, talking to someone senior |
| `friend` | Your mate who comes along | Jay | Casual, bit chaotic, comic relief | Share prompts, contrasts, "the friend who…" |
| `stranger_a`, `stranger_b`, `stranger_c` | Other people at the event | unnamed (or a name the script gives) | Three distinct generic looks | Conversations, openers, reading signals |
| `professor` | Appears only for study citations | the Professor | Glasses, lab coat over a hoodie | The proof beat, with a study card |
| `crowd` | Background people | none | Silhouettes | Busy rooms, wide shots |

Rules:
- A script may give a stranger a name ("Say her name's Priya"). Recurring cast keep their default names so they become familiar.
- Max **three** named characters on screen in one shot, plus `crowd`.
- The `you` character never speaks in a different voice; the narrator is the only voice.

## Sets

| id | Place | Typical use |
|---|---|---|
| `event_hall` | A busy networking event, high tables, drinks | Default for event moments |
| `drinks_table` | Close-up corner of the event by the drinks | Standing alone, first approach, exits |
| `stage_talk` | Rows of seats, a speaker on stage | Talks, Q&A, after the talk |
| `coffee_shop` | Two-person table | Coffee meetings |
| `coworking` | Desks, laptops | Work, building, before and after |
| `phone_screen` | Full-screen phone UI | DMs, texts, LinkedIn, IG bios |
| `doorway` | The entrance to the event | Arriving, leaving, the exit line |
| `street_night` | Outside after the event | Walking home, the follow-up text |
| `void` | Plain brand-colour background | Tool cards, big statements, the hook text |

## Actions (pick one per character per shot)
`idle`, `talk`, `listen`, `nod`, `laugh`, `smile`, `wave`, `wave_over`, `point`, `shrug`, `lean_in`, `look_away`, `look_at_door`, `check_phone`, `type_phone`, `walk_in`, `walk_away`, `handshake`, `hold_drink`, `cross_arms`, `think`, `surprised`, `cringe`, `thumbs_up`

## Expressions
`neutral`, `happy`, `awkward`, `bored`, `interested`, `surprised`, `confident`, `nervous`

## Camera
`wide`, `medium`, `close`, `over_shoulder`, `push_in`, `pull_out`, `pan`

## Positions
`left`, `center`, `right`, `background`

## Overlays (at most one per shot)

| type | Fields | Use |
|---|---|---|
| `tool_card` | `title`, `items` (list), `highlight` (index or null) | Naming a tool; one item highlighted per step |
| `study_card` | `year`, `who`, `finding` | Every study citation, with `professor` on screen |
| `quote_bubble` | `speaker` (cast id), `text` | The exact line someone says |
| `dm_screen` | `from`, `messages` (list of `{ "side": "me" | "them", "text" }`) | DMs and texts, on `phone_screen` |
| `x_check` | `wrong`, `right` | The swap: what everyone says vs what to say |
| `label` | `text`, `target` (cast id) | Naming someone ("the connector") |
| `big_text` | `text` | The hook text on frame one, or a payoff line |

Captions (the spoken words, word by word) are added automatically by the engine. Don't put them in the storyboard.

---

## Shot rules
1. **One shot per script line**, in order, with the line's exact text.
2. **Frame one shows line 1's situation** and carries a `big_text` overlay with the short hook (4 to 9 words).
3. Cut the camera or set at least every 2 shots. Static shots lose people.
4. Exact words the viewer will say go in a `quote_bubble` or `dm_screen`, matching the script word for word.
5. Studies always get `professor` + `study_card`.
6. The objection beat shows `you` with `think` or `cringe`, then the answer flips to `confident`.
7. The payoff shot is the most emotionally clear frame of the video (before → after, or the reaction).
8. The share prompt shows `friend` (usually doing the thing the prompt names).

## Example (two shots)

```json
{
  "line": 1,
  "text": "Never open with what you do.",
  "set": "event_hall",
  "camera": "push_in",
  "characters": [
    {"id": "you", "action": "talk", "expression": "nervous", "position": "left"},
    {"id": "stranger_a", "action": "look_away", "expression": "bored", "position": "right"}
  ],
  "overlay": {"type": "big_text", "text": "Never open with what you do"}
},
{
  "line": 2,
  "text": "Ask what they're stuck on.",
  "set": "void",
  "camera": "medium",
  "characters": [{"id": "you", "action": "point", "expression": "confident", "position": "center"}],
  "overlay": {"type": "x_check", "wrong": "So, what do you do?", "right": "What are you stuck on right now?"}
}
```
