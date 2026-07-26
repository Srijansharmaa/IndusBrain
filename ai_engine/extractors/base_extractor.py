import json

from ai_engine.llm.groq_llm import GroqLLM


class BaseExtractor:

    def __init__(self):
        self.llm = GroqLLM()

    def generate_json(self, prompt):

        response = self.llm.generate(prompt)

        text = response.strip()

        text = text.replace("```json", "")
        text = text.replace("```", "")

        return json.loads(text)