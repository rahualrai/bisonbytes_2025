// File: backend/src/controllers/emergencyController.js
import testEmergency from "../models/testEmergencyModel.js";
import VitalsTesting from "../models/vitalsTestModel.js"; // Import the VitalsTesting model
import { emitEmergencyUpdate } from "../websocket/socketServer.js";
import { callTwilio } from "./twilioController.js";
import getAddress from "../services/geocodingService.js";

export const isEmergency = async (req, res) => {
  console.log("start isEmergency");

  if (!req.body.responseId) {
    return res.status(400).json({ error: "Invalid input. Expected a responseId." });
  }

  let vitals;
  try {
    vitals = await VitalsTesting.findOne({ responseId: req.body.responseId });
    console.log("Vitals from database:", vitals);
  } catch (error) {
    console.error("Error getting vitals from database:", error);
    return res.status(500).json({ error: "Failed to get vitals from database." });
  }

  const predata = {
    status: "initiated",
    timestamps: { triggeredAt: new Date() },
    responseId: req.body.responseId,
  };

  const testemergency = new testEmergency(predata);
  await testemergency.save();

  const all_alerts = await testEmergency.find().sort({ createdAt: -1 }).limit(5);
  emitEmergencyUpdate(all_alerts);

  if (typeof req.body.emergencyTriggered !== "boolean") {
    return res.status(400).json({ error: "Invalid input. Expected a boolean value." });
  }

  if (!req.body.latitude || !req.body.longitude) {
    return res.status(400).json({ error: "Invalid input. Expected a latitude and longitude." });
  }

  let address;
  try {
    address = await getAddress(req.body.latitude, req.body.longitude);
  } catch (error) {
    address = `${req.body.latitude}, ${req.body.longitude}`;
    console.error("Error getting address:", error);
  }

  if (req.body.emergencyTriggered) {
    try {
      const twilioResponse = await callTwilio(address, vitals);
      testemergency.address = address;
      testemergency.status = "escalated";
      await testemergency.save();

      const all_alerts = await testEmergency.find().sort({ createdAt: -1 }).limit(5);
      emitEmergencyUpdate(all_alerts);

      return res.status(200).json({ message: "Twilio call initiated.", sid: twilioResponse.sid });
    } catch (error) {
      console.error("Error triggering Twilio:", error);
      return res.status(500).json({ error: "Failed to trigger emergency call." });
    }
  } else {
    testemergency.address = address;
    testemergency.status = "false_alarm";
    await testemergency.save();

    const all_alerts = await testEmergency.find().sort({ createdAt: -1 }).limit(5);
    emitEmergencyUpdate(all_alerts);

    return res.status(200).json({ message: "No emergency triggered", responseId: req.body.responseId });
  }
};

export const triggerEmergency = async (req, res) => {
  const emergency = new Emergency({
    ...req.body,
    status: "initiated",
    timestamps: { triggeredAt: new Date() },
  });
  await emergencemitEmergencyUpdatey.save();
  (emergency);
  res.status(201).json(emergency);
};

export const respondEmergency = async (req, res) => {
  const { emergencyId, response } = req.body;
  const emergency = await Emergency.findById(emergencyId);
  if (!emergency) return res.status(404).json({ error: "Emergency not found." });

  if (response === "yes") emergency.status = "resolved";
  else emergency.status = "escalating";

  emergency.timestamps.respondedAt = new Date();
  await emergency.save();
  emitEmergencyUpdate(emergency);
  res.json(emergency);
};

export const getEmergencies = async (req, res) => {
  const testEmergencies = await testEmergency.find().sort({ triggeredAt: -1 }); 
  res.status(200).json(testEmergencies);
};

// New function to handle timer expiration from frontend
export const handleTimerExpiration = async (req, res) => {
  try {
    const { emergencyId } = req.body;
    const emergency = await Emergency.findById(emergencyId);
    
    if (!emergency) {
      return res.status(404).json({ error: "Emergency not found" });
    }
    
    if (emergency.status !== "pending") {
      return res.status(400).json({ error: "Emergency is not in pending state" });
    }
    
    // Escalate emergency
    emergency.status = "active";
    emergency.timestamps.escalatedAt = new Date();
    await emergency.save();
    
    // Emit emergency alert to frontend
    emitEmergencyAlert(emergency);
    
    // Call emergency contacts
    await NotificationService.callEmergencyContacts(emergency);
    
    res.status(200).json(emergency);
  } catch (error) {
    console.error('Error handling timer expiration:', error);
    res.status(500).json({ error: error.message });
  }
};

// New function for false alarm (no patient response needed)
export const markFalseAlarm = async (req, res) => {
  try {
    const { emergencyId, reason } = req.body;
    const emergency = await Emergency.findById(emergencyId);
    
    if (!emergency) {
      return res.status(404).json({ error: "Emergency not found" });
    }
    
    emergency.status = "resolved";
    emergency.resolution = {
      type: "false_alarm",
      reason: reason || "Automatic system determination",
      timestamp: new Date()
    };
    await emergency.save();
    
    // Cancel timer
    TimerManager.cancelTimer(emergencyId);
    
    // Notify frontend of false alarm
    emitFalseAlarm(emergency);
    
    res.status(200).json(emergency);
  } catch (error) {
    console.error('Error marking false alarm:', error);
    res.status(500).json({ error: error.message });
  }
};

export const resolveEmergency = async (req, res) => {
  const emergency = await Emergency.findById(req.params.id);
  if (!emergency) return res.status(404).json({ error: "Emergency not found." });

  emergency.status = "resolved";
  emergency.timestamps.resolvedAt = new Date();
  await emergency.save();
  emitEmergencyUpdate(emergency);
  res.json(emergency);
};