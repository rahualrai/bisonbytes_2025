import { emergencyHistory } from './emergencies';
import { EMERGENCY_TYPES, EMERGENCY_STATUSES, PATIENT_RESPONSE_TYPES, CALL_STATUSES } from '../constants';

// Generate more comprehensive emergency history with call records and transcripts
export const detailedEmergencyHistory = emergencyHistory.map(emergency => {
  // Generate call transcript for completed calls
  const generateTranscript = (contact, emergency) => {
    if (contact.status !== CALL_STATUSES.COMPLETED) return null;
    
    const transcriptTemplates = {
      [EMERGENCY_TYPES.FALL]: [
        "System: Hello, this is the Health Guardian automated system calling for {contactName}. This is an emergency alert for {patientName}.",
        "System: Our monitoring system has detected a fall at {timestamp}. {patientName} has not confirmed they are okay.",
        `${contact.name}: Hello? Yes, this is ${contact.name}.`,
        "System: Would you like me to call emergency services, or will you check on the patient?",
        `${contact.name}: I'll check on them right away.`,
        "System: Thank you. I'll mark this as being handled by you. Please call emergency services if needed.",
        `${contact.name}: I will. Thank you for notifying me.`,
      ],
      [EMERGENCY_TYPES.HEART_RATE]: [
        "System: Hello, this is the Health Guardian automated system calling for {contactName}. This is an emergency alert for {patientName}.",
        "System: Our monitoring system has detected an abnormal heart rate of {value} bpm at {timestamp}, which exceeds the safe threshold of {threshold} bpm.",
        `${contact.name}: This is ${contact.name}. Is she okay?`,
        "System: {patientName} has not responded to our alert on their watch. Would you like me to call emergency services?",
        `${contact.name}: No, I'll check on her first. I'm nearby.`,
        "System: Thank you. I'll mark this as being handled by you. Please call emergency services if needed.",
        `${contact.name}: I will. Thank you.`,
      ],
      [EMERGENCY_TYPES.BLOOD_PRESSURE]: [
        "System: Hello, this is the Health Guardian automated system calling for {contactName}. This is an emergency alert for {patientName}.",
        "System: Our monitoring system has detected high blood pressure of {value.systolic}/{value.diastolic} mmHg at {timestamp}.",
        `${contact.name}: I understand. Has she taken her medication today?`,
        "System: That information is not available. Would you like me to call emergency services?",
        `${contact.name}: No, I'll call her first to check.`,
        "System: Thank you. I'll mark this as being handled by you.",
      ],
      [EMERGENCY_TYPES.SPO2]: [
        "System: Hello, this is the Health Guardian automated system calling for {contactName}. This is an emergency alert for {patientName}.",
        "System: Our monitoring system has detected low oxygen levels of {value}% at {timestamp}, which is below the safe threshold of {threshold}%.",
        `${contact.name}: I understand. I'll go check on her right now.`,
        "System: Thank you. I'll mark this as being handled by you. Please call emergency services if needed.",
        `${contact.name}: Will do.`,
      ],
    };
    
    // Select appropriate transcript template and replace variables
    let transcript = transcriptTemplates[emergency.type] || transcriptTemplates[EMERGENCY_TYPES.FALL];
    
    // Replace placeholders with actual values
    transcript = transcript.map(line => {
      return line
        .replace('{contactName}', contact.name)
        .replace('{patientName}', 'Jane Doe')
        .replace('{timestamp}', new Date(emergency.createdAt).toLocaleTimeString())
        .replace('{value}', emergency.detectedValue.value?.toString() || '')
        .replace('{threshold}', emergency.detectedValue.threshold?.toString() || '')
        .replace('{value.systolic}', emergency.detectedValue.value?.systolic || '')
        .replace('{value.diastolic}', emergency.detectedValue.value?.diastolic || '');
    });
    
    return transcript;
  };
  
  // Add detailed call logs with transcripts
  const detailedContactsNotified = emergency.contactsNotified.map(contact => {
    return {
      ...contact,
      transcript: generateTranscript(contact, emergency),
      callRecordingUrl: contact.status === CALL_STATUSES.COMPLETED ? `/api/calls/${emergency.id}/${contact.contactId}` : null,
    };
  });
  
  // Add timeline events
  const timeline = [
    {
      type: 'emergency_detected',
      timestamp: emergency.createdAt,
      description: `${emergency.type === EMERGENCY_TYPES.FALL ? 'Fall' : 'Abnormal vital signs'} detected`,
      detail: emergency.detectedValue,
    },
    {
      type: 'patient_prompted',
      timestamp: emergency.createdAt,
      description: 'Patient prompted on watch',
      detail: { message: 'Are you okay? Please respond within 30 seconds' },
    },
  ];
  
  // Add patient response to timeline if applicable
  if (emergency.patientResponse.timestamp) {
    timeline.push({
      type: 'patient_response',
      timestamp: emergency.patientResponse.timestamp,
      description: `Patient responded: ${emergency.patientResponse.status === PATIENT_RESPONSE_TYPES.OK ? 'I\'m okay' : 'I need help'}`,
      detail: { response: emergency.patientResponse.status },
    });
  } else if (emergency.countdown.completed) {
    timeline.push({
      type: 'patient_no_response',
      timestamp: new Date(new Date(emergency.countdown.started).getTime() + emergency.countdown.duration * 1000).toISOString(),
      description: 'Patient did not respond within time limit',
      detail: { countdown: emergency.countdown },
    });
  }
  
  // Add contact notifications to timeline
  emergency.contactsNotified.forEach(contact => {
    timeline.push({
      type: 'contact_called',
      timestamp: contact.timestamp,
      description: `Emergency contact called: ${contact.name}`,
      detail: { contact, status: contact.status },
    });
    
    if (contact.status === CALL_STATUSES.COMPLETED) {
      timeline.push({
        type: 'contact_responded',
        timestamp: new Date(new Date(contact.timestamp).getTime() + parseFloat(contact.duration.split(':')[0]) * 60 * 1000 + parseFloat(contact.duration.split(':')[1]) * 1000).toISOString(),
        description: `Call with ${contact.name} completed`,
        detail: { duration: contact.duration, response: contact.response },
      });
    }
  });
  
  // Add resolution to timeline if applicable
  if (emergency.resolution) {
    timeline.push({
      type: 'emergency_resolved',
      timestamp: emergency.resolution.timestamp,
      description: `Emergency ${emergency.status?.toLowerCase() || 'unknown'}: ${emergency.resolution?.outcome || 'completed'}`,
      detail: { notes: emergency.resolution?.notes || '' },
    });
  }
  
  // Sort timeline by timestamp
  timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return {
    ...emergency,
    contactsNotified: detailedContactsNotified,
    timeline,
  };
});

export const getDetailedEmergencyHistory = () => {
  return detailedEmergencyHistory;
};

export const getEmergencyById = (id) => {
  return detailedEmergencyHistory.find(emergency => emergency.id === id);
};

// Statistics for emergency history
export const getEmergencyStats = () => {
  const total = detailedEmergencyHistory.length;
  const byType = {};
  const byResponseType = {};
  const byOutcome = {};
  const byMonth = {};
  
  // Initialize counters
  Object.values(EMERGENCY_TYPES).forEach(type => {
    byType[type] = 0;
  });
  
  Object.values(PATIENT_RESPONSE_TYPES).forEach(type => {
    byResponseType[type] = 0;
  });
  
  // Count emergencies by different categories
  detailedEmergencyHistory.forEach(emergency => {
    // Count by type
    byType[emergency.type]++;
    
    // Count by patient response
    byResponseType[emergency.patientResponse.status]++;
    
    // Count by outcome/status
    const outcome = emergency.status;
    byOutcome[outcome] = (byOutcome[outcome] || 0) + 1;
    
    // Count by month
    const date = new Date(emergency.createdAt);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    byMonth[monthYear] = (byMonth[monthYear] || 0) + 1;
  });
  
  return {
    total,
    byType,
    byResponseType,
    byOutcome,
    byMonth,
  };
};