import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import ThemeChangeButton from '../ThemeChangeButton';
import GetStartedPopup from './GetStartedPopup';
import Footer from '../Footer';
import Feature from './Feature';
import Review from './Review';
import Typewriter from './Typewriter';

const Landing: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleModalOpen = () => setIsModalOpen(true);

  // Scroll reviews on mouse wheel when hovering
  const reviewsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (reviewsRef.current) {
        e.preventDefault();
        const scrollAmount = e.deltaY * 0.5;
        reviewsRef.current.scrollLeft += scrollAmount;
      }
    };

    const reviewsElement = reviewsRef.current;
    if (reviewsElement) {
      reviewsElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (reviewsElement) {
        reviewsElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-50 text-gray-900'} min-h-screen transition-colors duration-300`}>
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
        className="min-h-screen flex flex-col md:flex-row justify-center items-center px-4 max-w-6xl mx-auto"
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
          className="h-96 w-96 sm:h-[600px] sm:w-[600px]"
          />
        </motion.div>
        {/* Right Section for Text and Button */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Welcome to <Typewriter text="Learnly" delay={100} />
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-lg">
            Unlock your potential with personalized learning experiences!
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleModalOpen}
            className={`px-8 py-4 text-lg font-semibold rounded-full ${isDarkMode ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-blue-600'} text-white shadow-lg`}
          >
            Get Started
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 px-4">
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

      {/* Reviews Section */}
      <section className={`py-20 px-4 ${isDarkMode ? 'bg-gray-800' : 'bg-blue-100'}`}>
        <h2 className="text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        <div ref={reviewsRef} className="flex overflow-x-hidden">
          <Review
            name="John Doe"
            text="Learnly transformed my learning experience with its personalized approach!"
            isDarkMode={isDarkMode}
          />
          <Review
            name="Jane Smith"
            text="The doubt support feature is a game-changer. I got help exactly when I needed it."
            isDarkMode={isDarkMode}
          />
          <Review
            name="Alex Brown"
            text="The customized learning paths made studying so much more efficient!"
            isDarkMode={isDarkMode}
          />
          <Review
            name="Emily Davis"
            text="Interactive quizzes kept me engaged and helped me master concepts."
            isDarkMode={isDarkMode}
          />
          <Review
            name="Michael Chen"
            text="The community forums are amazing for connecting with other learners!"
            isDarkMode={isDarkMode}
          />
          <Review
            name="Sarah Wilson"
            text="Learnly's intuitive design made learning fun and stress-free."
            isDarkMode={isDarkMode}
          />
          <Review
            name="David Lee"
            text="The platform's flexibility allowed me to learn at my own pace."
            isDarkMode={isDarkMode}
          />
          <Review
            name="Laura Martinez"
            text="I improved my skills significantly thanks to Learnly's resources."
            isDarkMode={isDarkMode}
          />
          <Review
            name="Chris Taylor"
            text="The engaging content and support made learning enjoyable."
            isDarkMode={isDarkMode}
          />
          <Review
            name="Anna Patel"
            text="Learnly helped me achieve my learning goals faster than expected!"
            isDarkMode={isDarkMode}
          />
        </div>
      </section>

      {/* Footer Section */}
      <Footer isDarkMode={isDarkMode} />

      {/* Get Started Popup */}
      <GetStartedPopup
        isDarkMode={isDarkMode}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Landing;