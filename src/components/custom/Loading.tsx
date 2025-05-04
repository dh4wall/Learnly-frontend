import React from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-2xl z-10"
    >
      <DotLottieReact
        src="https://lottie.host/e8947cff-81ff-45a0-83ba-98ccc38b4933/sygnZPJx9p.lottie"
        loop
        autoplay
        className="w-32 h-32"
      />
    </motion.div>
  );
};

export default Loading;