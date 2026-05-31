from fastapi import HTTPException, status
from app.db.schemas.prediction import ExoplanetFeatures, PredictionResponse
from app.util.prediction_helper import run_prediction


class PredictionService:

    def predict(self, features: ExoplanetFeatures) -> PredictionResponse:
        try:
            result = run_prediction(features)
            return result
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Prediction failed: {str(e)}"
            )