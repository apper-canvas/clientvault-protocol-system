import React, { useState, useEffect } from "react";
import DealCard from "@/components/organisms/DealCard";
import DealModal from "@/components/organisms/DealModal";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import dealService from "@/services/api/dealService";
import contactService from "@/services/api/contactService";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedDeal, setDraggedDeal] = useState(null);

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        await dealService.update(selectedDeal.Id, dealData);
        toast.success("Deal updated successfully!");
      } else {
        await dealService.create(dealData);
        toast.success("Deal created successfully!");
      }
      
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save deal");
    }
  };

  const handleDeleteDeal = async (dealId) => {
    try {
      await dealService.delete(dealId);
      toast.success("Deal deleted successfully!");
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete deal");
    }
  };

  const handleDragStart = (deal) => {
    setDraggedDeal(deal);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== newStage) {
      try {
        await dealService.update(draggedDeal.Id, { ...draggedDeal, stage: newStage });
        toast.success(`Deal moved to ${newStage}`);
        await loadData();
      } catch (err) {
        toast.error("Failed to update deal stage");
      }
    }
    setDraggedDeal(null);
  };

  const getStageDeals = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stage) => {
    return getStageDeals(stage).reduce((sum, deal) => sum + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return <Loading type="deals" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
            Sales Pipeline
          </h1>
          <p className="text-secondary-600 mt-1">
            Track and manage your deals through the sales process
          </p>
        </div>
        <Button variant="primary" onClick={handleAddDeal}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Deal
        </Button>
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stages.map((stage) => {
          const stageDeals = getStageDeals(stage);
          const stageValue = getStageValue(stage);
          
          return (
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-secondary-50 rounded-xl p-4 border border-secondary-100"
            >
              <h3 className="text-sm font-medium text-secondary-600 mb-2">{stage}</h3>
              <p className="text-2xl font-bold text-secondary-900">{stageDeals.length}</p>
              <p className="text-sm font-medium text-accent-600">{formatCurrency(stageValue)}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline Board */}
      {deals.length === 0 ? (
        <Empty
          title="No deals in pipeline"
          description="Start tracking your sales opportunities by creating your first deal."
          action={handleAddDeal}
          actionLabel="Add First Deal"
          icon="TrendingUp"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 overflow-x-auto">
          {stages.map((stage) => {
            const stageDeals = getStageDeals(stage);
            
            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="min-w-[300px]"
              >
                <Card
                  className="h-full"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-secondary-700">
                        {stage}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-secondary-100 text-secondary-600 px-2 py-1 rounded-full">
                          {stageDeals.length}
                        </span>
                        <span className="text-xs text-accent-600 font-medium">
                          {formatCurrency(getStageValue(stage))}
                        </span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {stageDeals.length === 0 ? (
                      <div className="text-center py-8 text-secondary-400">
                        <ApperIcon name="Plus" size={24} className="mx-auto mb-2" />
                        <p className="text-sm">No deals</p>
                      </div>
                    ) : (
                      stageDeals.map((deal) => {
const contact = contacts.find(c => c.Id === deal.contactId);
                        return (
                          <DealCard
                            key={deal.Id}
                            deal={deal}
                            contact={contact}
                            onClick={handleEditDeal}
                            onDragStart={handleDragStart}
                          />
                        );
                      })
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Deal Modal */}
      <DealModal
        deal={selectedDeal}
        contacts={contacts}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveDeal}
        onDelete={handleDeleteDeal}
      />
    </div>
  );
};

export default Deals;