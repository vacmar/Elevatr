import os
from fastapi import UploadFile
from pathlib import Path

UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads" / "resumes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def save_upload_file(upload_file: UploadFile) -> str:
    filename = upload_file.filename
    dest = UPLOAD_DIR / filename
    with dest.open("wb") as f:
        f.write(upload_file.file.read())
    return str(dest)
