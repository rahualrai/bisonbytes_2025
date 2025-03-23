import mongoose from "mongoose";

const EmergencySchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      required: true,
      index: true
    },
    anomalyType: {
      type: String,
      enum: ['heartRate', 'bloodPressure', 'spO2', 'fall', 'other'],
      required: true
    },
    anomalyValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    vitalsSnapshot: {
      type: Object,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'escalating', 'resolved', 'false_alarm'],
      default: 'pending'
    },
    patientResponse: {
      status: String,
      timestamp: Date
    },
    resolution: {
      type: {
        type: String,
        enum: ['resolved', 'false_alarm', 'emergency_services']
      },
      reason: String,
      timestamp: Date
    },
    timestamps: {
      triggeredAt: Date,
      timerStartedAt: Date,
      respondedAt: Date,
      escalatedAt: Date,
      resolvedAt: Date,
    },
    emergencyContactsCalled: [{
      contactId: String,
      timestamp: Date,
      callSid: String,
      status: String
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Emergency", EmergencySchema);