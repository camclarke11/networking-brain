#!/bin/bash
# One-time setup on a Mac (or Linux): the video tools and the placeholder voice.
#   ./setup.sh
set -e
cd "$(dirname "$0")"
need() { command -v "$1" >/dev/null || { echo "Missing $1. $2"; exit 1; }; }
need node "Install Node 18+ (brew install node)."
need ffmpeg "Install ffmpeg (brew install ffmpeg)."
need python3 "Install Python 3 (brew install python)."
echo "== Video project (Remotion)"
(cd video && npm install --no-fund --no-audit)
echo "== Placeholder voice (edge-tts) in .venv"
if command -v uv >/dev/null; then
  uv venv -q .venv && uv pip install -q --python .venv/bin/python edge-tts
else
  python3 -m venv .venv && .venv/bin/pip install -q edge-tts
fi
echo "== Checks"
python3 -m unittest discover -s tests 2>&1 | tail -1
(cd video && npx tsc --noEmit) && echo "TypeScript OK"
echo
echo "Ready. In Claude Code, from this folder:"
echo "  /make <topic>            research, script, then the video"
echo "  /script <topic>          just the script"
echo "  /video scripts/<file>.md just the video"
echo
echo "Or the web app:  python3 app/server.py  → http://localhost:8787"
