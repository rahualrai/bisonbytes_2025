export default function StatusBadge({ status }) {
    const getStatusClasses = (status) => {
      switch (status?.toLowerCase()) {
        case 'normal':
        case 'ok':
        case 'resolved':
        case 'completed':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'warning':
        case 'inactive':
        case 'pending':
        case 'in_progress':
          return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'critical':
        case 'active':
        case 'emergency':
        case 'failed':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
    };
  
    const formatStatus = (status) => {
      if (!status) return 'Unknown';
      
      return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    };
  
    return (
      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusClasses(status)}`}>
        {formatStatus(status)}
      </span>
    );
  }