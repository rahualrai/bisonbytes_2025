// Vital sign types
export const VITAL_SIGN_TYPES = {
    HEART_RATE: 'heartRate',
    BLOOD_PRESSURE: 'bloodPressure',
    SPO2: 'spO2',
    TEMPERATURE: 'temperature',
    SLEEP: 'sleep',
    STEPS: 'steps'
  };
  
  // Emergency statuses
  export const EMERGENCY_STATUSES = {
    ACTIVE: 'active',
    PENDING: 'pending',
    RESOLVED: 'resolved',
    CANCELED: 'canceled'
  };
  
  // Emergency types
  export const EMERGENCY_TYPES = {
    HEART_RATE: 'HeartRate',
    BLOOD_PRESSURE: 'BloodPressure',
    SPO2: 'SpO2',
    FALL: 'Fall',
    MANUAL: 'Manual'
  };
  
  // Patient response types
  export const PATIENT_RESPONSE_TYPES = {
    OK: 'ok',
    NOT_OK: 'not_ok',
    NO_RESPONSE: 'no_response'
  };
  
  // Call statuses
  export const CALL_STATUSES = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    FAILED: 'failed',
    NO_ANSWER: 'no_answer'
  };