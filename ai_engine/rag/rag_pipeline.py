from ai_engine.retrieval.retriever import Retriever
from ai_engine.knowledge_graph.graph_query import GraphQuery
from ai_engine.context.context_manager import ContextManager
from ai_engine.rag.prompt_builder import PromptBuilder
from ai_engine.llm.gemini_llm import GeminiLLM
from ai_engine.rag.answer_formatter import AnswerFormatter
from ai_engine.rag.confidence_estimator import ConfidenceEstimator


class RAGPipeline:
    """
    Final Hybrid RAG Pipeline

    Flow:

        User Question
              │
              ▼
        Vector Retrieval
              │
              ▼
        Knowledge Graph Search
              │
              ▼
        Context Manager
              │
              ▼
        Prompt Builder
              │
              ▼
            Gemini
              │
              ▼
      Confidence Estimator
              │
              ▼
       Answer Formatter
              │
              ▼
         Final Response
    """

    def __init__(self):

        self.retriever = Retriever()

        self.graph_query = GraphQuery()

        self.context_manager = ContextManager()

        self.llm = GeminiLLM()

        self.answer_formatter = AnswerFormatter()

        self.confidence_estimator = ConfidenceEstimator()

    def ask(self, question: str):

       

        retrieved_chunks = self.retriever.retrieve(question)

        if not retrieved_chunks:

            return {

                "answer": "No relevant documents found.",

                "confidence": 0,

                "graph_entities": [],

                "graph_context": "",

                "sources": [],

                "retrieved_chunks": []

            }

     

        graph_context = self.graph_query.build_context(

            question

        )

        

        context = self.context_manager.prepare_context(

            retrieved_chunks,

            graph_context

        )

       
        prompt = PromptBuilder.build(

            question=question,

            retrieved_chunks=context["chunks"],

            graph_context=context["graph"]

        )

        answer = self.llm.generate(prompt)

     

        confidence = self.confidence_estimator.estimate(

            context["chunks"],

            context["graph"]

        )

        

        sources = []

        seen = set()

        for chunk in context["chunks"]:

            source = {

                "source": chunk.metadata.get("source"),

                "page": chunk.metadata.get("page")

            }

            key = (

                source["source"],

                source["page"]

            )

            if key not in seen:

                seen.add(key)

                sources.append(source)


        return self.answer_formatter.format(

            answer=answer,

            confidence=confidence,

            graph_context=context["graph"],

            sources=sources,

            retrieved_chunks=context["chunks"]

        )