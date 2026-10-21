#!/usr/bin/env python3
"""Turn a finished script into a post-ready vertical MP4. The /video command drives this.

  python3 tools/make_video.py scripts/<file>.md prep      # voice + timing + scaffold the video's code
  python3 tools/make_video.py scripts/<file>.md stills    # contact sheets for review (out/<slug>/sheet_N.jpg)
  python3 tools/make_video.py scripts/<file>.md check     # sweep every 0.25s for clipping and off-screen text
  python3 tools/make_video.py scripts/<file>.md render    # the full MP4, loudness-normalised (refused if check fails)
  python3 tools/make_video.py scripts/<file>.md cover     # the thumbnail: out/<slug>-cover.jpg (+ a 3:4 grid preview)

Options:
  --revoice            Re-record the narration even if video/public/<slug>/voice.mp3 exists.
  --engine edge|elevenlabs, --voice <id>, --rate +5%   Passed to tools/voice.py.
  --times 1.0 2.5 ...  stills at these seconds (default: every shot's middle and every cue).
  cover: --title "..." (default: the first TITLE / COVER OPTION), --at <seconds> (default: the middle of the
         screenshot shot), --highlight <word(s)>, --dark (white title, for a dark frame), --place top|bottom,
         --shift <px> / --zoom <x> to move the frame so the subject sits clear of the title.

Setup once: ./setup.sh (npm install, and the placeholder voice in .venv).
On a Mac the GPU renders the 3D (REMOTION_GL=angle, the default). On a Linux server set
REMOTION_GL=swangle, and REMOTION_BROWSER to a Chrome binary if Remotion can't download one.
"""
import argparse
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEO = ROOT / "video"
VIDEOS_DIR = VIDEO / "src" / "videos"


def run(cmd, **kw):
    print("$", " ".join(str(c) for c in cmd))
    subprocess.run([str(c) for c in cmd], check=True, **kw)


def ident(slug):
    return "v_" + re.sub(r"[^a-zA-Z0-9]", "_", slug)


def register(slug):
    """Add the video to src/videos/index.ts so Remotion can render it."""
    index = VIDEOS_DIR / "index.ts"
    text = index.read_text(encoding="utf-8")
    if f"'./{slug}/Video'" in text:
        return
    name = ident(slug)
    text = text.replace(
        "\nexport type VideoEntry",
        f"import * as {name} from './{slug}/Video';\n\nexport type VideoEntry",
        1,
    ).replace("\n\n\nexport type", "\n\nexport type")
    text = text.replace(
        "export const VIDEOS: VideoEntry[] = [",
        f"export const VIDEOS: VideoEntry[] = [\n  {{id: '{slug}', component: {name}.Video, timing: {name}.timing as unknown as Timing}},",
        1,
    )
    index.write_text(text, encoding="utf-8")


def prep(script, a):
    slug = script.stem
    voice = VIDEO / "public" / slug / "voice.mp3"
    words = script.with_suffix(".words.json")
    if a.revoice or not voice.exists() or not words.exists():
        cmd = [sys.executable, ROOT / "tools" / "voice.py", script, "--engine", a.engine, "--rate", a.rate]
        if a.voice:
            cmd += ["--voice", a.voice]
        run(cmd)
    run([sys.executable, ROOT / "tools" / "align.py", script, words])
    timing = script.with_suffix(".timing.json")
    folder = VIDEOS_DIR / slug
    folder.mkdir(parents=True, exist_ok=True)
    shutil.copy(timing, folder / "timing.json")
    if not (folder / "Video.tsx").exists():
        tpl = (VIDEOS_DIR / "_template" / "Video.tsx").read_text(encoding="utf-8")
        (folder / "Video.tsx").write_text(tpl.replace("__SLUG__", slug), encoding="utf-8")
        print(f"Scaffolded {folder.relative_to(ROOT)}/Video.tsx: now write the shots (knowledge/13-video-production.md).")
    register(slug)
    data = json.loads(timing.read_text(encoding="utf-8"))
    print(f"Ready: {slug}, {data['duration']:.1f}s, {len(data['shots'])} shots.")


def default_times(script):
    data = json.loads(script.with_suffix(".timing.json").read_text(encoding="utf-8"))
    times = set()
    for s in data["shots"]:
        times.add(round((s["start"] + s["end"]) / 2, 2))
        for c in s["cues"]:
            if c["time"] is not None:
                times.add(round(c["time"] + 0.35, 2))  # just after the cue lands
    return sorted(t for t in times if t < data["duration"])


def stills(script, a):
    slug = script.stem
    out = VIDEO / "out" / slug
    if out.exists():
        shutil.rmtree(out)
    times = a.times or default_times(script)
    run(["node", "scripts/render.mjs", "stills", slug, out, *[f"{t:.2f}" for t in times]], cwd=VIDEO)
    shots = sorted(out.glob("s_*.jpg"))
    for n in range(0, len(shots), 7):
        group = shots[n:n + 7]
        inputs = [x for f in group for x in ("-i", str(f))]
        scale = "".join(f"[{i}]scale=360:640[v{i}];" for i in range(len(group)))
        stack = "".join(f"[v{i}]" for i in range(len(group))) + (f"hstack=inputs={len(group)}" if len(group) > 1 else "copy")
        run(["ffmpeg", "-v", "error", "-y", *inputs, "-filter_complex", scale + stack, out / f"sheet_{n // 7}.jpg"])
    print(f"Contact sheets in {out.relative_to(ROOT)}/sheet_*.jpg. Look at every one before rendering.")


def check(script, a):
    """Sweep the video for 3D clipping and off-screen text. Returns True when clean."""
    r = subprocess.run(["node", "scripts/render.mjs", "check", script.stem, "-", str(a.step_s)], cwd=VIDEO, capture_output=True, text=True)
    lines = [l for l in r.stdout.splitlines() if not l.startswith("checked ")]
    print("\n".join(lines) or r.stderr[-2000:])
    if r.returncode not in (0, 2):
        sys.exit(r.returncode)
    return r.returncode == 0


def render(script, a):
    slug = script.stem
    if not a.skip_check and not check(script, a):
        sys.exit("Fix the problems above (or pass --skip-check to render anyway).")
    out = VIDEO / "out"
    out.mkdir(exist_ok=True)
    raw = out / f"{slug}.raw.mp4"
    final = out / f"{slug}.mp4"
    run(["node", "scripts/render.mjs", "video", slug, raw], cwd=VIDEO)
    # Instagram and TikTok both normalise around -14 LUFS; deliver there so nothing gets turned down.
    run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", final])
    raw.unlink()
    probe = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration,size:stream=width,height", "-of", "json", final], capture_output=True, text=True)
    info = json.loads(probe.stdout)
    st = info["streams"][0]
    print(f"Done: {final.relative_to(ROOT)}  {st['width']}x{st['height']}  {float(info['format']['duration']):.1f}s  {int(info['format']['size']) / 1e6:.1f} MB")


def cover(script, a):
    """The thumbnail: a frame of the video with the title over it, plus the 3:4 crop the profile grid shows."""
    slug = script.stem
    text = script.read_text(encoding="utf-8")
    title = a.title
    if not title:
        m = re.search(r"^## TITLE / COVER OPTIONS\s*\n+1\.\s*(.+)$", text, re.M)
        title = m.group(1).strip() if m else slug
    at = a.at
    if at is None:
        timing = json.loads((VIDEOS_DIR / slug / "timing.json").read_text(encoding="utf-8"))
        board = re.search(r"```json\s*(.*?)```", text, re.S)
        shots = json.loads(board.group(1))["shots"] if board else []
        pick = next((s["id"] for s in shots if s.get("screenshot")), 1)
        sh = next(s for s in timing["shots"] if s["id"] == pick)
        at = (sh["start"] + sh["end"]) / 2
    out = VIDEO / "out"
    out.mkdir(exist_ok=True)
    jpg = out / f"{slug}-cover.jpg"
    props = {"title": title, "highlight": a.highlight or "", "dark": a.dark, "place": a.place, "shift": a.shift, "zoom": a.zoom, "size": a.size}
    run(["node", "scripts/render.mjs", "cover", slug, jpg, f"{at:.2f}", json.dumps(props)], cwd=VIDEO)
    grid = out / f"{slug}-cover-grid.jpg"
    run(["ffmpeg", "-v", "error", "-y", "-i", jpg, "-vf", "crop=1080:1440:0:240", grid])
    print(f"Cover: {jpg.relative_to(ROOT)} (grid preview: {grid.name}) at {at:.2f}s, title \"{title}\"")


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script")
    ap.add_argument("step", choices=["prep", "stills", "check", "render", "cover"])
    ap.add_argument("--revoice", action="store_true")
    ap.add_argument("--engine", default="edge")
    ap.add_argument("--voice")
    ap.add_argument("--rate", default="+0%")
    ap.add_argument("--times", type=float, nargs="*")
    ap.add_argument("--step-s", type=float, default=0.25, help="check: seconds between sampled frames")
    ap.add_argument("--skip-check", action="store_true", help="render: skip the clipping check")
    ap.add_argument("--title", help="cover: the title (default: the first TITLE / COVER OPTION)")
    ap.add_argument("--highlight", help="cover: word(s) on the yellow block")
    ap.add_argument("--at", type=float, help="cover: the frame, in seconds (default: the screenshot shot's middle)")
    ap.add_argument("--dark", action="store_true", help="cover: white title for a dark frame")
    ap.add_argument("--place", default="top", choices=["top", "bottom"], help="cover: title at the top or bottom")
    ap.add_argument("--shift", type=float, default=0, help="cover: move the frame down this many px (clear of a top title)")
    ap.add_argument("--zoom", type=float, default=1, help="cover: scale the frame")
    ap.add_argument("--size", type=float, default=150, help="cover: title size in px (use | in the title to break lines)")
    a = ap.parse_args(argv)
    script = Path(a.script).resolve()
    if not script.exists():
        sys.exit(f"No such script: {a.script}")
    if not (VIDEO / "node_modules").exists():
        sys.exit("Run ./setup.sh first.")
    os.environ.setdefault("REMOTION_GL", "angle" if sys.platform == "darwin" else "swangle")
    ok = {"prep": prep, "stills": stills, "check": check, "render": render, "cover": cover}[a.step](script, a)
    if a.step == "check" and not ok:
        sys.exit(2)


if __name__ == "__main__":
    main(sys.argv[1:])
