import Patient from '../models/Patient.js';
import twilio from '../config/twilio.config.js';

class NotificationService {
  // Call emergency contacts
  async callEmergencyContacts(emergency) {
    try {
      const patient = await Patient.findById(emergency.patientId);
      
      if (!patient || !patient.emergencyContacts || patient.emergencyContacts.length === 0) {
        console.error('No emergency contacts found for patient');
        return;
      }
      
      // Call each emergency contact
      const callPromises = patient.emergencyContacts.map(contact => 
        this.makeEmergencyCall(contact.phone, patient, emergency)
      );
      
      return Promise.all(callPromises);
    } catch (error) {
      console.error('Error calling emergency contacts:', error);
      throw error;
    }
  }
  
  // Make emergency call using Twilio
  async makeEmergencyCall(phoneNumber, patient, emergency) {
    try {
      // Generate emergency script based on patient info and emergency details
      const twimlScript = this.generateCallScript(patient, emergency);
      
      // Make the call
      const call = await twilio.client.calls.create({
        twiml: twimlScript,
        to: phoneNumber,
        from: twilio.phoneNumber
      });
      
      return call.sid;
    } catch (error) {
      console.error('Error making Twilio call:', error);
      throw error;
    }
  }
  
  // Generate call script for Twilio
  generateCallScript(patient, emergency) {
    const script = `
      <Response>
        <Say voice="Google.en-US-Wavenet-F">
          This is an emergency alert from the health monitoring system. Please listen carefully.
          Patient name: ${patient.firstName} ${patient.lastName}.
          Location: ${patient.address || "Unknown location"}.
          The system has detected ${this.getEmergencyDescription(emergency)}.
        </Say>
        <Gather numDigits="1" action="${process.env.BASE_URL}/api/twilio/process-gather" method="POST" timeout="10">
          <Say voice="Google.en-US-Wavenet-F">
            If you would like to be immediately connected to emergency medical services, please press 1.
          </Say>
        </Gather>
        <Say voice="Google.en-US-Wavenet-F">
          No input received. The call will now end. Please check on the patient as soon as possible.
        </Say>
      </Response>
    `;
    
    return script;
  }
  
  // Get human-readable emergency description
  getEmergencyDescription(emergency) {
    const { anomalyType, anomalyValue } = emergency;
    
    switch (anomalyType) {
      case 'heartRate':
        return `an abnormal heart rate of ${anomalyValue} beats per minute`;
      case 'bloodPressure':
        return `abnormal blood pressure with values of ${anomalyValue.systolic}/${anomalyValue.diastolic}`;
      case 'spO2':
        return `low blood oxygen level of ${anomalyValue}%`;
      case 'fall':
        return `a potential fall`;
      default:
        return `a medical emergency`;
    }
  }
}

export default new NotificationService();