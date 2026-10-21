#!/usr/bin/env python3
"""Mechanical checks for a finished script file (scripts/*.md). Standard library only.

  python3 tools/check_script.py scripts/2026-10-21-the-doorway-test.md [more files…]

Checks what a machine can check from knowledge/10-quality-checklist.md: length, banned
words, punctuation, reading level (knowledge/16-short-form-guide.md), no citations in the spoken script (knowledge/00-what-performs.md §4),
the lead (knowledge/04-lesson-engine.md: "you" in the opening, no warm-up, turns every few
lines, a callback, the LOOP MAP), the hook's first line and voice density, plus the storyboard
must-haves in knowledge/12-visual-storyboard.md §5 (every line in a shot, library reuse,
cues on spoken words), and that the ELEVENLABS block says exactly the SCRIPT's words with
sensible audio tags (knowledge/14-voice-tags.md). It cannot judge whether the script or the visuals are good.
It also enforces the Playbook phase (config.json playbook.status, knowledge/01-audience-and-account.md):
no Playbook CTA in the video while it's coming soon, the CTA at the end once it's live.
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
PLAYBOOK = CONFIG.get("playbook", {})
CHAPTERS = PLAYBOOK.get("chapters", [])
PLAYBOOK_RE = re.compile(r"\bplaybook\b|\blink in (my |the )?bio\b|\bin my bio\b|\b(check|see) (my|the) bio\b", re.I)

BANNED = ["delve", "tapestry", "testament", "unravel", "navigate", "realm", "embark", "intricate", "pivotal",
          "leverage", "synergy", "unlock", "game-changer", "game changer", "level up", "in today's world",
          "in a world where", "let's dive in", "buckle up", "here's the kicker", "the secret nobody tells you",
          "this will change your life", "alpha", "high-value man", "high value man", "manipulate",
          "dark psychology", "and then"]
UK_SPELLINGS = ["favour", "favourite", "realise", "organise", "colour", "behaviour", "apologise", "recognise"]
# Narrated citations cost retention (knowledge/00-what-performs.md §4). These fail; tell the fact as a scene.
CITE_FAIL = re.compile(
    r"\bresearchers?\b|\bresearch (shows|showed|found|finds|says|suggests|proves)\b|\bstudies\b"
    r"|\b(a|the|one|this|that|new|recent|famous|classic|their) (\d{4} )?(study|experiment|paper|survey)\b"
    r"|\bstudy (found|finds|shows|showed)\b|\bexperiments?\b"
    r"|\b(scientists?|psychologists?|neuroscientists?|economists?|professors?|academics?)\b"
    r"|\baccording to\b|\b(science|data) (says|shows|showed|proves)\b", re.I)
# These usually mean a source or a lecture slipped in. Warn.
CITE_WARN = re.compile(
    r"\bthe [\w-]+ (effect|bias|principle|fallacy|paradox|heuristic)\b|\b(found|discovered|proved) that\b"
    r"|\breported\b|\b(journal|university|forbes|harvard|stanford|oxford|ucla|mit)\b"
    r"|\bthe (lesson|moral|takeaway)\b", re.I)
WARMUP_RE = re.compile(r"^(so|okay|ok|guys|today|here's (something|a thing|why)|have you ever|did you know|"
                       r"this is (one of )?the (craziest|wildest|weirdest)|wait (till|until)|you (won't|will never) believe|"
                       r"let me tell you|imagine)\b", re.I)
# A line that turns, pulls or asks (knowledge/04-lesson-engine.md §2). Plain escalation can't be detected,
# so a long run without one is a warning, not a fail.
PULL_RE = re.compile(
    r"^(but|so|until|except|instead|now|then|because|which|yet|still|even|only|unless|watch|not|no|nobody|"
    r"most people|that's (why|when|the))\b|\b(but|until|except|instead|which means|that's why|because)\b|\?$"
    r"|\b(yet|hasn't|haven't|about to|the part|the real|the reason|is why|that's when|turns out|the catch|"
    r"one (tiny|thing|question|person|mistake|change|line|detail)|you'?d (think|guess|expect|swear|assume)|isn't|it's not|that's not|wasn't|problem)\b", re.I)
WRONG_GUESS_RE = re.compile(r"\byou'?d (think|guess|expect|assume)|you might think|you're (probably )?(thinking|wondering)|"
                            r"\bmost people (think|assume|guess)", re.I)
STOP = set("the a an and or but so of to in on at for with is it its it's that this you your you're i be are was were "
           "they them their he she his her we our not no do does did just one get got have has had will would can could if "
           "then than as by from up out what who when why how all any more most very like there here into over about "
           "they're he's she's that's what's don't isn't".split())
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
TAG_RE = re.compile(r"\[([^\[\]]+)\]")
KNOWN_TAGS = set(CONFIG.get("elevenlabs", {}).get("tags", []))


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


def tagged_text(text):
    """The paste-ready ElevenLabs text (with audio tags), or None if the file has no block."""
    body = section(text, "ELEVENLABS")
    if body is None:
        return None
    block = re.search(r"```(?:text)?\s*(.*?)```", body, re.S)
    return (block.group(1) if block else body).strip()


def untag(text):
    return re.sub(r"\s+", " ", TAG_RE.sub(" ", text)).strip()


def check_tags(tagged, script, n_words):
    """The ELEVENLABS block must say the SCRIPT's words, with tags at the turns."""
    fails, warns = [], []
    said, written = tokens(untag(tagged)), tokens(script)
    if said != written:
        k = next((i for i, (a, b) in enumerate(zip(said, written)) if a != b), min(len(said), len(written)))
        fails.append(f"ELEVENLABS words differ from SCRIPT at word {k + 1}: "
                     f"'{' '.join(said[k:k + 5])}' vs '{' '.join(written[k:k + 5])}'. Keep them identical.")
    tags = [t.strip().lower() for t in TAG_RE.findall(tagged)]
    if len(tags) < 5:
        warns.append(f"Only {len(tags)} audio tags; aim for one every sentence or two (about 7 to 11).")
    elif len(tags) > max(12, n_words // 12):
        warns.append(f"{len(tags)} audio tags is a lot; past about 11 the delivery gets jumpy.")
    if not tagged.startswith("["):
        warns.append("ELEVENLABS doesn't open with a tag; set the hook's delivery from the first word.")
    if re.search(r"\]\s*\[", tagged):
        warns.append("Two tags side by side; use one per spot (pause tags may follow an emotion tag only if you've heard it work).")
    if KNOWN_TAGS:
        for t in sorted(set(tags) - KNOWN_TAGS):
            warns.append(f"Tag [{t}] isn't in config.json's elevenlabs.tags; fine if you've heard it work, then add it.")
    if "\n" in tagged:
        warns.append("ELEVENLABS should be one paragraph, ready to paste.")
    return fails, warns


def syllables(word):
    """Rough English syllable count, good enough for a reading-level estimate."""
    w = word.lower().strip("'")
    if len(w) <= 3:
        return 1
    w = re.sub(r"(?:[^laeiouy]es|ed|[^laeiouy]e)$", "", w)
    w = re.sub(r"^y", "", w)
    return max(1, len(re.findall(r"[aeiouy]{1,2}", w)))


def reading_grade(lines):
    """Flesch-Kincaid grade of the spoken script. Aim for about 5th grade (knowledge/16-short-form-guide.md B1)."""
    text = " ".join(lines)
    words = re.findall(r"[A-Za-z']+", text)
    if not words:
        return 0.0
    sentences = max(1, len(re.findall(r"[.!?]+", text)))
    return 0.39 * len(words) / sentences + 11.8 * sum(syllables(w) for w in words) / len(words) - 15.59


def check_caption(caption, lines):
    """Captions are teasers (knowledge/05-endings-and-ctas.md): one line that makes people watch, naming nothing
    from the video (no brand, story, fact, answer or move)."""
    if not caption:
        return []
    warns = []
    body = [l.strip() for l in caption.replace("---", "").splitlines() if l.strip()]
    tease = [l for l in body if not l.startswith("#") and "playbook" not in l.lower()]
    if tease and len(tease[0]) > 125:
        warns.append(f"Caption line 1 is {len(tease[0])} characters; keep the teaser under 125 so it all shows before 'more'.")
    if len(tease) > 1:
        warns.append(f"The caption has {len(tease)} lines before the Playbook line; a teaser is one line.")
    if sum(1 for l in body if re.match(r"^(→|•|📍|-\s|\d+[.)]\s)", l)) >= 2:
        warns.append("The caption has a list. Teasers don't give steps; keep them for the Playbook.")
    if re.search(r"\bif you sell\b|\bsteal the move\b|\bhere's how\b|\btry it this week\b", caption, re.I):
        warns.append("The caption gives the move away (a rule, 'steal the move', 'here's how').")
    # names from the video (brands, people, places): capitalised words that aren't the first word of a line
    names = {w.strip(".,!?'’").lower() for l in lines for w in l.split()[1:] if w[:1].isupper() and w.strip(".,!?'’") not in ("I", "I'm", "I've", "I'll")}
    names |= {w.lower() for w in re.findall(r"\$?\d[\d,.]*", " ".join(lines))}
    said = {w.strip(".,!?'’").lower() for l in tease for w in l.split()}
    named = sorted(n for n in names if len(n) > 1 and n in said and n not in ("you", "your", "so", "but"))
    if named:
        warns.append(f"The caption names something from the video ({', '.join(named)}). Teasers hide the subject.")
    return warns


def check_loop_map(loop_map, n_lines):
    """The LOOP MAP (knowledge/04-lesson-engine.md §4): L1 opens early and closes in the last 20%."""
    if loop_map is None:
        return ["No '## LOOP MAP' section (each loop's opening line, the viewer's question, its closing line)."]
    warns = []
    rows = re.findall(r"^\s*(L\d+)\s+lines?\s+(\d+)(.*)$", loop_map, re.M)
    if len(rows) < 3:
        warns.append(f"LOOP MAP lists {len(rows)} loop(s); a 45-second script usually needs 3 to 6.")
    for name, opened, rest in rows:
        closes = [int(x) for x in re.findall(r"\b(\d+)\b", rest.split("→", 1)[1])] if "→" in rest else []
        for x in [int(opened)] + closes:
            if x > n_lines:
                warns.append(f"LOOP MAP {name} points at line {x}, but the script has {n_lines} lines. Renumber it.")
        if name == "L1":
            if int(opened) > 3:
                warns.append(f"L1 opens on line {opened}; the hook's loop should open in the hook (the first three lines).")
            if closes and max(closes) < int(n_lines * 0.75):
                warns.append(f"L1 is fully answered on line {max(closes)} of {n_lines}. Hold the hook's answer for the last 20%.")
    return warns


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
    brand = bool(re.search(r"\*\*Format:\*\*\s*F7", text))  # Brand X-ray (knowledge/15-brand-xray.md)

    # Length
    if n > 190:
        fails.append(f"{n} words is over the 190 hard ceiling.")
    elif brand and (n > 160 or n < 95):
        warns.append(f"{n} words is outside the 100–155 target for a Brand X-ray.")
    elif not brand and (n > 170 or n < 120):
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
    if n and 100 * you / n < 6 and not brand:
        warns.append(f"'You' density is {100 * you / n:.1f} per 100 words; aim for 7–10.")
    i_count = len(re.findall(r"\bi\b|\bi'm\b|\bi've\b|\bmine\b", lower))
    if i_count > 2:
        warns.append(f"'I' appears {i_count} times; keep it to 2 or fewer.")
    if not brand and not re.search(r"you're (probably )?(thinking|wondering)|i know,? you|sounds (too )?(simple|weird|needy)|feels (weird|needy)|you might think", lower):
        warns.append("No voiced objection found (e.g. \"You're thinking…\"). Add one or say why not.")
    if brand and not re.search(r"\bso if you sell\b|\bif you sell\b", lower):
        warns.append("Brand X-ray with no seller's rule ('So if you sell anything…').")
    if not re.search(r"\b(but|so)\b", lower):
        fails.append("No BUT or SO anywhere: this is a list, not a script.")

    # No citations: research everything, cite nothing (knowledge/07-research-playbook.md §3)
    for i, line in enumerate(lines, 1):
        hit = CITE_FAIL.search(line)
        if hit:
            fails.append(f"Line {i} cites research ('{hit.group(0)}'). Tell it as what happened, as a scene; the source goes in the fact sheet.")
        else:
            soft = CITE_WARN.search(line)
            if soft:
                warns.append(f"Line {i} sounds like a source or a lecture ('{soft.group(0)}'). Show it happening instead.")

    # The lead (knowledge/03-hooks.md "The lead hook", knowledge/04-lesson-engine.md)
    if lines and WARMUP_RE.search(lines[0]):
        warns.append(f"Line 1 opens with a warm-up ('{WARMUP_RE.search(lines[0]).group(0)}'). Start in the scene.")
    if lines and not any(re.search(r"\byou(r|'re|'ve|'ll|'d)?\b", l, re.I) for l in lines[:3]):
        warns.append("No 'you' in the first three lines. Drop the viewer into the scene (N12).")
    run, start, worst = 0, 0, (0, 0)
    body = lines[:-1] if lines and re.search(r"\bsend this to\b", lines[-1].lower()) else lines
    for i, line in enumerate(body, 1):
        if PULL_RE.search(line):
            run = 0
        else:
            run, start = run + 1, (start if run else i)
            if run > worst[0]:
                worst = (run, start)
    if worst[0] > 5:
        warns.append(f"Lines {worst[1]}–{worst[1] + worst[0] - 1} ({worst[0]} lines) have no turn, question or pointer. "
                     "Fine only if every line escalates; otherwise add a BUT or a pointer.")
    content = lambda ls: {w for w in tokens(" ".join(ls)) if w not in STOP and len(w) > 2}
    if len(body) >= 6 and not content(body[:3]) & content(body[-4:]):
        warns.append("The payoff doesn't call back to the hook. Bring a word or picture from line 1 back at the end.")
    if not WRONG_GUESS_RE.search(lower) and brand:
        warns.append("No wrong guess voiced (\"You'd think it's for X. It isn't.\").")
    loop_warns = check_loop_map(section(text, "LOOP MAP"), len(lines))
    warns += loop_warns
    # The Playbook phase (knowledge/05-endings-and-ctas.md)
    live = PLAYBOOK.get("status", "coming_soon") == "live"
    pb_lines = [i for i, l in enumerate(lines, 1) if PLAYBOOK_RE.search(l)]
    if not live and pb_lines:
        fails.append(f"Line {pb_lines[0]} mentions the Playbook or the bio, but playbook.status is coming_soon. Keep it out of the video until it's live.")
    if live and not any(PLAYBOOK_RE.search(l) for l in lines[-2:]):
        warns.append(f"The Playbook is live: end on \"{PLAYBOOK.get('live_video_cta', '')}\" (after the payoff or the share prompt).")
    tail = lines[-2:] if live else lines[-1:]
    if not any(re.search(r"\bsend this to\b", l.lower()) for l in tail):
        warns.append("Last line isn't a share prompt ('Send this to…').")
    chapter = re.search(r"\*\*Playbook chapter:\*\*\s*([^\n·]+)", text)
    if not chapter:
        warns.append("No '**Playbook chapter:**' in the header" + (f" (one of: {', '.join(CHAPTERS)})." if CHAPTERS else "."))
    elif CHAPTERS and chapter.group(1).strip() not in CHAPTERS:
        warns.append(f"Playbook chapter '{chapter.group(1).strip()}' isn't one of: {', '.join(CHAPTERS)}.")
    caption = section(text, "CAPTION") or ""
    warns += check_caption(caption, lines)
    if caption and PLAYBOOK and "playbook" not in caption.lower():
        warns.append(f"The caption has no Playbook line. End it with: {PLAYBOOK.get('live_caption_line' if live else 'caption_line', '')}")
    grade = reading_grade(lines)
    if grade > 5:
        warns.append(f"Reading level is about grade {grade:.1f}; aim for 5th grade or below (shorter words and sentences).")
    short = sum(1 for line in lines if len(line.split()) <= 3)
    if short < 2:
        warns.append("Fewer than two 1–3 word lines; the rhythm may be flat.")

    # ElevenLabs text
    tagged = tagged_text(text)
    if tagged is None:
        fails.append("No '## ELEVENLABS' section (the SCRIPT as one paragraph with audio tags).")
    else:
        tag_fails, tag_warns = check_tags(tagged, script, n)
        fails += tag_fails
        warns += tag_warns

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
    if any("study_card" in comps(s) for s in shots):
        warns.append("A study_card puts a citation on screen. New scripts show the scene instead (knowledge/12-visual-storyboard.md §4).")
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
