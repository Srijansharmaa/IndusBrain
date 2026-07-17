from dataclasses import dataclass


@dataclass
class Document:

    source: str

    page: int

    text: str

