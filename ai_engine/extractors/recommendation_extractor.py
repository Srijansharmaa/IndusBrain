from ai_engine.extractors.base_extractor import BaseExtractor
from ai_engine.extractors.prompts import RECOMMENDATION_PROMPT


class RecommendationExtractor(BaseExtractor):

    def extract(self, text: str):

        prompt = f"""
{RECOMMENDATION_PROMPT}

Document:

{text}
"""

        result = self.generate_json(prompt)

        if isinstance(result, list):
            return result

        return result.get("recommendations", [])