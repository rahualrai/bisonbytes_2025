export default function Alert({ 
    children, 
    title, 
    variant = "info" 
  }) {
    const variants = {
      info: "bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200",
      success: "bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200",
      warning: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200",
      danger: "bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200"
    };
  
    return (
      <div className={`p-4 rounded-md ${variants[variant]}`}>
        {title && <h3 className="font-medium mb-1">{title}</h3>}
        <div className="text-sm">{children}</div>
      </div>
    );
  }