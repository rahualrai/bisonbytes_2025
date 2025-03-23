'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { formatTimeAgo, getVitalTrend } from '@/lib/utils';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Area, ComposedChart, ReferenceLine 
} from 'recharts';
import { HeartPulse, Thermometer, Activity, BarChart, Clock, Droplets } from 'lucide-react';
import './styles/VitalsPanel.css';

// Vital reference ranges
const REFERENCE_RANGES = {
  heartRate: { min: 60, max: 100, unit: 'bpm', label: 'Heart Rate', color: '#FF5F5F' },
  temperature: { min: 36.1, max: 37.2, unit: '°C', label: 'Temperature', color: '#FF9F40' },
  bloodPressure: { 
    systolic: { min: 90, max: 120, unit: 'mmHg', color: '#8884d8' },
    diastolic: { min: 60, max: 80, unit: 'mmHg', color: '#82ca9d' },
    label: 'Blood Pressure'
  },
  spO2: { min: 95, max: 100, unit: '%', label: 'SpO2', color: '#4C7FFF' },
  steps: { min: 0, max: 10000, unit: 'steps', label: 'Steps', color: '#50C878' }
};

// Array of vital types for easy iteration
const VITAL_TYPES = ['heartRate', 'bloodPressure', 'temperature', 'spO2', 'steps'];

export default function VitalsPanel() {
  const { vitals, vitalsLoading, vitalsError, refreshVitals, fetchVitalHistory } = useDashboard();
  const [activeVital, setActiveVital] = useState('heartRate');
  const [allVitalsHistory, setAllVitalsHistory] = useState({
    heartRate: [],
    bloodPressure: [],
    temperature: [],
    spO2: [],
    steps: []
  });
  const [timeRange, setTimeRange] = useState(24); // hours
  const [expandedVital, setExpandedVital] = useState(null);

  // Define colors based on status
  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'var(--color-danger)';
      case 'warning': return 'var(--color-warning)';
      default: return 'var(--color-success)';
    }
  };

  // Get appropriate icon for vital
  const getVitalIcon = (vitalType, status) => {
    const color = getStatusColor(status);
    const className = `vital-icon ${status}`;
    
    switch(vitalType) {
      case 'heartRate':
        return <HeartPulse className={className} style={{color}} />;
      case 'temperature':
        return <Thermometer className={className} style={{color}} />;
      case 'bloodPressure':
        return <Activity className={className} style={{color}} />;
      case 'spO2':
        return <Droplets className={className} style={{color}} />;
      case 'steps':
        return <BarChart className={className} style={{color}} />;
      default:
        return <Activity className={className} style={{color}} />;
    }
  };

  // Fetch history data for all vitals when time range changes
  useEffect(() => {
    const fetchAllHistory = async () => {
      try {
        const historyPromises = VITAL_TYPES.map(vitalType => 
          fetchVitalHistory(vitalType, timeRange)
        );
        
        const results = await Promise.all(historyPromises);
        
        const newHistoryData = VITAL_TYPES.reduce((acc, vitalType, index) => {
          acc[vitalType] = results[index] || [];
          return acc;
        }, {});
        
        setAllVitalsHistory(newHistoryData);
      } catch (error) {
        console.error('Failed to fetch vital history', error);
      }
    };

    fetchAllHistory();
  }, [timeRange, fetchVitalHistory]);

  // Handle expanded view
  const toggleExpandVital = (vitalType) => {
    if (expandedVital === vitalType) {
      setExpandedVital(null);
    } else {
      setExpandedVital(vitalType);
      setActiveVital(vitalType);
    }
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label, vitalType }) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="custom-tooltip">
        <p className="tooltip-time">{new Date(label).toLocaleString()}</p>
        {payload.map((item, index) => (
          <p key={index} style={{ color: item.stroke }}>
            {item.name}: {item.value} {vitalType === 'bloodPressure' ? 'mmHg' : REFERENCE_RANGES[vitalType]?.unit}
          </p>
        ))}
      </div>
    );
  };

  // Generate reference lines for chart
  const getReferenceLines = (vitalType) => {
    if (vitalType === 'bloodPressure') {
      return (
        <>
          <ReferenceLine y={REFERENCE_RANGES.bloodPressure.systolic.min} stroke="#8884d8" strokeDasharray="3 3" />
          <ReferenceLine y={REFERENCE_RANGES.bloodPressure.systolic.max} stroke="#8884d8" strokeDasharray="3 3" />
          <ReferenceLine y={REFERENCE_RANGES.bloodPressure.diastolic.min} stroke="#82ca9d" strokeDasharray="3 3" />
          <ReferenceLine y={REFERENCE_RANGES.bloodPressure.diastolic.max} stroke="#82ca9d" strokeDasharray="3 3" />
        </>
      );
    }
    
    const range = REFERENCE_RANGES[vitalType];
    if (!range) return null;
    
    return (
      <>
        <ReferenceLine y={range.min} stroke={range.color} strokeDasharray="3 3" />
        <ReferenceLine y={range.max} stroke={range.color} strokeDasharray="3 3" />
      </>
    );
  };

  // Render chart for a specific vital
  const renderVitalChart = (vitalType, index) => {
    const isExpanded = expandedVital === vitalType;
    const chartClassName = `vital-chart ${isExpanded ? 'expanded' : ''} ${
      expandedVital && expandedVital !== vitalType ? 'collapsed' : ''
    }`;
  
    return (
      <div 
        key={vitalType} 
        className={chartClassName}
        onClick={() => toggleExpandVital(vitalType)}
      >
        <div className="chart-header">
          <h3 className="chart-title">{REFERENCE_RANGES[vitalType]?.label || vitalType}</h3>
        </div>
        {/* Set explicit height for ResponsiveContainer */}
        <div style={{ width: '100%', height: isExpanded ? '400px' : '200px' }}>
          <ResponsiveContainer>
            <ComposedChart data={allVitalsHistory[vitalType]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(time) => new Date(time).toLocaleTimeString()} 
                tick={{fontSize: 12}}
              />
              <YAxis tick={{fontSize: 12}} />
              <Tooltip content={(props) => <CustomTooltip {...props} vitalType={vitalType} />} />
              
              <Area 
                type="monotone" 
                name={REFERENCE_RANGES[vitalType]?.label || vitalType} 
                dataKey="value" 
                stroke={REFERENCE_RANGES[vitalType]?.color || 'var(--color-primary)'} 
                fill={REFERENCE_RANGES[vitalType]?.color || 'var(--color-primary)'} 
                fillOpacity={0.3}
              />
              
              {getReferenceLines(vitalType)}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  if (vitalsLoading) {
    return (
      <Card title="Vital Signs" className="h-full">
        <div className="vitals-loading">
          <div className="pulse-loader"></div>
          <p>Loading vital signs...</p>
        </div>
      </Card>
    );
  }

  if (vitalsError || !vitals) {
    return (
      <Card title="Vital Signs" className="h-full">
        <div className="vitals-error">
          <p className="text-red-500 mb-4">Error loading vital signs data</p>
          <Button onClick={refreshVitals}>Retry</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Vital Signs" className="h-full">
      <div className="vitals-panel">
        <div className="vitals-content">
          {/* Vital sign cards */}
          <div className="vitals-cards">
            {VITAL_TYPES.map((vitalType) => {
              const isActive = activeVital === vitalType;
              let status = 'normal';
              let trend = null;
              let animation = null;
              
              if (vitalType === 'heartRate') {
                // Access the value property from the vital object
                status = (vitals.heartRate.value < REFERENCE_RANGES.heartRate.min) ? 'critical' : 
                         (vitals.heartRate.value > REFERENCE_RANGES.heartRate.max) ? 'critical' : 'normal';
                trend = getVitalTrend('heartRate', vitals.heartRate.value);
                animation = status === 'normal' ? `beat ${60 / vitals.heartRate.value}s infinite` : null;
              } else if (vitalType === 'temperature') {
                // Access the value property from the vital object
                status = (vitals.temperature.value < REFERENCE_RANGES.temperature.min) ? 'warning' : 
                         (vitals.temperature.value > REFERENCE_RANGES.temperature.max) ? 'critical' : 'normal';
                trend = getVitalTrend('temperature', vitals.temperature.value);
              } else if (vitalType === 'bloodPressure') {
                // BloodPressure stays the same as it was already using the correct object structure
                const systolicStatus = (vitals.bloodPressure.systolic < REFERENCE_RANGES.bloodPressure.systolic.min) ? 'warning' : 
                                      (vitals.bloodPressure.systolic > REFERENCE_RANGES.bloodPressure.systolic.max) ? 'critical' : 'normal';
                const diastolicStatus = (vitals.bloodPressure.diastolic < REFERENCE_RANGES.bloodPressure.diastolic.min) ? 'warning' : 
                                       (vitals.bloodPressure.diastolic > REFERENCE_RANGES.bloodPressure.diastolic.max) ? 'critical' : 'normal';
                status = (systolicStatus === 'critical' || diastolicStatus === 'critical') ? 'critical' : 
                         (systolicStatus === 'warning' || diastolicStatus === 'warning') ? 'warning' : 'normal';
                trend = getVitalTrend('bloodPressure', vitals.bloodPressure);
              } else if (vitalType === 'spO2') {
                // Access the value property from the vital object
                status = (vitals.spO2.value < REFERENCE_RANGES.spO2.min) ? 'critical' : 'normal';
                trend = getVitalTrend('spO2', vitals.spO2.value);
              } else if (vitalType === 'steps') {
                // Access the value property from the vital object
                status = 'normal'; // Steps don't have critical values
                trend = getVitalTrend('steps', vitals.steps.value);
              }
              
              return (
                <div 
                  key={vitalType}
                  className={`vital-card ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveVital(vitalType);
                    if (expandedVital !== vitalType) {
                      setExpandedVital(null);
                    }
                  }}
                >
                  <div className="vital-header">
                    <div className="vital-icon-container" style={animation ? {animation} : {}}>
                      {getVitalIcon(vitalType, status)}
                    </div>
                    <span className="vital-title">{REFERENCE_RANGES[vitalType]?.label || vitalType}</span>
                  </div>
                  
                  {vitalType === 'bloodPressure' ? (
                    <div className="vital-value">
                      <span className="value-number">{vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}</span>
                      <span className="value-unit">mmHg</span>
                      {trend && (
                        <span className={`trend-indicator ${trend.direction}`}>
                          {trend.icon} {trend.value}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="vital-value">
                      {/* Extract just the value from the vital object */}
                      <span className="value-number">{vitals[vitalType].value}</span>
                      <span className="value-unit">{REFERENCE_RANGES[vitalType]?.unit}</span>
                      {trend && (
                        <span className={`trend-indicator ${trend.direction}`}>
                          {trend.icon} {trend.value}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Time range selector */}
          <div className="time-selector-container">
            <span className="time-label">Time Range:</span>
            <div className="time-selector">
              <Button 
                size="sm" 
                variant={timeRange === 1 ? "filled" : "outline"}
                onClick={() => setTimeRange(1)}
              >
                1h
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 6 ? "filled" : "outline"}
                onClick={() => setTimeRange(6)}
              >
                6h
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 24 ? "filled" : "outline"}
                onClick={() => setTimeRange(24)}
              >
                24h
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 72 ? "filled" : "outline"}
                onClick={() => setTimeRange(72)}
              >
                3d
              </Button>
              <Button 
                size="sm" 
                variant={timeRange === 168 ? "filled" : "outline"}
                onClick={() => setTimeRange(168)}
              >
                7d
              </Button>
            </div>
          </div>
          
          {/* Multi-vital charts */}
          <div className="charts-container">
            {VITAL_TYPES.map((vitalType, index) => 
              renderVitalChart(vitalType, index)
            )}
          </div>
          
          {/* Last updated indicator */}
          <div className="last-updated">
            <Clock size={12} />
            <span>Last updated {formatTimeAgo(Date.now())}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}