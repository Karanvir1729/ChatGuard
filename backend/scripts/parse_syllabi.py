from __future__ import annotations

import argparse
import json
from pathlib import Path

from backend.app.services.parser import extract_policy_sections
from backend.app.utils.files import ensure_directory, get_file_name, read_text_file, write_text_file


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Parse scraped syllabus text into academic-integrity policy sections."
    )
    parser.add_argument(
        "--input-dir",
        default="backend/data/raw_syllabi",
        help="Directory containing scraped text files.",
    )
    parser.add_argument(
        "--output-dir",
        default="backend/data/parsed_syllabi",
        help="Directory where parsed JSON files should be written.",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()
    input_dir = Path(args.input_dir)
    output_dir = ensure_directory(args.output_dir)

    if not input_dir.exists():
        print(f"Input directory not found: {input_dir}")
        return

    for file_path in sorted(input_dir.glob("*.txt")):
        policy_text = read_text_file(file_path)
        sections = extract_policy_sections(policy_text)
        output_path = Path(output_dir) / f"{file_path.stem}.json"

        payload = {
            "source_file": get_file_name(file_path),
            "section_count": len(sections),
            "sections": sections,
        }
        write_text_file(output_path, json.dumps(payload, indent=2))
        print(f"Parsed {file_path} -> {output_path}")


if __name__ == "__main__":
    main()
