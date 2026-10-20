#!/usr/bin/env python3
"""Time a storyboard to the recorded narration. Standard library only.

  python3 tools/align.py scripts/<file>.md <word-timestamps.json> [--out <file>.timing.json]

The narration is recorded first (text to speech or a real voice). This matches the
recording's words to the script, then works out when every line, shot, cue and on-screen
component happens. It writes scripts/<file>.timing.json for the video engine and prints a
report: words the take dropped or added, and shots that sit still too long.

Timestamp formats it reads:
  - ElevenLabs text to speech "with timestamps": {"alignment": {"characters": [...],
    "character_start_times_seconds": [...], "character_end_times_seconds": [...]}}
  - ElevenLabs speech to text: {"words": [{"text", "start", "end", "type"}]}
  - Whisper with word timestamps: {"segments": [{"words": [{"word", "start", "end"}]}]}
  - A plain list: [{"word" or "text", "start", "end"}]
"""
import difflib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from check_script import read_board, script_lines, tokens  # noqa: E402

MAX_STILL = 4.5   # seconds without a visual change before we flag it
TAIL = 0.6        # seconds held after the last word


def read_words(data):
    """Normalise any supported format to [(word as said, start, end)]."""
    if isinstance(data, dict) and ("alignment" in data or "characters" in data):
        al = data.get("alignment") or data.get("normalized_alignment") or data
        words, cur, start, end = [], "", None, None
        for ch, s, e in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
            if ch.isspace():
                if cur:
                    words.append((cur, start, end))
                cur, start = "", None
                continue
            if start is None:
                start = s
            cur, end = cur + ch, e
        if cur:
            words.append((cur, start, end))
        return words
    if isinstance(data, dict) and "segments" in data:
        items = [w for seg in data["segments"] for w in seg.get("words", [])]
    elif isinstance(data, dict) and "words" in data:
        items = data["words"]
    elif isinstance(data, list):
        items = data
    else:
        raise ValueError("Unrecognised timestamp format.")
    out = []
    for w in items:
        if w.get("type") not in (None, "word"):
            continue
        text = (w.get("word") or w.get("text") or "").strip()
        if text:
            out.append((text, float(w["start"]), float(w["end"])))
    return out


def spoken_tokens(words):
    """Split each said word into script-comparable tokens, sharing its time evenly."""
    out = []
    for text, start, end in words:
        toks = tokens(text)
        step = (end - start) / max(len(toks), 1)
        for i, tok in enumerate(toks):
            out.append((tok, start + i * step, start + (i + 1) * step))
    return out


def align(lines, words):
    """Times for every script token. Returns (per-line token times, dropped, added)."""
    script = [(li, tok) for li, line in enumerate(lines, 1) for tok in tokens(line)]
    said = spoken_tokens(words)
    times = [None] * len(script)
    dropped, added = [], []
    matcher = difflib.SequenceMatcher(None, [t for _, t in script], [t for t, _, _ in said], autojunk=False)
    for op, i1, i2, j1, j2 in matcher.get_opcodes():
        if op == "equal":
            for k in range(i2 - i1):
                times[i1 + k] = (said[j1 + k][1], said[j1 + k][2], True)
        elif op == "replace":
            # Said differently ("two thousand" for "2,000"): spread the said span over the script words.
            start, end = said[j1][1], said[j2 - 1][2]
            step = (end - start) / (i2 - i1)
            for k in range(i2 - i1):
                times[i1 + k] = (start + k * step, start + (k + 1) * step, False)
        elif op == "delete":
            dropped += [script[k][1] for k in range(i1, i2)]
        elif op == "insert":
            added += [said[k][0] for k in range(j1, j2)]
    # Words the take dropped get a zero-length time where they would have been.
    last = 0.0
    for k, t in enumerate(times):
        if t is None:
            times[k] = (last, last, False)
        last = times[k][1]
    per_line = {}
    for (li, tok), t in zip(script, times):
        per_line.setdefault(li, []).append((tok, *t))
    return per_line, dropped, added


def word_time(per_line, first, last, word, line=None):
    """Start time of the first occurrence of `word` (one or more tokens) in the given lines."""
    target = tokens(word)
    for li in ([line] if line else range(first, last + 1)):
        toks = per_line.get(li, [])
        for i in range(len(toks) - len(target) + 1):
            if [t[0] for t in toks[i:i + len(target)]] == target:
                return round(toks[i][1], 3)
    return None


def build(text, words):
    lines = script_lines(text)
    board = read_board(text)
    if board is None:
        raise ValueError("No parseable storyboard in the script.")
    per_line, dropped, added = align(lines, words)
    end_of_audio = (max(e for _, _, e in words) if words else 0.0) + TAIL
    line_rows = []
    for li, line in enumerate(lines, 1):
        toks = per_line.get(li, [])
        exact = sum(1 for t in toks if t[3])
        line_rows.append({"line": li, "text": line, "start": round(toks[0][1], 3) if toks else None,
                          "end": round(toks[-1][2], 3) if toks else None,
                          "matched": f"{exact}/{len(toks)}"})
    shots, warnings = [], []
    starts = []
    for shot in board["shots"]:
        first, last = shot["lines"]
        starts.append(line_rows[first - 1]["start"] if first <= len(line_rows) else None)
    starts[0] = 0.0
    for n, shot in enumerate(board["shots"]):
        first, last = shot["lines"]
        start = starts[n]
        end = starts[n + 1] if n + 1 < len(starts) else round(end_of_audio, 3)
        cues = [{"word": c["word"], "what": c["what"],
                 "time": word_time(per_line, first, last, c["word"], c.get("line"))} for c in shot.get("cues", [])]
        comps = [{"type": c["type"], "at": c.get("at"),
                  "time": word_time(per_line, first, last, c["at"]) if c.get("at") else start}
                 for c in shot.get("on_screen", [])]
        row = {"id": shot["id"], "title": shot.get("title"), "lines": shot["lines"], "start": start, "end": end,
               "duration": round(end - start, 3), "cues": cues, "on_screen": comps}
        shots.append(row)
        marks = sorted({start, end, *[c["time"] for c in cues + comps if c["time"] is not None]})
        gap = max((b - a for a, b in zip(marks, marks[1:])), default=0)
        if gap > MAX_STILL:
            warnings.append(f"Shot {shot['id']}: {gap:.1f}s with no visual change. Add a cue.")
        for c in cues:
            if c["time"] is None:
                warnings.append(f"Shot {shot['id']}: cue word '{c['word']}' wasn't found in the recording.")
            elif end - c["time"] < 0.3:
                warnings.append(f"Shot {shot['id']}: cue on '{c['word']}' lands {end - c['time']:.2f}s before the cut.")
    if dropped:
        warnings.append(f"The recording skips {len(dropped)} script word(s): {' '.join(dropped[:12])}. Update the script to match the take.")
    if added:
        warnings.append(f"The recording adds {len(added)} word(s) not in the script: {' '.join(added[:12])}.")
    total = sum(len(v) for v in per_line.values())
    exact = sum(1 for v in per_line.values() for t in v if t[3])
    return {"duration": round(end_of_audio, 3), "match": round(exact / total, 3) if total else 0,
            "lines": line_rows, "shots": shots,
            "words": [{"word": w, "start": s, "end": e} for w, s, e in words],
            "warnings": warnings}


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        sys.exit(1)
    script_path, stamps_path = Path(argv[0]), Path(argv[1])
    out = Path(argv[argv.index("--out") + 1]) if "--out" in argv else script_path.with_suffix(".timing.json")
    timing = build(script_path.read_text(encoding="utf-8"), read_words(json.loads(stamps_path.read_text(encoding="utf-8"))))
    timing["script"] = script_path.name
    out.write_text(json.dumps(timing, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"{script_path.name}: {timing['duration']:.1f}s, {len(timing['shots'])} shots, {timing['match']:.0%} of words matched exactly")
    for s in timing["shots"]:
        print(f"  {s['id']:>2}  {s['start']:6.2f}–{s['end']:6.2f}s  {s['title'] or ''}")
    for w in timing["warnings"]:
        print(f"  ! {w}")
    print(f"Wrote {out}")


if __name__ == "__main__":
    main(sys.argv[1:])
