from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from .. import models, schemas
from ..db import get_session
from ..auth import get_password_hash, verify_password, create_access_token, decode_access_token

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/register", response_model=schemas.UserRead)
def register(user_in: schemas.UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(models.User).where(models.User.email == user_in.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(email=user_in.email, hashed_password=get_password_hash(user_in.password), is_recruiter=user_in.is_recruiter)
    session.add(user)
    session.commit()
    session.refresh(user)
    return schemas.UserRead(id=user.id, email=user.email, is_recruiter=user.is_recruiter)


@router.post("/login", response_model=schemas.Token)
def login(form_data: schemas.UserCreate, session: Session = Depends(get_session)):
    user = session.exec(select(models.User).where(models.User.email == form_data.email)).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect credentials")
    token = create_access_token(subject=str(user.id))
    return schemas.Token(access_token=token)
