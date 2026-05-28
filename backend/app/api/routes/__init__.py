from fastapi import APIRouter

from . import applications, auth, bookmarks, health, jobs


api_router = APIRouter(prefix="/api")
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
api_router.include_router(applications.router, prefix="/applications", tags=["applications"])
api_router.include_router(bookmarks.router, prefix="/bookmarks", tags=["bookmarks"])
