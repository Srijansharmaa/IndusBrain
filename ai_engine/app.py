from pathlib import Path
from dataclasses import asdict
import shutil
import os

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from ai_engine.config import SUPPORTED_FILES
from ai_engine.pipelines.document_pipeline import DocumentPipeline
from ai_engine.embeddings.embedding_model import EmbeddingModel
from ai_engine.vector_db.chroma_manager import ChromaManager
from ai_engine.rag.rag_pipeline import RAGPipeline

# Knowledge Graph imports
from ai_engine.knowledge_graph.graph_store import GraphStore
from ai_engine.knowledge_graph.graph_query import GraphQuery
from ai_engine.knowledge_graph.graph_statistics import GraphStatistics
from ai_engine.pipelines.knowledge_graph_pipeline import KnowledgeGraphPipeline


pipeline = None
chroma = None
rag_pipeline = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global pipeline, chroma, rag_pipeline

    print(" Starting IndusBrain...")

    pipeline = DocumentPipeline()
    chroma = ChromaManager()
    print("Chroma count:", chroma.collection.count())

    print("Loading embedding model...")
    EmbeddingModel.get_model()
    print("Embedding model loaded.")

    rag_pipeline = RAGPipeline()

    print("AI Engine Ready!")

    yield

    print("👋 Shutting down AI Engine...")

app = FastAPI(
    title="IndusBrain AI Engine",
    description="Document Processing API",
    version="1.0.0",
    lifespan=lifespan
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
        # Process document into chunks
        chunks = pipeline.process(filepath)

        # Build/update knowledge graph from chunks BEFORE embedding/storage
        try:
            kg_pipeline = KnowledgeGraphPipeline()
            merged_graph = kg_pipeline.process(chunks)
            print(f"✅ Knowledge graph updated: nodes={len(merged_graph.get('nodes', []))} edges={len(merged_graph.get('edges', []))}")
        except Exception as e:
            # Log but don't fail the whole process - embedding and storage should continue
            print(f"Knowledge graph pipeline error: {e}")

        # Generate embeddings
        texts = [chunk.text for chunk in chunks]
        embeddings = EmbeddingModel.encode(texts)

        # Attach embeddings to chunks
        for chunk, embedding in zip(chunks, embeddings):
            chunk.embedding = embedding.tolist()

        # Store in ChromaDB
        chroma.add_chunks(chunks)

        print(f"✅ Stored {len(chunks)} chunks")
        print(f"📦 Chroma count: {chroma.count()}")

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

    filepath = os.path.join(UPLOAD_FOLDER, filename)

    print("UPLOAD_FOLDER =", UPLOAD_FOLDER)
    print("filename =", filename)
    print("filepath =", filepath)
    print("exists =", os.path.exists(filepath))

    if not os.path.exists(filepath):
        raise HTTPException(
            status_code=404,
            detail="File not found."
        )

    chunks = pipeline.process(str(filepath))

    # Update knowledge graph as well
    try:
        kg_pipeline = KnowledgeGraphPipeline()
        merged_graph = kg_pipeline.process(chunks)
        print(f"✅ Knowledge graph updated from existing file: nodes={len(merged_graph.get('nodes', []))} edges={len(merged_graph.get('edges', []))}")
    except Exception as e:
        print(f"Knowledge graph pipeline error (existing file): {e}")

    return {
        "filename": filename,
        "total_chunks": len(chunks),
        "chunks": [asdict(chunk) for chunk in chunks]
    }
from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str
    k: int = 5

class RAGRequest(BaseModel):
    query: str


@app.post("/search")
async def semantic_search(request: SearchRequest):

    embedding = EmbeddingModel.encode([request.query])[0].tolist()

    results = chroma.search(
        embedding,
        k=request.k
    )

    formatted = []

    ids = results["ids"][0]
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    distances = results["distances"][0]

    for i in range(len(ids)):
        formatted.append({
            "id": ids[i],
            "text": docs[i],
            "metadata": metas[i],
            "score": round((1 - distances[i]) * 100, 2)
        })

    return {
        "success": True,
        "results": formatted
    }

class RAGRequest(BaseModel):
    query: str

import traceback

@app.post("/rag/ask")
async def ask_question(request: RAGRequest):
    try:
        result = rag_pipeline.ask(request.query)

        return {
            "success": True,
            **result
        }

    except Exception as e:
        traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# ==========================================================
# Knowledge Graph Endpoints
# ==========================================================

@app.get("/knowledge-graph/nodes")
def get_knowledge_nodes():
    store = GraphStore()
    graph = store.load()
    try:
        abs_path = str(store.file_path.resolve())
    except Exception:
        abs_path = "<unknown>"
    print(f"[KG DEBUG] API GET /knowledge-graph/nodes -> GraphStore path: {abs_path}")
    print(f"[KG DEBUG] API GET /knowledge-graph/nodes -> loaded nodes={len(graph.get('nodes', []))}, edges={len(graph.get('edges', []))}")
    return {
        "success": True,
        "nodes": graph.get("nodes", [])
    }


@app.get("/knowledge-graph/edges")
def get_knowledge_edges():
    store = GraphStore()
    graph = store.load()
    return {
        "success": True,
        "edges": graph.get("edges", [])
    }


@app.get("/knowledge-graph/stats")
def get_knowledge_stats():
    store = GraphStore()
    graph = store.load()
    stats = GraphStatistics.generate(graph)
    # documents indexed = number of uploaded files
    try:
        documents_indexed = len([f for f in UPLOAD_FOLDER.iterdir() if f.is_file()])
    except Exception:
        documents_indexed = 0
    stats["documentsIndexed"] = documents_indexed
    return {
        "success": True,
        "stats": stats
    }


@app.get("/knowledge-graph/node/{node_id}")
def get_knowledge_node(node_id: str):
    store = GraphStore()
    graph = store.load()
    node = None
    for n in graph.get("nodes", []):
        if n.get("id") == node_id:
            node = n
            break
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    # find connected edges
    connected_edges = [e for e in graph.get("edges", []) if e.get("source") == node_id or e.get("target") == node_id]
    # find neighbor nodes
    neighbor_ids = set()
    for e in connected_edges:
        neighbor_ids.add(e.get("source"))
        neighbor_ids.add(e.get("target"))
    neighbor_ids.discard(node_id)
    neighbors = [n for n in graph.get("nodes", []) if n.get("id") in neighbor_ids]
    return {
        "success": True,
        "node": node,
        "edges": connected_edges,
        "neighbors": neighbors
    }


@app.get("/knowledge-graph/search")
def search_knowledge_graph(query: str):
    gq = GraphQuery()
    gq.reload()
    matched = gq.search_entities(query)
    return {
        "success": True,
        "matched": matched
    }


@app.post("/knowledge-graph/rebuild")
def rebuild_knowledge_graph():
    """
    Rebuilds the knowledge graph by reprocessing all uploaded documents.
    """
    kg_pipeline = KnowledgeGraphPipeline()
    all_chunks = []
    # Iterate uploaded files and process
    try:
        files = [f for f in UPLOAD_FOLDER.iterdir() if f.is_file()]
    except Exception:
        files = []

    for f in files:
        try:
            chunks = pipeline.process(str(f))
            all_chunks.extend(chunks)
        except Exception as e:
            # skip files that fail processing but continue
            print(f"Error processing {f}: {e}")

    merged_graph = kg_pipeline.process(all_chunks)

    return {
        "success": True,
        "graph": merged_graph
    }
