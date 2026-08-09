IndusBrain

The AI Brain for Industrial Operations

IndusBrain is an AI-powered industrial intelligence platform designed toturn scattered engineering and operational documents into a searchable,connected knowledge system.

It combines:

Document ingestion and processing

Semantic search

Hybrid Retrieval-Augmented Generation (RAG)

An AI industrial knowledge graph

AI-powered Copilot

Maintenance intelligence

Compliance monitoring

Analytics and knowledge-health dashboards

Role-based access

Document management

Administrative monitoring

The system is implemented as a three-part architecture:

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

Table of Contents

Problem Statement

Solution

Core Features

How IndusBrain Works

System Architecture

End-to-End Data Flow

Technology Stack

Project Structure

Frontend

Backend

AI Engine

Document Processing Pipeline

Semantic Search

Hybrid RAG Pipeline

Knowledge Graph

AI Copilot

Maintenance Intelligence

Compliance Intelligence

Analytics

Authentication andAuthorization

Database Design

API Reference

Environment Variables

Installation

Running the Project

Testing the System

Security

Troubleshooting

Current Implementation Notes

Future Improvements

Project Highlights forInterviews

Problem Statement

Industrial organizations generate large amounts of technicalinformation:

SOPs

Maintenance manuals

Equipment reports

Compliance documents

Engineering reports

Incident reports

Inspection records

Spreadsheets

Images and scanned documents

The information is often fragmented across different files and systems.

This creates several problems:

Engineers spend time manually searching documents.

Important relationships between equipment, components, processes anddepartments are difficult to discover.

Existing document search is usually keyword-based rather thansemantic.

Operational knowledge is difficult to reuse.

Maintenance teams need to connect equipment information withhistorical knowledge.

Compliance information can be difficult to track.

Organizational knowledge remains locked inside documents.

IndusBrain addresses this by converting unstructured industrialinformation into a combination of:

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

Solution

IndusBrain acts as an enterprise intelligence layer over industrialknowledge.

Instead of treating every document as an isolated file, it extracts:

entities

relationships

equipment

components

processes

parameters

locations

departments

technical information

The platform then makes this information available through:

document search

AI question answering

graph exploration

maintenance views

compliance views

analytics

recommendations

The central idea is:

Turn fragmented industrial documents into connected, queryableoperational knowledge.

Core Features

1. Document Management

Users can:

Upload documents

View uploaded documents

Search documents

Filter documents

View document details

Generate document summaries

Find related documents

Delete documents

Reprocess failed documents

Supported formats:

PDF
DOCX
XLSX
PNG
JPG
JPEG

2. Semantic Search

Instead of matching only exact keywords, IndusBrain converts the queryinto an embedding and searches the vector database for semanticallysimilar content.

Example:

User:
"What causes overheating in Pump P101?"

Search:
→ Query embedding
→ ChromaDB
→ Most relevant document chunks

This allows users to find relevant information even when the exact wordsin the query do not appear in the document.

3. AI Copilot

The Copilot provides a conversational interface over the industrialknowledge base.

Example questions:

What is the maintenance procedure for Pump P101?

Which equipment is connected to Valve V22?

Summarize the uploaded maintenance manual.

What are the recent compliance risks?

Show me equipment with low health.

Which documents mention pressure-related failures?

The backend classifies the request and routes it to the appropriateintelligence engine.

4. Knowledge Graph

IndusBrain extracts entities and relationships from documents andcreates a graph.

Example:

Pump P101
    │
    ├── connected_to ──► Valve V22
    │
    ├── located_in ────► Plant A
    │
    ├── part_of ───────► Cooling System
    │
    └── powered_by ───► Motor M101

The graph provides a structured representation of industrial knowledge.

5. Maintenance Intelligence

The Maintenance section provides:

Equipment health

Equipment risk

Recommended actions

Recent incidents

Predictive maintenance views

Equipment relationships

The system can identify equipment-related graph nodes and generatemaintenance-oriented recommendations.

6. Compliance Intelligence

The Compliance section provides:

Compliance status

Risk levels

Expiring items

Expired items

Compliance metrics

Audit timeline

Compliance report generation

The current implementation generates a CSV compliance report.

7. Analytics

The Analytics section provides information such as:

Knowledge graph size

Number of relationships

Healthy assets

Department activity

Knowledge growth

Knowledge health

AI usage

Document statistics

8. Admin Dashboard

Administrators can work with:

Users

User status

Activity logs

Knowledge monitoring

Invitations

User editing

How IndusBrain Works

A typical workflow is:

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

System Architecture

High-Level Architecture

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

End-to-End Data Flow

Document Upload

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

The AI processing pipeline then performs:

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

At the same time:

Chunks
 ↓
Industrial Intelligence Extraction
 ↓
Equipment / Incidents / Recommendations / Compliance / Analytics

and:

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

Technology Stack

Frontend

Technology     Purpose

React 19       UI frameworkVite           Frontend development/build toolTailwind CSS   StylingAxios          HTTP communicationRecharts       Analytics chartsD3 Force       Knowledge graph visualizationLucide React   Icons

Backend

Technology           Purpose

Node.js              RuntimeExpress 5            REST APIMongoDB              Application databaseMongoose             MongoDB ODMJWT                  Authenticationbcryptjs             Password hashingMulter               File uploadsAxios                AI Engine communicationHelmet               HTTP security headersCORS                 Cross-origin accessMorgan               HTTP loggingexpress-rate-limit   Rate limitingexpress-validator    Request validation

AI Engine

Technology              Purpose

Python                  AI runtimeFastAPI                 AI service APISentence Transformers   Text embeddingsall-MiniLM-L6-v2        Embedding modelChromaDB                Vector databaseGroq                    LLM inferenceLlama model             RAG/knowledge extraction generationGoogle GenAI            Gemini adapterPyMuPDF                 PDF extractionpython-docx             DOCX extractionopenpyxl                XLSX extractionOpenCV/Pillow           Image processingOCR                     Image/scanned-document text extraction

Project Structure

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

Frontend

The frontend is a React single-page application.

The main application is controlled by Client/src/App.jsx.

Available application pages include:

Dashboard
Copilot
Knowledge Graph Explorer
Documents
Maintenance
Compliance
Analytics
Admin
Settings

Frontend Services

API communication is separated into service modules:

authService.js
documentService.js
copilotService.js
graphService.js
maintenanceService.js
complianceService.js
analyticsService.js
dashboardService.js
adminService.js

This keeps API logic separate from UI components.

Backend

The Express backend is the central application layer.

It handles:

Authentication

Authorization

User management

Document metadata

File uploads

API validation

MongoDB persistence

AI Engine communication

Copilot orchestration

Analytics

Compliance

Maintenance

Dashboard data

Knowledge graph access

The server starts from:

server/server.js

Default port:

3000

Backend Route Structure

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

AI Engine

The AI Engine is implemented as a separate FastAPI microservice.

Main entry point:

ai_engine/app.py

Default development command:

python -m uvicorn ai_engine.app:app --reload --port 8000

The AI Engine is intentionally separated from the Node.js application.

This provides a clean architecture:

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

Document Processing Pipeline

The document pipeline is implemented around:

ai_engine/pipelines/document_pipeline.py

The system supports multiple readers.

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

Supported Extensions

[
    ".pdf",
    ".docx",
    ".xlsx",
    ".png",
    ".jpg",
    ".jpeg"
]

Chunking

Documents are divided into smaller pieces before embedding.

Current configuration:

Chunk size: 500
Chunk overlap: 100

The overlap helps preserve context between adjacent chunks.

Example:

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

The exact behavior is controlled by the project's chunkerimplementation.

Embeddings

IndusBrain uses:

sentence-transformers/all-MiniLM-L6-v2

The purpose of embeddings is to convert text into numerical vectors.

For example:

"Pump P101 is overheating"
              ↓
       Embedding Model
              ↓
       [0.12, -0.44, ...]

Queries are embedded in the same vector space.

This allows semantic similarity search.

Vector Database

IndusBrain uses ChromaDB.

Configuration:

Collection:
industrial_documents

Vector DB path:
./vector_store

Each indexed chunk contains information such as:

ID
Text
Embedding
Metadata
Source document
Page information

The vector database is used by the retrieval layer.

Semantic Search

The FastAPI service exposes:

POST /search

Request:

{
  "query": "pump overheating",
  "k": 5
}

The AI Engine:

Query
 ↓
Embedding
 ↓
ChromaDB similarity search
 ↓
Top K chunks
 ↓
Formatted results

Example response shape:

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

Hybrid RAG Pipeline

The core question-answering system is implemented in:

ai_engine/rag/rag_pipeline.py

The pipeline combines vector retrieval + knowledge graph context + LLMgeneration.

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

This is more powerful than a simple vector-only RAG system because thegraph can provide explicit relationships between entities.

LLM Layer

The project contains two LLM adapters:

ai_engine/llm/groq_llm.py
ai_engine/llm/gemini_llm.py

Groq

The current RAG and knowledge extraction implementations use the Groqclient.

The default configured Groq model is:

llama-3.1-8b-instant

The model can be changed through:

GROQ_MODEL

Gemini

A Gemini adapter is also included:

GeminiLLM

with a default model of:

gemini-2.5-flash

However, the current RAG pipeline is wired to GroqLLM, so Gemini is anavailable adapter rather than the active RAG generator in the currentimplementation.

Knowledge Graph

The knowledge graph is one of the main differentiators of IndusBrain.

Why a Knowledge Graph?

Vector search answers:

"What text is similar to my question?"

A knowledge graph answers:

"What entities exist, and how are they connected?"

For industrial systems, relationships are extremely important.

Example:

Pump P101
    │
    ├── connected_to ── Valve V22
    │
    ├── located_in ──── Plant A
    │
    ├── part_of ─────── Cooling System
    │
    └── powered_by ──── Motor M101

Knowledge Graph Extraction

The graph extraction pipeline uses an LLM to extract:

Entity Types

The extractor supports types such as:

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

Relationship Types

Supported relationship labels include:

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

The extractor is instructed not to invent entities or relationships.

Knowledge Graph Pipeline

The pipeline contains:

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

The graph is currently persisted to:

data/knowledge_graph.json

The FastAPI service exposes endpoints to access it.

Knowledge Graph API

Get Nodes

GET /knowledge-graph/nodes

Get Edges

GET /knowledge-graph/edges

Get Statistics

GET /knowledge-graph/stats

Get a Node

GET /knowledge-graph/node/{node_id}

This also returns:

connected edges

neighboring nodes

Search Graph

GET /knowledge-graph/search?query=Pump

Rebuild Graph

POST /knowledge-graph/rebuild

The rebuild operation reprocesses uploaded documents and rebuilds thegraph.

AI Copilot

The Copilot is exposed through:

POST /api/copilot/ask

The backend does not send every question directly to one LLM.

Instead it uses an AI Orchestrator.

The orchestrator performs:

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

Intent Classification

The Copilot can route requests into categories such as:

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

Example:

"What is the maintenance risk of Pump P101?"
                    ↓
                maintenance
                    ↓
            Maintenance Engine

Another example:

"Summarize the maintenance manual."
                    ↓
             document_summary
                    ↓
                  RAG

AI Orchestrator

The main orchestrator is:

server/services/ai/orchestrator.js

It is designed as the single routing layer for AI-powered requests.

The orchestrator can:

classify intent

build context

call domain-specific engines

call RAG

attach recommendations

attach sources

provide confidence

create next-step suggestions

record conversation turns

This architecture prevents each feature from independently implementingretrieval and LLM logic.

Maintenance Intelligence

The Maintenance module reads equipment-related nodes from the knowledgegraph.

Relevant node types include:

Equipment
Pump
Valve
Sensor
Instrument
Component

It provides:

Equipment Health
Risk
Failure Probability
Recommended Actions
Recent Incidents
Predictive Maintenance
Equipment Relationships

Example:

Pump P101
Health: 78%
Failure Probability: 22%
Risk: Low/Medium/High
Recommendation: Schedule inspection

Compliance Intelligence

Compliance information is derived from knowledge graph data andapplication data.

The system classifies items using health/risk-related properties.

Example conceptual flow:

Health >= 90
    → Valid

80 <= Health < 90
    → Expiring

Health < 80
    → Expired

The Compliance page includes:

Compliance score

Valid items

Expiring items

Expired items

Risk information

Audit timeline

Compliance Reports

The backend exposes:

POST /api/compliance/report

The current implementation generates a CSV file.

The report contains:

Report title
Generation timestamp
Compliance metrics
Compliance items
Status
Expiry
Risk

CSV was selected because it works without introducing an additionalPDF-generation dependency into the current backend.

Analytics

The Analytics system combines MongoDB data and knowledge graphinformation.

Examples of metrics:

Knowledge Nodes
Relationships
Healthy Assets
Departments
Document Statistics
Knowledge Growth
Department Activity
Knowledge Health
AI Usage

Knowledge graph metrics are obtained directly from the AI Engine.

Dashboard

The dashboard combines:

MongoDB metrics

Activity logs

Recent documents

Knowledge graph statistics

Compliance information

Maintenance information

Notifications

AI-related insights

The dashboard endpoint is:

GET /api/dashboard/summary

The endpoint intentionally aggregates multiple data sources into oneresponse to reduce frontend network calls.

Authentication and Authorization

The application uses JWT-based authentication.

User Registration

POST /api/auth/register

Required fields:

{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}

Passwords are hashed using:

bcryptjs

before being stored.

User Roles

The user model supports:

maint
plant
safety
compliance
quality
admin

Each user can also be associated with a plant.

Example:

{
  "name": "Engineer",
  "email": "engineer@example.com",
  "role": "maint",
  "plant": "Plant A"
}

Database Design

MongoDB is used for application-level persistence.

Important models include:

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

The application database primarily manages:

users

documents

application metadata

activity

operational records

dashboard information

conversations

configuration

The AI Engine separately manages:

vector embeddings in ChromaDB

knowledge graph data

This separation keeps application persistence and AI retrievalinfrastructure loosely coupled.

API Reference

Backend APIs

Health

GET /api/health

Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/session
GET  /api/auth/me

Documents

POST   /api/documents/upload
GET    /api/documents
GET    /api/documents/categories
GET    /api/documents/:id
GET    /api/documents/:id/related
GET    /api/documents/:id/summary
POST   /api/documents/:id/reprocess
DELETE /api/documents/:id

Copilot

GET  /api/copilot/suggested-queries
GET  /api/copilot/welcome-message
POST /api/copilot/ask

Dashboard

GET /api/dashboard/summary

Analytics

The Analytics router exposes endpoints for:

knowledge growth
department activity
knowledge health
metrics
document statistics
AI usage

Maintenance

The Maintenance router exposes endpoints for:

equipment health
recommended actions
recent incidents
maintenance timeline
predictive maintenance
equipment relationships

Compliance

The Compliance router exposes endpoints for:

compliance items
compliance metrics
expiring items
audit timeline
compliance report

Graph

The Graph router exposes application-level graph access that is backedby the AI Engine.

Admin

The Admin router provides administrative functionality such as:

users
activity
knowledge monitoring
user management

AI Engine APIs

Health

GET /
GET /health

Supported Files

GET /supported-files

Document Processing

POST /process-document

Existing Document Processing

POST /process-existing/{filename}

Documents

GET /documents
DELETE /delete-file/{filename}

Semantic Search

POST /search

RAG

POST /rag/ask

Request:

{
  "query": "What is the maintenance procedure for Pump P101?"
}

Knowledge Graph

GET  /knowledge-graph/nodes
GET  /knowledge-graph/edges
GET  /knowledge-graph/stats
GET  /knowledge-graph/node/{node_id}
GET  /knowledge-graph/search?query=Pump
POST /knowledge-graph/rebuild

Environment Variables

Create a .env file in the backend and AI Engine environments asappropriate.

Node.js Backend

PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/indusbrain

JWT_SECRET=replace_with_a_strong_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

AI_ENGINE_URL=http://localhost:8000
AI_REQUEST_TIMEOUT_MS=60000

AI Engine

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash

Important

Do not commit real API keys or JWT secrets to GitHub.

Add .env to .gitignore.

Installation

Prerequisites

Install:

Node.js
npm
Python 3.12
MongoDB
Git

Python 3.12 is recommended for this project because some AI/MLdependencies may not yet provide compatible wheels for newer Pythonversions.

Clone the Repository

git clone <your-repository-url>
cd IndusBrain-main

Install Frontend Dependencies

cd Client
npm install

Install Backend Dependencies

Open another terminal:

cd server
npm install

Install Python Dependencies

From the project root:

python -m venv .venv

Activate on Windows:

.venv\Scripts\activate

Activate on macOS/Linux:

source .venv/bin/activate

Then:

pip install -r requirements.txt

Configure MongoDB

Start MongoDB locally or use a MongoDB Atlas connection string.

Example:

MONGO_URI=mongodb://localhost:27017/indusbrain

Configure API Keys

Add your LLM credentials to .env.

At minimum, the active Groq-based RAG/knowledge extraction pipelinerequires:

GROQ_API_KEY=...

If Gemini functionality is enabled in a future/custom flow:

GEMINI_API_KEY=...

Running the Project

Three processes need to run during local development.

Terminal 1 --- MongoDB

Start MongoDB using your local installation or MongoDB service.

Terminal 2 --- AI Engine

From the project root:

python -m uvicorn ai_engine.app:app --reload --port 8000

Expected health endpoint:

http://localhost:8000/health

Terminal 3 --- Express Backend

cd server
npm run dev

Backend:

http://localhost:3000

Health:

http://localhost:3000/api/health

Terminal 4 --- React Frontend

cd Client
npm run dev

Vite normally starts at:

http://localhost:5173

Production Build

Build the frontend:

cd Client
npm run build

Preview the production frontend:

npm run preview

Start the backend:

cd server
npm start

Run FastAPI with a production-oriented ASGI setup, for example:

python -m uvicorn ai_engine.app:app --host 0.0.0.0 --port 8000

Production deployments should use proper process management, secretsmanagement, HTTPS and restricted CORS origins.

Testing the System

1. Check AI Engine

Open:

http://localhost:8000/health

Expected:

{
  "status": "healthy"
}

2. Check Backend

Open:

http://localhost:3000/api/health

The response reports both:

server health
AI Engine reachability

3. Upload a Document

From the UI:

Documents
   ↓
Upload
   ↓
Select PDF/DOCX/XLSX/Image
   ↓
Upload

The document initially enters a processing state.

4. Verify Vector Indexing

After processing, semantic search should return relevant chunks.

Example:

POST http://localhost:8000/search

Body:

{
  "query": "maintenance procedure",
  "k": 5
}

5. Verify RAG

Example:

POST http://localhost:8000/rag/ask

Body:

{
  "query": "What is the maintenance procedure?"
}

6. Verify Knowledge Graph

Open:

GET /knowledge-graph/nodes

and:

GET /knowledge-graph/edges

Then open the Graph Explorer in the frontend.

Security

The backend includes several security mechanisms.

Helmet

HTTP security headers are enabled using:

helmet

CORS

Allowed frontend origins are controlled by:

CLIENT_URL

Rate Limiting

The API uses a general rate limiter.

Authentication routes have a stricter limit to reduce brute-forceattacks.

Password Hashing

Passwords are hashed with:

bcryptjs

JWT Authentication

Protected endpoints use the authentication middleware.

Input Validation

The project uses:

express-validator

for request validation.

File Validation

The AI Engine validates supported file extensions before processing.

Error Handling

The backend contains centralized error middleware:

server/middleware/errorMiddleware.js

Async controllers use:

server/utils/asyncHandler.js

AI Engine errors are converted into appropriate backend errors by:

server/services/aiService.js

For example:

AI Engine unavailable
        ↓
Express catches connection error
        ↓
Returns 502
        ↓
Frontend receives controlled error

Document Failure and Reprocessing

Document records are created before AI processing.

This is important because if the AI Engine fails:

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

The retry endpoint is:

POST /api/documents/:id/reprocess

This is safer than deleting the document record when processing fails.

Current Implementation Notes

This section documents important implementation details so the READMEaccurately reflects the current codebase.

1. AI processing is asynchronous

The FastAPI /process-document endpoint schedules document processingas a background task.

The upload request can therefore return before:

embeddings finish

the graph finishes

all AI extraction completes

2. ChromaDB is the vector store

The project does not use MongoDB for semantic vector retrieval.

MongoDB handles application data, while ChromaDB handles documentembeddings.

3. Knowledge graph persistence is file-based

The graph is currently stored in:

data/knowledge_graph.json

A production system could replace this with a dedicated graph databasesuch as Neo4j, Amazon Neptune or another graph storage layer.

4. Groq is the active RAG LLM

The current RAG pipeline directly creates:

GroqLLM()

Therefore Groq is the active generator for the current RAGimplementation.

Gemini support exists as an adapter but is not the active RAG generatorin the current code.

5. Industrial extraction exists as a processing layer

During document processing, the IndustrialIntelligenceService invokesextractors for:

Equipment
Incidents
Recommendations
Compliance
Analytics

The current background-processing path focuses on graph creation andvector indexing. If these structured extraction results need to becomedurable first-class MongoDB records, that persistence layer should beadded explicitly.

6. Some maintenance values have fallback/demo behavior

The maintenance controller can fall back to generated health values whengraph nodes do not contain health information.

Therefore, those values should not be interpreted as real sensortelemetry unless the system is connected to an actual industrial datasource.

7. Compliance report format

The current compliance report is CSV rather than PDF.

This makes it easy to open in:

Microsoft Excel
Google Sheets
LibreOffice

Troubleshooting

python command not found

Install Python and ensure it is available on PATH.

Check:

python --version

Recommended:

Python 3.12.x

uvicorn not found

Use:

python -m uvicorn ai_engine.app:app --reload --port 8000

instead of:

uvicorn ...

python-multipart error

FastAPI file uploads require python-multipart.

Install:

pip install python-multipart

AI Engine cannot connect to Groq

Check:

GROQ_API_KEY=...

and:

GROQ_MODEL=...

Also verify that the selected model is available to the configured Groqaccount.

Backend cannot reach AI Engine

Check:

AI_ENGINE_URL=http://localhost:8000

Then verify:

http://localhost:8000/health

MongoDB connection error

Verify:

MONGO_URI=...

and make sure MongoDB is running.

Frontend cannot call backend

Verify:

CLIENT_URL=http://localhost:5173

and that Express is running on:

http://localhost:3000

Document processing fails

Check:

File extension is supported.

AI Engine is running.

Required Python packages are installed.

Groq credentials are valid.

The uploaded file is readable.

AI Engine logs for extraction/LLM errors.

Future Improvements

The current architecture provides a strong foundation for a productionindustrial intelligence platform.

Possible improvements include:

1. Real-time Industrial Data

Integrate:

IoT sensors
SCADA
PLC
MES
ERP
EAM
CMMS

This would allow the system to combine document knowledge with liveoperational data.

2. Predictive Maintenance Models

Replace rule/fallback-based predictions with actual ML models using:

sensor history
failure history
temperature
pressure
vibration
maintenance records
equipment age
operating conditions

3. Production Graph Database

Move from:

knowledge_graph.json

to:

Neo4j
Amazon Neptune
other graph database

This would improve:

scale

concurrent access

graph querying

relationship traversal

persistence

4. Persistent Structured AI Extraction

Persist AI-extracted:

equipment
incidents
recommendations
compliance
analytics

directly into MongoDB or another structured data store.

5. Fine-Grained Authorization

Add permission policies based on:

role
plant
department
document sensitivity

For example:

Plant A Maintenance Engineer
        ↓
Can access Plant A maintenance documents
        ↓
Cannot access Plant B restricted documents

6. Streaming Copilot Responses

The frontend already contains components for streaming-style responses.

A production implementation could use:

Server-Sent Events
or
WebSockets

to stream LLM output token-by-token.

7. Better Observability

Add:

OpenTelemetry
Prometheus
Grafana
centralized logs
LLM tracing
latency metrics
token usage
retrieval metrics

8. Evaluation Framework

Measure:

Retrieval Precision
Retrieval Recall
Answer Faithfulness
Answer Relevance
Graph Extraction Accuracy
Latency
LLM Cost

This would make the AI system measurable rather than relying only onsubjective quality.

Project Highlights for Interviews

If explaining IndusBrain in an interview, focus on the architecturerather than simply saying "it is an AI chatbot."

A strong explanation is:

IndusBrain is an industrial intelligence platform that convertsunstructured engineering documents into a searchable vector knowledgebase and a structured knowledge graph. I separated the applicationlayer from the AI layer using an Express backend and FastAPI AImicroservice. Documents are extracted, cleaned, chunked and embeddedinto ChromaDB, while an LLM extracts entities and relationships into aknowledge graph. For question answering, I use hybrid RAG: vectorretrieval provides relevant document evidence and graph retrievalprovides entity relationships before the LLM generates the finalresponse. On top of this foundation, the platform provides an AICopilot, maintenance intelligence, compliance monitoring, analyticsand graph exploration.

Why Hybrid RAG?

A good interview question is:

Why did you use both vector search and a knowledge graph?

Answer:

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

Example:

Question:
"What equipment is connected to Pump P101?"

Vector search:
Finds documents mentioning Pump P101.

Knowledge graph:
Finds explicit connected_to relationships.

LLM:
Combines both sources into a natural-language response.

Why Separate Node.js and Python?

Another interview question:

Why did you use two backend technologies?

Answer:

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

Python has a stronger ecosystem for:

NLP

embeddings

document processing

machine learning

AI experimentation

while Node.js is convenient for:

REST APIs

application logic

frontend integration

authentication

MongoDB

The separation also allows the AI service to evolve independently.

Why ChromaDB?

ChromaDB is used because the project needs vector similarity search.

The workflow is:

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

This is much more suitable for semantic retrieval than a traditionalkeyword-only database query.

Why a Knowledge Graph?

Industrial knowledge is highly relational.

For example:

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

A graph naturally represents these connections.

It also allows the system to answer relationship-oriented questions thatare difficult to solve with plain document retrieval.

Why an AI Orchestrator?

Without an orchestrator, every feature could independently implement:

intent detection
retrieval
LLM calls
context building
response formatting

That would create duplicated logic.

Instead:

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

This creates a centralized AI routing layer.

Performance Considerations

The architecture reduces unnecessary work by:

Processing uploaded documents in FastAPI background tasks

Retrieving only top-K relevant chunks

Keeping vector search separate from MongoDB queries

Aggregating dashboard data into a single endpoint

Reusing a loaded embedding model

Reusing initialized AI services

Keeping application and AI services independently scalable

Scalability Strategy

A future production architecture could look like:

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

For large-scale processing, document ingestion could also move fromin-process background tasks to a queue-based architecture such as:

Upload
  ↓
Message Queue
  ↓
Worker
  ↓
AI Processing

Git Workflow

Typical development flow:

git status

git add .

git commit -m "Add IndusBrain feature"

git pull --rebase origin main

git push origin main

If the remote repository contains commits that are not present locally,synchronize before pushing.

License

Add the project's chosen license here before publishing the repositorypublicly.

For example:

MIT License

or another license appropriate for the project.

Author

IndusBrain --- Industrial Intelligence Platform

Built as an AI-powered system for converting fragmented industrialknowledge into actionable intelligence.

Final Architecture Summary

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

IndusBrain's core principle:

Documents provide the evidence, vectors provide semantic retrieval,the knowledge graph provides relationships, and the LLM turns thatcombined knowledge into actionable intelligence.
