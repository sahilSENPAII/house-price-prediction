# 🏠 House Price Predictor — Gurugram, India

A full-stack machine learning web application that predicts residential property prices using structural and location based housing features with a Random Forest regression model.
🔗 **Live Demo:** [house-price-prediction-one-pi.vercel.app](https://house-price-prediction-one-pi.vercel.app)

---
##  System Architecture

User  
↓  
React Frontend (Vercel)  
↓  
FastAPI REST API (Render)  
↓  
Random Forest Model (scikit-learn)  
↓  
Prediction Response

---
## 🧠 Tech Stack

| Layer | Technology |
|---|---|
| Machine Learning | Python, scikit-learn, pandas, NumPy |
| Backend API | FastAPI, Uvicorn |
| Frontend | React.js |
| Containerization | Docker, Docker Compose |
| Backend Deployment | Render |
| Frontend Deployment | Vercel |
| Version Control | Git, GitHub |

---

##  Features

-  **Random Forest ML Model** trained on 14,620 housing records
-  **39+ Gurugram locations** with auto-filled postal code, coordinates & airport distance
-  **Smart price display** — auto switches between Lakhs and Crores
-  **Dark glassmorphism UI** with smooth animations
-  **Real-time predictions** via REST API
-  **Fully containerized** with Docker
-  **Deployed and publicly accessible**

---

##  Model Performance

| Model | RMSE | R² Score |
|---|---|---|
| Linear Regression | ₹1,97,439 | 0.7234 |
| **Random Forest** | **₹1,36,515** | **0.8678** ✅ |

- **Training samples:** 11,696
- **Testing samples:** 2,924
- **Features used:** 22 (including engineered features)
- **Best model:** Random Forest (200 estimators)

---

##  Feature Engineering

New features created from existing data to improve model accuracy:

| Feature | Description |
|---|---|
| `house_age` | 2026 - Built Year |
| `is_renovated` | 1 if renovation year > 0 |
| `years_since_renovation` | Years since last renovation |
| `total_area` | Living area + basement area |
| `has_basement` | 1 if basement area > 0 |
| `bed_bath_ratio` | Bedrooms / (Bathrooms + 1) |

---

##  Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker (optional)

### Option 1 — Without Docker

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Option 2 — With Docker
```bash
docker-compose up --build
```

Visit:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

---

## 📁 Project Structure

```
house-price-prediction/
├── data/
│   └── House Price India.csv
├── notebook/
│   └── EDA.ipynb                 # Exploratory Data Analysis
├── backend/
│   ├── main.py                   # FastAPI server
│   ├── requirements.txt
│   ├── Dockerfile
│   └── model/
│       ├── train.py              # Model training script
│       ├── model.pkl             # Trained Random Forest model
│       ├── features.pkl          # Feature list
│       └── metadata.pkl          # Model metrics
├── frontend/
│   ├── src/
│   │   └── App.js                # React UI
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

##  API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API status |
| GET | `/health` | Model health & metrics |
| GET | `/model-info` | Detailed model information |
| POST | `/predict` | Predict house price |

### Sample Request:
```json
POST /predict
{
  "number_of_bedrooms": 3,
  "number_of_bathrooms": 2,
  "living_area": 1800,
  "lot_area": 5000,
  "number_of_floors": 2,
  "grade_of_the_house": 7,
  "built_year": 2005,
  "waterfront_present": 0
}
```

### Sample Response:
```json
{
  "predicted_price": 28700000,
  "predicted_price_lakh": 287.0,
  "currency": "INR",
  "model_used": "Random Forest",
  "model_r2": 0.8678
}
```

---

##  EDA Highlights

- Price distribution analysis with log transformation
- Feature correlation heatmap
- Geographic price distribution using Lat/Long
- Outlier detection via IQR method
- Engineered feature vs price analysis

---

##  Author

**Sahil Ray**
- GitHub: [@sahilSENPAII](https://github.com/sahilSENPAII)

---


