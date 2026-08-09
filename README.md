# IndusBrain

> **The AI Brain for Industrial Operations**

IndusBrain is an AI-powered industrial intelligence platform designed to
turn scattered engineering and operational documents into a searchable,
connected knowledge system.

It combines:

-   Document ingestion and processing
-   Semantic search
-   Hybrid Retrieval-Augmented Generation (RAG)
-   An AI industrial knowledge graph
-   AI-powered Copilot
-   Maintenance intelligence
-   Compliance monitoring
-   Analytics and knowledge-health dashboards
-   Role-based access
-   Document management
-   Administrative monitoring

The system is implemented as a **three-part architecture**:

``` text
React Frontend
      │
      ▼
Node.js / Express Backend
      │
      ├──────────────► MongoDB
      │
      ▼
Python / FastAPI AI Engine
      │
      ├── Document Processing
      ├── Embeddings
      ├── ChromaDB
      ├── Knowledge Graph
      ├── Hybrid RAG
      └── LLMs
```

------------------------------------------------------------------------

## Table of Contents

1.  [Problem Statement](#problem-statement)
2.  [Solution](#solution)
3.  [Core Features](#core-features)
4.  [How IndusBrain Works](#how-indusbrain-works)
5.  [System Architecture](#system-architecture)
6.  [End-to-End Data Flow](#end-to-end-data-flow)
7.  [Technology Stack](#technology-stack)
8.  [Project Structure](#project-structure)
9.  [Frontend](#frontend)
10. [Backend](#backend)
11. [AI Engine](#ai-engine)
12. [Document Processing Pipeline](#document-processing-pipeline)
13. [Semantic Search](#semantic-search)
14. [Hybrid RAG Pipeline](#hybrid-rag-pipeline)
15. [Knowledge Graph](#knowledge-graph)
16. [AI Copilot](#ai-copilot)
17. [Maintenance Intelligence](#maintenance-intelligence)
18. [Compliance Intelligence](#compliance-intelligence)
19. [Analytics](#analytics)
20. [Authentication and
    Authorization](#authentication-and-authorization)
21. [Database Design](#database-design)
22. [API Reference](#api-reference)
23. [Environment Variables](#environment-variables)
24. [Installation](#installation)
25. [Running the Project](#running-the-project)
26. [Testing the System](#testing-the-system)
27. [Security](#security)
28. [Troubleshooting](#troubleshooting)
29. [Current Implementation Notes](#current-implementation-notes)
30. [Future Improvements](#future-improvements)
31. [Project Highlights for
    Interviews](#project-highlights-for-interviews)

------------------------------------------------------------------------

# Problem Statement

Industrial organizations generate large amounts of technical
information:

-   SOPs
-   Maintenance manuals
-   Equipment reports
-   Compliance documents
-   Engineering reports
-   Incident reports
-   Inspection records
-   Spreadsheets
-   Images and scanned documents

The information is often fragmented across different files and systems.

This creates several problems:

1.  Engineers spend time manually searching documents.
2.  Important relationships between equipment, components, processes and
    departments are difficult to discover.
3.  Existing document search is usually keyword-based rather than
    semantic.
4.  Operational knowledge is difficult to reuse.
5.  Maintenance teams need to connect equipment information with
    historical knowledge.
6.  Compliance information can be difficult to track.
7.  Organizational knowledge remains locked inside documents.

IndusBrain addresses this by converting unstructured industrial
information into a combination of:

``` text
Documents
   ↓
Clean Text
   ↓
Chunks
   ↓
Embeddings ───────► Vector Database
   │
   └──────────────► Knowledge Graph
                         │
                         ▼
                  Hybrid Retrieval
                         │
                         ▼
                       LLM
                         │
                         ▼
                 Actionable Answer
```

------------------------------------------------------------------------

# Solution

IndusBrain acts as an **enterprise intelligence layer** over industrial
knowledge.

Instead of treating every document as an isolated file, it extracts:

-   entities
-   relationships
-   equipment
-   components
-   processes
-   parameters
-   locations
-   departments
-   technical information

The platform then makes this information available through:

-   document search
-   AI question answering
-   graph exploration
-   maintenance views
-   compliance views
-   analytics
-   recommendations

The central idea is:

> **Turn fragmented industrial documents into connected, queryable
> operational knowledge.**

------------------------------------------------------------------------

# Core Features

## 1. Document Management

Users can:

-   Upload documents
-   View uploaded documents
-   Search documents
-   Filter documents
-   View document details
-   Generate document summaries
-   Find related documents
-   Delete documents
-   Reprocess failed documents

Supported formats:

``` text
PDF
DOCX
XLSX
PNG
JPG
JPEG
```

------------------------------------------------------------------------

## 2. Semantic Search

Instead of matching only exact keywords, IndusBrain converts the query
into an embedding and searches the vector database for semantically
similar content.

Example:

``` text
User:
"What causes overheating in Pump P101?"

Search:
→ Query embedding
→ ChromaDB
→ Most relevant document chunks
```

This allows users to find relevant information even when the exact words
in the query do not appear in the document.

------------------------------------------------------------------------

## 3. AI Copilot

The Copilot provides a conversational interface over the industrial
knowledge base.

Example questions:

``` text
What is the maintenance procedure for Pump P101?

Which equipment is connected to Valve V22?

Summarize the uploaded maintenance manual.

What are the recent compliance risks?

Show me equipment with low health.

Which documents mention pressure-related failures?
```

The backend classifies the request and routes it to the appropriate
intelligence engine.

------------------------------------------------------------------------

## 4. Knowledge Graph

IndusBrain extracts entities and relationships from documents and
creates a graph.

Example:

``` text
Pump P101
    │
    ├── connected_to ──► Valve V22
    │
    ├── located_in ────► Plant A
    │
    ├── part_of ───────► Cooling System
    │
    └── powered_by ───► Motor M101
```

The graph provides a structured representation of industrial knowledge.

------------------------------------------------------------------------

## 5. Maintenance Intelligence

The Maintenance section provides:

-   Equipment health
-   Equipment risk
-   Recommended actions
-   Recent incidents
-   Predictive maintenance views
-   Equipment relationships

The system can identify equipment-related graph nodes and generate
maintenance-oriented recommendations.

------------------------------------------------------------------------

## 6. Compliance Intelligence

The Compliance section provides:

-   Compliance status
-   Risk levels
-   Expiring items
-   Expired items
-   Compliance metrics
-   Audit timeline
-   Compliance report generation

The current implementation generates a CSV compliance report.

------------------------------------------------------------------------

## 7. Analytics

The Analytics section provides information such as:

-   Knowledge graph size
-   Number of relationships
-   Healthy assets
-   Department activity
-   Knowledge growth
-   Knowledge health
-   AI usage
-   Document statistics

------------------------------------------------------------------------

## 8. Admin Dashboard

Administrators can work with:

-   Users
-   User status
-   Activity logs
-   Knowledge monitoring
-   Invitations
-   User editing

------------------------------------------------------------------------

# How IndusBrain Works

A typical workflow is:

``` text
1. User uploads an industrial document
                 ↓
2. Express backend stores document metadata
                 ↓
3. Backend sends file to FastAPI AI Engine
                 ↓
4. AI Engine identifies file type
                 ↓
5. Appropriate document reader extracts text
                 ↓
6. Text is cleaned and divided into chunks
                 ↓
7. Chunks are converted into embeddings
                 ↓
8. Embeddings are stored in ChromaDB
                 ↓
9. LLM extracts entities and relationships
                 ↓
10. Knowledge graph is built/merged
                 ↓
11. User asks a question
                 ↓
12. Backend classifies the intent
                 ↓
13. Relevant AI engine is selected
                 ↓
14. RAG retrieves relevant chunks
                 ↓
15. Knowledge graph provides structured context
                 ↓
16. LLM generates an answer
                 ↓
17. Response is returned to React
```

------------------------------------------------------------------------

# System Architecture

## High-Level Architecture

``` text
                    ┌──────────────────────┐
                    │      React UI        │
                    │   Vite + Tailwind    │
                    └──────────┬───────────┘
                               │ HTTP/JSON
                               ▼
                    ┌──────────────────────┐
                    │   Express Backend    │
                    │ Node.js + MongoDB     │
                    └───────┬────────┬─────┘
                            │        │
                    MongoDB │        │ HTTP
                            │        ▼
                            │ ┌─────────────────────┐
                            │ │ FastAPI AI Engine   │
                            │ │       Python        │
                            │ └───────┬─────────────┘
                            │         │
                            │         ├── Readers
                            │         ├── Chunker
                            │         ├── Embeddings
                            │         ├── ChromaDB
                            │         ├── Knowledge Graph
                            │         ├── RAG
                            │         └── LLM
                            │
                            ▼
                       MongoDB Data
```

------------------------------------------------------------------------

# End-to-End Data Flow

## Document Upload

``` text
React
  │
  │ POST /api/documents/upload
  ▼
Express
  │
  ├── Multer receives file
  ├── Creates Document record
  │
  ▼
FastAPI
  │
  ├── /process-document
  ├── validates extension
  ├── saves uploaded file
  └── starts background processing
```

The AI processing pipeline then performs:

``` text
File
 ↓
Reader
 ↓
Text Extraction
 ↓
Text Cleaning
 ↓
Chunking
 ↓
Embedding
 ↓
ChromaDB
```

At the same time:

``` text
Chunks
 ↓
Industrial Intelligence Extraction
 ↓
Equipment / Incidents / Recommendations / Compliance / Analytics
```

and:

``` text
Chunks
 ↓
Knowledge Graph Extraction
 ↓
Entity Normalization
 ↓
Relationship Extraction
 ↓
Graph Builder
 ↓
Graph Merger
 ↓
knowledge_graph.json
```

------------------------------------------------------------------------

# Technology Stack

## Frontend

  Technology     Purpose
  -------------- ---------------------------------
  React 19       UI framework
  Vite           Frontend development/build tool
  Tailwind CSS   Styling
  Axios          HTTP communication
  Recharts       Analytics charts
  D3 Force       Knowledge graph visualization
  Lucide React   Icons

------------------------------------------------------------------------

## Backend

  Technology           Purpose
  -------------------- -------------------------
  Node.js              Runtime
  Express 5            REST API
  MongoDB              Application database
  Mongoose             MongoDB ODM
  JWT                  Authentication
  bcryptjs             Password hashing
  Multer               File uploads
  Axios                AI Engine communication
  Helmet               HTTP security headers
  CORS                 Cross-origin access
  Morgan               HTTP logging
  express-rate-limit   Rate limiting
  express-validator    Request validation

------------------------------------------------------------------------

## AI Engine

  Technology              Purpose
  ----------------------- ----------------------------------------
  Python                  AI runtime
  FastAPI                 AI service API
  Sentence Transformers   Text embeddings
  all-MiniLM-L6-v2        Embedding model
  ChromaDB                Vector database
  Groq                    LLM inference
  Llama model             RAG/knowledge extraction generation
  Google GenAI            Gemini adapter
  PyMuPDF                 PDF extraction
  python-docx             DOCX extraction
  openpyxl                XLSX extraction
  OpenCV/Pillow           Image processing
  OCR                     Image/scanned-document text extraction

------------------------------------------------------------------------

# Project Structure

``` text
IndusBrain-main/
│
├── Client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── auth/
│   │   │   ├── common/
│   │   │   ├── compliance/
│   │   │   ├── copilot/
│   │   │   ├── dashboard/
│   │   │   ├── documents/
│   │   │   ├── graph/
│   │   │   ├── layout/
│   │   │   └── maintenance/
│   │   │
│   │   ├── constants/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── Routes/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── seed/
│   ├── services/
│   │   ├── ai/
│   │   ├── aiClient.js
│   │   ├── aiService.js
│   │   └── copilotservice.js
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── ai_engine/
│   ├── chunking/
│   ├── context/
│   ├── embeddings/
│   ├── extractors/
│   ├── ingestion/
│   ├── knowledge_graph/
│   ├── llm/
│   ├── models/
│   ├── pipelines/
│   ├── preprocessing/
│   ├── rag/
│   ├── retrieval/
│   ├── services/
│   ├── vector_db/
│   ├── app.py
│   └── config.py
│
├── Uploads/
├── requirements.txt
└── README.md
```

------------------------------------------------------------------------

# Frontend

The frontend is a React single-page application.

The main application is controlled by `Client/src/App.jsx`.

Available application pages include:

``` text
Dashboard
Copilot
Knowledge Graph Explorer
Documents
Maintenance
Compliance
Analytics
Admin
Settings
```

## Frontend Services

API communication is separated into service modules:

``` text
authService.js
documentService.js
copilotService.js
graphService.js
maintenanceService.js
complianceService.js
analyticsService.js
dashboardService.js
adminService.js
```

This keeps API logic separate from UI components.

------------------------------------------------------------------------

# Backend

The Express backend is the central application layer.

It handles:

-   Authentication
-   Authorization
-   User management
-   Document metadata
-   File uploads
-   API validation
-   MongoDB persistence
-   AI Engine communication
-   Copilot orchestration
-   Analytics
-   Compliance
-   Maintenance
-   Dashboard data
-   Knowledge graph access

The server starts from:

``` text
server/server.js
```

Default port:

``` text
3000
```

------------------------------------------------------------------------

# Backend Route Structure

``` text
/api/auth
/api/documents
/api/search
/api/admin
/api/analytics
/api/compliance
/api/copilot
/api/graph
/api/maintenance
/api/dashboard
/api/ai
```

------------------------------------------------------------------------

# AI Engine

The AI Engine is implemented as a separate FastAPI microservice.

Main entry point:

``` text
ai_engine/app.py
```

Default development command:

``` bash
python -m uvicorn ai_engine.app:app --reload --port 8000
```

The AI Engine is intentionally separated from the Node.js application.

This provides a clean architecture:

``` text
Business/API Layer
        │
        ▼
Node.js
        │
        ▼
AI Layer
        │
        ▼
Python
```

------------------------------------------------------------------------

# Document Processing Pipeline

The document pipeline is implemented around:

``` text
ai_engine/pipelines/document_pipeline.py
```

The system supports multiple readers.

``` text
                 ┌── PDF Reader
                 ├── DOCX Reader
Input File ──────┼── Excel Reader
                 └── Image Reader
                         │
                         ▼
                    Extracted Text
                         │
                         ▼
                    Text Cleaner
                         │
                         ▼
                       Chunker
                         │
                         ▼
                     AI Systems
```

## Supported Extensions

``` python
[
    ".pdf",
    ".docx",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg"
]
```

------------------------------------------------------------------------

# Chunking

Documents are divided into smaller pieces before embedding.

Current configuration:

``` text
Chunk size: 500
Chunk overlap: 100
```

The overlap helps preserve context between adjacent chunks.

Example:

``` text
Document
│
├── Chunk 1
│     └── 500 tokens/characters
│
├── Chunk 2
│     └── overlaps previous chunk
│
├── Chunk 3
│
└── ...
```

The exact behavior is controlled by the project's chunker
implementation.

------------------------------------------------------------------------

# Embeddings

IndusBrain uses:

``` text
sentence-transformers/all-MiniLM-L6-v2
```

The purpose of embeddings is to convert text into numerical vectors.

For example:

``` text
"Pump P101 is overheating"
              ↓
       Embedding Model
              ↓
       [0.12, -0.44, ...]
```

Queries are embedded in the same vector space.

This allows semantic similarity search.

------------------------------------------------------------------------

# Vector Database

IndusBrain uses **ChromaDB**.

Configuration:

``` text
Collection:
industrial_documents

Vector DB path:
./vector_store
```

Each indexed chunk contains information such as:

``` text
ID
Text
Embedding
Metadata
Source document
Page information
```

The vector database is used by the retrieval layer.

------------------------------------------------------------------------

# Semantic Search

The FastAPI service exposes:

``` http
POST /search
```

Request:

``` json
{
  "query": "pump overheating",
  "k": 5
}
```

The AI Engine:

``` text
Query
 ↓
Embedding
 ↓
ChromaDB similarity search
 ↓
Top K chunks
 ↓
Formatted results
```

Example response shape:

``` json
{
  "success": true,
  "results": [
    {
      "id": "chunk-id",
      "text": "....",
      "metadata": {
        "source": "maintenance.pdf"
      },
      "score": 91.2
    }
  ]
}
```

------------------------------------------------------------------------

# Hybrid RAG Pipeline

The core question-answering system is implemented in:

``` text
ai_engine/rag/rag_pipeline.py
```

The pipeline combines **vector retrieval + knowledge graph context + LLM
generation**.

``` text
                  User Question
                        │
                        ▼
                Vector Retrieval
                        │
                        ▼
                 Relevant Chunks
                        │
                        ├──────────────┐
                        │              │
                        ▼              ▼
                Knowledge Graph   Context Manager
                        │              │
                        └──────┬───────┘
                               ▼
                         Prompt Builder
                               │
                               ▼
                              LLM
                               │
                               ▼
                     Confidence Estimator
                               │
                               ▼
                       Answer Formatter
                               │
                               ▼
                         Final Answer
```

This is more powerful than a simple vector-only RAG system because the
graph can provide explicit relationships between entities.

------------------------------------------------------------------------

# LLM Layer

The project contains two LLM adapters:

``` text
ai_engine/llm/groq_llm.py
ai_engine/llm/gemini_llm.py
```

## Groq

The current RAG and knowledge extraction implementations use the Groq
client.

The default configured Groq model is:

``` text
llama-3.1-8b-instant
```

The model can be changed through:

``` text
GROQ_MODEL
```

## Gemini

A Gemini adapter is also included:

``` text
GeminiLLM
```

with a default model of:

``` text
gemini-2.5-flash
```

However, the current RAG pipeline is wired to `GroqLLM`, so Gemini is an
available adapter rather than the active RAG generator in the current
implementation.

------------------------------------------------------------------------

# Knowledge Graph

The knowledge graph is one of the main differentiators of IndusBrain.

## Why a Knowledge Graph?

Vector search answers:

> "What text is similar to my question?"

A knowledge graph answers:

> "What entities exist, and how are they connected?"

For industrial systems, relationships are extremely important.

Example:

``` text
Pump P101
    │
    ├── connected_to ── Valve V22
    │
    ├── located_in ──── Plant A
    │
    ├── part_of ─────── Cooling System
    │
    └── powered_by ──── Motor M101
```

------------------------------------------------------------------------

# Knowledge Graph Extraction

The graph extraction pipeline uses an LLM to extract:

## Entity Types

The extractor supports types such as:

``` text
Equipment
Component
System
Sensor
Instrument
Valve
Pump
Motor
Pipeline
Material
Chemical
Location
Department
Person
Organization
Document
Process
Software
Parameter
Unknown
```

## Relationship Types

Supported relationship labels include:

``` text
connected_to
located_in
part_of
uses
contains
controls
monitors
depends_on
belongs_to
maintains
feeds
receives_from
installed_in
powered_by
measures
```

The extractor is instructed not to invent entities or relationships.

------------------------------------------------------------------------

# Knowledge Graph Pipeline

The pipeline contains:

``` text
Entity Extraction
       ↓
Entity Normalization
       ↓
Relationship Extraction
       ↓
Graph Builder
       ↓
Graph Merger
       ↓
Graph Store
```

The graph is currently persisted to:

``` text
data/knowledge_graph.json
```

The FastAPI service exposes endpoints to access it.

------------------------------------------------------------------------

# Knowledge Graph API

## Get Nodes

``` http
GET /knowledge-graph/nodes
```

## Get Edges

``` http
GET /knowledge-graph/edges
```

## Get Statistics

``` http
GET /knowledge-graph/stats
```

## Get a Node

``` http
GET /knowledge-graph/node/{node_id}
```

This also returns:

-   connected edges
-   neighboring nodes

## Search Graph

``` http
GET /knowledge-graph/search?query=Pump
```

## Rebuild Graph

``` http
POST /knowledge-graph/rebuild
```

The rebuild operation reprocesses uploaded documents and rebuilds the
graph.

------------------------------------------------------------------------

# AI Copilot

The Copilot is exposed through:

``` http
POST /api/copilot/ask
```

The backend does not send every question directly to one LLM.

Instead it uses an **AI Orchestrator**.

The orchestrator performs:

``` text
User Query
    ↓
Intent Classification
    ↓
Context Building
    ↓
Domain Engine
    ↓
RAG / Database / Knowledge Graph
    ↓
Response Formatting
```

------------------------------------------------------------------------

# Intent Classification

The Copilot can route requests into categories such as:

``` text
maintenance
compliance
report
dashboard
analytics
workflow
search_document
document_summary
recommendation
general_copilot
```

Example:

``` text
"What is the maintenance risk of Pump P101?"
                    ↓
                maintenance
                    ↓
            Maintenance Engine
```

Another example:

``` text
"Summarize the maintenance manual."
                    ↓
             document_summary
                    ↓
                  RAG
```

------------------------------------------------------------------------

# AI Orchestrator

The main orchestrator is:

``` text
server/services/ai/orchestrator.js
```

It is designed as the single routing layer for AI-powered requests.

The orchestrator can:

-   classify intent
-   build context
-   call domain-specific engines
-   call RAG
-   attach recommendations
-   attach sources
-   provide confidence
-   create next-step suggestions
-   record conversation turns

This architecture prevents each feature from independently implementing
retrieval and LLM logic.

------------------------------------------------------------------------

# Maintenance Intelligence

The Maintenance module reads equipment-related nodes from the knowledge
graph.

Relevant node types include:

``` text
Equipment
Pump
Valve
Sensor
Instrument
Component
```

It provides:

``` text
Equipment Health
Risk
Failure Probability
Recommended Actions
Recent Incidents
Predictive Maintenance
Equipment Relationships
```

Example:

``` text
Pump P101
Health: 78%
Failure Probability: 22%
Risk: Low/Medium/High
Recommendation: Schedule inspection
```

------------------------------------------------------------------------

# Compliance Intelligence

Compliance information is derived from knowledge graph data and
application data.

The system classifies items using health/risk-related properties.

Example conceptual flow:

``` text
Health >= 90
    → Valid

80 <= Health < 90
    → Expiring

Health < 80
    → Expired
```

The Compliance page includes:

-   Compliance score
-   Valid items
-   Expiring items
-   Expired items
-   Risk information
-   Audit timeline

------------------------------------------------------------------------

# Compliance Reports

The backend exposes:

``` http
POST /api/compliance/report
```

The current implementation generates a CSV file.

The report contains:

``` text
Report title
Generation timestamp
Compliance metrics
Compliance items
Status
Expiry
Risk
```

CSV was selected because it works without introducing an additional
PDF-generation dependency into the current backend.

------------------------------------------------------------------------

# Analytics

The Analytics system combines MongoDB data and knowledge graph
information.

Examples of metrics:

``` text
Knowledge Nodes
Relationships
Healthy Assets
Departments
Document Statistics
Knowledge Growth
Department Activity
Knowledge Health
AI Usage
```

Knowledge graph metrics are obtained directly from the AI Engine.

------------------------------------------------------------------------

# Dashboard

The dashboard combines:

-   MongoDB metrics
-   Activity logs
-   Recent documents
-   Knowledge graph statistics
-   Compliance information
-   Maintenance information
-   Notifications
-   AI-related insights

The dashboard endpoint is:

``` http
GET /api/dashboard/summary
```

The endpoint intentionally aggregates multiple data sources into one
response to reduce frontend network calls.

------------------------------------------------------------------------

# Authentication and Authorization

The application uses JWT-based authentication.

## User Registration

``` http
POST /api/auth/register
```

Required fields:

``` json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```

Passwords are hashed using:

``` text
bcryptjs
```

before being stored.

------------------------------------------------------------------------

# User Roles

The user model supports:

``` text
maint
plant
safety
compliance
quality
admin
```

Each user can also be associated with a plant.

Example:

``` json
{
  "name": "Engineer",
  "email": "engineer@example.com",
  "role": "maint",
  "plant": "Plant A"
}
```

------------------------------------------------------------------------

# Database Design

MongoDB is used for application-level persistence.

Important models include:

``` text
User
Document
ActivityLog
ComplianceItem
Config
Conversation
DepartmentActivity
Equipment
GraphEdge
GraphNode
Incident
KnowledgeGrowth
KnowledgeHealth
Metric
RecommendedAction
SuggestedQuery
WorkflowTask
```

The application database primarily manages:

-   users
-   documents
-   application metadata
-   activity
-   operational records
-   dashboard information
-   conversations
-   configuration

The AI Engine separately manages:

-   vector embeddings in ChromaDB
-   knowledge graph data

This separation keeps application persistence and AI retrieval
infrastructure loosely coupled.

------------------------------------------------------------------------

# API Reference

## Backend APIs

### Health

``` http
GET /api/health
```

### Authentication

``` http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/session
GET  /api/auth/me
```

### Documents

``` http
POST   /api/documents/upload
GET    /api/documents
GET    /api/documents/categories
GET    /api/documents/:id
GET    /api/documents/:id/related
GET    /api/documents/:id/summary
POST   /api/documents/:id/reprocess
DELETE /api/documents/:id
```

### Copilot

``` http
GET  /api/copilot/suggested-queries
GET  /api/copilot/welcome-message
POST /api/copilot/ask
```

### Dashboard

``` http
GET /api/dashboard/summary
```

### Analytics

The Analytics router exposes endpoints for:

``` text
knowledge growth
department activity
knowledge health
metrics
document statistics
AI usage
```

### Maintenance

The Maintenance router exposes endpoints for:

``` text
equipment health
recommended actions
recent incidents
maintenance timeline
predictive maintenance
equipment relationships
```

### Compliance

The Compliance router exposes endpoints for:

``` text
compliance items
compliance metrics
expiring items
audit timeline
compliance report
```

### Graph

The Graph router exposes application-level graph access that is backed
by the AI Engine.

### Admin

The Admin router provides administrative functionality such as:

``` text
users
activity
knowledge monitoring
user management
```

------------------------------------------------------------------------

# AI Engine APIs

## Health

``` http
GET /
GET /health
```

## Supported Files

``` http
GET /supported-files
```

## Document Processing

``` http
POST /process-document
```

## Existing Document Processing

``` http
POST /process-existing/{filename}
```

## Documents

``` http
GET /documents
DELETE /delete-file/{filename}
```

## Semantic Search

``` http
POST /search
```

## RAG

``` http
POST /rag/ask
```

Request:

``` json
{
  "query": "What is the maintenance procedure for Pump P101?"
}
```

## Knowledge Graph

``` http
GET  /knowledge-graph/nodes
GET  /knowledge-graph/edges
GET  /knowledge-graph/stats
GET  /knowledge-graph/node/{node_id}
GET  /knowledge-graph/search?query=Pump
POST /knowledge-graph/rebuild
```

------------------------------------------------------------------------

# Environment Variables

Create a `.env` file in the backend and AI Engine environments as
appropriate.

## Node.js Backend

``` env
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/indusbrain

JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

AI_ENGINE_URL=http://localhost:8000
AI_REQUEST_TIMEOUT_MS=60000
```

## AI Engine

``` env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

### Important

Do not commit real API keys or JWT secrets to GitHub.

Add `.env` to `.gitignore`.

------------------------------------------------------------------------

# Installation

## Prerequisites

Install:

``` text
Node.js
npm
Python 3.12
MongoDB
Git
```

Python 3.12 is recommended for this project because some AI/ML
dependencies may not yet provide compatible wheels for newer Python
versions.

------------------------------------------------------------------------

# Clone the Repository

``` bash
git clone <your-repository-url>
cd IndusBrain-main
```

------------------------------------------------------------------------

# Install Frontend Dependencies

``` bash
cd Client
npm install
```

------------------------------------------------------------------------

# Install Backend Dependencies

Open another terminal:

``` bash
cd server
npm install
```

------------------------------------------------------------------------

# Install Python Dependencies

From the project root:

``` bash
python -m venv .venv
```

Activate on Windows:

``` powershell
.venv\Scripts\activate
```

Activate on macOS/Linux:

``` bash
source .venv/bin/activate
```

Then:

``` bash
pip install -r requirements.txt
```

------------------------------------------------------------------------

# Configure MongoDB

Start MongoDB locally or use a MongoDB Atlas connection string.

Example:

``` env
MONGO_URI=mongodb://localhost:27017/indusbrain
```

------------------------------------------------------------------------

# Configure API Keys

Add your LLM credentials to `.env`.

At minimum, the active Groq-based RAG/knowledge extraction pipeline
requires:

``` env
GROQ_API_KEY=...
```

If Gemini functionality is enabled in a future/custom flow:

``` env
GEMINI_API_KEY=...
```

------------------------------------------------------------------------

# Running the Project

Three processes need to run during local development.

## Terminal 1 --- MongoDB

Start MongoDB using your local installation or MongoDB service.

------------------------------------------------------------------------

## Terminal 2 --- AI Engine

From the project root:

``` bash
python -m uvicorn ai_engine.app:app --reload --port 8000
```

Expected health endpoint:

``` text
http://localhost:8000/health
```

------------------------------------------------------------------------

## Terminal 3 --- Express Backend

``` bash
cd server
npm run dev
```

Backend:

``` text
http://localhost:3000
```

Health:

``` text
http://localhost:3000/api/health
```

------------------------------------------------------------------------

## Terminal 4 --- React Frontend

``` bash
cd Client
npm run dev
```

Vite normally starts at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# Production Build

Build the frontend:

``` bash
cd Client
npm run build
```

Preview the production frontend:

``` bash
npm run preview
```

Start the backend:

``` bash
cd server
npm start
```

Run FastAPI with a production-oriented ASGI setup, for example:

``` bash
python -m uvicorn ai_engine.app:app --host 0.0.0.0 --port 8000
```

Production deployments should use proper process management, secrets
management, HTTPS and restricted CORS origins.

------------------------------------------------------------------------

# Testing the System

## 1. Check AI Engine

Open:

``` text
http://localhost:8000/health
```

Expected:

``` json
{
  "status": "healthy"
}
```

------------------------------------------------------------------------

## 2. Check Backend

Open:

``` text
http://localhost:3000/api/health
```

The response reports both:

``` text
server health
AI Engine reachability
```

------------------------------------------------------------------------

## 3. Upload a Document

From the UI:

``` text
Documents
   ↓
Upload
   ↓
Select PDF/DOCX/XLSX/Image
   ↓
Upload
```

The document initially enters a processing state.

------------------------------------------------------------------------

## 4. Verify Vector Indexing

After processing, semantic search should return relevant chunks.

Example:

``` http
POST http://localhost:8000/search
```

Body:

``` json
{
  "query": "maintenance procedure",
  "k": 5
}
```

------------------------------------------------------------------------

## 5. Verify RAG

Example:

``` http
POST http://localhost:8000/rag/ask
```

Body:

``` json
{
  "query": "What is the maintenance procedure?"
}
```

------------------------------------------------------------------------

## 6. Verify Knowledge Graph

Open:

``` text
GET /knowledge-graph/nodes
```

and:

``` text
GET /knowledge-graph/edges
```

Then open the Graph Explorer in the frontend.

------------------------------------------------------------------------

# Security

The backend includes several security mechanisms.

## Helmet

HTTP security headers are enabled using:

``` text
helmet
```

## CORS

Allowed frontend origins are controlled by:

``` env
CLIENT_URL
```

## Rate Limiting

The API uses a general rate limiter.

Authentication routes have a stricter limit to reduce brute-force
attacks.

## Password Hashing

Passwords are hashed with:

``` text
bcryptjs
```

## JWT Authentication

Protected endpoints use the authentication middleware.

## Input Validation

The project uses:

``` text
express-validator
```

for request validation.

## File Validation

The AI Engine validates supported file extensions before processing.

------------------------------------------------------------------------

# Error Handling

The backend contains centralized error middleware:

``` text
server/middleware/errorMiddleware.js
```

Async controllers use:

``` text
server/utils/asyncHandler.js
```

AI Engine errors are converted into appropriate backend errors by:

``` text
server/services/aiService.js
```

For example:

``` text
AI Engine unavailable
        ↓
Express catches connection error
        ↓
Returns 502
        ↓
Frontend receives controlled error
```

------------------------------------------------------------------------

# Document Failure and Reprocessing

Document records are created before AI processing.

This is important because if the AI Engine fails:

``` text
Upload
 ↓
Document created
 ↓
AI processing fails
 ↓
status = failed
 ↓
original file remains available
 ↓
user can reprocess
```

The retry endpoint is:

``` http
POST /api/documents/:id/reprocess
```

This is safer than deleting the document record when processing fails.

------------------------------------------------------------------------

# Current Implementation Notes

This section documents important implementation details so the README
accurately reflects the current codebase.

## 1. AI processing is asynchronous

The FastAPI `/process-document` endpoint schedules document processing
as a background task.

The upload request can therefore return before:

-   embeddings finish
-   the graph finishes
-   all AI extraction completes

------------------------------------------------------------------------

## 2. ChromaDB is the vector store

The project does not use MongoDB for semantic vector retrieval.

MongoDB handles application data, while ChromaDB handles document
embeddings.

------------------------------------------------------------------------

## 3. Knowledge graph persistence is file-based

The graph is currently stored in:

``` text
data/knowledge_graph.json
```

A production system could replace this with a dedicated graph database
such as Neo4j, Amazon Neptune or another graph storage layer.

------------------------------------------------------------------------

## 4. Groq is the active RAG LLM

The current RAG pipeline directly creates:

``` python
GroqLLM()
```

Therefore Groq is the active generator for the current RAG
implementation.

Gemini support exists as an adapter but is not the active RAG generator
in the current code.

------------------------------------------------------------------------

## 5. Industrial extraction exists as a processing layer

During document processing, the `IndustrialIntelligenceService` invokes
extractors for:

``` text
Equipment
Incidents
Recommendations
Compliance
Analytics
```

The current background-processing path focuses on graph creation and
vector indexing. If these structured extraction results need to become
durable first-class MongoDB records, that persistence layer should be
added explicitly.

------------------------------------------------------------------------

## 6. Some maintenance values have fallback/demo behavior

The maintenance controller can fall back to generated health values when
graph nodes do not contain health information.

Therefore, those values should not be interpreted as real sensor
telemetry unless the system is connected to an actual industrial data
source.

------------------------------------------------------------------------

## 7. Compliance report format

The current compliance report is CSV rather than PDF.

This makes it easy to open in:

``` text
Microsoft Excel
Google Sheets
LibreOffice
```

------------------------------------------------------------------------

# Troubleshooting

## `python` command not found

Install Python and ensure it is available on PATH.

Check:

``` bash
python --version
```

Recommended:

``` text
Python 3.12.x
```

------------------------------------------------------------------------

## `uvicorn` not found

Use:

``` bash
python -m uvicorn ai_engine.app:app --reload --port 8000
```

instead of:

``` bash
uvicorn ...
```

------------------------------------------------------------------------

## `python-multipart` error

FastAPI file uploads require `python-multipart`.

Install:

``` bash
pip install python-multipart
```

------------------------------------------------------------------------

## AI Engine cannot connect to Groq

Check:

``` env
GROQ_API_KEY=...
```

and:

``` env
GROQ_MODEL=...
```

Also verify that the selected model is available to the configured Groq
account.

------------------------------------------------------------------------

## Backend cannot reach AI Engine

Check:

``` env
AI_ENGINE_URL=http://localhost:8000
```

Then verify:

``` text
http://localhost:8000/health
```

------------------------------------------------------------------------

## MongoDB connection error

Verify:

``` env
MONGO_URI=...
```

and make sure MongoDB is running.

------------------------------------------------------------------------

## Frontend cannot call backend

Verify:

``` env
CLIENT_URL=http://localhost:5173
```

and that Express is running on:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## Document processing fails

Check:

1.  File extension is supported.
2.  AI Engine is running.
3.  Required Python packages are installed.
4.  Groq credentials are valid.
5.  The uploaded file is readable.
6.  AI Engine logs for extraction/LLM errors.

------------------------------------------------------------------------

# Future Improvements

The current architecture provides a strong foundation for a production
industrial intelligence platform.

Possible improvements include:

## 1. Real-time Industrial Data

Integrate:

``` text
IoT sensors
SCADA
PLC
MES
ERP
EAM
CMMS
```

This would allow the system to combine document knowledge with live
operational data.

------------------------------------------------------------------------

## 2. Predictive Maintenance Models

Replace rule/fallback-based predictions with actual ML models using:

``` text
sensor history
failure history
temperature
pressure
vibration
maintenance records
equipment age
operating conditions
```

------------------------------------------------------------------------

## 3. Production Graph Database

Move from:

``` text
knowledge_graph.json
```

to:

``` text
Neo4j
Amazon Neptune
other graph database
```

This would improve:

-   scale
-   concurrent access
-   graph querying
-   relationship traversal
-   persistence

------------------------------------------------------------------------

## 4. Persistent Structured AI Extraction

Persist AI-extracted:

``` text
equipment
incidents
recommendations
compliance
analytics
```

directly into MongoDB or another structured data store.

------------------------------------------------------------------------

## 5. Fine-Grained Authorization

Add permission policies based on:

``` text
role
plant
department
document sensitivity
```

For example:

``` text
Plant A Maintenance Engineer
        ↓
Can access Plant A maintenance documents
        ↓
Cannot access Plant B restricted documents
```

------------------------------------------------------------------------

## 6. Streaming Copilot Responses

The frontend already contains components for streaming-style responses.

A production implementation could use:

``` text
Server-Sent Events
or
WebSockets
```

to stream LLM output token-by-token.

------------------------------------------------------------------------

## 7. Better Observability

Add:

``` text
OpenTelemetry
Prometheus
Grafana
centralized logs
LLM tracing
latency metrics
token usage
retrieval metrics
```

------------------------------------------------------------------------

## 8. Evaluation Framework

Measure:

``` text
Retrieval Precision
Retrieval Recall
Answer Faithfulness
Answer Relevance
Graph Extraction Accuracy
Latency
LLM Cost
```

This would make the AI system measurable rather than relying only on
subjective quality.

------------------------------------------------------------------------

# Project Highlights for Interviews

If explaining IndusBrain in an interview, focus on the architecture
rather than simply saying "it is an AI chatbot."

A strong explanation is:

> **IndusBrain is an industrial intelligence platform that converts
> unstructured engineering documents into a searchable vector knowledge
> base and a structured knowledge graph. I separated the application
> layer from the AI layer using an Express backend and FastAPI AI
> microservice. Documents are extracted, cleaned, chunked and embedded
> into ChromaDB, while an LLM extracts entities and relationships into a
> knowledge graph. For question answering, I use hybrid RAG: vector
> retrieval provides relevant document evidence and graph retrieval
> provides entity relationships before the LLM generates the final
> response. On top of this foundation, the platform provides an AI
> Copilot, maintenance intelligence, compliance monitoring, analytics
> and graph exploration.**

------------------------------------------------------------------------

# Why Hybrid RAG?

A good interview question is:

> Why did you use both vector search and a knowledge graph?

Answer:

``` text
Vector Search
→ Good for finding relevant passages.

Knowledge Graph
→ Good for understanding explicit relationships.

LLM
→ Good for reasoning over the combined context.

Therefore:

Vector Retrieval
        +
Knowledge Graph
        +
LLM
        =
Hybrid RAG
```

Example:

``` text
Question:
"What equipment is connected to Pump P101?"

Vector search:
Finds documents mentioning Pump P101.

Knowledge graph:
Finds explicit connected_to relationships.

LLM:
Combines both sources into a natural-language response.
```

------------------------------------------------------------------------

# Why Separate Node.js and Python?

Another interview question:

> Why did you use two backend technologies?

Answer:

``` text
Node.js / Express
→ Authentication
→ API orchestration
→ MongoDB
→ Business logic
→ Frontend integration

Python / FastAPI
→ Document processing
→ Embeddings
→ RAG
→ Knowledge graph
→ ML/AI libraries
```

Python has a stronger ecosystem for:

-   NLP
-   embeddings
-   document processing
-   machine learning
-   AI experimentation

while Node.js is convenient for:

-   REST APIs
-   application logic
-   frontend integration
-   authentication
-   MongoDB

The separation also allows the AI service to evolve independently.

------------------------------------------------------------------------

# Why ChromaDB?

ChromaDB is used because the project needs vector similarity search.

The workflow is:

``` text
Document
 ↓
Chunk
 ↓
Embedding
 ↓
ChromaDB

User Query
 ↓
Embedding
 ↓
Similarity Search
 ↓
Relevant Chunks
```

This is much more suitable for semantic retrieval than a traditional
keyword-only database query.

------------------------------------------------------------------------

# Why a Knowledge Graph?

Industrial knowledge is highly relational.

For example:

``` text
Equipment
 ↓
Component
 ↓
Sensor
 ↓
Measurement
 ↓
Process
 ↓
Location
```

A graph naturally represents these connections.

It also allows the system to answer relationship-oriented questions that
are difficult to solve with plain document retrieval.

------------------------------------------------------------------------

# Why an AI Orchestrator?

Without an orchestrator, every feature could independently implement:

``` text
intent detection
retrieval
LLM calls
context building
response formatting
```

That would create duplicated logic.

Instead:

``` text
                User Query
                    │
                    ▼
             AI Orchestrator
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
 Maintenance    Compliance    Analytics
       │            │            │
       └────────────┼────────────┘
                    ▼
                   RAG
                    │
                    ▼
                   LLM
```

This creates a centralized AI routing layer.

------------------------------------------------------------------------

# Performance Considerations

The architecture reduces unnecessary work by:

-   Processing uploaded documents in FastAPI background tasks
-   Retrieving only top-K relevant chunks
-   Keeping vector search separate from MongoDB queries
-   Aggregating dashboard data into a single endpoint
-   Reusing a loaded embedding model
-   Reusing initialized AI services
-   Keeping application and AI services independently scalable

------------------------------------------------------------------------

# Scalability Strategy

A future production architecture could look like:

``` text
                 Load Balancer
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
     React / CDN              Express API
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
                 MongoDB      AI Engine      Redis
                                  │
                         ┌────────┴────────┐
                         ▼                 ▼
                      ChromaDB        Graph DB
                         │
                         ▼
                         LLM
```

For large-scale processing, document ingestion could also move from
in-process background tasks to a queue-based architecture such as:

``` text
Upload
  ↓
Message Queue
  ↓
Worker
  ↓
AI Processing
```

------------------------------------------------------------------------

# Git Workflow

Typical development flow:

``` bash
git status

git add .

git commit -m "Add IndusBrain feature"

git pull --rebase origin main

git push origin main
```

If the remote repository contains commits that are not present locally,
synchronize before pushing.

------------------------------------------------------------------------

# License

Add the project's chosen license here before publishing the repository
publicly.

For example:

``` text
MIT License
```

or another license appropriate for the project.

------------------------------------------------------------------------

# Author

**IndusBrain --- Industrial Intelligence Platform**

Built as an AI-powered system for converting fragmented industrial
knowledge into actionable intelligence.

------------------------------------------------------------------------

# Final Architecture Summary

``` text
                         INDUSBRAIN
                             │
              ┌──────────────┴──────────────┐
              │                             │
         React Frontend                Express API
              │                             │
              │                     ┌───────┴────────┐
              │                     │                │
              │                  MongoDB        AI Engine
              │                                      │
              │                    ┌─────────────────┼─────────────────┐
              │                    │                 │                 │
              │               Documents         Embeddings       Knowledge Graph
              │                    │                 │                 │
              │                    │              ChromaDB             │
              │                    │                 │                 │
              │                    └─────────────────┼─────────────────┘
              │                                      │
              │                                   Hybrid RAG
              │                                      │
              └──────────────────────────────────────┤
                                                     ▼
                                                    LLM
                                                     │
                                                     ▼
                                              AI Intelligence
                                                     │
                              ┌──────────────────────┼──────────────────────┐
                              │                      │                      │
                           Copilot               Maintenance           Compliance
                              │                      │                      │
                              └──────────────────────┼──────────────────────┘
                                                     ▼
                                                  Analytics
```

**IndusBrain's core principle:**

> **Documents provide the evidence, vectors provide semantic retrieval,
> the knowledge graph provides relationships, and the LLM turns that
> combined knowledge into actionable intelligence.**
