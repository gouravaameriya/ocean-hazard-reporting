from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HazardReportCreate(BaseModel):
    user_id: str
    hazard_type: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    media_url: Optional[str] = None
    audio_transcript: Optional[str] = None
    offline_queue_id: Optional[str] = None
    is_offline_report: bool = False
    created_at: datetime = datetime.now()

class HazardReportResponse(HazardReportCreate):
    id: str
    status: str
    trust_score: float
    climate_probability: Optional[float] = None
    enhanced_media_url: Optional[str] = None

class NotificationPayload(BaseModel):
    title: str
    body: str
    user_id: Optional[str] = None
    radius_km: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
