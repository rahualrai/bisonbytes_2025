import { useState, useEffect, useCallback } from 'react';

// This is a simulated WebSocket hook for real-time updates
// In a production app, this would connect to a real WebSocket server
export default function useWebSocket(url, options = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Generate random data for simulation
  const generateRandomData = useCallback(() => {
    const types = ['vitals', 'emergency', 'deviceStatus'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    let data;
    
    if (randomType === 'vitals') {
      data = {
        type: 'vitals',
        heartRate: Math.floor(Math.random() * 20) + 65,
        bloodPressure: {
          systolic: Math.floor(Math.random() * 20) + 110,
          diastolic: Math.floor(Math.random() * 15) + 70
        },
        spO2: Math.floor(Math.random() * 4) + 95,
        temperature: (Math.random() * 1 + 36.0).toFixed(1),
        timestamp: new Date().toISOString()
      };
    } else if (randomType === 'emergency') {
      const emergencyTypes = ['fall', 'heartRate', 'bloodPressure', 'spO2'];
      data = {
        type: 'emergency',
        emergencyType: emergencyTypes[Math.floor(Math.random() * emergencyTypes.length)],
        status: Math.random() > 0.8 ? 'active' : 'resolved',
        timestamp: new Date().toISOString()
      };
    } else {
      data = {
        type: 'deviceStatus',
        batteryLevel: `${Math.floor(Math.random() * 100)}%`,
        connected: Math.random() > 0.1,
        lastSynced: new Date().toISOString()
      };
    }
    
    return data;
  }, []);

  // Simulate connection and message handling
  useEffect(() => {
    if (!url) return;
    
    // Simulate connection delay
    const connectionTimeout = setTimeout(() => {
      setIsConnected(true);
      console.log('WebSocket connected (simulated)');
    }, 1000);
    
    // Simulate receiving messages
    let messageInterval;
    if (options.simulateMessages !== false) {
      messageInterval = setInterval(() => {
        if (Math.random() > 0.7 || !isConnected) return; // Random chance of no message
        
        const data = generateRandomData();
        setLastMessage(data);
        setMessages(prev => [...prev, data]);
        
        // Call onMessage callback if provided
        if (options.onMessage) {
          options.onMessage(data);
        }
      }, options.messageInterval || 5000);
    }
    
    return () => {
      clearTimeout(connectionTimeout);
      clearInterval(messageInterval);
      setIsConnected(false);
      console.log('WebSocket disconnected (simulated)');
    };
  }, [url, options, isConnected, generateRandomData]);

  // Method to send a message (simulated)
  const sendMessage = useCallback((message) => {
    if (!isConnected) {
      setError('Cannot send message: WebSocket not connected');
      return false;
    }
    
    console.log('Message sent (simulated):', message);
    
    // Simulate response after delay
    setTimeout(() => {
      const responseData = {
        type: 'response',
        requestId: Math.random().toString(36).substring(2, 9),
        status: 'success',
        timestamp: new Date().toISOString()
      };
      
      setLastMessage(responseData);
      setMessages(prev => [...prev, responseData]);
      
      if (options.onMessage) {
        options.onMessage(responseData);
      }
    }, 500);
    
    return true;
  }, [isConnected, options]);

  return {
    isConnected,
    lastMessage,
    messages,
    error,
    sendMessage
  };
}