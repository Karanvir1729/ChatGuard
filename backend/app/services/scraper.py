from __future__ import annotations

from dataclasses import dataclass

import httpx
from bs4 import BeautifulSoup

from backend.app.utils.text import clean_text


@dataclass(slots=True)
class ScrapeResult:
    url: str
    title: str
    text: str


def fetch_html(url: str, timeout: float = 10.0) -> str:
    response = httpx.get(url, timeout=timeout, follow_redirects=True)
    response.raise_for_status()
    return response.text


def extract_page_text(html: str) -> tuple[str, str]:
    soup = BeautifulSoup(html, "html.parser")

    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    title = clean_text(soup.title.get_text(" ", strip=True) if soup.title else "")
    text = clean_text(soup.get_text("\n", strip=True))
    return title, text


def scrape_policy_page(url: str) -> ScrapeResult:
    html = fetch_html(url)
    title, text = extract_page_text(html)
    return ScrapeResult(url=url, title=title, text=text)
