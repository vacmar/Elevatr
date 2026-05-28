# Elevatr — Backend Documentation

This document describes the backend for Elevatr: how it is structured, how to run it locally, database setup/migrations, common commands, and troubleshooting tips.

## Quick Overview
- Framework: FastAPI
- ORM: SQLAlchemy 2.x
- Migrations: Alembic
- Database: PostgreSQL (dockerized)
- Auth: JWT (httpOnly cookies) with password hashing (bcrypt)
- Location: backend/ (application code)

## Repository layout (important paths)
- `backend/` — FastAPI application and server code
- `backend/app/` — application package (models, schemas, api, services, core)
- `backend/alembic/` — Alembic environment and migration scripts
- `backend/alembic.ini` — Alembic config (relative paths)
- `backend/requirements.txt` — backend Python dependencies
- `docker-compose.yml` — docker services (Postgres)
- `BACKEND.md` — this file (root)

## Environment and configuration
- Copy `.env.example` to `.env` at the repo root and edit values (or set environment variables):

  - `DATABASE_URL` — SQLAlchemy DB URL (example):

    postgresql+psycopg://postgres:postgres@localhost:5433/elevatr

  - `JWT_SECRET` — secret used to sign JWT tokens
  - `NEXT_PUBLIC_API_BASE_URL` — frontend API base URL

Note: In this repo the Docker Postgres is mapped to host port `5433` by default to avoid conflicts with a locally running Postgres. If you prefer `5432`, stop your host Postgres first and remap the port in `docker-compose.yml`.

## Local setup (one-time)
1. Create / activate Python venv (project root):

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
```

2. Copy env file and update values:

```bash
cp .env.example .env
# edit .env as needed
```

## Starting Postgres (Docker)
Start just the database service (recommended):

```bash
cd <repo-root>
docker-compose up -d db
```

The service exposes PostgreSQL on the host at `localhost:5433` by default (see `docker-compose.yml` `ports` entry `"5433:5432"`).

If Docker fails to bind to the host port because another Postgres is listening on `5432`, you have two options:
- Stop the local Postgres service and remap to `5432` in `docker-compose.yml`.
- Keep using `5433` and ensure `DATABASE_URL` points at port `5433`.

## Apply database migrations (Alembic)
Run migrations from the backend folder while your venv is active. The commands below explicitly set `DATABASE_URL` so Alembic uses the Docker DB.

```bash
source .venv/bin/activate
cd backend
export DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/elevatr
alembic -c alembic.ini upgrade head
```

Notes:
- The Alembic `env.py` reads the URL from the environment or `app/core/config.py` depending on your setup. Setting `DATABASE_URL` as above forces it.
- If you prefer to run migrations inside Docker, run `docker-compose exec db psql -U postgres -d elevatr -c "\dt"` to verify tables, or create a one-off migration container.

## Run the backend (development)
Run uvicorn with hot reload from the `backend` folder (venv activated):

```bash
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000` (adjust if running behind a proxy or different port).

## Useful commands
- Install deps: `pip install -r backend/requirements.txt`
- Check Python syntax: `python -m compileall backend` or run tests if present
- Run migrations: see section above
- List DB tables (inside container):

```bash
docker-compose exec db psql -U postgres -d elevatr -c "\dt"
```

## Connecting pgAdmin or psql
- Host: `localhost`
- Port: `5433` (unless remapped)
- Maintenance DB: `elevatr`
- Username: `postgres`
- Password: `postgres`

## Troubleshooting
- Error: `FATAL: role "postgres" does not exist`
  - Cause: connecting to a different Postgres instance (e.g., host Postgres) that doesn't have the created DB/role.
  - Fix: make sure you connect to the Docker container port (`5433`) or stop local Postgres. Use `lsof -i :5432` to see which process is listening.

- Error: Alembic can't find script_location
  - Cause: running `alembic` from the wrong working directory.
  - Fix: `cd backend` and run `alembic -c alembic.ini upgrade head`, or pass absolute paths with `-c`.

## Notes about auth and storage
- Authentication uses JWT stored in HttpOnly cookies; see `backend/app/core/security.py` for token creation/verification.
- Resume uploads are stored in a local `upload_dir` set in config. For production, replace with S3 or another blob store and update services accordingly.

## CI / Docker considerations
- You can add a `backend` service to `docker-compose.yml` that depends on `db` and runs the FastAPI app in production mode (e.g., with Gunicorn + Uvicorn workers). For development we prefer running the app locally with `--reload`.

## Common workflows
- Full local dev (db + backend):

```bash
# Start DB
docker-compose up -d db
# Activate venv & install
source .venv/bin/activate
pip install -r backend/requirements.txt
# Apply migrations
cd backend
export DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/elevatr
alembic -c alembic.ini upgrade head
# Run backend
uvicorn app.main:app --reload
```

## Where to look next (key files)
- Application startup: `backend/app/main.py`
- DB setup: `backend/app/core/database.py`
- Configuration: `backend/app/core/config.py` and `.env.example`
- Models: `backend/app/models/*.py`
- API routes: `backend/app/api/routes/*.py`
- Services: `backend/app/services/*.py`

---

If you'd like, I can:
- Add a `backend/README.md` with shortened quick commands inside the `backend` folder.
- Add a `docker-compose` `migrate` service to run Alembic inside the compose network.

Please tell me which you prefer.
