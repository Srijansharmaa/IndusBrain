from ai_engine.extractors.base_extractor import BaseExtractor
from ai_engine.extractors.prompts import ANALYTICS_PROMPT


class AnalyticsExtractor(BaseExtractor):

    def extract(self, text: str):

        prompt = f"""
{ANALYTICS_PROMPT}

Document:

{text}
"""

        result = self.generate_json(prompt)

        if isinstance(result, dict):
            return result

        return {
            "departments": [],
            "risks": [],
            "decisions": [],
            "business_domains": []
        }