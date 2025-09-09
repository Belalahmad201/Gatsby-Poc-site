#!/usr/bin/env python3
from __future__ import annotations
import argparse
import collections
import csv
import html
import io
import os
import re
import sys
from typing import Iterable, List, Tuple, Set, Dict, Optional

try:
    import requests
    from bs4 import BeautifulSoup
    HAVE_WEB_DEPS = True
except Exception:
    HAVE_WEB_DEPS = False

STOPWORDS: Set[str] = {
    "a","about","above","after","again","against","all","am","an","and","any",
    "are","aren't","as","at","be","because","been","before","being","below",
    "between","both","but","by","can","can't","cannot","could","couldn't","did",
    "didn't","do","does","doesn't","doing","don't","down","during","each","few",
    "for","from","further","had","hadn't","has","hasn't","have","haven't","having",
    "he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself",
    "his","how","how's","i","i'd","i'll","i'm","i've","if","in","into","is","isn't",
    "it","it's","its","itself","let's","me","more","most","mustn't","my","myself",
    "no","nor","not","of","off","on","once","only","or","other","ought","our","ours",
    "ourselves","out","over","own","same","shan't","she","she'd","she'll","she's",
    "should","shouldn't","so","some","such","than","that","that's","the","their",
    "theirs","them","themselves","then","there","there's","these","they","they'd",
    "they'll","they're","they've","this","those","through","to","too","under","until",
    "up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't",
    "what","what's","when","when's","where","where's","which","while","who","who's",
    "whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll",
    "you're","you've","your","yours","yourself","yourselves"
}

WORD_RE = re.compile(r"[a-zA-Z']+", re.UNICODE)
NUMBER_RE = re.compile(r"\b\d+(?:[\.,]\d+)?\b")

def load_text_from_file(path: str) -> str:
    for enc in ("utf-8", "utf-8-sig", "latin-1"):
        try:
            with open(path, "r", encoding=enc, errors="ignore") as f:
                return f.read()
        except Exception:
            continue
    raise RuntimeError(f"Could not read file: {path}")

def load_text_from_url(url: str, timeout: int = 20) -> str:
    if not HAVE_WEB_DEPS:
        raise RuntimeError("URL mode requires 'requests' and 'beautifulsoup4'. Install them: pip install requests beautifulsoup4 lxml")
    resp = requests.get(url, timeout=timeout, headers={"User-Agent": "KeywordDensity/1.0"})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "lxml") if "lxml" in sys.modules else BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    text = soup.get_text(separator=" ")
    return html.unescape(text)

def normalize_and_tokenize(text: str, keep_numbers: bool = False, min_len: int = 3) -> List[str]:
    text = text.lower()
    if not keep_numbers:
        text = NUMBER_RE.sub(" ", text)
    tokens = WORD_RE.findall(text)
    tokens = [t.strip("'") for t in tokens if t.strip("'")]
    tokens = [t for t in tokens if len(t) >= min_len]
    return tokens

def filter_stopwords(tokens: Iterable[str], stopwords: Set[str]) -> List[str]:
    sw = stopwords
    return [t for t in tokens if t not in sw]

def count_keywords(tokens: Iterable[str]) -> collections.Counter:
    return collections.Counter(tokens)

def top_keywords(counter: collections.Counter, top_n: int = 10) -> List[Tuple[str, int]]:
    return counter.most_common(top_n)

def compute_percentages(items: List[Tuple[str, int]], total_counted: int) -> List[Tuple[str, int, float]]:
    if total_counted == 0:
        return [(w, c, 0.0) for w, c in items]
    return [(w, c, (c / total_counted) * 100.0) for w, c in items]

def write_csv(rows: List[Tuple[str, int, float]], path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["keyword", "count", "percentage"])
        for word, count, pct in rows:
            writer.writerow([word, count, f"{pct:.2f}"])

def highlight_in_text(text: str, keywords: Iterable[str]) -> str:
    kws = sorted(set(k.lower() for k in keywords), key=len, reverse=True)
    if not kws:
        return text
    def repl(match):
        return f"**{match.group(0)}**"
    pattern = r"\b(" + "|".join(map(re.escape, kws)) + r")\b"
    return re.sub(pattern, repl, text, flags=re.IGNORECASE)

def analyze(text_source: str, is_url: bool, stopwords: Set[str], top_n: int = 10, keep_numbers: bool = False, min_len: int = 3) -> Dict[str, object]:
    raw_text = load_text_from_url(text_source) if is_url else load_text_from_file(text_source)
    tokens_all = normalize_and_tokenize(raw_text, keep_numbers=keep_numbers, min_len=min_len)
    tokens_no_sw = filter_stopwords(tokens_all, stopwords)
    counter = count_keywords(tokens_no_sw)
    total_words_all = len(tokens_all)
    total_words_counted = sum(counter.values())
    unique_words = len(counter)
    top_items = top_keywords(counter, top_n=top_n)
    with_pct = compute_percentages(top_items, total_words_counted)
    return {
        "raw_text": raw_text,
        "tokens_all": tokens_all,
        "tokens_no_sw": tokens_no_sw,
        "counter": counter,
        "summary": {
            "total_words_all": total_words_all,
            "total_words_counted": total_words_counted,
            "unique_words": unique_words,
            "top_n": top_n
        },
        "top_keywords": with_pct
    }

def parse_args(argv: Optional[List[str]] = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Keyword Density Analyzer (URL or Text File)", formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    src = p.add_mutually_exclusive_group(required=True)
    src.add_argument("--url", help="Webpage URL to analyze")
    src.add_argument("--file", help="Path to a local text/markdown file to analyze")
    src.add_argument("--text", help="Analyze this raw text string (quotes recommended)")
    p.add_argument("--top", type=int, default=10, help="How many top keywords to show")
    p.add_argument("--min-len", type=int, default=3, help="Minimum token length to count")
    p.add_argument("--keep-numbers", action="store_true", help="Keep numbers (e.g., 2025) as tokens")
    p.add_argument("--export-csv", help="Optional path to save results as CSV (keyword,count,percentage)")
    p.add_argument("--extra-stopwords", help="Comma-separated words to ignore additionally")
    p.add_argument("--stopwords-file", help="Path to a newline-delimited stopwords file to extend the list")
    p.add_argument("--show-highlight", action="store_true", help="Print text with top keywords highlighted (CLI)")
    return p.parse_args(argv)

def build_stopwords(base: Set[str], extra_csv: Optional[str], file_path: Optional[str]) -> Set[str]:
    sw = set(base)
    if extra_csv:
        for w in (x.strip().lower() for x in extra_csv.split(",") if x.strip()):
            sw.add(w)
    if file_path and os.path.isfile(file_path):
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                for line in f:
                    w = line.strip().lower()
                    if w:
                        sw.add(w)
        except Exception as e:
            print(f"Warning: could not read stopwords file: {e}", file=sys.stderr)
    return sw

def main(argv: Optional[List[str]] = None) -> int:
    args = parse_args(argv)
    sw = build_stopwords(STOPWORDS, args.extra_stopwords, args.stopwords_file)
    if args.text is not None:
        buf = io.StringIO(args.text)
        raw_text = buf.getvalue()
        tokens_all = normalize_and_tokenize(raw_text, keep_numbers=args.keep_numbers, min_len=args.min_len)
        tokens_no_sw = filter_stopwords(tokens_all, sw)
        counter = count_keywords(tokens_no_sw)
        total_words_all = len(tokens_all)
        total_words_counted = sum(counter.values())
        unique_words = len(counter)
        top_items = top_keywords(counter, top_n=args.top)
        with_pct = compute_percentages(top_items, total_words_counted)
        result = {
            "raw_text": raw_text,
            "tokens_all": tokens_all,
            "tokens_no_sw": tokens_no_sw,
            "counter": counter,
            "summary": {
                "total_words_all": total_words_all,
                "total_words_counted": total_words_counted,
                "unique_words": unique_words,
                "top_n": args.top
            },
            "top_keywords": with_pct
        }
    else:
        source = args.url if args.url else args.file
        is_url = args.url is not None
        if not is_url and (not source or not os.path.exists(source)):
            print("Error: file path not found.", file=sys.stderr)
            return 2
        result = analyze(source, is_url=is_url, stopwords=sw, top_n=args.top, keep_numbers=args.keep_numbers, min_len=args.min_len)
    s = result["summary"]
    print("\n=== Keyword Density Summary ===")
    print(f"Total words (cleaned, before stopwords): {s['total_words_all']}")
    print(f"Total words (after stopwords removed):  {s['total_words_counted']}")
    print(f"Unique words (after stopwords removed): {s['unique_words']}")
    print(f"Top N: {s['top_n']}")
    print("\nTop keywords:")
    if not result["top_keywords"]:
        print("(No keywords found with current settings.)")
    else:
        print(f"{'Keyword':<20} {'Count':>8} {'Percent':>9}")
        print("-" * 40)
        for word, count, pct in result["top_keywords"]:
            print(f"{word:<20} {count:>8} {pct:>8.2f}%")
    if args.export_csv:
        try:
            write_csv(result["top_keywords"], args.export_csv)
            print(f"\nSaved CSV -> {args.export_csv}")
        except Exception as e:
            print(f"Warning: could not save CSV: {e}", file=sys.stderr)
    if args.show_highlight:
        top_words = [w for (w, _, _) in result["top_keywords"]]
        print("\n=== Highlighted Text Preview ===")
        preview = highlight_in_text(result["raw_text"], top_words)
        if len(preview) > 4000:
            print(preview[:4000] + "\n...[truncated]...")
        else:
            print(preview)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())

