'use client';

import { createContext, useContext, useEffect } from 'react';
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
  
  // Simulated WebSocket for real-time emergency updates
  const webSocket = useWebSocket('wss://api.example.com/emergency-alerts', {
    simulateMessages: true,
    messageInterval: 10000,
    onMessage: (data) => {
      if (data.type === 'emergency') {
        console.log('Emergency update received:', data);
        // Refresh emergency data when receiving a WebSocket message
        emergencies.refreshCurrentEmergency();
      }
    }
  });
  
  // Automatically fetch emergency details when one is active
  useEffect(() => {
    if (emergencies.hasActive && emergencies.currentEmergency) {
      emergencies.fetchEmergencyDetails(emergencies.currentEmergency.id);
    }
  }, [emergencies.hasActive, emergencies.currentEmergency]);
  
  // Handle patient response to emergency
  const handlePatientResponse = async (emergencyId, response) => {
    // In a real app, this would be an API call
    console.log(`Patient responded to emergency ${emergencyId} with: ${response}`);
    
    const result = await emergencies.respondToEmergency(emergencyId, {
      type: 'patientResponse',
      response: response === 'ok' ? PATIENT_RESPONSE_TYPES.OK : PATIENT_RESPONSE_TYPES.NOT_OK
    });
    
    // Refresh after response
    if (result) {
      emergencies.refreshCurrentEmergency();
    }
    
    return result;
  };
  
  // Handle emergency resolution by healthcare provider
  const resolveEmergency = async (emergencyId, notes) => {
    // In a real app, this would be an API call
    console.log(`Resolving emergency ${emergencyId} with notes: ${notes}`);
    
    const result = await emergencies.respondToEmergency(emergencyId, {
      type: 'resolve',
      status: EMERGENCY_STATUSES.RESOLVED,
      notes
    });
    
    // Refresh after resolution
    if (result) {
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