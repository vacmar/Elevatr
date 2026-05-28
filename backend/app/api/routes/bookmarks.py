from fastapi import APIRouter

from app.schemas.bookmark import BookmarkCreate, BookmarkRead


router = APIRouter()


@router.get("", response_model=list[BookmarkRead])
def list_bookmarks() -> list[BookmarkRead]:
    return []


@router.post("", response_model=BookmarkRead)
def create_bookmark(payload: BookmarkCreate) -> BookmarkRead:
    return BookmarkRead(id=1, student_id=1, job_id=payload.job_id)
