import joblib
import pandas as pd
import os
import shap 
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
print("SERVER STARTED - THRESHOLD RESET TO DEFAULT")

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

# Load artifacts
model = joblib.load(os.path.join(MODEL_DIR, "energy_model.pkl"))
scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
feature_columns = joblib.load(os.path.join(MODEL_DIR, "feature_columns.pkl"))
default_threshold = joblib.load(os.path.join(MODEL_DIR, "threshold.pkl"))
current_threshold = default_threshold
explainer = shap.TreeExplainer(model)

def predict_energy(input_df: pd.DataFrame):
    global current_threshold    
    """
    Predict probability + decision from raw input dataframe
    """

    # 1. Check columns
    missing_cols = set(feature_columns) - set(input_df.columns)
    if missing_cols:
        raise ValueError(f"Missing columns: {missing_cols}")

    # 2. Reorder columns
    X = input_df[feature_columns]

    # 3. Scale
    X_scaled = scaler.transform(X)

    # 4. Predict
    prob = model.predict_proba(X_scaled)[0][1]

    #5. Apply tuned threshold 
    decision = "HIGH" if prob >= current_threshold else "NORMAL"
    
    shap_values = explainer.shap_values(X_scaled)
    if isinstance(shap_values, list):
        shap_for_class1 = shap_values[1][0]
    else:
        shap_for_class1 = shap_values[0]
    
    shap_pairs = list(zip(feature_columns, shap_for_class1))
    shap_pairs = sorted(shap_pairs, key=lambda x: abs(x[1]), reverse=True)
    top_features = shap_pairs[:5]
    explanation = [
        {"Feature": f, "impact": float(val)}
        for f, val in top_features
    ]
    
    return prob, decision, current_threshold, explanation

# ✅ QUICK LOCAL TEST (MANDATORY)
if __name__ == "__main__":
    sample = pd.DataFrame([{
        "Home ID": 1,
        "Household Size": 3,
        "Outdoor Temperature (°C)": 22.5,
        "Year": 2023,
        "Month": 6,
        "Day": 15,
        "DayOfWeek": 3,
        "Hour": 18,

        # Appliance one-hot
        "Appliance Type_Computer": 0,
        "Appliance Type_Dishwasher": 0,
        "Appliance Type_Fridge": 1,
        "Appliance Type_Heater": 0,
        "Appliance Type_Lights": 1,
        "Appliance Type_Microwave": 0,
        "Appliance Type_Oven": 0,
        "Appliance Type_TV": 0,
        "Appliance Type_Washing Machine": 0,

        # Season one-hot
        "Season_Spring": 0,
        "Season_Summer": 1,
        "Season_Winter": 0
    }])

    prob, decision, threshold, explanation = predict_energy(sample)
    
    
    print("Probability:", prob)
    print("Decision:",decision)
    print("Threshold used:", threshold)

def update_threshold(new_threshold: float):
    global current_threshold
    current_threshold = float(new_threshold)


def reset_threshold():
    global current_threshold
    current_threshold = default_threshold


def get_current_threshold():
    return current_threshold


def get_default_threshold():
    return default_threshold