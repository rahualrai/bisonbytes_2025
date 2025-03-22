// File: backend/src/routes/emergencyRoutes.js
import express from "express";
import {
  triggerEmergency,
  respondEmergency,
  getEmergencies,
  resolveEmergency,
} from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/trigger", triggerEmergency);
router.post("/respond", respondEmergency);
router.get("/", getEmergencies);
router.patch("/:id/resolve", resolveEmergency);

export default router;