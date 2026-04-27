import pandas as pd
import joblib
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from utils import create_sequences, scale_features

SEQ_LEN = 24
FILE_PATH = "data/wind_generation.csv"
MODEL_PATH = "models/wind_lstm.h5"
SCALER_PATH = "models/wind_scaler.pkl"

# Load dataset
df = pd.read_csv(FILE_PATH)

# Correct columns for your wind CSV
features = [
    "WS_10m",
    "WS_100m",
    "WD_10m",
    "WD_100m",
    "WG_10m",
    "Temp_2m",
    "RelHum_2m",
    "Power"
]

# Clean missing values
df = df.dropna()

# Scale + sequence
scaled, scaler = scale_features(df, features)
X, y = create_sequences(scaled, SEQ_LEN)

# LSTM model
model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(X.shape[1], X.shape[2])),
    Dropout(0.2),
    LSTM(32),
    Dense(1)
])

model.compile(optimizer="adam", loss="mse", metrics=["mae"])

model.fit(
    X, y,
    epochs=20,
    batch_size=32,
    validation_split=0.2
)

# Save outputs
model.save(MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)

print("Wind LSTM model saved successfully")