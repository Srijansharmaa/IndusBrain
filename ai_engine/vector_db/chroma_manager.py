import chromadb


class ChromaManager:
    """
    Handles all vector database operations.
    """

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="data/chroma_db"
        )

        self.collection = self.client.get_or_create_collection(
            name="industrial_documents"
        )

    def add_chunks(self, chunks):
        """
        Store embedded chunks.
        """

        self.collection.add(

            ids=[chunk.id for chunk in chunks],

            documents=[chunk.text for chunk in chunks],

            embeddings=[chunk.embedding for chunk in chunks],

            metadatas=[chunk.metadata for chunk in chunks]

        )

    def search(self, embedding, k=5):
        """
        Retrieve top-k similar chunks.
        """

        return self.collection.query(
            query_embeddings=[embedding],
            n_results=k,
            include=[
                "documents",
                "metadatas",
                "distances"
            ]
        )

    def count(self):
        """
        Returns number of stored chunks.
        """

        return self.collection.count()

    def delete(self, ids):
        """
        Delete chunks by ids.
        """

        self.collection.delete(
            ids=ids
        )

    def reset(self):
        """
        Remove every chunk from database.
        """

        self.client.delete_collection(
            "industrial_documents"
        )

        self.collection = self.client.get_or_create_collection(
            name="industrial_documents"
        )