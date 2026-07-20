from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Chunk:

    id: str

    source: str

    page: int

    chunk_index: int

    text: str

    metadata: dict = field(default_factory=dict)

    embedding: Optional[list[float]] = None