#!/usr/bin/env python3
"""Synthesise the house sound-effect kit into video/public/sfx/ (standard library + ffmpeg).

  python3 tools/make_sfx.py

The files are committed, so you only run this to change a sound. Every sound is made
from scratch here, so there's nothing to license.
"""
import math
import random
import struct
import subprocess
import wave
from pathlib import Path

SR = 44100
OUT = Path(__file__).resolve().parent.parent / "video" / "public" / "sfx"


def env(i, n, attack=0.005, release=None):
    t = i / SR
    a = min(1.0, t / attack) if attack else 1.0
    if release is None:
        return a
    return a * math.exp(-t / release)


def lowpass(xs, k):
    y, out = 0.0, []
    for x in xs:
        y += k * (x - y)
        out.append(y)
    return out


def noise(n, seed=1):
    r = random.Random(seed)
    return [r.uniform(-1, 1) for _ in range(n)]


def sweep_sine(n, f0, f1, curve=1.0):
    ph, out = 0.0, []
    for i in range(n):
        f = f0 + (f1 - f0) * (i / n) ** curve
        ph += 2 * math.pi * f / SR
        out.append(math.sin(ph))
    return out


def sounds():
    s = {}
    n = int(0.45 * SR)  # whoosh: band-limited noise swelling and falling
    nz = lowpass(noise(n, 2), 0.18)
    s["whoosh"] = [x * math.sin(math.pi * i / n) ** 2 * 1.8 for i, x in enumerate(nz)]
    n = int(0.12 * SR)  # pop: quick downward blip
    s["pop"] = [x * env(i, n, 0.001, 0.03) for i, x in enumerate(sweep_sine(n, 900, 220, 0.5))]
    n = int(0.5 * SR)  # ping: ping-pong / bright hit
    s["ping"] = [(math.sin(2 * math.pi * 1650 * i / SR) * 0.7 + math.sin(2 * math.pi * 3300 * i / SR) * 0.2) * env(i, n, 0.001, 0.07) for i in range(n)]
    n = int(0.7 * SR)  # buzzer: game-show wrong answer
    s["buzzer"] = [((1 if math.sin(2 * math.pi * 98 * i / SR) > 0 else -1) * 0.5 + (1 if math.sin(2 * math.pi * 104 * i / SR) > 0 else -1) * 0.5) * 0.45 * env(i, n, 0.01) * (1 if i < n * 0.85 else (n - i) / (n * 0.15)) for i in range(n)]
    s["buzzer"] = lowpass(s["buzzer"], 0.25)
    n = int(0.35 * SR)  # scratch: record scratch
    nz = noise(n, 3)
    sw = sweep_sine(n, 400, 1800, 0.6)
    s["scratch"] = [nz[i] * 0.6 * abs(sw[i]) * (0.5 + 0.5 * math.sin(2 * math.pi * 22 * i / SR)) * env(i, n, 0.002) * (1 - i / n) for i in range(n)]
    n = int(1.2 * SR)  # rewind: warbling tape whirr
    nz = lowpass(noise(n, 4), 0.3)
    tone = sweep_sine(n, 300, 1400, 0.7)
    s["rewind"] = [(nz[i] * 0.5 + tone[i] * 0.25) * (0.6 + 0.4 * math.sin(2 * math.pi * 30 * i / SR)) * math.sin(math.pi * i / n) for i in range(n)]
    n = int(0.4 * SR)  # thud: stamp / slam
    nz = lowpass(noise(n, 5), 0.05)
    s["thud"] = [(math.sin(2 * math.pi * 62 * i / SR) * 0.9 + nz[i] * 1.5) * env(i, n, 0.001, 0.09) for i in range(n)]
    n = int(1.4 * SR)  # ding: the right move
    s["ding"] = [(math.sin(2 * math.pi * 1318.5 * i / SR) * 0.55 + math.sin(2 * math.pi * 1975.5 * i / SR) * 0.3 + math.sin(2 * math.pi * 2637 * i / SR) * 0.12) * env(i, n, 0.002, 0.35) for i in range(n)]
    n = int(0.05 * SR)  # tick: UI tick
    s["tick"] = [math.sin(2 * math.pi * 2400 * i / SR) * env(i, n, 0.0005, 0.008) for i in range(n)]
    n = int(0.03 * SR)  # click
    nz = noise(n, 6)
    s["click"] = [nz[i] * env(i, n, 0.0002, 0.004) for i in range(n)]
    n = int(1.6 * SR)  # swell: rising riser into a reveal
    nz = lowpass(noise(n, 7), 0.12)
    tone = sweep_sine(n, 180, 720, 1.6)
    s["swell"] = [(nz[i] * 0.8 + tone[i] * 0.3) * (i / n) ** 2.2 for i in range(n)]
    n = int(0.9 * SR)  # sparkle: gold glow shimmer
    notes = [2093, 2637, 3136, 4186]
    s["sparkle"] = [sum(math.sin(2 * math.pi * f * i / SR) * env(max(0, i - k * int(0.07 * SR)), n, 0.001, 0.12) * (i >= k * int(0.07 * SR)) for k, f in enumerate(notes)) * 0.3 for i in range(n)]
    return s


def write(name, xs, gain=0.8):
    peak = max(1e-9, max(abs(x) for x in xs))
    wav = OUT / f"{name}.wav"
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, x / peak * gain)) * 32767)) for x in xs))
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-q:a", "4", str(OUT / f"{name}.mp3")], check=True)
    wav.unlink()


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, xs in sounds().items():
        write(name, xs)
        print("made", name)
