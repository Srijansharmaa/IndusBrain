import re


class QueryProcessor:
    """
    Converts a natural language question into
    searchable keywords.
    """

    STOP_WORDS = {
        "what", "is", "the", "a", "an", "of",
        "at", "in", "to", "for", "who", "where",
        "when", "how", "does", "do", "about",
        "tell", "me", "explain", "and", "or"
    }

    @classmethod
    def extract_keywords(cls, question: str):

        question = question.lower()

        question = re.sub(r"[^a-z0-9\s-]", "", question)

        words = question.split()

        keywords = []

        for word in words:

            if word not in cls.STOP_WORDS:

                keywords.append(word)

        return keywords