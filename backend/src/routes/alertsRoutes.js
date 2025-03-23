import express from "express";
import { getAlerts } from "../controllers/alertQuery.js";

const router = express.Router();

router.get("/get-all-alerts", getAlerts);
 
export default router;