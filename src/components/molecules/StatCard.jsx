import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const StatCard = ({ title, value, change, icon, color = "primary" }) => {
  const colors = {
    primary: "from-primary-500 to-primary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600 mb-1">
                {title}
              </p>
              <p className="text-2xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
                {value}
              </p>
              {change && (
                <p className={`text-xs mt-1 ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {change}
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colors[color]} flex items-center justify-center`}>
              <ApperIcon name={icon} size={20} className="text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;