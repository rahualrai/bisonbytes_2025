import { useState, useEffect } from 'react';

export default function usePatientData() {
  const [patient, setPatient] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatientData = async () => {
    try {
      const response = await fetch('/api/patient');
      
      if (!response.ok) {
        throw new Error('Failed to fetch patient data');
      }
      
      const data = await response.json();
      setPatient(data);
      setContacts(data.emergencyContacts);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchEmergencyContacts = async () => {
    try {
      const response = await fetch('/api/patient?contactsOnly=true');
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency contacts');
      }
      
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  return {
    patient,
    contacts,
    loading,
    error,
    refreshPatientData: fetchPatientData,
    refreshContacts: fetchEmergencyContacts
  };
}