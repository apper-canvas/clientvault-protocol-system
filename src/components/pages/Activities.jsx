import React, { useState, useEffect } from "react";
import ActivityModal from "@/components/organisms/ActivityModal";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { Card, CardContent } from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import SearchBar from "@/components/molecules/SearchBar";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import activityService from "@/services/api/activityService";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
      setFilteredActivities(activitiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let filtered = activities;
    
    if (searchTerm) {
      filtered = filtered.filter(activity => 
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== "all") {
      filtered = filtered.filter(activity => activity.type === filterType);
    }
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(activity => 
        filterStatus === "completed" ? activity.completed : !activity.completed
      );
    }
    
    setFilteredActivities(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
  }, [activities, searchTerm, filterType, filterStatus]);

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setIsModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveActivity = async (activityData) => {
    try {
      if (selectedActivity) {
        await activityService.update(selectedActivity.Id, activityData);
        toast.success("Activity updated successfully!");
      } else {
        await activityService.create(activityData);
        toast.success("Activity logged successfully!");
      }
      
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save activity");
    }
  };

  const toggleActivityComplete = async (activity) => {
    try {
      await activityService.update(activity.Id, {
        ...activity,
        completed: !activity.completed
      });
      toast.success(`Activity marked as ${!activity.completed ? 'completed' : 'pending'}`);
      await loadData();
    } catch (err) {
      toast.error("Failed to update activity");
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      "Call": "Phone",
      "Email": "Mail",
      "Meeting": "Users",
      "Note": "FileText",
      "Task": "CheckSquare"
    };
    return icons[type] || "Activity";
  };

  const getActivityTypes = () => {
    return [...new Set(activities.map(activity => activity.type))];
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
            Activities
          </h1>
          <p className="text-secondary-600 mt-1">
            Track all your customer interactions and scheduled tasks
          </p>
        </div>
        <Button variant="primary" onClick={handleAddActivity}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Log Activity
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search activities by description or type..."
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-secondary-600">Filters:</span>
          
          <Badge
            variant={filterStatus === "all" ? "primary" : "default"}
            className="cursor-pointer"
            onClick={() => setFilterStatus("all")}
          >
            All
          </Badge>
          <Badge
            variant={filterStatus === "pending" ? "primary" : "default"}
            className="cursor-pointer"
            onClick={() => setFilterStatus("pending")}
          >
            Pending
          </Badge>
          <Badge
            variant={filterStatus === "completed" ? "primary" : "default"}
            className="cursor-pointer"
            onClick={() => setFilterStatus("completed")}
          >
            Completed
          </Badge>
          
          <div className="w-px h-4 bg-secondary-300 mx-2" />
          
          <Badge
            variant={filterType === "all" ? "primary" : "default"}
            className="cursor-pointer"
            onClick={() => setFilterType("all")}
          >
            All Types
          </Badge>
          {getActivityTypes().map(type => (
            <Badge
              key={type}
              variant={filterType === type ? "primary" : "default"}
              className="cursor-pointer"
              onClick={() => setFilterType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        activities.length === 0 ? (
          <Empty
            title="No activities logged"
            description="Start tracking your customer interactions and tasks."
            action={handleAddActivity}
            actionLabel="Log First Activity"
            icon="Activity"
          />
        ) : (
          <Empty
            title="No matching activities"
            description="Try adjusting your search criteria or filters."
            icon="Search"
          />
        )
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => {
            const contact = contacts.find(c => c.Id === activity.contactId);
            const deal = deals.find(d => d.Id === activity.dealId);
            
            return (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Activity Icon */}
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        activity.completed 
                          ? "bg-gradient-to-r from-green-500 to-green-600" 
                          : "bg-gradient-to-r from-primary-500 to-primary-600"
                      }`}>
                        <ApperIcon 
                          name={getActivityIcon(activity.type)} 
                          size={20} 
                          className="text-white" 
                        />
                      </div>
                      
                      {/* Activity Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-secondary-900">
                              {activity.type} - {activity.description}
                            </h3>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-secondary-600">
                              {contact && (
                                <span className="flex items-center space-x-1">
                                  <ApperIcon name="User" size={14} />
                                  <span>{contact.name}</span>
                                </span>
                              )}
                              {deal && (
                                <span className="flex items-center space-x-1">
                                  <ApperIcon name="TrendingUp" size={14} />
                                  <span>{deal.title}</span>
                                </span>
                              )}
                              <span className="flex items-center space-x-1">
                                <ApperIcon name="Calendar" size={14} />
                                <span>{format(new Date(activity.date), "MMM d, yyyy 'at' h:mm a")}</span>
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={activity.completed ? "success" : "warning"}
                              size="sm"
                            >
                              {activity.completed ? "Completed" : "Pending"}
                            </Badge>
                            <Badge variant="default" size="sm">
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActivityComplete(activity)}
                        >
                          <ApperIcon 
                            name={activity.completed ? "RotateCcw" : "Check"} 
                            size={16} 
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditActivity(activity)}
                        >
                          <ApperIcon name="Edit" size={16} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Activity Modal */}
      <ActivityModal
        activity={selectedActivity}
        contacts={contacts}
        deals={deals}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveActivity}
      />
    </div>
  );
};

export default Activities;