import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const ContactModal = ({ contact, isOpen, onClose, onSave, onDelete }) => {
const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    notes: "",
    tags: [],
    job_title: "",
    source: "",
    next_follow_up_date: "",
    linkedin_url: "",
    address: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (contact) {
setFormData({
        name: contact.name || "",
        company: contact.company || "",
        email: contact.email || "",
        phone: contact.phone || "",
        notes: contact.notes || "",
        tags: Array.isArray(contact.tags) ? contact.tags : [],
        job_title: contact.job_title || "",
        source: contact.source || "",
        next_follow_up_date: contact.next_follow_up_date || "",
        linkedin_url: contact.linkedin_url || "",
        address: contact.address || ""
      });
} else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        notes: "",
        tags: [],
        job_title: "",
        source: "",
        next_follow_up_date: "",
        linkedin_url: "",
        address: ""
      });
    }
    setErrors({});
  }, [contact]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      onDelete(contact.Id);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {contact ? "Edit Contact" : "Add New Contact"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              {contact && (
                <p className="text-sm text-secondary-600">
                  Created: {format(new Date(contact.createdAt), "MMM d, yyyy")}
                </p>
              )}
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    error={errors.name}
                    placeholder="John Smith"
                  />
                  
                  <FormField
                    label="Company"
                    value={formData.company}
                    onChange={(e) => handleChange("company", e.target.value)}
                    placeholder="Acme Corporation"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    error={errors.email}
                    placeholder="john@example.com"
                  />
                  
                  <FormField
                    label="Phone Number"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Job Title"
                    value={formData.job_title}
                    onChange={(e) => handleChange("job_title", e.target.value)}
                    placeholder="Senior Developer, Marketing Manager..."
                  />
                  
                  <FormField
                    label="Source"
                    value={formData.source}
                    onChange={(e) => handleChange("source", e.target.value)}
                    placeholder="LinkedIn, Referral, Website..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Next Follow Up Date"
                    type="date"
                    value={formData.next_follow_up_date}
                    onChange={(e) => handleChange("next_follow_up_date", e.target.value)}
                  />
                  
                  <FormField
                    label="LinkedIn URL"
                    value={formData.linkedin_url}
                    onChange={(e) => handleChange("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <FormField
                  label="Address"
                  component="textarea"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Street address, city, state, country..."
                />

                <FormField
                  label="Notes"
                  component="textarea"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Additional notes about this contact..."
                />

                <div className="flex justify-between pt-6 border-t border-secondary-100">
                  <div className="flex space-x-3">
                    {contact && (
                      <Button
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
                      variant="secondary"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSave}
                    >
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {contact ? "Update" : "Create"} Contact
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ContactModal;