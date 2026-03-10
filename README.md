
# Smart Home Energy Risk Simulator

This project is an end-to-end demo of a smart home **energy consumption risk simulator** powered by a binary classification model (HIGH vs NORMAL).
Instead of controlling real devices, the app lets you explore **what‑if scenarios**:
- Choose a **household size**, **outdoor temperature**, **appliance type**, and **time of use**.
- The backend model estimates the **probability of HIGH energy consumption**.
- A configurable **decision threshold** converts that probability into a **HIGH / NORMAL** classification.
- The dashboard shows explanations (SHAP), history, and saved HIGH‑risk simulations.
---
## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Using the Simulator](#using-the-simulator)
- [API Overview](#api-overview)
- [Possible Extensions](#possible-extensions)

---
## Features
- **Energy Consumption Risk Simulator**
  - Interactive form to simulate scenarios (household size, temperature, appliance, timestamp).
  - Clear explanation that this is a *what‑if* simulator, not real device control.
- **Binary AI Model with Probability**
  - Trained model outputs \( P(\text{HIGH}) \) for each scenario.
  - Adjustable **decision threshold** to control sensitivity (more or fewer HIGH classifications).
- **Explainability (SHAP)**
  - Shows top factors influencing the HIGH class for each simulation.
  - Highlights which features **increase** or **decrease** predicted risk.
- **Simulation Analytics**
  - History of all simulations (time, appliance, probability, decision).
  - Pie chart and line chart of HIGH vs NORMAL and probability trends.
  - Average simulated HIGH‑risk probability.
- **Saved HIGH‑Risk Simulations**
  - Automatically stores scenarios where the model classified risk as HIGH.
  - Separate page to review these **saved HIGH‑risk simulations** later.
- **Threshold Tuning**
  - Settings page to adjust the decision threshold used by the backend model.
  - Threshold is applied consistently in predictions and visualizations.
---
## Architecture
The project follows a standard **ML model + API + frontend dashboard** pattern.
- **Backend (FastAPI, Python)**
  - Loads a trained binary classification model (e.g. XGBoost) and preprocessing artifacts.
  - Exposes HTTP endpoints for prediction and threshold management.
  - Builds a feature vector from user inputs:
    - Household size
    - Outdoor temperature
    - Appliance type (one‑hot encoded)
    - Time features: year, month, day, day of week, hour, season
  - Computes:
    - Probability of HIGH consumption
    - Final decision (HIGH / NORMAL) based on the current threshold
    - SHAP values for explainability
- **Frontend (React)**
  - Provides a modern dashboard UI around the API:
    - Simulator form and result card
    - Analytics and charts
    - Threshold settings
    - Saved HIGH‑risk simulations
  - Persists history and alerts in `localStorage` for a simple demo experience.
---
## Tech Stack
**Backend**
- Python
- FastAPI
- pandas
- joblib
- shap
- XGBoost / scikit‑learn (for the trained model)

**Frontend**
- React (Create React App)
- Tailwind CSS
- Recharts (charts)
- react-hot-toast (notifications)
---
## Project Structure
High-level layout (only main parts shown):
```text
smart_home_AI_project/
├─ backend/
│  ├─ model/                 # Trained model & preprocessing artifacts
│  └─ src/
│     ├─ api.py              # FastAPI app, endpoints
│     └─ predict.py          # Prediction pipeline, threshold + SHAP logic
├─ frontend/
│  ├─ src/
│  │  ├─ pages/
│  │  │  ├─ dashboard.jsx    # Main simulator dashboard
│  │  │  ├─ analytics.jsx    # Analytics & history
│  │  │  ├─ Alerts.jsx       # Saved HIGH‑risk simulations
│  │  │  └─ settings.jsx     # Threshold settings
│  │  ├─ components/
│  │  │  ├─ layout/          # Header, Sidebar, layout components
│  │  │  └─ prediction/      # Form, result, SHAP explanation, recommendations
│  │  └─ context/
│  │     └─ AlertsContext.jsx
│  └─ README.md              # CRA boilerplate (optional)
├─ README.md                 # You are here
└─ ...                       # venv, config, etc.

```
## Getting Started

Follow these steps to run the project locally.

### Backend

**From the `backend/` directory:**



Activate the virtual environment (Windows):
```bash
# (Optional) create and activate a virtual environment
# python -m venv venv
# venv\Scripts\activate  # on Windows

```
Install dependencies:
```bash
pip install -r requirements.txt
```
Start the API server:
```bash
uvicorn src.api:app --reload --host 127.0.0.1 --port 8000
```
Verify it is running:
```bash
http://127.0.0.1:8000/
http://127.0.0.1:8000/health
```
### Frontend

**From the frontend/ directory:**
```bash
npm install
npm start
```
Open the application in your browser:
```bash
http://localhost:3000
```
The frontend communicates with the backend at:
```bash
http://127.0.0.1:8000
```

## Using the Simulator

### 1. Run a Simulation

1. Go to the **Dashboard**.
2. In the **Energy Consumption Risk Simulator** form:
   - Enter **household size**
   - Enter **outdoor temperature**
   - Select an **appliance**
   - Choose a **timestamp** (date and time of use)
3. Click **"Run Risk Simulation"**.

### 2. Prediction Results

After running the simulation, the dashboard displays:

- **Probability of HIGH consumption** (risk score as a percentage)
- **Decision**: `HIGH` or `NORMAL` (based on the current threshold)
- A **risk bar** colored according to whether the probability exceeds the threshold
- **Model confidence**
- The **decision threshold used**
- **Recommendations** for HIGH-risk scenarios (appliance-specific where possible)
- **Top factors influencing HIGH risk** using SHAP explanations  
  - Features that **increase risk**
  - Features that **decrease risk**

---

### 3. Simulation History

Every simulation is automatically stored in the **history**.

---

### 4. Analytics Page

The **Analytics** page displays:

- Total number of simulations
- Number of **HIGH-risk** vs **NORMAL** classifications
- **Average simulated HIGH-risk probability**
- A **probability trend chart** across simulations
- A **table of all simulations** including:
  - Date and time
  - Appliance used
  - Probability of HIGH
  - Final decision

---

### 5. Saved HIGH-Risk Simulations

The **Saved HIGH-risk simulations** page shows:


 Only scenarios where the model predicted **HIGH consumption**
- Appliance type
- Probability of HIGH
- Timestamp of the simulation

---

### 6. Adjusting the Threshold

You can modify the **decision threshold** in the **Settings** page.

Changing the threshold allows you to:

- Make the model **more sensitive** to HIGH risk (lower threshold)
- Make the model **less sensitive** to HIGH risk (higher threshold)

## API Overview

Main backend endpoints (FastAPI):

### GET /

**Description:**  
Simple message to confirm the backend is running.

---

### GET /health

**Description:**  
Health check endpoint.

---

### POST /predict

**Description:**  
Runs the AI model and returns the probability of HIGH energy consumption.

**Request Body (JSON)**

```json
{
  "household_size": 4,
  "outdoor_temperature": 25.0,
  "appliance_type": "Heater",
  "timestamp": "2025-03-01T18:00:00"
}
```
**Response (JSON, example):**
```json
{
  "probability_high": 0.72,
  "decision": "HIGH",
  "threshold_used": 0.7,
  "top_features": [
    { "Feature": "Appliance Type_Heater", "impact": 0.45 },
    { "Feature": "Outdoor Temperature (°C)", "impact": 0.18 }
  ]
}
```
### GET /get-threshold
**Description:**
Returns current and default threshold.

### POST /set-threshold
**Description:**
```json
Body: {"threshold": 0.65}
```
### POST /reset-threshold
**Description:** 

Resets to model’s default threshold


## **Possible Extensions**

### Some ideas for future improvements:

- **Real data integration**

  - Connect to smart‑home sensors or an energy meter API.
  - Replace manual inputs with live data streams.

- **Weather integration**

  - Use a weather API to fetch current or forecast temperatures instead of manual entry.

- **Multi-home support**

  - Add a “Home” selector and feed a real Home ID feature into the model.

- **User accounts**

  - Store simulation history per user, not just in localStorage.
