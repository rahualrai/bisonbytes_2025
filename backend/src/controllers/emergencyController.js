// File: backend/src/controllers/emergencyController.js
import testEmergency from "../models/testEmergencyModel.js";
import VitalsTesting from "../models/vitalsTestModel.js"; // Import the VitalsTesting model
import { emitEmergencyUpdate } from "../websocket/socketServer.js";
import { callTwilio } from "./twilioController.js";
import getAddress from "../services/geocodingService.js";

export const isEmergency = async (req, res) => {

  console.log(req.body);

  if (!req.body.emergencyTriggered) {
    console.log("Invalid input. Expected a boolean value.");
    return res.status(400).json({ error: "Invalid input. Expected a boolean value." });
  }

  // expect a responseId from the watch
  if (!req.body.responseId) {
    console.log("Invalid input. Expected a responseId.");
    return res.status(400).json({ error: "Invalid input. Expected a responseId." });
  };

  // check for lat and long from the watch
  if (!req.body.latitude || !req.body.longitude) {
    console.log("Invalid input. Expected a latitude and longitude.");
    return res.status(400).json({ error: "Invalid input. Expected a latitude and longitude." });
  }

  const coordinates = req.body.latitude.toString() + ", " + req.body.longitude.toString(); 
  console.log("Emergency triggered from watch");

  let address;
  try {
    // if called, use google maps api to get the address from the lat and long
    address = await getAddress(req.body.latitude, req.body.longitude);
    console.log("Address from Google Maps API:", address);
  }
  catch (error) {
    address = coordinates;
    console.error("Error getting address from Google Maps API:", error);
  }

  try {
    // if called, pull the vitals from the database using responseId
    const vitals = await VitalsTesting.findOne({ responseId: req.body.responseId });
    console.log("Vitals from database:", vitals);
  } catch (error) {
    console.error("Error getting vitals from database:", error);
    return res.status(500).json({ error: "Failed to get vitals from database." });
  }

  if (req.body.emergencyTriggered) {
    try {
      // if called, call the Twilio test call function and pass the vitals
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
  }else{
    console.log("No emergency triggered.");
    res.status(200).json({ message: "No emergency triggered." });
  }

  // save the emergency to the database
  const testemergency = new testEmergency({
    status: req.body.emergencyTriggered ? "escalated" : "false_alarm",
    timestamps: { triggeredAt: new Date() },
    responseId: req.body.responseId,
    address: address
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