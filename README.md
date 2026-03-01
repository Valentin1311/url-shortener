# URL Shortener

A full-stack URL shortener that converts long URLs into short, shareable links.

## Tech Stack

**Frontend** — React 19, TypeScript, Tailwind CSS v4, Vite

**Backend** — Node.js 22, TypeScript, Fastify, Drizzle ORM, Zod

**Infrastructure** — PostgreSQL 17, Nginx (reverse proxy), Docker Compose, pnpm workspaces

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm (or corepack)
- Docker & Docker Compose

### Setup

```bash
./setup.sh
```

This installs dependencies, starts PostgreSQL + Nginx via Docker, and runs database migrations.

### Development

```bash
pnpm dev
```

Opens the backend (port 3000) and frontend dev server (port 5173). Access everything through Nginx at **http://localhost:8080**.

### Other Commands

| Command | Description |
|---|---|
| `pnpm infra:up` | Start PostgreSQL + Nginx |
| `pnpm infra:down` | Stop all containers |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:generate` | Generate migrations from schema changes |
| `pnpm db:reset` | Destroy DB volume and re-migrate from scratch |

## Architecture

```
Client → Nginx (:8080) → Backend (:3000)  → PostgreSQL
                        → Frontend (:5173)
```

Nginx routes `/api/*` and short code paths (`/[a-zA-Z0-9]+`) to the backend, and everything else to the Vite dev server.

### Short Code Generation

Each URL is assigned a **Snowflake ID** (64-bit, time-sortable unique identifier) which is then encoded to **base62** (`[0-9a-zA-Z]`). This produces short codes that:

- Are globally unique without coordination (no DB lookup before insert)
- Are time-sortable by design
- Range from 7 to 11 characters, growing gradually over time
- 11 characters covers the entire 64-bit space (`62^11 > 2^64`), so codes will **never exceed 11 chars**

The Snowflake uses a custom epoch of `2026-01-01` and the `@sapphire/snowflake` library.

### Backend Layers

The backend follows a layered architecture with dependency injection via factory functions:

- **Presentation** — Fastify routes, Zod request validation, error handler
- **Application** — `UrlService` orchestrates ID generation, encoding, and persistence
- **Repository** — Drizzle-based data access, isolated behind an interface

## Trade-offs & Decisions

- **Snowflake + base62 vs. random/hash-based codes** — Snowflake IDs are monotonic and collision-free without DB checks. The downside is that codes are predictable (sequential), which is acceptable for a URL shortener but wouldn't work if code secrecy mattered.
- **No caching layer** — A production system would add Redis in front of the DB for read-heavy redirect traffic. Omitted here to keep the stack simple.
- **No rate limiting** — Would be needed in production to prevent abuse. Easy to add via Fastify plugin or at the Nginx level.
- **No analytics / click tracking** — A natural next step would be counting redirects, logging referrers, etc.
- **Single-node Snowflake** — The current setup uses a single worker ID. Scaling to multiple backend instances would require assigning distinct worker IDs to each node.
