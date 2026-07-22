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

    def load(self):

        if not self.file_path.exists():

            return {

                "nodes": [],

                "edges": []

            }

        with open(
            self.file_path,
            "r",
            encoding="utf-8"
        ) as f:

            return json.load(f)