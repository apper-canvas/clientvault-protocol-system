import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const userState = useSelector((state) => state.user);
  const userProfile = userState?.user?.profile || '';
  const location = useLocation();
  
  const navItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: "LayoutDashboard",
      description: "Overview & metrics"
    },
    { 
      path: "/contacts", 
      label: "Contacts", 
      icon: "Users",
      description: "Manage customers"
    },
    { 
path: "/deals", 
      label: "Deals", 
      icon: "TrendingUp",
      description: "Sales pipeline",
      hideForProfiles: ['User']
    },
{ 
      path: "/companies", 
      label: "Companies", 
      icon: "Building",
      description: "Manage companies"
    },
    { 
      path: "/activities", 
      label: "Activities", 
      icon: "Calendar",
      description: "Track interactions"
    }
];

  const filteredNavItems = navItems.filter(item => 
    !item.hideForProfiles || !item.hideForProfiles.includes(userProfile)
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
              ClientVault
            </h1>
            <p className="text-xs text-secondary-500">Customer Relations</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <NavLink
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                      ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" 
                      : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-white/20" 
                      : "bg-secondary-100 group-hover:bg-secondary-200"
                  }`}>
                    <ApperIcon 
                      name={item.icon} 
                      size={18} 
                      className={isActive ? "text-white" : "text-secondary-600 group-hover:text-secondary-900"} 
                    />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium text-sm ${
                      isActive ? "text-white" : "text-secondary-900"
                    }`}>
                      {item.label}
                    </div>
                    <div className={`text-xs ${
                      isActive ? "text-white/80" : "text-secondary-500"
                    }`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded-full"
                    />
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-secondary-100 bg-gradient-to-t from-secondary-50 to-transparent">
          <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={14} className="text-white" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-accent-800">Quick Add</h4>
                <p className="text-xs text-accent-600">Ctrl + N for new contact</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="lg:hidden fixed top-0 left-0 w-80 h-full z-50"
          >
            <div className="h-full bg-white border-r border-secondary-100 shadow-xl">
              {/* Header */}
              <div className="p-6 border-b border-secondary-100">
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                    ClientVault
                  </h1>
                  <p className="text-xs text-secondary-500">Customer Relations</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {filteredNavItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <NavLink
                        to={item.path}
                        onClick={onClose}
                        className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg" 
                            : "text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900"
                        }`}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? "bg-white/20" 
                            : "bg-secondary-100 group-hover:bg-secondary-200"
                        }`}>
                          <ApperIcon 
                            name={item.icon} 
                            size={18} 
                            className={isActive ? "text-white" : "text-secondary-600 group-hover:text-secondary-900"} 
                          />
                        </div>
                        <div className="flex-1">
                          <div className={`font-medium text-sm ${
                            isActive ? "text-white" : "text-secondary-900"
                          }`}>
                            {item.label}
                          </div>
                          <div className={`text-xs ${
                            isActive ? "text-white/80" : "text-secondary-500"
                          }`}>
                            {item.description}
                          </div>
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </NavLink>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-100 bg-gradient-to-t from-secondary-50 to-transparent">
                <div className="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Zap" size={14} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-accent-800">Quick Add</h4>
                      <p className="text-xs text-accent-600">Ctrl + N for new contact</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default Sidebar;