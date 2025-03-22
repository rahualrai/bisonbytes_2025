import { useState } from 'react';

export default function Tabs({ tabs, defaultTab = 0, onChange = null }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    if (onChange) {
      onChange(index);
    }
  };

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px">
          {tabs.map((tab, index) => (
            <li key={index} className="mr-2">
              <button
                onClick={() => handleTabChange(index)}
                className={`inline-block p-4 py-2 ${
                  activeTab === index
                    ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500'
                    : 'hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="pt-4">
        {tabs[activeTab] && tabs[activeTab].content}
      </div>
    </div>
  );
}