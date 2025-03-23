'use client';

import { useState, useEffect } from 'react';
import { useEmergency } from '@/contexts/EmergencyContext';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { EMERGENCY_STATUSES, CALL_STATUSES } from '@/lib/constants';
import { AlertTriangle, Clock, CheckCircle, XCircle, Play } from 'lucide-react';
import EmergencyTimer from '@/components/EmergencyTimer';

// Test controls component to trigger test events (development only)
function TestControls() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  
  const handleTestTimer = async () => {
    try {
      setIsLoading(true);
      setResult(null);
      
      // You'll need to use a valid patient ID from your system
      const patientId = "test-patient-123"; // Replace with a valid ID
      
      const response = await fetch(`${apiUrl}/api/emergencies/test/trigger-timer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to trigger test timer');
      }
      
      setResult({
        success: true,
        message: data.message,
        emergencyId: data.emergencyId
      });
      
      console.log("Test timer triggered:", data);
    } catch (error) {
      console.error('Error triggering test timer:', error);
      setResult({
        success: false,
        message: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <h3 className="font-medium mb-2">Development Testing</h3>
      
      <Button 
        onClick={handleTestTimer}
        disabled={isLoading}
        className="bg-purple-100 border-purple-300 hover:bg-purple-200 dark:bg-purple-900/30 dark:border-purple-700"
      >
        <Play size={16} className="mr-2" />
        Trigger Test Emergency Timer
      </Button>
      
      {isLoading && (
        <p className="mt-2 text-sm opacity-70">Triggering test timer...</p>
      )}
      
      {result && (
        <div className={`mt-2 p-2 text-sm rounded ${result.success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>
          <p>{result.success ? `✅ ${result.message}` : `❌ ${result.message}`}</p>
          {result.emergencyId && (
            <p className="text-xs mt-1 opacity-70">Emergency ID: {result.emergencyId}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function CurrentEmergencyContent() {
  const { 
    currentEmergency, 
    hasActiveEmergency, 
    loadingEmergency, 
    refreshEmergencies, 
    resolveEmergency,
    timerInfo,
    handlePatientResponse
  } = useEmergency();
  
  const [countdown, setCountdown] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const { 
    timestamps = {}, 
    patientResponse = {},
    vitalsSnapshot = {},
  } = currentEmergency || {};

  // Handle countdown timer for active emergencies
  useEffect(() => {
    if (
      currentEmergency && 
      currentEmergency.status === EMERGENCY_STATUSES.ACTIVE && 
      currentEmergency.countdown && 
      !currentEmergency.countdown.completed
    ) {
      const startTime = new Date(currentEmergency.countdown.started).getTime();
      const duration = currentEmergency.countdown.duration * 1000;
      const endTime = startTime + duration;
      
      const updateCountdown = () => {
        const now = Date.now();
        const timeLeft = Math.max(0, endTime - now);
        
        if (timeLeft > 0) {
          setCountdown(Math.ceil(timeLeft / 1000));
        } else {
          setCountdown(0);
          clearInterval(intervalId);
        }
      };
      
      // Initial update
      updateCountdown();
      
      // Set up interval
      const intervalId = setInterval(updateCountdown, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [currentEmergency]);

  const handleResolveEmergency = async () => {
    if (!currentEmergency) return;
    
    setIsResolving(true);
    await resolveEmergency(currentEmergency.id, resolutionNote);
    setIsResolving(false);
    setResolutionNote('');
  };

  // Show loading state
  if (loadingEmergency) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading emergency information...</div>
      </div>
    );
  }

  // Show no active emergencies state
  if (!hasActiveEmergency && !timerInfo) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 mb-3">
            <CheckCircle className="text-green-600 dark:text-green-500" />
          </div>
          <h3 className="text-lg font-medium mb-1">No Active Emergencies</h3>
          <p className="text-muted-foreground">
            The patient is currently not experiencing any emergency situations.
          </p>
        </div>
        
        {/* Development testing controls */}
        {process.env.NODE_ENV === 'development' && <TestControls />}
      </div>
    );
  }

  // Display active emergency timer from WebSocket
  if (timerInfo) {
    return (
      <div className="p-4">
        <div className="emergency-timer-container mt-2 p-4 border border-orange-300 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Clock className="mr-2" size={20} />
            Emergency Alert - Response Required
          </h3>
          
          <EmergencyTimer />
        </div>
        
        {/* Development testing controls */}
        {process.env.NODE_ENV === 'development' && <TestControls />}
      </div>
    );
  }

  // Display active emergency information
  return (
    <div className="p-4">
      {currentEmergency && (
        <>
          {/* Emergency Details */}
          <div className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">Emergency Details</h3>
              <StatusBadge status={currentEmergency.status} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <span className="text-xs opacity-70">Triggered</span>
                <div>{formatDate(currentEmergency.timestamps.triggeredAt)}</div>
              </div>
              <div>
                <span className="text-xs opacity-70">Type</span>
                <div className="capitalize">{currentEmergency.anomalyType}</div>
              </div>
              <div>
                <span className="text-xs opacity-70">Value</span>
                <div>{currentEmergency.anomalyValue}</div>
              </div>
              <div>
                <span className="text-xs opacity-70">Status</span>
                <div>{currentEmergency.status}</div>
              </div>
            </div>
          </div>
          
          {/* Patient Response Section */}
          <div className="mb-4 p-3 rounded-lg" style={{
            backgroundColor: 'var(--accent)',
            border: '1px solid var(--accent-border)'
          }}>
          <h3 className="font-medium mb-2">Patient Response</h3>
          
          {currentEmergency.patientResponse && currentEmergency.patientResponse.timestamp ? (
            <p>
              Patient responded: <strong>
                {currentEmergency.patientResponse.status === 'ok' 
                  ? "I'm okay" 
                  : "I need help"}
              </strong> ({formatTimeAgo(currentEmergency.patientResponse.timestamp)})
            </p>
          ) : countdown !== null && countdown > 0 ? (
            <div className="text-center">
            <div className="text-xl font-bold animate-pulse" style={{ color: 'var(--color-danger)' }}>{countdown}s</div>
            <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
                Waiting for patient response...
              </p>
              <div className="mt-3 flex justify-center space-x-3">
                <Button 
                  onClick={() => handlePatientResponse(currentEmergency.id, 'ok')}
                  variant="outline"
                  className="response-ok"
                >
                  <CheckCircle size={16} className="mr-1" />
                  I'm okay
                </Button>
                
                <Button 
                  onClick={() => handlePatientResponse(currentEmergency.id, 'not-ok')}
                  variant="filled"
                  className="response-help"
                >
                  <XCircle size={16} className="mr-1" />
                  I need help
                </Button>
              </div>
            </div>
          ) : (
            <p>Patient did not respond to the alert.</p>
          )}
          </div>
          
          {/* Emergency Calls Section */}
          {currentEmergency.calls && currentEmergency.calls.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Emergency Calls</h3>
              <ul className="space-y-2">
                {currentEmergency.calls.map((call, index) => (
                  <li key={index} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded">
                    <div>
                      <div>{call.contactName}</div>
                      <div className="text-xs opacity-70">{call.contactPhone}</div>
                    </div>
                    <div>
                      <StatusBadge 
                        status={call.status} 
                        statusMap={CALL_STATUSES}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Emergency Resolution Section */}
          {currentEmergency.status === EMERGENCY_STATUSES.ACTIVE && (
            <div className="mt-6">
              <h3 className="font-medium mb-2">Emergency Resolution</h3>
              <div className="space-y-3">
                <textarea
                  className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-700"
                  rows={3}
                  placeholder="Enter notes about the emergency resolution..."
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                />
                <Button
                  onClick={handleResolveEmergency}
                  disabled={isResolving}
                  className="w-full"
                >
                  {isResolving ? 'Resolving...' : 'Resolve Emergency'}
                </Button>
              </div>
            </div>
          )}
          
          {/* Development testing controls */}
          {process.env.NODE_ENV === 'development' && <TestControls />}
        </>
      )}
    </div>
  );
}