import React, { useState, useEffect } from "react";
import ContactCard from "@/components/organisms/ContactCard";
import ContactModal from "@/components/organisms/ContactModal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import contactService from "@/services/api/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTag, setFilterTag] = useState("all");

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    let filtered = contacts;
    
if (searchTerm) {
filtered = filtered.filter(contact => 
        (contact.name && contact.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.job_title && contact.job_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (contact.source && contact.source.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (filterTag !== "all") {
      filtered = filtered.filter(contact => 
        contact.tags && contact.tags.includes(filterTag)
      );
    }
    
    setFilteredContacts(filtered);
  }, [contacts, searchTerm, filterTag]);

  const handleAddContact = () => {
    setSelectedContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData);
        toast.success("Contact updated successfully!");
      } else {
        await contactService.create(contactData);
        toast.success("Contact created successfully!");
      }
      
      await loadContacts();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save contact");
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await contactService.delete(contactId);
      toast.success("Contact deleted successfully!");
      await loadContacts();
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  const getAllTags = () => {
    const tags = new Set();
contacts.forEach(contact => {
      if (contact.tags && Array.isArray(contact.tags)) {
        contact.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  if (loading) return <Loading type="contacts" />;
  if (error) return <Error message={error} onRetry={loadContacts} />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-secondary-900 to-secondary-700 bg-clip-text text-transparent">
            Contacts
          </h1>
          <p className="text-secondary-600 mt-1">
            Manage your customer relationships and contact information
          </p>
        </div>
        <Button variant="primary" onClick={handleAddContact}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts by name, company, or email..."
          />
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Badge
            variant={filterTag === "all" ? "primary" : "default"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setFilterTag("all")}
          >
            All ({contacts.length})
          </Badge>
          {getAllTags().map(tag => (
            <Badge
              key={tag}
              variant={filterTag === tag ? "primary" : "default"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setFilterTag(tag)}
            >
              {tag} ({contacts.filter(c => c.tags && c.tags.includes(tag)).length})
            </Badge>
          ))}
        </div>
      </div>

      {/* Contact List */}
      {filteredContacts.length === 0 ? (
        contacts.length === 0 ? (
          <Empty
            title="No contacts yet"
            description="Start building your customer relationships by adding your first contact."
            action={handleAddContact}
            actionLabel="Add First Contact"
            icon="Users"
          />
        ) : (
          <Empty
            title="No matching contacts"
            description="Try adjusting your search criteria or filters."
            icon="Search"
          />
        )
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ContactCard
                contact={contact}
                onClick={handleEditContact}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveContact}
        onDelete={handleDeleteContact}
      />
    </div>
  );
};

export default Contacts;