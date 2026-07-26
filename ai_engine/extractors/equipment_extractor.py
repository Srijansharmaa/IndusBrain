from .base_extractor import BaseExtractor

class EquipmentExtractor(BaseExtractor):

    def extract(self, text: str):

        prompt = f"""
Extract every equipment mentioned.

Return JSON.

[
    {{
        "name":"",
        "type":"",
        "health":0,
        "risk":"",
        "location":""
    }}
]

Document:

{text}
"""

        return self.generate_json(prompt)