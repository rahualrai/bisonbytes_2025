import VitalsService from '../services/VitalsService.js';
import EmergencyService from '../services/EmergencyService.js';
import { emitVitalsUpdate } from '../websocket/socketServer.js';
import ThresholdChecker from '../utils/ThresholdChecker.js';

// Receives vital sign data from Garmin
export const receiveVitals = async (req, res) => {
  try {
    const { patientId, vitals } = req.body;
    
    // Process and store vitals
    const processedVitals = await VitalsService.processVitals(patientId, vitals);
    
    // Send real-time update to website via WebSocket
    emitVitalsUpdate({patientId, vitals: processedVitals});
    
    // Check if vitals exceed thresholds
    const anomaly = ThresholdChecker.checkVitals(vitals);
    if (anomaly) {
      // Start emergency workflow
      await EmergencyService.startPotentialEmergency(patientId, anomaly, processedVitals);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error processing vitals:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get latest vitals for a patient
export const getPatientVitals = async (req, res) => {
  try {
    const { patientId } = req.params;
    const vitals = await VitalsService.getLatestVitals(patientId);
    res.status(200).json(vitals);
  } catch (error) {
    console.error('Error fetching vitals:', error);
    res.status(500).json({ error: error.message });
  }
};