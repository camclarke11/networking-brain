"""Tests for tools/check_script.py. Run: python3 -m unittest discover -s tests"""
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import check_script as C  # noqa: E402

SAMPLE = ROOT / "scripts" / "2026-10-20-the-second-question.md"


class CheckScriptTests(unittest.TestCase):
    def check_text(self, text):
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(text)
        self.addCleanup(Path(f.name).unlink)
        return C.check(f.name)

    def test_sample_script_passes(self):
        fails, _, stats = C.check(SAMPLE)
        self.assertEqual(fails, [])
        self.assertEqual(stats["lines"], 23)

    def test_banned_words_and_mismatched_storyboard_fail(self):
        text = SAMPLE.read_text(encoding="utf-8").replace(
            "Interview over.", "Interview over and then you delve into small talk.", 1)
        fails, _, _ = self.check_text(text)
        joined = " ".join(fails)
        self.assertIn("delve", joined)
        self.assertIn("and then", joined)
        self.assertIn("doesn't match script line 6", joined)

    def test_unknown_cast_and_missing_study_card_fail(self):
        text = SAMPLE.read_text(encoding="utf-8").replace('"study_card"', '"big_text"').replace(
            '"id": "friend"', '"id": "dragon"')
        fails, _, _ = self.check_text(text)
        joined = " ".join(fails)
        self.assertIn("unknown id 'dragon'", joined)
        self.assertIn("no shot has a study_card", joined)


if __name__ == "__main__":
    unittest.main()
