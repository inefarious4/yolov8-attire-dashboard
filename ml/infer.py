import torch
from yolov8 import YOLO
import os
import json
from datetime import datetime

def load_model(model_path):
    model = YOLO(model_path)
    return model

def run_inference(model, image_path):
    results = model.predict(image_path)
    return results

def process_results(results):
    processed_data = []
    for result in results:
        data = {
            "id": result.id,
            "attire_completeness": {
                "coat": result.coat,
                "shoes": result.shoes,
                "gloves": result.gloves
            },
            "date_captured": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        processed_data.append(data)
    return processed_data

def save_results_to_json(results, output_path):
    with open(output_path, 'w') as json_file:
        json.dump(results, json_file)

def main(image_path, model_path, output_path):
    model = load_model(model_path)
    results = run_inference(model, image_path)
    processed_results = process_results(results)
    save_results_to_json(processed_results, output_path)

if __name__ == "__main__":
    image_path = "path/to/image.jpg"  # Replace with actual image path
    model_path = "path/to/yolov8_model.pt"  # Replace with actual model path
    output_path = "path/to/output.json"  # Replace with desired output path
    main(image_path, model_path, output_path)