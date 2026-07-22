from rapidfuzz import fuzz

from ai_engine.knowledge_graph.graph_store import GraphStore
from ai_engine.knowledge_graph.query_processor import QueryProcessor


class GraphQuery:
    """
    Query interface for the Knowledge Graph.

    Responsibilities:
        • Find matching entities
        • Retrieve connected relationships
        • Build graph context for Hybrid RAG
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

            for node in self.graph["nodes"]:

                name = node["label"]

                score = fuzz.partial_ratio(

                    keyword.lower(),

                    name.lower()

                )

                if score >= self.MATCH_THRESHOLD:

                    if name not in visited:

                        visited.add(name)

                        matched.append(node)

        return matched

  

    def get_neighbors(self, entity_name):

        neighbors = []

        for edge in self.graph["edges"]:

            if (

                edge["source"].lower()

                ==

                entity_name.lower()

            ):

                neighbors.append(edge)

            elif (

                edge["target"].lower()

                ==

                entity_name.lower()

            ):

                neighbors.append(edge)

        return neighbors

   

    def build_context(self, question):

        entities = self.search_entities(question)

        if not entities:

            return ""

        lines = []

        for entity in entities:

            lines.append(

                f"Entity: {entity['label']}"

            )

            neighbors = self.get_neighbors(

                entity["label"]

            )

            for relation in neighbors:

                lines.append(

                    f"  {relation['source']} "

                    f"--{relation['relationship']}--> "

                    f"{relation['target']}"

                )

            lines.append("")

        return "\n".join(lines)