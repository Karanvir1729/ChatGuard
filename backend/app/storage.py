from __future__ import annotations

import json
from pathlib import Path

from backend.app.config import settings
from backend.app.schemas import CheckResult, HistoryItem


class LocalStorage:
    def __init__(self, base_dir: Path | None = None) -> None:
        self.base_dir = base_dir or (settings.upload_dir / "storage")
        self.base_dir.mkdir(parents=True, exist_ok=True)
        self._checks_file = self.base_dir / "checks.json"
        self._drafts_file = self.base_dir / "drafts.json"

    def save_check(self, check: CheckResult) -> CheckResult:
        checks = self._read_models(self._checks_file, CheckResult)
        checks = [item for item in checks if item.id != check.id]
        checks.insert(0, check)
        self._write_models(self._checks_file, checks)
        return check

    def get_check(self, check_id: str) -> CheckResult | None:
        checks = self._read_models(self._checks_file, CheckResult)
        return next((item for item in checks if item.id == check_id), None)

    def list_checks(self) -> list[CheckResult]:
        return self._read_models(self._checks_file, CheckResult)

    def save_draft(self, draft: HistoryItem) -> HistoryItem:
        drafts = self._read_models(self._drafts_file, HistoryItem)
        drafts = [item for item in drafts if item.id != draft.id]
        drafts.insert(0, draft)
        self._write_models(self._drafts_file, drafts)
        return draft

    def get_draft(self, draft_id: str) -> HistoryItem | None:
        drafts = self._read_models(self._drafts_file, HistoryItem)
        return next((item for item in drafts if item.id == draft_id), None)

    def list_drafts(self) -> list[HistoryItem]:
        return self._read_models(self._drafts_file, HistoryItem)

    def _read_models(self, path: Path, schema: type) -> list:
        if not path.exists():
            return []

        raw_items = json.loads(path.read_text(encoding="utf-8"))
        return [schema.model_validate(item) for item in raw_items]

    def _write_models(self, path: Path, items: list) -> None:
        path.write_text(
            json.dumps(
                [item.model_dump(mode="json") for item in items],
                indent=2,
            ),
            encoding="utf-8",
        )


storage = LocalStorage()
