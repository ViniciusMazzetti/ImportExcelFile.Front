import React, { useState, useEffect } from 'react';

interface Option {
  Id: string;
  FileAlias: string;
}

interface ComboInputProps {
  apiUrl: string;
  onChange: (selectedValue: string) => void; // Callback function to return the selected value
}

const ComboInput: React.FC<ComboInputProps> = ({ apiUrl, onChange }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setOptions(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onChange(selectedValue);
  };

  return (
    <div>
      <select value={selectedOption} onChange={handleSelectChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option value="">Select an option...</option>
        {options.map(option => (            
          <option key={option.Id} value={option.Id}>
            {option.FileAlias}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ComboInput;
