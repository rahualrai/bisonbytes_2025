import { useState, useEffect } from 'react';
import { io } from "socket.io-client";

export default function useWebSocket(url, options = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [timerData, setTimerData] = useState(null);
  
  useEffect(() => {
    console.log("Attempting to connect to Socket.IO server at:", url);
    
    const socket = io(url, {
      transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });
    
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket.IO connected');
    });
    
    socket.on('timer-start', (data) => {
      setLastMessage(data);
      setTimerData(data);
      if (options.onMessage) {
        options.onMessage({...data, type: 'timer-start'});
      }
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket.IO disconnected');
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });
    
    return () => {
      socket.disconnect();
    };
  }, [url]);
  
  return {
    isConnected,
    lastMessage,
    timerData
  };
}