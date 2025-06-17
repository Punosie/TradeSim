from fastapi import APIRouter, Depends
from ..handler.genai_handler import AIHandler
from app.schemas import PromptInput
from app.dependencies.auth import get_current_user

router = APIRouter()

@router.post("/ask-ai")
async def ask_ai(prompt_input : PromptInput, _user=Depends(get_current_user)):
    """
    Endpoint to ask the AI model a question.
    
    Args:
        prompt (str): The question or prompt to send to the AI model.
    
    Returns:
        dict: A dictionary containing the AI's response.
    """
    
    response = await AIHandler().handle_request(prompt_input, _user["uid"])
    
    return response