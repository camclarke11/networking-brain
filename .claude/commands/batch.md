---
description: Write a batch of scripts from the topic bank
argument-hint: <how many, default 5>
---
Write a batch of ${ARGUMENTS:-5} scripts.

1. Pick that many `open` topics from topics/topic-bank.md: Tier 1 first, a mix of pillars and Playbook chapters (thin chapters first), no two in a row with the same format, nothing that repeats content-log.md.
2. For each, follow AGENTS.md Step 0 to Step 12 (load the brain once for the whole batch).
3. Run `python3 tools/check_script.py scripts/<each file>` and fix until all pass. Run `python3 tools/library.py add` after each one, so the next script can reuse its props. Use a different metaphor for each script.
4. Mark each topic `drafted`, add each to content-log.md and its move to product/playbook.md, and finish with a table: title, pillar, chapter, format, hook code, words, check result.
