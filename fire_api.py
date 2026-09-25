from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from pathlib import Path
from PIL import Image
import io
import base64
import joblib
import numpy as np
from typing import Optional
from pydantic import BaseModel

app = FastAPI(title="iFire Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = Path("best.pt")
model = YOLO(MODEL_PATH)

try:
    ML_MODEL_PATH = Path("models/risk_prediction_rf.pkl")
    ml_model = joblib.load(ML_MODEL_PATH)
    print(f"ML Model loaded: {ML_MODEL_PATH}")
    
    # Load metadata
    import json
    with open('models/model_metadata.json', 'r') as f:
        ml_metadata = json.load(f)
    print(f"   Accuracy: {ml_metadata['accuracy']*100:.2f}%")
except Exception as e:
    print(f"Warning: Could not load ML model: {e}")
    ml_model = None
    ml_metadata = {}

print(f"Model loaded: {MODEL_PATH}")
print(f"API ready at: http://localhost:8000")


# Class name mapping (Chinese to English)
CLASS_MAPPING = {
    "火": "fire",
    "烟": "smoke",
    "火焰": "fire",
    "烟雾": "smoke",
}

print(f"Model loaded: {MODEL_PATH}")
print(f"Model classes: {model.names}")
print(f"API ready at: http://localhost:8000")

@app.get("/")
def root():
    return {
        "message": "iFire Detection API",
        "version": "1.0",
        "model": "YOLOv8m",
        "classes": ["fire", "smoke"],
        "accuracy": {
            "mAP50": 0.803,
            "precision": 0.849,
            "recall": 0.767
        }
    }

@app.post("/detect")
async def detect_fire(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        results = model.predict(
            image,
            conf=0.4,
            iou=0.5,
            verbose=False
        )
        
        detections = []
        fire_detected = False
        smoke_detected = False
        max_confidence = 0
        
        for result in results:
            boxes = result.boxes
            
            print(f"DEBUG: Found {len(boxes)} boxes")  # DEBUG
            
            for box in boxes:
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                xyxy = box.xyxy[0].tolist()
                
                # Get class name
                class_name = model.names[cls] if cls in model.names else str(cls)
                print(f"DEBUG: Raw class={cls}, name={class_name}, conf={conf:.3f}")
                
                # Translate Chinese to English
                class_name_english = CLASS_MAPPING.get(class_name, class_name)
                class_name_lower = class_name_english.lower()
                print(f"DEBUG: Translated to: {class_name_english}")
                
                # Check for fire/smoke
                if "fire" in class_name_lower:
                    fire_detected = True
                elif "smoke" in class_name_lower:
                    smoke_detected = True
                
                max_confidence = max(max_confidence, conf)
                
                detections.append({
                    "class": class_name_english,
                    "confidence": round(conf, 3),
                    "bbox": {
                        "x1": round(xyxy[0]),
                        "y1": round(xyxy[1]),
                        "x2": round(xyxy[2]),
                        "y2": round(xyxy[3])
                    }
                })
        
        print(f"DEBUG: Total detections={len(detections)}, fire={fire_detected}, smoke={smoke_detected}")
        
        if max_confidence >= 0.8:
            risk_level = "Critical"
        elif max_confidence >= 0.6:
            risk_level = "High"
        elif max_confidence >= 0.4:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        response = {
            "fireDetected": fire_detected or smoke_detected,
            "detections": detections,
            "summary": {
                "fireDetected": fire_detected,
                "smokeDetected": smoke_detected,
                "totalDetections": len(detections),
                "maxConfidence": round(max_confidence, 3),
                "riskLevel": risk_level
            }
        }
        
        print(f"DEBUG: Response={response['fireDetected']}, detections count={len(response['detections'])}")
        
        return response
        
    except Exception as e:
        return {
            "error": str(e),
            "fireDetected": False,
            "detections": []
        }

@app.get("/health")
def health():
    return {"status": "healthy", "model": "loaded"}

# Pydantic model for risk prediction request
class RiskPredictionRequest(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    rainfall_7d: float
    consecutive_dry_days: int = 0
    soil_moisture: Optional[float] = None
    land_type: int = 0  # 0=mineral, 1=peat
    location: Optional[str] = "Sumatra"

# Risk prediction endpoint
@app.post("/predict-risk")
async def predict_risk(data: RiskPredictionRequest):
    """
    Predict fire risk based on environmental parameters
    
    Parameters:
    - temperature: Temperature in Celsius (24-38°C)
    - humidity: Relative humidity in % (25-95%)
    - wind_speed: Wind speed in km/h (0-45)
    - rainfall_7d: Total rainfall in last 7 days (mm)
    - consecutive_dry_days: Number of consecutive days without rain
    - soil_moisture: Soil moisture % (optional, auto-calculated if not provided)
    - land_type: 0 for mineral soil, 1 for peat/gambut
    - location: Location name (optional)
    
    Returns:
    - risk_level: Low, Medium, High, or Critical
    - risk_score: Probability score (0-1)
    - probabilities: Probability for each class
    - confidence: Confidence in prediction
    - recommendation: Action recommendation
    """
    
    if ml_model is None:
        return {
            "error": "ML model not loaded",
            "risk_level": "Unknown",
            "risk_score": 0,
            "recommendation": "Model unavailable"
        }
    
    try:
        # Calculate derived features
        month = 7  # Default to July (dry season) - can be made dynamic
        
        # Auto-calculate soil moisture if not provided
        if data.soil_moisture is None:
            soil_moisture = 100 - (data.consecutive_dry_days * 2.5 + (35 - data.temperature) * 0.5)
            soil_moisture = max(10, min(95, soil_moisture))  # Clip to valid range
        else:
            soil_moisture = data.soil_moisture
        
        # Prepare features (must match training order)
        features = np.array([[
            data.temperature,
            data.humidity,
            data.wind_speed,
            data.rainfall_7d,
            data.consecutive_dry_days,
            soil_moisture,
            data.land_type,
            month
        ]])
        
        # Predict
        prediction = ml_model.predict(features)[0]
        probabilities = ml_model.predict_proba(features)[0]
        
        # Get class probabilities
        classes = ml_model.classes_  # ['Critical', 'High', 'Low', 'Medium']
        prob_dict = {cls: float(prob) for cls, prob in zip(classes, probabilities)}
        
        # Calculate overall risk score (weighted by severity)
        risk_weights = {'Low': 0.1, 'Medium': 0.4, 'High': 0.7, 'Critical': 1.0}
        risk_score = sum(prob_dict.get(cls, 0) * risk_weights[cls] for cls in risk_weights)
        
        # Confidence is the max probability
        confidence = float(max(probabilities))
        
        # Generate recommendation
        if prediction == "Critical":
            recommendation = "CRITICAL: Immediate action required. Deploy firefighting resources. Avoid any open flames or burning activities."
        elif prediction == "High":
            recommendation = "HIGH RISK: Close monitoring needed. Prepare firefighting equipment. Restrict outdoor burning."
        elif prediction == "Medium":
            recommendation = "MEDIUM RISK: Stay vigilant. Monitor weather conditions. Be prepared for rapid changes."
        else:
            recommendation = "LOW RISK: Normal monitoring. Continue fire prevention awareness."
        
        # Determine alert level
        if confidence > 0.8:
            alert_level = "High Confidence"
        elif confidence > 0.6:
            alert_level = "Medium Confidence"
        else:
            alert_level = "Low Confidence"
        
        response = {
            "risk_level": prediction,
            "risk_score": round(risk_score, 3),
            "confidence": round(confidence, 3),
            "probabilities": {
                "Low": round(prob_dict.get('Low', 0), 3),
                "Medium": round(prob_dict.get('Medium', 0), 3),
                "High": round(prob_dict.get('High', 0), 3),
                "Critical": round(prob_dict.get('Critical', 0), 3)
            },
            "recommendation": recommendation,
            "alert_level": alert_level,
            "input_parameters": {
                "temperature": data.temperature,
                "humidity": data.humidity,
                "wind_speed": data.wind_speed,
                "rainfall_7d": data.rainfall_7d,
                "consecutive_dry_days": data.consecutive_dry_days,
                "soil_moisture": round(soil_moisture, 1),
                "land_type": "Peat/Gambut" if data.land_type == 1 else "Mineral Soil",
                "location": data.location
            },
            "model_info": {
                "model_type": "Random Forest",
                "accuracy": round(ml_metadata.get('accuracy', 0) * 100, 2),
                "trained_samples": ml_metadata.get('training_samples', 0)
            }
        }
        
        return response
        
    except Exception as e:
        return {
            "error": str(e),
            "risk_level": "Error",
            "risk_score": 0,
            "recommendation": "Unable to predict risk due to error"
        }

# Get model info endpoint
@app.get("/model-info")
def get_model_info():
    """Get information about loaded models"""
    return {
        "fire_detection": {
            "model": "YOLOv8m",
            "accuracy": {
                "mAP50": 0.803,
                "precision": 0.849,
                "recall": 0.767
            },
            "classes": ["fire", "smoke"],
            "status": "loaded"
        },
        "risk_prediction": {
            "model": "Random Forest",
            "status": "loaded" if ml_model else "not loaded",
            "accuracy": round(ml_metadata.get('accuracy', 0) * 100, 2) if ml_metadata else 0,
            "features": [
                "temperature", "humidity", "wind_speed", "rainfall_7d",
                "consecutive_dry_days", "soil_moisture", "land_type", "month"
            ],
            "classes": ["Low", "Medium", "High", "Critical"],
            "training_samples": ml_metadata.get('training_samples', 0) if ml_metadata else 0
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)