import google.generativeai as genai
from app.core.config import settings

class GeminiService:
    def __init__(self):
        if settings.GOOGLE_GEMINI_API_KEY:
            genai.configure(api_key=settings.GOOGLE_GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-pro-vision')
        else:
            print("Warning: Gemini API Key not found.")
            self.model = None

    async def analyze_image(self, image_data, prompt="Describe this image"):
        """
        Analyzes an image to detect if it contains specific civic issues
        like potholes, garbage dumps, or fire.
        
        Args:
            image_data: The image bytes or PIL object.
            prompt: The instruction for Gemini.
        """
        if not self.model:
            return {"error": "Gemini Service not configured"}

        try:
            # Note: This is a simplified call. Real usage requires handling image formats.
            response = self.model.generate_content([prompt, image_data])
            return {"analysis": response.text}
        except Exception as e:
            return {"error": str(e)}

gemini_service = GeminiService()
