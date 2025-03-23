'use client';

import { useState, useEffect } from 'react';
import { useEmergency } from '@/contexts/EmergencyContext';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import { EMERGENCY_STATUSES, CALL_STATUSES } from '@/lib/constants';
import { AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function CurrentEmergencyContent() {
  const { 
    currentEmergency, 
    hasActiveEmergency, 
    loadingEmergency, 
    refreshEmergencies, 
    resolveEmergency,
    respondToEmergency
  } = useEmergency();
  
  const [countdown, setCountdown] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolving, setIsResolving] = useState(false);

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

  if (loadingEmergency) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-40 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!hasActiveEmergency) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <CheckCircle size={48} style={{ color: 'var(--color-success)' }} className="mb-4" />
        <h3 className="text-xl font-medium mb-2">No Active Emergencies</h3>
        <p className="text-gray-600 dark:text-gray-400">
          There are currently no active emergency alerts for this patient.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <Alert 
        variant="warning" 
        title={`${currentEmergency.type.replace(/([A-Z])/g, ' $1').trim()} Alert`}
      >
        {currentEmergency.detectedValue.type === "heartRate" && 
          `Patient's heart rate reached ${currentEmergency.detectedValue.value} bpm, exceeding the threshold of ${currentEmergency.detectedValue.threshold} bpm.`
        }
        {currentEmergency.detectedValue.type === "bloodPressure" && 
          `Patient's blood pressure reached ${currentEmergency.detectedValue.value.systolic}/${currentEmergency.detectedValue.value.diastolic} mmHg, outside the safe range.`
        }
        {currentEmergency.detectedValue.type === "spO2" && 
          `Patient's oxygen saturation dropped to ${currentEmergency.detectedValue.value}%, below the threshold of ${currentEmergency.detectedValue.threshold}%.`
        }
        {currentEmergency.detectedValue.type === "fall" && 
          `Fall detected at ${formatDate(currentEmergency.createdAt, { includeTime: true })}.`
        }
      </Alert>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Emergency Details</h3>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatTimeAgo(currentEmergency.createdAt)}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
            <div className="font-medium flex items-center">
              <StatusBadge status={currentEmergency.status.toLowerCase()} />
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Detected Value</div>
            <div className="font-medium">
              {currentEmergency.detectedValue.type === "heartRate" && 
                `${currentEmergency.detectedValue.value} bpm`
              }
              {currentEmergency.detectedValue.type === "bloodPressure" && 
                `${currentEmergency.detectedValue.value.systolic}/${currentEmergency.detectedValue.value.diastolic} mmHg`
              }
              {currentEmergency.detectedValue.type === "spO2" && 
                `${currentEmergency.detectedValue.value}%`
              }
              {currentEmergency.detectedValue.type === "fall" && 
                `Fall detected`
              }
            </div>
          </div>
        </div>
        
        <div className="mb-4 p-4 rounded" style={{ 
  border: '1px solid var(--panel-border)',
  background: 'var(--panel-background)'
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
                  onClick={() => respondToEmergency('ok')}
                  variant="outline"
                  className="response-ok"
                >
                  <CheckCircle size={16} />
                  I'm okay
                </Button>
                
                <Button 
                  onClick={() => respondToEmergency('help')}
                  variant="filled"
                  className="response-help"
                >
                  <XCircle size={16} />
                  I need help
                </Button>
              </div>
            </div>
          ) : (
            <p>Patient did not respond to the alert.</p>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="font-medium mb-2">Emergency Contacts Notified:</h3>
          <div className="space-y-3">
            {currentEmergency.contactsNotified.map((contact, index) => (
              <div key={index} className="flex justify-between items-center p-3 rounded" 
              style={{ background: 'var(--color-primary-light)' }}>
                <div>
                  <div className="font-medium">{contact.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{contact.phone}</div>
                </div>
                <div className="text-right">
                  <StatusBadge 
                    status={
                      contact.status === CALL_STATUSES.COMPLETED 
                        ? 'normal' 
                        : contact.status === CALL_STATUSES.IN_PROGRESS 
                          ? 'pending' 
                          : 'warning'
                    } 
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {contact.timestamp && formatTimeAgo(contact.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {currentEmergency.status === EMERGENCY_STATUSES.ACTIVE && (
          <div className="mt-6 p-4 rounded" style={{ background: 'var(--color-primary-light)' }}>
            <h3 className="font-medium mb-3">Resolve Emergency</h3>
            <div className="mb-3">
              <label htmlFor="resolution-note" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Resolution Note:
              </label>
              <textarea
                id="resolution-note"
                rows="2"
                className="w-full px-3 py-2 text-sm rounded-md shadow-sm focus:outline-none"
                style={{ 
                  background: 'var(--panel-background)',
                  border: '1px solid var(--panel-border)',
                  color: 'var(--foreground)'
                }}
                placeholder="Enter details about how the emergency was resolved..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
              ></textarea>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleResolveEmergency} 
                disabled={isResolving || !resolutionNote.trim()}
              >
                {isResolving ? 'Resolving...' : 'Mark as Resolved'}
              </Button>
              <Button variant="secondary" onClick={refreshEmergencies}>
                Refresh Status
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}