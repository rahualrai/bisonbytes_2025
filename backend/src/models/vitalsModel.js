import mongoose from "mongoose";

const vitalsSchema = new mongoose.Schema({
  heartRate: {
    type: Number,
  },
  heartBeatIntervals: {
    type: Number,
  },
  calories: {
    type: Number,
  },
  distance: {
    type: Number,
  },
  floorsClimbed: {
    type: Number,
  },
  steps: {
    type: Number,
  },
  stressScore: {
    type: Number,
  },
  respirationRate: {
    type: Number,
  },
  timeToRecovery: {
    type: Number,
  },
  oxygenSaturation: {
    type: Number,
  },
  temperature: {
    type: Number,
  },
  cadence: {
    type: Number,
  },
  pressure: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Vitals = mongoose.model("Vitals", vitalsSchema);

export default Vitals;