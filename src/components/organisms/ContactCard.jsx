import React from "react";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { format } from "date-fns";

const ContactCard = ({ contact, onClick }) => {
  const getInitials = (name) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "No contact";
    return format(new Date(date), "MMM d, yyyy");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300"
        onClick={() => onClick(contact)}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
              {getInitials(contact.name)}
            </div>
            
            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 truncate">
                    {contact.name}
                  </h3>
                  {contact.company && (
                    <p className="text-sm text-secondary-600 truncate">
                      {contact.company}
                    </p>
                  )}
                </div>
                {contact.tags && contact.tags.length > 0 && (
                  <Badge variant="primary" size="sm">
                    {contact.tags[0]}
                  </Badge>
                )}
              </div>
              
              {/* Contact Details */}
<div className="space-y-1">
                {contact.job_title && (
                  <div className="flex items-center space-x-2 text-sm text-secondary-600 mb-2">
                    <ApperIcon name="Briefcase" size={14} />
                    <span className="font-medium">{contact.job_title}</span>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <ApperIcon name="Mail" size={14} />
                    <span className="truncate">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <ApperIcon name="Phone" size={14} />
                    <span>{contact.phone}</span>
                  </div>
                )}
                {contact.next_follow_up_date && (
                  <div className="flex items-center space-x-2 text-sm text-secondary-600">
                    <ApperIcon name="Calendar" size={14} />
                    <span>Follow up: {format(new Date(contact.next_follow_up_date), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>
              
              {/* Last Contact */}
              <div className="mt-3 pt-3 border-t border-secondary-100">
                <div className="flex items-center justify-between text-xs text-secondary-500">
                  <span>Last contact: {formatDate(contact.lastContact)}</span>
                  <ApperIcon name="ChevronRight" size={14} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContactCard;