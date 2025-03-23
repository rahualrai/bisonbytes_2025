import Emergency from '../models/Emergency.js';
import Patient from '../models/Patient.js';
import TimerManager from '../utils/TimerManager.js';
import { emitTimerStart } from '../websocket/socketServer.js';

class EmergencyService {
  // Start potential emergency workflow
  async startPotentialEmergency(patientId, anomaly, vitalsSnapshot) {
    // Create pending emergency
    const emergency = new Emergency({
      patientId,
      anomalyType: anomaly.type,
      anomalyValue: anomaly.value,
      vitalsSnapshot,
      status: "pending",
      timestamps: { 
        triggeredAt: new Date(),
        timerStartedAt: new Date()
      }
    });
    
    await emergency.save();
    
    // Start 2-minute timer
    const timerDuration = 120000; // 2 minutes
    const timerEndTime = Date.now() + timerDuration;
    
    TimerManager.startTimer(emergency._id, timerDuration, async () => {
      // This callback runs when timer expires
      await this.escalateEmergency(emergency._id);
    });
    
    // Notify frontend to start timer
    emitTimerStart({
      emergencyId: emergency._id,
      patientId,
      endTime: timerEndTime,
      duration: timerDuration
    });
    
    return emergency;
  }
  
  // Escalate emergency (when timer expires or patient responds negatively)
  async escalateEmergency(emergencyId) {
    const emergency = await Emergency.findById(emergencyId);
    
    if (!emergency || emergency.status !== "pending") {
      return null;
    }
    
    emergency.status = "active";
    emergency.timestamps.escalatedAt = new Date();
    await emergency.save();
    
    // Get patient details for emergency alert
    const patient = await Patient.findOne({ _id: emergency.patientId });
    
    return {
      emergency,
      patient
    };
  }
}

export default new EmergencyService();