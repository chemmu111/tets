import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
        <motion.div
          className="absolute inset-2 w-8 h-8 border-2 border-purple-300/50 border-b-purple-300 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;