from pathlib import Path
import importlib

class ReaderFactory:
    """
    Factory class that returns the appropriate reader
    based on the file extension.
    """

    READERS = {
        ".pdf": ("ai_engine.ingestion.pdf_reader", "PDFReader"),
        ".docx": ("ai_engine.ingestion.docx_reader", "DOCXReader"),
        ".xlsx": ("ai_engine.ingestion.excel_reader", "ExcelReader"),
        ".xls": ("ai_engine.ingestion.excel_reader", "ExcelReader"),
        ".png": ("ai_engine.ingestion.image_reader", "ImageReader"),
        ".jpg": ("ai_engine.ingestion.image_reader", "ImageReader"),
        ".jpeg": ("ai_engine.ingestion.image_reader", "ImageReader"),
    }

    @classmethod
    def get_reader(cls, file_path):

        extension = Path(file_path).suffix.lower()

        reader_info = cls.READERS.get(extension)

        if reader_info is None:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

        module_name, class_name = reader_info

        module = importlib.import_module(module_name)

        reader_class = getattr(module, class_name)

        return reader_class(file_path)
