from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AnalysisRequest(BaseModel):
    resume_text: str
    jd_text: str
    constraints: Dict[str, Any] = {}

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any] = {}

class AnalysisResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    error: Optional[str] = None
