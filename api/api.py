# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

# Create the FastAPI app
app = FastAPI(
    title="My FastAPI App",
    description="A boilerplate FastAPI project",
    version="0.1.0"
)


# Root route
@app.get("/")
def read_root():
    return {"message": "Hello world"}
