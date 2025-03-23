import express from "express";
import { receiveVitals, getPatientVitals } from "../controllers/VitalsController.js";

const router = express.Router();

router.post("/", receiveVitals);
router.get("/:patientId", getPatientVitals);

export default router;