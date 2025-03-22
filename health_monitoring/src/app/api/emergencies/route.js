import { getCurrentEmergency, getEmergencyHistory, hasActiveEmergency } from '@/lib/mock-data/emergencies';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const current = searchParams.get('current') === 'true';
  
  if (current) {
    // Get current emergency (if any)
    const active = getCurrentEmergency();
    return NextResponse.json({ hasActive: hasActiveEmergency(), emergency: active });
  } else if (status) {
    // Filter by status
    const emergencies = getEmergencyHistory().filter(
      emergency => emergency.status.toLowerCase() === status.toLowerCase()
    );
    return NextResponse.json(emergencies);
  } else {
    // Get all emergencies
    const emergencies = getEmergencyHistory();
    return NextResponse.json(emergencies);
  }
}