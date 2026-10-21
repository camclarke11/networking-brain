# 13 — Making the Video

How a finished script becomes a post-ready vertical MP4. You direct and code each video in Remotion with the kit in `video/src/kit/`: it sets the look, you decide everything else.

---

## 1. The pipeline

```
python3 tools/make_video.py scripts/<file>.md prep     # voice → word timestamps → align → scaffold
  write video/src/videos/<slug>/Video.tsx              # you: the shots
python3 tools/make_video.py scripts/<file>.md check    # sweeps every 0.25s: 3D clipping, text off screen
python3 tools/make_video.py scripts/<file>.md stills   # contact sheets of every cue
  look at every sheet, fix, repeat                      # you: until it's right
python3 tools/make_video.py scripts/<file>.md render   # MP4 at -14 LUFS → video/out/<slug>.mp4 (runs check first)
```

1. **Prep.** Records the narration (placeholder: free Edge neural voice; `--engine elevenlabs --voice <id>` once a voice is chosen; or, for a take you made on the ElevenLabs website, run `python3 tools/transcribe.py scripts/<file>.md <take.mp3>` first: it copies the take to `video/public/<slug>/voice.mp3` and gets free local word timestamps with faster-whisper, and prep keeps it). Runs `tools/align.py`, copies the timing into `video/src/videos/<slug>/timing.json`, scaffolds `Video.tsx` from `_template` and registers it. Fix every align warning first.
2. **Write the shots.** Read the storyboard and the timing (`python3 -c` over the timing JSON, or the align report). Then write one component per shot or per shared set. Section 3 is the kit.
3. **Check.** Every body (cast, crowd, audience) is tested against every other body and every tagged solid (furniture, machines, props), and every on-screen component against the frame edges. It prints each problem with the time, what hit what, by how much, and where. It must say `no clipping, nothing off screen`. Moving solids (cars, falling things: `clip: {kind: 'solid', name, moving: true}`) are also tested against other solids using their own rotated box; smoke and glow meshes get `userData.noClip`. New props that can be bumped into get `userData={{clip: {kind: 'solid', name}}}`; something held in a character's hand is ignored for that character.
4. **Stills.** Renders a frame just after every cue and the middle of every shot, tiled 7 to a sheet in `video/out/<slug>/`. Look at every sheet as a viewer would, fix, and re-run. `--times 12.4 12.6` checks specific moments.
5. **Render.** Full 1080×1920, 30fps, H.264, audio normalised to -14 LUFS. Then sample the finished file (`ffmpeg -i out/<slug>.mp4 -vf fps=1/3,scale=270:-1,tile=6x3 sheet.jpg`) and look at it once more.
6. **Deliver.** Send the MP4. Update `content-log.md` (status `video`), and mark any asset you built with `python3 tools/library.py status <id> built`.

Setup once per machine: `./setup.sh` (npm install, plus the placeholder voice in `.venv`). On a Mac the GPU renders the 3D. On a Linux server set `REMOTION_GL=swangle` (CPU, about 4× slower) and `REMOTION_BROWSER` to a Chrome binary if needed. `cd video && npm run studio` opens a live preview with a scrubber.

---

## 2. The look

Minimal: off-white space, pill figures, greys with white and black, one yellow accent, tall condensed headlines, soft white cards. It lives in the kit (`tokens.ts`, `three/Stage.tsx`, `three/Character.tsx`, `ui/`), and every set colour is pulled into the palette automatically. Build new props and sets as reusable kit components, not inside a video.

---

## 3. The kit

**Clock** (`kit/timing.tsx`, `kit/time.ts`). Everything is a pure function of `t`, seconds since the video started.
- `const {cue, word, wordEnd, line, shot, words} = useTiming()`
- `cue(shotId, 'word')` the time a storyboard cue lands. `word('Harvard', from)` any spoken word. `line(n).start/end`. `shot(id).start/end`.
- `p(t, a, b, ease?)` 0→1 progress. `spr(t, a)` spring that starts at a. `talk(t, a, b)` mouth movement. `wobble`, `shake`, `lerp`, `clamp`, easings `EO EIO EIN EBack`.
- Because scenes are functions of t: freeze = pass a constant t, slow motion = scale it, rewind = run it backwards (`VhsRewind` does exactly that).

**3D** (`kit/three`).
- `<Stage t cam backdrop drain glow light fog>`: the only way into 3D. `backdrop`: `warm`, `event`, `void` (all off-white), `night`, `dark` (charcoal). `drain` pulls to cold grey, `glow` lifts to warm light. It also runs the clipping check.
- `camPath(t, [[time, {pos, target, fov, roll}], ...])` eased keyframed camera. `toScreen(cam, [x, y, z])` gives pixels, for pinning labels and bubbles to a character's head (a standing head's centre is y ≈ 1.45, its top ≈ 1.75).
- `<Character who t position rotY pose mood talking look lookUp lean hop sit drain glow frozen rightHand leftHand costume sweat>`: a pill figure (body radius 0.29, so two people need about 0.62 between centres). Arms show only while gesturing or holding something. Poses: idle, talk, wave, point, shrug, phone, hold, cheer, think, lean, swing (with `poseK` 0→1), cards, present, pocket. Moods: happy, neutral, sad, shock, wince, bored, excited. `rotY` 0 faces camera, +1.57 faces +x.
- `<Crowd t spots frozen drain>` background people.
- Brand X-ray kit (`brand.tsx`): `SportsCar` (hover, thrust, lift), `Pickup`, `Plinth`, `GlassCase`, `PriceTag` (sub line, back side, flip, glow), `Anchor` + `Chain`, `Laptop` (openDeg, screen texture), `StoreTable`, `OwnTag` + `DotLine`, `Scales` (tilt, items on pans), `SyllableTrain` (blocks that pop out and close up), `FoldingPhone`, `Ruler`, `PrizeWheel` + `wheelAngleFor(n)`, `YogurtBowl`, `Spoon`, `Jar`, `GiftBox`, `FlimsyBag`, `Mug`, `Sofa`, `TextCard`, `Coins`, `Billboard`, `SpotCone`, `usePage`, `useCanvas` (draw any texture). 2D: `Gauge` (a weight dial pinned to an object).
- Talk-room kit (`talk.tsx`): `StageHall` (stage, podium, screen, rows of chairs with seated audience, `seatAt(row, seat, side)`), `Chair`, `QueueConveyor` (belt with riders, stamp press and bin; `beltTravel` to run and halt it), `Notebook` (open, flutter, glowing underlines), `Doorway`, `ParkingLot`, `Rope`. Characters can `sit` on a `Chair`.
- Shop-floor kit (`shop.tsx`): `StandCard` (an upright sign that flips like a departure board), `FreezerCase`, `IceCreamTub` (label types on), `SnowPeaks`, `ShelfRack`, `Warehouse` + `WAREHOUSE_PATH` + `along()` + `FloorPath` (a store plan with a snaking dotted path, for top-down shots), `RotisserieChicken`, `HeatLamp`, `ShoppingCart` (fills item by item), `PizzaBox`, `Pizza`, `PizzaOven`, `WallClock` (hands + red-to-yellow ring), `GlassWall` (a wall that turns to glass or drops like a shutter), `FrontDoor`, `DrinksCooler`, `ContourBottle` (outline, `dark`, `broken` into glowing pieces, `morph` from straight, `rimOnly` for lights-out layers), `PlainBottle`, `LetterTiles`. For a lights-out moment, draw the lit scene, a dark layer over it, then a second transparent `Stage` with only the `rimOnly` outlines (`2026-10-21-the-bottle-in-the-dark`).
- Built sets and props (`sets.tsx`): `EventHall`, `HighTable`, `DrinksTable`, `DrinkGlass`, `Phone`, `GlowingDoor` (rise, open, shut, shine), `LoadingSpinner`, `QuestionCard`, `Dust`, `NightKitchenLab`, `InterrogationRoom`, `PingPongTable`, `Paddle`, `GlowBall`, `SpeedDateGrid` (2,000 instanced tables), `Bubble3D`, `Floor`. `useTextTexture` puts brand text on a 3D surface.

**On screen** (`kit/ui`), each takes `t`, `at` and optional `out`: `BigText`, `QuoteBubble` (speaker, x/y of the tail, tone wrong/right, types on), `XCheck`, `ToolCard` (itemsAt, lit), `StudyCard`, `DmScreen`, `Label`, `Stamp`, `Shake`, `Captions`.

**Effects and sound** (`kit/fx`): `Grade` (drain/glow for 2D), `Flash`, `VhsRewind`, `Grain`, `Vignette`, `<Sfx name at volume>` with whoosh, pop, ping, buzzer, scratch, rewind, thud, ding, tick, click, swell, sparkle (`tools/make_sfx.py` makes them; nothing to license).

**Shots and transitions** (`kit/Timeline.tsx`): `<Timeline shots={[{id, enter, render: (t) => ...}]}/>`. `enter`: cut, whip, flash, push, zoom, drop, fade. The outgoing shot keeps moving through the transition.

`video/src/videos/2026-10-20-the-second-question/Video.tsx` is the worked example: rewinding a scene, a freeze frame on a word, pushing through a door into another set, a rally timed to four words, a pull-back to 2,000 tables.

---

## 3b. Framing a vertical frame

The frame is 9:16, so it's narrow. At `fov: 40` the visible **width** is only about `0.42 × distance` (the height is about `0.73 × distance`). A row of four bottles 1.2 wide needs the camera about 3 away; a person plus a sign 2 wide needs about 5. Most first drafts put the camera too close: heads fill the frame, props crop at the edges.
- Work out the width you need, then the distance, before writing the camera.
- Keep the subject above the captions (y ≈ 1290 to 1400 px): aim the camera a little lower than the subject so it sits in the upper two-thirds.
- Big text and x-checks live at y ≈ 220 to 400 px. Leave that band clear of anything that matters.
- A character between the camera and the subject blocks it. Put them to the side, or shoot over the shoulder from further back.

## 4. Two rules

1. **Times come from the voice, never your keyboard.** `cue(5, 'start')`, not `18.6`. A re-record re-times the whole video for free.
2. **Don't ship until `check` is clean and the stills read with the sound off.**
