import uuid

from langchain_text_splitters import RecursiveCharacterTextSplitter

from ai_engine.models.document import Document
from ai_engine.models.chunk import Chunk
from ai_engine.config import CHUNK_SIZE
from ai_engine.config import CHUNK_OVERLAP


class DocumentChunker:
    """
    Splits a Document into multiple Chunk objects.
    """

    def __init__(

        self,

        chunk_size=CHUNK_SIZE,

        chunk_overlap=CHUNK_OVERLAP,

    ):

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=[
                "\n\n",
                "\n",
                ". ",
                " ",
                ""
            ]
        )

    def split(self, document: Document) -> list[Chunk]:
        """
        Split a Document into Chunk objects.

        Parameters
        ----------
        document : Document

        Returns
        -------
        List[Chunk]
        """

        text_chunks = self.splitter.split_text(document.text)

        chunks = []

        for index, text in enumerate(text_chunks):

            chunk = Chunk(

                id=str(uuid.uuid4()),

                source=document.source,

                page=document.page,

                chunk_index=index,

                text=text,

                metadata={
                    "source": document.source,
                    "page": document.page,
                }
            )

            chunks.append(chunk)

        return chunks