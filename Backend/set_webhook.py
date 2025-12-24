import requests
import json

# Your Credentials
INSTANCE_ID = "7105438068"
API_TOKEN = "89308ccf3eca4a5887fcb7fff57fd82910fdfd6c47584fb2a3"
HOST = "https://7105.api.greenapi.com"

# The NEW Tunnel URL 
WEBHOOK_URL = "https://dark-women-juggle.loca.lt/api/v1/webhook/whatsapp"

url = f"{HOST}/waInstance{INSTANCE_ID}/SetSettings/{API_TOKEN}"

payload = {
    "webhookUrl": WEBHOOK_URL,
    "incomingWebhook": "yes",
    "outgoingWebhook": "yes",
    "stateWebhook": "yes"
}

headers = {
  'Content-Type': 'application/json'
}

print(f"🔌 UPDATING Webhook URL to: {WEBHOOK_URL} ...")

try:
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        result = response.json()
        if result.get('saveSettings'):
            print("✅ SUCCESS! Webhook URL updated successfully.")
        else:
            print("⚠️ Response:", result)
    else:
        print(f"❌ Failed: {response.status_code} - {response.text}")

except Exception as e:
    print(f"❌ Error: {e}")
