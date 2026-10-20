"""Tests for tools/library.py and tools/align.py. Run: python3 -m unittest discover -s tests"""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import align as A  # noqa: E402
import check_script as C  # noqa: E402
import library as L  # noqa: E402

SAMPLE = ROOT / "scripts" / "2026-10-20-the-second-question.md"
TEXT = SAMPLE.read_text(encoding="utf-8")


def fake_words(text, pace=0.3):
    """Word timestamps as a plain list, one word every `pace` seconds."""
    return [{"word": w, "start": i * pace, "end": i * pace + pace * 0.8} for i, w in enumerate(text.split())]


class LibraryTests(unittest.TestCase):
    def test_register_adds_new_and_records_reuse(self):
        lib = {"assets": [{"id": "event_hall", "kind": "set", "status": "core", "first_used": None, "used_in": []}]}
        added, reused = L.register(C.read_board(TEXT), "sample", lib)
        self.assertIn("glowing_door", added)
        self.assertIn("answer_door", added)
        self.assertEqual(reused, ["event_hall"])
        door = next(a for a in lib["assets"] if a["id"] == "glowing_door")
        self.assertEqual((door["status"], door["first_used"]), ("requested", "sample"))
        self.assertEqual(L.register(C.read_board(TEXT), "sample", lib), ([], []))


class AlignTests(unittest.TestCase):
    def test_exact_take_times_every_shot_and_cue(self):
        lines = C.script_lines(TEXT)
        timing = A.build(TEXT, A.read_words(fake_words(" ".join(lines))))
        self.assertEqual(timing["match"], 1.0)
        shots = timing["shots"]
        self.assertEqual(shots[0]["start"], 0.0)
        for a, b in zip(shots, shots[1:]):
            self.assertEqual(a["end"], b["start"])
        host = next(c for c in shots[2]["cues"] if c["word"] == "host")
        index = " ".join(lines).split().index("host?")
        self.assertAlmostEqual(host["time"], index * 0.3, places=3)

    def test_real_voice_drift_is_reported_not_fatal(self):
        lines = C.script_lines(TEXT)
        take = " ".join(lines).replace("2,000", "two thousand").replace("one small thing", "one thing").replace(
            "Interview over.", "Yeah. Interview over.")
        timing = A.build(TEXT, A.read_words({"segments": [{"words": fake_words(take)}]}))
        joined = " ".join(timing["warnings"])
        self.assertIn("skips 1 script word(s): small", joined)
        self.assertIn("adds 1 word(s) not in the script: yeah", joined)
        grid = next(c for c in timing["shots"][7]["cues"] if c["word"] == "2,000")
        self.assertIsNotNone(grid["time"])

    def test_reads_elevenlabs_character_alignment(self):
        chars = list("Hi there")
        data = {"alignment": {"characters": chars,
                              "character_start_times_seconds": [i * 0.1 for i in range(len(chars))],
                              "character_end_times_seconds": [i * 0.1 + 0.1 for i in range(len(chars))]}}
        words = A.read_words(data)
        self.assertEqual([w for w, _, _ in words], ["Hi", "there"])
        self.assertAlmostEqual(words[1][1], 0.3)


if __name__ == "__main__":
    unittest.main()
