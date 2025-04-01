# Emergency Guardian

Emergency Guardian is a real-time health monitoring and emergency response system that leverages wearable devices, AI, and automation to ensure users receive immediate help during emergencies.

## Inspiration

Every day, wearable devices collect vast amounts of personal health data, but much of it remains underutilized. Emergency Guardian transforms this passive data collection into active, life-saving care. By leveraging wearable technology, we ensure that users are protected when they need help the most.

## What It Does

Emergency Guardian integrates with Garmin smartwatches to monitor users' health and detect emergencies automatically. Here's how it works:

1. **Health Monitoring**: Garmin smartwatches send health data and alerts to our server.
2. **Data Storage**: MongoDB securely stores health data for tracking and analysis.
3. **AI Detection**: An AI model analyzes the data for signs of emergencies.
4. **Risk Assessment**: A regression model calculates the likelihood of an emergency.
5. **Location Tracking**: Google Maps Geocoding API identifies the user's precise location.
6. **Emergency Summaries**: Gemini AI generates clear summaries of the emergency.
7. **Automated Alerts**: Twilio sends automated calls to caregivers or healthcare providers.
8. **Emergency Services**: In critical cases, alerts are sent directly to 911.
9. **Dashboard**: Caregivers and family can monitor health statuses and receive real-time alerts.

## How We Built It

Emergency Guardian was built using the following technologies:

- **Wearable Integration**: API to collect data from Garmin smartwatches.
- **Backend**: Node.js for real-time health data management.
- **AI Analysis**: Trained AI models to detect emergencies accurately.
- **Location Tracking**: Google Maps Geocoding API for precise location data.
- **Automated Alerts**: Twilio for emergency voice calls.
- **Risk Assessment**: Regression model to determine emergency likelihood.
- **Database**: MongoDB for secure health data storage.

## Challenges We Faced

- **Battery Efficiency**: Optimized smartwatch data handling to improve battery life.
- **False Alarms**: Enhanced AI accuracy to reduce false positives.
- **Privacy Protection**: Ensured secure storage of sensitive user data.
- **Quick Response**: Built a fast, responsive system for emergencies.
- **Integration**: Seamlessly connected Garmin, MongoDB, AI, and Twilio.

## What We Learned

- Combining wearable technology with software solutions.
- Using AI for fast and reliable decision-making.
- The importance of speed and accuracy in emergency systems.
- Balancing automation with human judgment.
- Securely managing sensitive user data.

## What's Next

Our future plans include:

- Adding support for devices like Apple Watch and Fitbit.
- Improving AI to predict emergencies earlier.
- Enabling voice interactions to cancel false alarms.
- Developing a caregiver mobile app.
- Partnering with emergency services for faster response times.

## Devpost Link

Check out our project on Devpost: [Emergency Guardian on Devpost](https://devpost.com/software/guradianai)