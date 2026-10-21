"""Tests for tools/voice.py and tools/make_video.py. Run: python3 -m unittest discover -s tests"""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import align as A  # noqa: E402
import make_video as M  # noqa: E402
import voice as V  # noqa: E402

SAMPLE = ROOT / "scripts" / "2026-10-20-the-second-question.md"


class VoiceTests(unittest.TestCase):
    def test_narration_is_every_script_line_with_a_pause(self):
        text = V.narration(SAMPLE)
        self.assertTrue(text.startswith("Your second question at an event matters more than your first."))
        self.assertIn("Interview over. You just showed her", text)

    def test_edge_style_words_align_to_the_script(self):
        said = [{"word": w, "start": i * 0.3, "end": i * 0.3 + 0.25} for i, w in enumerate(V.narration(SAMPLE).replace(".", "").split())]
        timing = A.build(SAMPLE.read_text(encoding="utf-8"), A.read_words(said))
        self.assertGreater(timing["match"], 0.95)


class MakeVideoTests(unittest.TestCase):
    def test_register_adds_a_video_once(self):
        with tempfile.TemporaryDirectory() as d:
            old = M.VIDEOS_DIR
            M.VIDEOS_DIR = Path(d)
            try:
                (Path(d) / "index.ts").write_text((old / "index.ts").read_text(encoding="utf-8"), encoding="utf-8")
                M.register("2026-11-01-new-one")
                M.register("2026-11-01-new-one")
                text = (Path(d) / "index.ts").read_text(encoding="utf-8")
            finally:
                M.VIDEOS_DIR = old
        self.assertEqual(text.count("from './2026-11-01-new-one/Video'"), 1)
        self.assertEqual(text.count("id: '2026-11-01-new-one'"), 1)
        self.assertIn("v_2026_11_01_new_one.Video", text)

    def test_sample_video_is_registered_with_its_timing(self):
        index = (M.VIDEOS_DIR / "index.ts").read_text(encoding="utf-8")
        self.assertIn("id: '2026-10-20-the-second-question'", index)
        timing = json.loads((M.VIDEOS_DIR / "2026-10-20-the-second-question" / "timing.json").read_text(encoding="utf-8"))
        self.assertEqual(len(timing["shots"]), 10)


if __name__ == "__main__":
    unittest.main()
