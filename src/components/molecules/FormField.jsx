import React from "react";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";

const FormField = ({ 
  label, 
  error, 
  type = "text", 
  component = "input",
  children,
  className = "",
  ...props 
}) => {
  const Component = component === "textarea" ? Textarea : 
                   component === "select" ? Select : Input;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          {label}
        </label>
      )}
      <Component
        type={type}
        error={error}
        {...props}
      >
        {children}
      </Component>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

export default FormField;