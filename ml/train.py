import os
import yaml
from yolov8 import YOLO

def load_config(config_path):
    with open(config_path, 'r') as file:
        config = yaml.safe_load(file)
    return config

def train_model(config):
    model = YOLO(config['model']['path'])
    model.train(data=config['data'], epochs=config['train']['epochs'])

if __name__ == "__main__":
    config_path = os.path.join(os.path.dirname(__file__), 'configs', 'yolov8.yaml')
    config = load_config(config_path)
    train_model(config)