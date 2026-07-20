from ai_engine.embeddings.embedding_model import EmbeddingModel


class EmbeddingPipeline:
    """
    Generates embeddings for chunks and stores them inside the Chunk objects.
    """

    def process(self, chunks):

        texts = [chunk.text for chunk in chunks]

        embeddings = EmbeddingModel.encode(texts)

        for chunk, embedding in zip(chunks, embeddings):

            chunk.embedding = embedding.tolist()

        return chunks