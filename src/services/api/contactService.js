import { toast } from "react-toastify";
import React from "react";

class ContactService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'contact_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_contact_c"}}
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
      return response.data.map(contact => ({
        Id: contact.Id,
        name: contact.name_c || '',
        company: contact.company_c || '',
        email: contact.email_c || '',
        phone: contact.phone_c || '',
        notes: contact.notes_c || '',
        tags: contact.tags_c ? contact.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        createdAt: contact.created_at_c || new Date().toISOString(),
        lastContact: contact.last_contact_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error?.response?.data?.message || error.message);
      toast.error("Failed to load contacts");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "company_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "tags_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "last_contact_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.data) {
        return null;
      }

      // Map database fields to UI expected fields
      return {
        Id: response.data.Id,
        name: response.data.name_c || '',
        company: response.data.company_c || '',
        email: response.data.email_c || '',
        phone: response.data.phone_c || '',
        notes: response.data.notes_c || '',
        tags: response.data.tags_c ? response.data.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        createdAt: response.data.created_at_c || new Date().toISOString(),
        lastContact: response.data.last_contact_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching contact ${id}:`, error?.response?.data?.message || error.message);
      return null;
    }
  }

  async create(contactData) {
    try {
      const params = {
        records: [{
          name_c: contactData.name || '',
          company_c: contactData.company || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          notes_c: contactData.notes || '',
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ''),
          created_at_c: new Date().toISOString(),
          last_contact_c: new Date().toISOString()
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
          console.error(`Failed to create contact:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          const created = successful[0].data;
          toast.success("Contact created successfully");
          return {
            Id: created.Id,
            name: created.name_c || '',
            company: created.company_c || '',
            email: created.email_c || '',
            phone: created.phone_c || '',
            notes: created.notes_c || '',
            tags: created.tags_c ? created.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            createdAt: created.created_at_c || new Date().toISOString(),
            lastContact: created.last_contact_c || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error creating contact:", error?.response?.data?.message || error.message);
      toast.error("Failed to create contact");
      return null;
    }
  }

  async update(id, contactData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          name_c: contactData.name || '',
          company_c: contactData.company || '',
          email_c: contactData.email || '',
          phone_c: contactData.phone || '',
          notes_c: contactData.notes || '',
          tags_c: Array.isArray(contactData.tags) ? contactData.tags.join(',') : (contactData.tags || ''),
          last_contact_c: new Date().toISOString()
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
          console.error(`Failed to update contact:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return null;
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data;
          toast.success("Contact updated successfully");
          return {
            Id: updated.Id,
            name: updated.name_c || '',
            company: updated.company_c || '',
            email: updated.email_c || '',
            phone: updated.phone_c || '',
            notes: updated.notes_c || '',
            tags: updated.tags_c ? updated.tags_c.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            createdAt: updated.created_at_c || contactData.createdAt,
            lastContact: updated.last_contact_c || new Date().toISOString()
          };
        }
      }
      return null;
    } catch (error) {
      console.error("Error updating contact:", error?.response?.data?.message || error.message);
      toast.error("Failed to update contact");
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
          console.error(`Failed to delete contact:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }
        
        if (successful.length > 0) {
          toast.success("Contact deleted successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting contact:", error?.response?.data?.message || error.message);
      toast.error("Failed to delete contact");
      return false;
    }
  }
}

// Create an instance and export it
const contactService = new ContactService();
export default contactService;