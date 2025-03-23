'use client';

import { useState } from 'react';
import { useEmergency } from '@/contexts/EmergencyContext';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import Tabs from '@/components/ui/Tabs';

export default function EmergencyHistoryContent() {
  const { emergencyHistory, loadingEmergency, selectedEmergency, selectEmergency, fetchEmergencyDetails } = useEmergency();
  const [filter, setFilter] = useState('all');
  const [timeframe, setTimeframe] = useState('week');
  
  const filteredHistory = emergencyHistory ? emergencyHistory.filter(emergency => {
    const statusMatch = filter === 'all' || emergency.status.toLowerCase() === filter;
    
    if (!statusMatch) return false;
    
    // Time filter logic
    const emergencyDate = new Date(emergency.createdAt);
    const now = new Date();
    
    if (timeframe === 'day') {
      // Last 24 hours
      return (now - emergencyDate) <= 24 * 60 * 60 * 1000;
    } else if (timeframe === 'week') {
      // Last 7 days
      return (now - emergencyDate) <= 7 * 24 * 60 * 60 * 1000;
    } else if (timeframe === 'month') {
      // Last 30 days
      return (now - emergencyDate) <= 30 * 24 * 60 * 60 * 1000;
    }
    
    return true;
  }) : [];
  
  const handleSelectEmergency = (emergency) => {
    selectEmergency(emergency);
    
    if (emergency && emergency.id) {
      fetchEmergencyDetails(emergency.id);
    }
  };

  if (loadingEmergency) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col w-full max-w-md">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-3"></div>
          <div className="h-12 bg-gray-200 rounded mb-3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const EmergencyList = () => (
    <div className="space-y-2 overflow-y-auto max-h-[400px]">
      {filteredHistory.length === 0 ? (
        <div className="text-center p-4" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
          No emergencies found for the selected filters.
        </div>
      ) : (
        filteredHistory.map(emergency => (
      <div 
        key={emergency.id} 
        className="p-3 border rounded-lg cursor-pointer transition-colors"
        style={{
          background: selectedEmergency && selectedEmergency.id === emergency.id 
            ? 'var(--color-primary-light)' 
            : 'var(--panel-background)',
          borderColor: selectedEmergency && selectedEmergency.id === emergency.id 
            ? 'var(--color-primary)' 
            : 'var(--panel-border)'
        }}
        onClick={() => handleSelectEmergency(emergency)}
      >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  {emergency.type.replace(/([A-Z])/g, ' $1').trim()} Emergency
                </h4>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(emergency.createdAt, { includeTime: true })}
                </div>
              </div>
              <StatusBadge status={emergency.status?.toLowerCase()} />
            </div>
            <div className="mt-2 text-sm">
              {emergency.detectedValue.type === "heartRate" && 
                `Heart rate: ${emergency.detectedValue.value} bpm`
              }
              {emergency.detectedValue.type === "bloodPressure" && 
                `Blood pressure: ${emergency.detectedValue.value.systolic}/${emergency.detectedValue.value.diastolic} mmHg`
              }
              {emergency.detectedValue.type === "spO2" && 
                `Oxygen saturation: ${emergency.detectedValue.value}%`
              }
              {emergency.detectedValue.type === "fall" && 
                `Fall detected`
              }
            </div>
          </div>
        ))
      )}
    </div>
  );

  const EmergencyDetails = () => {
    if (!selectedEmergency) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Select an emergency from the list to view details
          </p>
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 overflow-y-auto h-full">
        <h3 className="text-lg font-medium mb-3">Emergency Details</h3>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Type</h4>
          <p className="text-lg font-medium">
            {selectedEmergency.type.replace(/([A-Z])/g, ' $1').trim()} Emergency
          </p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Time</h4>
          <p>{formatDate(selectedEmergency.createdAt, { includeTime: true })}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Status</h4>
          <StatusBadge status={selectedEmergency.status?.toLowerCase() || 'unknown'} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <h4 className="text-sm font-medium mb-1">Detected Value</h4>
            <p className="text-lg">
              {selectedEmergency.detectedValue.type === "heartRate" && 
                `${selectedEmergency.detectedValue.value} bpm`
              }
              {selectedEmergency.detectedValue.type === "bloodPressure" && 
                `${selectedEmergency.detectedValue.value.systolic}/${selectedEmergency.detectedValue.value.diastolic} mmHg`
              }
              {selectedEmergency.detectedValue.type === "spO2" && 
                `${selectedEmergency.detectedValue.value}%`
              }
              {selectedEmergency.detectedValue.type === "fall" && 
                `Fall detected`
              }
            </p>
          </div>
          <div style={{ background: 'var(--color-primary-light)', borderRadius: '0.375rem' }} className="p-3">
            <h4 className="text-sm font-medium mb-1">Patient Response</h4>
            <p className="text-lg">
              {selectedEmergency.patientResponse.timestamp 
                ? selectedEmergency.patientResponse.status === 'ok' 
                  ? "I'm okay" 
                  : "I need help"
                : "No response"
              }
            </p>
          </div>
        </div>
        
        {selectedEmergency.contactsNotified && selectedEmergency.contactsNotified.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Contacts Notified</h4>
            <div className="space-y-2">
              {selectedEmergency.contactsNotified.map((contact, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  <span>{contact.name}</span>
                  <StatusBadge 
                    status={
                      contact.status === 'completed' 
                        ? 'normal' 
                        : contact.status === 'in-progress' 
                          ? 'pending' 
                          : 'warning'
                    } 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedEmergency.resolution && selectedEmergency.resolution.timestamp && (
          <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg border border-green-100 dark:border-green-800">
            <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">Resolution</h4>
            <p>{selectedEmergency.resolution.notes}</p>
            <p className="text-xs text-gray-500 mt-2">
              Resolved at {formatDate(selectedEmergency.resolution.timestamp, { includeTime: true })}
            </p>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    {
      label: "Recent Emergencies",
      content: (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant={filter === 'all' ? "primary" : "secondary"}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'active' ? "primary" : "secondary"}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'resolved' ? "primary" : "secondary"}
              onClick={() => setFilter('resolved')}
            >
              Resolved
            </Button>
            <div className="ml-auto">
              <select 
                className="px-2 py-1 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
              >
                <option value="day">Last 24 hours</option>
                <option value="week">Last 7 days</option>
                <option value="month">Last 30 days</option>
                <option value="all">All time</option>
              </select>
            </div>
          </div>
          <EmergencyList />
        </div>
      )
    },
    {
      label: "Emergency Details",
      content: <EmergencyDetails />
    }
  ];

  return (
    <div className="h-full">
      <div className="mb-3 flex justify-end">
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => {
            selectEmergency(null);
          }}
        >
          Clear Selection
        </Button>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}