import express from "express";
import { v4 as uuidv4 } from "uuid"; // Import the uuid library
import Vitals from "../models/vitalsModel.js";
import VitalsTesting from "../models/vitalsTestModel.js";
import { predictEmergency } from "../controllers/mlController.js"; // Import the predictEmergency function

const router = express.Router();

let currentHeartRate = -1;

router.post("/viewVitals", async (req, res) => {
  try {
    const latestVitals = await VitalsTesting.findOne().sort({ timestamp: -1 });
    res.status(200).json({ heartRate: latestVitals ? latestVitals.heartRate : currentHeartRate });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/update-vitals", async (req, res) => {
  const {
    heartRate,
    stressScore,
    oxygenSaturation,
    respirationRate,
    temperature
  } = req.body;

  console.log("Received data:", req.body);
  currentHeartRate = heartRate;

  try {

    const responseId = uuidv4();

    const vitals = new VitalsTesting({
      heartRate,
      stressScore,
      oxygenSaturation,
      respirationRate,
      temperature,
      responseId,
    });
    console.log("Saving to database:", vitals);
    await vitals.save();
    console.log("Data saved to database successfully");

    // Call the predictEmergency function
    const predictionResponse = await new Promise((resolve, reject) => {
      const reqPredict = { body: req.body };
      const resPredict = {
        json: (data) => resolve(data),
        status: (statusCode) => ({
          json: (data) => reject({ statusCode, data }),
        }),
      };
      predictEmergency(reqPredict, resPredict);
    });

    console.log("Prediction response:", predictionResponse);
    const emergencyDetected = predictionResponse.emergency_probability > 0.60;
    res.status(200).json({
      status: "success",
      message: "Data saved successfully",
      emergency_probability: predictionResponse.emergency_probability,
      emergency_detected: emergencyDetected,
      responseId: responseId
    });
  } catch (error) {
    console.error("Error saving to database:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;