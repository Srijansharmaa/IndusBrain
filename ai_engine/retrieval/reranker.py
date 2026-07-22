class Reranker:
    """
    Removes duplicate chunks and
    keeps the most useful ones.
    """

    def __init__(self, max_chunks=5):

        self.max_chunks = max_chunks

    def rerank(self, chunks):

        unique = []

        seen = set()

        for chunk in chunks:

            text = chunk.text.strip()

            if text in seen:

                continue

            seen.add(text)

            unique.append(chunk)

        return unique[:self.max_chunks]