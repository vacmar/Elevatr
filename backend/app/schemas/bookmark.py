from pydantic import BaseModel


class BookmarkCreate(BaseModel):
    job_id: int


class BookmarkRead(BaseModel):
    id: int
    student_id: int
    job_id: int

    class Config:
        from_attributes = True
