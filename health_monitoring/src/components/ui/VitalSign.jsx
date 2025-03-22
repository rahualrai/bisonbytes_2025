export default function VitalSign({ 
    icon, 
    title, 
    value, 
    unit, 
    trend = null, 
    status = "normal", 
    isActive = false,
    onClick = null 
  }) {
    // Status colors
    const getStatusColor = (status) => {
      switch (status) {
        case 'normal': return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
        case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
        case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
        default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    };
  
    // Trend arrow
    const getTrendArrow = (trend) => {
      if (!trend) return null;
      
      if (trend === 'up') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        );
      } else if (trend === 'down') {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        );
      } else {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
          </svg>
        );
      }
    };
  
    return (
      <div 
        className={`
          p-3 rounded-lg border flex items-center transition-colors cursor-pointer
          ${isActive 
            ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' 
            : `${getStatusColor(status)} border-transparent hover:bg-opacity-80`
          }
        `}
        onClick={onClick}
      >
        <div className="mr-3">
          {icon}
        </div>
        <div className="flex-grow">
          <div className="text-sm font-medium">{title}</div>
          <div className="flex items-center">
            <span className="text-xl font-semibold">{value}</span>
            {unit && <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{unit}</span>}
            {trend && <span className="ml-2">{getTrendArrow(trend)}</span>}
          </div>
        </div>
      </div>
    );
  }