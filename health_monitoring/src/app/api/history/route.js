import { getDetailedEmergencyHistory, getEmergencyById, getEmergencyStats } from '@/lib/mock-data/history';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const stats = searchParams.get('stats') === 'true';
  
  if (id) {
    // Get specific emergency details
    const emergency = getEmergencyById(id);
    if (!emergency) {
      return NextResponse.json({ error: 'Emergency not found' }, { status: 404 });
    }
    return NextResponse.json(emergency);
  } else if (stats) {
    // Get emergency statistics
    return NextResponse.json(getEmergencyStats());
  } else {
    // Get all detailed emergency history
    return NextResponse.json(getDetailedEmergencyHistory());
  }
}