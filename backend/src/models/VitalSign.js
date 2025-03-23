import mongoose from 'mongoose';

const VitalSignSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    index: true
  },
  readings: {
    heartRate: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    spO2: Number,
    temperature: Number,
    fallDetected: Boolean
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Add method to check if vitals are abnormal
VitalSignSchema.methods.isAbnormal = function() {
  const readings = this.readings;
  
  // Basic threshold checks
  if (readings.heartRate > 120 || readings.heartRate < 40) return true;
  if (readings.spO2 < 90) return true;
  if (readings.fallDetected) return true;
  if (readings.bloodPressure) {
    if (readings.bloodPressure.systolic > 180 || readings.bloodPressure.systolic < 90) return true;
    if (readings.bloodPressure.diastolic > 120 || readings.bloodPressure.diastolic < 60) return true;
  }
  
  return false;
};

export default mongoose.model('VitalSign', VitalSignSchema);