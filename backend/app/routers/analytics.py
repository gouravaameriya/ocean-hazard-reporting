from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime
from app.services.nlp import extract_entities_and_sentiment

router = APIRouter()

# Mock social media feed items for demonstration (Sprint 4 & 6)
MOCK_FEEDS = [
    {
        "id": "feed-001",
        "source_platform": "X/Twitter",
        "username": "coastal_watcher_in",
        "post_text": "Massive waves observed near Veraval port! Water entering low-lying jetty areas #CycloneAlert",
        "hazard_category": "High Wave",
        "latitude": 20.9150,
        "longitude": 70.3650,
        "post_created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "feed-002",
        "source_platform": "X/Twitter",
        "username": "fishermen_union_mumbai",
        "post_text": "Strong wind swells near Sassoon Docks Mumbai, all trawlers warned not to venture out tonight.",
        "hazard_category": "Swell Surge",
        "latitude": 18.9167,
        "longitude": 72.8250,
        "post_created_at": datetime.utcnow().isoformat()
    },
    {
        "id": "feed-003",
        "source_platform": "Facebook",
        "username": "GoaMarineRescue",
        "post_text": "Unusually high sea level and rip currents along Morjim Beach. Swimmers advised to stay back.",
        "hazard_category": "Coastal Flooding",
        "latitude": 15.6333,
        "longitude": 73.7333,
        "post_created_at": datetime.utcnow().isoformat()
    }
]

@router.get("/social-feeds")
async def get_social_media_feeds() -> List[Dict[str, Any]]:
    enriched_feeds = []
    for item in MOCK_FEEDS:
        nlp_data = extract_entities_and_sentiment(item["post_text"])
        enriched = {
            **item,
            "sentiment": nlp_data.get("urgency_level", "Alert"),
            "sentiment_score": nlp_data.get("sentiment_score", 0.0),
            "extracted_entities": nlp_data.get("extracted_entities", [])
        }
        enriched_feeds.append(enriched)
    return enriched_feeds

@router.get("/summary")
async def get_analytics_summary():
    return {
        "active_hazards": 3,
        "high_risk_zones": ["Saurashtra Coast", "Mumbai Harbor", "North Goa"],
        "panic_signal_count": 1,
        "alert_signal_count": 2,
        "last_synced": datetime.utcnow().isoformat()
    }
