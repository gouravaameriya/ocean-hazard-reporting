from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.models import HazardReportCreate, HazardReportResponse
from app.services.nlp import extract_entities_and_sentiment
from app.services.climate import get_marine_weather, calculate_climate_probability
from app.database import get_supabase
import uuid

router = APIRouter()

@router.post("/", response_model=HazardReportResponse)
async def submit_report(report: HazardReportCreate, background_tasks: BackgroundTasks):
    # 1. NLP Processing (if text/audio transcript exists)
    text_to_analyze = report.description or report.audio_transcript or ""
    nlp_results = extract_entities_and_sentiment(text_to_analyze) if text_to_analyze else {}
    
    # 2. Climate Cross-check
    weather_data = await get_marine_weather(report.latitude, report.longitude)
    climate_prob = calculate_climate_probability(report.hazard_type, weather_data)
    
    # 3. ML Reliability Scoring (scikit-learn with base incremental fallback)
    from app.services.reliability import get_reliability_classifier
    clf = get_reliability_classifier()
    user_reliability = clf.predict_reliability(
        verified_count=3,
        false_alarm_count=0,
        has_media=bool(report.media_url),
        description_length=len(text_to_analyze),
        climate_match_score=climate_prob
    )
    
    # 4. Save to Supabase (Mocked for now if Supabase credentials are empty)
    report_id = str(uuid.uuid4())
    status = "verified" if (climate_prob > 0.85 or user_reliability["is_gold_highlighted"]) else "pending"
    
    # Create response
    response = HazardReportResponse(
        id=report_id,
        status=status,
        trust_score=user_reliability["reliability_score"],
        climate_probability=climate_prob,
        **report.dict()
    )
    
    # TODO: In a real environment, insert into Supabase PostGIS
    # db = get_supabase()
    # db.table('hazard_reports').insert({...}).execute()
    
    return response

@router.get("/")
async def get_reports():
    # TODO: Fetch from Supabase
    return []
