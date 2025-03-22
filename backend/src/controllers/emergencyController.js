// File: backend/src/controllers/emergencyController.js
import Emergency from "../models/Emergency.js";
import { emitEmergencyUpdate } from "../websocket/socketServer.js";

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

export const resolveEmergency = async (req, res) => {
  const emergency = await Emergency.findById(req.params.id);
  if (!emergency) return res.status(404).json({ error: "Emergency not found." });

  emergency.status = "resolved";
  emergency.timestamps.resolvedAt = new Date();
  await emergency.save();
  emitEmergencyUpdate(emergency);
  res.json(emergency);
};
