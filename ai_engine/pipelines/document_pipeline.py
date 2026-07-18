from pathlib import Path
from ai_engine.ingestion.reader_factory import ReaderFactory
from ai_engine.preprocessing.text_cleaner import TextCleaner
from ai_engine.chunking.chunker import DocumentChunker
from ai_engine.models.chunk import Chunk


class DocumentPipeline:
    """
    End-to-end document processing pipeline.

    Flow:
    PDF
      ↓
    Reader
      ↓
    Document
      ↓
    Cleaner
      ↓
    Chunker
      ↓
    Chunk Objects
    """

    def __init__(self):

        self.chunker = DocumentChunker()

    def process(self, file_path: str) -> list[Chunk]:

        file_path = Path(file_path)

        reader = ReaderFactory.get_reader(file_path)

        documents = reader.read()

        all_chunks = []

        for document in documents:

            document.text = TextCleaner.clean(document.text)

            chunks = self.chunker.split(document)

            all_chunks.extend(chunks)

        return all_chunks