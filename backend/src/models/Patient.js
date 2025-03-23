import mongoose from 'mongoose';

const EmergencyContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  relation: String,
  phone: {
    type: String,
    required: true
  },
  isMainContact: {
    type: Boolean,
    default: false
  }
});

const PatientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: Number,
  gender: String,
  address: String,
  medicalConditions: [String],
  medications: [String],
  emergencyContacts: [EmergencyContactSchema],
  deviceId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Patient', PatientSchema);