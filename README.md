# RAG Document Assistant

An internal AI chatbot that lets analysts query a corpus of documents in plain English and get sourced, citable answers — powered by hybrid retrieval (semantic + keyword) and grounded LLM responses.

## The client

**Driftwood Capital** — fictional independent investment research firm. Their analysts spend half their week reading 10-Ks and 10-Qs before they can produce any original analysis. This assistant eats that intake work so they can skip straight to insight.

Full brief: [docs/client-brief.md](docs/client-brief.md)

## Stack

| Layer              | Choice                                               |
| ------------------ | ---------------------------------------------------- |
| Backend            | Python + FastAPI                                     |
| Frontend           | Vite + React SPA + TypeScript                        |
| Database           | Supabase Postgres (users, chats, documents, chunks)  |
| Migrations         | SQLAlchemy models + Alembic                          |
| Retrieval          | Supabase `pgvector` + Postgres full-text search (RRF fusion) |
| Auth               | Supabase Auth (email only)                           |
| Hosting            | Railway                                              |
| LLM + embeddings   | OpenAI                                               |

## Repo layout

```text
rag-document-assistant/
├── README.md           # this file
├── docs/
│   ├── architecture.md # system design and data model
│   └── client-brief.md # the client one-pager
├── data/               # local corpus + download scripts
├── backend/            # FastAPI service
└── frontend/           # React SPA (Vite)
```

## Prerequisites

| Tool | Version | Used for | Install |
| ---- | ------- | -------- | ------- |
| [Python](https://www.python.org/downloads/) | 3.12+ | Backend runtime | python.org |
| [uv](https://docs.astral.sh/uv/getting-started/installation/) | latest | Backend deps | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| [Node.js](https://nodejs.org/) | 20+ (LTS) | Frontend toolchain | nodejs.org |
| [pnpm](https://pnpm.io/installation) | latest | Frontend package manager | `corepack enable && corepack prepare pnpm@latest --activate` |

You also need a Supabase project and an OpenAI API key (wired in later commits).

## Running locally

```bash
# Backend
cd backend
cp .env.example .env   # fill in your keys
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload   # http://localhost:8000

# Frontend (new terminal)
cd frontend
cp .env.example .env   # fill in your keys
pnpm install
pnpm dev               # http://localhost:5173
```

## Sample SEC data

```bash
# Download latest 10-K filings for AAPL, MSFT, NVDA, AMZN, GOOGL
uv run data/download.py

# Convert HTML filings to Markdown
uv run data/convert_to_markdown.py

# Load into Supabase and embed
cd backend
uv sync --extra ingest
uv run python -m ingest.load_source_documents
uv run python -m ingest.chunk_and_embed --all
```
