from fastapi import APIRouter, Depends
from app.service.predictionService import PredictionService
from app.db.schemas.prediction import ExoplanetFeatures, PredictionResponse

predictionRouter = APIRouter(prefix="/prediction")


def get_prediction_service() -> PredictionService:
    return PredictionService()


@predictionRouter.post("/predict", response_model=PredictionResponse)
def predict(
    features: ExoplanetFeatures,
    service: PredictionService = Depends(get_prediction_service)
):
    return service.predict(features)