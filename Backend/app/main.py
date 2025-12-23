from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.endpoints import reports, users, solutions

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports.router, prefix=f"{settings.API_PREFIX}/reports", tags=["reports"])
app.include_router(users.router, prefix=f"{settings.API_PREFIX}/users", tags=["users"])
app.include_router(solutions.router, prefix=f"{settings.API_PREFIX}/solutions", tags=["solutions"])

@app.get("/")
async def root():
    return {"status": "Active", "system": "Nagar Alert Hub Backend"}