"""Tests for the web app's helpers (app/server.py). ElevenLabs is mocked: no credits spent.
Run: python3 -m unittest discover -s tests"""
import json
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "app"))
import server as S  # noqa: E402

SLUG = "2026-10-20-the-person-standing-alone"


class StudioTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp(prefix=".studio-test-", dir=ROOT))  # inside the repo, like the real paths
        self.saved = {k: getattr(S, k) for k in ("SCRIPTS", "PUBLIC", "CONTENT_LOG", "VIDEOS_SRC", "OUT")}
        S.SCRIPTS = self.tmp / "scripts"
        S.PUBLIC = self.tmp / "public"
        S.OUT = self.tmp / "out"
        S.VIDEOS_SRC = self.tmp / "videos"
        S.CONTENT_LOG = self.tmp / "content-log.md"
        S.SCRIPTS.mkdir()
        # Written before the no-citation rule (knowledge/00-what-performs.md §4); test it without the citation.
        text = (ROOT / "scripts" / f"{SLUG}.md").read_text(encoding="utf-8").replace(
            "In 2014, researchers had Chicago commuters", "In 2014, someone had Chicago commuters")
        (S.SCRIPTS / f"{SLUG}.md").write_text(text, encoding="utf-8")
        shutil.copy(ROOT / "content-log.md", S.CONTENT_LOG)
        self.calls = 0

        def fake_tts(text, voice, mp3, model=None, settings=None, seed=None):
            self.calls += 1
            Path(mp3).write_bytes(b"ID3fake")
            chars = list(text)
            return {"alignment": {"characters": chars, "character_start_times_seconds": [i * 0.05 for i in range(len(chars))],
                                  "character_end_times_seconds": [i * 0.05 + 0.05 for i in range(len(chars))]}}
        self.real_tts, S.V.elevenlabs = S.V.elevenlabs, fake_tts
        self.real_key, S.api_key = S.api_key, lambda: "test"

    def tearDown(self):
        for k, v in self.saved.items():
            setattr(S, k, v)
        S.V.elevenlabs, S.api_key = self.real_tts, self.real_key
        shutil.rmtree(self.tmp)

    def test_saving_tags_rewrites_only_the_block_and_still_passes(self):
        d = S.script_detail(SLUG)
        moved = d["tagged"].replace("[sighs] ", "").replace("Every circle's closed.", "[sighs] Every circle's closed.")
        r = S.save_tagged(SLUG, moved)
        self.assertEqual(r["fails"], [])
        self.assertEqual(S.script_detail(SLUG)["tagged"], moved)
        self.assertIn("## STORYBOARD", (S.SCRIPTS / f"{SLUG}.md").read_text())

    def test_changed_words_fail_the_check(self):
        r = S.save_tagged(SLUG, S.script_detail(SLUG)["tagged"].replace("Sam", "Tom"))
        self.assertTrue(any("ELEVENLABS words differ" in f for f in r["fails"]))

    def test_identical_take_is_not_paid_for_twice(self):
        body = {"voice_id": "v1", "model": "eleven_v4_turbo"}
        first = S.generate_take(SLUG, body)
        again = S.generate_take(SLUG, body)
        self.assertFalse(first["cached"])
        self.assertTrue(again["cached"])
        self.assertEqual(self.calls, 1)
        S.generate_take(SLUG, {**body, "force": True})
        self.assertEqual(self.calls, 2)
        self.assertEqual(len(S.list_takes(SLUG)), 2)

    def test_turbo_costs_half(self):
        text = "x" * 1000
        self.assertEqual(S.cost(text, "eleven_v4")["credits"], 1000)
        self.assertEqual(S.cost(text, "eleven_v4_turbo")["credits"], 500)

    def test_using_a_take_sets_narration_and_times_the_board(self):
        take = S.generate_take(SLUG, {"voice_id": "v1"})["take"]
        r = S.use_take(SLUG, take["id"])
        self.assertTrue((S.PUBLIC / SLUG / "voice.mp3").exists())
        words = json.loads((S.SCRIPTS / f"{SLUG}.words.json").read_text())
        self.assertIn("alignment", words)
        self.assertTrue((S.SCRIPTS / f"{SLUG}.timing.json").exists(), r["output"])
        self.assertTrue(S.list_takes(SLUG)[0]["used"])

    def test_partial_take_cannot_become_the_narration(self):
        take = S.generate_take(SLUG, {"voice_id": "v1", "text": "[thoughtful] But look again."})["take"]
        self.assertTrue(take["partial"])
        with self.assertRaises(ValueError):
            S.use_take(SLUG, take["id"])

    def test_status_change_updates_the_content_log(self):
        S.set_log_status(SLUG, "approved")
        self.assertEqual(S.content_log()[SLUG]["status"], "approved")
        with self.assertRaises(ValueError):
            S.set_log_status(SLUG, "famous")

    def test_claude_stream_lines_are_readable(self):
        tool = json.dumps({"type": "assistant", "message": {"content": [{"type": "tool_use", "name": "Bash", "input": {"command": "python3 tools/check_script.py x"}}]}})
        self.assertEqual(S.claude_line(tool), "→ Bash  python3 tools/check_script.py x")
        self.assertIsNone(S.claude_line(json.dumps({"type": "system"})))
        self.assertTrue(S.claude_line(json.dumps({"type": "result", "duration_ms": 4200})).startswith("✓ Done in 4s"))

    def test_topics_and_docs_parse(self):
        self.assertTrue(any(t["id"] == "T02" for t in S.topics()))
        self.assertIn("knowledge/14-voice-tags.md", [d["path"] for d in S.docs()])
        with self.assertRaises(FileNotFoundError):
            S.doc("../../etc/passwd")


if __name__ == "__main__":
    unittest.main()
