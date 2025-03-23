// In src/components/EmergencyTimer.jsx
import { useState, useEffect } from 'react';
import { useEmergency } from '@/contexts/EmergencyContext';

export default function EmergencyTimer() {
  const { timerInfo, handlePatientResponse } = useEmergency();
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  useEffect(() => {
    if (!timerInfo) return;
    
    // Calculate initial time remaining
    setTimeRemaining(Math.max(0, timerInfo.endTime - Date.now()));
    
    // Update timer every second
    const interval = setInterval(() => {
      const remaining = Math.max(0, timerInfo.endTime - Date.now());
      setTimeRemaining(remaining);
      
      // Auto-submit when timer expires
      if (remaining === 0) {
        clearInterval(interval);
        // Call API to notify backend that timer expired on frontend
        fetch('/api/emergency/timer-expired', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emergencyId: timerInfo.emergencyId })
        });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timerInfo]);
  
  if (!timerInfo) return null;
  
  // Format time remaining as minutes:seconds
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  return (
    <div className="emergency-timer">
      <h2>Emergency Alert</h2>
      <p>Are you OK? Please respond within:</p>
      <div className="timer-display">{formattedTime}</div>
      <div className="response-buttons">
        <button 
          className="ok-button" 
          onClick={() => handlePatientResponse(timerInfo.emergencyId, 'ok')}
        >
          I'm OK
        </button>
        <button 
          className="not-ok-button" 
          onClick={() => handlePatientResponse(timerInfo.emergencyId, 'not-ok')}
        >
          I need help
        </button>
      </div>
    </div>
  );
}