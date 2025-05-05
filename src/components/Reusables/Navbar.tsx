import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon } from '@heroicons/react/24/solid';
import ThemeChangeButton from './ThemeChangeButton';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Courses', path: '/courses' },
    { name: 'My Learning', path: '/my-learning' },
  ];

  const handleToggleSidebar = () => {
    console.log('Hamburger clicked, toggling sidebar');
    toggleSidebar();
  };

  return (
    <div className={`sticky top-0 z-50 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} shadow-md transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo or Brand */}
          <div className="flex-shrink-0">
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Learnly</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} text-sm font-medium transition-colors`}
              >
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Theme Toggle and Hamburger */}
          <div className="flex items-center space-x-4">
            <ThemeChangeButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleSidebar}
              aria-label="Toggle Menu"
              className={`p-2 rounded-md border-2 ${isDarkMode ? 'text-white border-gray-600 hover:bg-gray-600' : 'text-blue-900 border-blue-200 hover:bg-blue-200'} block`}
            >
              <Bars3Icon className="h-10 w-10" />
            </motion.button>
          </div>
        </div>
      </div>
      <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`} />
    </div>
  );
};

export default Navbar;