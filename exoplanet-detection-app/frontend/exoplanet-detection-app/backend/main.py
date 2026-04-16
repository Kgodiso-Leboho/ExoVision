from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from .models.ml_model import ExoplanetModel
from .models.schemas import PredictionInput, PredictionResponse, UploadResponse
import os
import uuid

app = FastAPI(
    title="ExoVision API",
    description="Exoplanet Detection ML API with Random Forest",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML model
ml_model = ExoplanetModel()
DATASET_PATH = "data/exoplanet_data.csv"

@app.on_event("startup")
async def startup_event():
    """Train the model on startup"""
    try:
        if os.path.exists(DATASET_PATH):
            ml_model.train(DATASET_PATH)
        else:
            ml_model.train()
            print("Using synthetic data - please provide your dataset at data/exoplanet_data.csv")
    except Exception as e:
        print(f"Startup training failed: {e}")

@app.get("/")
async def root():
    return {
        "message": "Welcome to ExoVision API",
        "status": "active",
        "model_accuracy": ml_model.accuracy,
        "features": ml_model.feature_names
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_exoplanet(data: PredictionInput):
    """Predict if a planet is an exoplanet"""
    try:
        prediction, probability = ml_model.predict(data)
        return PredictionResponse(
            is_exoplanet=bool(prediction),
            confidence=float(probability),
            features_used=ml_model.feature_names,
            model_accuracy=ml_model.accuracy
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """Upload a new dataset and retrain the model"""
    try:
        # Save uploaded file
        file_extension = os.path.splitext(file.filename)[1]
        file_path = f"data/uploaded_{uuid.uuid4()}{file_extension}"
        
        os.makedirs("data", exist_ok=True)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Retrain model with new dataset
        ml_model.train(file_path)
        
        return UploadResponse(
            message="Dataset uploaded and model retrained successfully",
            accuracy=ml_model.accuracy,
            features=ml_model.feature_names
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/features")
async def get_feature_info():
    """Get information about the features used for prediction"""
    feature_descriptions = {
        "koi_period": {"description": "Orbital period", "unit": "days"},
        "koi_time0bk": {"description": "Transit epoch", "unit": "BKJD"},
        "koi_impact": {"description": "Impact parameter", "unit": "none"},
        "koi_duration": {"description": "Transit duration", "unit": "hours"},
        "koi_depth": {"description": "Transit depth", "unit": "ppm"},
        "koi_prad": {"description": "Planetary radius", "unit": "Earth radii"},
        "koi_teq": {"description": "Equilibrium temperature", "unit": "Kelvin"},
        "koi_insol": {"description": "Insolation flux", "unit": "Earth flux"},
        "koi_model_snr": {"description": "Signal-to-noise ratio", "unit": "none"},
        "koi_steff": {"description": "Stellar temperature", "unit": "Kelvin"},
        "koi_slogg": {"description": "Stellar surface gravity", "unit": "log10(cm/s²)"},
        "koi_srad": {"description": "Stellar radius", "unit": "Solar radii"}
    }
    
    # Only return descriptions for features actually being used
    available_descriptions = {
        feature: feature_descriptions.get(feature, {"description": feature, "unit": "unknown"})
        for feature in ml_model.feature_names
    }
    
    return available_descriptions

@app.get("/stats")
async def get_model_stats():
    """Get model statistics and performance"""
    if not ml_model.is_trained:
        raise HTTPException(status_code=400, detail="Model not trained yet")
    
    return {
        "model_type": "Random Forest Classifier",
        "training_samples": len(ml_model.X_train) if ml_model.X_train is not None else 0,
        "test_samples": len(ml_model.X_test) if ml_model.X_test is not None else 0,
        "accuracy": ml_model.accuracy,
        "feature_importance": ml_model.get_feature_importance(),
        "features_used": ml_model.feature_names
    }

@app.get("/dataset-info")
async def get_dataset_info():
    """Get information about the current dataset"""
    return {
        "dataset_path": DATASET_PATH,
        "dataset_exists": os.path.exists(DATASET_PATH),
        "feature_count": len(ml_model.feature_names),
        "model_trained": ml_model.is_trained
    }