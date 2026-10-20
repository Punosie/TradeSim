from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.schemas import PromptInput, PromptOutput
from ..handler.genai_handler import AIHandler

router = APIRouter()
handler = AIHandler()


@router.post("/ask-ai", response_model=PromptOutput)
async def ask_ai(prompt_input: PromptInput, _user=Depends(get_current_user)):
    """
    Ask the AI model a question. Requires a signed-in user.
    """
    return await handler.handle_request(prompt_input)
