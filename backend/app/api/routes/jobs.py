from fastapi import APIRouter

from app.schemas.job import JobCreate, JobRead


router = APIRouter()


@router.get("", response_model=list[JobRead])
def list_jobs() -> list[JobRead]:
    return []


@router.post("", response_model=JobRead)
def create_job(payload: JobCreate) -> JobRead:
    return JobRead(id=1, recruiter_id=1, **payload.model_dump())
