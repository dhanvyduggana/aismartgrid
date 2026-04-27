import pandas as pd
import joblib
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from utils import create_sequences, scale_features

SEQ_LEN = 24
FILE_PATH = 'data/solar_generation.csv'
MODEL_PATH = 'models/solar_lstm.h5'
SCALER_PATH = 'models/solar_scaler.pkl'

# Load dataset
df = pd.read_csv(FILE_PATH)

# Update these column names based on your CSV
features = [
    'temperature_2_m_above_gnd',
    'relative_humidity_2_m_above_gnd',
    'total_cloud_cover_sfc',
    'shortwave_radiation_backwards_sfc',
    'wind_speed_10_m_above_gnd',
    'generated_power_kw'
]

df = df.dropna()
scaled, scaler = scale_features(df, features)
X, y = create_sequences(scaled, SEQ_LEN)

model = Sequential([
    LSTM(64, return_sequences=True, input_shape=(X.shape[1], X.shape[2])),
    Dropout(0.2),
    LSTM(32),
    Dense(1)
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])
model.fit(X, y, epochs=20, batch_size=32, validation_split=0.2)

model.save(MODEL_PATH)
joblib.dump(scaler, SCALER_PATH)

print('Solar LSTM model saved successfully')