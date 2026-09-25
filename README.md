This is the Bharath Treks & Tales monorepo: Next.js frontend (root) + Express REST API (`backend/`).

## Prerequisites

- Node.js 20+

## Install

```bash
npm install
npm --prefix backend install
```

## Run in dev (use two terminals)

```bash
# terminal 1 — backend API on http://localhost:4000
npm run dev:backend

# terminal 2 — frontend on http://localhost:3000
npm run dev
```

Start the backend first. The frontend calls the API at `NEXT_PUBLIC_API_URL` (see `.env.local`).

Health checks: `http://localhost:4000/` and `http://localhost:4000/health`.

## Env config

- Frontend (`.env.local`): `NEXT_PUBLIC_API_URL=http://localhost:4000`
- Backend (`backend/.env`): `PORT=4000`, `FRONTEND_URL=http://localhost:3000`

## Build / prod start

```bash
npm run build:backend
npm run build
npm run start:backend
npm run start
```

## Other scripts

- `npm run lint` — lint frontend
- `npm run generate-pdf` — `node scripts/generate-pdf.js`
