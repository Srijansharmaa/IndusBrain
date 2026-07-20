from abc import ABC, abstractmethod


class LLMInterface(ABC):
    """
    Base interface for all Large Language Models.
    """

    @abstractmethod
    def generate(self, prompt: str) -> str:
        """
        Generates a response from the LLM.
        """
        pass