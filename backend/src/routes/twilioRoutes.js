import express from "express";
const router = express.Router();

router.post("/call-status", (req, res) => {
  console.log("Twilio call status callback received:", req.body);
  res.send("<Response></Response>");
});

router.post("/recording", (req, res) => {
  console.log("Twilio recording callback received:", req.body);
  res.send("<Response></Response>");
});

export default router;
