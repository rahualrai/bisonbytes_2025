// In backend/src/websocket/socketServer.js
import { Server } from "socket.io";

let io;

export const initSocketServer = (server) => {
  console.log("Initializing socket server");
  io = new Server(server, {
    cors: {
      origin: "*", // Or your frontend URL for better security
      methods: ["GET", "POST"]
    },
    path: '/socket.io', // Default Socket.IO path
  });
  
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    // Send JSON data on connection
    const jsonData = { message: "Welcome to the main namespace", timestamp: new Date() };
    socket.emit('welcome', jsonData);
    
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
  
  // Create a namespace for emergency events
  const emergencyNamespace = io.of('/emergency');
  
  emergencyNamespace.on('connection', (socket) => {
    console.log(`Emergency client connected: ${socket.id}`);
    
    // Send JSON data on connection
    const jsonData = { message: "Welcome to the emergency namespace", timestamp: new Date() };
    socket.emit('welcome', jsonData);
    
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
  console.log("Emitting vitals update:", data);
  if (io) io.emit("vitals-update", data);
};

// Emit emergency update to frontend
export const emitEmergencyUpdate = (data) => {
  console.log("Emitting emergency update:", data);
  if (io) io.emit("emergency-update", data);
};

// Emit false alarm to frontend
export const emitFalseAlarm = (data) => {
  if (io) io.emit("false-alarm", data);
};