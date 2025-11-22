from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import subprocess

router = APIRouter()

class TrainingResponse(BaseModel):
    message: str

@router.post("/train", response_model=TrainingResponse)
async def trigger_training() -> TrainingResponse:
    try:
        # Call the training script
        subprocess.run(["python", "ml/train.py"], check=True)
        return TrainingResponse(message="Training process has been triggered successfully.")
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail="An error occurred while triggering the training process.")

@router.get("/train/status", response_model=TrainingResponse)
async def get_training_status() -> TrainingResponse:
    # Placeholder for future implementation to check training status
    return TrainingResponse(message="Training status check is not implemented yet.")