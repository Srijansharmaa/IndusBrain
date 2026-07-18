from abc import ABC, abstractmethod

from ai_engine.models.document import Document


class BaseReader(ABC):
    """
    Abstract base class for all document readers.
    """

    @abstractmethod
    def read(self) -> list[Document]:
        """
        Read a document and return Document objects.
        """
        pass