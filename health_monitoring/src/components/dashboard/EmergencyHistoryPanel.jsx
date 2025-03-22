'use client';

import { useState, useEffect } from 'react';
import { useEmergency } from '@/contexts/EmergencyContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { formatDate, formatTimeAgo } from '@/lib/utils';
import Tabs from '@/components/ui/Tabs';

export default function EmergencyHistoryPanel() {
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
      <Card title="Emergency History" className="h-full">
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col w-full max-w-md">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-12 bg-gray-200 rounded mb-3"></div>
            <div className="h-12 bg-gray-200 rounded mb-3"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  const EmergencyList = () => (
    <div className="space-y-2 overflow-y-auto max-h-[400px]">
      {filteredHistory.length === 0 ? (
        <div className="text-center p-4 text-gray-500 dark:text-gray-400">
          No emergencies found for the selected filters.
        </div>
      ) : (
        filteredHistory.map(emergency => (
          <div 
            key={emergency.id} 
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedEmergency && selectedEmergency.id === emergency.id 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900 dark:border-blue-700' 
                : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
            }`}
            onClick={() => handleSelectEmergency(emergency)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">
                  {emergency.type.replace(/([A-Z])/g, ' $1').trim()} Emergency
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(emergency.createdAt, { includeTime: true })}
                </p>
              </div>
              <StatusBadge status={emergency.status?.toLowerCase() || 'unknown'} />
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
        <div className="h-full flex items-center justify-center flex-col text-gray-500 dark:text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>Select an emergency to view details</p>
        </div>
      );
    }

    return (
      <div className="overflow-y-auto max-h-[400px]">
        <div className="mb-4">
          <h3 className="font-medium text-lg mb-1">
            {selectedEmergency.type.replace(/([A-Z])/g, ' $1').trim()} Emergency
          </h3>
          <div className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>{formatDate(selectedEmergency.createdAt, { includeTime: true })}</span>
            <span>•</span>
            <span>ID: {selectedEmergency.id}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
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
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
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
        
        {selectedEmergency.timeline && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Timeline</h4>
            <div className="space-y-3">
              {selectedEmergency.timeline.map((event, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 w-12 text-xs text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex-grow pb-4 pl-4 border-l border-gray-300 dark:border-gray-700">
                    <div className="font-medium">{event.event}</div>
                    {event.details && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {event.details}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedEmergency.resolution && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded mb-4">
            <h4 className="text-sm font-medium mb-1">Resolution</h4>
            <div className="text-sm">
              <p>{selectedEmergency.resolution.notes}</p>
              <p className="text-xs text-gray-500 mt-2">
                Resolved at {formatDate(selectedEmergency.resolution.timestamp, { includeTime: true })}
              </p>
            </div>
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
    <Card 
      title="Emergency History" 
      className="h-full"
      action={
        <Button 
          size="sm" 
          variant="secondary" 
          onClick={() => {
            selectEmergency(null);
          }}
        >
          Clear Selection
        </Button>
      }
    >
      <Tabs tabs={tabs} />
    </Card>
  );
}