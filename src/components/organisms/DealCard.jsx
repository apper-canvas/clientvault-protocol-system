import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { format } from "date-fns";

const DealCard = ({ deal, contact, onClick, onDragStart }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "success";
    if (probability >= 60) return "accent";
    if (probability >= 40) return "warning";
    return "default";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      draggable
      onDragStart={() => onDragStart(deal)}
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={() => onClick(deal)}
      >
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Deal Title & Value */}
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-secondary-900 text-sm truncate flex-1 mr-2">
                {deal.title}
              </h3>
              <span className="text-lg font-bold bg-gradient-to-r from-accent-600 to-accent-700 bg-clip-text text-transparent">
                {formatCurrency(deal.value)}
              </span>
            </div>

            {/* Contact Info */}
            {contact && (
              <div className="flex items-center space-x-2 text-sm text-secondary-600">
                <ApperIcon name="User" size={14} />
                <span className="truncate">{contact.name}</span>
              </div>
            )}

            {/* Probability */}
            <div className="flex items-center justify-between">
              <Badge 
                variant={getProbabilityColor(deal.probability)} 
                size="sm"
              >
                {deal.probability}% probability
              </Badge>
              <ApperIcon name="MoreVertical" size={14} className="text-secondary-400" />
            </div>

            {/* Expected Close Date */}
            {deal.expectedClose && (
              <div className="flex items-center space-x-2 text-xs text-secondary-500">
                <ApperIcon name="Calendar" size={12} />
                <span>Close: {format(new Date(deal.expectedClose), "MMM d")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DealCard;