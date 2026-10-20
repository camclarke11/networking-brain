"""Tests for tools/check_script.py. Run: python3 -m unittest discover -s tests"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import check_script as C  # noqa: E402

SAMPLE = ROOT / "scripts" / "2026-10-20-the-second-question.md"
# The starter kit: everything no script invented (core items stay starter kit once built).
CORE_ONLY = {"assets": [a for a in json.loads((ROOT / "visuals" / "library.json").read_text())["assets"]
                        if a["first_used"] is None]}


class CheckScriptTests(unittest.TestCase):
    def check_text(self, text, library=CORE_ONLY):
        with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False, encoding="utf-8") as f:
            f.write(text)
        self.addCleanup(Path(f.name).unlink)
        return C.check(f.name, library)

    def test_sample_script_passes(self):
        fails, _, stats = C.check(SAMPLE)
        self.assertEqual(fails, [])
        self.assertEqual(stats["lines"], 23)

    def test_sample_passes_against_a_fresh_library(self):
        fails, warns, _ = self.check_text(SAMPLE.read_text(encoding="utf-8"))
        self.assertEqual(fails, [])
        self.assertTrue(any("new assets" in w for w in warns))

    def test_new_asset_already_in_library_fails(self):
        library = {"assets": CORE_ONLY["assets"] + [{"id": "glowing_door", "status": "built", "first_used": "older-script"}]}
        fails, _, _ = self.check_text(SAMPLE.read_text(encoding="utf-8"), library)
        self.assertIn("'glowing_door' is already in the library", " ".join(fails))

    def test_banned_words_and_broken_coverage_fail(self):
        text = SAMPLE.read_text(encoding="utf-8").replace(
            "Interview over.", "Interview over and then you delve into small talk.", 1).replace(
            '"lines": [\n        7,\n        7\n      ]', '"lines": [\n        8,\n        8\n      ]', 1)
        fails, _, _ = self.check_text(text)
        joined = " ".join(fails)
        self.assertIn("delve", joined)
        self.assertIn("and then", joined)
        self.assertIn("should start at line 7", joined)

    def test_unknown_cast_library_id_and_missing_study_card_fail(self):
        text = SAMPLE.read_text(encoding="utf-8").replace('"study_card"', '"big_text"').replace(
            '"friend",\n        "crowd"', '"dragon",\n        "crowd"').replace('"phone",', '"jetpack",')
        fails, _, _ = self.check_text(text)
        joined = " ".join(fails)
        self.assertIn("unknown cast id 'dragon'", joined)
        self.assertIn("'jetpack' isn't in visuals/library.json", joined)
        self.assertIn("no shot has a study_card", joined)
        self.assertIn("share prompt's shot needs 'friend'", joined)

    def test_cue_on_unspoken_word_fails(self):
        text = SAMPLE.read_text(encoding="utf-8").replace('"word": "host"', '"word": "banana"')
        fails, _, _ = self.check_text(text)
        self.assertIn("cue word 'banana' isn't spoken", " ".join(fails))


if __name__ == "__main__":
    unittest.main()
