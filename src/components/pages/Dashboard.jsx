import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { motion } from "framer-motion";
import { format } from "date-fns";
import contactService from "@/services/api/contactService";
import dealService from "@/services/api/dealService";
import activityService from "@/services/api/activityService";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalPipelineValue = deals
.filter(deal => !["Closed Lost", "Closed Won"].includes(deal.stage))
    .reduce((sum, deal) => sum + (deal.value || 0), 0);

  const activeDeals = deals.filter(deal => 
    !["Closed Lost", "Closed Won"].includes(deal.stage)
  ).length;

  const recentActivities = activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const upcomingTasks = activities
    .filter(activity => !activity.completed && new Date(activity.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-secondary-600 mt-1">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        <Button variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Contacts"
            value={contacts.length}
            change="+12%"
            icon="Users"
            color="primary"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Deals"
            value={activeDeals}
            change="+8%"
            icon="TrendingUp"
            color="accent"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Pipeline Value"
            value={formatCurrency(totalPipelineValue)}
            change="+23%"
            icon="DollarSign"
            color="success"
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="This Month"
            value={activities.filter(a => 
              new Date(a.date).getMonth() === new Date().getMonth()
            ).length}
            change="+15%"
            icon="Activity"
            color="warning"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Activity" size={20} />
                  <span>Recent Activities</span>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities.length === 0 ? (
                <Empty
                  title="No recent activities"
                  description="Start logging interactions with your contacts"
                  icon="Activity"
                />
              ) : (
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
const contact = contacts.find(c => c.Id === activity.contactId);
                    return (
                      <div key={activity.Id} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <ApperIcon name={getActivityIcon(activity.type)} size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 truncate">
{activity.type} with {contact?.name || "Unknown Contact"}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {format(new Date(activity.date), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <ApperIcon name="Clock" size={20} />
                  <span>Upcoming Tasks</span>
                </CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <Empty
                  title="No upcoming tasks"
                  description="You're all caught up! Schedule some follow-ups."
                  icon="CheckCircle"
                />
              ) : (
                <div className="space-y-4">
                  {upcomingTasks.map((task) => {
const contact = contacts.find(c => c.Id === task.contactId);
                    return (
                      <div key={task.Id} className="flex items-center space-x-3 p-3 bg-accent-50 rounded-lg">
                        <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                          <ApperIcon name={getActivityIcon(task.type)} size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-secondary-900 truncate">
{task.description}
                          </p>
                          <p className="text-xs text-secondary-500">
                            {contact?.name} • {format(new Date(task.date), "MMM d, h:mm a")}
                          </p>
                        </div>
                        <ApperIcon name="ChevronRight" size={14} className="text-secondary-400" />
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="BarChart3" size={20} />
              <span>Pipeline Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"].map((stage) => {
const stageDeals = deals.filter(deal => deal.stage === stage);
                const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
                
                return (
                  <div key={stage} className="text-center p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-lg">
                    <h4 className="text-sm font-medium text-secondary-600 mb-2">{stage}</h4>
                    <p className="text-2xl font-bold text-secondary-900">{stageDeals.length}</p>
                    <p className="text-xs text-secondary-500">{formatCurrency(stageValue)}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;