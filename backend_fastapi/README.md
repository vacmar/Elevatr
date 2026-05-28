# backend_fastapi

Minimal FastAPI scaffold for Elevatr.

Prereqs:
- Python 3.10+
- Docker (for Postgres) or a running Postgres instance

Quick start (recommended with Docker Compose):

```bash
# from repository root
docker-compose up -d
export DATABASE_URL=postgresql://elevatr:elevatr@localhost:5432/elevatr_dev
export SECRET_KEY="replace-with-secure-key"
python -m pip install -r backend_fastapi/requirements.txt
uvicorn backend_fastapi.app:app --reload
```

Alternative (quick local dev without Docker):

```bash
export DATABASE_URL=sqlite:///./dev.db
python -m pip install -r backend_fastapi/requirements.txt
uvicorn backend_fastapi.app:app --reload
```

Uploads are stored under `backend_fastapi/uploads/resumes/` by default.
