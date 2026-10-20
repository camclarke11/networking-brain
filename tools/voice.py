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


def elevenlabs(text, voice, mp3_path):
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key or not voice:
        sys.exit("ElevenLabs needs ELEVENLABS_API_KEY and --voice <voice id>.")
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps",
        data=json.dumps({"text": text, "model_id": CONFIG.get("elevenlabs", {}).get("model", "eleven_v4")}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=300) as r:
        data = json.loads(r.read())
    Path(mp3_path).write_bytes(base64.b64decode(data["audio_base64"]))
    return {"alignment": data["alignment"]}


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script")
    ap.add_argument("--engine", default="edge", choices=["edge", "elevenlabs"])
    ap.add_argument("--voice", default=None)
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
        stamps = elevenlabs(text, a.voice, mp3)
    words_path = script.with_suffix(".words.json")
    words_path.write_text(json.dumps(stamps, indent=1) + "\n", encoding="utf-8")
    n = len(stamps) if isinstance(stamps, list) else len(stamps["alignment"]["characters"])
    print(f"Voice: {mp3.relative_to(ROOT)}\nWord timestamps: {words_path.relative_to(ROOT)} ({n} entries)")


if __name__ == "__main__":
    main(sys.argv[1:])
