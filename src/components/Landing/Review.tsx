import React from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface ReviewProps {
  name: string;
  text: string;
  isDarkMode: boolean;
}

const Review: React.FC<ReviewProps> = ({ name, text, isDarkMode }) => {
  return (
    <div className={`min-w-[350px] min-h-[250px] p-8 m-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50'} transform hover:scale-105 transition-transform duration-300 flex flex-col justify-between`}>
      <div className="flex items-center mb-4">
        <UserCircleIcon className={`w-12 h-12 ${isDarkMode ? 'text-gray-400' : 'text-blue-500'} mr-4`} />
        <p className="font-bold text-lg">{name}</p>
      </div>
      <p className={`italic ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{text}"</p>
    </div>
  );
};

export default Review;