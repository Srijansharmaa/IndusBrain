class GraphMerger:
    """
    Merges a newly generated graph with an
    existing graph.
    """

    @staticmethod
    def merge(existing_graph, new_graph):

       
        existing_nodes = {}

        for node in existing_graph.get("nodes", []):

            node_id = node.get("id")

            if not node_id:

                continue

            existing_nodes[node_id] = node

        
        for node in new_graph.get("nodes", []):

            node_id = node.get("id")

            if not node_id:

                continue

            existing_nodes[node_id] = node
        edge_keys = set()

        merged_edges = []

        for edge in existing_graph["edges"]:

            key = (

                edge["source"],

                edge["label"],

                edge["target"]

            )

            edge_keys.add(key)

            merged_edges.append(edge)

        next_id = len(merged_edges) + 1

        for edge in new_graph["edges"]:

            key = (

                edge["source"],

                edge["label"],

                edge["target"]

            )

            if key in edge_keys:

                continue

            edge["id"] = f"edge_{next_id}"

            next_id += 1

            merged_edges.append(edge)

            edge_keys.add(key)

        merged_nodes = list(existing_nodes.values())
        print(f"[KG DEBUG] GraphMerger.merge() -> nodes_merged={len(merged_nodes)}, edges_merged={len(merged_edges)}")

        return {

            "nodes": merged_nodes,

            "edges": merged_edges

        }