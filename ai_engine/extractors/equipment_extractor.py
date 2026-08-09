from ai_engine.extractors.base_extractor import BaseExtractor
from ai_engine.extractors.prompts import EQUIPMENT_PROMPT


class EquipmentExtractor(BaseExtractor):

    def extract(self, text: str):

        prompt = f"""
{EQUIPMENT_PROMPT}

Document:

{text}
"""

        result = self.generate_json(prompt)

        if isinstance(result, list):
            return result

        return result.get("equipment", [])