class PromptBuilder:
    """
    Builds prompts for the LLM using retrieved document chunks.
    """

    @staticmethod
    def build(query: str, retrieved_chunks):

        context = "\n\n".join(
            chunk.text
            for chunk in retrieved_chunks
        )

        return f"""
You are an AI assistant for industrial knowledge management.

Answer the user's question ONLY using the information provided in the context.

Rules:
- Do not make up information.
- If the answer is not present in the context, reply:
  "I couldn't find that information in the provided documents."
- Be concise and accurate.

Context:
{context}

Question:
{query}

Answer:
"""