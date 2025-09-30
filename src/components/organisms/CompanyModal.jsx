import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import ApperIcon from '@/components/ApperIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

function CompanyModal({ company, isOpen, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    name_c: "",
    description_c: "",
    address_c: "",
    city_c: "",
    state_c: "",
    zip_code_c: "",
    phone_c: "",
    Tags: []
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when company changes
  useEffect(() => {
    if (company) {
      setFormData({
        name_c: company.name_c || "",
        description_c: company.description_c || "",
        address_c: company.address_c || "",
        city_c: company.city_c || "",
        state_c: company.state_c || "",
        zip_code_c: company.zip_code_c || "",
        phone_c: company.phone_c || "",
        Tags: Array.isArray(company.Tags) ? company.Tags : []
      });
    } else {
      setFormData({
        name_c: "",
        description_c: "",
        address_c: "",
        city_c: "",
        state_c: "",
        zip_code_c: "",
        phone_c: "",
        Tags: []
      });
    }
    setErrors({});
  }, [company]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name_c.trim()) newErrors.name_c = "Company name is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      onDelete(company.Id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card className="shadow-2xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {company ? "Edit Company" : "Add New Company"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              {company && (
                <p className="text-sm text-secondary-600">
                  Created: {format(new Date(company.CreatedOn), "MMM d, yyyy")}
                </p>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                {/* Company Name */}
                <FormField
                  label="Company Name"
                  value={formData.name_c}
                  onChange={(e) => handleChange("name_c", e.target.value)}
                  error={errors.name_c}
                  placeholder="Acme Corporation"
                />

                {/* Description */}
                <FormField
                  label="Description"
                  component="textarea"
                  value={formData.description_c}
                  onChange={(e) => handleChange("description_c", e.target.value)}
                  placeholder="Brief description of the company..."
                />

                {/* Address Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      label="Street Address"
                      value={formData.address_c}
                      onChange={(e) => handleChange("address_c", e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <FormField
                    label="City"
                    value={formData.city_c}
                    onChange={(e) => handleChange("city_c", e.target.value)}
                    placeholder="New York"
                  />
                  
                  <FormField
                    label="State"
                    value={formData.state_c}
                    onChange={(e) => handleChange("state_c", e.target.value)}
                    placeholder="NY"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Zip Code"
                    value={formData.zip_code_c}
                    onChange={(e) => handleChange("zip_code_c", e.target.value)}
                    placeholder="10001"
                  />
                  
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={formData.phone_c}
                    onChange={(e) => handleChange("phone_c", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
                  <div>
                    {company && (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={handleDelete}
                      >
                        <ApperIcon name="Trash2" size={16} className="mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={onClose}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                    >
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {isSubmitting ? 'Saving...' : company ? "Update" : "Create"} Company
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default CompanyModal;