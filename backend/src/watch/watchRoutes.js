import express from "express";
const router = express.Router();

let currentHeartRate = -1;

router.post("/viewVitals", (req, res) => {
  res.status(200).json({ heartRate: currentHeartRate });
});

router.post("/update-vitals", (req, res) => {
  const newHeartRate = req.body.heartRate;
  console.log(req.body);
  currentHeartRate = newHeartRate;
  res.status(200).json({ heartRate: newHeartRate });
});

export default router;