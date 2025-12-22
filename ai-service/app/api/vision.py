from fastapi import APIRouter, File, UploadFile
from app.services.vision import validate_distance

router = APIRouter()

@router.post("/validate")
async def validate_image(file: UploadFile = File(...)):
    contents = await file.read()
    status = validate_distance(contents)
    return {"status": status}
