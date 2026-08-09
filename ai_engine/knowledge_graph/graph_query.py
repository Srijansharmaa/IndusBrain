from rapidfuzz import fuzz

from ai_engine.knowledge_graph.graph_store import GraphStore
from ai_engine.knowledge_graph.query_processor import QueryProcessor


class GraphQuery:
    """
    Query interface for the Knowledge Graph.

    Responsibilities:
    - Find matching entities
    - Retrieve connected relationships
    - Build graph context for Hybrid RAG
    """

    MATCH_THRESHOLD = 70

    def __init__(self):
        self.store = GraphStore()
        self.graph = self.store.load()

    def reload(self):
        self.graph = self.store.load()

    def search_entities(self, question):
        keywords = QueryProcessor.extract_keywords(question)

        matched = []
        visited = set()

        for keyword in keywords:
            for node in self.graph.get("nodes", []):
                name = node.get("label", "")

                score = fuzz.partial_ratio(
                    keyword.lower(),
                    name.lower()
                )

                if score >= self.MATCH_THRESHOLD:
                    node_id = node.get("id")

                    if node_id not in visited:
                        visited.add(node_id)
                        matched.append(node)

        return matched

    def get_neighbors(self, entity_id):
        neighbors = []

        for edge in self.graph.get("edges", []):
            if (
                edge.get("source", "").lower() == entity_id.lower()
                or
                edge.get("target", "").lower() == entity_id.lower()
            ):
                neighbors.append(edge)

        return neighbors

    def build_context(self, question):

        # Always use the latest persisted graph
        self.reload()

        entities = self.search_entities(question)

        if not entities:
            return ""

        lines = []

        for entity in entities:

            entity_id = entity.get("id", "")
            entity_label = entity.get("label", "")

            lines.append(
                f"Entity: {entity_label}"
            )

            neighbors = self.get_neighbors(entity_id)

            for relation in neighbors:

                lines.append(
                    f"  {relation.get('source', '')} "
                    f"--{relation.get('label', '')}--> "
                    f"{relation.get('target', '')}"
                )

            lines.append("")

        return "\n".join(lines)