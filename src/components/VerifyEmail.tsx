import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { verifyEmail } from '../utils/api';
import ThemeChangeButton from './ThemeChangeButton';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const VerifyEmail: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for animation
        toast.custom(
          (t) => (
            <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
              <p>Email verified! Redirecting to onboarding...</p>
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
        setIsLoading(false);
        setTimeout(() => navigate(response.data.redirect), 2000);
      } catch (error: any) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for animation
        toast.custom(
          (t) => (
            <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
              <p>{error.response?.data?.message || 'Error verifying email'}</p>
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
        setIsLoading(false);
      }
    };

    verify();
  }, [navigate, isDarkMode]);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} min-h-screen transition-colors duration-300 flex flex-col`}>
      <Toaster position="top-right" />
      {/* Navbar Separator with Theme Toggle */}
      <div className="sticky top-0 z-50 bg-inherit">
        <div className="flex justify-end p-4">
          <ThemeChangeButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`} />
      </div>

      {/* Verification Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex items-center justify-center px-4"
      >
        <div className={`p-8 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} max-w-md w-full text-center relative`}>
          <h2 className="text-3xl font-bold mb-4">Email Verification</h2>
          {isLoading && (
            <div className="mt-4">
              {/* Placeholder for your custom animation */}
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <DotLottieReact
                src="https://lottie.host/eccf304b-d6ec-4b40-97d0-6dece3fc018d/3w7xHv2HHF.lottie"
                loop
              autoplay
              />
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;