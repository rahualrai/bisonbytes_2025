'use client';

import { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import Card from '@/components/ui/Card';
import VitalSign from '@/components/ui/VitalSign';
import Button from '@/components/ui/Button';
import { formatTimeAgo } from '@/lib/utils';
import Tabs from '@/components/ui/Tabs';

// Icons for vitals (you can replace these with your own SVG icons)
const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const BloodPressureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

const OxygenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TemperatureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const StepsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function VitalsPanel() {
  const { vitals, vitalsLoading, vitalsError, refreshVitals, fetchVitalHistory, activePanels, switchPanel } = useDashboard();
  const [activeVital, setActiveVital] = useState('heartRate');
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(24); // hours

  useEffect(() => {
    if (activePanels.vitals) {
      setActiveVital(activePanels.vitals);
    }
  }, [activePanels.vitals]);

  useEffect(() => {
    if (activeVital) {
      fetchVitalHistory(activeVital, timeRange);
      switchPanel('vitals', activeVital);
    }
  }, [activeVital, timeRange, fetchVitalHistory, switchPanel]);

  const handleVitalChange = (vital) => {
    setActiveVital(vital);
  };

  const handleTimeRangeChange = (hours) => {
    setTimeRange(hours);
  };

  if (vitalsLoading) {
    return (
      <Card title="Vital Signs" className="h-full">
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 w-32 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (vitalsError || !vitals) {
    return (
      <Card title="Vital Signs" className="h-full">
        <div className="h-full flex items-center justify-center flex-col">
          <p className="text-red-500 mb-4">Error loading vital signs data</p>
          <Button onClick={refreshVitals}>Retry</Button>
        </div>
      </Card>
    );
  }

  // Create tabs for different vital sign categories
  const vitalsTabs = [
    {
      label: "Current",
      content: (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <VitalSign
            title="Heart Rate"
            value={vitals.heartRate.value}
            unit="bpm"
            status={vitals.heartRate.status}
            icon={<HeartIcon />}
            change={vitals.heartRate.trend}
            time={formatTimeAgo(vitals.heartRate.lastUpdated)}
            onClick={() => handleVitalChange('heartRate')}
            active={activeVital === 'heartRate'}
          />
          <VitalSign
            title="Blood Pressure"
            value={`${vitals.bloodPressure.value.systolic}/${vitals.bloodPressure.value.diastolic}`}
            unit="mmHg"
            status={vitals.bloodPressure.status}
            icon={<BloodPressureIcon />}
            change={vitals.bloodPressure.trend}
            time={formatTimeAgo(vitals.bloodPressure.lastUpdated)}
            onClick={() => handleVitalChange('bloodPressure')}
            active={activeVital === 'bloodPressure'}
          />
          <VitalSign
            title="Oxygen Saturation"
            value={vitals.spO2.value}
            unit="%"
            status={vitals.spO2.status}
            icon={<OxygenIcon />}
            change={vitals.spO2.trend}
            time={formatTimeAgo(vitals.spO2.lastUpdated)}
            onClick={() => handleVitalChange('spO2')}
            active={activeVital === 'spO2'}
          />
          <VitalSign
            title="Temperature"
            value={vitals.temperature.value}
            unit="°C"
            status={vitals.temperature.status}
            icon={<TemperatureIcon />}
            change={vitals.temperature.trend}
            time={formatTimeAgo(vitals.temperature.lastUpdated)}
            onClick={() => handleVitalChange('temperature')}
            active={activeVital === 'temperature'}
          />
          <VitalSign
            title="Steps"
            value={vitals.steps.value}
            status="normal"
            icon={<StepsIcon />}
            time={formatTimeAgo(vitals.steps.lastUpdated)}
            onClick={() => handleVitalChange('steps')}
            active={activeVital === 'steps'}
          />
        </div>
      )
    },
    {
      label: "Trends",
      content: (
        <div className="h-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {activeVital === 'heartRate' && 'Heart Rate History'}
              {activeVital === 'bloodPressure' && 'Blood Pressure History'}
              {activeVital === 'spO2' && 'Oxygen Saturation History'}
              {activeVital === 'temperature' && 'Temperature History'}
              {activeVital === 'steps' && 'Step Count History'}
            </h3>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant={timeRange === 8 ? "primary" : "secondary"}
                onClick={() => handleTimeRangeChange(8)}
              >
                8h
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 24 ? "primary" : "secondary"}
                onClick={() => handleTimeRangeChange(24)}
              >
                24h
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 72 ? "primary" : "secondary"}
                onClick={() => handleTimeRangeChange(72)}
              >
                3d
              </Button>
            </div>
          </div>
          
          {/* Placeholder for chart visualization - in a real app, you'd use Chart.js, recharts, etc. */}
          <div className="h-40 w-full bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
            {/* This would be replaced by an actual chart component */}
            <p className="text-gray-500">
              {activeVital.charAt(0).toUpperCase() + activeVital.slice(1)} data over the past {timeRange} hours
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <Card 
      title="Vital Signs" 
      className="h-full"
      action={
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Updated {formatTimeAgo(vitals.lastUpdated)}
        </div>
      }
    >
      <Tabs tabs={vitalsTabs} />
    </Card>
  );
}