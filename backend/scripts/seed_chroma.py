from __future__ import annotations

import argparse
from pathlib import Path

from backend.app.services.chroma_store import chroma_store
from backend.app.services.retrieval import retrieve_policy_chunks
from backend.app.utils.files import read_text_file


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Seed the local placeholder policy store from text syllabus files."
    )
    parser.add_argument(
        "--input-dir",
        default="backend/data/raw_syllabi",
        help="Directory containing text syllabus files.",
    )
    return parser


def infer_course_code(file_path: Path) -> str:
    return file_path.stem.replace("_", " ").strip().upper() or "UNKNOWN"


def main() -> None:
    args = build_parser().parse_args()
    input_dir = Path(args.input_dir)

    if not input_dir.exists():
        print(f"Input directory not found: {input_dir}")
        return

    for file_path in sorted(input_dir.glob("*.txt")):
        course_code = infer_course_code(file_path)
        policy_text = read_text_file(file_path)
        chunks = retrieve_policy_chunks(course_code=course_code, policy_text=policy_text)
        chroma_store.upsert_policy_chunks(course_code=course_code, chunks=chunks)
        print(f"Seeded {len(chunks)} chunks for {course_code} from {file_path}")


if __name__ == "__main__":
    main()
