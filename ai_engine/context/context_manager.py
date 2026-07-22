class ContextManager:
    """
    Combines and optimizes all context before
    sending it to the LLM.
    """

    MAX_CHUNKS = 5

    def prepare_context(

        self,

        retrieved_chunks,

        graph_context

    ):

        

        unique_chunks = []

        seen = set()

        for chunk in retrieved_chunks:

            text = chunk.text.strip()

            if text not in seen:

                seen.add(text)

                unique_chunks.append(chunk)

        

        unique_chunks = unique_chunks[:self.MAX_CHUNKS]

        

        if graph_context:

            graph_context = graph_context.strip()

        else:

            graph_context = ""

        return {

            "chunks": unique_chunks,

            "graph": graph_context

        }