---
description: Write a batch of scripts from the topic bank
argument-hint: <how many, default 5>
---
Write a batch of ${ARGUMENTS:-5} scripts.

1. Pick that many `open` topics from topics/topic-bank.md: Tier 1 first, no two in a row with the same format, nothing that repeats content-log.md.
2. For each, follow AGENTS.md Step 0 to Step 12 (load the brain once for the whole batch).
3. Run `python3 tools/check_script.py scripts/<each file>` and fix until all pass.
4. Mark each topic `drafted`, add each to content-log.md, and finish with a table: title, format, hook code, words, check result.
