# Railway deployment

This repo deploys to Railway as two services from one project:

- `rag-backend` from `backend/` — FastAPI + Uvicorn.
- `rag-frontend` from `frontend/` — Vite React build served by Caddy.

Supabase stays hosted at Supabase. Do not add Railway Postgres for this app.

## Before Railway

Have these ready:

- This GitHub repo pushed (or the local repo + Railway CLI).
- A Supabase project from [Supabase setup](supabase-setup.md).
- An OpenAI API key.
- Production source documents loaded, or be ready to run ingestion after deploy.

Use the **direct** Supabase Postgres URL for `DATABASE_URL`, not the transaction pooler URL.

## Option A: Railway UI

1. In Railway, click **New Project** → **Deploy from GitHub repo** → select this repo.
2. Name the backend service `rag-backend`.
3. Open backend **Settings**:
   - **Root Directory:** `/backend`
   - **Healthcheck Path:** `/health`
   - Leave build and start commands blank — Railway uses `backend/Dockerfile`.
4. Add backend **Variables**:

```text
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
DATABASE_URL=postgresql://postgres:your-password@db.your-project-ref.supabase.co:5432/postgres
OPENAI_API_KEY=sk-your-openai-api-key
ALLOWED_ORIGINS=http://localhost:5173
```

5. In backend **Settings** → **Deploy**, set the pre-deploy command:

```bash
uv run alembic upgrade head
```

6. Deploy the backend → open **Networking** → generate a public domain.
7. Visit `https://your-backend.up.railway.app/health` → `{"status":"ok"}`.
8. In the same project, click **New** → **GitHub Repo** → select this repo again.
9. Name the frontend service `rag-frontend`.
10. Open frontend **Settings**:
    - **Root Directory:** `/frontend`
    - **Healthcheck Path:** `/health`
    - Leave build and start commands blank — Railway uses `frontend/Dockerfile`.
11. Add frontend **Variables** before deploying:

```text
VITE_API_BASE_URL=https://your-backend.up.railway.app
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

12. Deploy the frontend → open **Networking** → generate a public domain.
13. Update the backend variable and redeploy:

```text
ALLOWED_ORIGINS=https://your-frontend.up.railway.app
```

## Option B: Railway CLI

```bash
railway login
railway link --project <project-id> --environment production

# Create services
railway add --service rag-backend --json
railway add --service rag-frontend --json

# Set backend variables
railway variable set \
  SUPABASE_URL=https://your-project-ref.supabase.co \
  SUPABASE_ANON_KEY=your-anon-public-key \
  DATABASE_URL=postgresql://... \
  ALLOWED_ORIGINS=http://localhost:5173 \
  --service rag-backend --skip-deploys

printf "%s" "$SUPABASE_SERVICE_ROLE_KEY" | railway variable set SUPABASE_SERVICE_ROLE_KEY \
  --stdin --service rag-backend --skip-deploys
printf "%s" "$OPENAI_API_KEY" | railway variable set OPENAI_API_KEY \
  --stdin --service rag-backend --skip-deploys

# Deploy backend
railway up ./backend --path-as-root --service rag-backend --detach
railway domain --service rag-backend --json

# Run migrations
railway run --service rag-backend -- sh -c "cd backend && uv run alembic upgrade head"

# Set frontend variables (baked into the build)
railway variable set \
  VITE_API_BASE_URL=https://your-backend.up.railway.app \
  VITE_SUPABASE_URL=https://your-project-ref.supabase.co \
  VITE_SUPABASE_ANON_KEY=your-anon-public-key \
  --service rag-frontend --skip-deploys

# Deploy frontend
railway up ./frontend --path-as-root --service rag-frontend --detach
railway domain --service rag-frontend --json

# Update CORS and redeploy backend
railway variable set ALLOWED_ORIGINS=https://your-frontend.up.railway.app \
  --service rag-backend
railway redeploy --service rag-backend --yes
```

## Supabase auth URLs

In Supabase → **Authentication** → **URL Configuration**:

- **Site URL:** `https://your-frontend.up.railway.app`
- **Redirect URLs:** add `https://your-frontend.up.railway.app/*`

Keep `http://localhost:5173/*` for local development.

## Load corpus data (production)

Run ingestion against production Supabase from your local machine with production values in `backend/.env`:

```bash
cd backend
uv sync --extra ingest
uv run python -m ingest.load_source_documents
uv run python -m ingest.chunk_and_embed --all
```

## Key lessons

- Do not set `PORT` yourself — Railway provides it; both containers bind to `${PORT:-default}`.
- Keep `docling` behind `--extra ingest` — it pulls large ML deps that bloat the API image.
- Set frontend `VITE_*` variables **before** `railway up` — they are baked into the static build.
- Keep the `/health` handle **before** the SPA fallback in `Caddyfile`; otherwise Railway gets `index.html` as the health response.

## Final check

```text
https://your-backend.up.railway.app/health   → {"status":"ok"}
https://your-frontend.up.railway.app/health  → ok
```

Sign in → send a question → verify streaming response with citations.
