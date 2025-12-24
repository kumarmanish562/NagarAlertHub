import requests
from app.core.config import settings

def send_green_alert(phone_number: str, message: str) -> bool:
    """
    Sends a text message via Green-API (WhatsApp).
    """
    # 1. Check if keys are set
    if not settings.GREEN_API_ID_INSTANCE or not settings.GREEN_API_API_TOKEN:
        print("⚠️ Green-API Credentials missing in .env")
        return False

    # 2. Prepare URL
    url = f"https://api.green-api.com/waInstance{settings.GREEN_API_ID_INSTANCE}/sendMessage/{settings.GREEN_API_API_TOKEN}"

    # 3. Format Phone Number (Green-API needs '919876543210@c.us')
    clean_phone = phone_number.replace("+", "").strip()
    chat_id = f"{clean_phone}@c.us"

    payload = {
        "chatId": chat_id,
        "message": message
    }

    headers = {
        'Content-Type': 'application/json'
    }

    try:
        # 4. Send Request
        response = requests.post(url, headers=headers, json=payload)
        
        if response.status_code == 200:
            print(f"✅ WhatsApp sent to {clean_phone}")
            return True
        else:
            print(f"❌ Failed to send to {clean_phone}: {response.text}")
            return False
            
    except Exception as e:
        print(f"⚠️ WhatsApp Service Error: {e}")
        return False