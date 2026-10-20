"""Tests for tools/performance.py. Run: python3 -m unittest discover -s tests"""
import contextlib
import csv
import io
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "tools"))
import performance as P  # noqa: E402

VIDEO_FIELDS = ["id", "url", "title", "caption", "published_at", "view_count", "like_count",
                "comment_count", "repost_count", "duration_seconds", "counts_hidden"]
HISTORY_FIELDS = ["video_id", "captured_at", "view_count"]


def write(path, fields, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


class Sandbox(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        root = Path(self.tmp.name)
        self.orig = (P.ROOT, P.HANDLE, P.WHAT_PERFORMS, P.EXPLICIT_ACCOUNT)
        self.addCleanup(self.restore)
        P.ROOT = root
        P.WHAT_PERFORMS = root / "knowledge" / "00-what-performs.md"
        (root / "config.json").write_text(json.dumps({"default_account": "ours", "too_new_days": {"ours": 7}}))
        P.use_account("ours")
        P.TRANSCRIPTS.mkdir(parents=True)
        P.WHAT_PERFORMS.parent.mkdir(parents=True)
        P.WHAT_PERFORMS.write_text("# 00\n\nHand-written rules stay here.\n", encoding="utf-8")
        write(P.DATA / "videos.csv", VIDEO_FIELDS, [
            {"id": "AAA", "url": "https://www.instagram.com/reel/AAA/", "title": "Save this for your next event.",
             "published_at": "2026-07-01T00:00:00+00:00", "view_count": "600000", "like_count": "3",
             "comment_count": "200", "repost_count": "400", "duration_seconds": "50"},
            {"id": "BBB", "url": "https://www.instagram.com/reel/BBB/", "title": "Stop agreeing with people.",
             "published_at": "2026-07-02T00:00:00+00:00", "view_count": "5000", "like_count": "100",
             "comment_count": "2", "repost_count": "1", "duration_seconds": "45"},
            {"id": "CCC", "url": "https://www.instagram.com/reel/CCC/", "title": "How to read a room",
             "published_at": "2026-09-26T00:00:00+00:00", "view_count": "1000", "like_count": "20",
             "comment_count": "1", "repost_count": "0", "duration_seconds": "40"},
        ])
        write(P.DATA / "video-history.csv", HISTORY_FIELDS, [
            {"video_id": "AAA", "captured_at": "2026-09-20T00:00:00+00:00", "view_count": "500000"},
            {"video_id": "AAA", "captured_at": "2026-09-27T00:00:00+00:00", "view_count": "600000"},
        ])
        write(P.DATA / "post-tags.csv", P.TAG_FIELDS, [
            {"id": "AAA", "category": "event_conversation", "tier": "1", "hook": "N1", "objection": "yes"},
            {"id": "BBB", "category": "general_psych", "tier": "3", "hook": "N3", "objection": "no"},
        ])
        (P.TRANSCRIPTS / "01-event.md").write_text(
            "<!-- #01 -->\n<!-- https://www.instagram.com/reel/AAA/ -->\n\n"
            "When you know nobody at an event, talk to this person first.\n"
            "You're thinking, why would he help me?\nBut he will.\n"
            "Send this to whoever's coming with you.\n", encoding="utf-8")

    def restore(self):
        P.ROOT, handle, P.WHAT_PERFORMS, P.EXPLICIT_ACCOUNT = self.orig
        P.use_account(handle)

    def run_cmd(self, fn, *args):
        buf = io.StringIO()
        with contextlib.redirect_stdout(buf):
            fn(*args)
        return buf.getvalue()


class FeatureTests(unittest.TestCase):
    def test_opening_types(self):
        self.assertEqual(P.opening_type("When you know nobody at an event, talk to this person first."), "N1 situation + order")
        self.assertEqual(P.opening_type("So, what do you do?\nIs why nobody remembers you."), "N2 the line you say")
        self.assertEqual(P.opening_type("Stop agreeing with people you want to like you."), "N3 contrarian order")
        self.assertEqual(P.opening_type("How to get a busy person to say yes to coffee."), "N4 how-to promise")
        self.assertEqual(P.opening_type("The real reason nobody introduces you happens in your first few seconds."), "N5 hidden cause")
        self.assertEqual(P.opening_type("Make anyone feel comfortable around you in three steps."), "N7 steps promise")
        self.assertEqual(P.opening_type("The loudest person in any room is the least confident."), "N6 bold claim")

    def test_title_patterns(self):
        self.assertEqual(P.title_pattern("Save this for your next event."), "Save this…")
        self.assertEqual(P.title_pattern("Never say this at an event"), "contrarian order")
        self.assertEqual(P.title_pattern("Why nobody remembers you?"), "question")

    def test_clean_transcript_drops_junk(self):
        junk = "Real line one.\nReal line two.\n" + "a lot of " * 40 + "\nisticisticisticisticisticisticisticisticisticistic\n"
        self.assertEqual(P.clean_transcript(junk), "Real line one.\nReal line two.")


class CommandTests(Sandbox):
    def test_load_derives_features(self):
        posts, _ = P.load_posts()
        top = next(p for p in posts if p["id"] == "AAA")
        self.assertIsNone(top["likes"])  # 3 likes on 600k views is a withheld count
        self.assertAlmostEqual(top["velocity_per_day"], 100000 / 7)
        self.assertTrue(top["voiced_objection"])
        self.assertTrue(top["share_cta"])
        self.assertEqual(top["opening_type"], "N1 situation + order")

    def test_report_is_idempotent_and_keeps_hand_written_text(self):
        self.run_cmd(P.cmd_report)
        first = P.WHAT_PERFORMS.read_text(encoding="utf-8")
        self.run_cmd(P.cmd_report)
        second = P.WHAT_PERFORMS.read_text(encoding="utf-8")
        self.assertEqual(first, second)
        self.assertIn("Hand-written rules stay here.", second)
        self.assertEqual(second.count(P.AUTO_START), 1)
        self.assertIn("event_conversation", second)
        self.assertIn("🆕", second)

    def test_two_accounts_keep_separate_sections(self):
        self.run_cmd(P.cmd_report)
        P.use_account("rival")
        write(P.DATA / "videos.csv", VIDEO_FIELDS, [{"id": "ZZZ", "url": "u", "title": "t", "view_count": "10",
                                                    "published_at": "2026-07-01T00:00:00+00:00"}])
        P.TRANSCRIPTS.mkdir(parents=True)
        self.run_cmd(P.cmd_report)
        text = P.WHAT_PERFORMS.read_text(encoding="utf-8")
        self.assertIn("@ours", text)
        self.assertIn("@rival", text)

    def test_tag_lists_unlabelled_posts(self):
        out = self.run_cmd(P.cmd_tag)
        self.assertIn("CCC", out)
        self.assertNotIn("AAA |", out)

    def test_post_breakdown(self):
        out = self.run_cmd(P.cmd_post, "https://www.instagram.com/reel/AAA/")
        self.assertIn("Save this for your next event.", out)
        self.assertIn("hidden or withheld", out)

    def test_import_reads_handle_and_loose_transcripts(self):
        export = Path(self.tmp.name) / "export"
        write(export / "videos.csv", VIDEO_FIELDS, [{"id": "NEW1", "url": "https://www.instagram.com/reel/NEW1/",
                                                     "title": "t", "view_count": "70",
                                                     "published_at": "2026-10-01T00:00:00+00:00"}])
        (export / "account.json").write_text(json.dumps({"account": {"handle": "@SomeRival"}}))
        (export / "Video by somerival [NEW1].txt").write_text("When you walk in, do this.\n")
        self.run_cmd(P.cmd_import, str(export))
        self.assertEqual(P.HANDLE, "somerival")
        self.assertTrue((P.ROOT / "data" / "somerival" / "videos.csv").exists())
        self.assertEqual(len(list((P.ROOT / "examples" / "somerival").glob("*.md"))), 1)

    def test_import_merges_history_without_duplicates(self):
        export = Path(self.tmp.name) / "export2"
        write(export / "videos.csv", VIDEO_FIELDS, [{"id": "AAA", "url": "u", "title": "t", "view_count": "700000"}])
        write(export / "video-history.csv", HISTORY_FIELDS, [
            {"video_id": "AAA", "captured_at": "2026-09-27T00:00:00+00:00", "view_count": "600000"},
            {"video_id": "AAA", "captured_at": "2026-10-04T00:00:00+00:00", "view_count": "700000"},
        ])
        P.EXPLICIT_ACCOUNT = True
        self.run_cmd(P.cmd_import, str(export))
        rows = P.read_csv(P.DATA / "video-history.csv")
        self.assertEqual([r["captured_at"][:10] for r in rows], ["2026-09-20", "2026-09-27", "2026-10-04"])


if __name__ == "__main__":
    unittest.main()
