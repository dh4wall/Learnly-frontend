import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { logout } from '../../utils/api';
import Navbar from '../Reusables/Navbar';
import Sidebar from '../Reusables/Sidebar';

const Home: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    console.log('Toggling sidebar, current state:', isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>Logged out successfully!</p>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="absolute bottom-0 left-0 h-1 bg-green-500"
            />
          </div>
        ),
        { duration: 3000 }
      );
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error('Error during logout:', error);
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>Error during logout</p>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="absolute bottom-0 left-0 h-1 bg-red-500"
            />
          </div>
        ),
        { duration: 3000 }
      );
    }
  };

  // Log viewport size for responsive debugging
  useEffect(() => {
    const logViewport = () => {
      console.log('Viewport width:', window.innerWidth);
    };
    logViewport();
    window.addEventListener('resize', logViewport);
    return () => window.removeEventListener('resize', logViewport);
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} min-h-screen transition-colors duration-300 flex flex-col`}>
      <Toaster position="top-right" />
      <Navbar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        handleLogout={handleLogout}
      />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex flex-col items-center justify-center px-4"
      >
        <div className={`p-8 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} max-w-4xl w-full text-center`}>
          <h2 className="text-3xl font-bold mb-6">Popular Courses</h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            {/* Placeholder for future course content */}
            Course content will be added here.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold shadow-md transition-colors`}
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;