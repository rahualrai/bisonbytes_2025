import express from "express";
const router = express.Router();

let currentMessage = "Hello World";

router.get("/testing", (req, res) => {
  // testing route that returns the current message
  res.status(200).json({ message: currentMessage });
});

router.post("/update-test-message", (req, res) => {
  const { message: newMessage } = req.body;
  if (!newMessage) {
    return res.status(400).json({ error: "new message is required" });
  }
  currentMessage = newMessage;
  res.status(200).json({ message: currentMessage });
});

export default router;