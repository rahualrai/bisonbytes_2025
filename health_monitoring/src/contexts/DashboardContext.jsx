'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import useVitals from '@/hooks/useVitals';
import usePatientData from '@/hooks/usePatientData';
import useWebSocket from '@/hooks/useWebSocket';

// Create the context
const DashboardContext = createContext(null);

// Custom hook to use the dashboard context
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

// Provider component
export function DashboardProvider({ children }) {
  // Active dashboard tab state
  const [activeTab, setActiveTab] = useState(0);
  
  // Active panel states
  const [activePanels, setActivePanels] = useState({
    vitals: 'heartRate',
    patientHistory: 'conditions',
    emergency: 'alerts' // Changed from separate states to a single emergency state
  });
  
  // Use our custom hooks
  const vitalsData = useVitals(3000); // Refresh every 3 seconds
  const patientData = usePatientData();
  
  // Simulated WebSocket for real-time updates
  const webSocket = useWebSocket('wss://api.example.com/health-monitoring', {
    simulateMessages: true,
    messageInterval: 8000,
    onMessage: (data) => {
      if (data.type === 'vitals') {
        // In a real app, we might refresh data or update state directly
        console.log('Real-time vitals update received');
      }
    }
  });
  
  // Handle real-time updates from WebSocket
  useEffect(() => {
    if (webSocket.lastMessage && webSocket.lastMessage.type === 'vitals') {
      // Could update vitals data here if we wanted to bypass the polling
    }
  }, [webSocket.lastMessage]);
  
  // Handle tab switching
  const switchTab = (tabIndex) => {
    setActiveTab(tabIndex);
  };
  
  // Handle panel switching within tabs
  const switchPanel = (tabName, panelName) => {
    setActivePanels(prev => ({
      ...prev,
      [tabName]: panelName
    }));
  };
  
  // Value object to provide through context
  const value = {
    // Active states
    activeTab,
    activePanels,
    
    // Actions
    switchTab,
    switchPanel,
    
    // Vitals data
    vitals: vitalsData.vitals,
    vitalsLoading: vitalsData.loading,
    vitalsError: vitalsData.error,
    vitalsHistory: vitalsData.history,
    refreshVitals: vitalsData.refreshVitals,
    fetchVitalHistory: vitalsData.fetchVitalHistory,
    
    // Patient data
    patient: patientData.patient,
    patientLoading: patientData.loading,
    patientError: patientData.error,
    
    // WebSocket
    webSocketConnected: webSocket.connected,
    lastMessage: webSocket.lastMessage
  };
  
  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}