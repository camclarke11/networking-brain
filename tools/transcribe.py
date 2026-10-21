#!/usr/bin/env python3
"""Use a narration recorded elsewhere (e.g. downloaded from the ElevenLabs website) for a script.

  python3 tools/transcribe.py scripts/<file>.md <recording.mp3> [--model base.en]

Copies the recording to video/public/<slug>/voice.mp3 and gets word timestamps with
faster-whisper (local and free: `.venv/bin/pip install faster-whisper`), saved as
scripts/<slug>.words.json. Then `python3 tools/make_video.py scripts/<file>.md prep` aligns it
(prep keeps an existing voice.mp3 unless you pass --revoice).
The script's words are given to the model as a hint, so names and numbers come out right.
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from check_script import script_lines  # noqa: E402


def transcribe(audio, hint, model="base.en"):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        venv = ROOT / ".venv" / "bin" / "python"
        if venv.exists() and Path(sys.executable).resolve() != venv.resolve():
            os.execv(str(venv), [str(venv), *sys.argv])
        sys.exit("Needs faster-whisper: .venv/bin/pip install faster-whisper")
    import numpy as np
    # Decode with ffmpeg ourselves: faster-whisper's own decoder breaks on some PyAV versions.
    pcm = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", str(audio), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                         capture_output=True, check=True).stdout
    samples = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0
    m = WhisperModel(model, device="cpu", compute_type="int8")
    segments, _ = m.transcribe(samples, word_timestamps=True, initial_prompt=hint[:800], vad_filter=False)
    words = [{"word": w.word.strip(), "start": round(w.start, 3), "end": round(w.end, 3)} for s in segments for w in s.words]
    # Whisper sometimes invents a sign-off ("We'll see you in the next one.") squashed into the
    # last moment of silence: zero-length words. Drop them from the end.
    while words and (words[-1]["end"] - words[-1]["start"] < 0.02 or not any(c.isalnum() for c in words[-1]["word"])
                     or (len(words) > 1 and words[-1]["start"] - words[-2]["start"] < 0.02)):
        words.pop()
    return words


def main(argv):
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script")
    ap.add_argument("audio")
    ap.add_argument("--model", default="base.en", help="faster-whisper model (base.en is quick; small.en is more exact)")
    a = ap.parse_args(argv)
    script, audio = Path(a.script).resolve(), Path(a.audio).expanduser().resolve()
    if not audio.exists():
        sys.exit(f"No recording at {audio}")
    out_dir = ROOT / "video" / "public" / script.stem
    out_dir.mkdir(parents=True, exist_ok=True)
    mp3 = out_dir / "voice.mp3"
    if audio.suffix.lower() == ".mp3":
        shutil.copy(audio, mp3)
    else:
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(audio), "-b:a", "192k", str(mp3)], check=True)
    words = transcribe(mp3, " ".join(script_lines(script.read_text(encoding="utf-8"))), a.model)
    words_path = script.with_suffix(".words.json")
    words_path.write_text(json.dumps({"words": words}, indent=1) + "\n", encoding="utf-8")
    print(f"Voice: {mp3.relative_to(ROOT)}\nWord timestamps: {words_path.relative_to(ROOT)} ({len(words)} words, ends {words[-1]['end'] if words else 0}s)")


if __name__ == "__main__":
    main(sys.argv[1:])
