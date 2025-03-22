// File: backend/src/websocket/socketServer.js
import { Server } from "socket.io";

let io;
export const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export const emitEmergencyUpdate = (data) => {
  if (io) io.emit("emergency-update", data);
};
