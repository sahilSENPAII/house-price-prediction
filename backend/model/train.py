import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.pipeline import Pipeline
import joblib
import os
import warnings
warnings.filterwarnings('ignore')

# ──────────────────────────────────────────
# 1. LOAD DATA
# ──────────────────────────────────────────
print("=" * 50)
print("House Price Prediction — Model Training")
print("=" * 50)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA_PATH = os.path.join(BASE_DIR, "data", "House Price India.csv")

df = pd.read_csv(DATA_PATH)
print(f"\n Data loaded: {df.shape[0]} rows, {df.shape[1]} columns")

# ──────────────────────────────────────────
# 2. FEATURE ENGINEERING
# ──────────────────────────────────────────
print("\n Engineering features")

# House age
df['house_age'] = 2026 - df['Built Year']

# Renovation features
df['is_renovated'] = (df['Renovation Year'] > 0).astype(int)
df['years_since_renovation'] = df.apply(
    lambda x: 2026 - x['Renovation Year'] if x['Renovation Year'] > 0 else x['house_age'],
    axis=1
)

# Area features
df['total_area'] = df['living area'] + df['Area of the basement']
df['has_basement'] = (df['Area of the basement'] > 0).astype(int)

# Ratio feature
df['bed_bath_ratio'] = df['number of bedrooms'] / (df['number of bathrooms'] + 1)

print("Features engineered: house_age, is_renovated, years_since_renovation,")
print("                        total_area, has_basement, bed_bath_ratio")

# ──────────────────────────────────────────
# 3. DEFINE FEATURES & TARGET
# ──────────────────────────────────────────
FEATURES = [
    'number of bedrooms',
    'number of bathrooms',
    'living area',
    'lot area',
    'number of floors',
    'waterfront present',
    'number of views',
    'condition of the house',
    'grade of the house',
    'Area of the house(excluding basement)',
    'Area of the basement',
    'Postal Code',
    'Lattitude',
    'Longitude',
    'Number of schools nearby',
    'Distance from the airport',
    'house_age',
    'is_renovated',
    'years_since_renovation',
    'total_area',
    'has_basement',
    'bed_bath_ratio'
]

TARGET = 'Price'

X = df[FEATURES]
y = df[TARGET]

print(f"\n Features selected: {len(FEATURES)}")
print(f"Target: {TARGET}")

# ──────────────────────────────────────────
# 4. TRAIN-TEST SPLIT
# ──────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\n Train size: {X_train.shape[0]} samples")
print(f"Test size:  {X_test.shape[0]} samples")

# ──────────────────────────────────────────
# 5. TRAIN LINEAR REGRESSION
# ──────────────────────────────────────────
print("\n" + "=" * 50)
print("Training Linear Regression")

lr_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', LinearRegression())
])

lr_pipeline.fit(X_train, y_train)
lr_preds = lr_pipeline.predict(X_test)

lr_rmse = np.sqrt(mean_squared_error(y_test, lr_preds))
lr_r2   = r2_score(y_test, lr_preds)

print(f"   RMSE : ₹{lr_rmse:,.0f}")
print(f"   R²   : {lr_r2:.4f}")

# ──────────────────────────────────────────
# 6. TRAIN RANDOM FOREST
# ──────────────────────────────────────────
print("\n" + "=" * 50)
print("Training Random Forest")

rf_pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('model', RandomForestRegressor(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    ))
])

rf_pipeline.fit(X_train, y_train)
rf_preds = rf_pipeline.predict(X_test)

rf_rmse = np.sqrt(mean_squared_error(y_test, rf_preds))
rf_r2   = r2_score(y_test, rf_preds)

print(f"   RMSE : ₹{rf_rmse:,.0f}")
print(f"   R²   : {rf_r2:.4f}")

# ──────────────────────────────────────────
# 7. MODEL COMPARISON
# ──────────────────────────────────────────
print("\n" + "=" * 50)
print("MODEL COMPARISON")
print("=" * 50)
print(f"{'Model':<25} {'RMSE':>15} {'R²':>10}")
print("-" * 50)
print(f"{'Linear Regression':<25} ₹{lr_rmse:>13,.0f} {lr_r2:>10.4f}")
print(f"{'Random Forest':<25} ₹{rf_rmse:>13,.0f} {rf_r2:>10.4f}")
print("=" * 50)

# ──────────────────────────────────────────
# 8. SELECT BEST MODEL & SAVE
# ──────────────────────────────────────────
if rf_r2 > lr_r2:
    best_model = rf_pipeline
    best_name  = "Random Forest"
else:
    best_model = lr_pipeline
    best_name  = "Linear Regression"

print(f"\nBest Model: {best_name}")

# Save model
MODEL_DIR = os.path.join(BASE_DIR, "backend", "model")
os.makedirs(MODEL_DIR, exist_ok=True)

model_path = os.path.join(MODEL_DIR, "model.pkl")
joblib.dump(best_model, model_path)
print(f"Model saved to: {model_path}")

# Save feature list
features_path = os.path.join(MODEL_DIR, "features.pkl")
joblib.dump(FEATURES, features_path)
print(f"Features saved to: {features_path}")

# Save model metadata
metadata = {
    "best_model": best_name,
    "rmse": rf_rmse if best_name == "Random Forest" else lr_rmse,
    "r2":   rf_r2   if best_name == "Random Forest" else lr_r2,
    "lr_rmse": lr_rmse,
    "lr_r2":   lr_r2,
    "rf_rmse": rf_rmse,
    "rf_r2":   rf_r2,
    "features": FEATURES,
    "n_train": X_train.shape[0],
    "n_test":  X_test.shape[0]
}

metadata_path = os.path.join(MODEL_DIR, "metadata.pkl")
joblib.dump(metadata, metadata_path)
print(f"Metadata saved to: {metadata_path}")

print("\n" + "=" * 50)
print("Training Complete")
print("=" * 50)
