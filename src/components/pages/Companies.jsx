import React, { useState, useEffect } from 'react';
import CompanyCard from '@/components/organisms/CompanyCard';
import CompanyModal from '@/components/organisms/CompanyModal';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import companyService from '@/services/api/companyService';

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Load companies on component mount
  useEffect(() => {
    loadCompanies();
  }, []);

  // Filter companies based on search term and tag
  useEffect(() => {
    let filtered = companies;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(company =>
        (company.name_c && company.name_c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.description_c && company.description_c.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company.city_c && company.city_c.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter(company => 
        company.Tags && company.Tags.includes(selectedTag)
      );
    }

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, selectedTag]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await companyService.getAll();
      setCompanies(data);
    } catch (err) {
      setError('Failed to load companies');
      console.error('Error loading companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setModalOpen(true);
  };

  const handleEditCompany = (company) => {
    setSelectedCompany(company);
    setModalOpen(true);
  };

  const handleSaveCompany = async (companyData) => {
    try {
      if (selectedCompany) {
        // Update existing company
        const updatedCompany = await companyService.update(selectedCompany.Id, companyData);
        setCompanies(prev => prev.map(c => c.Id === selectedCompany.Id ? updatedCompany : c));
        toast.success('Company updated successfully!');
      } else {
        // Create new company
        const newCompany = await companyService.create(companyData);
        setCompanies(prev => [newCompany, ...prev]);
        toast.success('Company created successfully!');
      }
      setModalOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      toast.error(error.message || 'Failed to save company');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await companyService.delete(companyId);
      setCompanies(prev => prev.filter(c => c.Id !== companyId));
      toast.success('Company deleted successfully!');
      setModalOpen(false);
      setSelectedCompany(null);
    } catch (error) {
      toast.error(error.message || 'Failed to delete company');
    }
  };

  // Get all unique tags from companies
  const getAllTags = () => {
    const tags = new Set();
    companies.forEach(company => {
      if (company.Tags && Array.isArray(company.Tags)) {
        company.Tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadCompanies} />;

  const allTags = getAllTags();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Companies</h1>
          <p className="text-secondary-600 mt-1">
            Manage your company database
          </p>
        </div>
        <Button onClick={handleAddCompany} size="lg">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Company
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search companies by name, description, or city..."
          />
        </div>
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-secondary-700 whitespace-nowrap">Filter by:</span>
            <Badge
              variant={selectedTag === "all" ? "primary" : "default"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => setSelectedTag("all")}
            >
              All ({companies.length})
            </Badge>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "primary" : "default"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => setSelectedTag(tag)}
              >
                {tag} ({companies.filter(c => c.Tags && c.Tags.includes(tag)).length})
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <Empty
          icon="Building"
          title="No companies found"
          message={companies.length === 0 
            ? "Get started by adding your first company" 
            : "Try adjusting your search or filter criteria"
          }
          action={companies.length === 0 ? {
            label: "Add Company",
            onClick: handleAddCompany
          } : undefined}
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCompanies.map((company, index) => (
            <motion.div
              key={company.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <CompanyCard
                company={company}
                onClick={() => handleEditCompany(company)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Company Modal */}
      <CompanyModal
        company={selectedCompany}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedCompany(null);
        }}
        onSave={handleSaveCompany}
        onDelete={handleDeleteCompany}
      />
    </div>
  );
}

export default Companies;