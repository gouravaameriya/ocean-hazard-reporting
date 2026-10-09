# Integrated Platform for Crowdsourced Ocean Hazard Reporting & Social Media Analytics
**SKIT Project ID:** `SKIT/DS/2023-2027/14`  
**Target Evaluation:** Working Prototype & Mid-Term Milestone (Sprint 1 through Sprint 6)  
**Based on:** Smart India Hackathon (SIH) Problem Statement ID `25039`  
**Organization:** Ministry of Earth Sciences (MoES) — Indian National Centre for Ocean Information Services (INCOIS)

---

## 🌊 Overview
India has a coastline spanning over 7,500 km. While INCOIS utilizes satellites, radar, and deep-sea buoys for ocean hazard forecasting, there remains a critical "ground-truth" verification gap from citizens and fishers experiencing hazards firsthand. Furthermore, during emergencies, unstructured social chatter on social media is noisy and disconnected from decision-making control rooms.

This platform bridges that gap with:
1. **Offline-First PWA for Fishermen & Citizens:** Designed for zero-connectivity zones, low-light operations (Nautical Red-Light Night Mode), and voice dictation via Web Speech API.
2. **AI & Computer Vision Microservice:** Automated image usability analysis (OpenCV Laplacian blur detection & unsharp masking), NLP entity/sentiment extraction (spaCy + VADER), and ML user reliability scoring.
3. **Automated Environmental Ground-Truth Cross-Check:** Live validation against Open-Meteo Marine API wave height, swell period, and wind speed.
4. **GIS Control-Room Dashboard:** Interactive Leaflet.js dashboard with clustered markers, risk heatmaps, marine wave risk bands, and social media feed overlays.

---

## 👥 Project Team & Roles
- **Gourav Ameriya (23ESKCA046):** Team Lead — System Architecture, Backend Integration & Technical Coordination
- **Harshit Sharma (23ESKCA050):** Member 1 — AI/ML, NLP, Computer Vision & Reliability Engine Lead
- **Divyanshu Dayal (23ESKCA039):** Member 2 — Frontend, PWA, Offline-First UX & Accessibility Lead
- **Manan Sharma (23ESKCA065):** Member 3 — GIS, Spatial Analytics, QA, Notifications & Deployment Lead
- **Supervisor:** Ms. Anamika Soni, Assistant Professor, Dept of CSE, SKIT Jaipur

---

## 🛠️ Technology Stack
| Layer | Technologies | Free Tier / Integration Details |
|---|---|---|
| **Frontend & PWA** | React 18 (Vite), Tailwind CSS, Service Workers, IndexedDB, Web Speech API | Offline caching, mobile-first responsive layout, zero cost |
| **Mapping & GIS** | Leaflet.js, React-Leaflet, OpenStreetMap | Marker clustering, risk heatmaps, zero API caps |
| **Backend & APIs** | Python 3.10+, FastAPI, Pydantic, Uvicorn | High-performance asynchronous microservice |
| **Database & Spatial** | Supabase (PostgreSQL 15+ with PostGIS) | PostGIS `GEOMETRY(Point, 4326)` & spatial GIST indexes |
| **AI / CV / NLP** | OpenCV (`cv2`), spaCy (`en_core_web_sm`), NLTK / VADER, scikit-learn | Blur detection, unsharp masking, urgency & entity extraction |
| **Marine Environmental Data**| Open-Meteo Marine API | Keyless REST API for live ocean wave height, period, wind speed |
| **Alerts & Notifications** | Web Push API, Twilio SMS fallback gateway | Targeted geospatial push notifications & offline SMS bridge |

---

## 📁 Repository Structure
```text
ocean_hazard_reporting/
├── .gitignore
├── README.md
├── schema.sql                     # Supabase PostGIS schema & spatial indexes
├── setup.ps1                      # Windows PowerShell automated setup script
│
├── backend/                       # Python FastAPI Microservice
│   ├── requirements.txt           # Python dependencies
│   └── app/
│       ├── __init__.py
│       ├── main.py                # FastAPI entry point, CORS, and route registration
│       ├── database.py            # Supabase database connection helper
│       ├── models.py              # Pydantic data schemas
│       ├── routers/
│       │   ├── __init__.py
│       │   ├── reports.py         # Report submission & orchestration pipeline
│       │   ├── analytics.py       # Social media & GIS aggregation endpoints
│       │   └── notifications.py   # Web Push & Twilio SMS fallback handler
│       └── services/
│           ├── __init__.py
│           ├── vision.py          # OpenCV blur detection & unsharp masking
│           ├── nlp.py             # spaCy NER & VADER urgency sentiment analysis
│           ├── climate.py         # Open-Meteo Marine API live cross-validation
│           └── reliability.py     # scikit-learn user reliability classifier
│
└── frontend/                      # React (Vite) Offline-First PWA
    ├── package.json
    ├── vite.config.js             # Vite PWA plugin & runtime caching rules
    ├── tailwind.config.js         # Nautical red-on-black color scheme
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── index.css              # Global styles & Leaflet container styling
        ├── main.jsx               # React DOM entry point
        ├── App.jsx                # View switcher & Night Mode state manager
        └── components/
            ├── ReportForm.jsx     # GPS capture, Web Speech voice notes, offline queue
            └── MapDashboard.jsx   # Interactive Leaflet GIS analyst dashboard
```

---

## 🚀 Getting Started

### 1. Database Setup (Supabase PostGIS)
1. Open your [Supabase Dashboard](https://supabase.com).
2. Navigate to the **SQL Editor**.
3. Run the contents of [`schema.sql`](schema.sql) to enable PostGIS, create tables (`users`, `hazard_reports`, `social_media_feeds`), and create spatial GIST indexes.

### 2. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv

# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8000
```
Interactive API documentation will be available at `http://localhost:8000/docs`.

### 3. Frontend Setup (React PWA)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌟 Key Features (Sprint 1 through 6)
- **Offline-First Resilience:** Reports are captured in IndexedDB during network loss and synchronized automatically via Service Workers upon reconnection.
- **Nautical Red-Light Night Mode:** Red-on-black palette (`#000000` surface, `#FF1E1E` highlights) preserving dark adaptation for deep-sea fishers at 2 AM.
- **Voice-to-Text Reporting:** Web Speech API integration for hands-free report creation on moving vessels.
- **Computer Vision Blur Salvaging:** OpenCV Laplacian variance analysis with automatic unsharp masking and histogram equalization for motion-blurred evidence.
- **Multimodal AI Verification:** spaCy geographic entity extraction + VADER urgency scoring combined with Open-Meteo live marine wave checks.
- **GIS Analyst Control Room:** Leaflet.js real-time mapping with risk-colored wave bands (Green <1.5m, Yellow 1.5–2.5m, Orange 2.5–4m, Red >4m) and mock social chatter overlays.
