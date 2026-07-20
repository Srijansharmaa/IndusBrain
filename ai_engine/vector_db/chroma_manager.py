import chromadb


class ChromaManager:

    def __init__(self):

        self.client = chromadb.PersistentClient(
            path="data/chroma_db"
        )

        self.collection = self.client.get_or_create_collection(
            name="industrial_documents"
        )

    def add_chunks(self, chunks):

        self.collection.add(

            ids=[chunk.id for chunk in chunks],

            documents=[chunk.text for chunk in chunks],

            embeddings=[chunk.embedding for chunk in chunks],

            metadatas=[chunk.metadata for chunk in chunks]

        )

    def search(self, embedding, k=5):

        return self.collection.query(

            query_embeddings=[embedding],

            n_results=k

        )