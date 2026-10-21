import asyncio
import logging
import time
from functools import cached_property

import httpx
from fastapi import HTTPException
from google import genai
from google.genai import errors, types

from app.config import (
    GEMINI_ATTEMPT_TIMEOUT_S,
    GEMINI_COOLDOWN_S,
    GEMINI_LAST_TIMEOUT_S,
    GEMINI_MODELS,
    GOOGLE_API_KEY,
    LOG_OUTGOING,
)
from app.schemas import PromptInput, PromptOutput

logger = logging.getLogger(__name__)
outgoing = logging.getLogger("outgoing.http")

# Statuses meaning "this model can't serve right now": try the next one
_RETRYABLE = {429, 500, 503, 504}


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
    """Forwards prompts to Gemini, falling back across models when one is overloaded.

    Each model gets a single attempt with a timeout (the SDK's own retries would
    keep hammering an overloaded model for several seconds). A model that fails
    with a capacity error is skipped for GEMINI_COOLDOWN_S so later requests go
    straight to one that is answering.
    """

    def __init__(self, models: list[str] = GEMINI_MODELS):
        self.models = models
        self._cooldown_until: dict[str, float] = {}

    @cached_property
    def client(self) -> genai.Client:
        async_client_args = {}
        if LOG_OUTGOING:
            async_client_args["event_hooks"] = {"request": [_on_request], "response": [_on_response]}
        return genai.Client(
            api_key=GOOGLE_API_KEY,
            http_options=types.HttpOptions(
                timeout=int(GEMINI_LAST_TIMEOUT_S * 1000),
                retry_options=types.HttpRetryOptions(attempts=1),
                async_client_args=async_client_args,
            ),
        )

    def _candidates(self) -> list[str]:
        now = time.monotonic()
        ready = [m for m in self.models if self._cooldown_until.get(m, 0) <= now]
        # If every model is cooling down, try them all anyway rather than fail outright
        return ready or list(self.models)

    async def handle_request(self, prompt_input: PromptInput) -> PromptOutput:
        """Send the prompt to the first available Gemini model and return its text."""
        candidates = self._candidates()
        for i, model in enumerate(candidates):
            # Fail over quickly from a stalled model; give the last resort more time
            timeout = GEMINI_LAST_TIMEOUT_S if i == len(candidates) - 1 else GEMINI_ATTEMPT_TIMEOUT_S
            try:
                # Enforced client-side: Gemini rejects server deadlines under 10s
                response = await asyncio.wait_for(
                    self.client.aio.models.generate_content(model=model, contents=prompt_input.prompt),
                    timeout,
                )
            except errors.APIError as e:
                if e.code in _RETRYABLE:
                    self._cooldown_until[model] = time.monotonic() + GEMINI_COOLDOWN_S
                    logger.warning("Gemini %s unavailable (%s %s); trying next model", model, e.code, e.status)
                    continue
                logger.exception("Gemini %s request failed", model)
                raise HTTPException(status_code=502, detail="AI model request failed.")
            except (TimeoutError, httpx.TransportError) as e:
                self._cooldown_until[model] = time.monotonic() + GEMINI_COOLDOWN_S
                logger.warning("Gemini %s %s; trying next model", model, type(e).__name__)
                continue

            logger.info("Answered by %s", model)
            return PromptOutput(text=response.text or "No response from AI model.")

        raise HTTPException(
            status_code=503,
            detail="The AI assistant is very busy right now. Please try again in a minute.",
        )
