import time

from ai_engine.knowledge_graph.knowledge_extractor import KnowledgeExtractor
from ai_engine.knowledge_graph.graph_builder import GraphBuilder
from ai_engine.knowledge_graph.graph_store import GraphStore
from ai_engine.knowledge_graph.graph_merger import GraphMerger
from ai_engine.knowledge_graph.graph_statistics import GraphStatistics


class KnowledgeGraphPipeline:
    """
    Production Knowledge Graph Pipeline

    Flow

    Chunks
        ↓
    Filter Small Chunks
        ↓
    Dynamic Batching
        ↓
    Gemini Extraction
        ↓
    Graph Builder
        ↓
    Load Existing Graph
        ↓
    Graph Merger
        ↓
    Graph Statistics
        ↓
    Save Graph
    """

    MAX_CHARS = 12000

    MIN_WORDS = 20

    MAX_RETRIES = 3

    RETRY_DELAY = 5

    def __init__(self):

        self.extractor = KnowledgeExtractor()

        self.builder = GraphBuilder()

        self.store = GraphStore()

    def _should_process(self, text: str):

        if not text:

            return False

        return len(text.split()) >= self.MIN_WORDS

    def _extract(self, text):

        for attempt in range(self.MAX_RETRIES):

            try:

                return self.extractor.extract(text)

            except Exception as e:

                print(f"Gemini Error ({attempt+1}/{self.MAX_RETRIES})")

                print(e)

                if attempt == self.MAX_RETRIES - 1:

                    raise

                time.sleep(self.RETRY_DELAY)

    def process(self, chunks):

        print(f"[KG DEBUG] Entering KnowledgeGraphPipeline.process() with chunks_count={len(chunks)}")

        all_entities = []

        all_relationships = []

        current_batch = []

        current_chars = 0

        for chunk in chunks:

            if not self._should_process(chunk.text):

                continue

            chunk_size = len(chunk.text)

            if (

                current_batch

                and

                current_chars + chunk_size > self.MAX_CHARS

            ):

                self._process_batch(

                    current_batch,

                    all_entities,

                    all_relationships

                )

                current_batch = []

                current_chars = 0

            current_batch.append(chunk)

            current_chars += chunk_size

        if current_batch:

            self._process_batch(

                current_batch,

                all_entities,

                all_relationships

            )

       

        print(f"[KG DEBUG] Total entities collected before build: {len(all_entities)}")

        print(f"[KG DEBUG] Total relationships collected before build: {len(all_relationships)}")

        new_graph = self.builder.build(

            all_entities,

            all_relationships

        )

        # Debug: new graph counts
        ng_nodes = len(new_graph.get('nodes', []))
        ng_edges = len(new_graph.get('edges', []))
        print(f"[KG DEBUG] KnowledgeGraphPipeline.process() -> new_graph nodes={ng_nodes}, edges={ng_edges}")

        existing_graph = self.store.load()

        

        merged_graph = GraphMerger.merge(

            existing_graph,

            new_graph

        )

       

        stats = GraphStatistics.generate(

            merged_graph

        )

        print("\nKnowledge Graph Statistics")

        for key, value in stats.items():

            print(f"{key}: {value}")

        self.store.save(

            merged_graph

        )

        return merged_graph

    def _process_batch(

        self,

        batch,

        entities,

        relationships

    ):

        batch_text = "\n\n".join(

            chunk.text

            for chunk in batch

        )

        result = self._extract(

            batch_text

        )

        # Log counts from this extraction
        ent_count = len(result.get("entities", []))
        rel_count = len(result.get("relationships", []))
        print(f"[KG DEBUG] _process_batch: extracted entities={ent_count}, relationships={rel_count}")

        entities.extend(

            result.get(

                "entities",

                []

            )

        )

        relationships.extend(

            result.get(

                "relationships",

                []

            )

        )

        print(f"[KG DEBUG] Totals after _process_batch: entities={len(entities)}, relationships={len(relationships)}")