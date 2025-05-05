import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { saveOnboarding } from '../../utils/api';
import ThemeChangeButton from '../Reusables/ThemeChangeButton';
import Loading from '../custom/Loading';

const Onboarding: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    educationLevel: '',
    username: '',
    interests: [] as string[],
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNext = () => {
    if (step === 1 && !formData.educationLevel) {
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>Please select an education level</p>
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
      return;
    }
    if (step === 2 && !formData.username.trim()) {
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>Username is required</p>
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
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('Submitting onboarding data:', {
        education_level: formData.educationLevel,
        username: formData.username,
        interests: formData.interests,
      });
      const response = await saveOnboarding({
        education_level: formData.educationLevel,
        username: formData.username,
        interests: formData.interests,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for animation
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>Onboarding completed! Redirecting...</p>
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
      window.location.href = response.data.redirect; // Revert to original navigation
    } catch (error: any) {
      console.error('Onboarding error:', error);
      const errorMessage = error.response?.data?.message || 'Error during onboarding';
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for animation
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>{errorMessage}</p>
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

  const handleEducationLevelSelect = (level: string) => {
    setFormData((prev) => ({ ...prev, educationLevel: level }));
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(value)
        ? prev.interests.filter((i) => i !== value)
        : [...prev.interests, value],
    }));
  };

  const progressPercentage = step === 1 ? 33.33 : step === 2 ? 66.66 : 100;

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

      {/* Onboarding Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow flex items-center justify-center px-4"
      >
        <div className={`p-8 rounded-2xl shadow-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} max-w-md w-full text-center relative`}>
          <h2 className="text-3xl font-bold mb-4">Onboarding - Step {step} of 3</h2>

          {/* Progress Bar */}
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-2 mb-6">
            <motion.div
              className={`${isDarkMode ? 'bg-purple-500' : 'bg-blue-500'} h-2 rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => e.preventDefault()}>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Select Education Level</h3>
                {['High School', 'College', 'Graduate', 'Other'].map((level) => (
                  <div
                    key={level}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-100'} ${formData.educationLevel === level ? 'border-2 border-green-500' : ''}`}
                    onClick={() => handleEducationLevelSelect(level)}
                  >
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{level}</span>
                    {formData.educationLevel === level && (
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    )}
                  </div>
                ))}
                <div className="flex justify-end mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleNext}
                    className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold shadow-md transition-colors`}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Choose a Username</h3>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  required
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-blue-200'} border focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-blue-500'}`}
                />
                <div className="flex justify-between mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleBack}
                    className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-white font-semibold shadow-md transition-colors`}
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleNext}
                    className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold shadow-md transition-colors`}
                  >
                    Next
                  </motion.button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-2">Select Your Interests</h3>
                <div className="space-y-2">
                  {['coding', 'design', 'music'].map((interest) => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={interest}
                        checked={formData.interests.includes(interest)}
                        onChange={handleInterestsChange}
                        className="h-5 w-5 text-purple-500 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} capitalize`}>{interest}</span>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleBack}
                    className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} text-white font-semibold shadow-md transition-colors`}
                  >
                    Previous
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold shadow-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Go to Website
                  </motion.button>
                </div>
              </div>
            )}
          </form>
          {isLoading && <Loading />}
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;