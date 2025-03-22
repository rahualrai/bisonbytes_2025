import { getPatientData, getEmergencyContacts } from '@/lib/mock-data/patient';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const contactsOnly = searchParams.get('contactsOnly') === 'true';
  
  if (contactsOnly) {
    return NextResponse.json(getEmergencyContacts());
  }
  
  return NextResponse.json(getPatientData());
}