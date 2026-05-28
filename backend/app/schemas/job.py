from pydantic import BaseModel, Field


class JobCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    location: str = Field(min_length=2, max_length=120)
    salary: str | None = None
    description: str
    skills: list[str] = Field(default_factory=list)


class JobRead(JobCreate):
    id: int
    recruiter_id: int

    class Config:
        from_attributes = True
