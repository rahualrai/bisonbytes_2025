// In backend/src/websocket/socketServer.js
import { Server } from "socket.io";

let io;

export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Or your frontend URL for better security
      methods: ["GET", "POST"]
    },
    path: '/socket.io', // Default Socket.IO path
  });
  
  // Create a namespace for emergency events
  const emergencyNamespace = io.of('/emergency');
  
  emergencyNamespace.on('connection', (socket) => {
    console.log(`Emergency client connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
      console.log(`Emergency client disconnected: ${socket.id}`);
    });
  });
  
  return io;
};

// Emit timer start event
export const emitTimerStart = (data) => {
  if (io) io.of('/emergency').emit("timer-start", data);
};

// Emit emergency alert to frontend
export const emitEmergencyAlert = (data) => {
  if (io) io.of('/emergency').emit("emergency-alert", data);
};

// Emit vitals update to frontend
export const emitVitalsUpdate = (data) => {
  if (io) io.emit("vitals-update", data);
};

// Emit emergency update to frontend
export const emitEmergencyUpdate = (data) => {
  if (io) io.emit("emergency-update", data);
};

// Emit false alarm to frontend
export const emitFalseAlarm = (data) => {
  if (io) io.emit("false-alarm", data);
};