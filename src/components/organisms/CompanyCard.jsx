import React from 'react';
import { Card, CardContent } from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

function CompanyCard({ company, onClick }) {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-xl transition-all duration-300 h-full"
        onClick={() => onClick(company)}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            {/* Company Avatar */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {getInitials(company.name_c)}
              </div>
            </div>
            
            {/* Company Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-secondary-900 truncate">
                    {company.name_c || 'Unnamed Company'}
                  </h3>
                  {company.city_c && company.state_c && (
                    <p className="text-sm text-secondary-600 truncate mt-1">
                      {company.city_c}, {company.state_c}
                    </p>
                  )}
                  {company.description_c && (
                    <p className="text-sm text-secondary-500 mt-2 line-clamp-2">
                      {company.description_c}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Tags */}
              {company.Tags && company.Tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {company.Tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="primary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                  {company.Tags.length > 3 && (
                    <Badge variant="default" size="sm">
                      +{company.Tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              {/* Contact Info */}
              <div className="flex flex-col space-y-1 mt-3">
                {company.phone_c && (
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Phone" size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{company.phone_c}</span>
                  </div>
                )}
                {company.address_c && (
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="MapPin" size={14} className="mr-2 flex-shrink-0" />
                    <span className="truncate">{company.address_c}</span>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary-100">
                <span className="text-xs text-secondary-500">
                  Created {formatDate(company.CreatedOn)}
                </span>
                <ApperIcon 
                  name="ChevronRight" 
                  size={16} 
                  className="text-secondary-400 group-hover:text-secondary-600 transition-colors" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default CompanyCard;