import { VITAL_SIGN_TYPES } from '../constants';

// Generate realistic mock data for vitals with trending values
const generateVitalHistory = (hours = 24, interval = 15) => {
  const now = new Date();
  const data = [];
  
  for (let i = hours * 60; i >= 0; i -= interval) {
    const timestamp = new Date(now.getTime() - i * 60 * 1000);
    
    // Basic sine wave pattern with some randomness for realistic data
    const heartRate = Math.round(70 + 10 * Math.sin(i / 120) + Math.random() * 8 - 4);
    const systolic = Math.round(120 + 15 * Math.sin(i / 180) + Math.random() * 8 - 4);
    const diastolic = Math.round(80 + 10 * Math.sin(i / 180) + Math.random() * 6 - 3);
    const spO2 = Math.round(97 + 2 * Math.sin(i / 240) + Math.random() * 1.5 - 0.75);
    const temperature = (36.6 + 0.4 * Math.sin(i / 360) + Math.random() * 0.4 - 0.2).toFixed(1);
    
    // Steps increase throughout the day
    const hourOfDay = timestamp.getHours();
    const baseStepsForHour = hourOfDay < 8 ? 0 : (hourOfDay - 8) * 500;
    const steps = Math.max(0, Math.round(baseStepsForHour + Math.random() * 200 - 100));
    
    data.push({
      timestamp: timestamp.toISOString(),
      [VITAL_SIGN_TYPES.HEART_RATE]: heartRate,
      [VITAL_SIGN_TYPES.BLOOD_PRESSURE]: {
        systolic,
        diastolic
      },
      [VITAL_SIGN_TYPES.SPO2]: spO2,
      [VITAL_SIGN_TYPES.TEMPERATURE]: parseFloat(temperature),
      [VITAL_SIGN_TYPES.STEPS]: steps
    });
  }
  
  return data;
};

// Current vitals (most recent values)
export const currentVitals = {
  [VITAL_SIGN_TYPES.HEART_RATE]: {
    value: 72,
    unit: 'bpm',
    trend: +2.5, // percent change from previous reading
    lastUpdated: new Date().toISOString()
  },
  [VITAL_SIGN_TYPES.BLOOD_PRESSURE]: {
    value: { systolic: 118, diastolic: 78 },
    unit: 'mmHg',
    trend: -1.2,
    lastUpdated: new Date().toISOString()
  },
  [VITAL_SIGN_TYPES.SPO2]: {
    value: 98,
    unit: '%',
    trend: 0,
    lastUpdated: new Date().toISOString()
  },
  [VITAL_SIGN_TYPES.TEMPERATURE]: {
    value: 36.7,
    unit: '°C',
    trend: +0.3,
    lastUpdated: new Date().toISOString()
  },
  [VITAL_SIGN_TYPES.STEPS]: {
    value: 3842,
    unit: 'steps',
    goal: 10000,
    trend: null, // steps don't have a trend
    lastUpdated: new Date().toISOString()
  },
  [VITAL_SIGN_TYPES.SLEEP]: {
    value: { deep: 2.5, light: 4.2, rem: 1.8 },
    unit: 'hours',
    trend: null,
    lastUpdated: new Date(new Date().setHours(8, 30, 0, 0)).toISOString()
  }
};

// Historical vitals data for charts
export const vitalHistory = generateVitalHistory();

// Get the latest vitals
export const getLatestVitals = () => {
  return currentVitals;
};

// Get historical data for a specific vital sign
export const getVitalHistory = (vitalType, hours = 24) => {
  if (!vitalType || !VITAL_SIGN_TYPES[vitalType.toUpperCase()]) {
    return [];
  }
  
  const type = VITAL_SIGN_TYPES[vitalType.toUpperCase()];
  const now = new Date();
  const cutoff = new Date(now.getTime() - hours * 60 * 60 * 1000);
  
  return vitalHistory
    .filter(entry => new Date(entry.timestamp) >= cutoff)
    .map(entry => ({
      timestamp: entry.timestamp,
      value: entry[type]
    }));
};