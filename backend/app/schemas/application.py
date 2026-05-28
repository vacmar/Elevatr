from pydantic import BaseModel, Field


class ApplicationCreate(BaseModel):
    job_id: int


class ApplicationUpdate(BaseModel):
    status: str = Field(pattern="^(pending|reviewing|accepted|rejected)$")


class ApplicationRead(BaseModel):
    id: int
    student_id: int
    job_id: int
    status: str
    resume_url: str | None = None

    class Config:
        from_attributes = True
