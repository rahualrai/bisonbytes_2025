import VitalSign from '../models/VitalSign.js';

class VitalsService {
  // Process incoming vitals data
  async processVitals(patientId, vitalsData) {
    // Create new vital sign records
    const vitalSigns = await VitalSign.create({
      patientId,
      readings: vitalsData,
      timestamp: new Date()
    });
    
    return vitalSigns;
  }
  
  // Get latest vitals for a patient
  async getLatestVitals(patientId) {
    const latestVitals = await VitalSign.findOne({ patientId })
      .sort({ timestamp: -1 });
    
    return latestVitals;
  }
  
  // Get vitals history for a patient
  async getVitalsHistory(patientId, limit = 100) {
    const history = await VitalSign.find({ patientId })
      .sort({ timestamp: -1 })
      .limit(limit);
    
    return history;
  }
}

export default new VitalsService();