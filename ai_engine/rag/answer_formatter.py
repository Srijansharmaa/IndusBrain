from typing import List


class AnswerFormatter:
    """
    Formats the final response returned by the
    Hybrid RAG pipeline.
    """

    @staticmethod
    def format(
        answer: str,
        sources: List[dict],
        graph_context: str,
        confidence: float,
        retrieved_chunks=None
    ):

        entities = []

        if graph_context:

            for line in graph_context.split("\n"):

                line = line.strip()

                if line.startswith("Entity:"):

                    entity = line.replace(

                        "Entity:",

                        ""

                    ).strip()

                    if entity not in entities:

                        entities.append(entity)

        return {

            "answer": answer,

            "confidence": round(

                confidence,

                2

            ),

            "graph_entities": entities,

            "graph_context": graph_context,

            "sources": sources,

            "retrieved_chunks": [

                {

                    "text": chunk.text,

                    "metadata": chunk.metadata,

                    "distance": chunk.distance

                }

                for chunk in (retrieved_chunks or [])

            ]
        }