from ai_engine.embeddings.embedding_model import EmbeddingModel
from ai_engine.vector_db.chroma_manager import ChromaManager
from ai_engine.models.retrieved_chunk import RetrievedChunk
from ai_engine.retrieval.reranker import Reranker


class Retriever:
    """
    Hybrid Retriever

    Responsibilities:
        1. Convert query to embedding
        2. Search ChromaDB
        3. Convert results to RetrievedChunk objects
        4. Rerank and remove duplicate chunks
    """

    def __init__(self):

        self.db = ChromaManager()

        self.reranker = Reranker(max_chunks=5)

    def retrieve(self, query: str, k: int = 15):


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

        retrieved_chunks = [

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

       
        reranked_chunks = self.reranker.rerank(

            retrieved_chunks

        )

        return reranked_chunks