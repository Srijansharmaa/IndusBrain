from dataclasses import dataclass


@dataclass
class RetrievedChunk:
    """
    Represents a retrieved chunk from the vector database.
    """

    text: str

    metadata: dict

    distance: float