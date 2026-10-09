import httpx

async def get_marine_weather(latitude: float, longitude: float):
    url = "https://marine-api.open-meteo.com/v1/marine"
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": "wave_height,wave_period,wind_wave_height"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        return None

def calculate_climate_probability(reported_hazard: str, weather_data: dict) -> float:
    if not weather_data or "current" not in weather_data:
        return 0.5
        
    current = weather_data["current"]
    wave_height = current.get("wave_height", 0)
    
    # Simple rule set for demo purposes to simulate scikit-learn probability match
    if reported_hazard.lower() in ["high wave", "swell surge"]:
        if wave_height > 4.0:
            return 0.95
        elif wave_height > 2.5:
            return 0.80
        elif wave_height > 1.5:
            return 0.60
        else:
            return 0.20
            
    return 0.5
