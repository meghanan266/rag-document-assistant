# Frontend setup

The frontend is a Vite + React 19 SPA — the right choice for an authenticated internal tool that needs fast iteration and a clean connection to the FastAPI backend. Server-rendering is not needed here.

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) — `npm install -g pnpm`

## Environment

Copy the example and fill in your values:

```bash
cd frontend
cp .env.example .env
```

Required values:

```text
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

`VITE_*` values are baked into the static build at compile time — never put secrets here.

## Run

```bash
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Type-check and lint

```bash
pnpm tsc --noEmit
pnpm lint
```

## Build

```bash
pnpm build
pnpm preview   # serve the production build locally
```
