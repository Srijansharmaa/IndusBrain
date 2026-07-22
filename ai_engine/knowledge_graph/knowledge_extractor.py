import json

from ai_engine.llm.gemini_llm import GeminiLLM


class KnowledgeExtractor:
    """
    Extracts entities and relationships
    from industrial documents using Gemini.

    This version uses a much stricter prompt
    to improve graph quality.
    """

    def __init__(self):

        self.llm = GeminiLLM()

    def extract(self, text: str):

        prompt = f"""
You are an expert Industrial Knowledge Graph Extraction System.

Your job is to extract entities and relationships from industrial manuals,
maintenance documents, SOPs, reports, engineering drawings and technical documents.

=====================================================
IMPORTANT RULES
=====================================================

1. Return ONLY valid JSON.

2. Never explain anything.

3. Never use Markdown.

4. Never wrap JSON inside ```.

5. Never invent entities.

6. Never invent relationships.

7. Preserve original entity names exactly as written.

8. Remove duplicate entities.

9. Ignore page numbers, headers, footers, tables of contents,
document titles and irrelevant text.

=====================================================
ENTITY TYPES
=====================================================

Use ONLY one of these types:

Equipment
Component
System
Sensor
Instrument
Valve
Pump
Motor
Pipeline
Material
Chemical
Location
Department
Person
Organization
Document
Process
Software
Parameter
Unknown

=====================================================
RELATIONSHIP LABELS
=====================================================

Use ONLY these labels.

connected_to
located_in
part_of
uses
contains
controls
monitors
depends_on
belongs_to
maintains
feeds
receives_from
installed_in
powered_by
measures

Do NOT create your own relationship names.

=====================================================
OUTPUT FORMAT
=====================================================

{{
    "entities":[
        {{
            "name":"Pump P101",
            "type":"Pump"
        }}
    ],

    "relationships":[
        {{
            "source":"Pump P101",
            "relationship":"connected_to",
            "target":"Valve V22"
        }}
    ]
}}

=====================================================
DOCUMENT
=====================================================

{text}

=====================================================
RETURN ONLY JSON
=====================================================
"""

        response = self.llm.generate(prompt)

        # Print complete raw LLM response (unmodified)
        print("[KG DEBUG] KnowledgeExtractor.extract() -> raw LLM response START")
        try:
            print(response)
        except Exception as e:
            # In case printing the raw response causes issues, still show that there's a value
            print(f"[KG DEBUG] Unable to directly print raw response: {e}")
        print("[KG DEBUG] KnowledgeExtractor.extract() -> raw LLM response END")

        try:

            # Clean common markdown fences but keep original raw response printed above
            response = response.replace(

                "```json",

                ""

            )

            response = response.replace(

                "```",

                ""

            ).strip()

            data = json.loads(response)

            # -------------------------
            # Safety Checks
            # -------------------------

            if "entities" not in data:

                data["entities"] = []

            if "relationships" not in data:

                data["relationships"] = []

            # Debugging: print counts
            ent_count = len(data.get("entities", []))
            rel_count = len(data.get("relationships", []))
            print(f"[KG DEBUG] KnowledgeExtractor.extract() -> entities={ent_count}, relationships={rel_count}")

            return data

        except Exception as e:

            print()

            print("Knowledge Extraction Error")

            print(e)

            print()

            # Print the entire raw response again (unmodified) for debugging
            print("[KG DEBUG] KnowledgeExtractor.extract() -> JSON parse failed. Full raw LLM response:")
            try:
                print(response)
            except Exception as pe:
                print(f"[KG DEBUG] Unable to print raw response in exception handler: {pe}")

            # Debugging: show zero results
            print(f"[KG DEBUG] KnowledgeExtractor.extract() -> entities=0, relationships=0 (due to error)")

            return {

                "entities": [],

                "relationships": []

            }