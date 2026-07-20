import os

from dotenv import load_dotenv
from google import genai

from ai_engine.llm.llm_interface import LLMInterface

load_dotenv()


class GeminiLLM(LLMInterface):
    """
    Gemini implementation using the new Google GenAI SDK.
    """

    def __init__(self):

        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            raise ValueError(
                "GEMINI_API_KEY not found in .env file."
            )

        self.client = genai.Client(api_key=api_key)

        self.model = os.getenv(
            "GEMINI_MODEL",
            "gemini-2.5-flash"
        )

    def generate(self, prompt: str) -> str:

        response = self.client.models.generate_content(
            model=self.model,
            contents=prompt
        )

        return response.text