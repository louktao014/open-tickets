# Open Ticket

Open Ticket is a support/ticketing platform that bridges **Discord** conversations with a **Kanban-style ticket board** and a collaborative **workspace board** (sticky notes, code snippets, links, images, etc.), synced in real time over WebSockets.

## Monorepo structure

This project is an npm workspaces monorepo with two apps:

```
package/
  backend/    NestJS API — Discord bot integration, WebSocket gateway, message persistence
  frontend/   Angular app — dashboard, kanban board, collaborative workspace
```

| Package  | Stack                          | Dev port |
| -------- | ------------------------------ | -------- |
| backend  | NestJS, discord.js, Socket.IO  | 3000     |
| frontend | Angular, Angular Material, CDK | 4200     |

## Prerequisites

- Node.js (LTS) and npm
- A Discord bot token (for the backend to connect to Discord)
- A Supabase project (URL + key) for data storage

## Setup

Install dependencies for all workspaces from the repo root:

```bash
npm install
```

Create an environment file for the backend:

```bash
cp package/backend/.env.example package/backend/.env
```

Then fill in the required values in `package/backend/.env`:

```
PORT=3000
DISCORD_TOKEN=
SUPABASE_URL=
SUPABASE_KEY=
```

> Never commit `.env` files or real secrets — they are already excluded via `.gitignore`.

## Running locally

Run both apps concurrently from the root:

```bash
npm start
```

Or run each app individually:

```bash
npm run start:backend    # NestJS API on http://localhost:3000
npm run start:frontend   # Angular dev server on http://localhost:4200
```

## Build & test

```bash
npm run build   # builds backend and frontend
npm test        # runs backend and frontend test suites
```

## Running with Docker

```bash
docker compose up --build
```

This builds and starts:

- `backend` on [http://localhost:3000](http://localhost:3000)
- `frontend` on [http://localhost:4200](http://localhost:4200)

## Project docs

- [Backend README](package/backend/README.md)
- [Frontend README](package/frontend/README.md)
