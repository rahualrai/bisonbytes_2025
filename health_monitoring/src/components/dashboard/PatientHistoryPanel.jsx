'use client';

import { useState } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Tabs from '@/components/ui/Tabs';
import { formatDate } from '@/lib/utils';

export default function PatientHistoryPanel() {
  const { patient, patientLoading, patientError } = useDashboard();
  const [activeTab, setActiveTab] = useState(0);

  if (patientLoading) {
    return (
      <Card title="Patient History" className="h-full">
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse flex flex-col w-full max-w-md">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/5 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (patientError || !patient) {
    return (
      <Card title="Patient History" className="h-full">
        <div className="h-full flex items-center justify-center flex-col">
          <p className="text-red-500 mb-4">Error loading patient data</p>
          <Button>Retry</Button>
        </div>
      </Card>
    );
  }

  const patientTabs = [
    {
      label: "Profile",
      content: (
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-bold">
              {patient.personalInfo.firstName.charAt(0)}{patient.personalInfo.lastName.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{patient.personalInfo.firstName} {patient.personalInfo.lastName}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {patient.personalInfo.age} years old • {patient.personalInfo.gender}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {patient.contact.address}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {patient.contact.phone} • {patient.contact.email}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Date of Birth:</span>
              <p>{formatDate(patient.personalInfo.dateOfBirth)}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Blood Type:</span>
              <p>{patient.personalInfo.bloodType}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Height:</span>
              <p>{patient.personalInfo.height}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Weight:</span>
              <p>{patient.personalInfo.weight}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">BMI:</span>
              <p>{patient.personalInfo.bmi}</p>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Patient ID:</span>
              <p>{patient.id}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      label: "Medical Conditions",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Medical Conditions</h3>
          
          <div className="overflow-y-auto max-h-[300px]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Condition</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Diagnosed</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {patient.medicalInfo.conditions.map((condition, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{condition.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(condition.diagnosedDate)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        condition.severity === 'Severe' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                          : condition.severity === 'Moderate'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {condition.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      label: "Medications",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Medications</h3>
          
          <div className="overflow-y-auto max-h-[300px]">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Medication</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dosage</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Schedule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {patient.medicalInfo.medications.map((medication, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <div>{medication.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{medication.purpose}</div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{medication.dosage}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{medication.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      label: "Contacts",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Emergency Contacts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patient.emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium">{contact.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relationship}</p>
                <div className="mt-2 space-y-1">
                  <p className="text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {contact.phone}
                  </p>
                  {contact.email && (
                    <p className="text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {contact.email}
                    </p>
                  )}
                  {contact.address && (
                    <p className="text-sm flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {contact.address}
                    </p>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-500">
                    Call Order: {contact.priority}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <Card 
      title="Patient Information" 
      className="h-full"
      action={
        <div className="text-sm">
          <Button size="sm" variant="secondary">Edit</Button>
        </div>
      }
    >
      <Tabs 
        tabs={patientTabs} 
        defaultTab={activeTab} 
        onChange={setActiveTab} 
      />
    </Card>
  );
}