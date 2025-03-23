// File: backend/src/routes/geminiRoutes.js
import express from 'express';
import { generateContent } from '../controllers/geminiController.js';

const router = express.Router();

router.post('/generate-content', generateContent);

export default router;