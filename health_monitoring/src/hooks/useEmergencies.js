import { useState, useEffect } from 'react';

export default function useEmergencies(refreshInterval = 5000) {
  const [currentEmergency, setCurrentEmergency] = useState(null);
  const [hasActive, setHasActive] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current emergency status
  const fetchCurrentEmergency = async () => {
    try {
      const response = await fetch('/api/emergencies?current=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch current emergency');
      }
      
      const data = await response.json();
      setCurrentEmergency(data.emergency);
      setHasActive(data.hasActive);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch emergency history
  const fetchEmergencyHistory = async () => {
    try {
      const response = await fetch('/api/emergencies');
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency history');
      }
      
      const data = await response.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch detailed emergency by ID
  const fetchEmergencyDetails = async (id) => {
    if (!id) return;
    
    try {
      const response = await fetch(`/api/history?id=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency details');
      }
      
      const data = await response.json();
      setSelectedEmergency(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Simulate responding to an emergency
  const respondToEmergency = async (emergencyId, action) => {
    // In a real app, this would be an API call
    console.log(`Responding to emergency ${emergencyId} with action: ${action}`);
    
    // Simulate a response delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Refresh the current emergency status
    fetchCurrentEmergency();
    return true;
  };

  // Initial fetch
  useEffect(() => {
    fetchCurrentEmergency();
    fetchEmergencyHistory();
    
    // Set up polling for real-time updates of current emergency
    const intervalId = setInterval(fetchCurrentEmergency, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return {
    currentEmergency,
    hasActive,
    history,
    selectedEmergency,
    loading,
    error,
    fetchEmergencyDetails,
    refreshCurrentEmergency: fetchCurrentEmergency,
    refreshHistory: fetchEmergencyHistory,
    respondToEmergency,
    setSelectedEmergency
  };
}