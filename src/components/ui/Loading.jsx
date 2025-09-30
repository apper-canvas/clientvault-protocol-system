import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "contacts") {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-secondary-100 p-6 shadow-lg"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded animate-pulse w-1/2" />
              </div>
              <div className="w-20 h-8 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "deals") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border border-secondary-100 p-4 shadow-lg"
          >
            <div className="space-y-4">
              <div className="h-4 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded animate-pulse" />
              {[...Array(3)].map((_, j) => (
                <div key={j} className="bg-secondary-50 rounded-lg p-3">
                  <div className="space-y-2">
                    <div className="h-3 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded animate-pulse" />
                    <div className="h-2 bg-gradient-to-r from-secondary-200 to-secondary-300 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-secondary-200 animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-transparent border-t-primary-500 animate-spin"></div>
      </div>
    </div>
  );
};

export default Loading;