import os
from google import genai
from app.schemas import PromptInput, PromptOutput

API = os.getenv("GOOGLE_API_kEY")

class AIHandler:
    def __init__(self):
        self.client = genai.Client(api_key=API)

    async def handle_request(self, prompt_input: PromptInput, user_id: str) -> PromptOutput:
        """
        Handles the request to the AI model and returns the response.
        
        Args:
            prompt (str): The question or prompt to send to the AI model.
        
        Returns:
            PromptOutput: A dictionary containing the AI's response.
        """
        if not user_id:
            return PromptOutput(text="Sign in to ask the AI model a question.")
        
        response = self.client.models.generate_content(
            model=prompt_input.model,
            contents=prompt_input.prompt
        )
        
        if not response or not response.text:
            return PromptOutput(text="No response from AI model.")
        
        return PromptOutput(text=response.text)