from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from api.models.schemas import AnalysisRequest, AnalysisResponse
from api.services.text_analysis import analyze_text_content
from api.services.audio_analysis import analyze_audio_content
import shutil
import os
import tempfile

app = FastAPI(title="Scam Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Scam Detection API is running"}

@app.post("/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: AnalysisRequest):
    try:
        result = analyze_text_content(request.text)
        return result
    except Exception as e:
        error_msg = str(e)
        if "RESOURCE_EXHAUSTED" in error_msg:
            raise HTTPException(status_code=429, detail="API Rate Limit reached. Please wait a minute and try again.")
        if "API_KEY_INVALID" in error_msg or "expired" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid or expired Google API Key. Please check your .env file.")
        raise HTTPException(status_code=500, detail=error_msg)

@app.post("/analyze/audio", response_model=AnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    try:
        suffix = os.path.splitext(file.filename)[1] if file.filename else ".tmp"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name
        
        result = analyze_audio_content(tmp_path, file.content_type)
        
        os.unlink(tmp_path)
        return result
    except Exception as e:
        if 'tmp_path' in locals() and os.path.exists(tmp_path):
            os.unlink(tmp_path)
        error_msg = str(e)
        if "API_KEY_INVALID" in error_msg or "expired" in error_msg.lower():
            raise HTTPException(status_code=401, detail="Invalid or expired Google API Key. Please check your .env file.")
        raise HTTPException(status_code=500, detail=error_msg)
