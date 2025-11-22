from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
from ..models.schemas import Dataset
from ..services.yolov8_service import upload_dataset, trigger_training

router = APIRouter()

@router.post("/datasets/upload", response_model=Dataset)
async def upload_new_dataset(file: UploadFile = File(...)):
    try:
        dataset_info = await upload_dataset(file)
        return dataset_info
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/datasets/train")
async def train_model():
    try:
        await trigger_training()
        return {"message": "Training triggered successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))