#!/usr/bin/env python3
"""Turn a finished script into a post-ready vertical MP4. The /video command drives this.

  python3 tools/make_video.py scripts/<file>.md prep      # voice + timing + scaffold the video's code
  python3 tools/make_video.py scripts/<file>.md stills    # contact sheets for review (out/<slug>/sheet_N.jpg)
  python3 tools/make_video.py scripts/<file>.md render    # the full MP4, loudness-normalised

Options:
  --revoice            Re-record the narration even if video/public/<slug>/voice.mp3 exists.
  --engine edge|elevenlabs, --voice <id>, --rate +5%   Passed to tools/voice.py.
  --times 1.0 2.5 ...  stills at these seconds (default: every shot's middle and every cue).

Setup once: `cd video && npm install`, and `pip install edge-tts` for the placeholder voice.
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


def render(script, a):
    slug = script.stem
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


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script")
    ap.add_argument("step", choices=["prep", "stills", "render"])
    ap.add_argument("--revoice", action="store_true")
    ap.add_argument("--engine", default="edge")
    ap.add_argument("--voice")
    ap.add_argument("--rate", default="+0%")
    ap.add_argument("--times", type=float, nargs="*")
    a = ap.parse_args(argv)
    script = Path(a.script).resolve()
    if not script.exists():
        sys.exit(f"No such script: {a.script}")
    if not (VIDEO / "node_modules").exists():
        sys.exit("Run `cd video && npm install` first.")
    os.environ.setdefault("REMOTION_GL", "angle" if sys.platform == "darwin" else "swangle")
    {"prep": prep, "stills": stills, "render": render}[a.step](script, a)


if __name__ == "__main__":
    main(sys.argv[1:])
