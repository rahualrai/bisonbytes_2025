'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useEmergency } from '@/contexts/EmergencyContext';
import LoadingScreen from './LoadingScreen';
import VitalsPanel from './VitalsPanel';
import PatientHistoryPanel from './PatientHistoryPanel';
import CombinedEmergencyPanel from './CombinedEmergencyPanel';
import DashboardHeader from './DashboardHeader';
import './styles/Dashboard.css';

export default function Dashboard() {
  const { vitalsLoading, patientLoading } = useDashboard();
  const { loadingEmergency, hasActiveEmergency } = useEmergency();
  const [isLoading, setIsLoading] = useState(true);

  // Set loading state based on all data fetching states
  useEffect(() => {
    if (!vitalsLoading && !patientLoading && !loadingEmergency) {
      // Add slight delay to ensure smooth transitions
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [vitalsLoading, patientLoading, loadingEmergency]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen" style={{ 
        background: 'var(--background)',
        color: 'var(--foreground)'
      }}>
      <DashboardHeader hasActiveEmergency={hasActiveEmergency} />
      
      <main className="dashboard-container">
        <div className="vitals-column">
          <VitalsPanel />
        </div>
        
        <div className="info-column">
          <div className="emergency-container">
            <CombinedEmergencyPanel />
          </div>

          <div className="patient-history-container">
            <PatientHistoryPanel />
          </div>
        </div>
      </main>
    </div>
  );
}