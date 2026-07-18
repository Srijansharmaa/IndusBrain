from pathlib import Path

from ai_engine.ingestion.pdf_reader import PDFReader
from ai_engine.ingestion.docx_reader import DOCXReader
from ai_engine.ingestion.excel_reader import ExcelReader
from ai_engine.ingestion.image_reader import ImageReader



class ReaderFactory:

    READERS = {

        ".pdf": PDFReader,

        ".docx": DOCXReader,

        ".xlsx": ExcelReader,

        ".xls": ExcelReader,

        ".png": ImageReader,

        ".jpg": ImageReader,

        ".jpeg": ImageReader,

    }

    @classmethod
    def get_reader(cls, file_path):

        extension = Path(file_path).suffix.lower()

        reader = cls.READERS.get(extension)

        if reader is None:

            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        return reader(file_path)