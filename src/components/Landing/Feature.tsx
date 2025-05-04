import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface FeatureProps {
  title: string;
  description: string;
  icon: string;
  index: number;
  isDarkMode: boolean;
}

const Feature: React.FC<FeatureProps> = ({ title, description, icon, index, isDarkMode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} transform hover:scale-105 transition-transform duration-300`}
    >
      <div className="flex items-center mb-4">
        <span className="text-3xl mr-3">{icon}</span>
        <h3 className="text-2xl font-bold">{title}</h3>
      </div>
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{description}</p>
    </motion.div>
  );
};

export default Feature;