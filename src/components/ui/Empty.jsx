import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { motion } from "framer-motion";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  action,
  actionLabel = "Add Item",
  icon = "Database"
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-secondary-100 to-secondary-200 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} size={32} className="text-secondary-500" />
      </div>
      <h3 className="text-lg font-semibold text-secondary-900 mb-2">
        {title}
      </h3>
      <p className="text-secondary-600 mb-6 max-w-md">
        {description}
      </p>
      {action && (
        <Button onClick={action} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;