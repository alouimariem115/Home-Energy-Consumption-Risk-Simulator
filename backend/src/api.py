from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd 
import joblib 
import os
from src.predict import ( predict_energy,
    update_threshold,
    reset_threshold,
    get_current_threshold,
    get_default_threshold
)


app = FastAPI(
    title="Energy Consumption Prediction API",
    description = "FastAPI backend an serving xgboost energy model",
    version = "1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Smart Home AI Backend is running"}


#input schema 

class EnergyInput (BaseModel):
    household_size: int = Field(..., gt=0, description="Number of people in the house")
    outdoor_temperature: float = Field(..., description="Outdoor temperature in °C")
    appliance_type: str = Field(..., description="Type of appliance")
    timestamp: datetime = Field(..., description="Timestamp of usage")

def build_features(data: EnergyInput) -> pd.DataFrame:
    dt = data.timestamp
    features = {
        "Home ID": 1,  
        "Household Size": data.household_size,
        "Outdoor Temperature (°C)": data.outdoor_temperature,   
        "Year": dt.year,
        "Month": dt.month,
        "Day": dt.day,
        "DayOfWeek": dt.weekday(),
        "Hour": dt.hour,
    }
    appliance_types = [
        "Computer", "Dishwasher", "Fridge", "Heater", "Lights",
        "Microwave", "Oven", "TV", "Washing Machine"
    
    ]
    for a in appliance_types:
        features[f"Appliance Type_{a}"] = int ( a == data.appliance_type)
        
        if dt.month in [12,1,2]:
            season = "Winter"
        elif dt.month in [3,4,5]:
            season = "Spring" 
        else:
            season = "Summer"
            
    for s in ["Spring", "Summer", "Winter"]:
        features[f"Season_{s}"] = int ( s == season)
    
    return pd.DataFrame([features])          
        

#health check endpoint
@app.get ("/health")
def health_check():
    return {"status": "API is running"}

#@app.get("/threshold")
#def get_threshold():
 #   return {
 #       "current_threshold": get_current_threshold(),
 #       "default_threshold": get_default_threshold()
#    }
    
    
#class ThresholdInput(BaseModel):
 #   threshold: float = Field(..., ge=0.0, le=1.0)


#@app.post("/update-threshold")
#def change_threshold(data: ThresholdInput):
 #   update_threshold(data.threshold)
   # return {
  #      "message": "Threshold updated successfully",
     #   "new_threshold": get_current_threshold()
   # }
    
    
#@app.post("/reset-threshold")
#def restore_default():
 #   reset_threshold()
  #  return {
  #      "message": "Threshold reset to training default",
  #      "current_threshold": get_current_threshold()
   # }

class ThresholdInput(BaseModel):
    threshold: float = Field(..., ge=0.0, le=1.0)

@app.post("/set-threshold")
def set_threshold(data: ThresholdInput):
    update_threshold(data.threshold)
    return {
        "message": "Threshold updated successfully",
        "current_threshold": get_current_threshold()
    }

@app.post("/reset-threshold")
def reset_threshold_api():
    reset_threshold()
    return {
        "message": "Threshold reset to default",
        "current_threshold": get_current_threshold()
    }

@app.get("/get-threshold")
def get_threshold():
    return {
        "current_threshold": get_current_threshold(),
        "default_threshold": get_default_threshold()
    }


#prediction endpoint
@app.post("/predict")
def predict(input_data: EnergyInput):
    df = build_features(input_data)
    prob, decision, threshold, explanation = predict_energy(df)

    return {
        "probability_high": float(prob),
        "decision": decision,
        "threshold_used": float(threshold),
        "top_features": explanation
    }
    