from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
import numpy as np
import traceback

app = Flask(__name__)
CORS(app)

solar_model = load_model("models/solar_lstm.h5")
wind_model = load_model("models/wind_lstm.h5")
from city_demand import get_city_demand
from priority_engine import allocate_power
from db import init_db, save_dispatch_history, get_last_7_days
from battery_service import use_battery_then_allocate


def validate_sequence(sequence, expected_features):
    arr = np.array(sequence, dtype=float)

    if len(arr.shape) != 2:
        raise ValueError(f"Input must be 2D array, got {arr.shape}")

    if arr.shape[0] != 24:
        raise ValueError(f"Expected 24 rows, got {arr.shape[0]}")

    if arr.shape[1] != expected_features:
        raise ValueError(
            f"Expected {expected_features} features, got {arr.shape[1]}"
        )

    return arr.reshape(1, 24, expected_features)


@app.route("/predict/solar", methods=["POST"])
def predict_solar():
    try:
        data = request.json
        seq = validate_sequence(data["sequence"], 5)

        pred = solar_model.predict(seq, verbose=0)[0][0]

        return jsonify({
            "source": "solar",
            "prediction_kw": float(pred),
            "status": "success"
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/predict/wind", methods=["POST"])
def predict_wind():
    try:
        data = request.json
        seq = validate_sequence(data["sequence"], 7)

        pred = wind_model.predict(seq, verbose=0)[0][0]

        return jsonify({
            "source": "wind",
            "prediction_kw": float(pred),
            "status": "success"
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/predict/hybrid", methods=["POST"])
def predict_hybrid():
    try:
        data = request.json

        solar_seq = validate_sequence(data["solar_sequence"], 5)
        wind_seq = validate_sequence(data["wind_sequence"], 7)

        solar_pred = solar_model.predict(solar_seq, verbose=0)[0][0]
        wind_pred = wind_model.predict(wind_seq, verbose=0)[0][0]

        total = float(solar_pred + wind_pred)

        return jsonify({
            "solar_kw": float(solar_pred),
            "wind_kw": float(wind_pred),
            "total_kw": total,
            "best_source": "solar" if solar_pred > wind_pred else "wind",
            "status": "success"
        })

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route("/")
def home():
    return jsonify({"message": "AI Smart Grid API Running"})


@app.route("/smart-grid/dispatch", methods=["POST"])
def smart_dispatch():
    try:
        data = request.get_json()

        solar_seq = validate_sequence(data["solar_sequence"], 5)
        wind_seq = validate_sequence(data["wind_sequence"], 7)

        solar_pred = float(
            solar_model.predict(solar_seq, verbose=0)[0][0]
        )

        wind_pred = float(
            wind_model.predict(wind_seq, verbose=0)[0][0]
        )

        total_generation = solar_pred + wind_pred

        demand = get_city_demand()

        battery_result = use_battery_then_allocate(
            total_generation,
            demand
        )

        dispatch_result = {
            "solar_kw": solar_pred,
            "wind_kw": wind_pred,
            "total_generation": total_generation,
            "city_demand": demand,
            "battery": battery_result,
            "allocation": battery_result["allocation"],
            "deficit": battery_result["remaining_deficit"],
            "price_per_unit": round(
                5 + battery_result["remaining_deficit"] * 0.05,
                2
            )
        }

        save_dispatch_history(dispatch_result)

        return jsonify(dispatch_result), 200

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "error": str(e)
        }), 500

@app.route("/analytics/history", methods=["GET"])
def analytics_history():
    try:
        history = get_last_7_days()

        chart_data = {
            "generationTrend": [
                {
                    "date": row["date"][-8:],
                    "generation": row["generation"]
                }
                for row in history
            ],
            "priceTrend": [
                {
                    "date": row["date"][-8:],
                    "price": row["price"]
                }
                for row in history
            ]
        }

        return jsonify({
            "status": "success",
            "charts": chart_data
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=8000, debug=True)