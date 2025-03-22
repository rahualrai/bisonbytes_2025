export const patientData = {
    id: "PT-12345",
    personalInfo: {
      firstName: "Jane",
      lastName: "Doe",
      dateOfBirth: "1958-04-12",
      age: 66,
      gender: "Female",
      photo: "/patient-photo.jpg", // You'll need to add this image or use a placeholder
      bloodType: "O+",
      height: "165cm",
      weight: "68kg",
      bmi: 24.9,
    },
    contact: {
      address: "123 Maple Street, Springfield, IL",
      phone: "+1 (555) 123-4567",
      email: "jane.doe@example.com",
    },
    medicalInfo: {
      conditions: [
        { name: "Hypertension", diagnosedDate: "2015-06-10", severity: "Moderate" },
        { name: "Type 2 Diabetes", diagnosedDate: "2017-03-22", severity: "Mild" },
        { name: "Osteoarthritis", diagnosedDate: "2019-11-05", severity: "Mild" },
      ],
      allergies: [
        { name: "Penicillin", severity: "Severe", reaction: "Hives, difficulty breathing" },
        { name: "Shellfish", severity: "Moderate", reaction: "Nausea, skin rash" },
      ],
      medications: [
        {
          name: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          purpose: "Blood pressure management",
          startDate: "2020-01-15",
        },
        {
          name: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          purpose: "Diabetes management",
          startDate: "2017-04-05",
        },
        {
          name: "Acetaminophen",
          dosage: "500mg",
          frequency: "As needed",
          purpose: "Pain relief",
          startDate: "2019-11-10",
        },
      ],
      primaryPhysician: {
        name: "Dr. Robert Smith",
        specialty: "Internal Medicine",
        phone: "+1 (555) 987-6543",
        email: "dr.smith@health.example.com",
      },
    },
    emergencyContacts: [
      {
        name: "John Doe",
        relationship: "Son",
        phone: "+1 (555) 234-5678",
        email: "john.doe@example.com",
        priority: 1,
      },
      {
        name: "Sarah Johnson",
        relationship: "Daughter",
        phone: "+1 (555) 345-6789",
        email: "sarah.j@example.com",
        priority: 2,
      },
      {
        name: "Springfield Medical Center",
        relationship: "Healthcare Provider",
        phone: "+1 (555) 456-7890",
        priority: 3,
      },
    ],
    deviceInfo: {
      deviceType: "Garmin Venu 2 Plus",
      serialNumber: "GV2P-98765432",
      lastSynced: new Date().toISOString(),
      batteryLevel: "78%",
    },
    preferences: {
      notificationThreshold: {
        heartRate: { low: 50, high: 100 },
        bloodPressure: { 
          systolic: { low: 100, high: 140 },
          diastolic: { low: 60, high: 90 }
        },
        spO2: { low: 92, high: 100 },
        temperature: { low: 35.5, high: 37.8 },
      },
      emergencyResponseDelay: 30, // seconds
      language: "English",
    },
  };
  
  export const getPatientData = () => {
    return patientData;
  };
  
  export const getEmergencyContacts = () => {
    return patientData.emergencyContacts;
  };