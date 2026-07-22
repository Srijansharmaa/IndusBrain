import json

from ai_engine.llm.gemini_llm import GeminiLLM


class RelationshipExtractor:
    """
    Extracts relationships between entities from text.
    """

    def __init__(self):
        self.llm = GeminiLLM()

    def extract(self, text: str):

        prompt = f"""
You are an industrial knowledge graph extraction expert.

Extract relationships from the following text.

Return ONLY valid JSON.

Format:

[
    {{
        "source": "...",
        "relationship": "...",
        "target": "..."
    }}
]

Do not explain anything.

Text:

{text}
"""

        response = self.llm.generate(prompt)

        try:
            return json.loads(response)

        except Exception:
            return []