import os
import shutil
import pandas as pd

def prepare_dataset(source_dir, dest_dir):
    if not os.path.exists(dest_dir):
        os.makedirs(dest_dir)

    # Assuming the dataset consists of images and a CSV file with annotations
    for filename in os.listdir(source_dir):
        if filename.endswith('.jpg') or filename.endswith('.png'):
            shutil.copy(os.path.join(source_dir, filename), dest_dir)

    # Load annotations if available
    annotations_file = os.path.join(source_dir, 'annotations.csv')
    if os.path.exists(annotations_file):
        annotations = pd.read_csv(annotations_file)
        annotations.to_csv(os.path.join(dest_dir, 'annotations.csv'), index=False)

if __name__ == "__main__":
    source_directory = 'data/uploads'
    destination_directory = 'data/datasets'
    prepare_dataset(source_directory, destination_directory)