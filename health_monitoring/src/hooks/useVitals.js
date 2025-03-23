import { useState, useEffect, useCallback } from 'react';
import { determineVitalStatus } from '@/lib/utils';

export default function useVitals(refreshInterval = 5000) {
  const [vitals, setVitals] = useState(null);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the latest vitals
  const fetchVitals = useCallback(async () => {
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
  }, []);

  // Fetch historical data for a specific vital - now memoized with useCallback
  const fetchVitalHistory = useCallback(async (vitalType, hours = 24) => {
    try {
      const response = await fetch(`/api/vitals?type=${vitalType}&hours=${hours}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${vitalType} history`);
      }
      
      const data = await response.json();
      setHistory(prev => ({ ...prev, [vitalType]: data }));
      return data; // Return the data for the caller
    } catch (err) {
      setError(err.message);
      return []; // Return empty array on error to avoid undefined
    }
  }, []); // Empty dependency array to keep function reference stable

  // Initial fetch
  useEffect(() => {
    fetchVitals();
    
    // Set up polling for real-time updates
    const intervalId = setInterval(fetchVitals, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchVitals]); // Added fetchVitals as dependency

  return {
    vitals,
    history,
    loading,
    error,
    fetchVitalHistory,
    refreshVitals: fetchVitals
  };
}