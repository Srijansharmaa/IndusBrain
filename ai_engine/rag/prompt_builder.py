class PromptBuilder:
    """
    Builds the final prompt for the Hybrid RAG system.

    Sources of context:

    1. Retrieved document chunks
    2. Knowledge Graph
    3. User Question
    """

    @staticmethod
    def build(
        question: str,
        retrieved_chunks,
        graph_context: str = ""
    ) -> str:

        document_context = []

        for i, chunk in enumerate(retrieved_chunks, start=1):

            if hasattr(chunk, "text"):

                text = chunk.text

                source = chunk.metadata.get(
                    "source",
                    "Unknown"
                )

                page = chunk.metadata.get(
                    "page",
                    "?"
                )

            elif isinstance(chunk, dict):

                text = chunk.get("text", "")

                metadata = chunk.get(
                    "metadata",
                    {}
                )

                source = metadata.get(
                    "source",
                    "Unknown"
                )

                page = metadata.get(
                    "page",
                    "?"
                )

            else:

                text = str(chunk)

                source = "Unknown"

                page = "?"

            document_context.append(

                f"""
Document : {source}
Page     : {page}

{text}
"""
            )

        document_context = "\n\n".join(

            document_context

        )

        if not graph_context.strip():

            graph_context = "No relevant graph information found."

        prompt = f"""
You are IndusBrain.

You are an Industrial Knowledge Assistant.

Your job is to answer ONLY from the supplied information.

==================================================
RULES
==================================================

1. NEVER invent information.

2. NEVER hallucinate.

3. NEVER use outside knowledge.

4. If the answer is not present in the context,
reply EXACTLY:

"I could not find that information in the uploaded documents."

5. Prefer Knowledge Graph facts whenever available.

6. If both document context and graph context
contain useful information,
combine both.

7. Mention equipment names exactly as written.

8. Mention document names whenever appropriate.

9. Keep answers concise but complete.

10. Use bullet points whenever useful.

==================================================
DOCUMENT CONTEXT
==================================================

{document_context}

==================================================
KNOWLEDGE GRAPH
==================================================

{graph_context}

==================================================
QUESTION
==================================================

{question}

==================================================
FINAL ANSWER
==================================================
"""

        return prompt