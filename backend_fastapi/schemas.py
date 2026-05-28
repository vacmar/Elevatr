from typing import Optional
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    is_recruiter: Optional[bool] = False


class UserRead(BaseModel):
    id: int
    email: EmailStr
    is_recruiter: bool


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class JobCreate(BaseModel):
    title: str
    description: Optional[str] = None


class JobRead(BaseModel):
    id: int
    title: str
    description: Optional[str]


class ApplicationCreate(BaseModel):
    job_id: int
