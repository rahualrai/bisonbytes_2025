import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { createServer } from "http";
import { initSocketServer } from "./websocket/socketServer.js";
import { isEmergency } from "./controllers/emergencyController.js";
import twilioHandlers from "./controllers/twilioController.js";
import watchRoutes from "./watch/watchRoutes.js";
import mlHandlers from "./controllers/mlController.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js";
import vitalsRoutes from "./routes/vitalsRoutes.js";
import geminiRoutes from "./routes/geminiRoutes.js";
import connectDB from "./config/db.js"; 

const app = express();
app.use(cors({
  origin: '*', // Or your frontend URL for better security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// MongoDB connection
connectDB();

app.use("/", watchRoutes);
app.use("/api/emergencies", emergencyRoutes);
app.post("/trigger-emergency", isEmergency);
app.use("/api/patients", patientRoutes);
app.use("/api/twilio", twilioRoutes);
app.use("/api/vitals", vitalsRoutes);
app.use("/api/gemini", geminiRoutes);

// Twilio test call and gather webhook routes from controller
app.post("/api/twilio/test-call", twilioHandlers.callTwilio);
app.post("/process-gather", twilioHandlers.processGather);

// Healthcheck endpoint
app.get("/api/healthcheck", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const connected = dbState === 1 ? "connected" : "disconnected";
  res.json({ status: "ok", mongodb: connected });
});

// ML Prediction endpoint
app.post("/api/predict-emergency", mlHandlers.predictEmergency);

export const server = createServer(app);
initSocketServer(server);

export default app;