import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ThemeChangeButton from '../Reusables/ThemeChangeButton';
import GetStartedPopup from './GetStartedPopup';
import TeacherGetStartedPopup from './TeacherGetStartedPopup';
import Footer from '../Reusables/Footer';
import Feature from './Feature';
import Review from './Review';
import Typewriter from './Typewriter';

const Landing: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Define reviews for two rows
  const reviewsRow1 = [
    { name: "John Doe", text: "Learnly transformed my learning experience with its personalized approach!" },
    { name: "Jane Smith", text: "The doubt support feature is a game-changer. I got help exactly when I needed it." },
    { name: "Alex Brown", text: "The customized learning paths made studying so much more efficient!" },
    { name: "Emily Davis", text: "Interactive quizzes kept me engaged and helped me master concepts." },
    { name: "Michael Chen", text: "The community forums are amazing for connecting with other learners!" },
  ];

  const reviewsRow2 = [
    { name: "Sarah Wilson", text: "Learnly's intuitive design made learning fun and stress-free." },
    { name: "David Lee", text: "The platform's flexibility allowed me to learn at my own pace." },
    { name: "Laura Martinez", text: "I improved my skills significantly thanks to Learnly's resources." },
    { name: "Chris Taylor", text: "The engaging content and support made learning enjoyable." },
    { name: "Anna Patel", text: "Learnly helped me achieve my learning goals faster than expected!" },
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} transition-colors duration-300`}>
      <Toaster position="top-right" />
      {/* Navbar Separator */}
      <div className="sticky top-0 z-50 bg-inherit">
        <div className="flex justify-end p-4">
          <ThemeChangeButton isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'}`} />
      </div>

      {/* Hero Section with Right-Aligned Content and Lottie Animation */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-auto flex flex-col md:flex-row justify-center items-center px-4 max-w-6xl mx-auto pb-10"
      >
        {/* Left Section for Lottie Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full md:w-1/2 flex justify-center items-center"
        >
          <DotLottieReact
            src="https://lottie.host/0b0c10ae-39a2-4281-a5ae-136ea07416dd/aJeY1bv0i6.lottie"
            loop
            autoplay
            className="h-[500px] w-[500px] sm:h-[700px] sm:w-[700px] md:h-[800px] md:w-[800px]"
          />
        </motion.div>
        {/* Right Section for Text and Buttons */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Welcome to <Typewriter text="Learnly" delay={100} />
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-lg">
            Unlock your potential with personalized learning experiences!
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsUserModalOpen(true)}
              className={`px-8 py-4 text-lg font-semibold rounded-full ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'} text-white shadow-lg`}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsTeacherModalOpen(true)}
              className={`px-8 py-4 text-lg font-semibold rounded-full ${isDarkMode ? 'bg-gradient-to-r from-green-500 to-teal-500' : 'bg-gradient-to-r from-teal-400 to-green-600'} text-white shadow-lg`}
            >
              Get Started as Teacher
            </motion.button>
          </div>
        </div>
      </motion.section>

      {/* Separator Between Hero and Features */}
      <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'} max-w-6xl mx-auto`} />

      {/* Features Section */}
      <section className={`py-10 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
        <h2 className="text-4xl font-bold text-center mb-12">Why Learnly Stands Out</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Feature
            index={0}
            title="Doubt Support"
            description="Instant help from expert tutors whenever you're stuck."
            icon="❓"
            isDarkMode={isDarkMode}
          />
          <Feature
            index={1}
            title="Customized Learning Path"
            description="Tailored courses that adapt to your learning style and pace."
            icon="🛤️"
            isDarkMode={isDarkMode}
          />
          <Feature
            index={2}
            title="Interactive Quizzes"
            description="Engaging quizzes to test your knowledge and track progress."
            icon="📝"
            isDarkMode={isDarkMode}
          />
          <Feature
            index={3}
            title="Community Forums"
            description="Connect with learners worldwide to share knowledge."
            icon="🌐"
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Separator Between Features and Reviews */}
      <hr className={`${isDarkMode ? 'border-gray-700' : 'border-blue-200'} max-w-6xl mx-auto`} />

      {/* Reviews Section with Marquee Effect */}
      <section className={`py-20 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div className="space-y-4">
          {/* Row 1: Scrolls Right to Left */}
          <div className="overflow-hidden">
            <div className="flex flex-nowrap gap-4 animate-marquee-right-to-left">
              {[...reviewsRow1, ...reviewsRow1].map((review, index) => (
                <div key={`row1-${index}`} className="flex-shrink-0">
                  <Review
                    name={review.name}
                    text={review.text}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Row 2: Scrolls Left to Right */}
          <div className="overflow-hidden">
            <div className="flex flex-nowrap gap-4 animate-marquee-left-to-right">
              {[...reviewsRow2, ...reviewsRow2].map((review, index) => (
                <div key={`row2-${index}`} className="flex-shrink-0">
                  <Review
                    name={review.name}
                    text={review.text}
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer isDarkMode={isDarkMode} />

      {/* Popups */}
      <GetStartedPopup
        isDarkMode={isDarkMode}
        isModalOpen={isUserModalOpen}
        setIsModalOpen={setIsUserModalOpen}
      />
      <TeacherGetStartedPopup
        isDarkMode={isDarkMode}
        isModalOpen={isTeacherModalOpen}
        setIsModalOpen={setIsTeacherModalOpen}
      />
    </div>
  );
};

export default Landing;