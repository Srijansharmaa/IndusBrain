from pathlib import Path
import pandas as pd

from ai_engine.models.document import Document


from ai_engine.ingestion.base_reader import BaseReader

class ExcelReader(BaseReader):
    """
    Reads Excel (.xlsx/.xls) files.
    Each sheet is converted into one Document object.
    """

    def __init__(self, file_path):

        self.file_path = Path(file_path)

    def read(self):

        excel = pd.ExcelFile(self.file_path)

        documents = []

        for sheet in excel.sheet_names:

            df = excel.parse(sheet)

            text = df.to_string(index=False)

            documents.append(

                Document(

                    source=self.file_path.name,

                    page=1,

                    text=f"Sheet: {sheet}\n\n{text}"

                )

            )

        return documents