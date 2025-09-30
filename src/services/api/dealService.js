import { toast } from "react-toastify";
import React from "react";

class DealService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
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
      return response.data.map(deal => ({
        Id: deal.Id,
        title: deal.title_c || '',
        contactId: deal.contact_id_c?.Id || null,
        value: parseFloat(deal.value_c) || 0,
        stage: deal.stage_c || 'Lead',
        probability: parseInt(deal.probability_c) || 10,
        expectedClose: deal.expected_close_c || null,
        notes: deal.notes_c || '',
        createdAt: deal.created_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching deals:", error?.response?.data?.message || error.message);
      toast.error("Failed to load deals");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "contact_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "value_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "probability_c"}},
          {"field": {"Name": "expected_close_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      // Map database fields to UI expected fields
      return {
        Id: response.data.Id,
        title: response.data.title_c || '',
        contactId: response.data.contact_id_c?.Id || null,
        value: parseFloat(response.data.value_c) || 0,
        stage: response.data.stage_c || 'Lead',
        probability: parseInt(response.data.probability_c) || 10,
        expectedClose: response.data.expected_close_c || null,
        notes: response.data.notes_c || '',
        createdAt: response.data.created_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching deal ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(dealData) {
    try {
      const params = {
        records: [{
          title_c: dealData.title || '',
          contact_id_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage || 'Lead',
          probability_c: parseInt(dealData.probability) || 10,
          expected_close_c: dealData.expectedClose || null,
          notes_c: dealData.notes || '',
          created_at_c: new Date().toISOString()
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
          console.error(`Failed to create deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          toast.success("Deal created successfully");
          return {
            Id: created.Id,
            title: created.title_c || '',
            contactId: created.contact_id_c?.Id || null,
            value: parseFloat(created.value_c) || 0,
            stage: created.stage_c || 'Lead',
            probability: parseInt(created.probability_c) || 10,
            expectedClose: created.expected_close_c || null,
            notes: created.notes_c || '',
            createdAt: created.created_at_c || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to create deal");
      return null;
    }
  }

  async update(id, dealData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          title_c: dealData.title || '',
          contact_id_c: dealData.contactId ? parseInt(dealData.contactId) : null,
          value_c: parseFloat(dealData.value) || 0,
          stage_c: dealData.stage || 'Lead',
          probability_c: parseInt(dealData.probability) || 10,
          expected_close_c: dealData.expectedClose || null,
          notes_c: dealData.notes || ''
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
          console.error(`Failed to update deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          toast.success("Deal updated successfully");
          return {
            Id: updated.Id,
            title: updated.title_c || '',
            contactId: updated.contact_id_c?.Id || null,
            value: parseFloat(updated.value_c) || 0,
            stage: updated.stage_c || 'Lead',
            probability: parseInt(updated.probability_c) || 10,
            expectedClose: updated.expected_close_c || null,
            notes: updated.notes_c || '',
            createdAt: updated.created_at_c || dealData.createdAt
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to update deal");
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
          console.error(`Failed to delete deal:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        if (successful.length > 0) {
          toast.success("Deal deleted successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting deal:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete deal");
      return false;
    }
  }
}

// Create an instance and export it
const dealService = new DealService();
export default dealService;