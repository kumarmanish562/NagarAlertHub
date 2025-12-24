from fastapi import APIRouter, File, UploadFile, Form, HTTPException
from typing import Optional
from app.services.gemini_service import gemini_service
from app.services.firebase_service import firebase_service
from app.services.whatsapp_service import send_green_alert
# Import the Alert Service to send WhatsApp messages
from app.services.alert_service import broadcast_alert_to_area 
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
    address: Optional[str] = Form(""),
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

    # 2. Analyze with Gemini
    prompt = """
    Analyze this image for civic issues like potholes, garbage, street light issues, or accidents.
    Answer with a JSON object containing:
    - "is_civic_issue": boolean
    - "issue_type": string (e.g., "Pothole", "Garbage", "Traffic", "N/A")
    - "severity": string ("Low", "Medium", "High")
    - "description": short description of what you see
    """
    
    ai_analysis = await gemini_service.analyze_image(image_bytes, prompt=prompt)
    
    # Default fallback logic
    report_status = "Pending Verification"
    issue_type = "reported_issue"
    confidence = 0.0
    
    if "analysis" in ai_analysis and ai_analysis["analysis"]:
        text_resp = ai_analysis["analysis"].lower()
        if "true" in text_resp or "pothole" in text_resp or "garbage" in text_resp:
            report_status = "Verified"
            issue_type = "Verified Issue"
            confidence = 0.95
    
    # 3. Construct Payload
    report_payload = {
        "userId": user_id,
        "category": category,
        "address": address,
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
        "status": report_status,
        "timestamp_local": datetime.now().isoformat(),
    }

    # 4. Save to Firebase
    db_result = firebase_service.save_report(report_payload)

    # 5. Notify Admin (Bot Logic)
    try:
        ADMIN_PHONE = "918872825483"
        admin_msg = f"🚨 *New Incident Reported*\n\nType: {category}\nLocation: {latitude}, {longitude}\nStatus: {report_status}\n\nID: {db_result.get('id')}\n\nAuthorize on Dashboard."
        send_green_alert(ADMIN_PHONE, admin_msg)
    except Exception as e:
        print(f"Failed to notify admin: {e}")

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
    reports = firebase_service.get_reports()
    return reports

@router.patch("/{report_id}/verify")
async def verify_report(
    report_id: str, 
    status: str = Form("Verified"), 
    area: str = Form("Sector 4"),       # New Field: Admin inputs area
    issue_type: str = Form("Pothole")   # New Field: Admin confirms issue type
):
    """
    Admin manually verifies or rejects a report.
    If Verified, it triggers a WhatsApp Broadcast to that Area.
    """
    # 1. Update Firebase
    result = firebase_service.update_report_status(report_id, status)
    if "error" in result:
         raise HTTPException(status_code=500, detail=result["error"])

    # 2. TRIGGER WHATSAPP ALERT (New Logic)
    alert_result = {"status": "skipped"}
    if status == "Verified":
        # Call the alert service we created
        alert_result = await broadcast_alert_to_area(incident_area=area, issue_type=issue_type)

    return {
        "firebase_update": result,
        "whatsapp_alert": alert_result
    }