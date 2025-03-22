// backend/src/routes/patientRoutes.js
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Patient routes will go here.");
});

export default router;
