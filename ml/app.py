from flask import Flask, request, jsonify
import pandas as pd
import joblib
import os
import numpy as np

app = Flask(__name__)

# Load the model and scaler at startup
model = joblib.load('random_forest_model.pkl')
scaler = joblib.load('scaler.pkl')

@app.route('/predict', methods=['POST'])
def predict_emergency():
    """
    API endpoint to predict medical emergencies from health metrics
    
    Expected JSON input format:
    {
        "heartRate": 75,
        "heartBeatIntervals": 800,
        "calories": 2000,
        "distance": 5000,
        "floorsClimbed": 5,
        "steps": 8000,
        "stressScore": 50,
        "respirationRate": 15,
        "timeToRecovery": 2,
        "oxygenSaturation": 98,
        "temperature": 36.6,
        "cadence": 90,
        "pressure": 101000
    }
    """
    try:
        # Get data from request
        data = request.get_json()

        # Convert to DataFrame
        input_df = pd.DataFrame([data])
        
        # Fill missing values with median (you would use values from training data in production)
        for col in input_df.columns:
            if input_df[col].isnull().any():
                if col == 'respirationRate':
                    input_df[col] = input_df[col].fillna(16)
                elif col == 'timeToRecovery':
                    input_df[col] = input_df[col].fillna(1)
                elif col == 'oxygenSaturation':
                    input_df[col] = input_df[col].fillna(97)
                else:
                    input_df[col] = input_df[col].fillna(0)
        
        # Feature selection: Ensure to use all the required features
        features = np.array([
            data['heartRate'], 
            data['heartBeatIntervals'],
            data['calories'],
            data['distance'],
            data['floorsClimbed'],
            data['steps'],
            data['stressScore'],
            data['respirationRate'],
            data['timeToRecovery'],
            data['oxygenSaturation'],
            data['temperature'],
            data['cadence'],
            data['pressure']
        ]).reshape(1, -1)

        # Scale the features using the scaler
        features_scaled = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(features_scaled)
        probability = model.predict_proba(features_scaled)[0][1]
        
        # Create response
        response = {
            'emergency_detected': bool(prediction[0]),  # Convert to standard Python bool
            'emergency_probability': probability,
            'status': 'success'
        }
        
        # Add recommendations based on probability
        if probability > 0.75:
            response['recommendation'] = "URGENT: Immediate medical attention required"
        elif probability > 0.5:
            response['recommendation'] = "WARNING: Consider seeking medical attention"
        elif probability > 0.25:
            response['recommendation'] = "CAUTION: Monitor vital signs closely"
        else:
            response['recommendation'] = "Normal: No immediate action required"
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 400

if __name__ == "__main__":
    app.run(debug=True, port=5000)
