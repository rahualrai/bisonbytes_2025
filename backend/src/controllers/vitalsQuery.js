import VitalsTesting from "../models/vitalsTestModel.js"; // Import the VitalsTesting model

// get all vitals from the viraltesting
export const getVitals = async (req, res) => {
    try {
        const vitals = await VitalsTesting.find().sort({ timestamp: -1 });
        res.status(200).json(vitals);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export const getLatestVitals = async (req, res) => {

    try {
        const latestVitals = await VitalsTesting.findOne().sort({ timestamp: -1 });
        res.status(200).json(latestVitals);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

// to query db using responseId
export const getVitalsByResponseId = async (req, res) => {
    console.log("Request body:", req.body);
    try {
        const vitals = await VitalsTesting.findOne  ({ responseId: req.body.responseId });
        res.status(200).json(vitals);
    }
    catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};