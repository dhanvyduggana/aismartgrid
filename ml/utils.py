import numpy as np
from sklearn.preprocessing import MinMaxScaler


def create_sequences(data, seq_length=24):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i + seq_length, :-1])
        y.append(data[i + seq_length, -1])
    return np.array(X), np.array(y)


def scale_features(df, feature_cols):
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[feature_cols])
    return scaled, scaler