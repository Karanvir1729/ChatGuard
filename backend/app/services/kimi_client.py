from __future__ import annotations

from backend.app.config import settings


class KimiClient:
    def __init__(self, endpoint: str | None = None) -> None:
        self.endpoint = endpoint or settings.llm_endpoint

    def analyze(self, prompt: str, context: dict | None = None) -> dict[str, object]:
        return {
            "provider": "kimi",
            "endpoint": self.endpoint,
            "prompt": prompt,
            "context": context or {},
            "content": "Placeholder Kimi response. Swap this adapter with a live client later.",
        }


kimi_client = KimiClient()
