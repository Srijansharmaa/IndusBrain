from pathlib import Path

from paddleocr import PaddleOCR

from ai_engine.ingestion.base_reader import BaseReader
from ai_engine.models.document import Document


class ImageReader(BaseReader):
    """
    Reads image files using PaddleOCR.
    """
    _ocr = None

    def __init__(self, file_path):

        self.file_path = Path(file_path)

        if ImageReader._ocr is None:
            ImageReader._ocr = PaddleOCR(
                use_angle_cls=True,
                lang="en"
            )

    def read(self):

        result = ImageReader._ocr.ocr(
            str(self.file_path),
            cls=True
        )

        text = []

        for line in result[0]:

            text.append(line[1][0])

        return [

            Document(

                source=self.file_path.name,

                page=1,

                text="\n".join(text)

            )

        ]