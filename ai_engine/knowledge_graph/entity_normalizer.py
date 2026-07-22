import re


class EntityNormalizer:
    """
    Normalizes entity names before
    they are added to the graph.
    """

    @staticmethod
    def normalize(name: str):

        if not name:

            return ""

        
        name = " ".join(name.split())

        
        name = name.lower()

      
        name = re.sub(

            r"[^a-z0-9\s\-]",

            "",

            name

        )

    
        name = re.sub(

            r"\s+",

            " ",

            name

        )

        return name.strip()