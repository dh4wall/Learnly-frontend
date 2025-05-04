import React from 'react';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`py-10 px-4 ${isDarkMode ? 'bg-gray-900' : 'bg-blue-100'} text-center`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
          <a href="/about" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>About</a>
          <a href="/contact" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>Contact</a>
          <a href="/privacy" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>Privacy Policy</a>
          <a href="/terms" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-blue-600 hover:text-blue-800'} transition-colors`}>Terms of Service</a>
        </div>
        <p className={`${isDarkMode ? 'text-gray-400' : 'text-blue-600'}`}>© 2025 Learnly. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;