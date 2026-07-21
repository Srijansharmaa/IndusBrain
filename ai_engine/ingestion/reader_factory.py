from pathlib import Path

class ReaderFactory:

    @classmethod
    def get_reader(cls, file_path):

        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            from ai_engine.ingestion.pdf_reader import PDFReader
            return PDFReader(file_path)

        elif extension == ".docx":
            from ai_engine.ingestion.docx_reader import DOCXReader
            return DOCXReader(file_path)

        elif extension in [".xlsx", ".xls"]:
            from ai_engine.ingestion.excel_reader import ExcelReader
            return ExcelReader(file_path)

        elif extension in [".png", ".jpg", ".jpeg"]:
            from ai_engine.ingestion.image_reader import ImageReader
            return ImageReader(file_path)

        raise ValueError(f"Unsupported file type: {extension}")