from ai_engine.retrieval.retriever import Retriever
from ai_engine.rag.prompt_builder import PromptBuilder
from ai_engine.llm.gemini_llm import GeminiLLM


class RAGPipeline:
    """
    End-to-end Retrieval-Augmented Generation pipeline.
    """

    def __init__(self):

        self.retriever = Retriever()

        self.llm = GeminiLLM()

    def ask(self, query: str):
        

        retrieved_chunks = self.retriever.retrieve(query)
        if not retrieved_chunks:

            return {

                "answer": "No relevant documents found.",

                "sources": []

            }

        prompt = PromptBuilder.build(
            query,
            retrieved_chunks
        )

        answer = self.llm.generate(prompt)

        return {
            "answer": answer,
            "sources": [
                {
                    "source": chunk.metadata.get("source"),
                    "page": chunk.metadata.get("page"),
                }
                for chunk in retrieved_chunks
            ]
        }