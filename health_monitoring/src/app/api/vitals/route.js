import { getLatestVitals, getVitalHistory } from '@/lib/mock-data/vitals';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const vitalType = searchParams.get('type');
  const hours = searchParams.get('hours') ? parseInt(searchParams.get('hours')) : 24;
  
  if (vitalType) {
    // Get historical data for a specific vital
    const history = getVitalHistory(vitalType, hours);
    return NextResponse.json(history);
  } else {
    // Get latest vitals
    const vitals = getLatestVitals();
    return NextResponse.json(vitals);
  }
}