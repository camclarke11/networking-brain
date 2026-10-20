#!/usr/bin/env python3
"""The prop library (visuals/library.json): every set, prop, effect, costume and metaphor
the videos have used, so the agent reuses before it invents. Standard library only.

  python3 tools/library.py list [--kind prop] [--status requested]
  python3 tools/library.py add scripts/<file>.md     # register a finished script's assets
  python3 tools/library.py status <id> built         # core | requested | built | retired

`add` refuses a script that fails tools/check_script.py. New assets go in as `requested`
(the 3D build queue). Reused ones get the script added to their `used_in`.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "visuals" / "library.json"
STATUSES = ["core", "requested", "built", "retired"]


def load(path=LIBRARY):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def save(lib, path=LIBRARY):
    Path(path).write_text(json.dumps(lib, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def index(lib):
    return {a["id"]: a for a in lib["assets"]}


def register(board, stem, lib):
    """Add a storyboard's new assets and record its reuses. Returns (added, reused) id lists."""
    assets = index(lib)
    added, reused = [], []
    for spec in board.get("new_assets", []):
        if spec["id"] in assets:
            continue  # already registered from this script
        entry = {"id": spec["id"], "kind": spec["kind"], "name": spec.get("name", spec["id"].replace("_", " ").capitalize()),
                 "description": spec["description"], "reuse": spec.get("reuse", ""), "status": "requested",
                 "first_used": stem, "used_in": [stem]}
        lib["assets"].append(entry)
        assets[entry["id"]] = entry
        added.append(entry["id"])
    used = {u for shot in board.get("shots", []) for u in shot.get("uses", [])}
    if board.get("concept", {}).get("library_metaphor"):
        used.add(board["concept"]["library_metaphor"])
    for uid in sorted(used):
        entry = assets.get(uid)
        if entry is not None and stem not in entry["used_in"]:
            entry["used_in"].append(stem)
            reused.append(uid)
    return added, reused


def cmd_list(args):
    kind = args[args.index("--kind") + 1] if "--kind" in args else None
    status = args[args.index("--status") + 1] if "--status" in args else None
    rows = [a for a in load()["assets"] if (not kind or a["kind"] == kind) and (not status or a["status"] == status)]
    for kind_name in ["metaphor", "set", "prop", "costume", "effect"]:
        group = [a for a in rows if a["kind"] == kind_name]
        if not group:
            continue
        print(f"\n{kind_name.upper()}S")
        for a in group:
            print(f"  {a['id']:<24} {a['status']:<10} used {len(a['used_in'])}x  {a['description']}")
    print(f"\n{len(rows)} item(s).")


def cmd_add(args):
    sys.path.insert(0, str(ROOT / "tools"))
    import check_script
    path = Path(args[0])
    fails, _, _ = check_script.check(path)
    if fails:
        print(f"{path} fails the checker; fix it first:")
        for f in fails:
            print(f"  ✗ {f}")
        sys.exit(1)
    board = check_script.read_board(path.read_text(encoding="utf-8"))
    lib = load()
    added, reused = register(board, path.stem, lib)
    save(lib)
    print(f"Added {len(added)} new: {', '.join(added) or 'none'}")
    print(f"Reused {len(reused)}: {', '.join(reused) or 'none'}")


def cmd_status(args):
    aid, status = args
    if status not in STATUSES:
        sys.exit(f"Status must be one of: {', '.join(STATUSES)}")
    lib = load()
    entry = index(lib).get(aid)
    if entry is None:
        sys.exit(f"No asset '{aid}'.")
    entry["status"] = status
    save(lib)
    print(f"{aid} → {status}")


def main(argv):
    commands = {"list": cmd_list, "add": cmd_add, "status": cmd_status}
    if not argv or argv[0] not in commands:
        print(__doc__)
        sys.exit(1)
    commands[argv[0]](argv[1:])


if __name__ == "__main__":
    main(sys.argv[1:])
