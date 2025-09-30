import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const DealModal = ({ deal, contacts, isOpen, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
title: "",
    contactId: "",
    value: "",
    stage: "Lead",
    probability: "10",
    expectedClose: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

  useEffect(() => {
if (deal) {
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        value: deal.value?.toString() || "",
        stage: deal.stage || "Lead",
        probability: deal.probability?.toString() || "10",
        expectedClose: deal.expectedClose ? format(new Date(deal.expectedClose), "yyyy-MM-dd") : "",
        notes: deal.notes || ""
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        value: "",
        stage: "Lead",
        probability: "10",
        expectedClose: "",
        notes: ""
      });
    }
    setErrors({});
  }, [deal]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Deal title is required";
    if (!formData.contactId) newErrors.contactId = "Contact is required";
    if (!formData.value || isNaN(formData.value)) newErrors.value = "Valid deal value is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      const dealData = {
        ...formData,
value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability) || 10,
        expectedClose: formData.expectedClose ? new Date(formData.expectedClose).toISOString() : null
      };
      onSave(dealData);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this deal?")) {
      onDelete(deal.Id);
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
                  {deal ? "Edit Deal" : "Add New Deal"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              {deal && (
                <p className="text-sm text-secondary-600">
                  Created: {format(new Date(deal.createdAt), "MMM d, yyyy")}
                </p>
              )}
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <FormField
                  label="Deal Title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  error={errors.title}
                  placeholder="Enterprise Software License"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Contact"
                    component="select"
                    value={formData.contactId}
                    onChange={(e) => handleChange("contactId", e.target.value)}
                    error={errors.contactId}
                  >
                    <option value="">Select a contact</option>
                    {contacts.map(contact => (
                      <option key={contact.Id} value={contact.Id}>
                        {contact.name} - {contact.company}
                      </option>
                    ))}
                  </FormField>

                  <FormField
                    label="Deal Value"
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleChange("value", e.target.value)}
                    error={errors.value}
                    placeholder="10000"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Stage"
                    component="select"
                    value={formData.stage}
                    onChange={(e) => handleChange("stage", e.target.value)}
                  >
                    {stages.map(stage => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </FormField>

                  <FormField
                    label="Probability (%)"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.probability}
                    onChange={(e) => handleChange("probability", e.target.value)}
                    placeholder="50"
                  />
                </div>

                <FormField
                  label="Expected Close Date"
                  type="date"
                  value={formData.expectedClose}
                  onChange={(e) => handleChange("expectedClose", e.target.value)}
                />

                <FormField
                  label="Notes"
                  component="textarea"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Deal details, requirements, next steps..."
                />

                <div className="flex justify-between pt-6 border-t border-secondary-100">
                  <div className="flex space-x-3">
                    {deal && (
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
                      {deal ? "Update" : "Create"} Deal
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

export default DealModal;