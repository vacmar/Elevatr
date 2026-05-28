from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Response, status, Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.core.security import create_token
from app.schemas.auth import UserCreate, UserLogin, UserRead
from app.services.auth_service import authenticate_user, create_user, get_user_by_email
from jose import JWTError, jwt
from app.models.user import User
from sqlalchemy import select
from app.core.security import ALGORITHM


router = APIRouter()


@router.post("/register", response_model=UserRead)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    existing_user = get_user_by_email(db, payload.email)
    if existing_user is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

    user = create_user(db, payload)
    return UserRead.model_validate(user)


@router.post("/login")
def login(payload: UserLogin, response: Response, db: Session = Depends(get_db)) -> dict[str, str]:
    user = authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_token(str(user.id), timedelta(minutes=settings.jwt_access_token_expires_minutes))
    refresh_token = create_token(str(user.id), timedelta(days=settings.jwt_refresh_token_expires_days))
    response.set_cookie(key="access_token", value=access_token, httponly=True, samesite="lax", secure=False, path="/")
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, samesite="lax", secure=False, path="/")
    return {"message": "login successful", "role": user.role}



@router.get("/me", response_model=UserRead)
def me(request: Request, db: Session = Depends(get_db)) -> UserRead:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
        user_id = int(payload.get("sub"))
    except (JWTError, ValueError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    statement = select(User).where(User.id == user_id)
    user = db.scalars(statement).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return UserRead.model_validate(user)



