import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-8 border-t border-purple-500/20 dark:border-purple-500/20 light:border-purple-200"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
          © 2025 Haris & Co Tech School | Designed by Chemmu
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;