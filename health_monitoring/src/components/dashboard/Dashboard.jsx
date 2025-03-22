'use client';

import { useEffect, useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useEmergency } from '@/contexts/EmergencyContext';
import VitalsPanel from './VitalsPanel';
import PatientHistoryPanel from './PatientHistoryPanel';
import CurrentEmergencyPanel from './CurrentEmergencyPanel';
import EmergencyHistoryPanel from './EmergencyHistoryPanel';
import DashboardHeader from './DashboardHeader';

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent text-blue-600 dark:text-blue-500 align-[-0.125em]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Loading health dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <DashboardHeader hasActiveEmergency={hasActiveEmergency} />
      
      <main className="container mx-auto px-4 py-4 h-[calc(100vh-64px)] grid gap-4 dashboard-grid">
        {/* Top row */}
        <div className="left-top">
          <VitalsPanel />
        </div>
        <div className="right-top">
          <PatientHistoryPanel />
        </div>
        
        {/* Bottom row */}
        <div className="left-bottom">
          <CurrentEmergencyPanel />
        </div>
        <div className="right-bottom">
          <EmergencyHistoryPanel />
        </div>
      </main>
    </div>
  );
}