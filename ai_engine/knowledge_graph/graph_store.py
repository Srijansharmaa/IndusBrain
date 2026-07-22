import json
from pathlib import Path


class GraphStore:
    """
    Stores and loads the knowledge graph
    from a JSON file.
    """

    def __init__(self, file_path="data/knowledge_graph.json"):

        self.file_path = Path(file_path)

        self.file_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

    def save(self, graph):

        abs_path = str(self.file_path.resolve())
        print(f"[KG DEBUG] GraphStore.save() -> saving graph to: {abs_path}")
        try:
            with open(

                self.file_path,

                "w",

                encoding="utf-8"

            ) as f:

                json.dump(

                    graph,

                    f,

                    indent=4

                )
            print(f"[KG DEBUG] GraphStore.save() -> save completed successfully: {abs_path}")
            # Immediately reopen and report counts
            try:
                with open(self.file_path, 'r', encoding='utf-8') as rf:
                    data = json.load(rf)
                    nodes = data.get('nodes', [])
                    edges = data.get('edges', [])
                    print(f"[KG DEBUG] GraphStore.save() -> reopened file nodes={len(nodes)}, edges={len(edges)} from {abs_path}")
            except Exception as e:
                print(f"[KG DEBUG] GraphStore.save() -> ERROR reopening file {abs_path}: {e}")
        except Exception as e:
            print(f"[KG DEBUG] GraphStore.save() -> ERROR saving to {abs_path}: {e}")
            raise

    def load(self):

        abs_path = str(self.file_path.resolve())
        print(f"[KG DEBUG] GraphStore.load() -> loading graph from: {abs_path}")

        if not self.file_path.exists():

            print(f"[KG DEBUG] GraphStore.load() -> file does not exist: {abs_path}")
            return {

                "nodes": [],

                "edges": []

            }

        with open(

            self.file_path,

            "r",

            encoding="utf-8"

        ) as f:

            data = json.load(f)
            nodes = data.get("nodes", [])
            edges = data.get("edges", [])
            print(f"[KG DEBUG] GraphStore.load() -> loaded nodes={len(nodes)}, edges={len(edges)} from {abs_path}")
            return data