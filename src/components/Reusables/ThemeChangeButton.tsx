import React from 'react';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';

interface ThemeChangeButtonProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeChangeButton: React.FC<ThemeChangeButtonProps> = ({ isDarkMode, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-blue-200'} shadow-md`}
    >
      {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-blue-600" />}
    </button>
  );
};

export default ThemeChangeButton;