# app/db/schemas/Prediction.py
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class ExoplanetFeatures(BaseModel):
    # Identifiers
    toi: float
    tid: int

    # Coordinates
    ra: float
    dec: float

    # Planet Transit Features
    pl_rade: float = Field(..., alias="pl_rade")
    pl_orbper: float = Field(..., alias="pl_orbper")
    pl_trandurh: float = Field(..., alias="pl_trandurh")
    pl_trandep: float = Field(..., alias="pl_trandep")
    pl_insol: float = Field(..., alias="pl_insol")
    pl_eqt: float = Field(..., alias="pl_eqt")

    # Stellar Features
    st_tmag: float
    st_dist: float
    st_teff: float
    st_logg: float
    st_rad: float

    # Categorical Flags
    planet_size_category_Earth_sized: bool = Field(alias="planet_size_category_Earth-sized")
    planet_size_category_Jupiter_sized: bool = Field(alias="planet_size_category_Jupiter-sized")
    planet_size_category_Neptune_sized: bool = Field(alias="planet_size_category_Neptune-sized")
    planet_size_category_Super_Earth: bool = Field(alias="planet_size_category_Super-Earth")

    star_temp_category_G_dwarf: bool = Field(alias="star_temp_category_G-dwarf")
    star_temp_category_Hot_star: bool = Field(alias="star_temp_category_Hot-star")
    star_temp_category_K_dwarf: bool = Field(alias="star_temp_category_K-dwarf")
    star_temp_category_M_dwarf: bool = Field(alias="star_temp_category_M-dwarf")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class ModelInfo(BaseModel):
    model_name: str
    model_description: str
    model_accuracy: float
    model_precision: float
    model_recall: float
    model_f1_score: float

    model_config = ConfigDict(from_attributes=True)


class ModelPredictionResult(BaseModel):
    model_name: str
    prediction: int
    label: str  # "Planet" or "Not a Planet"


class PredictionResponse(BaseModel):
    predictions: list[ModelPredictionResult]
    consensus: str  # majority vote across all three models