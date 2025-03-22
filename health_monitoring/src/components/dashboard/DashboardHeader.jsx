'use client';

import { useDashboard } from '@/contexts/DashboardContext';
import { useState, useEffect } from 'react';

export default function DashboardHeader({ hasActiveEmergency }) {
  const { patient, webSocketConnected } = useDashboard();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };
  
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Health Monitoring Dashboard</h1>
          {hasActiveEmergency && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300 animate-pulse">
              Active Emergency
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${webSocketConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{webSocketConnected ? 'Connected' : 'Offline'}</span>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-medium">{formatDate(currentTime)}</div>
            <div className="text-xl">{formatTime(currentTime)}</div>
          </div>
          
          {patient && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {patient.personalInfo.firstName.charAt(0)}{patient.personalInfo.lastName.charAt(0)}
              </div>
              <div>
                <div className="font-medium">{patient.personalInfo.firstName} {patient.personalInfo.lastName}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">ID: {patient.id}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}