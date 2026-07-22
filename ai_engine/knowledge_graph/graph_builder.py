import re
from ai_engine.knowledge_graph.entity_normalizer import EntityNormalizer

class GraphBuilder:
    """
    Builds a frontend-friendly Knowledge Graph.

    Features:
    - Unique node IDs
    - Unique edge IDs
    - Duplicate node removal
    - Duplicate edge removal
    """

    def __init__(self):

        self.nodes = {}

        self.edges = []

        self.edge_set = set()

        self.edge_counter = 1


    def _generate_node_id(self, normalized_name: str):

        return re.sub(
            r"[^a-zA-Z0-9]+",
            "_",
            normalized_name
        ).strip("_")

    
    def _add_node(self, entity):

        original_name = entity["name"]

        normalized_name = EntityNormalizer.normalize(

            original_name

        )

        node_id = self._generate_node_id(

            normalized_name

        )

        if node_id in self.nodes:

            return

        self.nodes[node_id] = {

            "id": node_id,

            "label": original_name,

            "normalized": normalized_name,

            "type": entity.get(

                "type",

                "Unknown"

            )

        }


    def _add_edge(self, relation):

        source = self._generate_node_id(

            relation["source"]

        )

        target = self._generate_node_id(

            relation["target"]

        )

        relationship = relation["relationship"]

        key = (

            source,

            relationship,

            target

        )

        if key in self.edge_set:

            return

        self.edge_set.add(key)

        self.edges.append({

            "id": f"edge_{self.edge_counter}",

            "source": source,

            "target": target,

            "label": relationship

        })

        self.edge_counter += 1

   
    def build(

        self,

        entities,

        relationships

    ):

        self.nodes = {}

        self.edges = []

        self.edge_set = set()

        self.edge_counter = 1

       
        for entity in entities:

            self._add_node(entity)

        

        for relation in relationships:

            self._add_node({

                "name": relation["source"],

                "type": "Unknown"

            })

            self._add_node({

                "name": relation["target"],

                "type": "Unknown"

            })

       

        for relation in relationships:

            self._add_edge(relation)

        nodes_list = list(self.nodes.values())
        edges_list = self.edges
        print(f"[KG DEBUG] GraphBuilder.build() -> nodes_built={len(nodes_list)}, edges_built={len(edges_list)}")

        return {

            "nodes": nodes_list,

            "edges": edges_list

        }