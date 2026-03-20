# AI GENERATED FILE

from __future__ import annotations

import argparse
from pathlib import Path

from backend.app.services.scraper import scrape_policy_page
from backend.app.utils.files import ensure_directory, write_text_file


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Fetch syllabus or policy pages and save their text locally."
    )
    parser.add_argument("urls", nargs="+", help="One or more page URLs to scrape.")
    parser.add_argument(
        "--output-dir",
        default="backend/data/raw_syllabi",
        help="Directory where scraped text files should be written.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    output_dir = ensure_directory(args.output_dir)

    for index, url in enumerate(args.urls, start=1):
        result = scrape_policy_page(url)
        file_name = f"syllabus_{index:02d}.txt"
        target_path = Path(output_dir) / file_name

        content = "\n\n".join(
            [
                f"URL: {result.url}",
                f"Title: {result.title or 'Untitled'}",
                result.text,
            ]
        )
        write_text_file(target_path, content)
        print(f"Saved {url} -> {target_path}")


if __name__ == "__main__":
    main()
