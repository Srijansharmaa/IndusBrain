from pathlib import Path
import fitz  


class PDFReader:
    """
    Reads PDF documents and extracts text page by page.
    """

    def __init__(self, pdf_path):
        self.pdf_path = Path(pdf_path)

    def extract_text(self):
        """
        Returns text and metadata for every page.
        """

        if not self.pdf_path.exists():
            raise FileNotFoundError(
                f"File not found: {self.pdf_path}"
            )

        document = fitz.open(self.pdf_path)

        pages = []

        for page_number, page in enumerate(document, start=1):

            pages.append(
                {
                    "page": page_number,
                    "text": page.get_text(),
                    "source": self.pdf_path.name
                }
            )

        document.close()

        return pages


if __name__ == "__main__":

    pdf = PDFReader(
        "D:\IndusMind\IndusBrain\data\sample_documents\Wingfotech_Ecell Patna_signed.pdf"
    )

    pages = pdf.extract_text()

    for page in pages:

        print("=" * 70)
        print(f"Document : {page['source']}")
        print(f"Page      : {page['page']}")
        print("-" * 70)
        print(page["text"])