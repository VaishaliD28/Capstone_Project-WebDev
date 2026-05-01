import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Build a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Professional Resume</span> in Minutes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
          Stand out from the crowd with our modern, customizable, and drag-and-drop resume builder.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/signup" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
            Get Started for Free
          </Link>
          <Link to="/login" className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg font-semibold rounded-lg shadow transition-all">
            Log In
          </Link>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <div className="bg-gray-100 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 aspect-[16/9] flex items-center justify-center relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"></div>
           <div className="relative z-10 text-center">
             <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-600">Interactive Editor Preview</h3>
             <p className="text-gray-400 dark:text-gray-600 mt-2">Sign in to experience the drag & drop editor with live preview.</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
