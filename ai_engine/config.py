"""
Project Configuration
"""



CHUNK_SIZE = 500
CHUNK_OVERLAP = 100



EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"



VECTOR_DB_PATH = "./vector_store"

COLLECTION_NAME = "industrial_documents"



OCR_LANGUAGE = "eng"


SUPPORTED_FILES = [
    ".pdf",
    ".docx",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg"
]