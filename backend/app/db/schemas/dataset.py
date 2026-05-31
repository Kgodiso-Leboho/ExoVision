from pydantic import BaseModel
from typing import Optional

class DatasetStats(BaseModel):
    row_count: int
    column_count: int
    missing_values: dict[str, int]
    duplicate_rows: int
    column_types: dict[str, str]

class ValidationResult(BaseModel):
    is_valid: bool
    errors: list[str]
    warnings: list[str]

class LeakageResult(BaseModel):
    leakage_detected: bool
    suspicious_columns: list[str]
    correlation_scores: dict[str, float]

class FeatureSelectResult(BaseModel):
    selected_features: list[str]
    dropped_features: list[str]
    importance_scores: dict[str, float]

class AnalysisResult(BaseModel):
    stats: DatasetStats
    validation: ValidationResult
    leakage: LeakageResult
    feature_selection: FeatureSelectResult