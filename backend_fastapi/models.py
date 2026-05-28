from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, nullable=False, unique=True)
    hashed_password: str
    is_recruiter: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Job(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    posted_by_id: Optional[int] = Field(default=None, foreign_key="user.id")


class Application(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    job_id: int = Field(foreign_key="job.id")
    applicant_id: int = Field(foreign_key="user.id")
    resume_path: Optional[str] = None
    status: str = Field(default="submitted")
    created_at: datetime = Field(default_factory=datetime.utcnow)
