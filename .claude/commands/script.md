---
description: Write one finished script and storyboard for a topic
argument-hint: <topic or topic-bank id, e.g. T06>
---
Before writing, load the `anthropic-skills:short-form-scripts` skill with the Skill tool if it's available in this session. If it isn't, read `knowledge/16-short-form-guide.md`, which is the same guide in full. Where it and our data disagree, follow that file's last section.

Write one finished script for: $ARGUMENTS

Follow AGENTS.md exactly, Step 0 to Step 12. If the argument is a topic-bank id (T01–T99), use that row of topics/topic-bank.md as the starting point and set its status to `drafted` when done. Save to scripts/, run `python3 tools/check_script.py` on the file until it passes, run `python3 tools/library.py add` on it, and add the content-log.md row.

The caption is a teaser (knowledge/05-endings-and-ctas.md): one line, usually a question about the viewer's business, that names nothing from the video, then the Playbook line and hashtags.
