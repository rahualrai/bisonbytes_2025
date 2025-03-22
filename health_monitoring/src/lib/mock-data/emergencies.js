import { EMERGENCY_STATUSES, EMERGENCY_TYPES, PATIENT_RESPONSE_TYPES, CALL_STATUSES } from '../constants';

// Current emergency (if any)
export const currentEmergency = {
  id: "EM-98765",
  status: EMERGENCY_STATUSES.ACTIVE,
  type: EMERGENCY_TYPES.HEART_RATE,
  createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
  detectedValue: {
    type: "heartRate",
    value: 130,
    threshold: 120,
  },
  patientResponse: {
    status: PATIENT_RESPONSE_TYPES.NO_RESPONSE,
    timestamp: null,
  },
  contactsNotified: [
    {
      contactId: 1,
      name: "John Doe",
      phone: "+1 (555) 234-5678",
      status: CALL_STATUSES.COMPLETED,
      timestamp: new Date(Date.now() - 1000 * 60).toISOString(), // 1 minute ago
      duration: "1:45",
      response: "Will check on patient",
    },
    {
      contactId: 2,
      name: "Sarah Johnson",
      phone: "+1 (555) 345-6789",
      status: CALL_STATUSES.IN_PROGRESS,
      timestamp: new Date().toISOString(),
      duration: null,
      response: null,
    },
  ],
  notes: "Patient's heart rate exceeded critical threshold. First emergency contact has been notified and is responding.",
  countdown: {
    started: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 minutes ago
    duration: 30, // seconds
    completed: true,
  },
};

// Historical emergencies
export const emergencyHistory = [
  {
    id: "EM-98764",
    status: EMERGENCY_STATUSES.RESOLVED,
    type: EMERGENCY_TYPES.FALL,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    detectedValue: {
      type: "fall",
      value: true,
    },
    patientResponse: {
      status: PATIENT_RESPONSE_TYPES.NOT_OK,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 20).toISOString(),
    },
    contactsNotified: [
      {
        contactId: 1,
        name: "John Doe",
        phone: "+1 (555) 234-5678",
        status: CALL_STATUSES.COMPLETED,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60).toISOString(),
        duration: "2:13",
        response: "Called emergency services",
      },
    ],
    resolution: {
      outcome: "Medical attention provided",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60).toISOString(),
      notes: "Patient transported to hospital. Minor injury treated.",
    },
    notes: "Fall detected. Patient taken to Springfield Medical Center and treated for minor bruising.",
    countdown: {
      started: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      duration: 30,
      completed: true,
    },
  },
  {
    id: "EM-98763",
    status: EMERGENCY_STATUSES.CANCELLED,
    type: EMERGENCY_TYPES.BLOOD_PRESSURE,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    detectedValue: {
      type: "bloodPressure",
      value: { systolic: 180, diastolic: 100 },
      threshold: { systolic: 170, diastolic: 95 },
    },
    patientResponse: {
      status: PATIENT_RESPONSE_TYPES.OK,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 15).toISOString(),
    },
    contactsNotified: [],
    resolution: {
      outcome: "False alarm",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5 + 1000 * 15).toISOString(),
      notes: "Patient confirmed they were okay. Blood pressure returned to normal range within 30 minutes.",
    },
    notes: "Patient responded they were okay. No emergency contacts were notified.",
    countdown: {
      started: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      duration: 30,
      completed: false,
    },
  },
  // Additional historical emergencies...
  {
    id: "EM-98762",
    status: EMERGENCY_STATUSES.RESOLVED,
    type: EMERGENCY_TYPES.SPO2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    detectedValue: {
      type: "spO2",
      value: 88,
      threshold: 90,
    },
    patientResponse: {
      status: PATIENT_RESPONSE_TYPES.NO_RESPONSE,
      timestamp: null,
    },
    contactsNotified: [
      {
        contactId: 1,
        name: "John Doe",
        phone: "+1 (555) 234-5678",
        status: CALL_STATUSES.COMPLETED,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10 + 1000 * 60).toISOString(),
        duration: "3:05",
        response: "Went to check on patient",
      },
    ],
    resolution: {
      outcome: "Medical attention provided",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10 + 1000 * 60 * 90).toISOString(),
      notes: "Son found patient sleeping with watch in odd position. False reading.",
    },
    notes: "SpO2 levels dropped below threshold. Emergency contact found it was a false reading due to watch position.",
    countdown: {
      started: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      duration: 30,
      completed: true,
    },
  },
];

export const hasActiveEmergency = () => {
  return !!currentEmergency && currentEmergency.status === EMERGENCY_STATUSES.ACTIVE;
};

export const getCurrentEmergency = () => {
  return hasActiveEmergency() ? currentEmergency : null;
};

export const getEmergencyHistory = () => {
  return emergencyHistory;
};