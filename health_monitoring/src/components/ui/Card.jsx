export default function Card({ title, children, className = "", action }) {
    return (
      <div className={`bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden h-full flex flex-col ${className}`}>
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="font-semibold">{title}</div>
          {action && <div>{action}</div>}
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    );
  }