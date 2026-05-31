import pandas as pd
import numpy as np
from app.db.schemas.dataset import (
    DatasetStats,
    ValidationResult,
    LeakageResult,
    FeatureSelectResult,
    AnalysisResult
)


def get_stats(df: pd.DataFrame) -> DatasetStats:
    return DatasetStats(
        row_count=len(df),
        column_count=len(df.columns),
        missing_values={col: int(df[col].isnull().sum()) for col in df.columns},
        duplicate_rows=int(df.duplicated().sum()),
        column_types={col: str(df[col].dtype) for col in df.columns}
    )


def validate_dataset(df: pd.DataFrame) -> ValidationResult:
    errors = []
    warnings = []

    # Check if dataset is empty
    if df.empty:
        errors.append("Dataset is empty")

    # Check for unnamed columns
    unnamed = [col for col in df.columns if "Unnamed" in str(col)]
    if unnamed:
        warnings.append(f"Unnamed columns detected: {unnamed}")

    # Check for fully empty columns
    fully_empty = [col for col in df.columns if df[col].isnull().all()]
    if fully_empty:
        errors.append(f"Fully empty columns: {fully_empty}")

    # Check for high missing value ratio
    for col in df.columns:
        missing_ratio = df[col].isnull().sum() / len(df)
        if missing_ratio > 0.5:
            warnings.append(f"Column '{col}' has {missing_ratio:.0%} missing values")

    # Check minimum row count
    if len(df) < 10:
        errors.append("Dataset has fewer than 10 rows — too small to analyse")

    return ValidationResult(
        is_valid=len(errors) == 0,
        errors=errors,
        warnings=warnings
    )


def check_leakage(df: pd.DataFrame) -> LeakageResult:
    suspicious = []
    correlation_scores = {}

    numeric_df = df.select_dtypes(include=[np.number])

    if numeric_df.empty or len(numeric_df.columns) < 2:
        return LeakageResult(
            leakage_detected=False,
            suspicious_columns=[],
            correlation_scores={}
        )

    # Use last numeric column as target proxy
    target_col = numeric_df.columns[-1]
    features = numeric_df.columns[:-1]

    for col in features:
        corr = abs(numeric_df[col].corr(numeric_df[target_col]))
        if not np.isnan(corr):
            correlation_scores[col] = round(float(corr), 4)
            if corr > 0.95:
                suspicious.append(col)

    return LeakageResult(
        leakage_detected=len(suspicious) > 0,
        suspicious_columns=suspicious,
        correlation_scores=correlation_scores
    )


def select_features(df: pd.DataFrame) -> FeatureSelectResult:
    numeric_df = df.select_dtypes(include=[np.number])

    if numeric_df.empty or len(numeric_df.columns) < 2:
        return FeatureSelectResult(
            selected_features=list(df.columns),
            dropped_features=[],
            importance_scores={}
        )

    target_col = numeric_df.columns[-1]
    features = numeric_df.columns[:-1]

    importance_scores = {}
    for col in features:
        corr = abs(numeric_df[col].corr(numeric_df[target_col]))
        if not np.isnan(corr):
            importance_scores[col] = round(float(corr), 4)

    # Drop features with very low importance
    selected = [col for col, score in importance_scores.items() if score >= 0.05]
    dropped = [col for col, score in importance_scores.items() if score < 0.05]

    return FeatureSelectResult(
        selected_features=selected,
        dropped_features=dropped,
        importance_scores=importance_scores
    )


def run_full_analysis(df: pd.DataFrame) -> AnalysisResult:
    return AnalysisResult(
        stats=get_stats(df),
        validation=validate_dataset(df),
        leakage=check_leakage(df),
        feature_selection=select_features(df)
    )