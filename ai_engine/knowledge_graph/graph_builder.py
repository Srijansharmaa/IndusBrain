class GraphBuilder:
    """
    Builds an in-memory knowledge graph from entities
    and relationships.
    """

    def __init__(self):
        self.nodes = {}
        self.edges = []

    def build(self, entities, relationships):

        for entity in entities:

            name = entity["name"]

            if name not in self.nodes:

                self.nodes[name] = {
                    "name": name,
                    "type": entity["type"]
                }

        for relation in relationships:

            self.edges.append({

                "source": relation["source"],

                "relationship": relation["relationship"],

                "target": relation["target"]

            })

        return {

            "nodes": list(self.nodes.values()),

            "edges": self.edges

        }