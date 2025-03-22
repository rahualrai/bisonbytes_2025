import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import twilioRoutes from "./routes/twilioRoutes.js";
import mongoose from "mongoose";
import { createServer } from "http";
import { initSocketServer } from "./websocket/socketServer.js";
import twilioHandlers from "./controllers/twilioController.js";
import testRoutes from "./testing/testingRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", testRoutes);

app.use("/api/emergencies", emergencyRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/twilio", twilioRoutes);

// Twilio test call and gather webhook routes from controller
app.post("/api/twilio/test-call", twilioHandlers.testTwilioCall);
app.post("/process-gather", twilioHandlers.processGather);

// Healthcheck endpoint
app.get("/api/healthcheck", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const connected = dbState === 1 ? "connected" : "disconnected";
  res.json({ status: "ok", mongodb: connected });
});

export const server = createServer(app);
initSocketServer(server);

export default app;