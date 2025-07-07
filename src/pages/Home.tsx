import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-black dark:bg-black light:bg-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-900/20 dark:from-purple-900/20 dark:via-black dark:to-purple-900/20 light:from-purple-100/30 light:via-white light:to-purple-100/30"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 dark:bg-purple-400 light:bg-purple-500 rounded-full opacity-30"
              animate={{
                y: [0, -20, -10, -30, 0],
                x: [0, 10, -10, 5, 0],
                rotate: [0, 90, 180, 270, 360],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: i * 1.2,
                ease: 'easeInOut',
              }}
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 20}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className="bg-gradient-to-r from-white via-purple-200 to-purple-400 dark:from-white dark:via-purple-200 dark:to-purple-400 light:from-gray-800 light:via-purple-600 light:to-purple-800 bg-clip-text text-transparent">
              Tech School
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-2xl md:text-3xl mb-12 text-gray-400 dark:text-gray-400 light:text-gray-600"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Showcasing Tomorrow's Innovators
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/portfolio">
              <motion.button
                className="inline-flex items-center px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 85, 247, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                View Portfolio
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;