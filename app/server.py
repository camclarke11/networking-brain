#!/usr/bin/env python3
"""Brain Studio: a local web app over everything this repo does. Standard library only.

  python3 app/server.py [--port 8787]     then open http://localhost:8787

Scripts (read, check, edit the ELEVENLABS tags, set status), ElevenLabs voice takes (cost shown
before you spend, identical takes never paid for twice, cheap Turbo drafts), timing, video
prep/stills/render, the topic bank, the prop library, performance data and the knowledge files.
Writing scripts and coding videos runs Claude Code headless (`claude -p "/script T02"`) as a job.
Binds to 127.0.0.1 only: it can run commands and spend ElevenLabs credits.
"""
import argparse
import csv
import hashlib
import json
import mimetypes
import os
import re
import shutil
import statistics
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STATIC = Path(__file__).resolve().parent / "static"
sys.path.insert(0, str(ROOT / "tools"))
import check_script as C  # noqa: E402
import library as L  # noqa: E402
import voice as V  # noqa: E402

SCRIPTS = ROOT / "scripts"
PUBLIC = ROOT / "video" / "public"
OUT = ROOT / "video" / "out"
VIDEOS_SRC = ROOT / "video" / "src" / "videos"
CONFIG_PATH = ROOT / "config.json"
CONTENT_LOG = ROOT / "content-log.md"
TOPIC_BANK = ROOT / "topics" / "topic-bank.md"
LAB = "_lab"  # take folder for free-text tests that don't belong to a script
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$|^_lab$")
STATUSES = ["drafted", "approved", "rendered", "posted", "dropped"]
API = "https://api.elevenlabs.io"


# ---------- helpers ----------

def config():
    return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))


def save_config(cfg):
    CONFIG_PATH.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def eleven_cfg():
    return config().get("elevenlabs", {})


def rel(p):
    return str(Path(p).relative_to(ROOT))


def script_path(slug):
    if not SLUG_RE.match(slug or ""):
        raise ValueError("bad slug")
    p = SCRIPTS / f"{slug}.md"
    if not p.exists():
        raise FileNotFoundError(slug)
    return p


def media_url(p):
    return "/media/" + urllib.parse.quote(rel(p))


# ---------- content log & scripts ----------

def content_log():
    """{slug: {status, title, format, hook, tool, study, link, views, date}} from content-log.md."""
    rows = {}
    for line in CONTENT_LOG.read_text(encoding="utf-8").splitlines():
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 10 and re.match(r"\d{4}-\d{2}-\d{2}", cells[0]):
            m = re.search(r"scripts/([\w.-]+)\.md", cells[7])
            if m:
                rows[m.group(1)] = dict(zip(["date", "status", "title", "format", "hook", "tool", "study", "file", "link", "views"], cells))
    return rows


def set_log_status(slug, status):
    if status not in STATUSES:
        raise ValueError(f"status must be one of {STATUSES}")
    lines = CONTENT_LOG.read_text(encoding="utf-8").splitlines(keepends=True)
    for i, line in enumerate(lines):
        if f"scripts/{slug}.md" in line and line.startswith("|"):
            cells = line.rstrip("\n").split("|")
            cells[2] = f" {status} "
            lines[i] = "|".join(cells) + "\n"
            CONTENT_LOG.write_text("".join(lines), encoding="utf-8")
            return True
    raise FileNotFoundError(f"{slug} isn't in content-log.md")


def header_fields(text):
    fields = {}
    for key, val in re.findall(r"\*\*([A-Za-z /]+):\*\*\s*([^*\n]+?)(?=\s*·|\s*$)", text.split("\n---", 1)[0], re.M):
        fields[key.strip().lower()] = val.strip()
    return fields


def beats(text):
    body = C.section(text, "SCRIPT") or ""
    return [[l.strip() for l in block.splitlines() if l.strip()] for block in re.split(r"\n\s*\n", body) if block.strip() and block.strip() != "---"]


def video_state(slug):
    return {
        "voice": media_url(PUBLIC / slug / "voice.mp3") if (PUBLIC / slug / "voice.mp3").exists() else None,
        "timed": (SCRIPTS / f"{slug}.timing.json").exists(),
        "coded": (VIDEOS_SRC / slug / "Video.tsx").exists(),
        "mp4": media_url(OUT / f"{slug}.mp4") if (OUT / f"{slug}.mp4").exists() else None,
        "sheets": [media_url(p) for p in sorted((OUT / slug).glob("sheet_*.jpg"))] if (OUT / slug).exists() else [],
    }


def script_summary(path, log):
    text = path.read_text(encoding="utf-8")
    fails, warns, stats = C.check(path)
    slug = path.stem
    h1 = re.search(r"^# (.+)$", text, re.M)
    row = log.get(slug, {})
    return {
        "slug": slug,
        "title": h1.group(1).strip() if h1 else slug,
        "status": row.get("status", "untracked"),
        "fields": header_fields(text),
        "words": stats.get("words"),
        "seconds": stats.get("seconds"),
        "check": "fail" if fails else ("warn" if warns else "pass"),
        "takes": len(list_takes(slug)),
        "video": video_state(slug),
    }


def list_scripts():
    log = content_log()
    return [script_summary(p, log) for p in sorted(SCRIPTS.glob("*.md"), reverse=True)]


def script_detail(slug):
    path = script_path(slug)
    text = path.read_text(encoding="utf-8")
    fails, warns, stats = C.check(path)
    d = script_summary(path, content_log())
    d.update({
        "beats": beats(text),
        "tagged": C.tagged_text(text) or "",
        "board": C.read_board(text),
        "sections": {name: C.section(text, name) or "" for name in ["TITLE / COVER OPTIONS", "HOOK OPTIONS", "CAPTION", "FACT SHEET & SOURCES"]},
        "fails": fails, "warns": warns, "stats": stats,
        "markdown": text,
    })
    return d


def save_tagged(slug, tagged):
    path = script_path(slug)
    text = path.read_text(encoding="utf-8")
    tagged = re.sub(r"\s+", " ", tagged).strip()
    block = f"## ELEVENLABS\n\n```text\n{tagged}\n```\n"
    if C.section(text, "ELEVENLABS") is None:
        text = text.replace("\n## STORYBOARD", f"\n{block}\n---\n\n## STORYBOARD", 1)
    else:
        text = re.sub(r"^## ELEVENLABS\s*$.*?(?=^---\s*$|^## )", lambda m: block + "\n", text, count=1, flags=re.M | re.S)
    path.write_text(text, encoding="utf-8")
    fails, warns, _ = C.check(path)
    return {"fails": fails, "warns": warns}


# ---------- ElevenLabs ----------

def api_key():
    V.load_env()
    return os.environ.get("ELEVENLABS_API_KEY", "")


def eleven(method, path, body=None, timeout=60):
    key = api_key()
    if not key:
        raise PermissionError("No ElevenLabs API key yet. Add it on the Voice page.")
    req = urllib.request.Request(API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
                                 headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        raise RuntimeError(http_detail(e)) from None


def http_detail(e):
    detail = e.read().decode("utf-8", "replace")
    try:
        d = json.loads(detail).get("detail", detail)
        detail = d.get("message", d) if isinstance(d, dict) else d
    except (ValueError, AttributeError):
        pass
    return f"ElevenLabs {e.code}: {detail}"


def save_key(key):
    key = key.strip()
    env = ROOT / ".env"
    lines = [l for l in (env.read_text(encoding="utf-8").splitlines() if env.exists() else []) if not l.startswith("ELEVENLABS_API_KEY=")]
    if key:
        lines.append(f"ELEVENLABS_API_KEY={key}")
    env.write_text("\n".join(lines) + "\n", encoding="utf-8")
    os.environ.pop("ELEVENLABS_API_KEY", None)
    if key:
        os.environ["ELEVENLABS_API_KEY"] = key


_cache = {}


def cached(name, seconds, fn):
    hit = _cache.get(name)
    if hit and time.time() - hit[0] < seconds:
        return hit[1]
    val = fn()
    _cache[name] = (time.time(), val)
    return val


def account():
    def get():
        try:
            sub = eleven("GET", "/v1/user/subscription")
        except RuntimeError as e:
            if "missing the permission" in str(e):
                return {"unavailable": "Your API key can't read the balance. Give it User → Read in ElevenLabs to see credits here."}
            raise
        used, limit = sub.get("character_count", 0), sub.get("character_limit", 0)
        reset = sub.get("next_character_count_reset_unix")
        return {"tier": sub.get("tier"), "used": used, "limit": limit, "remaining": max(limit - used, 0),
                "resets": datetime.fromtimestamp(reset, timezone.utc).strftime("%-d %b") if reset else None}
    return cached("account", 20, get)


def voices():
    def get():
        data = eleven("GET", "/v1/voices")
        return [{"id": v["voice_id"], "name": v.get("name"), "category": v.get("category"),
                 "labels": v.get("labels") or {}, "preview": v.get("preview_url")} for v in data.get("voices", [])]
    return cached("voices", 300, get)


def cost(text, model):
    rate = eleven_cfg().get("models", {}).get(model, {})
    chars = len(text)
    return {"chars": chars, "credits": round(chars * rate.get("credits_per_char", 1)), "usd": round(chars / 1000 * rate.get("usd_per_1k", 0.08), 3)}


def takes_dir(slug):
    return PUBLIC / slug / "takes"


def take_key(text, voice, model, settings, seed):
    raw = json.dumps([text, voice, model, settings or {}, seed], sort_keys=True)
    return hashlib.sha256(raw.encode()).hexdigest()[:12]


def list_takes(slug):
    d = takes_dir(slug)
    out = []
    for meta in sorted(d.glob("*.json"), key=lambda p: p.stat().st_mtime, reverse=True) if d.exists() else []:
        m = json.loads(meta.read_text(encoding="utf-8"))
        m.pop("alignment", None)
        m["url"] = media_url(meta.with_suffix(".mp3"))
        out.append(m)
    return out


def generate_take(slug, body):
    cfg = eleven_cfg()
    if slug == LAB:
        text = (body.get("text") or "").strip()
        part = True
    else:
        full = C.tagged_text(script_path(slug).read_text(encoding="utf-8")) or V.narration(script_path(slug))
        text = (body.get("text") or full).strip()
        part = text != full
    if not text:
        raise ValueError("Nothing to say.")
    voice = body.get("voice_id") or cfg.get("voice_id")
    if not voice:
        raise ValueError("Pick a voice first (Voice page).")
    model = body.get("model") or cfg.get("draft_model") or cfg.get("model")
    settings = body.get("settings") or cfg.get("voice_settings")
    seed = body.get("seed")
    key = take_key(text, voice, model, settings, seed)
    d = takes_dir(slug)
    d.mkdir(parents=True, exist_ok=True)
    existing = [t for t in list_takes(slug) if t.get("key") == key]
    if existing and not body.get("force"):
        return {"cached": True, "take": existing[0]}
    tid = key if not existing else f"{key}-{uuid.uuid4().hex[:4]}"
    mp3 = d / f"{tid}.mp3"
    if not api_key():
        raise PermissionError("No ElevenLabs API key yet. Add it on the Voice page.")
    try:
        spoken, swaps = V.say_as(text)  # brand names the voice gets wrong (config.json elevenlabs.say)
        stamps = V.elevenlabs(spoken, voice, mp3, model=model, settings=settings, seed=seed)
        if swaps:
            stamps["alignment"] = V.unsay(stamps["alignment"], swaps)
    except urllib.error.HTTPError as e:
        raise RuntimeError(http_detail(e)) from None
    meta = {"id": tid, "key": key, "slug": slug, "text": text, "partial": part, "voice_id": voice,
            "voice_name": body.get("voice_name") or cfg.get("voice_name") or voice, "model": model,
            "settings": settings, "seed": seed, "created": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "starred": False, **cost(text, model), "alignment": stamps["alignment"]}
    (d / f"{tid}.json").write_text(json.dumps(meta, indent=1) + "\n", encoding="utf-8")
    _cache.pop("account", None)
    meta.pop("alignment")
    meta["url"] = media_url(mp3)
    return {"cached": False, "take": meta}


def take_paths(slug, tid):
    if not re.match(r"^[a-f0-9-]+$", tid):
        raise ValueError("bad take id")
    d = takes_dir(slug)
    return d / f"{tid}.mp3", d / f"{tid}.json"


def use_take(slug, tid):
    """Make a take the script's narration: voice.mp3 + words.json, then time the storyboard."""
    script = script_path(slug)
    mp3, meta_path = take_paths(slug, tid)
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    if meta.get("partial"):
        raise ValueError("That take is only part of the script. Use a full take.")
    shutil.copy(mp3, PUBLIC / slug / "voice.mp3")
    words = script.with_suffix(".words.json")
    words.write_text(json.dumps({"alignment": meta["alignment"]}, indent=1) + "\n", encoding="utf-8")
    r = subprocess.run([sys.executable, ROOT / "tools" / "align.py", script, words], capture_output=True, text=True, cwd=ROOT)
    timing = script.with_suffix(".timing.json")
    if timing.exists() and (VIDEOS_SRC / slug).exists():
        shutil.copy(timing, VIDEOS_SRC / slug / "timing.json")
    for t in takes_dir(slug).glob("*.json"):
        m = json.loads(t.read_text(encoding="utf-8"))
        if m.get("used") != (t.stem == tid):
            m["used"] = t.stem == tid
            t.write_text(json.dumps(m, indent=1) + "\n", encoding="utf-8")
    return {"ok": r.returncode == 0, "output": (r.stdout + r.stderr).strip()}


def update_take(slug, tid, changes):
    _, meta_path = take_paths(slug, tid)
    m = json.loads(meta_path.read_text(encoding="utf-8"))
    for k in ("starred", "note"):
        if k in changes:
            m[k] = changes[k]
    meta_path.write_text(json.dumps(m, indent=1) + "\n", encoding="utf-8")
    return {"ok": True}


def delete_take(slug, tid):
    for p in take_paths(slug, tid):
        p.unlink(missing_ok=True)
    return {"ok": True}


def spend_summary():
    total, takes = 0, 0
    for meta in PUBLIC.glob("*/takes/*.json"):
        m = json.loads(meta.read_text(encoding="utf-8"))
        total += m.get("credits", 0)
        takes += 1
    return {"takes": takes, "credits": total}


# ---------- jobs ----------

JOBS = {}
# Skill lets a writing job load the short-form-scripts skill when the CLI has it (knowledge/16 is the fallback).
CLAUDE_TOOLS = ["Read", "Write", "Edit", "Glob", "Grep", "WebSearch", "WebFetch", "TodoWrite", "Skill",
                "Bash(python3:*)", "Bash(ls:*)", "Bash(cat:*)", "Bash(head:*)", "Bash(wc:*)", "Bash(grep:*)",
                "Bash(npx:*)", "Bash(npm:*)", "Bash(node:*)", "Bash(ffmpeg:*)", "Bash(ffprobe:*)", "Bash(mkdir:*)"]


def claude_line(raw):
    """Turn one stream-json event from `claude -p` into a readable log line (or None)."""
    try:
        ev = json.loads(raw)
    except ValueError:
        return raw
    if ev.get("type") == "assistant":
        out = []
        for c in ev.get("message", {}).get("content", []):
            if c.get("type") == "text" and c["text"].strip():
                out.append(c["text"].strip())
            elif c.get("type") == "tool_use":
                inp = c.get("input", {})
                what = inp.get("command") or inp.get("file_path") or inp.get("query") or inp.get("url") or inp.get("pattern") or ""
                out.append(f"→ {c['name']}  {str(what)[:160]}")
        return "\n".join(out) or None
    if ev.get("type") == "result":
        return f"✓ Done in {round(ev.get('duration_ms', 0) / 1000)}s" + (f", ${ev['total_cost_usd']:.2f}" if ev.get("total_cost_usd") else "") + ("" if not ev.get("is_error") else " (error)")
    return None


def start_job(title, cmd, claude=False):
    jid = uuid.uuid4().hex[:8]
    job = {"id": jid, "title": title, "cmd": " ".join(str(c) for c in cmd), "status": "running", "lines": [],
           "started": time.time(), "ended": None, "code": None}
    JOBS[jid] = job

    def run():
        try:
            env = {**os.environ, "PYTHONUNBUFFERED": "1"}
            p = subprocess.Popen([str(c) for c in cmd], cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                 stdin=subprocess.DEVNULL, text=True, bufsize=1, env=env)
            job["proc"] = p
            for raw in p.stdout:
                line = claude_line(raw.rstrip("\n")) if claude else raw.rstrip("\n")
                if line:
                    job["lines"].extend(line.splitlines())
            job["code"] = p.wait()
            job["status"] = "done" if job["code"] == 0 else ("stopped" if job.get("stopping") else "failed")
        except FileNotFoundError as e:
            job["lines"].append(f"Couldn't start: {e}")
            job["status"] = "failed"
        job["ended"] = time.time()

    threading.Thread(target=run, daemon=True).start()
    return {k: v for k, v in job.items() if k != "proc"}


def claude_job(title, prompt):
    exe = shutil.which("claude")
    if not exe:
        raise FileNotFoundError("The `claude` CLI isn't on PATH, so writing jobs can't run.")
    return start_job(title, [exe, "-p", prompt, "--output-format", "stream-json", "--verbose",
                             "--permission-mode", "acceptEdits", "--allowedTools", *CLAUDE_TOOLS], claude=True)


def job_view(job, since=0):
    return {**{k: v for k, v in job.items() if k not in ("proc", "lines")}, "lines": job["lines"][since:], "total": len(job["lines"])}


# ---------- topics, library, performance, docs ----------

def topics():
    out, group = [], ""
    for line in TOPIC_BANK.read_text(encoding="utf-8").splitlines():
        if line.startswith("## "):
            group = line[3:].strip()
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        if len(cells) >= 8 and re.match(r"T\d+$", cells[0]):
            out.append(dict(zip(["id", "status", "title", "situation", "avb", "format", "hook", "study"], cells[:8]), group=group))
    return out


def performance(handle):
    if not re.match(r"^[\w.]+$", handle):
        raise ValueError("bad handle")
    d = ROOT / "data" / handle
    with open(d / "videos.csv", encoding="utf-8-sig") as f:
        vids = list(csv.DictReader(f))
    tags = {}
    if (d / "post-tags.csv").exists():
        with open(d / "post-tags.csv", encoding="utf-8-sig") as f:
            tags = {r["id"]: r for r in csv.DictReader(f)}
    rows = []
    for v in vids:
        t = tags.get(v["id"], {})
        rows.append({"id": v["id"], "url": v["url"], "title": (v.get("title") or "")[:140], "date": (v.get("published_at") or "")[:10],
                     "views": int(float(v.get("view_count") or 0)), "likes": int(float(v.get("like_count") or 0)),
                     "comments": int(float(v.get("comment_count") or 0)), "seconds": v.get("duration_seconds"),
                     **{k: t.get(k, "") for k in ("tier", "format", "hook", "named_tool", "proof", "ending", "cta")}})
    rows.sort(key=lambda r: r["date"], reverse=True)
    views = [r["views"] for r in rows]
    return {"handle": handle, "rows": rows, "median": statistics.median(views) if views else 0, "best": max(views) if views else 0,
            "untagged": sum(1 for r in rows if not r["tier"])}


def accounts():
    return sorted(p.parent.name for p in (ROOT / "data").glob("*/videos.csv"))


def docs():
    files = ["AGENTS.md", "README.md", "content-log.md", "topics/topic-bank.md", "product/playbook.md"] + [rel(p) for p in sorted((ROOT / "knowledge").glob("*.md"))]
    return [{"path": f, "name": Path(f).stem} for f in files if (ROOT / f).exists()]


def doc(path):
    allowed = {d["path"] for d in docs()}
    if path not in allowed:
        raise FileNotFoundError(path)
    return {"path": path, "text": (ROOT / path).read_text(encoding="utf-8")}


def overview():
    s = list_scripts()
    by = {}
    for x in s:
        by[x["status"]] = by.get(x["status"], 0) + 1
    return {"scripts": len(s), "by_status": by, "open_topics": sum(1 for t in topics() if t["status"] == "open"),
            "requested_assets": sum(1 for a in L.load()["assets"] if a.get("status") == "requested"),
            "has_key": bool(api_key()), "voice": eleven_cfg().get("voice_name") or None,
            "running_jobs": sum(1 for j in JOBS.values() if j["status"] == "running"), "spend": spend_summary()}


# ---------- HTTP ----------

class Handler(BaseHTTPRequestHandler):
    server_version = "Studio/1"

    def log_message(self, fmt, *args):
        line = str(args[0]) if args else ""
        if " 200 " in f" {args[1] if len(args) > 1 else ''} " and ("/api/jobs" in line or "/api/eleven/account" in line):
            return  # the sidebar's routine polling
        sys.stderr.write("%s\n" % (fmt % args))

    def send_json(self, data, code=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def body(self):
        n = int(self.headers.get("Content-Length") or 0)
        return json.loads(self.rfile.read(n) or b"{}") if n else {}

    def send_file(self, path):
        if not path.exists() or not path.is_file():
            return self.send_json({"error": "not found"}, 404)
        size = path.stat().st_size
        ctype = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
        start, end = 0, size - 1
        rng = re.match(r"bytes=(\d*)-(\d*)", self.headers.get("Range") or "")
        if rng and (rng.group(1) or rng.group(2)):
            if rng.group(1):
                start = int(rng.group(1))
                end = int(rng.group(2)) if rng.group(2) else end
            else:
                start = max(size - int(rng.group(2)), 0)
            self.send_response(206)
            self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        else:
            self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Content-Length", str(end - start + 1))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        with open(path, "rb") as f:
            f.seek(start)
            left = end - start + 1
            while left > 0:
                chunk = f.read(min(65536, left))
                if not chunk:
                    break
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    return
                left -= len(chunk)

    def route(self, method):
        url = urllib.parse.urlparse(self.path)
        path, q = url.path, urllib.parse.parse_qs(url.query)
        parts = [urllib.parse.unquote(p) for p in path.strip("/").split("/") if p]
        if method == "GET" and (not parts or parts[0] in ("index.html",)):
            v = str(int(max(p.stat().st_mtime for p in STATIC.iterdir())))
            page = (STATIC / "index.html").read_text(encoding="utf-8").replace("{{v}}", v).encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(page)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(page)
            return None
        if method == "GET" and parts[0] == "static":
            p = (STATIC / "/".join(parts[1:])).resolve()
            return self.send_file(p) if STATIC.resolve() in p.parents else self.send_json({"error": "no"}, 403)
        if method == "GET" and parts[0] == "media":
            p = (ROOT / "/".join(parts[1:])).resolve()
            ok = any(base.resolve() in p.parents for base in (PUBLIC, OUT))
            return self.send_file(p) if ok else self.send_json({"error": "no"}, 403)
        if parts[0] != "api":
            return self.send_json({"error": "not found"}, 404)
        a = parts[1:]
        b = self.body() if method in ("POST", "PUT") else {}
        cfg = eleven_cfg()

        if a == ["overview"]:
            return overview()
        if a == ["config"]:
            return {"elevenlabs": {k: v for k, v in cfg.items()}, "statuses": STATUSES, "has_key": bool(api_key()),
                    "spelling": config().get("spelling"), "wpm": config().get("words_per_minute")}
        if a == ["scripts"]:
            return list_scripts()
        if len(a) >= 2 and a[0] == "scripts":
            slug = a[1]
            if len(a) == 2:
                return script_detail(slug)
            if a[2] == "tags" and method == "PUT":
                return save_tagged(slug, b.get("text", ""))
            if a[2] == "status" and method == "POST":
                set_log_status(slug, b.get("status"))
                return {"ok": True}
            if a[2] == "takes":
                if len(a) == 3 and method == "GET":
                    return list_takes(slug)
                if len(a) == 3 and method == "POST":
                    return generate_take(slug, b)
                if len(a) == 5 and a[4] == "use":
                    return use_take(slug, a[3])
                if len(a) == 4 and method == "DELETE":
                    return delete_take(slug, a[3])
                if len(a) == 4 and method == "POST":
                    return update_take(slug, a[3], b)
            if a[2] == "run" and method == "POST":
                script = script_path(slug)
                act = b.get("action")
                if act in ("prep", "stills", "render"):
                    cmd = [sys.executable, ROOT / "tools" / "make_video.py", script, act]
                    if act == "prep" and b.get("placeholder"):
                        cmd += ["--revoice"]
                    return start_job(f"{act.capitalize()} · {slug}", cmd)
                if act == "check":
                    return start_job(f"Check · {slug}", [sys.executable, ROOT / "tools" / "check_script.py", script])
                if act == "library":
                    return start_job(f"Library add · {slug}", [sys.executable, ROOT / "tools" / "library.py", "add", script])
                if act == "video":
                    return claude_job(f"Make video · {slug}", f"/video {rel(script)}")
                if act == "revise":
                    note = (b.get("note") or "").strip()
                    if not note:
                        raise ValueError("Say what to change.")
                    return claude_job(f"Revise · {slug}", f"Revise {rel(script)} following AGENTS.md: {note}. Keep the ELEVENLABS block in sync, then run python3 tools/check_script.py on it until it passes.")
                raise ValueError("unknown action")
        if a == ["lab", "takes"]:
            return list_takes(LAB) if method == "GET" else generate_take(LAB, b)
        if len(a) == 3 and a[:2] == ["lab", "takes"] and method == "DELETE":
            return delete_take(LAB, a[2])
        if a == ["topics"]:
            return topics()
        if a == ["write"] and method == "POST":
            kind, arg = b.get("kind"), (b.get("arg") or "").strip()
            if kind == "script" and arg:
                return claude_job(f"Write script · {arg[:40]}", f"/script {arg}")
            if kind == "make" and arg:
                return claude_job(f"Make · {arg[:40]}", f"/make {arg}")
            if kind == "batch":
                return claude_job(f"Batch of {arg or 5}", f"/batch {arg or 5}")
            if kind == "ideas":
                return claude_job(f"Ideas {arg}".strip(), f"/ideas {arg}".strip())
            raise ValueError("Say what to write.")
        if a == ["library"]:
            return L.load()
        if len(a) == 3 and a[0] == "library" and a[2] == "status" and method == "POST":
            lib = L.load()
            status = b.get("status")
            if status not in L.STATUSES:
                raise ValueError(f"status must be one of {L.STATUSES}")
            for asset in lib["assets"]:
                if asset["id"] == a[1]:
                    asset["status"] = status
                    L.save(lib)
                    return {"ok": True}
            raise FileNotFoundError(a[1])
        if a == ["accounts"]:
            return {"accounts": accounts(), "ours": config().get("our_account")}
        if len(a) == 2 and a[0] == "performance" and method == "GET":
            return performance(a[1])
        if a == ["performance", "import"] and method == "POST":
            folder = (b.get("path") or "").strip()
            if not folder or not Path(os.path.expanduser(folder)).exists():
                raise ValueError("That export folder doesn't exist.")
            return claude_job("Refresh performance", f"/refresh {os.path.expanduser(folder)}")
        if len(a) == 3 and a[0] == "performance" and a[2] == "report" and method == "POST":
            return start_job(f"Report · {a[1]}", [sys.executable, ROOT / "tools" / "performance.py", "--account", a[1], "report"])
        if a == ["docs"]:
            return docs()
        if a == ["doc"]:
            return doc(q.get("path", [""])[0])
        if a == ["jobs"]:
            return [job_view(j, len(j["lines"])) for j in sorted(JOBS.values(), key=lambda j: -j["started"])]
        if len(a) == 2 and a[0] == "jobs":
            return job_view(JOBS[a[1]], int(q.get("since", ["0"])[0]))
        if len(a) == 3 and a[0] == "jobs" and a[2] == "stop" and method == "POST":
            j = JOBS[a[1]]
            if j.get("proc") and j["status"] == "running":
                j["stopping"] = True
                j["proc"].terminate()
            return {"ok": True}
        if a == ["eleven", "account"]:
            return account()
        if a == ["eleven", "voices"]:
            return voices()
        if a == ["eleven", "key"] and method == "POST":
            save_key(b.get("key", ""))
            _cache.clear()
            return {"ok": True, "has_key": bool(api_key())}
        if a == ["eleven", "settings"] and method == "POST":
            full = config()
            e = full.setdefault("elevenlabs", {})
            for k in ("voice_id", "voice_name", "model", "draft_model"):
                if k in b:
                    e[k] = b[k]
            if "voice_settings" in b:
                e["voice_settings"] = {k: b["voice_settings"][k] for k in ("stability", "similarity_boost", "use_speaker_boost") if k in b["voice_settings"]}
            save_config(full)
            return {"ok": True}
        return self.send_json({"error": f"No route {method} {path}"}, 404)

    def handle_method(self, method):
        try:
            result = self.route(method)
            if result is not None:
                self.send_json(result)
        except (ValueError, KeyError) as e:
            self.send_json({"error": str(e).strip("'")}, 400)
        except PermissionError as e:
            self.send_json({"error": str(e), "need_key": True}, 401)
        except FileNotFoundError as e:
            self.send_json({"error": f"Not found: {e}"}, 404)
        except SystemExit as e:  # tools call sys.exit with a message
            self.send_json({"error": str(e)}, 400)
        except (RuntimeError, urllib.error.URLError) as e:
            self.send_json({"error": str(e)}, 502)

    def do_GET(self):
        self.handle_method("GET")

    def do_POST(self):
        self.handle_method("POST")

    def do_PUT(self):
        self.handle_method("PUT")

    def do_DELETE(self):
        self.handle_method("DELETE")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8787)))
    a = ap.parse_args()
    srv = ThreadingHTTPServer(("127.0.0.1", a.port), Handler)
    print(f"Brain Studio on http://localhost:{a.port}  (Ctrl+C to stop)")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
