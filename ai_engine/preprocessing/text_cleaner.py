import re


class TextCleaner:
    """
    Cleans extracted document text.
    """

    @staticmethod
    def clean(text: str) -> str:

        text = re.sub(r"[ \t]+", " ", text)

        text = re.sub(r"\n\s*\n", "\n", text)

        text = text.strip()

        return text