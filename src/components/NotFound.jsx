import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-emerald-500 to-teal-700 text-white text-center px-4">
      {/* Animated 404 Text */}
      <motion.h1
        className="text-9xl font-extrabold mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        404
      </motion.h1>

      {/* Subtitle */}
      <motion.h2
        className="text-2xl md:text-3xl font-semibold mb-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        Oops! Page not found 😢
      </motion.h2>

      {/* Description */}
      <motion.p
        className="mb-8 text-lg text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        The page you're looking for might have been removed, renamed, or is temporarily unavailable.
      </motion.p>

      {/* Back Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Link
          to="/"
          className="bg-white text-teal-700 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-teal-100 transition duration-300"
        >
          Go Back Home
        </Link>
      </motion.div>

      {/* Floating Animation */}
      <motion.div
        className="absolute bottom-10 text-white/50 text-sm"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        — CUSAP Community —
      </motion.div>
    </div>
  );
};

export default NotFound;
