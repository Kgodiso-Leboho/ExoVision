import pandas as pd
from io import BytesIO
from fastapi import HTTPException, status, UploadFile
from app.util.dataset_helper import (
    get_stats,
    validate_dataset,
    check_leakage,
    select_features,
    run_full_analysis
)
from app.db.schemas.dataset import (
    DatasetStats,
    ValidationResult,
    LeakageResult,
    FeatureSelectResult,
    AnalysisResult
)


class DatasetService:

    async def __load_dataframe(self, file: UploadFile) -> pd.DataFrame:
        if not file.filename or not file.filename.endswith('.csv'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only CSV files are supported"
            )

        try:
            contents = await file.read()
            df = pd.read_csv(BytesIO(contents))
            return df
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not parse CSV file. Make sure it is a valid CSV"
            )

    async def get_stats(self, file: UploadFile) -> DatasetStats:
        df = await self.__load_dataframe(file)
        return get_stats(df)

    async def validate(self, file: UploadFile) -> ValidationResult:
        df = await self.__load_dataframe(file)
        return validate_dataset(df)

    async def check_leakage(self, file: UploadFile) -> LeakageResult:
        df = await self.__load_dataframe(file)
        return check_leakage(df)

    async def select_features(self, file: UploadFile) -> FeatureSelectResult:
        df = await self.__load_dataframe(file)
        return select_features(df)

    async def analyse(self, file: UploadFile) -> AnalysisResult:
        df = await self.__load_dataframe(file)
        return run_full_analysis(df)