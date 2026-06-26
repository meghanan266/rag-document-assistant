# Backend setup

The backend is a FastAPI service responsible for AI orchestration, retrieval, and data access. Python gives the strongest ecosystem for chunking, embeddings, hybrid retrieval, and LLM workflows. Keeping this logic behind a dedicated API keeps the frontend focused on UX while the backend owns grounding and citation validation.

## Prerequisites

- Python 3.12+
- [uv](https://docs.astral.sh/uv/) — fast Python package manager
- A Supabase project (see [Supabase setup](supabase-setup.md))
- An OpenAI API key

## Environment

Copy the example and fill in your values:

```bash
cd backend
cp .env.example .env
```

Required values:

```text
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
OPENAI_API_KEY=sk-your-openai-api-key
```

## Run

```bash
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

Visit `http://localhost:8000/health` → `{"status":"ok"}`.

## Database migrations

Alembic owns all schema changes. After editing SQLAlchemy models, create a revision:

```bash
uv run alembic revision --autogenerate -m "describe change"
```

Always review generated migrations and add explicit operations for Supabase-specific features that autogenerate cannot infer: `CREATE EXTENSION vector`, HNSW indexes, GIN indexes, generated `tsvector` columns, and RLS policies.

Apply:

```bash
uv run alembic upgrade head
```

## Ingest sample data

Download SEC 10-K filings (5 tickers × 5 years):

```bash
uv run data/download.py
uv run data/convert_to_markdown.py
```

Load into Supabase and embed:

```bash
cd backend
uv sync --extra ingest
uv run python -m ingest.load_source_documents
uv run python -m ingest.chunk_and_embed --all
```

## Smoke-test retrieval

```bash
uv run python scripts/smoke_retrieval.py
```

Should print top-5 ranked passages for three analyst queries.
