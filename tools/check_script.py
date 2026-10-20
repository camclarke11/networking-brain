#!/usr/bin/env python3
"""Mechanical checks for a finished script file (scripts/*.md). Standard library only.

  python3 tools/check_script.py scripts/2026-10-21-the-doorway-test.md [more files…]

Checks what a machine can check from knowledge/10-quality-checklist.md: length, banned
words, punctuation, the hook's first line and voice density, plus the storyboard
must-haves in knowledge/12-visual-storyboard.md §5 (every line in a shot, library reuse,
cues on spoken words). It cannot judge whether the script or the visuals are good.
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


def enum(node, *path):
    for key in path:
        node = node[key]
    return set(node["enum"])


SHOT = SCHEMA["$defs"]["shot"]["properties"]
CAST = enum(SHOT, "cast", "items")
ASSET_KINDS = enum(SCHEMA, "$defs", "asset", "properties", "kind")
COMPONENTS = {c["properties"]["type"]["const"]: set(c["required"]) - {"type"} for c in SCHEMA["$defs"]["component"]["oneOf"]}
SAYS_EXACT = {"quote_bubble", "x_check", "dm_screen"}
LIBRARY = ROOT / "visuals" / "library.json"


def tokens(text):
    """Lowercase spoken tokens, with number commas and curly apostrophes normalised."""
    text = text.lower().replace("’", "'")
    text = re.sub(r"(?<=\d),(?=\d)", "", text)
    return re.findall(r"[a-z0-9$']+", text)


def contains(haystack, needle):
    n = len(needle)
    return n > 0 and any(haystack[i:i + n] == needle for i in range(len(haystack) - n + 1))


def script_lines(text):
    script = section(text, "SCRIPT") or ""
    return [line.strip() for line in script.splitlines() if line.strip() and line.strip() != "---"]


def read_board(text):
    """The storyboard JSON from a script file, or None if there isn't a parseable one."""
    board_text = section(text, "STORYBOARD")
    block = re.search(r"```json\s*(.*?)```", board_text or "", re.S)
    if not block:
        return None
    try:
        return json.loads(block.group(1))
    except json.JSONDecodeError:
        return None


def section(text, name):
    match = re.search(rf"^## {re.escape(name)}\s*$(.*?)(?=^## |\Z)", text, re.M | re.S)
    return match.group(1).strip() if match else None


def check(path, library=None):
    text = Path(path).read_text(encoding="utf-8")
    fails, warns = [], []
    script = section(text, "SCRIPT")
    if not script:
        return ["No '## SCRIPT' section."], [], {}
    lines = script_lines(text)
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
    elif not re.search(r"```json\s*(.*?)```", board_text, re.S):
        fails.append("STORYBOARD has no ```json block.")
    else:
        board = read_board(text)
        if board is None:
            fails.append("Storyboard JSON doesn't parse.")
        else:
            if library is None:
                library = json.loads(LIBRARY.read_text(encoding="utf-8")) if LIBRARY.exists() else {"assets": []}
            board_fails, board_warns = check_board(board, lines, script, Path(path).stem, library)
            fails += board_fails
            warns += board_warns
    return fails, warns, {"words": n, "seconds": seconds, "lines": len(lines)}


def check_board(board, lines, script, stem, library):
    """Must-haves from knowledge/12-visual-storyboard.md §5. Returns (fails, warns)."""
    fails, warns = [], []
    if board.get("version") != 2:
        fails.append("Storyboard 'version' must be 2 (see templates/storyboard.schema.json).")
    concept = board.get("concept") or {}
    if not concept.get("metaphor") or not concept.get("why"):
        fails.append("concept needs a 'metaphor' and a 'why'.")
    for cid in board.get("names", {}):
        if cid not in CAST:
            fails.append(f"names: unknown cast id '{cid}'.")

    lib = {a["id"]: a for a in library.get("assets", []) if a.get("status") != "retired"}
    new_specs = {a.get("id"): a for a in board.get("new_assets", [])}
    for aid, spec in new_specs.items():
        if spec.get("kind") not in ASSET_KINDS:
            fails.append(f"new_assets '{aid}': kind must be one of {', '.join(sorted(ASSET_KINDS))}.")
        if len((spec.get("description") or "").split()) < 8:
            fails.append(f"new_assets '{aid}': describe it well enough to build (shape, material, size, movement).")
        if aid in lib and lib[aid].get("first_used") != stem:
            fails.append(f"'{aid}' is already in the library; reuse it under 'uses' instead of 'new'.")

    shots = board.get("shots", [])
    expected, referenced_new = 1, set()
    for n, shot in enumerate(shots, 1):
        where = f"Shot {n}"
        if shot.get("id") != n:
            fails.append(f"{where}: 'id' should be {n}.")
        span = shot.get("lines") or [0, 0]
        first, last = (span + [0, 0])[:2]
        if first != expected or last < first:
            fails.append(f"{where}: lines {span} should start at line {expected} (every line in one shot, in order).")
        expected = max(expected, last + 1)
        spoken = tokens(" ".join(lines[first - 1:last])) if first >= 1 else []
        if len((shot.get("what_we_see") or "").split()) < 8:
            fails.append(f"{where}: 'what_we_see' is too thin to build from.")
        if not shot.get("camera"):
            fails.append(f"{where}: no camera.")
        for cid in shot.get("cast", []):
            if cid not in CAST:
                fails.append(f"{where}: unknown cast id '{cid}'. New looks for the cast are a 'costume' asset.")
        for uid in shot.get("uses", []):
            if uid in new_specs and uid not in lib:
                if uid not in referenced_new:
                    fails.append(f"{where}: '{uid}' is new in this video; list it under 'new' the first time it appears.")
            elif uid not in lib:
                fails.append(f"{where}: '{uid}' isn't in visuals/library.json.")
        for nid in shot.get("new", []):
            referenced_new.add(nid)
            if nid not in new_specs:
                fails.append(f"{where}: new asset '{nid}' isn't described in new_assets.")
        for cue in shot.get("cues", []):
            cue_line = cue.get("line")
            pool = tokens(lines[cue_line - 1]) if cue_line and first <= cue_line <= last else spoken
            if not contains(pool, tokens(cue.get("word", ""))):
                fails.append(f"{where}: cue word '{cue.get('word')}' isn't spoken in this shot.")
        for comp in shot.get("on_screen", []):
            kind = comp.get("type")
            if kind not in COMPONENTS:
                fails.append(f"{where}: unknown on-screen component '{kind}'.")
                continue
            missing = COMPONENTS[kind] - set(comp)
            if missing:
                fails.append(f"{where}: {kind} is missing {', '.join(sorted(missing))}.")
            if comp.get("at") and not contains(spoken, tokens(comp["at"])):
                fails.append(f"{where}: {kind} 'at' word '{comp['at']}' isn't spoken in this shot.")
        changes = 1 + len(shot.get("cues", [])) + sum(1 for c in shot.get("on_screen", []) if c.get("at"))
        if spoken and len(spoken) / changes > 14:
            warns.append(f"{where}: {len(spoken)} words with only {changes} visual change(s); add cues so something moves every 2 to 4 seconds.")
    if lines and expected != len(lines) + 1:
        fails.append(f"Shots cover lines 1 to {expected - 1}, but the script has {len(lines)} lines.")
    metaphor_id = concept.get("library_metaphor")
    if metaphor_id:
        referenced_new.add(metaphor_id)
        if metaphor_id not in lib and metaphor_id not in new_specs:
            fails.append(f"concept.library_metaphor '{metaphor_id}' isn't in the library or new_assets.")
    for aid in new_specs:
        if aid not in referenced_new:
            fails.append(f"new_assets '{aid}' isn't used in any shot.")

    comps = lambda s: [c.get("type") for c in s.get("on_screen", [])]
    if shots and "big_text" not in comps(shots[0]):
        fails.append("Shot 1 needs a big_text with the short hook.")
    if not any(t in SAYS_EXACT for s in shots for t in comps(s)):
        fails.append("The exact words to say never appear on screen (quote_bubble, x_check or dm_screen).")
    if STUDY_RE.search(script) and not any("study_card" in comps(s) and "professor" in s.get("cast", []) for s in shots):
        fails.append("The script cites research but no shot has a study_card with the professor.")
    if shots and lines and re.search(r"\bsend this to\b", lines[-1].lower()) and "friend" not in shots[-1].get("cast", []):
        fails.append("The share prompt's shot needs 'friend' in it.")
    if not any(s.get("screenshot") for s in shots):
        warns.append("No shot is marked as the screenshot moment.")
    built = sum(1 for a in lib.values() if a.get("status") != "core")
    fresh = [a for a in new_specs if a not in lib or lib[a].get("first_used") == stem]
    if len(fresh) > 3:
        note = " (fine while the library is young)" if built < 20 else ""
        warns.append(f"{len(fresh)} new assets; aim for 3 or fewer{note}.")
    return fails, warns


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
