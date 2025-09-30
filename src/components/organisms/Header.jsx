import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuToggle, title }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-secondary-100 px-6 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          {title && (
            <h1 className="text-xl font-semibold text-secondary-900">
              {title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm">
            <ApperIcon name="Bell" size={18} />
          </Button>
          <Button variant="ghost" size="sm">
            <ApperIcon name="Settings" size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;