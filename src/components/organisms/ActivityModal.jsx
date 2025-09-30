import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { motion, AnimatePresence } from "framer-motion";

const ActivityModal = ({ activity, contacts, deals, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    contactId: "",
    dealId: "",
    type: "Call",
    description: "",
    date: "",
    completed: false
  });

  const activityTypes = ["Call", "Email", "Meeting", "Note", "Task"];

  useEffect(() => {
    if (activity) {
      setFormData({
        contactId: activity.contactId || "",
        dealId: activity.dealId || "",
        type: activity.type || "Call",
        description: activity.description || "",
        date: activity.date ? new Date(activity.date).toISOString().slice(0, 16) : "",
        completed: activity.completed || false
      });
    } else {
      const now = new Date();
      setFormData({
        contactId: "",
        dealId: "",
        type: "Call",
        description: "",
        date: now.toISOString().slice(0, 16),
        completed: false
      });
    }
  }, [activity]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.contactId || !formData.description.trim()) return;

    const activityData = {
      ...formData,
      date: new Date(formData.date).toISOString()
    };
    onSave(activityData);
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
          className="w-full max-w-xl"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {activity ? "Edit Activity" : "Log New Activity"}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <FormField
                  label="Contact"
                  component="select"
                  value={formData.contactId}
                  onChange={(e) => handleChange("contactId", e.target.value)}
                >
                  <option value="">Select a contact</option>
                  {contacts.map(contact => (
                    <option key={contact.Id} value={contact.Id}>
                      {contact.name} - {contact.company}
                    </option>
                  ))}
                </FormField>

                <FormField
                  label="Related Deal (Optional)"
                  component="select"
                  value={formData.dealId}
                  onChange={(e) => handleChange("dealId", e.target.value)}
                >
                  <option value="">No related deal</option>
                  {deals.map(deal => (
                    <option key={deal.Id} value={deal.Id}>
                      {deal.title}
                    </option>
                  ))}
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Activity Type"
                    component="select"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                  >
                    {activityTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </FormField>

                  <FormField
                    label="Date & Time"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                  />
                </div>

                <FormField
                  label="Description"
                  component="textarea"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="What happened during this interaction?"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={formData.completed}
                    onChange={(e) => handleChange("completed", e.target.checked)}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="completed" className="text-sm text-secondary-700">
                    Mark as completed
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={!formData.contactId || !formData.description.trim()}
                  >
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActivityModal;