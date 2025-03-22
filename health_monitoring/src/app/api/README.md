## **Backend Architecture (Next.js with Python Garmin Data Ingestion)**

### Suggested Project Structure:
```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── garmin/
│   │   │   │   └── route.js            # API endpoint to receive Garmin data (from Python fetcher)
│   │   │   ├── emergency/
│   │   │   │   └── route.js            # Emergency escalation routes
│   │   │   ├── call/
│   │   │   │   └── route.js            # Trigger call workflows
│   │   ├── services/
│   │   │   ├── alertService.js         # Abnormality detection and escalation
│   │   │   ├── twilioService.js        # Twilio call logic with forwarding
│   │   │   ├── geminiService.js        # Gemini summaries and call script generation
│   │   ├── utils/
│   │   │   ├── websocketHandler.js     # Real-time WebSocket updates
├── garmin_fetcher.py                   # Python script using garminconnect to pull data and POST to API
├── .env.local
├── next.config.js
├── package.json
└── Dockerfile
```

---

## **Logic Flow**
1. **Scheduled Python script:**
   - Fetches Garmin Connect data periodically and POSTs to `/api/garmin/route.js`

2. **Abnormality Detection (in alertService.js):**
   - Analyzes received data for anomalies

3. **Patient Confirmation:**
   - If abnormal data, triggers Garmin notification (if supported) or frontend alert

4. **Escalation:**
   - Triggers emergency call escalation using Twilio

5. **Call Script Generation:**
   - `geminiService.js` creates patient-specific emergency call scripts

6. **Twilio IVR Handling:**
   - During call, allows pressing 1 to forward to 911

7. **WebSocket Updates:**
   - Real-time updates to the dashboard

---