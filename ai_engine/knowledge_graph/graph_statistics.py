from collections import Counter


class GraphStatistics:
    """
    Generates useful statistics about
    the Knowledge Graph.
    """

    @staticmethod
    def generate(graph):

        entity_types = Counter()

        relationship_types = Counter()

        for node in graph["nodes"]:

            entity_types[node.get("type", "Unknown")] += 1

        for edge in graph["edges"]:

            relationship_types[edge["label"]] += 1

        return {

            "total_nodes": len(graph["nodes"]),

            "total_edges": len(graph["edges"]),

            "entity_types": dict(entity_types),

            "relationship_types": dict(relationship_types)

        }