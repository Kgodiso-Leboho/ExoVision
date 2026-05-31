# app/routers/dataset.py
from fastapi import APIRouter, UploadFile, File, Depends
from app.service.datasetService import DatasetService
from app.db.schemas.dataset import (
    DatasetStats,
    ValidationResult,
    LeakageResult,
    FeatureSelectResult,
    AnalysisResult
)

datasetRouter = APIRouter(prefix="/dataset", tags=["dataset"])


def get_dataset_service() -> DatasetService:
    return DatasetService()


@datasetRouter.post("/stats", response_model=DatasetStats)
async def get_stats(
    file: UploadFile = File(...),
    service: DatasetService = Depends(get_dataset_service)
):
    return await service.get_stats(file)


@datasetRouter.post("/validate", response_model=ValidationResult)
async def validate(
    file: UploadFile = File(...),
    service: DatasetService = Depends(get_dataset_service)
):
    return await service.validate(file)


@datasetRouter.post("/check-leakage", response_model=LeakageResult)
async def check_leakage(
    file: UploadFile = File(...),
    service: DatasetService = Depends(get_dataset_service)
):
    return await service.check_leakage(file)


@datasetRouter.post("/feature-select", response_model=FeatureSelectResult)
async def select_features(
    file: UploadFile = File(...),
    service: DatasetService = Depends(get_dataset_service)
):
    return await service.select_features(file)


@datasetRouter.post("/analyse", response_model=AnalysisResult)
async def analyse(
    file: UploadFile = File(...),
    service: DatasetService = Depends(get_dataset_service)
):
    return await service.analyse(file)