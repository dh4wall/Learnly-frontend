import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  handleLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isDarkMode, handleLogout }) => {
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sidebarItems = [
    { name: 'Profile', path: '/profile' },
    { name: 'My Cart', path: '/cart' },
    { name: 'Doubts', path: '/doubts' },
  ];

  // Close sidebar on outside click, excluding hamburger button
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        isOpen &&
        !(event.target as HTMLElement).closest('button[aria-label="Toggle Menu"]')
      ) {
        console.log('Closing sidebar due to outside click');
        toggleSidebar();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  return (
    <>
      <Toaster position="top-right" />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className={`fixed top-0 right-0 h-full w-64 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-gray-900'} shadow-2xl z-50 flex flex-col p-8 transition-colors duration-300`}
        ref={sidebarRef}
      >
        <h2 className="text-3xl font-bold mb-4">Menu</h2>
        <hr className={`mb-6 ${isDarkMode ? 'border-gray-600' : 'border-blue-200'}`} />
        <div className="flex flex-col space-y-6">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.name}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigate(item.path);
                toggleSidebar();
              }}
              className={`text-left p-3 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-600 hover:shadow-md' : 'text-gray-600 hover:bg-blue-100 hover:shadow-md'} text-lg font-medium transition-all duration-200`}
            >
              {item.name}
            </motion.button>
          ))}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              handleLogout();
              toggleSidebar();
            }}
            className={`text-left p-3 rounded-lg ${isDarkMode ? 'text-gray-300 hover:bg-gray-600 hover:shadow-md' : 'text-gray-600 hover:bg-blue-100 hover:shadow-md'} text-lg font-medium transition-all duration-200`}
          >
            Logout
          </motion.button>
        </div>
      </motion.div>
      {/* Overlay when sidebar is open */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;