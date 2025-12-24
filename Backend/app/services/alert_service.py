from firebase_admin import db
from app.services.whatsapp_service import send_green_alert
from app.services.websocket_manager import manager
import asyncio

async def broadcast_alert_to_area(incident_area: str, issue_type: str, additional_data: dict = None):
    """
    1. Fetches all users from Firebase.
    2. Filters them by 'area'.
    3. Sends alerts via:
       - WhatsApp (for SMS alerts)
       - WebSocket (for real-time in-app notifications)
    """
    print(f"🔍 Broadcasting Alert for Area: {incident_area}")

    # 1. Fetch all users from Firebase 'users' node
    try:
        ref = db.reference('users')
        all_users = ref.get()
    except Exception as e:
        print(f"❌ Firebase Error: {e}")
        return {"status": "error", "detail": str(e)}

    if not all_users:
        print("⚠️ No users found in database.")
        return {"status": "no_users_found"}

    target_phones = []

    # 2. Filter Users (Case-insensitive check)
    # Firebase structure: users -> { "919999...": { "area": "Sector 4" } }
    clean_incident_area = incident_area.lower().strip()

    for phone, data in all_users.items():
        if isinstance(data, dict):
            user_area = data.get('area', '').lower().strip()
            
            # Check if areas match
            if user_area == clean_incident_area:
                target_phones.append(phone)

    print(f"📢 Found {len(target_phones)} residents in {incident_area}")

    # 3. Construct the Alert Message
    alert_message = (
        f"🚨 *NAGAR ALERT: {incident_area.upper()}* 🚨\n\n"
        f"⚠️ *Issue Verified:* {issue_type}\n"
        f"📍 *Location:* {incident_area} (AI Analysis Verified)\n\n"
        f"ℹ️ Authorities have been notified and a team has been dispatched.\n"
        f"Please proceed with caution.\n\n"
        f"— Nagar Alert Authority"
    )

    # 4. Prepare Real-Time Alert Data for WebSocket
    websocket_alert = {
        "area": incident_area,
        "issue_type": issue_type,
        "message": alert_message,
        "target_count": len(target_phones),
        **(additional_data or {})
    }

    # 5. Send Messages (WhatsApp)
    sent_count = 0
    for phone in target_phones:
        success = send_green_alert(phone, alert_message)
        if success:
            sent_count += 1

    # 6. Broadcast via WebSocket (Real-time in-app notifications)
    print(f"📡 Broadcasting to {manager.get_connected_users_count()} connected users via WebSocket")
    await manager.broadcast_alert(websocket_alert, target_area=incident_area)

    return {
        "status": "completed", 
        "target_area": incident_area,
        "users_found": len(target_phones),
        "whatsapp_messages_sent": sent_count,
        "websocket_clients": manager.get_connected_users_count()
    }