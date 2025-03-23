import sys
import json
import joblib
import numpy as np
import os
import traceback

def main():
    try:
        script_dir = os.path.dirname(os.path.realpath(__file__))
        model_path = os.path.join(script_dir, "random_forest_model.pkl")
        scaler_path = os.path.join(script_dir, "scaler.pkl")

        # Ensure model files exist
        if not os.path.exists(model_path):
            raise Exception(f"Model file not found at {model_path}")
        if not os.path.exists(scaler_path):
            raise Exception(f"Scaler file not found at {scaler_path}")

        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)

        # Read and parse the input from Node.js
        data = sys.stdin.read()
        if not data:
            raise Exception("No input data received from Node.js")
        data = json.loads(data)

        features = [
            data.get("heartRate"),
            data.get("heartBeatIntervals"),
            data.get("calories"),
            data.get("distance"),
            data.get("floorsClimbed"),
            data.get("steps"),
            data.get("stressScore"),
            data.get("respirationRate", 16),
            data.get("timeToRecovery", 1),
            data.get("oxygenSaturation", 97),
            data.get("temperature"),
            data.get("cadence"),
            data.get("pressure")
        ]

        features = np.array(features).reshape(1, -1)
        features_scaled = scaler.transform(features)
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0][1]

        if probability > 0.75:
            recommendation = "URGENT: Immediate medical attention required"
        elif probability > 0.5:
            recommendation = "WARNING: Consider seeking medical attention"
        elif probability > 0.25:
            recommendation = "CAUTION: Monitor vital signs closely"
        else:
            recommendation = "Normal: No immediate action required"

        result = {
            "emergency_detected": bool(prediction),
            "emergency_probability": probability,
            "recommendation": recommendation,
            "status": "success"
        }
        print(json.dumps(result))
    except Exception as e:
        sys.stderr.write(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main()