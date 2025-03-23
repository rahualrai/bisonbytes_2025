// File: backend/src/models/testEmergencyModel.js
import mongoose from "mongoose";

const TestEmergencySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['initiated', 'pending', 'active', 'escalating', 'resolved', 'false_alarm'],
      default: 'pending'
    },
    timestamps: {
      triggeredAt: Date,
      timerStartedAt: Date,
      respondedAt: Date,
      escalatedAt: Date,
      resolvedAt: Date,
    },
    responseID: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("TestEmergency", TestEmergencySchema);