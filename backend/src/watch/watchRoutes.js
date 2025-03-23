import express from "express";
import Vitals from "../models/vitalsModel.js";
import { predictEmergency } from "../controllers/mlController.js"; // Import the predictEmergency function

const router = express.Router();

let currentHeartRate = -1;

router.post("/viewVitals", async (req, res) => {
  try {
    const latestVitals = await Vitals.findOne().sort({ timestamp: -1 });
    res.status(200).json({ heartRate: latestVitals ? latestVitals.heartRate : currentHeartRate });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/update-vitals", async (req, res) => {
  const {
    heartRate,
    heartBeatIntervals,
    calories,
    distance,
    floorsClimbed,
    steps,
    stressScore,
    respirationRate,
    timeToRecovery,
    oxygenSaturation,
    temperature,
    cadence,
    pressure
  } = req.body;

  console.log("Received data:", req.body);
  currentHeartRate = heartRate;

  try {
    const vitals = new Vitals({
      heartRate,
      heartBeatIntervals,
      calories,
      distance,
      floorsClimbed,
      steps,
      stressScore,
      respirationRate,
      timeToRecovery,
      oxygenSaturation,
      temperature,
      cadence,
      pressure
    });
    console.log("Saving to database:", vitals);
    await vitals.save();
    console.log("Data saved to database successfully");

    // Call the predictEmergency function
    const predictionResponse = await new Promise((resolve, reject) => {
      const reqMock = { body: req.body };
      const resMock = {
        json: (data) => resolve(data),
        status: (statusCode) => ({
          json: (data) => reject({ statusCode, data }),
        }),
      };
      predictEmergency(reqMock, resMock);
    });

    console.log("Prediction response:", predictionResponse);
    const emergencyDetected = predictionResponse.emergency_probability > 0.75;
    res.status(200).json({
      status: "success",
      message: "Data saved successfully",
      emergency_probability: predictionResponse.emergency_probability,
      emergency_detected: emergencyDetected,
    });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;