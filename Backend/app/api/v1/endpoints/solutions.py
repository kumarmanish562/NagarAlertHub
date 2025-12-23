from fastapi import APIRouter, HTTPException, Body
from app.services.firebase_service import firebase_service
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class SolutionCreate(BaseModel):
    reportId: str
    adminId: str
    adminName: str
    description: str # How it was solved
    imageUrl: Optional[str] = None # Proof of work

@router.post("/solve", status_code=201)
async def submit_solution(solution: SolutionCreate):
    """
    Admin submits a solution.
    1. Creates entry in 'solutions' table.
    2. Updates 'reports' table status to 'Resolved'.
    """
    data = solution.dict()
    result = firebase_service.save_solution(data)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return {"message": "Solution recorded", "solutionId": result["solutionId"]}

@router.get("/")
async def get_solutions():
    return firebase_service.get_solutions()