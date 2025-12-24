"""
WhatsApp Webhook Router
Handles incoming messages from Green-API
"""
from fastapi import APIRouter, Body
from app.services.whatsapp_service import send_green_alert

router = APIRouter()


@router.post("/webhook/whatsapp")
async def whatsapp_webhook(data: dict = Body(...)):
    """
    Webhook endpoint for receiving WhatsApp messages from Green-API
    
    Expected payload from Green-API:
    {
        "messageData": {
            "chatId": "919876543210@c.us",
            "textMessage": "User message",
            "senderData": {
                "senderName": "User Name",
                "senderContactName": "Contact Name"
            }
        }
    }
    """
    try:
        # 1. Filter out outgoing messages (Prevent infinite loop)
        webhook_type = data.get("typeWebhook", "")
        if webhook_type != "incomingMessageReceived":
            return {"status": "ignored", "reason": "not_incoming_message"}

        print(f"📨 WhatsApp Webhook Received: {data}")
        
        message_data = data.get("messageData", {})
        chat_id = message_data.get("chatId", "")
        text_message = message_data.get("textMessage", "")
        sender_name = message_data.get("senderData", {}).get("senderName", "Unknown")
        
        if not text_message:
            return {"status": "no_message"}
        
        print(f"📱 Message from {sender_name}: {text_message}")
        
        # --- ATOMIC AUTO-REPLY LOGIC ---
        
        # Extract phone number from chatId (e.g., "919876543210@c.us" -> "919876543210")
        phone_number = chat_id.split("@")[0]
        
        # safely extract text
        incoming_text = ""
        if isinstance(message_data.get("textMessageData"), dict):
            incoming_text = message_data["textMessageData"].get("textMessage", "")
        else:
             incoming_text = message_data.get("textMessage", "")
             
        if not incoming_text:
             # Try checking extendedTextMessage (sometimes used for replies)
             incoming_text = message_data.get("extendedTextMessageData", {}).get("text", "")
        
        if not incoming_text:
             return {"status": "ignored", "reason": "no_text_content"}

        print(f"Replying to: {incoming_text}")

        if "hello" in incoming_text.lower() or "hi" in incoming_text.lower():
            reply = f"👋 Hello {sender_name}!\n\nWelcome to Nagar Alert Hub.\n\nType 'Report' to file a complaint.\nType 'Status' to check your reports."
            send_green_alert(phone_number, reply)
            
        elif "report" in incoming_text.lower():
            reply = "📸 To report an incident, please open the Nagar Alert App and use the 'Report Incident' feature for verified location tracking."
            send_green_alert(phone_number, reply)
            
        else:
            # Default Echo
            reply = f"🤖 You said: '{incoming_text}'.\n\nI am an automated bot. Type 'Hello' to see options."
            send_green_alert(phone_number, reply)

        return {
            "status": "replied",
            "reply_sent": reply
        }
        
    except Exception as e:
        print(f"❌ Webhook Error: {e}")
        return {"status": "error", "detail": str(e)}


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "WhatsApp Webhook"}
