// File: /c:/Users/raira/Documents/helllo/bisonbytes_2025/health_monitoring/src/contexts/EmergencyContext.jsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import useEmergencies from '@/hooks/useEmergencies';
import useWebSocket from '@/hooks/useWebSocket';
import { EMERGENCY_STATUSES, PATIENT_RESPONSE_TYPES } from '@/lib/constants';

// Create the context
const EmergencyContext = createContext(null);

// Custom hook to use the emergency context
export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

// Provider component
export function EmergencyProvider({ children }) {
  // Use our custom hooks
  const emergencies = useEmergencies(3000); // Refresh every 3 seconds
  
  // Track timer state
  const [timerInfo, setTimerInfo] = useState(null);
  const [emergencyAlertActive, setEmergencyAlertActive] = useState(false);
  
  // Real WebSocket connection to backend
  const backendWsUrl = process.env.PORT || 'http://localhost:3001';
  const webSocket = useWebSocket(`${backendWsUrl}/emergency`, {
    onMessage: (data) => {
      console.log('WebSocket message received:', data);
      
      // Handle different message types
      if (data.type === 'timer-start') {
        console.log('Timer event received:', data);
        setTimerInfo({
          emergencyId: data.emergencyId,
          patientId: data.patientId,
          endTime: data.endTime,
          duration: data.duration,
          startTime: Date.now()
        });
        emergencies.refreshCurrentEmergency();
      } 
      else if (data.type === 'emergency-update') {
        console.log('Emergency update received:', data);
        emergencies.refreshCurrentEmergency();
      } 
      else if (data.type === 'false-alarm') {
        console.log('False alarm received:', data);
        setTimerInfo(null);
        emergencies.refreshCurrentEmergency();
      }
      else if (data.type === 'emergency-alert') {
        console.log('Emergency alert received:', data);
        setEmergencyAlertActive(true);
        emergencies.refreshCurrentEmergency();
      }
      else if (data.type === 'vitals-update') {
        // Handle vitals update if needed
        console.log('Vitals update received:', data);
      }
    }
  });
  
  // Automatically fetch emergency details when one is active
  useEffect(() => {
    if (emergencies.hasActive && emergencies.currentEmergency) {
      emergencies.fetchEmergencyDetails(emergencies.currentEmergency.id);
    }
  }, [emergencies.hasActive, emergencies.currentEmergency]);
  
  // Clear timer if emergency is resolved
  useEffect(() => {
    if (emergencies.currentEmergency && 
        (emergencies.currentEmergency.status === EMERGENCY_STATUSES.RESOLVED ||
         emergencies.currentEmergency.status === 'false_alarm')) {
      setTimerInfo(null);
      setEmergencyAlertActive(false);
    }
  }, [emergencies.currentEmergency]);
  
  // Handle patient response to emergency
  const handlePatientResponse = async (emergencyId, response) => {
    console.log(`Patient responded to emergency ${emergencyId} with: ${response}`);
    
    // Clear timer UI immediately
    setTimerInfo(null);
    
    const result = await emergencies.respondToEmergency(emergencyId, {
      type: 'patientResponse',
      response: response === 'ok' ? PATIENT_RESPONSE_TYPES.OK : PATIENT_RESPONSE_TYPES.NOT_OK
    });
    
    // If not OK, show emergency alert
    if (response === 'not-ok') {
      setEmergencyAlertActive(true);
    }
    
    // Refresh after response
    if (result) {
      emergencies.refreshCurrentEmergency();
    }
    
    return result;
  };
  
  // Handle timer expiration
  const handleTimerExpiration = async (emergencyId) => {
    console.log(`Timer expired for emergency ${emergencyId}`);
    
    // Make API call to backend to notify timer expiration
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies/test/timer-expired`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emergencyId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to notify backend of timer expiration');
      }
      
      // Update state after successful API call
      setEmergencyAlertActive(true);
      emergencies.refreshCurrentEmergency();
      
    } catch (error) {
      console.error('Error handling timer expiration:', error);
    }
  };
  
  // Handle emergency resolution by healthcare provider
  const resolveEmergency = async (emergencyId, notes) => {
    console.log(`Resolving emergency ${emergencyId} with notes: ${notes}`);
    
    const result = await emergencies.respondToEmergency(emergencyId, {
      type: 'resolve',
      status: EMERGENCY_STATUSES.RESOLVED,
      notes
    });
    
    // Clear states after resolution
    if (result) {
      setTimerInfo(null);
      setEmergencyAlertActive(false);
      emergencies.refreshCurrentEmergency();
      emergencies.refreshHistory();
    }
    
    return result;
  };
  
  // Value object to provide through context
  const value = {
    // Current emergency state
    currentEmergency: emergencies.currentEmergency,
    hasActiveEmergency: emergencies.hasActive,
    loadingEmergency: emergencies.loading,
    emergencyError: emergencies.error,
    
    // Timer state
    timerInfo,
    clearTimer: () => setTimerInfo(null),
    handleTimerExpiration,
    
    // Emergency alert state
    emergencyAlertActive,
    setEmergencyAlertActive,
    
    // Emergency history
    emergencyHistory: emergencies.history,
    selectedEmergency: emergencies.selectedEmergency,
    selectEmergency: emergencies.setSelectedEmergency,
    fetchEmergencyDetails: emergencies.fetchEmergencyDetails,
    
    // Actions
    handlePatientResponse,
    resolveEmergency,
    refreshEmergencies: emergencies.refreshCurrentEmergency,
    
    // WebSocket state
    webSocketConnected: webSocket.isConnected,
    lastEmergencyUpdate: webSocket.lastMessage
  };
  
  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
}