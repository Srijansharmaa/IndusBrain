from sentence_transformers import SentenceTransformer


class EmbeddingModel:

    _model = None

    @classmethod
    def get_model(cls):

        if cls._model is None:

            cls._model = SentenceTransformer(
                "BAAI/bge-base-en-v1.5"
            )

        return cls._model

    @classmethod
    def encode(cls, texts):

        model = cls.get_model()

        return model.encode(
            texts,
            normalize_embeddings=True
        )