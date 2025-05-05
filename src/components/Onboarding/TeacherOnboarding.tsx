import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { teacherSaveOnboarding } from '../../utils/api';
import ThemeChangeButton from '../Reusables/ThemeChangeButton';
import Loading from '../custom/Loading';

const TeacherOnboarding: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    teachingExperience: '',
    fieldOfStudy: '',
  });

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNext = () => {
    if (step === 1 && !formData.username.trim()) {
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
    if (step === 2 && !formData.teachingExperience) {
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>Please select teaching experience</p>
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
      console.log('Submitting teacher onboarding data:', {
        username: formData.username,
        teachingExperience: formData.teachingExperience,
        fieldOfStudy: formData.fieldOfStudy,
      });
      const response = await teacherSaveOnboarding({
        username: formData.username,
        teachingExperience: formData.teachingExperience,
        fieldOfStudy: formData.fieldOfStudy,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.custom(
        (t) => (
          <div className={`max-w-md w-full p-4 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-50 text-gray-900'} relative overflow-hidden`}>
            <p>Teacher onboarding completed! Redirecting...</p>
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
      window.location.href = response.data.redirect;
    } catch (error: any) {
      console.error('Teacher onboarding error:', error);
      const errorMessage = error.response?.data?.message || 'Error during teacher onboarding';
      await new Promise((resolve) => setTimeout(resolve, 1000));
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

  const handleTeachingExperienceSelect = (experience: string) => {
    setFormData((prev) => ({ ...prev, teachingExperience: experience }));
  };

  const progressPercentage = step === 1 ? 33.33 : step === 2 ? 66.66 : 100;

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
          <h2 className="text-3xl font-bold mb-4">Teacher Onboarding - Step {step} of 3</h2>
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
                <h3 className="text-xl font-semibold mb-2">Choose a Username</h3>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter your username"
                  required
                  className={`w-full p-3 rounded-lg ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-blue-200'} border focus:outline-none focus:ring-2 ${isDarkMode ? 'focus:ring-purple-500' : 'focus:ring-blue-500'}`}
                />
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
                <h3 className="text-xl font-semibold mb-2">Select Teaching Experience</h3>
                {['Beginner', '1-3 Years', '3-5 Years', '5+ Years'].map((experience) => (
                  <div
                    key={experience}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-blue-100'} ${formData.teachingExperience === experience ? 'border-2 border-green-500' : ''}`}
                    onClick={() => handleTeachingExperienceSelect(experience)}
                  >
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{experience}</span>
                    {formData.teachingExperience === experience && (
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    )}
                  </div>
                ))}
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
                <h3 className="text-xl font-semibold mb-2">Enter Field of Study</h3>
                <input
                  type="text"
                  value={formData.fieldOfStudy}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))}
                  placeholder="e.g., Computer Science"
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
                    whileHover={{ scale: isLoading ? 1 : 1.05 }}
                    whileTap={{ scale: isLoading ? 1 : 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg ${isDarkMode ? 'bg-purple-500 hover:bg-purple-600' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold shadow-md transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Go to Dashboard
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

export default TeacherOnboarding;