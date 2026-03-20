# AI GENERATED FILE

from __future__ import annotations

import httpx

from backend.app.config import settings


class KimiClient:
    def __init__(
        self,
        endpoint: str | None = None,
        model: str | None = None,
        timeout: float = 15.0,
    ) -> None:
        self.endpoint = (endpoint or settings.llm_endpoint).rstrip("/")
        self.model = model or settings.llm_model
        self.timeout = timeout

    def analyze(self, prompt: str, context: dict | None = None) -> dict[str, object]:
        response = httpx.post(
            f"{self.endpoint}/api/chat",
            json={
                "model": self.model,
                "format": "json",
                "stream": False,
                "options": {
                    "temperature": 0.1,
                },
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are a careful academic integrity reviewer. "
                            "Return strict JSON only."
                        ),
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    },
                ],
            },
            timeout=self.timeout,
        )
        response.raise_for_status()
        data = response.json()

        return {
            "provider": "ollama",
            "model": self.model,
            "endpoint": self.endpoint,
            "context": context or {},
            "content": data.get("message", {}).get("content", "").strip(),
            "raw": data,
        }


kimi_client = KimiClient()
