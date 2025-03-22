import { useState, useEffect } from 'react';
import { determineVitalStatus } from '@/lib/utils';

export default function useVitals(refreshInterval = 5000) {
  const [vitals, setVitals] = useState(null);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the latest vitals
  const fetchVitals = async () => {
    try {
      const response = await fetch('/api/vitals');
      
      if (!response.ok) {
        throw new Error('Failed to fetch vitals');
      }
      
      const data = await response.json();
      
      // Add status to each vital sign
      Object.keys(data).forEach(key => {
        if (key === 'bloodPressure') {
          data[key].status = determineVitalStatus(key, data[key].value);
        } else if (key !== 'sleep' && key !== 'steps') {
          data[key].status = determineVitalStatus(key, data[key].value);
        }
      });
      
      setVitals(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch historical data for a specific vital
  const fetchVitalHistory = async (vitalType, hours = 24) => {
    try {
      const response = await fetch(`/api/vitals?type=${vitalType}&hours=${hours}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${vitalType} history`);
      }
      
      const data = await response.json();
      setHistory(prev => ({ ...prev, [vitalType]: data }));
    } catch (err) {
      setError(err.message);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchVitals();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchVitals, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  return {
    vitals,
    history,
    loading,
    error,
    fetchVitalHistory,
    refreshVitals: fetchVitals
  };
}