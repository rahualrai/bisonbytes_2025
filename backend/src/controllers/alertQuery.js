import TestEmergency from "../models/testEmergencyModel.js";

// get all alerts
export const getAlerts = async (req, res) => {
    try {
        const alerts = await TestEmergency.find().sort({ createdAt: -1 });
        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};