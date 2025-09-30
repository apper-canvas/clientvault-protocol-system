import React, { useEffect, useState } from 'react';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';
import { activityService } from '@/services/api/activityService';
import { companyService } from '@/services/api/companyService';
import StatCard from '@/components/molecules/StatCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch data from all services in parallel
      const [contacts, deals, activities, companies] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
        companyService.getAll()
      ]);

      // Calculate statistics
      const totalContacts = contacts?.length || 0;
      const totalDeals = deals?.length || 0;
      const totalActivities = activities?.length || 0;
      const totalCompanies = companies?.length || 0;

      // Calculate recent additions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentContacts = contacts?.filter(c => 
        new Date(c.CreatedDate) > thirtyDaysAgo
      ).length || 0;

      const recentDeals = deals?.filter(d => 
        new Date(d.CreatedDate) > thirtyDaysAgo
      ).length || 0;

      const recentActivities = activities?.filter(a => 
        new Date(a.CreatedDate) > thirtyDaysAgo
      ).length || 0;

      const recentCompanies = companies?.filter(c => 
        new Date(c.CreatedDate) > thirtyDaysAgo
      ).length || 0;

      // Calculate deal values
      const totalDealValue = deals?.reduce((sum, deal) => {
        const value = parseFloat(deal.deal_value_c) || 0;
        return sum + value;
      }, 0) || 0;

      const wonDeals = deals?.filter(d => d.deal_status_c === 'Won').length || 0;
      const wonDealValue = deals?.filter(d => d.deal_status_c === 'Won')
        .reduce((sum, deal) => sum + (parseFloat(deal.deal_value_c) || 0), 0) || 0;

      setStats({
        totalContacts,
        totalDeals,
        totalActivities,
        totalCompanies,
        recentContacts,
        recentDeals,
        recentActivities,
        recentCompanies,
        totalDealValue,
        wonDeals,
        wonDealValue
      });
    } catch (err) {
      console.error('Error fetching report data:', err?.response?.data?.message || err);
      setError('Failed to load report data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={fetchReportData} />
      </div>
    );
  }

  if (!stats || (stats.totalContacts === 0 && stats.totalDeals === 0 && 
      stats.totalActivities === 0 && stats.totalCompanies === 0)) {
    return (
      <div className="p-6">
        <Empty message="No data available for reports yet" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Reports & Analytics</h1>
          <p className="text-secondary-600 mt-1">Overview of your CRM data and metrics</p>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          trend={stats.recentContacts > 0 ? `+${stats.recentContacts} this month` : 'No new contacts'}
          icon="Users"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Total Deals"
value={stats.totalDeals}
          change={stats.recentDeals > 0 ? `+${stats.recentDeals} this month` : 'No new deals'}
          icon="TrendingUp"
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Total Activities"
          value={stats.totalActivities}
          trend={stats.recentActivities > 0 ? `+${stats.recentActivities} this month` : 'No new activities'}
          icon="Calendar"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Companies"
          value={stats.totalCompanies}
          trend={stats.recentCompanies > 0 ? `+${stats.recentCompanies} this month` : 'No new companies'}
          icon="Building2"
          gradient="from-orange-500 to-red-500"
        />
      </div>

      {/* Deal Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">Deal Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-secondary-600">Total Deal Value</p>
            <p className="text-2xl font-bold text-secondary-900">
              ${stats.totalDealValue.toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-secondary-600">Won Deals</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.wonDeals}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-secondary-600">Won Deal Value</p>
            <p className="text-2xl font-bold text-green-600">
              ${stats.wonDealValue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-6 border border-primary-100">
        <h2 className="text-xl font-semibold text-secondary-900 mb-4">30-Day Activity Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/70 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-secondary-600 mb-1">New Contacts</p>
            <p className="text-xl font-bold text-primary-600">{stats.recentContacts}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-secondary-600 mb-1">New Deals</p>
            <p className="text-xl font-bold text-primary-600">{stats.recentDeals}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-secondary-600 mb-1">New Activities</p>
            <p className="text-xl font-bold text-primary-600">{stats.recentActivities}</p>
          </div>
          <div className="bg-white/70 backdrop-blur rounded-lg p-4">
            <p className="text-sm text-secondary-600 mb-1">New Companies</p>
            <p className="text-xl font-bold text-primary-600">{stats.recentCompanies}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;