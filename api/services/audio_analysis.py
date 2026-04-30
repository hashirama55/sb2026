from google import genai
from google.genai import types
from api.core.config import settings
from api.models.schemas import AnalysisResponse
import json
import os

AUDIO_SYSTEM_PROMPT = """
You are an expert Audio Scam and Deepfake Detection AI. 
You will be provided with an audio file. Your task is to:
1. Transcribe the audio (internally).
2. Analyze the content for scam intent (urgency, financial requests, pressure).
3. Analyze the audio quality and characteristics for signs of "Deepfakes" or synthetic speech (unnatural cadence, lack of emotional depth, robotic tone, inconsistent background noise).

You MUST return a JSON object with the following fields:
{
  "is_scam": boolean,
  "risk_score": float (0-100),
  "category": "e.g., Deepfake Voice, Emergency Scam, Job Fraud",
  "red_flags": ["list", "of", "reasons, including audio markers"],
  "recommendation": "specific advice for the user",
  "summary": "a brief explanation of your analysis of both content and audio reality"
}
"""

def analyze_audio_content(file_path: str, mime_type: str) -> AnalysisResponse:
    print(f"Analyzing audio: {file_path} with mime_type: {mime_type}")
    client = genai.Client(api_key=settings.google_api_key)
    
    # Upload the file with explicit mime type
    with open(file_path, 'rb') as f:
        print("Uploading file to Google Files API...")
        file_upload = client.files.upload(
            file=f,
            config=types.UploadFileConfig(mime_type=mime_type)
        )
    print(f"File uploaded successfully: {file_upload.name}")
    
    print(f"Generating content using model: gemini-2.5-flash")
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[
            AUDIO_SYSTEM_PROMPT,
            file_upload
        ],
        config={
            'response_mime_type': 'application/json',
        }
    )
    
    print("Response received from Gemini")
    data = json.loads(response.text)
    return AnalysisResponse(**data)
