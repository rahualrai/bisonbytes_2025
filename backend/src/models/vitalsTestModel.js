import { response } from "express";
import mongoose from "mongoose";

const vitalsTestSchema = new mongoose.Schema({
  heartRate: {
    type: Number,
    required: true,
  },
  stressScore: {
    type: Number
  },
  oxygenSaturation: {
    type: Number,
    required: true,
  },
  respirationRate: {
    type: Number
  },
  temperature: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  responseId: {
    type: String,
    required: true,
  },
});

// Use the 'vitals_testing' collection
const VitalsTesting = mongoose.model("VitalsTesting", vitalsTestSchema, "vitals_testing");

export default VitalsTesting;