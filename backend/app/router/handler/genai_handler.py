import logging
from functools import cached_property

from fastapi import HTTPException
from google import genai

from app.config import GEMINI_MODEL, GOOGLE_API_KEY
from app.schemas import PromptInput, PromptOutput

logger = logging.getLogger(__name__)


class AIHandler:
    """Forwards prompts to Gemini through a single shared async client."""

    @cached_property
    def client(self) -> genai.Client:
        return genai.Client(api_key=GOOGLE_API_KEY)

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
