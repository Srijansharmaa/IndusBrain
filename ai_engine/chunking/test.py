from ai_engine.ingestion.pdf_reader import PDFReader
from ai_engine.preprocessing.text_cleaner import TextCleaner
from ai_engine.chunking.chunker import DocumentChunker


reader = PDFReader(
    "data/sample_documents/Wingfotech_Ecell Patna_signed.pdf"
)

documents = reader.extract_text()

chunker = DocumentChunker()

for document in documents:

    document.text = TextCleaner.clean(document.text)

    chunks = chunker.split(document)

    for chunk in chunks:

        print("=" * 80)

        print("ID :", chunk.id)

        print("SOURCE :", chunk.source)

        print("PAGE :", chunk.page)

        print("INDEX :", chunk.chunk_index)

        print()

        print(chunk.text)

        print()

        print(chunk.metadata)