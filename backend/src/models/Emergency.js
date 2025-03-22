// File: backend/src/models/Emergency.js
import mongoose from "mongoose";

const EmergencySchema = new mongoose.Schema(
  {
    patientId: String,
    vitalsSnapshot: Object,
    status: String,
    timestamps: {
      triggeredAt: Date,
      respondedAt: Date,
      resolvedAt: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Emergency", EmergencySchema);
