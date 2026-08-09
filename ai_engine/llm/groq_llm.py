import os

from dotenv import load_dotenv
from groq import Groq, APIError, RateLimitError

from ai_engine.llm.llm_interface import LLMInterface

load_dotenv()

import os

print("GROQ_API_KEY Loaded:", bool(os.getenv("GROQ_API_KEY")))
print("GROQ_MODEL:", os.getenv("GROQ_MODEL"))


class GroqLLM:
    """
    Groq implementation using the Groq Python SDK.
    """

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:
            raise ValueError(
                "GROQ_API_KEY not found in .env file."
            )

        self.client = Groq(api_key=api_key)

        self.model = os.getenv(
            "GROQ_MODEL",
            "llama-3.1-8b-instant"
        )

    def generate(self, prompt: str) -> str:

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                 temperature=0,
                max_completion_tokens=600,
            )

        except RateLimitError as e:
            print(f"Groq rate limit / quota error: {e}")
            raise

        except APIError as e:
            print(f"Groq API error: {e}")
            raise

        return response.choices[0].message.content