from fastapi import FastAPI
from fastapi import Request
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/hello")
async def hello_world(request: Request):
    return JSONResponse(content={"message": "Hello, world!"})
