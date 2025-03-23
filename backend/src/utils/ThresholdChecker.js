// Aaryan's Model Replacement
class ThresholdChecker {
    // Check if vitals exceed thresholds
    checkVitals(vitals) {
      // Check heart rate
      if (vitals.heartRate && (vitals.heartRate > 120 || vitals.heartRate < 40)) {
        return {
          type: 'heartRate',
          value: vitals.heartRate,
          severity: this.getSeverity('heartRate', vitals.heartRate)
        };
      }
      
      // Check blood oxygen
      if (vitals.spO2 && vitals.spO2 < 90) {
        return {
          type: 'spO2',
          value: vitals.spO2,
          severity: this.getSeverity('spO2', vitals.spO2)
        };
      }
      
      // Check blood pressure
      if (vitals.bloodPressure) {
        const { systolic, diastolic } = vitals.bloodPressure;
        if (systolic > 180 || systolic < 90 || diastolic > 120 || diastolic < 60) {
          return {
            type: 'bloodPressure',
            value: { systolic, diastolic },
            severity: this.getSeverity('bloodPressure', { systolic, diastolic })
          };
        }
      }
      
      // Check fall detection
      if (vitals.fallDetected) {
        return {
          type: 'fall',
          value: true,
          severity: 'high'
        };
      }
      
      // No anomalies detected
      return null;
    }
    
    // Determine severity of the anomaly
    getSeverity(type, value) {
      switch(type) {
        case 'heartRate':
          if (value > 180 || value < 30) return 'critical';
          if (value > 150 || value < 35) return 'high';
          return 'medium';
          
        case 'spO2':
          if (value < 80) return 'critical';
          if (value < 85) return 'high';
          return 'medium';
          
        case 'bloodPressure':
          const { systolic, diastolic } = value;
          if (systolic > 200 || systolic < 80 || diastolic > 130 || diastolic < 50) return 'critical';
          if (systolic > 190 || systolic < 85 || diastolic > 125 || diastolic < 55) return 'high';
          return 'medium';
          
        default:
          return 'medium';
      }
    }
  }
  
  export default new ThresholdChecker();