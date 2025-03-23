// File: backend/src/models/testEmergencyModel.js
import mongoose from "mongoose";

const TestEmergencySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['initiated', 'escalated', 'false_alarm'],
      default: 'initiated'
    },
    timestamps: {
      triggeredAt: Date,
      timerStartedAt: Date,
      respondedAt: Date,
      escalatedAt: Date,
      resolvedAt: Date,
    },
    responseId: {
      type: String,
      required: true
    },
    address: {
      type: String,
    }
  },
  { timestamps: true }
);

export default mongoose.model("TestEmergency", TestEmergencySchema);