# 13 — Making the Video

This is how a finished script and storyboard become a post-ready vertical MP4. You (the agent) direct and code each video yourself in Remotion, using a shared kit that locks the look. There is no engine that fills templates: the kit gives you the cast, the sets, the brand components and the clock, and you write the shots.

Why this way: a free hand per video is what made the earlier one-shot motion-graphics edit good (it invented every scene for the story). The kit is what keeps 100 videos looking like one account. So the **look is code you import**, and the **creativity is code you write**.

---

## 1. The pipeline

```
python3 tools/make_video.py scripts/<file>.md prep     # voice → word timestamps → align → scaffold
  write video/src/videos/<slug>/Video.tsx              # you: the shots
python3 tools/make_video.py scripts/<file>.md stills   # contact sheets of every cue
  look at every sheet, fix, repeat                      # you: at least two passes
python3 tools/make_video.py scripts/<file>.md render   # MP4 at -14 LUFS → video/out/<slug>.mp4
```

1. **Prep.** Records the narration (placeholder: free Edge neural voice; `--engine elevenlabs --voice <id>` once a voice is chosen; or drop a real recording at `video/public/<slug>/voice.mp3` with its word timestamps at `scripts/<slug>.words.json`). Runs `tools/align.py`, copies the timing into `video/src/videos/<slug>/timing.json`, scaffolds `Video.tsx` from `_template` and registers it. Fix every align warning first.
2. **Write the shots.** Read the storyboard and the timing (`python3 -c` over the timing JSON, or the align report). Then write one component per shot or per shared set. Section 3 is the kit, section 4 is the craft.
3. **Stills.** Renders a frame just after every cue and the middle of every shot, tiled 7 to a sheet in `video/out/<slug>/`. Open every sheet and check it against the checklist in section 5. Fix and re-run. `--times 12.4 12.6` checks specific moments (transitions, stamps).
4. **Render.** Full 1080×1920, 30fps, H.264, audio normalised to -14 LUFS. Then sample the finished file (`ffmpeg -i out/<slug>.mp4 -vf fps=1/3,scale=270:-1,tile=6x3 sheet.jpg`) and look at it once more.
5. **Deliver.** Send the MP4. Update `content-log.md` (status `video`), and mark any asset you built with `python3 tools/library.py status <id> built`.

Setup once per machine: `cd video && npm install`, and `pip install edge-tts`. On a Mac the GPU renders the 3D. On a Linux server set `REMOTION_GL=swangle` (CPU, about 4× slower) and `REMOTION_BROWSER` to a Chrome binary if needed. `cd video && npm run studio` opens a live preview with a scrubber.

---

## 2. What's locked and what's yours

| Locked (import it, never restyle it) | Yours (invent it every video) |
|---|---|
| Colours, fonts, safe zones: `kit/tokens.ts` | What each shot shows, how the metaphor moves |
| The cast's faces, bodies, outfits: `kit/three/Character.tsx` | Poses, moods, blocking, who's where |
| Lighting and materials: `Stage`, `Clay` | Camera moves, lenses, transitions |
| On-screen components: `kit/ui` | Where and when they appear |
| Visual grammar: `drain` = wrong move, `glow` = right move | Jokes, transformations, reveals |
| Captions, grain, vignette | New props and sets (then add them to the kit) |

If a video needs a new prop or set, build it in `kit/three/sets.tsx` (or a new file beside it) as a reusable component with `drain`/`glow` props, so the next video can use it. Never build a one-off look inside a video file that should have been a kit asset.

---

## 3. The kit

**Clock** (`kit/timing.tsx`, `kit/time.ts`). Everything is a pure function of `t`, seconds since the video started.
- `const {cue, word, wordEnd, line, shot, words} = useTiming()`
- `cue(shotId, 'word')` the time a storyboard cue lands. `word('Harvard', from)` any spoken word. `line(n).start/end`. `shot(id).start/end`.
- `p(t, a, b, ease?)` 0→1 progress. `spr(t, a)` spring that starts at a. `talk(t, a, b)` mouth movement. `wobble`, `shake`, `lerp`, `clamp`, easings `EO EIO EIN EBack`.
- Because scenes are functions of t: freeze = pass a constant t, slow motion = scale it, rewind = run it backwards (`VhsRewind` does exactly that).

**3D** (`kit/three`).
- `<Stage t cam backdrop drain glow light fog>`: the only way into 3D. `backdrop`: `event` (warm bokeh party lights), `warm`, `void`, `night`, `dark`. `light`: `warm`, `night`, `harsh`.
- `camPath(t, [[time, {pos, target, fov, roll}], ...])` eased keyframed camera. `toScreen(cam, [x, y, z])` gives pixels, for pinning labels and bubbles to a character's head (y ≈ 2.0 is just above a head).
- `<Character who t position rotY pose mood talking look lookUp lean hop drain glow frozen rightHand leftHand sweat>`. Poses: idle, talk, wave, point, shrug, phone, hold, cheer, think, lean, swing (with `poseK` 0→1), cards, present, pocket. Moods: happy, neutral, sad, shock, wince, bored, excited. `rotY` 0 faces camera, +1.57 faces +x.
- `<Crowd t spots frozen drain>` background people.
- Built sets and props (`sets.tsx`): `EventHall`, `HighTable`, `DrinksTable`, `DrinkGlass`, `Phone`, `GlowingDoor` (rise, open, shut, shine), `LoadingSpinner`, `QuestionCard`, `Dust`, `NightKitchenLab`, `InterrogationRoom`, `PingPongTable`, `Paddle`, `GlowBall`, `SpeedDateGrid` (2,000 instanced tables), `Bubble3D`, `Floor`. `useTextTexture` puts brand text on a 3D surface.

**On screen** (`kit/ui`), each takes `t`, `at` and optional `out`: `BigText`, `QuoteBubble` (speaker, x/y of the tail, tone wrong/right, types on), `XCheck`, `ToolCard` (itemsAt, lit), `StudyCard`, `DmScreen`, `Label`, `Stamp`, `Shake`, `Captions`.

**Effects and sound** (`kit/fx`): `Grade` (drain/glow for 2D), `Flash`, `VhsRewind`, `Grain`, `Vignette`, `<Sfx name at volume>` with whoosh, pop, ping, buzzer, scratch, rewind, thud, ding, tick, click, swell, sparkle (`tools/make_sfx.py` makes them; nothing to license).

**Shots and transitions** (`kit/Timeline.tsx`): `<Timeline shots={[{id, enter, render: (t) => ...}]}/>`. `enter`: cut, whip, flash, push, zoom, drop, fade. The outgoing shot keeps moving through the transition.

`video/src/videos/2026-10-20-the-second-question/Video.tsx` is the worked example: rewinding a scene, a freeze frame on a word, pushing through a door into another set, a rally timed to four words, a pull-back to 2,000 tables.

---

## 4. Craft rules (learned the hard way)

1. **Times come from the voice, never your keyboard.** `cue(5, 'start')`, not `18.6`. Then a re-record or a new voice re-times the whole video for free.
2. **Portrait framing is narrow.** At `fov` 32 the visible width is only about a third of the camera distance. Two characters side by side need them about 1.2 apart and the camera 6 or more away. Over-the-shoulder and down-the-table angles use the height of the frame; side-on wide shots waste it.
3. **Keep three zones.** Top (y 200 to 650): hook text, cards, bubbles. Middle (650 to 1250): faces. Captions sit at y 1290. Nothing important below 1500 or right of 930 (the app's buttons). Aim the camera so heads land around y 700 to 900 (raise `target.y` to push the scene down the frame).
4. **One idea on screen at a time.** Don't stack an x_check and a quote bubble; hand one to the next.
5. **Hook frame is real, then reality breaks.** Shot 1 shows the situation, and the biggest visual surprise lands on the objection or the re-hook.
6. **Something changes every 2 to 4 seconds** (camera move, cue, component, cut). The align report warns at 4.5s.
7. **Use the grammar.** Wrong move: `drain` (and a freeze or a stall). Right move: `glow`, gold light, warm colour floods back. Viewers learn it.
8. **Sound sells the cuts.** A whoosh on whips, a pop on reveals, a thud on stamps, a ding on the payoff. Keep effects at 0.3 to 0.45 so the voice stays on top.
9. **Captions hide while big text says the same words** (shot 1 usually).
10. **Review like a viewer.** Read each sheet asking: can I tell what's happening with the sound off? Is any face covered? Is anything cut off at the edge? Is the screenshot moment actually striking?

---

## 5. Stills checklist (every pass)

- [ ] Shot 1 is readable in under a second: the situation plus the big text.
- [ ] No face is covered by a bubble, card or caption. Nothing important is cut off at the sides.
- [ ] Every cue visibly lands (compare the sheet frame just after it with the one before).
- [ ] The exact words appear on screen (quote bubble, x_check or DM).
- [ ] The study card is on screen long enough to read (about 3 seconds) with the Professor.
- [ ] The share-prompt shot shows the friend doing the thing.
- [ ] The screenshot moment works as a still.
- [ ] Colours: wrong moves are cold, right moves are warm. No off-brand colours.
- [ ] Transitions checked with `--times` around each cut.

Then render, sample the final file, and only then send it.
