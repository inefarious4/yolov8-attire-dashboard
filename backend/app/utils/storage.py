def save_file(file_path, data):
    with open(file_path, 'wb') as f:
        f.write(data)

def load_file(file_path):
    with open(file_path, 'rb') as f:
        return f.read()

def delete_file(file_path):
    import os
    if os.path.exists(file_path):
        os.remove(file_path)

def list_files(directory):
    import os
    return os.listdir(directory)