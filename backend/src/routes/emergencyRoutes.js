// File: backend/src/routes/emergencyRoutes.js
import express from "express";
import { emitTimerStart } from "../websocket/socketServer.js";
import {
  triggerEmergency,
  respondEmergency,
  getEmergencies,
  resolveEmergency,
} from "../controllers/emergencyController.js";
import Emergency from "../models/Emergency.js";
import { handleTimerExpiration, markFalseAlarm } from "../controllers/emergencyController.js";

const router = express.Router();

router.post("/trigger", triggerEmergency);
router.post("/respond", respondEmergency);
router.get("/", getEmergencies);
router.patch("/:id/resolve", resolveEmergency);

// Add to existing routes
router.post("/timer-expired", handleTimerExpiration);
router.post("/false-alarm", markFalseAlarm);

// Test endpoint to trigger a timer for development
router.post("/test/trigger-timer", async (req, res) => {
  try {
    const { patientId } = req.body;
    
    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }
    
    // Create a test emergency
    const timerDuration = 120000; // 2 minutes
    const timerEndTime = Date.now() + timerDuration;
    
    const testEmergency = new Emergency({
      patientId,
      anomalyType: 'heartRate',
      anomalyValue: 130,
      vitalsSnapshot: { 
        heartRate: 130,
        bloodPressure: { systolic: 120, diastolic: 80 },
        spO2: 98,
        temperature: 37.2
      },
      status: "pending",
      timestamps: { 
        triggeredAt: new Date(),
        timerStartedAt: new Date()
      }
    });
    
    await testEmergency.save();
    
    // Emit timer start event via WebSocket
    emitTimerStart({
      emergencyId: testEmergency._id,
      patientId,
      endTime: timerEndTime,
      duration: timerDuration
    });
    
    res.status(200).json({ 
      success: true, 
      message: "Test timer started",
      emergencyId: testEmergency._id
    });
  } catch (error) {
    console.error('Error triggering test timer:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add route to test timer expiration
router.post("/test/timer-expired", async (req, res) => {
  try {
    const { emergencyId } = req.body;
    
    if (!emergencyId) {
      return res.status(400).json({ error: "Emergency ID is required" });
    }
    
    // Call the handler directly
    await handleTimerExpiration(req, res);
  } catch (error) {
    console.error('Error handling test timer expiration:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;