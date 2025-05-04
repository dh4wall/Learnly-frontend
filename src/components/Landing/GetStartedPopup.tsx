import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { signup, signin, googleAuth } from '../../utils/api';
import { toast } from 'react-hot-toast';
import Loading from '../custom/Loading';

interface GetStartedPopupProps {
  isDarkMode: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const GetStartedPopup: React.FC<GetStartedPopupProps> = ({ isDarkMode, isModalOpen, setIsModalOpen }) => {
  const [isSignup, setIsSignup] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEmail('');
    setPassword('');
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignup) {
        await signup(email, password);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.custom(
          (t) => (
            <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
              <p>User created, please verify your email</p>
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
      } else {
        const response = await signin(email, password);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.custom(
          (t) => (
            <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
              <p>{response.data.message}</p>
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
        if (response.data.redirect) {
          setTimeout(() => navigate(response.data.redirect), 1000);
        }
      }
    } catch (error: any) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
          <p>{error.response?.data?.message || `Error during ${isSignup ? 'signup' : 'signin'}`}</p>
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
  } finally {
    setIsLoading(false);
  }
};

return (
  <>
    {isModalOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`p-6 rounded-2xl max-w-md w-full ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} shadow-2xl relative`}
        >
          {/* Sliding Tabs */}
          <div className="relative flex justify-between mb-6">
            <div className={`w-full flex rounded-full p-1 ${isDarkMode ? 'bg-gray-700' : 'bg-blue-200'}`}>
              <motion.button
                onClick={() => setIsSignup(true)}
                className={`flex-1 py-2 rounded-full text-lg font-semibold z-10 transition-colors ${isSignup ? (isDarkMode ? 'text-white' : 'text-blue-600') : isDarkMode ? 'text-gray-400' : 'text-blue-400'}`}
              >
                Sign Up
              </motion.button>
              <motion.button
                onClick={() => setIsSignup(false)}
                className={`flex-1 py-2 rounded-full text-lg font-semibold z-10 transition-colors ${!isSignup ? (isDarkMode ? 'text-white' : 'text-blue-600') : isDarkMode ? 'text-gray-400' : 'text-blue-400'}`}
              >
                Sign In
              </motion.button>
              <motion.div
                className={`absolute top-1 bottom-1 rounded-full ${isDarkMode ? 'bg-purple-500' : 'bg-blue-500'}`}
                initial={false}
                animate={{ x: isSignup ? '0%' : '100%' }}
                transition={{ duration: 0.3 }}
                style={{ width: '50%' }}
              />
            </div>
          </div>

          {/* Form with Transition and Loading Animation */}
          <motion.div
            key={isSignup ? 'signup' : 'signin'}
            initial={{ opacity: 0, x: isSignup ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignup ? -20 : 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 relative"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-blue-200'} border focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-blue-200'} border focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-blue-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                type="submit"
                disabled={isLoading}
                className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold shadow-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSignup ? 'Sign Up' : 'Sign In'}
              </motion.button>
            </form>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={googleAuth}
              className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold shadow-md transition-colors`}
            >
              Sign in with Google
            </motion.button>
            {isLoading && <Loading />}
          </motion.div>

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleModalClose}
            className={`absolute top-4 right-4 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}
          >
            ✕
          </motion.button>
        </motion.div>
      </motion.div>
    )}
  </>
);
};

export default GetStartedPopup;