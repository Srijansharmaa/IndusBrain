class ConfidenceEstimator:
    """
    Estimates the confidence of the final answer.

    The confidence score is heuristic-based and
    combines:

    - Retrieval quality
    - Graph matches
    - Number of retrieved chunks
    """

    MAX_DISTANCE = 1.5

    @staticmethod
    def estimate(
        retrieved_chunks,
        graph_context: str
    ) -> float:

        score = 50.0

        

        if retrieved_chunks:

            avg_distance = sum(
                chunk.distance
                for chunk in retrieved_chunks
            ) / len(retrieved_chunks)

            retrieval_score = max(

                0,

                (1 - avg_distance /
                 ConfidenceEstimator.MAX_DISTANCE)

            ) * 30

            score += retrieval_score

     
        if graph_context.strip():

            score += 15

       

        if len(retrieved_chunks) >= 3:

            score += 5

        return min(score, 100)