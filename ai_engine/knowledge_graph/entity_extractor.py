from ai_engine.llm.gemini_llm import GeminiLLM
import json


class EntityExtractor:
    """
    Extracts named entities from a chunk of text.
    """

    def __init__(self):
        self.llm = GeminiLLM()

    def extract(self, text: str):

        prompt = f"""
Extract all important entities from the following text.

Return ONLY valid JSON.

Format:

[
    {{
        "text": "...",
        "type": "PERSON | ORGANIZATION | LOCATION | DATE | EVENT | PRODUCT | TECHNOLOGY"
    }}
]

Text:

{text}
"""

        response = self.llm.generate(prompt)

        try:
            return json.loads(response)

        except Exception:
            return []