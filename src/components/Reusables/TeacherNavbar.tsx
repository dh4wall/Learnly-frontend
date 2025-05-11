import React from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeChangeButton from './ThemeChangeButton';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, toggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <nav className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-900' : 'bg-blue-50'} shadow-md`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-200'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Teacher Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/courses')}
            className={`px-3 py-1 rounded-md ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-200'}`}
          >
            View Courses
          </button>
          <button
            onClick={() => navigate('/courses/create')}
            className={`px-3 py-1 rounded-md ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-200'}`}
          >
            Create Courses
          </button>
          <ThemeChangeButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
      </div>
      <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`} />
    </nav>
  );
};

export default Navbar;