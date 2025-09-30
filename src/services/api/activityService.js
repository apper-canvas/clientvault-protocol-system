import { toast } from "react-toastify";
import React from "react";

class ActivityService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'activity_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "completed_c"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      // Map database fields to UI expected fields
      return response.data.map(activity => ({
        Id: activity.Id,
        contactId: activity.contact_id_c?.Id || null,
        dealId: activity.deal_id_c?.Id || null,
        type: activity.type_c || 'Call',
        description: activity.description_c || '',
        date: activity.date_c || new Date().toISOString(),
        completed: activity.completed_c || false
      }));
    } catch (error) {
      console.error("Error fetching activities:", error?.response?.data?.message || error.message);
      toast.error("Failed to load activities");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "deal_id_c"}, "referenceField": {"field": {"Name": "title_c"}}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "completed_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      // Map database fields to UI expected fields
      return {
        Id: response.data.Id,
        contactId: response.data.contact_id_c?.Id || null,
        dealId: response.data.deal_id_c?.Id || null,
        type: response.data.type_c || 'Call',
        description: response.data.description_c || '',
        date: response.data.date_c || new Date().toISOString(),
        completed: response.data.completed_c || false
      };
    } catch (error) {
      console.error(`Error fetching activity ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(activityData) {
    try {
      const params = {
        records: [{
          contact_id_c: activityData.contactId ? parseInt(activityData.contactId) : null,
          deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null,
          type_c: activityData.type || 'Call',
          description_c: activityData.description || '',
          date_c: activityData.date || new Date().toISOString(),
          completed_c: activityData.completed || false
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          toast.success("Activity created successfully");
          return {
            Id: created.Id,
            contactId: created.contact_id_c?.Id || null,
            dealId: created.deal_id_c?.Id || null,
            type: created.type_c || 'Call',
            description: created.description_c || '',
            date: created.date_c || new Date().toISOString(),
            completed: created.completed_c || false
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating activity:", error?.response?.data?.message || error.message);
      toast.error("Failed to create activity");
      return null;
    }
  }

  async update(id, activityData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          contact_id_c: activityData.contactId ? parseInt(activityData.contactId) : null,
          deal_id_c: activityData.dealId ? parseInt(activityData.dealId) : null,
          type_c: activityData.type || 'Call',
          description_c: activityData.description || '',
          date_c: activityData.date || new Date().toISOString(),
          completed_c: activityData.completed || false
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          toast.success("Activity updated successfully");
          return {
            Id: updated.Id,
            contactId: updated.contact_id_c?.Id || null,
            dealId: updated.deal_id_c?.Id || null,
            type: updated.type_c || 'Call',
            description: updated.description_c || '',
            date: updated.date_c || new Date().toISOString(),
            completed: updated.completed_c || false
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating activity:", error?.response?.data?.message || error.message);
      toast.error("Failed to update activity");
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete activity:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        if (successful.length > 0) {
          toast.success("Activity deleted successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting activity:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete activity");
      return false;
    }
  }
}

// Create an instance and export it
const activityService = new ActivityService();
export default activityService;