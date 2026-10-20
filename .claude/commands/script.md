---
description: Write one finished script and storyboard for a topic
argument-hint: <topic or topic-bank id, e.g. T06>
---
Write one finished script for: $ARGUMENTS

Follow AGENTS.md exactly, Step 0 to Step 12. If the argument is a topic-bank id (T01–T99), use that row of topics/topic-bank.md as the starting point and set its status to `drafted` when done. Save to scripts/, run `python3 tools/check_script.py` on the file until it passes, run `python3 tools/library.py add` on it, and add the content-log.md row.
