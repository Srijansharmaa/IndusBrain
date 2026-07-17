from dataclasses import dataclass


@dataclass
class Chunk:

    id: str

    source: str

    page: int

    chunk_index: int

    text: str

    metadata: dict