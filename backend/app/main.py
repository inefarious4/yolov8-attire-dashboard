from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import datasets, train

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets.router)
app.include_router(train.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the YOLOv8 Attire Dashboard API"}