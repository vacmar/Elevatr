from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlmodel import Session, select
from typing import List
from .. import models, schemas
from ..db import get_session
from ..uploads import save_upload_file

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/", response_model=List[schemas.JobRead])
def list_jobs(session: Session = Depends(get_session)):
    jobs = session.exec(select(models.Job)).all()
    return [schemas.JobRead(id=j.id, title=j.title, description=j.description) for j in jobs]


@router.post("/", response_model=schemas.JobRead)
def create_job(job_in: schemas.JobCreate, session: Session = Depends(get_session)):
    job = models.Job(title=job_in.title, description=job_in.description)
    session.add(job)
    session.commit()
    session.refresh(job)
    return schemas.JobRead(id=job.id, title=job.title, description=job.description)


@router.post("/{job_id}/apply")
def apply_job(job_id: int, resume: UploadFile = File(...), session: Session = Depends(get_session)):
    job = session.get(models.Job, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    path = save_upload_file(resume)
    # In a real app we'd use auth; for scaffold, accept anonymous application
    application = models.Application(job_id=job_id, applicant_id=0, resume_path=path)
    session.add(application)
    session.commit()
    session.refresh(application)
    return {"application_id": application.id, "resume_path": application.resume_path}
