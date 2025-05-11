import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { teacherLogout } from '../../utils/api';

interface SidebarProps {
  isOpen: boolean;
  isDarkMode: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, isDarkMode, closeSidebar }) => {
  const navigate = useNavigate();

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
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: isOpen ? 0 : '-100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed top-0 left-0 h-full w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-100'} shadow-lg z-50`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={closeSidebar}
            className={`p-2 rounded-md ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-200'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`} />
        <div className="flex flex-col space-y-2 p-4">
          <button
            onClick={() => navigate('/profile')}
            className={`w-full text-left px-3 py-2 rounded-md ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-200'}`}
          >
            Profile
          </button>
          <button
            onClick={() => navigate('/statistics')}
            className={`w-full text-left px-3 py-2 rounded-md ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-900 hover:bg-blue-200'}`}
          >
            Statistics
          </button>
          <button
            onClick={handleLogout}
            className={`w-full text-left px-3 py-2 rounded-md ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-blue-200'}`}
          >
            Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;