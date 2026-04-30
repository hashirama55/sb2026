from google import genai
from api.core.config import settings
from api.models.schemas import AnalysisResponse
import json

SYSTEM_PROMPT = """
You are an expert Scam Detection AI. Your goal is to analyze messages for deceptive intent, fraudulent patterns, and deepfake characteristics.
Analyze the provided text and identify if it is a scam. 
Focus on:
1. Urgency and pressure.
2. Requests for sensitive information or money transfers (especially crypto/gift cards).
3. Inconsistencies or unusual grammar/tone.
4. Promises of high returns or "too good to be true" offers.

You MUST return a JSON object with the following fields:
{
  "is_scam": boolean,
  "risk_score": float (0-100),
  "category": "e.g., Financial, Job, Emergency, Phishing",
  "red_flags": ["list", "of", "reasons"],
  "recommendation": "specific advice for the user",
  "summary": "a brief explanation of your analysis"
}
"""

def analyze_text_content(text: str) -> AnalysisResponse:
    client = genai.Client(api_key=settings.google_api_key)
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=f"{SYSTEM_PROMPT}\n\nAnalyze this message:\n{text}",
        config={
            'response_mime_type': 'application/json',
        }
    )
    
    data = json.loads(response.text)
    return AnalysisResponse(**data)
