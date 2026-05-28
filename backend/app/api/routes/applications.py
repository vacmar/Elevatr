from fastapi import APIRouter

from app.schemas.application import ApplicationCreate, ApplicationRead, ApplicationUpdate


router = APIRouter()


@router.get("", response_model=list[ApplicationRead])
def list_applications() -> list[ApplicationRead]:
    return []


@router.post("", response_model=ApplicationRead)
def create_application(payload: ApplicationCreate) -> ApplicationRead:
    return ApplicationRead(id=1, student_id=1, job_id=payload.job_id, status="pending", resume_url=None)


@router.patch("/{application_id}", response_model=ApplicationRead)
def update_application(application_id: int, payload: ApplicationUpdate) -> ApplicationRead:
    return ApplicationRead(id=application_id, student_id=1, job_id=1, status=payload.status, resume_url=None)
