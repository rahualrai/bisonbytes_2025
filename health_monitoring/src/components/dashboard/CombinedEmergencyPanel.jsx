'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useEmergency } from '@/contexts/EmergencyContext';
import { useDashboard } from '@/contexts/DashboardContext';
import CurrentEmergencyContent from './CurrentEmergencyContent';
import EmergencyHistoryContent from './EmergencyHistoryContent';
import { Bell, History } from 'lucide-react';

export default function CombinedEmergencyPanel() {
  const [activeTab, setActiveTab] = useState('alerts');
  const { hasActiveEmergency } = useEmergency();
  const { switchPanel } = useDashboard();
  
  // Update the dashboard context when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switchPanel('emergency', tab);
  };
  
  return (
    <Card 
      title="Emergency Information" 
      className="h-full"
    >
      <div className="emergency-tabs">
        <Button 
          variant={activeTab === 'alerts' ? 'filled' : 'outline'}
          onClick={() => handleTabChange('alerts')}
          className="flex items-center gap-2"
        >
          <Bell size={16} />
          Current Alerts
          {hasActiveEmergency && (
            <span className="inline-flex items-center justify-center w-5 h-5 ml-1 text-xs font-semibold text-white bg-red-500 rounded-full">
              !
            </span>
          )}
        </Button>
        <Button 
          variant={activeTab === 'history' ? 'filled' : 'outline'}
          onClick={() => handleTabChange('history')}
          className="flex items-center gap-2"
        >
          <History size={16} />
          Alert History
        </Button>
      </div>
      
      <div className="emergency-content">
        {activeTab === 'alerts' ? (
          <CurrentEmergencyContent />
        ) : (
          <EmergencyHistoryContent />
        )}
      </div>
    </Card>
  );
}