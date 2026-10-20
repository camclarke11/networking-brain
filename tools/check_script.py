#!/usr/bin/env python3
"""Mechanical checks for a finished script file (scripts/*.md). Standard library only.

  python3 tools/check_script.py scripts/2026-10-21-the-doorway-test.md [more files…]

Checks what a machine can check from knowledge/10-quality-checklist.md: length, banned
words, punctuation, the hook's first line, voice density, and that the storyboard has
exactly one valid shot per spoken line. It cannot judge whether the script is good.
Exit code 1 if any hard fail.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCHEMA = json.loads((ROOT / "templates" / "storyboard.schema.json").read_text(encoding="utf-8"))
CONFIG = json.loads((ROOT / "config.json").read_text(encoding="utf-8")) if (ROOT / "config.json").exists() else {}
WPM = CONFIG.get("words_per_minute", 175)

BANNED = ["delve", "tapestry", "testament", "unravel", "navigate", "realm", "embark", "intricate", "pivotal",
          "leverage", "synergy", "unlock", "game-changer", "game changer", "level up", "in today's world",
          "in a world where", "let's dive in", "buckle up", "here's the kicker", "the secret nobody tells you",
          "this will change your life", "alpha", "high-value man", "high value man", "manipulate",
          "dark psychology", "and then"]
UK_SPELLINGS = ["favour", "favourite", "realise", "organise", "colour", "behaviour", "apologise", "recognise"]
STUDY_RE = re.compile(r"\b(study|studies|researchers|psychologists|experiment)\b", re.I)
EMOJI_RE = re.compile("[\U0001F300-\U0001FAFF☀-➿]")


def enum(path):
    node = SCHEMA
    for key in path:
        node = node[key]
    return set(node["enum"])


CAST = enum(["$defs", "shot", "properties", "characters", "items", "properties", "id"])
SETS = enum(["$defs", "shot", "properties", "set"])
CAMERAS = enum(["$defs", "shot", "properties", "camera"])
ACTIONS = enum(["$defs", "shot", "properties", "characters", "items", "properties", "action"])
EXPRESSIONS = enum(["$defs", "shot", "properties", "characters", "items", "properties", "expression"])
POSITIONS = enum(["$defs", "shot", "properties", "characters", "items", "properties", "position"])
OVERLAYS = {o["properties"]["type"]["const"]: set(o["required"]) for o in SCHEMA["$defs"]["overlay"]["oneOf"]}


def section(text, name):
    match = re.search(rf"^## {re.escape(name)}\s*$(.*?)(?=^## |\Z)", text, re.M | re.S)
    return match.group(1).strip() if match else None


def check(path):
    text = Path(path).read_text(encoding="utf-8")
    fails, warns = [], []
    script = section(text, "SCRIPT")
    if not script:
        return ["No '## SCRIPT' section."], [], {}
    lines = [line.strip() for line in script.splitlines() if line.strip() and line.strip() != "---"]
    words = re.findall(r"[\w'’$]+", script)
    n = len(words)
    seconds = round(n / WPM * 60)
    lower = script.lower()

    # Length
    if n > 190:
        fails.append(f"{n} words is over the 190 hard ceiling.")
    elif n > 170 or n < 120:
        warns.append(f"{n} words is outside the 120–170 target.")

    # Words and punctuation
    for term in BANNED:
        if re.search(rf"\b{re.escape(term)}\b", lower):
            fails.append(f"Banned phrase in script: '{term}'.")
    if "—" in script or "–" in script or ";" in script:
        fails.append("Em-dash, en-dash or semicolon in the script body.")
    for i, line in enumerate(lines, 1):
        if line.startswith("#") or re.search(r"[\[\]{}]|^\(.*\)$", line) or EMOJI_RE.search(line):
            fails.append(f"Line {i} has a heading, bracket or emoji; the script must be spoken words only.")
    if CONFIG.get("spelling", "US English").startswith("US"):
        for word in UK_SPELLINGS:
            if re.search(rf"\b{word}", lower):
                warns.append(f"UK spelling '{word}' but config.json says US English.")

    # Hook and voice
    first_words = len(re.findall(r"[\w'’$]+", lines[0]))
    if first_words > 15:
        fails.append(f"Hook line 1 is {first_words} words; keep it under 15.")
    you = len(re.findall(r"\byou(r|'re|'ve|'ll|'d|rself)?\b", lower))
    if n and 100 * you / n < 6:
        warns.append(f"'You' density is {100 * you / n:.1f} per 100 words; aim for 7–10.")
    i_count = len(re.findall(r"\bi\b|\bi'm\b|\bi've\b|\bmine\b", lower))
    if i_count > 2:
        warns.append(f"'I' appears {i_count} times; keep it to 2 or fewer.")
    if not re.search(r"you're (probably )?(thinking|wondering)|i know,? you|sounds (too )?(simple|weird|needy)|feels (weird|needy)|you might think", lower):
        warns.append("No voiced objection found (e.g. \"You're thinking…\"). Add one or say why not.")
    if not re.search(r"\b(but|so)\b", lower):
        fails.append("No BUT or SO anywhere: this is a list, not a script.")
    if not re.search(r"\bsend this to\b", lines[-1].lower()):
        warns.append("Last line isn't a share prompt ('Send this to…').")
    short = sum(1 for line in lines if len(line.split()) <= 3)
    if short < 2:
        warns.append("Fewer than two 1–3 word lines; the rhythm may be flat.")

    # Storyboard
    board_text = section(text, "STORYBOARD")
    if board_text is None:
        fails.append("No '## STORYBOARD' section.")
    else:
        block = re.search(r"```json\s*(.*?)```", board_text, re.S)
        if not block:
            fails.append("STORYBOARD has no ```json block.")
        else:
            try:
                board = json.loads(block.group(1))
            except json.JSONDecodeError as err:
                fails.append(f"Storyboard JSON doesn't parse: {err}.")
                board = None
            if board is not None:
                fails += check_board(board, lines, script)
    return fails, warns, {"words": n, "seconds": seconds, "lines": len(lines)}


def check_board(board, lines, script):
    fails = []
    if board.get("version") != 1:
        fails.append("Storyboard 'version' must be 1.")
    for cid in board.get("names", {}):
        if cid not in CAST:
            fails.append(f"names: unknown cast id '{cid}'.")
    shots = board.get("shots", [])
    if len(shots) != len(lines):
        fails.append(f"{len(shots)} shots for {len(lines)} script lines; need exactly one per line.")
    norm = lambda s: re.sub(r"\s+", " ", s).strip()
    for i, shot in enumerate(shots, 1):
        where = f"Shot {i}"
        if shot.get("line") != i:
            fails.append(f"{where}: 'line' should be {i}.")
        if i <= len(lines) and norm(shot.get("text", "")) != norm(lines[i - 1]):
            fails.append(f"{where}: text doesn't match script line {i}.")
        if shot.get("set") not in SETS:
            fails.append(f"{where}: unknown set '{shot.get('set')}'.")
        if shot.get("camera") not in CAMERAS:
            fails.append(f"{where}: unknown camera '{shot.get('camera')}'.")
        chars = shot.get("characters", [])
        if len(chars) > 4:
            fails.append(f"{where}: more than 4 characters.")
        for c in chars:
            for key, allowed in (("id", CAST), ("action", ACTIONS), ("expression", EXPRESSIONS), ("position", POSITIONS)):
                if c.get(key) not in allowed:
                    fails.append(f"{where}: unknown {key} '{c.get(key)}'.")
        overlay = shot.get("overlay")
        if overlay is not None:
            kind = overlay.get("type")
            if kind not in OVERLAYS:
                fails.append(f"{where}: unknown overlay '{kind}'.")
            else:
                missing = OVERLAYS[kind] - set(overlay)
                if missing:
                    fails.append(f"{where}: {kind} is missing {', '.join(sorted(missing))}.")
    if shots and (shots[0].get("overlay") or {}).get("type") != "big_text":
        fails.append("Shot 1 needs a big_text overlay with the short hook.")
    if STUDY_RE.search(script) and not any((s.get("overlay") or {}).get("type") == "study_card" for s in shots):
        fails.append("The script cites research but no shot has a study_card.")
    return fails


def main(paths):
    if not paths:
        print(__doc__)
        sys.exit(1)
    worst = 0
    for path in paths:
        fails, warns, stats = check(path)
        status = "FAIL" if fails else "PASS"
        worst = max(worst, 1 if fails else 0)
        print(f"{status}  {path}" + (f"  ({stats['words']} words ≈ {stats['seconds']}s, {stats['lines']} lines)" if stats else ""))
        for f in fails:
            print(f"  ✗ {f}")
        for w in warns:
            print(f"  ! {w}")
    sys.exit(worst)


if __name__ == "__main__":
    main(sys.argv[1:])
