# app/util/prediction_helper.py
import joblib
import numpy as np
import pandas as pd
from app.db.schemas.prediction import ExoplanetFeatures, ModelPredictionResult, PredictionResponse

MODEL_PATH = "app/training/multi_model_classifier.pkg"

try:
    model_bundle: dict = joblib.load(MODEL_PATH)
except Exception as e:
    raise RuntimeError(f"Failed to load model bundle: {e}")


FEATURE_ORDER = [
    "ra", "dec", "pl_rade", "pl_orbper", "pl_trandurh", "pl_trandep",
    "pl_insol", "pl_eqt", "st_tmag", "st_dist", "st_teff", "st_logg",
    "st_rad", "in_habitable_zone", "toi", "tid",
    "planet_size_category_Earth-sized", "planet_size_category_Jupiter-sized",
    "planet_size_category_Neptune-sized", "planet_size_category_Super-Earth",
    "star_temp_category_G-dwarf", "star_temp_category_Hot-star",
    "star_temp_category_K-dwarf", "star_temp_category_M-dwarf"
]


def prepare_input(features: ExoplanetFeatures) -> pd.DataFrame:
    data = {
        "ra": features.ra,
        "dec": features.dec,
        "pl_rade": features.pl_rade,
        "pl_orbper": features.pl_orbper,
        "pl_trandurh": features.pl_trandurh,
        "pl_trandep": features.pl_trandep,
        "pl_insol": features.pl_insol,
        "pl_eqt": features.pl_eqt,
        "st_tmag": features.st_tmag,
        "st_dist": features.st_dist,
        "st_teff": features.st_teff,
        "st_logg": features.st_logg,
        "st_rad": features.st_rad,
        "toi": features.toi,
        "tid": features.tid,
        "planet_size_category_Earth-sized": int(features.planet_size_category_Earth_sized),
        "planet_size_category_Jupiter-sized": int(features.planet_size_category_Jupiter_sized),
        "planet_size_category_Neptune-sized": int(features.planet_size_category_Neptune_sized),
        "planet_size_category_Super-Earth": int(features.planet_size_category_Super_Earth),
        "star_temp_category_G-dwarf": int(features.star_temp_category_G_dwarf),
        "star_temp_category_Hot-star": int(features.star_temp_category_Hot_star),
        "star_temp_category_K-dwarf": int(features.star_temp_category_K_dwarf),
        "star_temp_category_M-dwarf": int(features.star_temp_category_M_dwarf),
    }

    return pd.DataFrame([data], columns=FEATURE_ORDER)


def run_prediction(features: ExoplanetFeatures) -> PredictionResponse:
    input_df = prepare_input(features)
    results = []

    for model_name, model in model_bundle.items():
        prediction = int(model.predict(input_df)[0])
        label = "Planet" if prediction == 1 else "Not a Planet"

        results.append(ModelPredictionResult(
            model_name=model_name,
            prediction=prediction,
            label=label
        ))

    votes = [r.prediction for r in results]
    consensus_vote = 1 if votes.count(1) > votes.count(0) else 0
    consensus = "Planet" if consensus_vote == 1 else "Not a Planet"

    return PredictionResponse(
        predictions=results,
        consensus=consensus
    )