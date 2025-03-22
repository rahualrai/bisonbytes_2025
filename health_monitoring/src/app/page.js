import Dashboard from '@/components/dashboard/Dashboard';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { EmergencyProvider } from '@/contexts/EmergencyContext';

export default function Home() {
  return (
    <DashboardProvider>
      <EmergencyProvider>
        <Dashboard />
      </EmergencyProvider>
    </DashboardProvider>
  );
}