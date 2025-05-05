import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { teacherLogout } from '../../utils/api';
import ThemeChangeButton from '../Reusables/ThemeChangeButton';

const TeacherDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogout = async () => {
    try {
      await teacherLogout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} min-h-screen transition-colors duration-300 flex flex-col`}>
      <Toaster position="top-right" />
      <div className="sticky top-0 z-50 bg-inherit">
        <div className="flex justify-end p-4">
          <ThemeChangeButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex items-center justify-center px-4"
      >
        <div className={`p-8 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} max-w-md w-full text-center relative`}>
          <h2 className="text-3xl font-bold mb-4">Teacher Dashboard</h2>
          <p className="text-lg mb-6">Welcome to your teacher dashboard!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-red-500 hover:bg-red-600' : 'bg-red-400 hover:bg-red-500'} text-white font-semibold shadow-md transition-colors`}
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;