// I want to call all the data from vitaltesting table

import VitalsTesting from "../models/vitalsTestModel.js"; // Import the VitalsTesting model

export const getVitals = async (req, res) => {

    try {
        const vitals = await VitalsTesting.find();
        res.status(200).json(vitals);
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};