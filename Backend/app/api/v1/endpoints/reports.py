from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
from app.services.gemini_service import gemini_service
from app.services.firebase_service import firebase_service
# from app.services.maps_service import maps_service # Future implementation
import shutil
import os
from datetime import datetime

router = APIRouter()

@router.post("/submit", status_code=201)
async def submit_report(
    file: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    description: Optional[str] = Form(""),
    category: str = Form("Traffic"),
    user_id: str = Form("anonymous")
):
    """
    Receives a photo and location from the mobile app.
    1. Uses Gemini to verify the issue.
    2. If valid, saves to Firebase Realtime DB.
    """
    
    # 1. Read Image
    try:
        image_bytes = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image file")

    # 2. Analyze with Gemini (City Intelligence)
    # We ask Gemini to return JSON or a specific format if possible, or just parse the text.
    # For now, we simply pass the image and get a description.
    prompt = """
    Analyze this image for civic issues like potholes, garbage, street light issues, or accidents.
    Answer with a JSON object containing:
    - "is_civic_issue": boolean
    - "issue_type": string (e.g., "Pothole", "Garbage", "Traffic", "N/A")
    - "severity": string ("Low", "Medium", "High")
    - "description": short description of what you see
    """
    
    ai_analysis = await gemini_service.analyze_image(image_bytes, prompt=prompt)
    
    # Parse AI response (Mocking logic if AI fails or for simplicity)
    # In production, we'd robustly parse the JSON string from Gemini
    
    # Default fallback if Gemini isn't active or fails
    report_status = "Pending Verification"
    issue_type = "reported_issue"
    confidence = 0.0
    
    if "analysis" in ai_analysis and ai_analysis["analysis"]:
        # Naive check - in reality, parse the JSON
        text_resp = ai_analysis["analysis"].lower()
        if "true" in text_resp or "pothole" in text_resp or "garbage" in text_resp:
            report_status = "Verified"
            issue_type = "Verified Issue"
            confidence = 0.95
    
    # 3. Construct Payload for Firebase
    report_payload = {
        "userId": user_id,
        "category": category, # Added category
        "location": {
            "lat": latitude,
            "lng": longitude
        },
        "description": description,
        "aiAnalysis": {
            "raw": ai_analysis.get("analysis", ""),
            "detectedType": issue_type,
            "confidence": confidence
        },
        "status": report_status, # Verified, Pending, Rejected
        "timestamp_local": datetime.now().isoformat(),
        # In a real app, upload image to Cloud Storage and save URL here
        # "imageUrl": "https://storage.googleapis.com/..." 
    }

    # 4. Save to Firebase
    db_result = firebase_service.save_report(report_payload)

    return {
        "message": "Report submitted successfully",
        "reportId": db_result.get("id"),
        "ai_verification": report_status,
        "analysis": ai_analysis.get("analysis")
    }

@router.get("/", status_code=200)
async def get_reports():
    """
    Get all reports (Admin usage).
    """
    # In a real app, check for admin token/auth here
    reports = firebase_service.get_reports()
    return reports

@router.patch("/{report_id}/verify")
async def verify_report(report_id: str, status: str = Form("Verified")):
    """
    Admin manually verifies or rejects a report.
    """
    result = firebase_service.update_report_status(report_id, status)
    if "error" in result:
         raise HTTPException(status_code=500, detail=result["error"])
    return result
