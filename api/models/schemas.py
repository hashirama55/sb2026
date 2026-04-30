from pydantic import BaseModel
from typing import List

class AnalysisRequest(BaseModel):
    text: str

class AnalysisResponse(BaseModel):
    is_scam: bool
    risk_score: float  # 0 to 100
    category: str
    red_flags: List[str]
    recommendation: str
    summary: str
