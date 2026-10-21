import logging
import time
from functools import cached_property

import httpx
from fastapi import HTTPException
from google import genai
from google.genai import types

from app.config import GEMINI_MODEL, GOOGLE_API_KEY, LOG_OUTGOING
from app.schemas import PromptInput, PromptOutput

logger = logging.getLogger(__name__)
outgoing = logging.getLogger("outgoing.http")


async def _on_request(request: httpx.Request):
    request.extensions["start"] = time.perf_counter()


async def _on_response(response: httpx.Response):
    request = response.request
    elapsed = (time.perf_counter() - request.extensions.get("start", time.perf_counter())) * 1000
    # Path only: never log query strings, which can carry credentials
    outgoing.info(
        "%s %s%s -> %s %.1fms",
        request.method, request.url.host, request.url.path, response.status_code, elapsed,
    )


class AIHandler:
    """Forwards prompts to Gemini through a single shared async client."""

    @cached_property
    def client(self) -> genai.Client:
        http_options = None
        if LOG_OUTGOING:
            http_options = types.HttpOptions(
                async_client_args={"event_hooks": {"request": [_on_request], "response": [_on_response]}}
            )
        return genai.Client(api_key=GOOGLE_API_KEY, http_options=http_options)

    async def handle_request(self, prompt_input: PromptInput) -> PromptOutput:
        """Send the prompt to the configured Gemini model and return its text."""
        try:
            response = await self.client.aio.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt_input.prompt,
            )
        except Exception:
            logger.exception("Gemini request failed")
            raise HTTPException(status_code=502, detail="AI model request failed.")

        return PromptOutput(text=response.text or "No response from AI model.")
