from pydantic import BaseModel, Field
from typing import List, Dict, Any

class PredictionInput(BaseModel):
    koi_period: float = Field(..., ge=0.1, le=1000, description="Orbital period in days")
    koi_time0bk: float = Field(..., ge=100, le=2000, description="Transit epoch")
    koi_impact: float = Field(..., ge=0, le=1, description="Impact parameter")
    koi_duration: float = Field(..., ge=0.1, le=24, description="Transit duration in hours")
    koi_depth: float = Field(..., ge=0, le=10000, description="Transit depth in ppm")
    koi_prad: float = Field(..., ge=0.1, le=50, description="Planet radius in Earth radii")
    koi_teq: float = Field(..., ge=100, le=3000, description="Equilibrium temperature in K")
    koi_insol: float = Field(..., ge=0, le=10000, description="Insolation flux")
    koi_model_snr: float = Field(..., ge=0, le=1000, description="Signal-to-noise ratio")
    koi_steff: float = Field(..., ge=2000, le=10000, description="Stellar temperature in K")
    koi_slogg: float = Field(..., ge=0, le=6, description="Stellar surface gravity")
    koi_srad: float = Field(..., ge=0.1, le=20, description="Stellar radius in Solar radii")

class PredictionResponse(BaseModel):
    is_exoplanet: bool
    confidence: float
    features_used: List[str]
    model_accuracy: float

class UploadResponse(BaseModel):
    message: str
    accuracy: float
    features: List[str]

class ModelInfo(BaseModel):
    model_type: str
    accuracy: float
    training_samples: int
    feature_importance: Dict[str, float]