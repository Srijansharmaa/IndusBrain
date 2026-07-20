from ai_engine.embeddings.embedding_model import EmbeddingModel
from ai_engine.vector_db.chroma_manager import ChromaManager
from ai_engine.models.retrieved_chunk import RetrievedChunk


class Retriever:
    """
    Retrieves the most relevant chunks for a user query.
    """

    def __init__(self):

        self.db = ChromaManager()

    def retrieve(self, query: str, k: int = 5):

        query_embedding = EmbeddingModel.encode(
            [query]
        )[0].tolist()

        results = self.db.search(
            embedding=query_embedding,
            k=k
        )

        documents = results["documents"][0]
        metadatas = results["metadatas"][0]
        distances = results["distances"][0]

        return [

            RetrievedChunk(

                text=document,
                metadata=metadata,
                distance=distance

            )

            for document, metadata, distance in zip(
                documents,
                metadatas,
                distances
            )

        ]