import express from "express";
import { receiveVitals, getPatientVitals } from "../controllers/VitalsController.js";
import { getVitals, getLatestVitals } from "../controllers/dbCall.js"; // Import the getVitals function

const router = express.Router();

router.post("/", receiveVitals);
router.get("/get-vitals", getVitals); 
router.get("/get-latest-vitals", getLatestVitals);

export default router;