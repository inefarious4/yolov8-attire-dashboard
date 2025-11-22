from typing import List, Dict
import os
import subprocess
from fastapi import HTTPException

class YOLOv8Service:
    def __init__(self, model_path: str):
        self.model_path = model_path

    def train_model(self, dataset_path: str) -> str:
        if not os.path.exists(dataset_path):
            raise HTTPException(status_code=404, detail="Dataset not found")
        
        command = f"python ml/train.py --data {dataset_path} --model {self.model_path}"
        try:
            subprocess.run(command, shell=True, check=True)
            return "Training started successfully."
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

    def infer(self, image_path: str) -> Dict:
        if not os.path.exists(image_path):
            raise HTTPException(status_code=404, detail="Image not found")
        
        command = f"python ml/infer.py --image {image_path} --model {self.model_path}"
        try:
            result = subprocess.run(command, shell=True, check=True, capture_output=True)
            return {"output": result.stdout.decode()}
        except subprocess.CalledProcessError as e:
            raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")

    def get_model_info(self) -> Dict:
        return {"model_path": self.model_path, "status": "ready"}