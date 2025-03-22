// Utility function to format dates
export function formatDate(dateString, options = {}) {
    if (!dateString) return 'N/A';
  
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      if (options.includeTime) {
        return new Intl.DateTimeFormat('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short'
        }).format(date);
      }
      
      return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Error';
    }
  }
  
  // Format a date as a relative time (e.g., "5 minutes ago")
  export function formatTimeAgo(dateString) {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);
      
      if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
      }
      
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
      }
      
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
      }
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      }
      
      // If more than a month, just show the date
      return formatDate(dateString);
    } catch (error) {
      console.error("Error calculating time ago:", error);
      return 'Error';
    }
  }
  
  // Determine vital sign status based on thresholds
  export function determineVitalStatus(type, value) {
    switch (type) {
      case 'heartRate':
        if (value < 50) return 'warning';
        if (value < 60) return 'normal';
        if (value <= 100) return 'normal';
        if (value <= 120) return 'warning';
        return 'critical';
        
      case 'bloodPressure':
        const { systolic, diastolic } = value;
        
        // Critical high
        if (systolic >= 180 || diastolic >= 120) return 'critical';
        // High
        if (systolic >= 140 || diastolic >= 90) return 'warning';
        // Elevated
        if (systolic >= 120 && systolic < 140 && diastolic < 80) return 'warning';
        // Normal
        if (systolic < 120 && diastolic < 80) return 'normal';
        // Low
        if (systolic < 90 || diastolic < 60) return 'warning';
        
        return 'normal';
        
      case 'spO2':
        if (value < 90) return 'critical';
        if (value < 95) return 'warning';
        return 'normal';
        
      case 'temperature':
        if (value <= 35) return 'critical';
        if (value < 36) return 'warning';
        if (value <= 37.5) return 'normal';
        if (value < 38) return 'warning';
        if (value < 39) return 'warning';
        return 'critical';
        
      default:
        return 'normal';
    }
  }
  
  // Generate trend data for a vital sign
  export function getVitalTrend(history, type) {
    if (!history || !history.length || history.length < 2) {
      return 'stable';
    }
    
    try {
      // Sort by date, newest first
      const sorted = [...history].sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        // Check if dates are valid
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0;
        }
        return dateB - dateA;
      });
      
      // Get the most recent and second most recent values
      const current = sorted[0].value;
      const previous = sorted[1].value;
      
      // Calculate percent change
      let percentChange;
      if (type === 'bloodPressure') {
        // For blood pressure, use systolic for trend calculation
        const currentSystolic = current.systolic;
        const previousSystolic = previous.systolic;
        percentChange = ((currentSystolic - previousSystolic) / previousSystolic) * 100;
      } else {
        percentChange = ((current - previous) / previous) * 100;
      }
      
      // Determine trend based on percent change
      if (percentChange > 5) return 'up';
      if (percentChange < -5) return 'down';
      return 'stable';
    } catch (error) {
      console.error("Error calculating vital trend:", error);
      return 'stable';
    }
  }