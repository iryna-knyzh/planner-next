# Planner

A minimalist day, week, and month planner. Built with Next.js (App Router) and
backed by Postgres through Prisma, so your notes are saved on the server and
persist across devices and restarts.

## Features

- **Three views** — switch between **Day**, **Week**, and **Month** pages.
- **Notes & themes** — write free-form notes for each day/week/month and set a
  "theme" (a focus or intention) per period. Edits save automatically.
- **Emoji** — the Week page has an emoji picker; pick an emoji and it is copied
  to your clipboard, ready to paste into any note.
- **Images in notes** — on the **Day** page you can **paste** (Ctrl/Cmd+V) or
  **drag & drop** an image straight into the note. Images are uploaded and
  stored on the server; the note keeps a link to them.

## Run everything in Docker

Bring up Postgres, run the Prisma migrations, and start the app with a single
command:

```bash
docker compose up --build
```

Then open [http://localhost:3000](http://localhost:3000). The stack is three
services:

- `postgres` — the database (data persists in the `planner_pgdata` volume).
- `migrate` — a one-shot job that runs `prisma migrate deploy`, then exits.
- `app` — the Next.js server (standalone build), started only after `migrate`
  succeeds. Images pasted/dropped into the Day note are uploaded via
  `/api/uploads` and stored on the `planner_uploads` volume.

Stop everything with `docker compose down` (add `-v` to also drop the database
and uploaded images).

## Local development

You still need a database. Start just Postgres with Docker, then run the dev
server on your machine:

```bash
docker compose up -d postgres   # Postgres on localhost:5433
pnpm install
pnpm prisma migrate dev         # apply migrations
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). The database connection
string lives in `.env` (`DATABASE_URL`); see `.env.example`.

### Hot-reloading dev server in Docker

If you'd rather not install Node/pnpm locally, run the whole dev server in a
container with the dev override — source is bind-mounted, so edits hot-reload:

```bash
pnpm docker:dev
# = docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

This swaps the `app` service for `next dev` (still runs Postgres + migrations).
It uses `--webpack` with `WATCHPACK_POLLING` because Docker Desktop's bind mount
doesn't deliver inotify events, so file watching has to poll. Plain
`docker compose up` is unchanged and still runs the production build.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + React
- [Prisma](https://www.prisma.io) ORM with PostgreSQL
- [Tailwind CSS](https://tailwindcss.com)
- [Tiptap](https://tiptap.dev) for the rich Day note editor (inline images)
- [emoji-picker-react](https://www.npmjs.com/package/emoji-picker-react)
