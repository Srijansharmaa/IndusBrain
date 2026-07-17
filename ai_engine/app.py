from pathlib import Path
from dataclasses import asdict
import shutil
import os

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from ai_engine.config import SUPPORTED_FILES
from ai_engine.pipelines.document_pipeline import DocumentPipeline

app = FastAPI(
    title="IndusBrain AI Engine",
    description="Document Processing API",
    version="1.0.0"
)

# -------------------------------
# CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Change to your React URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Upload Folder
# -------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent

UPLOAD_FOLDER = BASE_DIR / "uploads"

UPLOAD_FOLDER.mkdir(exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# -------------------------------
# Initialize Pipeline
# -------------------------------
pipeline = DocumentPipeline()


# ==========================================================
# Home
# ==========================================================

@app.get("/")
def home():
    return {
        "message": "IndusBrain AI Engine Running",
        "version": "1.0.0"
    }


# ==========================================================
# Health Check
# ==========================================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================================================
# Supported File Types
# ==========================================================

@app.get("/supported-files")
def supported_files():
    return {
        "supported_files": SUPPORTED_FILES
    }


# ==========================================================
# Process Document
# ==========================================================

@app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    """
    Upload a PDF and receive processed chunks.
    """

    extension = Path(file.filename).suffix.lower()

    if extension not in SUPPORTED_FILES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {extension}"
        )

    filepath = UPLOAD_FOLDER / file.filename

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:

        chunks = pipeline.process(filepath)

        return {
            "success": True,
            "filename": file.filename,
            "total_chunks": len(chunks),
            "chunks": [
                asdict(chunk)
                for chunk in chunks
            ]
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==========================================================
# Delete Uploaded File
# ==========================================================

@app.delete("/delete-file/{filename}")
def delete_file(filename: str):

    filepath = UPLOAD_FOLDER / filename

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail="File not found."
        )

    os.remove(filepath)

    return {
        "message": "File deleted successfully."
    }


# ==========================================================
# List Uploaded Files
# ==========================================================

@app.get("/documents")
def get_uploaded_documents():

    files = [file.name for file in UPLOAD_FOLDER.iterdir() if file.is_file()]

    return {
        "count": len(files),
        "documents": files
    }


# ==========================================================
# Process Existing File
# ==========================================================

@app.post("/process-existing/{filename}")
def process_existing(filename: str):

    filepath = os.path.join(
        UPLOAD_FOLDER,
        filename
    )

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail="File not found."
        )

    chunks = pipeline.process(str(filepath))

    return {
        "filename": filename,
        "total_chunks": len(chunks),
        "chunks": [
            asdict(chunk)
            for chunk in chunks
        ]
    }