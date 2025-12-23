# Nagar Alert Hub - Backend

This backend is built using **Python (FastAPI)** and integrates deeply with **Google Technologies** to power the "City Intelligence" features.

## 🏗 Tech Stack & Architecture

As per the requirements, we are using the following Google Technologies:

1.  **Google Gemini API**:
    *   **Usage**: Analyzing uploaded images of civic issues (potholes, garbage) to validate them vs fake reports.
    *   **Integration**: `app/services/gemini_service.py`

2.  **Firebase Realtime Database**:
    *   **Usage**: Instant updates to the Admin Dashboard when a mobile user submits a report.
    *   **Integration**: `app/services/firebase_service.py`

3.  **Firebase Cloud Functions (Simulated/Integrated)**:
    *   **Usage**: Triggers for notifications and sorting. *Note: We will implement logic in Python to simulate this or invoke Cloud Functions if deployed.*

4.  **Google Maps Platform**:
    *   **Usage**: Geocoding and reverse geocoding to pinpoint incident locations.
    *   **Integration**: `app/services/maps_service.py`

5.  **Google BigQuery**:
    *   **Usage**: Warehousing historical data to find "repeated city problems" and generate heatmaps.
    *   **Integration**: `app/services/bigquery_service.py`

## 🚀 Setup Instructions

### 1. Environment Setup
```bash
# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Install Dependencies
pip install -r requirements.txt
```

### 2. Google Credentials
You need a `serviceAccountKey.json` from Firebase Console and API Keys for Gemini/Maps.
1.  Rename `.env.example` to `.env`.
2.  Add your keys.

### 3. Run Server
```bash
uvicorn app.main:app --reload
```
