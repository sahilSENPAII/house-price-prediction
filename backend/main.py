from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os

# ──────────────────────────────────────────
# 1. LOAD MODEL & FEATURES
# ──────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH    = os.path.join(BASE_DIR, "model", "model.pkl")
FEATURES_PATH = os.path.join(BASE_DIR, "model", "features.pkl")
METADATA_PATH = os.path.join(BASE_DIR, "model", "metadata.pkl")

model    = joblib.load(MODEL_PATH)
FEATURES = joblib.load(FEATURES_PATH)
metadata = joblib.load(METADATA_PATH)

print(" Model loaded successfully")
print(f" Best model: {metadata['best_model']}")
print(f" R² Score:   {metadata['r2']:.4f}")

# ──────────────────────────────────────────
# 2. FASTAPI APP
# ──────────────────────────────────────────
app = FastAPI(
    title=" House Price Prediction API",
    description="Predicts residential property prices in India using Machine Learning.",
    version="1.0.0"
)

# Allow React frontend to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────
# 3. REQUEST SCHEMA
# ──────────────────────────────────────────
class HouseFeatures(BaseModel):
    number_of_bedrooms:              int   = Field(..., ge=1, le=20,    example=3)
    number_of_bathrooms:             float = Field(..., ge=1, le=10,    example=2.0)
    living_area:                     int   = Field(..., ge=100,         example=1800)
    lot_area:                        int   = Field(..., ge=100,         example=5000)
    number_of_floors:                float = Field(..., ge=1, le=5,     example=2.0)
    waterfront_present:              int   = Field(..., ge=0, le=1,     example=0)
    number_of_views:                 int   = Field(..., ge=0, le=4,     example=0)
    condition_of_the_house:          int   = Field(..., ge=1, le=5,     example=3)
    grade_of_the_house:              int   = Field(..., ge=1, le=13,    example=7)
    area_of_house_excluding_basement:int   = Field(..., ge=100,         example=1800)
    area_of_basement:                int   = Field(..., ge=0,           example=0)
    postal_code:                     int   = Field(...,                  example=122001)
    lattitude:                       float = Field(...,                  example=52.88)
    longitude:                       float = Field(...,                  example=-114.47)
    number_of_schools_nearby:        int   = Field(..., ge=0,           example=2)
    distance_from_airport:           int   = Field(..., ge=0,           example=50)
    built_year:                      int   = Field(..., ge=1800, le=2026, example=2005)
    renovation_year:                 int   = Field(..., ge=0,           example=0)

# ──────────────────────────────────────────
# 4. HELPER — FEATURE ENGINEERING
# ──────────────────────────────────────────
def engineer_features(data: HouseFeatures) -> list:
    house_age = 2026 - data.built_year

    is_renovated = 1 if data.renovation_year > 0 else 0

    years_since_renovation = (
        2026 - data.renovation_year if data.renovation_year > 0 else house_age
    )

    total_area   = data.living_area + data.area_of_basement
    has_basement = 1 if data.area_of_basement > 0 else 0
    bed_bath_ratio = data.number_of_bedrooms / (data.number_of_bathrooms + 1)

    feature_vector = [
        data.number_of_bedrooms,
        data.number_of_bathrooms,
        data.living_area,
        data.lot_area,
        data.number_of_floors,
        data.waterfront_present,
        data.number_of_views,
        data.condition_of_the_house,
        data.grade_of_the_house,
        data.area_of_house_excluding_basement,
        data.area_of_basement,
        data.postal_code,
        data.lattitude,
        data.longitude,
        data.number_of_schools_nearby,
        data.distance_from_airport,
        house_age,
        is_renovated,
        years_since_renovation,
        total_area,
        has_basement,
        bed_bath_ratio
    ]

    return feature_vector

# ──────────────────────────────────────────
# 5. ROUTES
# ──────────────────────────────────────────

@app.get("/")
def root():
    return {
        "message": "House Price Prediction API is running",
        "docs":    "/docs",
        "health":  "/health"
    }


@app.get("/health")
def health():
    return {
        "status":     "healthy",
        "model":      metadata["best_model"],
        "r2_score":   round(metadata["r2"], 4),
        "rmse":       round(metadata["rmse"], 2),
        "train_size": metadata["n_train"],
        "test_size":  metadata["n_test"]
    }


@app.post("/predict")
def predict(house: HouseFeatures):
    try:
        # Engineer features
        features = engineer_features(house)
        features_array = np.array(features).reshape(1, -1)

        # Predict
        predicted_price = model.predict(features_array)[0]
        predicted_price = max(0, predicted_price)  # no negative prices
        USD_TO_INR = 92.2
        predicted_price = predicted_price * USD_TO_INR  # no negative prices

        return {
            "predicted_price":      round(predicted_price, 2),
            "predicted_price_lakh": round(predicted_price / 100000, 2),
            "currency":             "INR",
            "model_used":           metadata["best_model"],
            "model_r2":             round(metadata["r2"], 4)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/model-info")
def model_info():
    return {
        "best_model":          metadata["best_model"],
        "r2_score":            round(metadata["r2"], 4),
        "rmse":                round(metadata["rmse"], 2),
        "linear_regression":   {"r2": round(metadata["lr_r2"], 4), "rmse": round(metadata["lr_rmse"], 2)},
        "random_forest":       {"r2": round(metadata["rf_r2"], 4), "rmse": round(metadata["rf_rmse"], 2)},
        "features_used":       FEATURES,
        "total_features":      len(FEATURES),
        "training_samples":    metadata["n_train"],
        "testing_samples":     metadata["n_test"]
    }
