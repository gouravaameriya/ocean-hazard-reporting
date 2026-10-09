from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reports, analytics, notifications

app = FastAPI(title="Ocean Hazard Reporting API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])

@app.get("/health")
def health_check():
    return {"status": "healthy"}
