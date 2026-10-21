#!/usr/bin/env python3
"""Record the narration with text to speech and save its word timestamps.

  python3 tools/voice.py scripts/<file>.md [--engine edge|elevenlabs] [--voice <id>] [--rate +5%]

Writes video/public/<slug>/voice.mp3 and scripts/<slug>.words.json, ready for tools/align.py.

Engines:
  edge        (default, placeholder) Microsoft Edge neural voices via the free `edge-tts`
              package: `pip install edge-tts`. Good enough to time and review a video.
              Default voice en-US-AndrewNeural. Others: en-US-BrianNeural, en-GB-RyanNeural.
  elevenlabs  The real thing once a voice is chosen. Needs ELEVENLABS_API_KEY and --voice <voice id>.
              Sends the script's ELEVENLABS block (audio tags and all) to the model in
              config.json (elevenlabs.model, Eleven v4 by default). Uses the "with timestamps"
              endpoint, so timing is exact; tools/align.py skips the tags.

A real recording instead? Put it at video/public/<slug>/voice.mp3, get word timestamps from
speech to text (Whisper with word timestamps, or ElevenLabs speech to text), and save them as
scripts/<slug>.words.json. tools/align.py reads all of those formats.
"""
import argparse
import asyncio
import base64
import json
import os
import ssl
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from check_script import CONFIG, script_lines, tagged_text  # noqa: E402


def narration(script_path, tags=False):
    text = script_path.read_text(encoding="utf-8")
    if tags and tagged_text(text):
        return tagged_text(text)
    lines = script_lines(text)
    if not lines:
        sys.exit(f"No SCRIPT section in {script_path}")
    # Every line ends with punctuation so the voice pauses between them.
    return " ".join(l if l[-1] in ".?!," else l + "." for l in lines)


def edge(text, voice, rate, mp3_path):
    try:
        import edge_tts
        import edge_tts.communicate as comm
    except ImportError:
        venv = ROOT / ".venv" / "bin" / "python"
        if venv.exists() and Path(sys.executable).resolve() != venv.resolve():
            os.execv(str(venv), [str(venv), *sys.argv])  # setup.sh installs edge-tts here
        sys.exit("The placeholder voice needs edge-tts: run ./setup.sh (or pip install edge-tts)")
    ca = os.environ.get("SSL_CERT_FILE") or os.environ.get("REQUESTS_CA_BUNDLE")
    if ca and Path(ca).exists():  # behind a TLS-inspecting proxy
        comm._SSL_CTX = ssl.create_default_context(cafile=ca)
    proxy = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
    words = []

    async def run():
        kwargs = {"boundary": "WordBoundary", "rate": rate}
        if proxy:
            kwargs["proxy"] = proxy
        com = edge_tts.Communicate(text, voice, **kwargs)
        with open(mp3_path, "wb") as f:
            async for chunk in com.stream():
                if chunk["type"] == "audio":
                    f.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    start = chunk["offset"] / 1e7
                    words.append({"word": chunk["text"], "start": round(start, 3), "end": round(start + chunk["duration"] / 1e7, 3)})

    asyncio.run(run())
    return words


def load_env():
    """Read KEY=value lines from .env (gitignored) into the environment. .env wins over the shell,
    so a key saved in the Studio is the one used."""
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")


def elevenlabs(text, voice, mp3_path, model=None, settings=None, seed=None):
    load_env()
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key or not voice:
        sys.exit("ElevenLabs needs ELEVENLABS_API_KEY (in .env or the environment) and --voice <voice id>.")
    body = {"text": text, "model_id": model or CONFIG.get("elevenlabs", {}).get("model", "eleven_v4")}
    if settings:
        body["voice_settings"] = settings
    if seed is not None:
        body["seed"] = seed
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(body).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.loads(r.read())
    Path(mp3_path).write_bytes(base64.b64decode(data["audio_base64"]))
    return {"alignment": data["alignment"]}


def say_as(text):
    """Swap words the voice mispronounces for how they sound (config.json elevenlabs.say, written → spoken).
    Returns the text to send and the swaps made, so unsay() can put the spelling back."""
    swaps = []
    for written, spoken in (CONFIG.get("elevenlabs", {}).get("say") or {}).items():
        if written in text:
            text = text.replace(written, spoken)
            swaps.append((written, spoken))
    return text, swaps


def unsay(alignment, swaps):
    """Put the written spelling back into an ElevenLabs character alignment, spreading each swapped word's time
    evenly over its letters, so tools/align.py and the captions see the script's own words."""
    chars = list(alignment["characters"])
    st = list(alignment["character_start_times_seconds"])
    en = list(alignment["character_end_times_seconds"])
    for written, spoken in swaps:
        out_c, out_s, out_e, i = [], [], [], 0
        s = "".join(chars)
        while (j := s.find(spoken, i)) >= 0:
            out_c += chars[i:j]
            out_s += st[i:j]
            out_e += en[i:j]
            a, b, n = st[j], en[j + len(spoken) - 1], len(written)
            for k, ch in enumerate(written):
                out_c.append(ch)
                out_s.append(a + (b - a) * k / n)
                out_e.append(a + (b - a) * (k + 1) / n)
            i = j + len(spoken)
        chars, st, en = out_c + chars[i:], out_s + st[i:], out_e + en[i:]
    return {**alignment, "characters": chars, "character_start_times_seconds": st, "character_end_times_seconds": en}


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script")
    ap.add_argument("--engine", default="edge", choices=["edge", "elevenlabs"])
    ap.add_argument("--voice", default=None, help="voice id (elevenlabs: defaults to elevenlabs.voice_id in config.json)")
    ap.add_argument("--rate", default="+0%", help="edge only, e.g. +8%% to speed up")
    a = ap.parse_args(argv)
    script = Path(a.script).resolve()
    slug = script.stem
    out_dir = ROOT / "video" / "public" / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    mp3 = out_dir / "voice.mp3"
    text = narration(script, tags=a.engine == "elevenlabs")  # the placeholder voice would read tags aloud
    if a.engine == "edge":
        stamps = edge(text, a.voice or "en-US-AndrewNeural", a.rate, mp3)
    else:
        spoken, swaps = say_as(text)
        stamps = elevenlabs(spoken, a.voice or CONFIG.get("elevenlabs", {}).get("voice_id"), mp3)
        if swaps:
            stamps["alignment"] = unsay(stamps["alignment"], swaps)
            print("Said as: " + ", ".join(f"{w} → {s}" for w, s in swaps))
    words_path = script.with_suffix(".words.json")
    words_path.write_text(json.dumps(stamps, indent=1) + "\n", encoding="utf-8")
    n = len(stamps) if isinstance(stamps, list) else len(stamps["alignment"]["characters"])
    print(f"Voice: {mp3.relative_to(ROOT)}\nWord timestamps: {words_path.relative_to(ROOT)} ({n} entries)")


if __name__ == "__main__":
    main(sys.argv[1:])
