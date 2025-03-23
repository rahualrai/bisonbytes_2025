// File: backend/src/controllers/emergencyController.js
import testEmergency from "../models/testEmergencyModel.js";
import { emitEmergencyUpdate } from "../websocket/socketServer.js";
import { callTwilio } from "./twilioController.js";

export const triggerEmergencyFromWatch = async (req, res) => {

  // expect a responseID from the watch
  if (!req.body.responseID) {
    return res.status(400).json({ error: "Invalid input. Expected a responseID." });
  };

  console.log("Emergency triggered from watch");

  try {
    // if called, call the Twilio test call function
    const twilioResponse = await callTwilio();
    if (twilioResponse.success) {
      res.status(200).json({ message: "Twilio call initiated.", sid: twilioResponse.sid });
    } else {
      res.status(500).json({ error: twilioResponse.error });
    }
  } catch (error) {
    console.error("Error triggering emergency:", error);
    res.status(500).json({ error: "Failed to trigger emergency." });
  }

  // save the emergency to the database
  const testemergency = new testEmergency({
    status: "initiated",
    timestamps: { triggeredAt: new Date() },
    responseID: req.body.responseID
  });

  await testemergency.save();
  emitEmergencyUpdate(testemergency);
};

export const triggerEmergency = async (req, res) => {
  const emergency = new Emergency({
    ...req.body,
    status: "initiated",
    timestamps: { triggeredAt: new Date() },
  });
  await emergency.save();
  emitEmergencyUpdate(emergency);
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
  const emergencies = await Emergency.find().sort({ createdAt: -1 });
  res.json(emergencies);
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