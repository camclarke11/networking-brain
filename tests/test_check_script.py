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
# The sample was written before the no-citation rule (knowledge/00-what-performs.md §4); this is it without the citation.
CITED = "Harvard researchers looked at"
SAMPLE_TEXT = SAMPLE.read_text(encoding="utf-8").replace(CITED, "Harvard looked at")
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
        folder = Path(tempfile.mkdtemp())
        self.addCleanup(lambda: (folder / SAMPLE.name).unlink() or folder.rmdir())
        (folder / SAMPLE.name).write_text(SAMPLE_TEXT, encoding="utf-8")  # same name, so the library knows its assets
        fails, _, stats = C.check(folder / SAMPLE.name)
        self.assertEqual(fails, [])
        self.assertEqual(stats["lines"], 23)

    def test_sample_passes_against_a_fresh_library(self):
        fails, warns, _ = self.check_text(SAMPLE_TEXT)
        self.assertEqual(fails, [])
        self.assertTrue(any("new assets" in w for w in warns))

    def test_new_asset_already_in_library_fails(self):
        library = {"assets": CORE_ONLY["assets"] + [{"id": "glowing_door", "status": "built", "first_used": "older-script"}]}
        fails, _, _ = self.check_text(SAMPLE_TEXT, library)
        self.assertIn("'glowing_door' is already in the library", " ".join(fails))

    def test_banned_words_and_broken_coverage_fail(self):
        text = SAMPLE_TEXT.replace(
            "Interview over.", "Interview over and then you delve into small talk.", 1).replace(
            '"lines": [\n        7,\n        7\n      ]', '"lines": [\n        8,\n        8\n      ]', 1)
        fails, _, _ = self.check_text(text)
        joined = " ".join(fails)
        self.assertIn("delve", joined)
        self.assertIn("and then", joined)
        self.assertIn("should start at line 7", joined)

    def test_unknown_cast_library_id_and_citation_fail(self):
        text = SAMPLE.read_text(encoding="utf-8").replace(
            '"friend",\n        "crowd"', '"dragon",\n        "crowd"').replace('"phone",', '"jetpack",')
        fails, _, _ = self.check_text(text)
        joined = " ".join(fails)
        self.assertIn("unknown cast id 'dragon'", joined)
        self.assertIn("'jetpack' isn't in visuals/library.json", joined)
        self.assertIn("Line 16 cites research ('researchers')", joined)
        self.assertIn("share prompt's shot needs 'friend'", joined)

    def test_cue_on_unspoken_word_fails(self):
        text = SAMPLE_TEXT.replace('"word": "host"', '"word": "banana"')
        fails, _, _ = self.check_text(text)
        self.assertIn("cue word 'banana' isn't spoken", " ".join(fails))

    def test_the_lead_is_checked(self):
        lines = SAMPLE_TEXT.split("## SCRIPT", 1)[1].split("## ", 1)[0].strip().splitlines()
        n = len([l for l in lines if l.strip() and l.strip() != "---"])
        early = f"## LOOP MAP\n\n```text\nL1  line 1   Why the second one?  → closed line 5\n```\n\n"
        text = SAMPLE_TEXT.replace("## SCRIPT", early + "## SCRIPT", 1)
        _, warns, _ = self.check_text(text)
        joined = " ".join(warns)
        self.assertIn(f"L1 is fully answered on line 5 of {n}", joined)
        self.assertIn("LOOP MAP lists 1 loop(s)", joined)
        _, warns, _ = self.check_text(SAMPLE_TEXT)
        self.assertTrue(any("No '## LOOP MAP' section" in w for w in warns))
        self.assertTrue(any("study_card puts a citation on screen" in w for w in warns))


if __name__ == "__main__":
    unittest.main()
